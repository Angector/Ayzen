import { registerPlugin } from './registry.js';
import { store } from '../shared/lib/store.js';
import { escapeHtml } from '../shared/lib/pure.js';

export function stabilityScore(responses) {
  if (responses.length < 2) return 1;
  const sets = responses.map(r => new Set(String(r).toLowerCase().split(/\s+/).filter(Boolean)));
  let overlap = 0, pairs = 0;
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const inter = [...sets[i]].filter(w => sets[j].has(w)).length;
      overlap += inter / Math.max(sets[i].size, sets[j].size, 1);
      pairs++;
    }
  }
  return pairs ? overlap / pairs : 1;
}

registerPlugin('self-consistency', {
  id: 'self-consistency',
  title: 'خودسازگاری',
  icon: '⚖️',
  mount(container) {
    const render = () => {
      const prompts = store.get().prompts ?? [];
      container.innerHTML = `
        <style>
          select { font:inherit; padding:8px 12px; border-radius:8px;
                   background:var(--color-bg); color:var(--color-text-default);
                   border:1px solid var(--color-border); width:100%; margin-bottom:12px;
                   box-sizing:border-box; }
          select:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          textarea { font:inherit; padding:8px 12px; width:100%; box-sizing:border-box;
                     background:var(--color-bg); color:var(--color-text-default);
                     border:1px solid var(--color-border); border-radius:8px;
                     min-height:80px; resize:vertical; font-size:.85rem;
                     font-family:inherit; }
          textarea:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:8px; }
          @media (max-width:700px) { .grid { grid-template-columns:1fr; } }
          .pane { background:var(--color-surface); border:1px solid var(--color-border);
                  border-radius:8px; padding:10px; font-size:.8rem; color:var(--color-text-muted);
                  white-space:pre-wrap; word-break:break-word; }
          .pane h5 { margin:0 0 6px; font-size:.75rem; color:var(--color-text-subtle); font-weight:500; }
          button { margin-top:10px; font:inherit; padding:8px 14px; border-radius:8px;
                   border:none; background:var(--color-brand); color:#fff; cursor:pointer; }
          button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          .score { margin-top:10px; font-size:.85rem; color:var(--color-text-muted); }
          label { font-size:.8rem; color:var(--color-text-muted); display:block; margin-bottom:4px; }
        </style>
        <select id="sel">
          ${prompts.map(p => `<option value="${p.id}">${escapeHtml(p.title)}</option>`).join('')}
        </select>
        <label>پاسخ‌ها را با خط جدید (---) جدا کن:</label>
        <textarea id="resp" placeholder="پاسخ اول
---
پاسخ دوم
---
پاسخ سوم"></textarea>
        <button id="eval">⚖️ محاسبه پایداری</button>
        <div id="out"></div>
      `;

      container.querySelector('#eval').addEventListener('click', () => {
        const raw = container.querySelector('#resp').value;
        const parts = raw.split(/^---+$/m).map(s => s.trim()).filter(Boolean);
        if (parts.length < 2) {
          container.querySelector('#out').innerHTML = '<p class="score">حداقل دو پاسخ لازم است.</p>';
          return;
        }
        const score = stabilityScore(parts);
        container.querySelector('#out').innerHTML = `
          <div class="grid">
            ${parts.map((r, i) => `<div class="pane"><h5>نسخه ${i + 1}</h5>${escapeHtml(r)}</div>`).join('')}
          </div>
          <p class="score">پایداری: <b>${(score * 100).toFixed(0)}٪</b></p>
        `;
      });
    };
    render();
  },
  unmount() {},
});