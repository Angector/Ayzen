import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml } from '../../shared/lib/pure.js';
import { renderTemplate, missingVariables } from '../../shared/lib/template.js';
import { TEMPLATES } from './composer.templates.js';
import { MODEL_DIALECTS } from './composer.dialects.js';
import './composer.form.js';
import '../../shared/ui/app-button.js';
import '../../shared/ui/app-badge.js';

export class ComposerView extends BaseComponent {
  constructor() {
    super();
    this._templateId = TEMPLATES[0].id;
    this._values = {};
    this._output = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this._unsub?.(); }

  get activeTemplate() {
    return TEMPLATES.find(t => t.id === this._templateId) ?? TEMPLATES[0];
  }

  updateOutput() {
    const tpl = this.activeTemplate;
    this._output = renderTemplate(tpl.template, this._values);
    const missing = missingVariables(tpl.template, this._values);
    this.emit('composer-output', {
      output: this._output,
      missing,
      template: tpl,
      values: { ...this._values },
    });
  }

  render() {
    const tpl = this.activeTemplate;
    const dialect = MODEL_DIALECTS[tpl.model];
    const missing = missingVariables(tpl.template, this._values);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 900px; margin: 0 auto; }
        h1 { font-size: var(--text-display); margin-bottom: 20px; }
        .row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; align-items: center; }
        select {
          font: inherit; padding: 8px 12px;
          background: var(--color-surface); color: var(--color-text-default);
          border: 1px solid var(--color-border); border-radius: var(--radius-button);
        }
        select:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 1px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } }
        .panel {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: 16px;
        }
        .panel h3 { margin: 0 0 10px; font-size: .95rem; }
        pre {
          white-space: pre-wrap; word-break: break-word;
          font-size: var(--text-mono); color: var(--color-text-muted);
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 12px; margin: 0;
          max-height: 300px; overflow-y: auto;
          unicode-bidi: plaintext;
          font-family: var(--p-font-mono);
        }
        .hint {
          font-size: .8rem; color: var(--color-text-subtle);
          margin-top: 8px; padding: 8px;
          background: color-mix(in oklch, var(--color-brand) 8%, transparent);
          border-radius: 8px;
          line-height: 1.7;
        }
        .hint strong { color: var(--color-text-muted); }
        .hint em { color: var(--color-text-default); font-style: normal; }
        .missing { color: var(--color-warning); font-size: .8rem; margin-top: 6px; }
        .actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .back { margin-bottom: 16px; }
      </style>

      <div class="back">
        <app-button data-action="back">← بازگشت به کتابخانه</app-button>
      </div>

      <h1>سازنده پرامپت</h1>

      <div class="row">
        <select id="template">
          ${TEMPLATES.map(t => `
            <option value="${t.id}" ${t.id === this._templateId ? 'selected' : ''}>
              ${escapeHtml(t.title)} (${escapeHtml(t.model)})
            </option>
          `).join('')}
        </select>
        <app-badge category="${tpl.kind}">${tpl.kind}</app-badge>
        <app-badge category="default">${escapeHtml(tpl.model)}</app-badge>
      </div>

      <div class="grid">
        <div class="panel">
          <h3>فیلدها</h3>
          <composer-form id="form"></composer-form>
          ${dialect ? `
            <div class="hint">
              <strong>گویش ${escapeHtml(tpl.model)}:</strong>
              ${escapeHtml(dialect.wants)}<br>
              <em>نادیده می‌گیرد:</em> ${escapeHtml(dialect.ignores)}<br>
              <em>دام:</em> ${escapeHtml(dialect.trap)}
            </div>
          ` : ''}
        </div>

        <div class="panel">
          <h3>خروجی زنده</h3>
          <pre id="output">${escapeHtml(this._output || 'فیلدها را پر کن...')}</pre>
          ${missing.length ? `<p class="missing">⚠️ ${missing.length} فیلد خالی: ${missing.join('، ')}</p>` : ''}
          <div class="actions">
            <app-button variant="primary" data-action="copy" ${this._output ? '' : 'disabled'}>📋 کپی</app-button>
            <app-button data-action="save" ${this._output ? '' : 'disabled'}>💾 ذخیره به کتابخانه</app-button>
          </div>
        </div>
      </div>

      <div class="hint" style="margin-top:20px">
        💡 ${escapeHtml(tpl.hint ?? '')}
      </div>
    `;

    const form = this.$('#form');
    form.fields = tpl.fields;
    form.addEventListener('form-change', e => {
      this._values = e.detail.values;
      this.updateOutput();
    });
    this._values = form.values;

    this.$('#template')?.addEventListener('change', e => {
      this._templateId = e.target.value;
      this._values = {};
      this._output = '';
      this.render();
    });

    this.$$('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
    });

    this.updateOutput();
  }

  async handleAction(action) {
    if (action === 'back') {
      store.set({ view: 'library' });
      return;
    }
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(this._output);
        this.emit('toast', { message: 'کپی شد ✅' });
      } catch {
        this.emit('toast', { message: 'کپی ناموفق بود', type: 'error' });
      }
      return;
    }
    if (action === 'save') {
      const tpl = this.activeTemplate;
      this.emit('prompt-save', {
        title: tpl.title,
        category: tpl.kind,
        model: tpl.model,
        content: this._output,
        template: tpl.template,
        variables: tpl.fields.map(f => f.key),
      });
    }
  }
}
customElements.define('composer-view', ComposerView);