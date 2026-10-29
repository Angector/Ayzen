import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import {
  escapeHtml,
  groupTasksByStatus,
  TASK_STATUSES,
  STATUS_LABELS,
} from '../../shared/lib/pure.js';
import * as db from '../../shared/lib/db.js';

const SORTABLE_URL = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.7/modular/sortable.esm.js';
let SortablePromise;
function loadSortable() {
  if (!SortablePromise) SortablePromise = import(SORTABLE_URL).then(m => m.default);
  return SortablePromise;
}

export class CockpitKanban extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    this._sortable = await loadSortable();
    this.render();
  }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = tasksByProject[activeProjectId] ?? [];
    const groups = groupTasksByStatus(tasks);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 700px) { .board { grid-template-columns: 1fr; } }
        .col {
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 10px; min-height: 160px;
        }
        .col h4 {
          margin: 0 0 8px; font-size: .85rem; color: var(--color-text-muted);
          font-weight: 500;
        }
        .drop { display: flex; flex-direction: column; gap: 6px; min-height: 80px; }
        .card {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 8px 10px; font-size: .82rem;
          cursor: grab;
        }
        .card:active { cursor: grabbing; }
        .ghost { opacity: .4; }
      </style>
      <div class="board">
        ${TASK_STATUSES.map(s => `
          <div class="col" data-status="${s}">
            <h4>${STATUS_LABELS[s]} (${groups[s].length})</h4>
            <div class="drop" data-status="${s}">
              ${groups[s].map(t => `<div class="card" data-id="${escapeHtml(t.id)}">${escapeHtml(t.title)}</div>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.$$('.drop').forEach(drop => {
      this._sortable.create(drop, {
        group: 'kanban',
        animation: 150,
        ghostClass: 'ghost',
        onEnd: async (evt) => {
          const taskId = evt.item.dataset.id;
          const newStatus = evt.to.dataset.status;
          const newOrder = evt.newIndex;
          const { activeProjectId, tasksByProject = {} } = store.snap();
          const task = (tasksByProject[activeProjectId] ?? []).find(t => t.id === taskId);
          if (!task) return;
          await db.putTask({ ...task, status: newStatus, order: newOrder });
          const fresh = await db.getTasksByProject(activeProjectId);
          store.set({ tasksByProject: { ...tasksByProject, [activeProjectId]: fresh } });
        },
      });
    });
  }
}
customElements.define('cockpit-kanban', CockpitKanban);