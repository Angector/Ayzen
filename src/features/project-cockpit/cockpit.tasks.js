import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { escapeHtml, TASK_STATUSES, STATUS_LABELS } from '../../shared/lib/pure.js';
import * as db from '../../shared/lib/db.js';
import '../../shared/ui/app-button.js';

export class CockpitTasks extends BaseComponent {
  connectedCallback() { super.connectedCallback(); this.render(); }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = (tasksByProject[activeProjectId] ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
        input, select {
          font: inherit; padding: 8px 10px; background: var(--color-bg);
          color: var(--color-text-default); border: 1px solid var(--color-border);
          border-radius: 8px;
        }
        input:focus-visible, select:focus-visible {
          outline: 2px solid var(--color-brand); outline-offset: 1px;
        }
        .list { display: flex; flex-direction: column; gap: 8px; }
        .task {
          display: grid; grid-template-columns: 1fr 120px 120px 120px auto;
          gap: 8px; align-items: center;
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 8px 12px; font-size: .85rem;
        }
        @media (max-width: 700px) {
          .task { grid-template-columns: 1fr; }
        }
        .task.done { opacity: .6; }
        .task input[type="text"] {
          background: transparent; border: none; padding: 4px;
          color: var(--color-text-default); font: inherit;
        }
        .task input[type="text"]:focus-visible {
          outline: 2px solid var(--color-brand); outline-offset: 1px;
          border-radius: 4px;
        }
        .empty {
          color: var(--color-text-subtle); text-align: center; padding: 40px;
          font-size: .85rem;
        }
      </style>
      <div class="toolbar">
        <input id="new-title" placeholder="عنوان وظیفه جدید..." style="flex:1;min-width:180px">
        <app-button variant="primary" id="add">+ افزودن</app-button>
      </div>
      <div class="list">
        ${tasks.length === 0 ? '<p class="empty">هنوز وظیفه‌ای نیست.</p>' : ''}
        ${tasks.map(t => `
          <div class="task ${t.status === 'done' ? 'done' : ''}" data-id="${escapeHtml(t.id)}">
            <input type="text" value="${escapeHtml(t.title)}" data-field="title">
            <select data-field="status">
              ${TASK_STATUSES.map(s => `<option value="${s}" ${t.status === s ? 'selected' : ''}>${STATUS_LABELS[s]}</option>`).join('')}
            </select>
            <input type="date" value="${t.start ?? ''}" data-field="start">
            <input type="date" value="${t.end ?? ''}" data-field="end">
            <app-button variant="danger" data-action="del">🗑️</app-button>
          </div>
        `).join('')}
      </div>
    `;

    this.$('#add')?.addEventListener('click', () => this.addTask());
    this.$('#new-title')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.addTask();
    });

    this.$$('.task').forEach(el => {
      el.addEventListener('change', e => {
        const field = e.target.dataset.field;
        if (field) this.updateTask(el.dataset.id, field, e.target.value);
      });
      el.querySelector('[data-action="del"]')?.addEventListener('click', () => {
        this.deleteTask(el.dataset.id);
      });
    });
  }

  async addTask() {
    const title = this.$('#new-title')?.value.trim();
    if (!title) return;
    const { activeProjectId } = store.snap();
    await db.putTask({
      id: `tsk-${Date.now()}`,
      projectId: activeProjectId,
      title,
      status: 'backlog',
    });
    await this.refresh();
  }

  async updateTask(id, field, value) {
    const { tasksByProject = {}, activeProjectId } = store.snap();
    const task = (tasksByProject[activeProjectId] ?? []).find(t => t.id === id);
    if (!task) return;
    await db.putTask({ ...task, [field]: value });
    await this.refresh();
  }

  async deleteTask(id) {
    if (!confirm('حذف شود؟')) return;
    await db.deleteTask(id);
    await this.refresh();
  }

  async refresh() {
    const { activeProjectId } = store.snap();
    const tasksByProject = { ...store.get().tasksByProject };
    tasksByProject[activeProjectId] = await db.getTasksByProject(activeProjectId);
    store.set({ tasksByProject });
  }
}
customElements.define('cockpit-tasks', CockpitTasks);