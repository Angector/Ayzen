import { BaseComponent } from '../../shared/ui/base-component.js';
import {
  COST_KIT,
  RAG_ARCHITECTURE,
  GUARDRAILS,
  TRUST_UX,
  COMPLIANCE,
} from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeProduction extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .section { margin-bottom: 28px; }
        .section > h2 { font-size: 1.05rem; margin: 0 0 12px; }
        .card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 14px; margin-bottom: 10px;
        }
        .card h3 { margin: 0 0 6px; font-size: .92rem; }
        .card p { margin: 0 0 6px; font-size: .82rem; color: var(--color-text-muted); }
        .badge {
          font-size: .72rem; padding: 2px 8px; border-radius: 999px;
          background: color-mix(in oklch, var(--color-brand) 15%, transparent);
          color: var(--color-brand); white-space: nowrap;
        }
        .trap { font-size: .78rem; color: var(--color-warning); }
        .pipeline {
          font-size: .8rem; color: var(--color-text-subtle); white-space: pre-wrap;
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 10px; margin-top: 8px;
        }
        .stage-list {
          padding-right: 18px; margin: 8px 0 0;
          font-size: .82rem; color: var(--color-text-muted);
        }
        .stage-list li { margin-bottom: 6px; line-height: 1.7; }
      </style>

      <section class="section">
        <h2>💰 کیت کاهش هزینه</h2>
        ${COST_KIT.map(c => `
          <div class="card">
            <h3>${escapeHtml(c.title)} <span class="badge">${escapeHtml(c.saving)}</span></h3>
            <p>${escapeHtml(c.how)}</p>
            <p class="trap">⚠️ ${escapeHtml(c.trap)}</p>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>🔍 معماری RAG تولیدی</h2>
        <div class="card">
          <ul class="stage-list">
            ${RAG_ARCHITECTURE.stages.map(s => `
              <li><b>${escapeHtml(s.title)}:</b> ${escapeHtml(s.note)}</li>
            `).join('')}
          </ul>
        </div>
        <div class="pipeline">${escapeHtml(RAG_ARCHITECTURE.goldenRule)}</div>
      </section>

      <section class="section">
        <h2>🛡️ امنیت و Guardrails</h2>
        ${GUARDRAILS.map(g => `
          <div class="card">
            <h3>${escapeHtml(g.title)}</h3>
            <p>${escapeHtml(g.rule)}</p>
            <p class="trap">ریسک: ${escapeHtml(g.risk)}</p>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>🎨 الگوهای UX اعتماد</h2>
        ${TRUST_UX.map(t => `
          <div class="card">
            <h3>${escapeHtml(t.title)} <span class="badge">${escapeHtml(t.phase)}</span></h3>
            <p>${escapeHtml(t.how)}</p>
          </div>
        `).join('')}
      </section>

      <section class="section">
        <h2>⚖️ انطباق قانونی</h2>
        ${COMPLIANCE.map(c => `
          <div class="card">
            <h3>${escapeHtml(c.title)}</h3>
            <p>${escapeHtml(c.rule)}</p>
            <p class="trap">🗓️ ${escapeHtml(c.deadline)}</p>
          </div>
        `).join('')}
      </section>
    `;
  }
}
customElements.define('knowledge-production', KnowledgeProduction);