import { registerPlugin } from './registry.js';
import { store } from '../shared/lib/store.js';
import { escapeHtml } from '../shared/lib/pure.js';

export function buildVerificationPrompt(originalPrompt, originalResponse) {
  return `پاسخ قبلی تو به این پرامپت:
"${originalPrompt}"

پاسخ قبلی: "${originalResponse}"

حالا پاسخ قبلی خودت را نقد کن:
۱. خطاهای واقعی
۲. فرض‌های نادرست
۳. نقاط ضعف
۴. نسخه‌ی اصلاح‌شده`;
}

registerPlugin('chain-verify', {
  id: 'chain-verify',
  title: 'زنجیره راستی‌آزمایی',
  icon: '🔗',
  mount(container) {
    const render = () => {
      const prompts = store.get().prompts ?? [];
      container.innerHTML = `
        <style>
          select { font:inherit; padding:8px 12px; border-radius:8px;
                   background:var(--color-bg); color:var(--color-text-default);
                   border:1px solid var(--color-border); width:100%; margin-bottom:10px;
                   box-sizing:border-box; }
          select:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          textarea { font:inherit; padding:8px 12px; width:100%; box-sizing:border-box;
                     background:var(--color-bg); color:var(--color-text-default);
                     border:1px solid var(--color-border); border-radius:8px;
                     min-height:60px; resize:vertical; font-size:.85rem;
                     font-family:inherit; }
          textarea:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          label { font-size:.8rem; color:var(--color-text-muted); display:block; margin-bottom:4px; }
          button { margin-top:10px; font:inherit; padding:8px 14px; border-radius:8px;
                   border:none; background:var(--color-brand); color:#fff; cursor:pointer; }
          button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          pre { white-space:pre-wrap; word-break:break-word; font-size:.82rem;
                padding:12px; background:var(--color-bg);
                border:1px solid var(--color-border); border-radius:8px; margin-top:10px;
                font-family:var(--p-font-mono); color:var(--color-text-muted);
                unicode-bidi:plaintext; }
        </style>
        <label>پرامپت اصلی</label>
        <select id="sel">
          ${prompts.map(p => `<option value="${p.id}">${escapeHtml(p.title)}</option>`).join('')}
        </select>
        <label>پاسخ مدل به آن پرامپت</label>
        <textarea id="resp" placeholder="پاسخ مدل را اینجا بچسبان..."></textarea>
        <button id="gen">🔗 تولید پرامپت نقد</button>
        <div id="out"></div>
      `;

      container.querySelector('#gen').addEventListener('click', () => {
        const id = container.querySelector('#sel').value;
        const p = prompts.find(x => x.id === id);
        const resp = container.querySelector('#resp').value.trim();
        if (!p || !resp) { alert('پرامپت و پاسخ را پر کن'); return; }
        const verify = buildVerificationPrompt(p.content, resp);
        container.querySelector('#out').innerHTML = `
          <pre>${escapeHtml(verify)}</pre>
          <button id="copy">📋 کپی پرامپت نقد</button>
        `;
        container.querySelector('#copy').addEventListener('click', async () => {
          await navigator.clipboard.writeText(verify);
          container.querySelector('#copy').textContent = '✅ کپی شد';
        });
      });
    };
    render();
  },
  unmount() {},
});