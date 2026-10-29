import { BaseComponent } from '../../shared/ui/base-component.js';
import { FORMULAS } from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeFormulas extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px; margin-bottom: 12px;
        }
        .card h3 { margin: 0 0 6px; font-size: 1rem; }
        .card p { margin: 0 0 10px; font-size: .85rem; color: var(--color-text-muted); }
        pre {
          white-space: pre-wrap; word-break: break-word;
          font-size: var(--text-mono); color: var(--color-text-subtle);
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 10px; margin: 0;
          font-family: var(--p-font-mono);
          unicode-bidi: plaintext;
        }
        .copy {
          margin-top: 8px; font: inherit; padding: 6px 12px; border-radius: 8px;
          border: 1px solid var(--color-border); background: transparent;
          color: var(--color-text-default); cursor: pointer; font-size: .8rem;
        }
        .copy:hover { border-color: var(--color-brand); }
        .copy:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      ${FORMULAS.map(f => `
        <div class="card" data-id="${escapeHtml(f.id)}">
          <h3>${escapeHtml(f.title)}</h3>
          <p>${escapeHtml(f.description)}</p>
          <pre>${escapeHtml(f.template)}</pre>
          <button class="copy" data-copy="${escapeHtml(f.template)}">📋 کپی قالب</button>
        </div>
      `).join('')}
    `;

    this.$$('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = '✅ کپی شد';
        setTimeout(() => (btn.textContent = '📋 کپی قالب'), 1200);
      });
    });
  }
}
customElements.define('knowledge-formulas', KnowledgeFormulas);