import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import { tasksToMermaidFlowchart, escapeHtml } from '../../shared/lib/pure.js';

const MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

export class CockpitWbs extends BaseComponent {
  async connectedCallback() {
    super.connectedCallback();
    try {
      this._mermaid = (await import(MERMAID_URL)).default;
      this._mermaid.initialize({ startOnLoad: false, theme: 'dark' });
    } catch (err) {
      console.error('[wbs] mermaid failed', err);
    }
    this.render();
    this.draw();
  }

  render() {
    const { activeProjectId, tasksByProject = {} } = store.snap();
    const tasks = tasksByProject[activeProjectId] ?? [];
    const chart = tasksToMermaidFlowchart(tasks);
    this._chart = chart;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        #target {
          background: var(--color-bg); border: 1px solid var(--color-border);
          border-radius: 8px; padding: 16px; overflow: auto;
        }
        pre {
          font-size: .8rem; color: var(--color-text-subtle);
          white-space: pre-wrap; background: var(--color-bg);
          padding: 10px; border-radius: 8px; margin-top: 12px;
        }
        details summary { cursor: pointer; font-size: .85rem; color: var(--color-text-muted); }
      </style>
      <div id="target"><p style="color:var(--color-text-subtle)">در حال رسم...</p></div>
      <details>
        <summary>نمایش کد Mermaid</summary>
        <pre>${escapeHtml(chart)}</pre>
      </details>
    `;
  }

  async draw() {
    if (!this._chart || !this._mermaid) return;
    const target = this.$('#target');
    try {
      const { svg } = await this._mermaid.render('wbs', this._chart);
      target.innerHTML = svg;
    } catch (e) {
      target.textContent = 'خطا در رسم دیاگرام: ' + e.message;
    }
  }
}
customElements.define('cockpit-wbs', CockpitWbs);