import { BaseComponent } from './base-component.js';

export class AppUpdateBanner extends BaseComponent {
  static get observedAttributes() { return ['hidden']; }

  set onApply(fn) { this._apply = fn; }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: fixed; bottom: 16px; left: 16px; right: 16px;
          display: flex; justify-content: center; z-index: 900;
        }
        :host([hidden]) { display: none; }
        .bar {
          display: flex; align-items: center; gap: 12px;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-card);
          padding: 10px 16px; font-size: .85rem;
          box-shadow: 0 8px 32px rgba(0,0,0,.35);
          max-width: 520px;
        }
        button {
          font: inherit; padding: 6px 14px; border-radius: 8px; cursor: pointer;
          border: none; background: var(--color-brand); color: #fff;
        }
        button:hover { background: var(--color-brand-hover); }
        button.ghost {
          background: transparent; color: var(--color-text-muted);
        }
        button.ghost:hover { background: transparent; color: var(--color-text-default); }
        button:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      <div class="bar" role="status" aria-live="polite">
        <span>نسخه‌ی جدید آماده است.</span>
        <button data-action="apply">به‌روزرسانی</button>
        <button class="ghost" data-action="dismiss">بعداً</button>
      </div>
    `;

    this.$('[data-action="apply"]').addEventListener('click', () => {
      this._apply?.();
      this.setAttribute('hidden', '');
    });
    this.$('[data-action="dismiss"]').addEventListener('click', () => {
      this.setAttribute('hidden', '');
    });
  }
}
customElements.define('app-update-banner', AppUpdateBanner);