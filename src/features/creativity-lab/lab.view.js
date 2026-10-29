import { BaseComponent } from '../../shared/ui/base-component.js';
import { getAllPlugins } from '../../plugins/registry.js';

/* side-effect imports — همه‌ی Pluginها ثبت می‌شوند */
import '../../plugins/roulette.plugin.js';
import '../../plugins/evolution.plugin.js';
import '../../plugins/clinic.plugin.js';
import '../../plugins/character.plugin.js';
import '../../plugins/json-export.plugin.js';
import '../../plugins/self-consistency.plugin.js';
import '../../plugins/chain-verify.plugin.js';
import '../../plugins/weekly-reminder.plugin.js';

export class CreativityLab extends BaseComponent {
  constructor() {
    super();
    this._active = null;
    this._mountedPlugin = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._plugins = getAllPlugins();
    this._active = this._plugins[0]?.id ?? null;
    this.render();
  }

  disconnectedCallback() {
    this._mountedPlugin?.unmount?.();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 1000px; margin: 0 auto; }
        h1 { font-size: var(--text-display); margin-bottom: 16px; }
        .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .tab {
          padding: 8px 14px; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--color-border); background: transparent;
          color: var(--color-text-muted); font: inherit; font-size: .85rem;
        }
        .tab.active { background: var(--color-brand); color: #fff; border-color: transparent; }
        .tab:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
        #panel { min-height: 300px; }
      </style>
      <h1>آزمایشگاه خلاقیت</h1>
      <div class="tabs">
        ${this._plugins.map(p => `
          <button class="tab ${this._active === p.id ? 'active' : ''}" data-id="${p.id}">
            ${p.icon} ${p.title}
          </button>
        `).join('')}
      </div>
      <div id="panel"></div>
    `;

    this.$$('.tab').forEach(b => b.addEventListener('click', () => {
      this._mountedPlugin?.unmount?.();
      this._active = b.dataset.id;
      this.render();
    }));

    const plugin = this._plugins.find(p => p.id === this._active);
    if (plugin) {
      const panel = this.$('#panel');
      plugin.mount(panel);
      this._mountedPlugin = plugin;
    }
  }
}
customElements.define('creativity-lab', CreativityLab);