import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class CockpitRisks extends BaseComponent {
  connectedCallback() { super.connectedCallback(); this.render(); }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const risks = (tasksByProject[activeProjectId] ?? []).filter(t => t.kind === 'risk');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        table {
          width: 100%; border-collapse: collapse; font-size: .85rem;
          background: var(--color-surface); border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 10px 12px; border-bottom: 1px solid var(--color-border);
          text-align: right;
        }
        th {
          color: var(--color-text-muted); font-weight: 500;
          background: var(--color-bg);
        }
        tr:last-child td { border-bottom: none; }
        .empty {
          color: var(--color-text-subtle); text-align: center; padding: 40px;
          font-size: .85rem;
        }
      </style>
      ${risks.length === 0
        ? '<p class="empty">ریسکی ثبت نشده. در تب وظایف، وظیفه‌ای با kind="risk" بساز.</p>'
        : `<table>
            <thead><tr><th>ریسک</th><th>احتمال</th><th>تأثیر</th><th>امتیاز</th></tr></thead>
            <tbody>
              ${risks.map(r => {
                const score = (r.probability ?? 0) * (r.impact ?? 0);
                const icon = score >= 17 ? '🔴' : score >= 10 ? '🟠' : score >= 5 ? '🟡' : '🟢';
                return `<tr>
                  <td>${escapeHtml(r.title)}</td>
                  <td>${r.probability ?? '—'}</td>
                  <td>${r.impact ?? '—'}</td>
                  <td>${icon} ${score}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>`}
    `;
  }
}
customElements.define('cockpit-risks', CockpitRisks);