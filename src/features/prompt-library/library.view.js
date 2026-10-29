import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import {
  filterPrompts,
  sortPromptsByMemory,
  uniqueValues,
  escapeHtml,
} from '../../shared/lib/pure.js';
import '../../shared/ui/app-button.js';
import '../../shared/ui/app-badge.js';
import './library.card.js';

export class LibraryView extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() {
    this._unsub?.();
  }

  render() {
    const { prompts, filter, loading } = store.snap();
    const filtered = sortPromptsByMemory(filterPrompts(prompts, filter));
    const categories = uniqueValues(prompts, 'category');
    const models = uniqueValues(prompts, 'model');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 1200px; margin: 0 auto; }
        .toolbar {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;
          align-items: center;
        }
        input, select {
          font: inherit; padding: 8px 12px;
          background: var(--color-surface);
          color: var(--color-text-default);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-button);
        }
        input { flex: 1; min-width: 180px; }
        input:focus-visible, select:focus-visible {
          outline: 2px solid var(--color-brand); outline-offset: 1px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        .empty {
          grid-column: 1 / -1;
          text-align: center; padding: 60px 20px;
          color: var(--color-text-subtle);
        }
        .empty h2 { color: var(--color-text-muted); margin-bottom: 8px; font-size: 1.1rem; }
        .empty p { margin: 0 0 16px; font-size: .9rem; }
      </style>

      <div class="toolbar">
        <input id="search" placeholder="جستجو در عنوان و متن..." value="${escapeHtml(filter.q)}">
        <select id="cat">
          <option value="">همه دسته‌ها</option>
          ${categories.map(c =>
            `<option value="${escapeHtml(c)}" ${filter.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`
          ).join('')}
        </select>
        <select id="mod">
          <option value="">همه مدل‌ها</option>
          ${models.map(m =>
            `<option value="${escapeHtml(m)}" ${filter.model === m ? 'selected' : ''}>${escapeHtml(m)}</option>`
          ).join('')}
        </select>
        <app-button variant="primary" id="open-composer">+ سازنده پرامپت</app-button>
      </div>

      <div class="grid">
        ${loading
          ? '<p class="empty">در حال بارگذاری...</p>'
          : filtered.length === 0
            ? `<div class="empty"><h2>هنوز پرامپتی نیست</h2><p>اولین پرامپتت را بساز — ۳۰ ثانیه وقت می‌گیرد.</p></div>`
            : filtered.map(p => `<prompt-card data-id="${escapeHtml(p.id)}"></prompt-card>`).join('')
        }
      </div>
    `;

    filtered.forEach(p => {
      const el = this.$(`prompt-card[data-id="${CSS.escape(p.id)}"]`);
      if (el) el.prompt = p;
    });

    this.$('#search')?.addEventListener('input', e => {
      store.set({ filter: { ...filter, q: e.target.value } });
    });
    this.$('#cat')?.addEventListener('change', e => {
      store.set({ filter: { ...filter, category: e.target.value } });
    });
    this.$('#mod')?.addEventListener('change', e => {
      store.set({ filter: { ...filter, model: e.target.value } });
    });
    this.$('#open-composer')?.addEventListener('click', () => {
      this.emit('navigate', { view: 'composer' });
    });

    this.$$('prompt-card').forEach(card => {
      card.addEventListener('prompt-action', e => this.handleAction(e.detail));
    });
  }

  async handleAction({ action, prompt }) {
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(prompt.content);
        this.emit('toast', { message: 'کپی شد ✅' });
        this.emit('prompt-copied', { id: prompt.id });
      } catch {
        this.emit('toast', { message: 'کپی ناموفق بود', type: 'error' });
      }
    }
    if (action === 'delete') {
      if (confirm(`«${prompt.title}» حذف شود؟`)) {
        this.emit('prompt-delete', { id: prompt.id });
      }
    }
    if (action === 'edit') {
      this.emit('prompt-edit', { prompt });
    }
  }
}
customElements.define('library-view', LibraryView);