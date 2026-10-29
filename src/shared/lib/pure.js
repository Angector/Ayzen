/* ---------- Utils ---------- */
export function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]),
  );
}

/* ---------- Prompt filtering / sorting ---------- */
export function filterPrompts(prompts, filter) {
  const q = (filter.q ?? '').trim().toLowerCase();
  return prompts.filter(p => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.model && p.model !== filter.model) return false;
    if (!q) return true;
    const haystack = `${p.title} ${p.content} ${(p.tags ?? []).join(' ')}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function sortPrompts(prompts) {
  return [...prompts].sort((a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0));
}

export function uniqueValues(prompts, key) {
  return [...new Set(prompts.map(p => p[key]).filter(Boolean))].sort();
}

/* ---------- Prompt shape migration ---------- */
export function ensurePromptShape(p) {
  if (!p.template) p.template = p.content ?? '';
  if (!Array.isArray(p.variables)) {
    const re = /\{\{\s*([\w-]+)\s*\}\}/g;
    const seen = new Set();
    p.variables = [];
    let m;
    while ((m = re.exec(p.template)) !== null) {
      if (!seen.has(m[1])) { seen.add(m[1]); p.variables.push(m[1]); }
    }
  }
  return p;
}

/* ---------- Memory (phase 3) ---------- */
export function computeRating(faithfulness, taskCompletion) {
  const f = clamp(faithfulness);
  const t = clamp(taskCompletion);
  const overall = f && t ? (f + t) / 2 : 0;
  return {
    faithfulness: f,
    taskCompletion: t,
    overall: Math.round(overall * 10) / 10,
    ratedAt: new Date().toISOString(),
  };
}

function clamp(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.min(5, Math.max(0, Math.round(v)));
}

export function sortPromptsByMemory(prompts) {
  return [...prompts].sort((a, b) => {
    const ra = a.rating?.overall ?? 0;
    const rb = b.rating?.overall ?? 0;
    if (rb !== ra) return rb - ra;
    const ua = a.useCount ?? 0;
    const ub = b.useCount ?? 0;
    if (ub !== ua) return ub - ua;
    return new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0);
  });
}

export function topPrompts(prompts, limit = 5) {
  return sortPromptsByMemory(prompts)
    .filter(p => (p.rating?.overall ?? 0) >= 3 && (p.useCount ?? 0) > 0)
    .slice(0, limit);
}

export function stalePrompts(prompts, days = 30) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return prompts.filter(p => {
    const last = p.lastUsedAt ? new Date(p.lastUsedAt).getTime() : 0;
    return last < cutoff;
  });
}

/* ---------- Tasks / Projects (phase 2.5) ---------- */
export const TASK_STATUSES = ['backlog', 'doing', 'review', 'done'];
export const STATUS_LABELS = {
  backlog: 'Backlog', doing: 'Doing', review: 'Review', done: 'Done',
};

export function groupTasksByStatus(tasks) {
  const g = Object.fromEntries(TASK_STATUSES.map(s => [s, []]));
  tasks.forEach(t => (g[t.status] ?? g.backlog).push(t));
  TASK_STATUSES.forEach(s => g[s].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  return g;
}

export function projectProgress(tasks) {
  if (!tasks.length) return 0;
  const done = tasks.filter(t => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

export function tasksToMermaidFlowchart(tasks) {
  if (!tasks.length) return 'flowchart TD\n  empty["بدون وظیفه"]';
  const byParent = new Map();
  tasks.forEach(t => {
    const key = t.parentId ?? '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(t);
  });

  const lines = ['flowchart TD'];
  const nodeId = t => `t_${String(t.id).replace(/[^a-zA-Z0-9]/g, '_')}`;
  const label = t => `"${(t.title ?? '').replace(/"/g, "'")}"`;

  const walk = (parentKey) => {
    const children = byParent.get(parentKey) ?? [];
    children.forEach(t => {
      lines.push(`  ${nodeId(t)}[${label(t)}]`);
      if (parentKey !== '__root__') {
        const parent = tasks.find(p => p.id === parentKey);
        if (parent) lines.push(`  ${nodeId(parent)} --> ${nodeId(t)}`);
      }
      walk(t.id);
    });
  };
  walk('__root__');
  return lines.join('\n');
}

export function tasksToGanttRows(tasks) {
  return tasks
    .filter(t => t.start && t.end)
    .map(t => ({
      pID: t.id,
      pName: t.title,
      pStart: t.start,
      pEnd: t.end,
      pComp: t.status === 'done' ? 100 : t.status === 'review' ? 75 : t.status === 'doing' ? 40 : 0,
      pParent: t.parentId ?? 0,
      pGroup: tasks.some(x => x.parentId === t.id) ? 1 : 0,
      pMile: t.isMilestone ? 1 : 0,
      pClass: t.isMilestone ? 'gmilestone' : '',
    }));
}

export function tasksToMermaidTimeline(tasks) {
  const milestones = tasks.filter(t => t.isMilestone && t.end);
  if (!milestones.length) return 'timeline\n  title بدون نقطه عطف';
  const lines = ['timeline', '  title نقاط عطف پروژه'];
  milestones
    .sort((a, b) => new Date(a.end) - new Date(b.end))
    .forEach(m => lines.push(`  ${m.end.slice(0, 10)} : ${m.title}`));
  return lines.join('\n');
}

export function tasksToJsMindTree(project, tasks) {
  const byParent = new Map();
  tasks.forEach(t => {
    const key = t.parentId ?? '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(t);
  });

  const build = (parentKey) => (byParent.get(parentKey) ?? []).map(t => ({
    id: t.id,
    topic: t.title,
    children: build(t.id),
  }));

  return {
    meta: { name: project.name, author: 'Prompt Hub', version: '1.0' },
    format: 'node_tree',
    data: { id: project.id, topic: project.name, children: build('__root__') },
  };
}