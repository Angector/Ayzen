import { registerPlugin } from './registry.js';
import { escapeHtml } from '../shared/lib/pure.js';

const KEY = 'pcc_characters';

export function buildCharacterBlock(c) {
  return `Character: ${c.tag}
Identity: ${c.age}, ${c.appearance}, ${c.wardrobe}
Constraint: ${c.constraints || 'keep appearance consistent across shots'}`;
}

function loadCharacters() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); }
  catch { return []; }
}

function saveCharacters(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

registerPlugin('character', {
  id: 'character',
  title: 'هویت ثابت کاراکتر',
  icon: '🧑‍🎤',
  mount(container) {
    const render = () => {
      const chars = loadCharacters();
      container.innerHTML = `
        <style>
          input, textarea { font:inherit; padding:8px 12px; border-radius:8px;
                            border:1px solid var(--color-border); background:var(--color-bg);
                            color:var(--color-text-default); width:100%; box-sizing:border-box; }
          input:focus-visible, textarea:focus-visible {
            outline:2px solid var(--color-brand); outline-offset:1px;
          }
          textarea { resize:vertical; min-height:44px; font-family:inherit; }
          .form { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
          .actions { display:flex; gap:8px; }
          button { font:inherit; padding:8px 14px; border-radius:8px;
                   border:1px solid var(--color-border); background:transparent;
                   color:var(--color-text-default); cursor:pointer; }
          button:hover { border-color:var(--color-brand); }
          button.primary { background:var(--color-brand); color:#fff; border:none; }
          button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          .card { background:var(--color-surface); border:1px solid var(--color-border);
                  border-radius:8px; padding:12px; margin-bottom:8px; font-size:.85rem; }
          .card pre { margin:8px 0 0; white-space:pre-wrap; font-size:.8rem;
                      color:var(--color-text-subtle); background:var(--color-bg);
                      padding:8px; border-radius:6px; font-family:var(--p-font-mono);
                      unicode-bidi:plaintext; }
          .empty { color:var(--color-text-subtle); font-size:.85rem; text-align:center; padding:20px; }
        </style>
        <div class="form">
          <input id="tag" placeholder="برچسب (مثلاً Character A)">
          <input id="age" placeholder="سن">
          <input id="appearance" placeholder="ظاهر (مو، چشم، قد)">
          <input id="wardrobe" placeholder="لباس">
          <textarea id="constraints" placeholder="محدودیت‌ها (اختیاری)"></textarea>
          <div class="actions">
            <button class="primary" id="save">+ ذخیره کاراکتر</button>
          </div>
        </div>
        <div id="list">
          ${chars.length === 0
            ? '<p class="empty">هنوز کاراکتری ثبت نشده.</p>'
            : chars.map((c, i) => `
                <div class="card">
                  <b>${escapeHtml(c.tag)}</b> — ${escapeHtml(c.age)}, ${escapeHtml(c.appearance)}
                  <pre>${escapeHtml(buildCharacterBlock(c))}</pre>
                  <div class="actions" style="margin-top:8px">
                    <button data-copy="${i}">📋 کپی بلوک</button>
                    <button data-del="${i}" style="color:var(--color-danger)">🗑️ حذف</button>
                  </div>
                </div>
              `).join('')}
        </div>
      `;

      container.querySelector('#save').addEventListener('click', () => {
        const c = {
          tag: container.querySelector('#tag').value.trim(),
          age: container.querySelector('#age').value.trim(),
          appearance: container.querySelector('#appearance').value.trim(),
          wardrobe: container.querySelector('#wardrobe').value.trim(),
          constraints: container.querySelector('#constraints').value.trim(),
        };
        if (!c.tag || !c.appearance) { alert('برچسب و ظاهر الزامی است'); return; }
        const arr = loadCharacters();
        arr.push(c);
        saveCharacters(arr);
        render();
      });

      container.querySelectorAll('[data-copy]').forEach(b => {
        b.addEventListener('click', async () => {
          const i = Number(b.dataset.copy);
          await navigator.clipboard.writeText(buildCharacterBlock(loadCharacters()[i]));
          b.textContent = '✅ کپی شد';
          setTimeout(() => (b.textContent = '📋 کپی بلوک'), 1200);
        });
      });

      container.querySelectorAll('[data-del]').forEach(b => {
        b.addEventListener('click', () => {
          const i = Number(b.dataset.del);
          if (!confirm('حذف شود؟')) return;
          const arr = loadCharacters();
          arr.splice(i, 1);
          saveCharacters(arr);
          render();
        });
      });
    };

    render();
  },
  unmount() {},
});