import { openDB } from 'idb';

const DB_NAME = 'prompt-hub';
const DB_VERSION = 3;
const STORE_PROMPTS = 'prompts';
const STORE_PROJECTS = 'projects';
const STORE_TASKS = 'tasks';

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        /* نسخه ۱ — استخوان‌بندی فاز ۱ */
        if (oldVersion < 1) {
          if (!db.objectStoreNames.contains(STORE_PROMPTS)) {
            const store = db.createObjectStore(STORE_PROMPTS, { keyPath: 'id' });
            store.createIndex('by-category', 'category');
            store.createIndex('by-model', 'model');
            store.createIndex('by-updated', 'updatedAt');
          }
        }

        /* نسخه ۲ — حافظه فاز ۳ */
        if (oldVersion < 2) {
          const tx = db.transaction(STORE_PROMPTS, 'readwrite');
          const store = tx.objectStore(STORE_PROMPTS);

          if (!store.indexNames.contains('by-rating')) {
            store.createIndex('by-rating', 'rating.overall');
          }
          if (!store.indexNames.contains('by-useCount')) {
            store.createIndex('by-useCount', 'useCount');
          }

          migrateRecords(store);

          tx.oncomplete = () => console.info('[db] migrated to version 2');
        }

        /* نسخه ۳ — پروژه‌ها و وظایف فاز ۲.۵ */
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
            const ps = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
            ps.createIndex('by-updated', 'updatedAt');
          }
          if (!db.objectStoreNames.contains(STORE_TASKS)) {
            const ts = db.createObjectStore(STORE_TASKS, { keyPath: 'id' });
            ts.createIndex('by-project', 'projectId');
            ts.createIndex('by-status', 'status');
            ts.createIndex('by-parent', 'parentId');
            ts.createIndex('by-order', 'order');
          }
        }
      },
    });
  }
  return dbPromise;
}

function migrateRecords(store) {
  const req = store.openCursor();
  req.onsuccess = () => {
    const cursor = req.result;
    if (!cursor) return;
    const record = cursor.value;
    const patched = ensureMemoryShape(record);
    if (JSON.stringify(record) !== JSON.stringify(patched)) cursor.update(patched);
    cursor.continue();
  };
}

export function ensureMemoryShape(p) {
  return {
    ...p,
    useCount: Number.isFinite(p.useCount) ? p.useCount : 0,
    lastUsedAt: p.lastUsedAt ?? null,
    rating: normalizeRating(p.rating),
  };
}

function normalizeRating(rating) {
  if (!rating || typeof rating !== 'object') {
    return { faithfulness: 0, taskCompletion: 0, overall: 0, ratedAt: null };
  }
  const faithfulness = clamp(rating.faithfulness);
  const taskCompletion = clamp(rating.taskCompletion);
  const overall = faithfulness && taskCompletion ? (faithfulness + taskCompletion) / 2 : 0;
  return {
    faithfulness,
    taskCompletion,
    overall: Math.round(overall * 10) / 10,
    ratedAt: rating.ratedAt ?? null,
  };
}

function clamp(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.min(5, Math.max(0, Math.round(v)));
}

/* ---------- Prompts CRUD ---------- */
export async function getAllPrompts() {
  return (await getDB()).getAll(STORE_PROMPTS);
}

export async function getPrompt(id) {
  return (await getDB()).get(STORE_PROMPTS, id);
}

export async function putPrompt(prompt) {
  const now = new Date().toISOString();
  const existing = await getPrompt(prompt.id);
  const record = {
    ...prompt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    version: (existing?.version ?? 0) + 1,
    history: existing ? [...(existing.history ?? []), snapshotOf(existing)].slice(-10) : [],
  };
  await (await getDB()).put(STORE_PROMPTS, record);
  return record;
}

export async function deletePrompt(id) {
  await (await getDB()).delete(STORE_PROMPTS, id);
}

export async function bulkPutPrompts(prompts) {
  const tx = (await getDB()).transaction(STORE_PROMPTS, 'readwrite');
  await Promise.all(prompts.map(p => tx.store.put(p)));
  await tx.done;
}

function snapshotOf(p) {
  return {
    title: p.title,
    content: p.content,
    category: p.category,
    model: p.model,
    savedAt: new Date().toISOString(),
  };
}

/* ---------- Export / Import ---------- */
export async function exportPrompts() {
  const prompts = await getAllPrompts();
  return { version: '2026.10', exportedAt: new Date().toISOString(), prompts };
}

export async function importPrompts(payload) {
  if (!payload || !Array.isArray(payload.prompts)) {
    throw new Error('فرمت فایل معتبر نیست');
  }
  const existing = await getAllPrompts();
  const byId = new Map(existing.map(p => [p.id, p]));
  for (const p of payload.prompts) {
    if (!p.id) p.id = `u-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const prev = byId.get(p.id);
    if (!prev || new Date(p.updatedAt ?? 0) >= new Date(prev.updatedAt ?? 0)) {
      await putPrompt(p);
    }
  }
}

/* ---------- Projects CRUD ---------- */
export async function getAllProjects() {
  return (await getDB()).getAll(STORE_PROJECTS);
}

export async function putProject(project) {
  const now = new Date().toISOString();
  const record = { ...project, updatedAt: now, createdAt: project.createdAt ?? now };
  await (await getDB()).put(STORE_PROJECTS, record);
  return record;
}

export async function deleteProject(id) {
  const db = await getDB();
  const tasks = await db.getAllFromIndex(STORE_TASKS, 'by-project', id);
  const tx = db.transaction([STORE_PROJECTS, STORE_TASKS], 'readwrite');
  await tx.objectStore(STORE_PROJECTS).delete(id);
  await Promise.all(tasks.map(t => tx.objectStore(STORE_TASKS).delete(t.id)));
  await tx.done;
}

/* ---------- Tasks CRUD ---------- */
export async function getTasksByProject(projectId) {
  return (await getDB()).getAllFromIndex(STORE_TASKS, 'by-project', projectId);
}

export async function putTask(task) {
  const now = new Date().toISOString();
  const record = {
    ...task,
    updatedAt: now,
    createdAt: task.createdAt ?? now,
    order: task.order ?? Date.now(),
  };
  await (await getDB()).put(STORE_TASKS, record);
  return record;
}

export async function deleteTask(id) {
  await (await getDB()).delete(STORE_TASKS, id);
}