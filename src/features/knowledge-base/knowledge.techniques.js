import { BaseComponent } from '../../shared/ui/base-component.js';
import { TECHNIQUES } from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeTechniques extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .tech {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px; margin-bottom: 12px;
        }
        .tech h3 { margin: 0 0 6px; font-size: 1rem; }
        .tech p { margin: 0 0 8px; font-size: .85rem; color: var(--color-text-muted); }
        .meta { font-size: .8rem; color: var(--color-text-subtle); margin-bottom: 4px; }
        .meta b { color: var(--color-text-default); }
      </style>
      ${TECHNIQUES.map(t => `
        <div class="tech">
          <h3>${escapeHtml(t.title)}</h3>
          <p>${escapeHtml(t.description)}</p>
          <div class="meta"><b>چه زمانی:</b> ${escapeHtml(t.when)}</div>
          <div class="meta"><b>چطور:</b> ${escapeHtml(t.how)}</div>
        </div>
      `).join('')}
    `;
  }
}
customElements.define('knowledge-techniques', KnowledgeTechniques);