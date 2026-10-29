import { BaseComponent } from '../../shared/ui/base-component.js';
import { KEYWORD_BANK } from './knowledge.data.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class KnowledgeKeywords extends BaseComponent {
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .group { margin-bottom: 20px; }
        .group h3 { font-size: .9rem; margin: 0 0 8px; color: var(--color-text-muted); font-weight: 500; }
        .chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip {
          padding: 4px 10px; border-radius: 999px; cursor: pointer;
          background: var(--color-bg); border: 1px solid var(--color-border);
          color: var(--color-text-subtle); font-size: .8rem;
          transition: border-color 120ms ease;
          font: inherit;
        }
        .chip:hover { border-color: var(--color-brand); color: var(--color-text-default); }
        .chip.copied { border-color: var(--color-success); color: var(--color-success); }
        .chip:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      ${Object.entries(KEYWORD_BANK).map(([key, g]) => `
        <div class="group">
          <h3>${escapeHtml(g.label)}</h3>
          <div class="chips">
            ${g.words.map(w => `<button class="chip" data-word="${escapeHtml(w)}">${escapeHtml(w)}</button>`).join('')}
          </div>
        </div>
      `).join('')}
    `;

    this.$$('.chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        await navigator.clipboard.writeText(chip.dataset.word);
        chip.classList.add('copied');
        setTimeout(() => chip.classList.remove('copied'), 1000);
      });
    });
  }
}
customElements.define('knowledge-keywords', KnowledgeKeywords);