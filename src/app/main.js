import { store } from '../shared/lib/store.js';
import * as db from '../shared/lib/db.js';
import { ensureMemoryShape } from '../shared/lib/db.js';
import { ensurePromptShape } from '../shared/lib/pure.js';
import { SEED_PROMPTS } from '../seed/prompts.seed.js';
import { mountRouter } from './router.js';
import { track, flush } from '../shared/analytics/analytics.client.js';

/* UI پایه */
import '../shared/ui/app-button.js';
import '../shared/ui/app-badge.js';
import '../shared/ui/app-dialog.js';
import '../shared/ui/app-card.js';
import '../shared/ui/app-update-banner.js';
import '../shared/ui/glass-surface.js';
import '../shared/ui/empty-state.js';

/* Featureها */
import '../features/prompt-library/index.js';
import '../features/prompt-composer/index.js';
import '../features/prompt-memory/index.js';
import '../features/project-cockpit/index.js';
import '../features/knowledge-base/index.js';
import '../features/creativity-lab/index.js';
import '../features/insights/index.js';

/* PWA */
import { registerServiceWorker, watchConnectivity } from '../shared/pwa/pwa.register.js';
import { setupInstallPrompt, isStandalone } from '../shared/pwa/pwa.install.js';

async function bootstrap() {
  /* ۱. بارگذاری پرامپت‌ها با مهاجرت */
  let prompts = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));

  /* ۲. Seed در اولین اجرا */
  if (prompts.length === 0) {
    const now = new Date().toISOString();
    const seeded = SEED_PROMPTS.map(p =>
      ensureMemoryShape(ensurePromptShape({
        ...p,
        createdAt: now,
        updatedAt: now,
        version: 1,
        history: [],
      })),
    );
    await db.bulkPutPrompts(seeded);
    prompts = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));
  }

  /* ۳. بارگذاری پروژه‌ها و وظایف */
  const projects = await db.getAllProjects();
  const tasksByProject = {};
  for (const p of projects) {
    tasksByProject[p.id] = await db.getTasksByProject(p.id);
  }

  /* ۴. پر کردن Store */
  store.set({
    prompts,
    projects,
    tasksByProject,
    loading: false,
    view: 'library',
  });

  /* ۵. سوار کردن روتر */
  const root = document.getElementById('app');
  mountRouter(root);
  root.innerHTML = '<library-view></library-view>';

  /* ۶. اتصال رویدادها به DB — Library */
  root.addEventListener('prompt-copied', async (e) => {
    const { id } = e.detail;
    const prompt = await db.getPrompt(id);
    if (!prompt) return;
    await db.putPrompt({
      ...ensureMemoryShape(prompt),
      useCount: (prompt.useCount ?? 0) + 1,
      lastUsedAt: new Date().toISOString(),
    });
    const fresh = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));
    store.set({ prompts: fresh });
    track('prompt.copy', { promptId: id });
  });

  root.addEventListener('prompt-delete', async (e) => {
    await db.deletePrompt(e.detail.id);
    const fresh = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));
    store.set({ prompts: fresh });
    showToast('پرامپت حذف شد');
  });

  root.addEventListener('prompt-edit', (e) => {
    showToast('ویرایش در نسخه‌ی بعدی — فعلاً از Composer استفاده کن');
  });

  root.addEventListener('prompt-save', async (e) => {
    const data = {
      id: `u-${Date.now()}`,
      ...e.detail,
      builtin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      history: [],
    };
    await db.putPrompt(ensureMemoryShape(ensurePromptShape(data)));
    const fresh = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));
    store.set({ prompts: fresh, view: 'library' });
    showToast('پرامپت به کتابخانه اضافه شد ✅');
    track('prompt.create', { model: data.model, category: data.category });
  });

  root.addEventListener('prompt-rating', async (e) => {
    const { promptId, rating } = e.detail;
    const prompt = await db.getPrompt(promptId);
    if (!prompt) return;
    await db.putPrompt({
      ...ensureMemoryShape(prompt),
      rating: {
        faithfulness: rating.faithfulness,
        taskCompletion: rating.taskCompletion,
        overall: rating.overall,
        ratedAt: new Date().toISOString(),
      },
    });
    const fresh = (await db.getAllPrompts()).map(p => ensureMemoryShape(ensurePromptShape(p)));
    store.set({ prompts: fresh });
    showToast('امتیاز ثبت شد ✅');
  });

  /* ۷. ناوبری */
  root.addEventListener('navigate', (e) => {
    if (e.detail?.view) store.set({ view: e.detail.view });
  });

  /* ۸. توست */
  root.addEventListener('toast', (e) => {
    showToast(e.detail.message, e.detail.type);
  });

  /* ۹. PWA */
  if (
    location.protocol === 'https:' ||
    ['localhost', '127.0.0.1'].includes(location.hostname)
  ) {
    const banner = document.createElement('app-update-banner');
    banner.setAttribute('hidden', '');
    document.body.appendChild(banner);

    try {
      await registerServiceWorker({
        onUpdateAvailable: (apply) => {
          banner.onApply = apply;
          banner.removeAttribute('hidden');
        },
      });
    } catch (err) {
      console.warn('[pwa] registration failed', err);
    }

    setupInstallPrompt({
      onAvailable: (install) => {
        if (!isStandalone()) showInstallButton(install);
      },
    });

    watchConnectivity((online) => {
      if (!online) showToast('آفلاین هستی — داده‌ها هنوز در دسترس‌اند', 'warning');
    });
  }

  /* ۱۰. flush آنالیتیکس هنگام بستن */
  window.addEventListener('beforeunload', flush);
}

function showToast(message, type = 'success') {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${type === 'error' ? 'var(--color-danger)' : type === 'warning' ? 'var(--color-warning)' : 'var(--color-brand)'};
    color: #fff; padding: 10px 20px; border-radius: 999px;
    font-size: .85rem; z-index: 1000; animation: fadeIn 150ms ease;
    max-width: 90vw; text-align: center;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function showInstallButton(installFn) {
  const btn = document.createElement('button');
  btn.textContent = '📲 نصب اپ';
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    padding: 10px 18px; border-radius: 999px;
    background: var(--color-brand); color: #fff;
    border: none; cursor: pointer; font: inherit; font-size: .85rem;
    box-shadow: 0 4px 16px rgba(0,0,0,.35); z-index: 900;
  `;
  btn.addEventListener('click', async () => {
    const ok = await installFn();
    if (ok) btn.remove();
  });
  document.body.appendChild(btn);
}

bootstrap().catch(err => {
  console.error(err);
  document.getElementById('app').innerHTML =
    '<p style="padding:40px;text-align:center;color:var(--color-danger)">خطا در بارگذاری. کنسول را ببین.</p>';
});