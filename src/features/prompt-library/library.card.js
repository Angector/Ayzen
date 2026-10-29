import { BaseComponent } from '../../shared/ui/base-component.js';
import { escapeHtml } from '../../shared/lib/pure.js';
import '../../shared/ui/app-button.js';
import '../../shared/ui/app-badge.js';

export class PromptCard extends BaseComponent {
  static get observedAttributes() { return ['data-id']; }

  set prompt(p) {
    this._prompt = p;
    if (this._mounted) this.render();
  }

  render() {
    const p = this._prompt;
    if (!p) return;

    const rating = p.rating?.overall ?? 0;
    const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

    this.shadowRoot.innerHTML = `
      <style>
        .card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
          transition: transform 150ms ease, border-color 150ms ease;
          height: 100%;
        }
        .card:hover { transform: translateY(-2px); border-color: var(--color-border-strong); }
        header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        h3 { font-size: .95rem; font-weight: 600; margin: 0; line-height: 1.4; }
        pre {
          margin: 0;
          white-space: pre-wrap; word-break: break-word;
          font-size: var(--text-mono);
          color: var(--color-text-muted);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 10px;
          max-height: 180px; overflow-y: auto;
          unicode-bidi: plaintext;
          font-family: var(--p-font-mono);
        }
        footer { display: flex; gap: 6px; margin-top: auto; flex-wrap: wrap; align-items: center; }
        .builtin { font-size: .75rem; color: var(--color-text-subtle); padding: 6px 0; }
        .stars {
          font-size: .8rem; color: var(--color-warning);
          margin-right: auto; letter-spacing: 1px;
          font-family: system-ui, sans-serif;
        }
        .use-count {
          font-size: .75rem; color: var(--color-text-subtle);
          padding: 2px 8px; background: var(--color-bg);
          border-radius: 999px;
        }
      </style>
      <article class="card">
        <header>
          <h3>${escapeHtml(p.title)}</h3>
          <app-badge category="${escapeHtml(p.category)}">${escapeHtml(p.category)}</app-badge>
        </header>
        <pre>${escapeHtml(p.content)}</pre>
        <footer>
          <app-button data-action="copy" variant="primary">📋 کپی</app-button>
          ${p.builtin
            ? '<span class="builtin">پیش‌فرض</span>'
            : `<app-button data-action="edit">✏️ ویرایش</app-button>
               <app-button data-action="delete" variant="danger">🗑️ حذف</app-button>`}
          ${rating > 0 ? `<span class="stars" aria-label="امتیاز ${rating} از ۵">${stars}</span>` : ''}
          ${p.useCount > 0 ? `<span class="use-count">${p.useCount} بار</span>` : ''}
        </footer>
      </article>
    `;

    this.$$('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.emit('prompt-action', { action: btn.dataset.action, prompt: p });
      });
    });
  }
}
customElements.define('prompt-card', PromptCard);