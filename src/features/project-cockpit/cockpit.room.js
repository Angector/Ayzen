import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml, projectProgress } from '../../shared/lib/pure.js';
import './cockpit.tasks.js';
import './cockpit.kanban.js';
import './cockpit.gantt.js';
import './cockpit.wbs.js';
import './cockpit.mindmap.js';
import './cockpit.risks.js';
import './cockpit.milestones.js';
import './cockpit.decisions.js';
import './cockpit.dashboard.js';
import '../../shared/ui/app-button.js';

const TABS = [
  ['tasks', '📋 وظایف'],
  ['kanban', '🗂️ کانبان'],
  ['gantt', '📅 گانت'],
  ['wbs', '🧩 WBS'],
  ['mindmap', '🧠 مایندمپ'],
  ['risks', '⚠️ ریسک‌ها'],
  ['milestones', '🎯 نقاط عطف'],
  ['decisions', '📝 تصمیم‌ها'],
  ['dashboard', '📊 داشبورد'],
];

export class CockpitRoom extends BaseComponent {
  constructor() { super(); this._tab = 'tasks'; }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this._unsub?.(); }

  render() {
    const { activeProjectId, projects, tasksByProject = {} } = store.snap();
    const project = projects?.find(p => p.id === activeProjectId);

    if (!project) {
      this.shadowRoot.innerHTML = '<p style="padding:40px;text-align:center;color:var(--color-text-subtle)">پروژه پیدا نشد.</p>';
      return;
    }

    const tasks = tasksByProject[project.id] ?? [];
    const pct = projectProgress(tasks);
    const doing = tasks.filter(t => t.status === 'doing').length;
    const risks = tasks.filter(t => t.kind === 'risk').length;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 1200px; margin: 0 auto; }
        .status {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 12px 16px; margin-bottom: 12px;
        }
        .status b { color: var(--color-text-default); }
        .status span { font-size: .85rem; color: var(--color-text-muted); }
        .pct { margin-right: auto; font-weight: 600; color: var(--color-brand); }
        .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
        .tab {
          padding: 6px 12px; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--color-border); background: transparent;
          color: var(--color-text-muted); font: inherit; font-size: .82rem;
        }
        .tab.active { background: var(--color-brand); color: #fff; border-color: transparent; }
        .tab:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
        #panel { min-height: 300px; }
        .back { margin-bottom: 12px; }
      </style>
      <div class="back">
        <app-button id="back">← همه پروژه‌ها</app-button>
      </div>
      <div class="status">
        <b>${escapeHtml(project.name)}</b>
        <span>${tasks.length} وظیفه</span>
        <span>Doing: ${doing}</span>
        <span>⚠️ ${risks} ریسک</span>
        <span class="pct">${pct}٪</span>
      </div>
      <div class="tabs">
        ${TABS.map(([k, l]) => `<button class="tab ${this._tab === k ? 'active' : ''}" data-tab="${k}">${l}</button>`).join('')}
      </div>
      <div id="panel"></div>
    `;

    this.$('#back')?.addEventListener('click', () => store.set({ view: 'projects' }));

    this.$$('.tab').forEach(b => b.addEventListener('click', () => {
      this._tab = b.dataset.tab;
      this.render();
    }));

    const tag = {
      tasks: 'cockpit-tasks', kanban: 'cockpit-kanban', gantt: 'cockpit-gantt',
      wbs: 'cockpit-wbs', mindmap: 'cockpit-mindmap', risks: 'cockpit-risks',
      milestones: 'cockpit-milestones', decisions: 'cockpit-decisions',
      dashboard: 'cockpit-dashboard',
    }[this._tab];

    this.$('#panel').innerHTML = `<${tag}></${tag}>`;
  }
}
customElements.define('cockpit-room', CockpitRoom);