import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml, projectProgress } from '../../shared/lib/pure.js';
import * as db from '../../shared/lib/db.js';
import { PROJECT_TEMPLATES } from './cockpit.templates.js';
import '../../shared/ui/app-button.js';

export class CockpitView extends BaseComponent {
  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this._unsub?.(); }

  render() {
    const { projects = [], tasksByProject = {} } = store.snap();

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 1100px; margin: 0 auto; }
        .head {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
        }
        h1 { margin: 0; font-size: var(--text-display); }
        .grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 16px;
          display: flex; flex-direction: column; gap: 10px; cursor: pointer;
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .card:hover { transform: translateY(-2px); border-color: var(--color-border-strong); }
        .card:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
        h3 { margin: 0; font-size: 1rem; }
        .meta { font-size: .8rem; color: var(--color-text-subtle); }
        .bar {
          height: 6px; background: var(--color-bg); border-radius: 999px;
          overflow: hidden;
        }
        .bar > i {
          display: block; height: 100%; background: var(--color-brand);
          width: 0; transition: width 300ms ease;
        }
        .empty {
          text-align: center; padding: 60px; color: var(--color-text-subtle);
          grid-column: 1 / -1;
        }
        .empty h2 { color: var(--color-text-muted); margin-bottom: 8px; font-size: 1.1rem; }
      </style>
      <div class="head">
        <h1>پروژه‌های من</h1>
        <app-button variant="primary" id="new">+ پروژه جدید</app-button>
      </div>
      <div class="grid">
        ${projects.length === 0
          ? `<div class="empty"><h2>هنوز پروژه‌ای نیست</h2><p>یکی از قالب‌ها را انتخاب کن تا شروع کنیم.</p></div>`
          : projects.map(p => {
              const tasks = tasksByProject[p.id] ?? [];
              const pct = projectProgress(tasks);
              return `
                <article class="card" tabindex="0" data-id="${escapeHtml(p.id)}">
                  <h3>${escapeHtml(p.name)}</h3>
                  <span class="meta">${tasks.length} وظیفه · ${pct}٪</span>
                  <div class="bar"><i style="width:${pct}%"></i></div>
                </article>`;
            }).join('')}
      </div>
    `;

    this.$('#new')?.addEventListener('click', () => this.openTemplatePicker());

    this.$$('.card').forEach(el => {
      const open = () => {
        store.set({ view: 'project-room', activeProjectId: el.dataset.id });
      };
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  async openTemplatePicker() {
    const name = prompt('نام پروژه:');
    if (!name?.trim()) return;
    const choices = Object.keys(PROJECT_TEMPLATES);
    const pick = prompt(
      `قالب را انتخاب کن:\n${choices.map((k, i) => `${i + 1}) ${PROJECT_TEMPLATES[k].title}`).join('\n')}\nشماره:`,
    );
    const key = choices[Number(pick) - 1] ?? 'blank';
    const tpl = PROJECT_TEMPLATES[key];

    const project = await db.putProject({ id: `prj-${Date.now()}`, name: name.trim(), template: key });
    const tasks = tpl.tasks.map((t, i) => ({
      id: `tsk-${Date.now()}-${i}`,
      projectId: project.id,
      ...t,
      status: t.status ?? 'backlog',
      order: i,
    }));
    await Promise.all(tasks.map(db.putTask));

    const projects = await db.getAllProjects();
    const tasksByProject = {};
    for (const p of projects) tasksByProject[p.id] = await db.getTasksByProject(p.id);
    store.set({ projects, tasksByProject });
  }
}
customElements.define('cockpit-view', CockpitView);