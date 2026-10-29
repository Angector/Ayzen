import { BaseComponent } from './base-component.js';

class AppButton extends BaseComponent {
  static get observedAttributes() { return ['variant', 'disabled']; }

  render() {
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; }
        button {
          padding: 8px 14px;
          border-radius: var(--radius-button, 8px);
          border: 1px solid var(--color-border, #333);
          background: transparent;
          color: var(--color-text-default, #eee);
          transition: background 150ms ease, border-color 150ms ease;
        }
        button:hover:not(:disabled) { border-color: var(--color-brand, #6c8cff); }
        button:focus-visible { outline: 2px solid var(--color-brand, #6c8cff); outline-offset: 2px; }
        button:disabled { opacity: .5; cursor: not-allowed; }
        :host([variant="primary"]) button {
          background: var(--color-brand, #6c8cff);
          border-color: transparent;
          color: #fff;
        }
        :host([variant="danger"]) button { color: var(--color-danger, #ff8a8a); }
        ::slotted(svg) { width: 16px; height: 16px; }
      </style>
      <button part="button" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `;
  }
}
customElements.define('app-button', AppButton);