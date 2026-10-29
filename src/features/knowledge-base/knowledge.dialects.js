import { BaseComponent } from '../../shared/ui/base-component.js';
import { MODEL_DIALECTS } from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeDialects extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .model {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px; margin-bottom: 12px;
        }
        .model h3 { margin: 0 0 10px; font-size: 1rem; }
        .row { font-size: .85rem; margin-bottom: 6px; }
        .row b { color: var(--color-text-default); }
        .row span { color: var(--color-text-subtle); }
      </style>
      ${Object.entries(MODEL_DIALECTS).map(([name, d]) => `
        <div class="model">
          <h3>${escapeHtml(name)}</h3>
          <div class="row"><b>چه می‌خواهد:</b> <span>${escapeHtml(d.wants)}</span></div>
          <div class="row"><b>چه نادیده می‌گیرد:</b> <span>${escapeHtml(d.ignores)}</span></div>
          <div class="row"><b>دام رایج:</b> <span>${escapeHtml(d.trap)}</span></div>
        </div>
      `).join('')}
    `;
  }
}
customElements.define('knowledge-dialects', KnowledgeDialects);