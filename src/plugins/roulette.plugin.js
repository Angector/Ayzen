import { registerPlugin } from './registry.js';
import { KEYWORD_BANK } from '../features/knowledge-base/knowledge.data.js';

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWithSeed(arr, seed) {
  if (!arr?.length) return '';
  const rng = mulberry32(seed);
  return arr[Math.floor(rng() * arr.length)];
}

export function combinePrompt({ subject, seed, locked = {} }) {
  const s = Number.isFinite(seed) ? seed : Math.floor(Math.random() * 1e9);
  const lighting    = locked.lighting    ?? pickWithSeed(KEYWORD_BANK.lighting.words,    s + 1);
  const composition = locked.composition ?? pickWithSeed(KEYWORD_BANK.composition.words, s + 2);
  const style       = locked.style       ?? pickWithSeed(KEYWORD_BANK.style.words,       s + 3);
  return {
    seed: s,
    text: `${subject}, ${lighting}, ${composition}, ${style}`,
    parts: { subject, lighting, composition, style },
  };
}

registerPlugin('roulette', {
  id: 'roulette',
  title: 'ماشین ترکیب تصادفی',
  icon: '🎲',
  mount(container) {
    let subject = '';
    let current = null;
    let locked = {};
    const history = [];

    const render = () => {
      container.innerHTML = `
        <style>
          .wrap { display:flex; flex-direction:column; gap:12px; }
          input { font:inherit; padding:8px 12px; border-radius:8px;
                  border:1px solid var(--color-border); background:var(--color-bg);
                  color:var(--color-text-default); }
          input:focus-visible { outline:2px solid var(--color-brand); outline-offset:1px; }
          .locks { display:flex; gap:8px; flex-wrap:wrap; }
          .lock { font-size:.8rem; padding:4px 12px; border-radius:999px;
                  border:1px solid var(--color-border); cursor:pointer;
                  background:transparent; color:var(--color-text-muted); }
          .lock.on { background:var(--color-brand); color:#fff; border-color:transparent; }
          .lock:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          .actions { display:flex; gap:8px; }
          button { font:inherit; padding:8px 14px; border-radius:8px;
                   border:1px solid var(--color-border); background:transparent;
                   color:var(--color-text-default); cursor:pointer; }
          button.primary { background:var(--color-brand); color:#fff; border:none; }
          button:hover:not(.primary) { border-color:var(--color-brand); }
          button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
          pre { white-space:pre-wrap; word-break:break-word; font-size:.85rem;
                padding:10px; background:var(--color-bg);
                border:1px solid var(--color-border); border-radius:8px; margin:0;
                font-family:var(--p-font-mono); color:var(--color-text-muted);
                unicode-bidi:plaintext; }
          .history { font-size:.8rem; color:var(--color-text-subtle); }
          .h-item { padding:4px 8px; border-bottom:1px solid var(--color-border); }
        </style>
        <div class="wrap">
          <input id="subject" placeholder="سوژه (مثلاً: زن با کاردیگان کرم)" value="${subject.replace(/"/g, '&quot;')}">
          ${current ? `
            <div class="locks">
              ${['lighting', 'composition', 'style'].map(k => `
                <button class="lock ${locked[k] ? 'on' : ''}" data-k="${k}">
                  ${locked[k] ? '🔒' : '🔓'} ${k === 'lighting' ? 'نور' : k === 'composition' ? 'ترکیب' : 'سبک'}
                </button>
              `).join('')}
            </div>
          ` : ''}
          <div class="actions">
            <button class="primary" id="spin">🎲 بچرخان</button>
            ${current ? '<button id="copy">📋 کپی</button>' : ''}
          </div>
          ${current ? `<pre>${current.text.replace(/</g, '&lt;')}</pre>` : ''}
          ${history.length ? `
            <div class="history">
              <b>تاریخچه (۵ اخیر):</b>
              ${history.slice(-5).reverse().map(h => `<div class="h-item">${h.text.replace(/</g, '&lt;')}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      `;

      const input = container.querySelector('#subject');
      input.addEventListener('input', (e) => { subject = e.target.value; });

      container.querySelectorAll('.lock').forEach(el => {
        el.addEventListener('click', () => {
          const k = el.dataset.k;
          if (locked[k]) delete locked[k];
          else locked[k] = current.parts[k];
          render();
        });
      });

      container.querySelector('#spin')?.addEventListener('click', () => {
        if (!subject.trim()) { alert('سوژه را وارد کن'); return; }
        current = combinePrompt({ subject: subject.trim(), locked });
        history.push(current);
        render();
      });

      container.querySelector('#copy')?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(current.text);
        const btn = container.querySelector('#copy');
        btn.textContent = '✅ کپی شد';
        setTimeout(() => (btn.textContent = '📋 کپی'), 1200);
      });
    };

    render();
  },
  unmount() {},
});