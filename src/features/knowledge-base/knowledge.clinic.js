import { BaseComponent } from '../../shared/ui/base-component.js';
import { CLINIC } from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeClinic extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .case {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px; margin-bottom: 12px;
        }
        .case h3 {
          margin: 0 0 8px; font-size: 1rem;
          color: var(--color-warning); font-weight: 600;
        }
        ul {
          margin: 0; padding-right: 18px;
          font-size: .85rem; color: var(--color-text-muted);
        }
        li { margin-bottom: 6px; line-height: 1.7; }
      </style>
      ${CLINIC.map(c => `
        <div class="case">
          <h3>${escapeHtml(c.symptom)}</h3>
          <ul>${c.checklists.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
        </div>
      `).join('')}
    `;
  }
}
customElements.define('knowledge-clinic', KnowledgeClinic);