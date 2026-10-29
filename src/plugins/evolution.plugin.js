import { registerPlugin } from './registry.js';
import { store } from '../shared/lib/store.js';
import { escapeHtml } from '../shared/lib/pure.js';

export function wordDiff(a, b) {
  const wa = String(a).split(/\s+/).filter(Boolean);
  const wb = String(b).split(/\s+/).filter(Boolean);
  const setB = new Set(wb);
  const setA = new Set(wa);
  return {
    removed: wa.filter(w => !setB.has(w)),
    added: wb.filter(w => !setA.has(w)),
  };
}

registerPlugin('evolution', {
  id: 'evolution',
  title: 'تخته‌ی تکامل',
  icon: '🧬',
  mount(container) {
    let idA = null;

    const render = () => {
      const prompts = store.get().prompts ?? [];
      const withHistory = prompts.filter(p => (p.history?.length ?? 0) > 0);

      if (!withHistory.length) {
        container.innerHTML = `<p style="color:var(--color-text-subtle);font-size:.85rem">
          هنوز پرامپتی با نسخه‌ی قبلی وجود ندارد. یک پرامپت را ویرایش کن تا تاریخچه ساخته شود.
        </p>`;
        return;
      }

      if (!idA) idA = withHistory[0].id;
      const pA = prompts.find(p => p.id === idA);
      const versionsA = [
        { label: 'نسخه فعلی', content: pA.content, rating: pA.rating?.overall ?? 0 },
        ...(pA.history ?? []).map((h, i) => ({
          label: `نسخه قبلی ${i + 1}`, content: h.content, rating: 0,
        })),
      ];

      container.innerHTML = `
        <style>
          .row { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
          select { font:inherit; padding:8px; border-radius:8px;
                   background:var(--color-bg); color:var(--color-text-default);
                   border:1px solid var(--color-border); }
          select:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
          @media (max-width:700px) { .grid { grid-template-columns:1fr; } }
          .pane { background:var(--color-surface); border:1px solid var(--color-border);
                  border-radius:8px; padding:10px; }
          .pane h4 { margin:0 0 8px; font-size:.85rem; color:var(--color-text-muted); font-weight:500; }
          pre { white-space:pre-wrap; word-break:break-word; font-size:.82rem; margin:0;
                font-family:var(--p-font-mono); color:var(--color-text-muted);
                unicode-bidi:plaintext; }
          .added { color:var(--color-success); }
          .removed { color:var(--color-danger); text-decoration:line-through; }
          .diff { margin-top:12px; padding:10px; background:var(--color-bg);
                  border-radius:8px; font-size:.8rem; color:var(--color-text-muted); }
        </style>
        <div class="row">
          <select id="selA">
            ${withHistory.map(p => `<option value="${p.id}" ${p.id === idA ? 'selected' : ''}>${escapeHtml(p.title)}</option>`).join('')}
          </select>
        </div>
        ${pA ? `
          <div class="row">
            <select id="verA">
              ${versionsA.map((v, i) => `<option value="${i}">${v.label}</option>`).join('')}
            </select>
            <select id="verB">
              ${versionsA.map((v, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="grid">
            <div class="pane"><h4>نسخه A</h4><pre id="paneA">${escapeHtml(versionsA[0].content)}</pre></div>
            <div class="pane"><h4>نسخه B</h4><pre id="paneB">${escapeHtml(versionsA[Math.min(1, versionsA.length - 1)].content)}</pre></div>
          </div>
          <div class="diff" id="diff"></div>
        ` : ''}
      `;

      const updateDiff = () => {
        const iA = Number(container.querySelector('#verA')?.value ?? 0);
        const iB = Number(container.querySelector('#verB')?.value ?? 1);
        const a = versionsA[iA]?.content ?? '';
        const b = versionsA[iB]?.content ?? '';
        container.querySelector('#paneA').textContent = a;
        container.querySelector('#paneB').textContent = b;
        const { added, removed } = wordDiff(a, b);
        container.querySelector('#diff').innerHTML = `
          <div><b>افزوده‌شده:</b> <span class="added">${added.map(escapeHtml).join(' ') || '—'}</span></div>
          <div style="margin-top:6px"><b>حذف‌شده:</b> <span class="removed">${removed.map(escapeHtml).join(' ') || '—'}</span></div>
        `;
      };

      container.querySelector('#selA')?.addEventListener('change', (e) => { idA = e.target.value; render(); });
      container.querySelector('#verA')?.addEventListener('change', updateDiff);
      container.querySelector('#verB')?.addEventListener('change', updateDiff);
      updateDiff();
    };

    render();
  },
  unmount() {},
});