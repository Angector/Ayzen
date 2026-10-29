import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { tasksToGanttRows } from '../../shared/lib/pure.js';

const JSGANTT_JS = 'https://cdn.jsdelivr.net/npm/jsgantt-improved@2.8.0/dist/jsgantt.js';
const JSGANTT_CSS = 'https://cdn.jsdelivr.net/npm/jsgantt-improved@2.8.0/dist/jsgantt.css';

function loadScript(src) {
  return new Promise((res, rej) => {
    if ([...document.scripts].some(s => s.src === src)) return res();
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

function loadCss(href) {
  if ([...document.styleSheets].some(s => s.href === href)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = href;
  document.head.appendChild(l);
}

export class CockpitGantt extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    loadCss(JSGANTT_CSS);
    try {
      await loadScript(JSGANTT_JS);
    } catch {
      // ignore — خطای شبکه؛ پیام خالی نمایش می‌دهیم
    }
    this.render();
  }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = tasksByProject[activeProjectId] ?? [];
    const rows = tasksToGanttRows(tasks);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        #gantt {
          position: relative; background: #fff;
          border-radius: 8px; overflow: auto; padding: 8px;
        }
        .empty {
          color: var(--color-text-subtle); font-size: .85rem;
          text-align: center; padding: 40px;
        }
      </style>
      ${rows.length === 0
        ? '<p class="empty">برای نمایش گانت، به وظایف تاریخ شروع و پایان بده.</p>'
        : '<div id="gantt"></div>'}
    `;

    if (rows.length && window.JSGantt) {
      try {
        const g = new window.JSGantt.GanttChart(this.$('#gantt'), 'day');
        g.setOptions({ vLang: 'fa', vFormatArr: ['Day', 'Week', 'Month'] });
        rows.forEach(r => g.AddTaskItemObject(r));
        g.Draw();
      } catch (err) {
        this.$('#gantt').textContent = 'خطا در رسم گانت: ' + err.message;
      }
    }
  }
}
customElements.define('cockpit-gantt', CockpitGantt);