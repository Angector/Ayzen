import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { projectProgress, TASK_STATUSES, STATUS_LABELS } from '../../shared/lib/pure.js';

const CHART_URL = 'https://cdn.jsdelivr.net/npm/chart.js@4.6.1/+esm';

export class CockpitDashboard extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    try {
      this._Chart = (await import(CHART_URL)).default;
    } catch (err) {
      console.error('[dashboard] chart.js failed', err);
    }
    this.render();
  }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = tasksByProject[activeProjectId] ?? [];
    const pct = projectProgress(tasks);
    const byStatus = TASK_STATUSES.map(s => tasks.filter(t => t.status === s).length);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .grid {
          display: grid; grid-template-columns: repeat(2, 1fr);
          gap: 12px; margin-bottom: 16px;
        }
        @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } }
        .kpi {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px;
        }
        .kpi h4 {
          margin: 0 0 6px; font-size: .8rem; color: var(--color-text-muted);
          font-weight: 500;
        }
        .kpi strong { font-size: 1.6rem; color: var(--color-text-default); }
        .chart-wrap {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px;
          max-height: 400px;
        }
      </style>
      <div class="grid">
        <div class="kpi"><h4>پیشرفت</h4><strong>${pct}٪</strong></div>
        <div class="kpi"><h4>وظایف</h4><strong>${tasks.length}</strong></div>
      </div>
      <div class="chart-wrap"><canvas id="chart"></canvas></div>
    `;

    const ctx = this.$('#chart');
    if (ctx && this._Chart) {
      try {
        new this._Chart(ctx, {
          type: 'bar',
          data: {
            labels: TASK_STATUSES.map(s => STATUS_LABELS[s]),
            datasets: [{
              label: 'توزیع وظایف',
              data: byStatus,
              backgroundColor: 'oklch(0.70 0.15 260 / 0.7)',
              borderRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
            },
          },
        });
      } catch (err) {
        console.error('[dashboard] chart error', err);
      }
    }
  }
}
customElements.define('cockpit-dashboard', CockpitDashboard);