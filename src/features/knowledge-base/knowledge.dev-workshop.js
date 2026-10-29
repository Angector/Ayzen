import { BaseComponent } from '../../shared/ui/base-component.js';
import {
  DEV_TOOL_MATRIX,
  WORKFLOW_PATTERNS,
  DEV_PROMPTS,
  GOLDEN_RULES,
} from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeDevWorkshop extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .section { margin-bottom: 24px; }
        .section > h2 { font-size: 1.1rem; margin: 0 0 12px; }
        .card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: 16px; margin-bottom: 12px;
        }
        .card h3 { margin: 0 0 6px; font-size: .95rem; }
        .card p { margin: 0 0 8px; font-size: .85rem; color: var(--color-text-muted); }
        pre {
          white-space: pre-wrap; word-break: break-word;
          font-size: var(--text-mono); color: var(--color-text-subtle);
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 10px; margin: 0;
          font-family: var(--p-font-mono);
          unicode-bidi: plaintext;
        }
        .copy {
          margin-top: 6px; font: inherit; font-size: .8rem; cursor: pointer;
          padding: 6px 12px; border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent; color: var(--color-text-default);
        }
        .copy:hover { border-color: var(--color-brand); }
        .copy:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
        .rule {
          border-right: 3px solid var(--color-brand);
          padding-right: 12px;
        }
      </style>

      <section class="section">
        <h2>🧭 ماتریس انتخاب ابزار</h2>
        ${DEV_TOOL_MATRIX.map(t => `
          <div class="card">
            <h3>${escapeHtml(t.stage)} → ${escapeHtml(t.tool)}</h3>
            <p>${escapeHtml(t.why)}</p>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>🤖 الگوهای گردش‌کار ایجنت</h2>
        ${WORKFLOW_PATTERNS.map(p => `
          <div class="card">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.principle)}</p>
            <p>${escapeHtml(p.benefit)}</p>
            <pre>${escapeHtml(p.prompt)}</pre>
            <button class="copy" data-copy="${escapeHtml(p.prompt)}">📋 کپی پرامپت</button>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>🧠 کتابخانه‌ی پرامپت‌های ۸ مرحله</h2>
        ${Object.values(DEV_PROMPTS).map(p => `
          <div class="card">
            <h3>${escapeHtml(p.title)}</h3>
            <pre>${escapeHtml(p.prompt)}</pre>
            <button class="copy" data-copy="${escapeHtml(p.prompt)}">📋 کپی</button>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>🏆 قوانین طلایی</h2>
        ${GOLDEN_RULES.map(r => `
          <div class="card rule">
            <h3>${escapeHtml(r.title)}</h3>
            <p>${escapeHtml(r.detail)}</p>
          </div>
        `).join('')}
      </section>
    `;

    this.$$('.copy').forEach(btn => {
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const orig = btn.textContent;
        btn.textContent = '✅ کپی شد';
        setTimeout(() => (btn.textContent = orig), 1200);
      });
    });
  }
}
customElements.define('knowledge-dev-workshop', KnowledgeDevWorkshop);