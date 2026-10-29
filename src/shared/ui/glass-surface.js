import { BaseComponent } from './base-component.js';

class GlassSurface extends BaseComponent {
  static get observedAttributes() { return ['intensity']; }

  render() {
    const intensity = this.getAttribute('intensity') ?? 'md';
    const blurMap = { sm: '10px', md: '18px', lg: '28px' };
    const blur = blurMap[intensity] ?? blurMap.md;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; position: relative; }
        .glass {
          position: relative;
          background: oklch(1 0 0 / 0.06);
          backdrop-filter: blur(${blur}) saturate(160%);
          -webkit-backdrop-filter: blur(${blur}) saturate(160%);
          border: 1px solid oklch(1 0 0 / 0.18);
          border-radius: var(--radius-card, 12px);
          box-shadow:
            inset 0 1px 0 oklch(1 0 0 / 0.25),
            inset 0 -1px 0 oklch(1 0 0 / 0.06),
            0 8px 32px oklch(0 0 0 / 0.35);
          isolation: isolate;
        }
        .content {
          position: relative;
          z-index: 1;
          padding: 16px;
        }
        @media (prefers-reduced-transparency: reduce) {
          .glass {
            background: var(--color-surface-raised);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            box-shadow: none;
            border: 1px solid var(--color-border);
          }
        }
        @media (forced-colors: active) {
          .glass { border: 2px solid ButtonText; }
        }
      </style>
      <div class="glass" part="glass">
        <div class="content"><slot></slot></div>
      </div>
    `;
  }
}
customElements.define('glass-surface', GlassSurface);