import { BaseComponent } from './base-component.js';

const COLORS = {
  architecture: 'var(--color-brand)',
  image: 'var(--p-violet-500)',
  video: 'var(--p-teal-500)',
  development: 'var(--color-success)',
  advanced: 'var(--color-warning)',
  default: 'var(--color-text-muted)',
};

class AppBadge extends BaseComponent {
  static get observedAttributes() { return ['category']; }

  render() {
    const cat = this.getAttribute('category') ?? 'default';
    const color = COLORS[cat] ?? COLORS.default;
    this.shadowRoot.innerHTML = `
      <style>
        span {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: .75rem;
          background: color-mix(in oklch, ${color} 18%, transparent);
          color: ${color};
          white-space: nowrap;
        }
      </style>
      <span><slot></slot></span>
    `;
  }
}
customElements.define('app-badge', AppBadge);