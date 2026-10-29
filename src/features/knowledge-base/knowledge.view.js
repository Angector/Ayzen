import { BaseComponent } from '../../shared/ui/base-component.js';
import { store } from '../../shared/lib/store.js';
import './knowledge.formulas.js';
import './knowledge.dialects.js';
import './knowledge.keywords.js';
import './knowledge.techniques.js';
import './knowledge.clinic.js';
import './knowledge.dev-workshop.js';
import './knowledge.production.js';

const TABS = [
  ['formulas', '📐 فرمول‌ها'],
  ['dialects', '🧭 گویش مدل‌ها'],
  ['keywords', '🏷️ بانک کلمات'],
  ['techniques', '⚡ تکنیک‌های پیشرفته'],
  ['clinic', '🩺 کلینیک پرامپت'],
  ['devWorkshop', '🛠️ کارگاه توسعه'],
  ['production', '⚙️ ستون‌های تولید'],
];

export class KnowledgeView extends BaseComponent {
  constructor() { super(); this._tab = 'formulas'; }

  connectedCallback() {
    super.connectedCallback();
    this._unsub = store.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() { this._unsub?.(); }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px; max-width: 1000px; margin: 0 auto; }
        h1 { font-size: var(--text-display); margin-bottom: 16px; }
        .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .tab {
          padding: 8px 16px; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--color-border); background: transparent;
          color: var(--color-text-muted); font: inherit; font-size: .85rem;
        }
        .tab.active { background: var(--color-brand); color: #fff; border-color: transparent; }
        .tab:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
        #panel { min-height: 300px; }
      </style>
      <h1>بانک دانش</h1>
      <div class="tabs">
        ${TABS.map(([k, l]) => `<button class="tab ${this._tab === k ? 'active' : ''}" data-tab="${k}">${l}</button>`).join('')}
      </div>
      <div id="panel"></div>
    `;

    this.$$('.tab').forEach(b => b.addEventListener('click', () => {
      this._tab = b.dataset.tab;
      this.render();
    }));

    const tag = {
      formulas: 'knowledge-formulas',
      dialects: 'knowledge-dialects',
      keywords: 'knowledge-keywords',
      techniques: 'knowledge-techniques',
      clinic: 'knowledge-clinic',
      devWorkshop: 'knowledge-dev-workshop',
      production: 'knowledge-production',
    }[this._tab];

    this.$('#panel').innerHTML = `<${tag}></${tag}>`;
  }
}
customElements.define('knowledge-view', KnowledgeView);