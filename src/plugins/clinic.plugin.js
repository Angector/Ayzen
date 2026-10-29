import { registerPlugin } from './registry.js';
import { CLINIC, TECHNIQUES } from '../features/knowledge-base/knowledge.data.js';
import { escapeHtml } from '../shared/lib/pure.js';

const SYMPTOM_TO_TECHNIQUE = {
  hallucination: 'output-contract',
  refusal: 'instruction-hierarchy',
  'format-drift': 'output-contract',
};

registerPlugin('clinic', {
  id: 'clinic',
  title: 'کلینیک پرامپت',
  icon: '🩺',
  mount(container) {
    let selected = null;

    const render = () => {
      container.innerHTML = `
        <style>
          .sym { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
          .btn { padding:8px 14px; border-radius:999px; cursor:pointer;
                 border:1px solid var(--color-border); background:transparent;
                 color:var(--color-text-muted); font:inherit; font-size:.85rem; }
          .btn.active { background:var(--color-warning); color:#000; border-color:transparent; }
          .btn:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          ul { padding-right:18px; margin:0; font-size:.85rem; color:var(--color-text-muted); }
          li { margin-bottom:6px; line-height:1.7; }
          .tech { margin-top:12px; padding:10px; background:var(--color-bg);
                  border-radius:8px; border-right:3px solid var(--color-brand); font-size:.85rem;
                  color:var(--color-text-muted); }
          .tech b { color:var(--color-text-default); }
        </style>
        <div class="sym">
          ${CLINIC.map(c => `<button class="btn ${selected === c.id ? 'active' : ''}" data-id="${c.id}">${escapeHtml(c.symptom)}</button>`).join('')}
        </div>
        ${selected ? renderCase(selected) : '<p style="color:var(--color-text-subtle);font-size:.85rem">یک علامت را انتخاب کن.</p>'}
      `;

      container.querySelectorAll('.btn').forEach(b => {
        b.addEventListener('click', () => { selected = b.dataset.id; render(); });
      });
    };

    const renderCase = (id) => {
      const c = CLINIC.find(x => x.id === id);
      if (!c) return '';
      const techId = SYMPTOM_TO_TECHNIQUE[id];
      const tech = TECHNIQUES.find(t => t.id === techId);
      return `
        <h4 style="margin:0 0 8px;font-size:.95rem">چک‌لیست عیب‌یابی</h4>
        <ul>${c.checklists.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        ${tech ? `
          <div class="tech">
            <b>تکنیک پیشنهادی:</b> ${escapeHtml(tech.title)}<br>
            ${escapeHtml(tech.how)}
          </div>
        ` : ''}
      `;
    };

    render();
  },
  unmount() {},
});