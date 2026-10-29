import { BaseComponent } from './base-component.js';

class AppDialog extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        dialog {
          background: var(--color-surface-raised);
          color: var(--color-text-default);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-dialog);
          padding: 20px;
          width: min(560px, 92vw);
        }
        dialog::backdrop { background: rgba(0,0,0,.6); }
      </style>
      <dialog closedby="any"><slot></slot></dialog>
    `;
  }
  open()  { this.$('dialog').showModal(); }
  close() { this.$('dialog').close(); }
}
customElements.define('app-dialog', AppDialog);