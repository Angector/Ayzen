import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class CockpitDecisions extends BaseComponent {
  connectedCallback() { super.connectedCallback(); this.render(); }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const decisions = (tasksByProject[activeProjectId] ?? []).filter(t => t.kind === 'decision');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .item {
          border-right: 3px solid var(--color-brand);
          padding: 8px 12px; margin-bottom: 8px;
          background: var(--color-surface); border-radius: 8px;
          font-size: .85rem;
        }
        .item b { color: var(--color-text-default); }
        .item span { color: var(--color-text-subtle); }
        .empty {
          color: var(--color-text-subtle); text-align: center; padding: 40px;
          font-size: .85rem;
        }
      </style>
      ${decisions.length === 0
        ? '<p class="empty">تصمیمی ثبت نشده. در تب وظایف، وظیفه‌ای با kind="decision" بساز.</p>'
        : decisions.map(d => `
            <div class="item">
              <b>${escapeHtml(d.title)}</b><br>
              <span>${escapeHtml(d.content ?? '')}</span>
            </div>
          `).join('')}
    `;
  }
}
customElements.define('cockpit-decisions', CockpitDecisions);