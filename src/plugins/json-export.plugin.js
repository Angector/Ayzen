import { registerPlugin } from './registry.js';
import { store } from '../shared/lib/store.js';
import { extractVariables } from '../shared/lib/template.js';
import { escapeHtml } from '../shared/lib/pure.js';

export function promptToJson(prompt) {
  const vars = prompt.variables?.length
    ? prompt.variables
    : extractVariables(prompt.template ?? prompt.content ?? '');
  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    model: prompt.model,
    structured: Object.fromEntries(vars.map(v => [v, ''])),
    raw: prompt.content,
    template: prompt.template ?? prompt.content,
  };
}

registerPlugin('json-export', {
  id: 'json-export',
  title: 'Prompt to JSON',
  icon: '🔍',
  mount(container) {
    const render = () => {
      const prompts = store.get().prompts ?? [];
      if (!prompts.length) {
        container.innerHTML = '<p style="color:var(--color-text-subtle)">پرامپتی برای تبدیل وجود ندارد.</p>';
        return;
      }
      const selected = container.querySelector('#sel')?.value ?? prompts[0].id;
      const p = prompts.find(x => x.id === selected) ?? prompts[0];
      const json = JSON.stringify(promptToJson(p), null, 2);

      container.innerHTML = `
        <style>
          select { font:inherit; padding:8px 12px; border-radius:8px;
                   background:var(--color-bg); color:var(--color-text-default);
                   border:1px solid var(--color-border); margin-bottom:12px; width:100%;
                   box-sizing:border-box; }
          select:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          pre { white-space:pre-wrap; word-break:break-word; font-size:.82rem;
                padding:12px; background:var(--color-bg);
                border:1px solid var(--color-border); border-radius:8px; margin:0;
                font-family:var(--p-font-mono); color:var(--color-text-muted);
                unicode-bidi:plaintext; }
          button { margin-top:8px; font:inherit; padding:8px 14px; border-radius:8px;
                   border:none; background:var(--color-brand); color:#fff; cursor:pointer; }
          button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
        </style>
        <select id="sel">
          ${prompts.map(x => `<option value="${x.id}" ${x.id === selected ? 'selected' : ''}>${escapeHtml(x.title)}</option>`).join('')}
        </select>
        <pre>${escapeHtml(json)}</pre>
        <button id="copy">📋 کپی JSON</button>
      `;

      container.querySelector('#sel').addEventListener('change', render);
      container.querySelector('#copy').addEventListener('click', async () => {
        await navigator.clipboard.writeText(json);
        const btn = container.querySelector('#copy');
        btn.textContent = '✅ کپی شد';
        setTimeout(() => (btn.textContent = '📋 کپی JSON'), 1200);
      });
    };
    render();
  },
  unmount() {},
});