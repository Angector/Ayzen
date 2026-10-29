import { registerPlugin } from './registry.js';

const KEY = 'pcc_weekly_reminder';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function shouldShowReminder() {
  const last = Number(localStorage.getItem(KEY) ?? 0);
  return Date.now() - last > WEEK_MS;
}

export function markShown() {
  localStorage.setItem(KEY, String(Date.now()));
}

registerPlugin('weekly-reminder', {
  id: 'weekly-reminder',
  title: 'یادآوری هفتگی',
  icon: '🔔',
  mount(container) {
    if (!shouldShowReminder()) {
      container.innerHTML = '<p style="color:var(--color-text-subtle);font-size:.85rem">این هفته یادآوری نشان داده شد.</p>';
      return;
    }
    container.innerHTML = `
      <div style="padding:16px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px">
        <p style="margin:0 0 10px;font-size:.9rem;color:var(--color-text-muted)">این هفته یک نگاه به پروژه‌هایت بینداز.</p>
        <button id="dismiss" style="padding:6px 14px;border-radius:8px;border:none;background:var(--color-brand);color:#fff;cursor:pointer;font:inherit">باشه</button>
      </div>
    `;
    container.querySelector('#dismiss').addEventListener('click', () => {
      markShown();
      container.innerHTML = '<p style="color:var(--color-text-subtle);font-size:.85rem">یادآوری ثبت شد.</p>';
    });
  },
  unmount() {},
});