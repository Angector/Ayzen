import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { tasksToJsMindTree } from '../../shared/lib/pure.js';

const JSMIND_JS = 'https://cdn.jsdelivr.net/npm/jsmind@0.9.1/es6/jsmind.js';
const JSMIND_CSS = 'https://cdn.jsdelivr.net/npm/jsmind@0.9.1/style/jsmind.css';

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

export class CockpitMindmap extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    loadCss(JSMIND_CSS);
    try { await loadScript(JSMIND_JS); } catch { /* ignore */ }
    this.render();
  }

  render() {
    const { activeProjectId, projects = [], tasksByProject = {} } = store.snap();
    const project = projects.find(p => p.id === activeProjectId);
    const tasks = tasksByProject[activeProjectId] ?? [];
    if (!project) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        #jsmind {
          width: 100%; height: 500px;
          background: var(--color-bg); border-radius: 8px;
        }
        .empty { color: var(--color-text-subtle); text-align: center; padding: 40px; }
      </style>
      ${tasks.length === 0
        ? '<p class="empty">برای نمایش مایندمپ، ابتدا وظایف را اضافه کن.</p>'
        : '<div id="jsmind"></div>'}
    `;

    if (tasks.length && window.jsMind) {
      try {
        const mind = tasksToJsMindTree(project, tasks);
        const jm = new window.jsMind({
          container: this.$('#jsmind'),
          editable: false,
          theme: 'primary',
          view: { hmargin: 100, vmargin: 50, line_width: 2, line_color: '#555' },
        });
        jm.show(mind);
      } catch (err) {
        this.$('#jsmind').textContent = 'خطا: ' + err.message;
      }
    }
  }
}
customElements.define('cockpit-mindmap', CockpitMindmap);