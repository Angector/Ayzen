import { BaseComponent } from '../../shared/ui/base-component.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class MemoryHistory extends BaseComponent {
  set prompt(p) {
    this._prompt = p;
    if (this._mounted) this.render();
  }

  render() {
    const history = this._prompt?.history ?? [];

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        h4 {
          margin: 0 0 8px; font-size: .85rem;
          color: var(--color-text-muted); font-weight: 500;
        }
        .list {
          display: flex; flex-direction: column; gap: 6px;
          max-height: 200px; overflow-y: auto;
        }
        .item {
          font-size: .78rem; padding: 6px 8px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px; color: var(--color-text-subtle);
          display: flex; justify-content: space-between; gap: 8px;
        }
        .empty {
          font-size: .8rem; color: var(--color-text-subtle);
          padding: 8px 0;
        }
      </style>
      <h4>نسخه‌های قبلی (${history.length})</h4>
      <div class="list">
        ${history.length === 0
          ? '<span class="empty">هنوز نسخه‌ی قبلی وجود ندارد.</span>'
          : history.slice().reverse().map(h => `
              <div class="item">
                <span>${escapeHtml(h.title ?? '—')}</span>
                <span>${escapeHtml((h.savedAt ?? '').slice(0, 10))}</span>
              </div>
            `).join('')}
      </div>
    `;
  }
}
customElements.define('memory-history', MemoryHistory);