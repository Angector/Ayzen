import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { tasksToMermaidTimeline, escapeHtml } from '../../shared/lib/pure.js';

const MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

export class CockpitMilestones extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    try {
      this._mermaid = (await import(MERMAID_URL)).default;
      this._mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    } catch (err) {
      console.error('[milestones] mermaid failed', err);
    }
    this.render();
    this.draw();
  }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = tasksByProject[activeProjectId] ?? [];
    const milestones = tasks.filter(t => t.isMilestone);
    this._chart = tasksToMermaidTimeline(tasks);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        #t {
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 16px; min-height: 120px;
        }
        .empty { color: var(--color-text-subtle); text-align: center; padding: 20px; font-size: .85rem; }
      </style>
      ${milestones.length === 0
        ? '<p class="empty">برای نمایش نقاط عطف، وظیفه‌ای با isMilestone و تاریخ پایان بساز.</p>'
        : '<div id="t"><p style="color:var(--color-text-subtle)">در حال رسم...</p></div>'}
    `;
  }

  async draw() {
    if (!this._chart || !this._mermaid || !this.$('#t')) return;
    try {
      const { svg } = await this._mermaid.render('ms', this._chart);
      this.$('#t').innerHTML = svg;
    } catch (e) {
      this.$('#t').textContent = e.message;
    }
  }
}
customElements.define('cockpit-milestones', CockpitMilestones);