import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { highValuePromptsPerWeek } from '../../shared/analytics/analytics.metrics.js';
import './insights.survey.js';
import './insights.experiments.js';

export class InsightsView extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this._unsub?.(); }

  render() {
    const { prompts = [], events = [] } = store.snap();
    const weekly = highValuePromptsPerWeek(events, prompts);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 900px; margin: 0 auto; }
        h1 { font-size: var(--text-display); margin-bottom: 16px; }
        .cards {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-bottom: 16px;
        }
        @media (max-width: 700px) { .cards { grid-template-columns: 1fr; } }
        .card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px;
        }
        .card h4 {
          margin: 0 0 6px; font-size: .8rem;
          color: var(--color-text-muted); font-weight: 500;
        }
        .card strong { font-size: 1.6rem; color: var(--color-text-default); }
      </style>
      <h1>بینش هفته</h1>
      <div class="cards">
        <div class="card"><h4>پرامپت ارزش‌آفرین</h4><strong>${weekly}</strong></div>
        <div class="card"><h4>کل پرامپت‌ها</h4><strong>${prompts.length}</strong></div>
        <div class="card"><h4>رویدادها</h4><strong>${events.length}</strong></div>
      </div>
      <insights-survey></insights-survey>
      <insights-experiments></insights-experiments>
    `;
  }
}
customElements.define('insights-view', InsightsView);