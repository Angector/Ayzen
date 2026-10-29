import { BaseComponent } from './base-component.js';

class AppCard extends BaseComponent {
  static get observedAttributes() { return ['variant', 'padding', 'interactive']; }

  render() {
    const variant = this.getAttribute('variant') ?? 'default';
    const padding = this.getAttribute('padding') ?? 'md';
    const padMap = { sm: '10px', md: '16px', lg: '24px' };

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-card);
          padding: ${padMap[padding] ?? padMap.md};
          transition: transform 150ms ease, border-color 150ms ease;
        }
        :host([variant="raised"]) .card {
          background: var(--color-surface-raised);
          box-shadow: 0 4px 16px rgba(0,0,0,.25);
        }
        :host([variant="glass"]) .card {
          background: oklch(1 0 0 / 0.06);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid oklch(1 0 0 / 0.18);
        }
        :host([interactive]) .card {
          cursor: pointer;
        }
        :host([interactive]) .card:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-strong);
        }
        :host([interactive]) .card:focus-within {
          outline: 2px solid var(--color-brand);
          outline-offset: 2px;
        }
        ::slotted(h2), ::slotted(h3) { margin: 0 0 8px; }
        ::slotted(p) { margin: 0; }
      </style>
      <div class="card" part="card"><slot></slot></div>
    `;
  }
}
customElements.define('app-card', AppCard);