import { BaseComponent } from './base-component.js';

class EmptyState extends BaseComponent {
  static get observedAttributes() { return ['icon', 'title', 'message', 'action-label']; }

  render() {
    const icon = this.getAttribute('icon') ?? '📭';
    const title = this.getAttribute('title') ?? 'چیزی اینجا نیست';
    const message = this.getAttribute('message') ?? '';
    const actionLabel = this.getAttribute('action-label') ?? '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .wrap {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 12px; padding: 60px 20px; text-align: center;
        }
        .icon { font-size: 2.5rem; opacity: .6; line-height: 1; }
        h2 { margin: 0; font-size: 1.05rem; color: var(--color-text-muted); font-weight: 600; }
        p { margin: 0; font-size: .85rem; color: var(--color-text-subtle); max-width: 360px; line-height: 1.7; }
        button {
          margin-top: 6px; padding: 8px 18px; border-radius: 8px;
          border: none; background: var(--color-brand); color: #fff;
          font: inherit; cursor: pointer;
        }
        button:hover { background: var(--color-brand-hover); }
        button:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      <div class="wrap" role="status">
        <span class="icon" aria-hidden="true">${icon}</span>
        <h2>${title}</h2>
        ${message ? `<p>${message}</p>` : ''}
        ${actionLabel ? `<button part="action">${actionLabel}</button>` : ''}
      </div>
    `;

    this.$('[part="action"]')?.addEventListener('click', () => {
      this.emit('empty-action');
    });
  }
}
customElements.define('empty-state', EmptyState);