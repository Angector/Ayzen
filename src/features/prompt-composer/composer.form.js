import { BaseComponent } from '../../shared/ui/base-component.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class ComposerForm extends BaseComponent {
  set fields(fields) {
    this._fields = fields;
    this._values = Object.fromEntries(fields.map(f => [f.key, '']));
    if (this._mounted) this.render();
  }

  get values() { return { ...this._values }; }

  render() {
    if (!this._fields) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .form { display: flex; flex-direction: column; gap: 12px; }
        label {
          display: flex; flex-direction: column; gap: 4px;
          font-size: .85rem; color: var(--color-text-muted);
        }
        input, textarea {
          font: inherit; padding: 8px 12px;
          background: var(--color-bg);
          color: var(--color-text-default);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
        }
        input:focus-visible, textarea:focus-visible {
          outline: 2px solid var(--color-brand); outline-offset: 1px;
        }
        textarea { resize: vertical; min-height: 52px; font-family: inherit; }
      </style>
      <div class="form">
        ${this._fields.map(f => `
          <label>
            ${escapeHtml(f.label)}
            <input
              data-key="${escapeHtml(f.key)}"
              placeholder="${escapeHtml(f.placeholder ?? '')}"
              value="${escapeHtml(this._values[f.key] ?? '')}"
            >
          </label>
        `).join('')}
      </div>
    `;

    this.$$('input').forEach(inp => {
      inp.addEventListener('input', e => {
        this._values[e.target.dataset.key] = e.target.value;
        this.emit('form-change', { values: this.values });
      });
    });
  }
}
customElements.define('composer-form', ComposerForm);