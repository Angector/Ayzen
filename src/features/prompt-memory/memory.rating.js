import { BaseComponent } from '../../shared/ui/base-component.js';
import { computeRating } from '../../shared/lib/pure.js';
import { escapeHtml } from '../../shared/lib/pure.js';

export class MemoryRating extends BaseComponent {
  static get observedAttributes() { return ['faithfulness', 'task-completion']; }

  set prompt(p) {
    this._prompt = p;
    this._rating = p.rating ?? { faithfulness: 0, taskCompletion: 0, overall: 0 };
    if (this._mounted) this.render();
  }

  render() {
    if (!this._prompt) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .wrap { display: flex; flex-direction: column; gap: 8px; }
        .row { display: flex; align-items: center; gap: 8px; }
        .label {
          font-size: .8rem; color: var(--color-text-muted);
          min-width: 100px;
        }
        fieldset {
          border: none; padding: 0; margin: 0;
          display: flex; gap: 2px;
        }
        fieldset legend {
          position: absolute; width: 1px; height: 1px;
          overflow: hidden; clip: rect(0 0 0 0);
        }
        .star {
          font-size: 1.1rem; cursor: pointer;
          background: none; border: none;
          color: var(--color-border-strong);
          transition: color 120ms ease, transform 120ms ease;
          padding: 2px;
          line-height: 1;
        }
        .star:hover:not(:disabled) { transform: scale(1.15); }
        .star.filled { color: var(--color-warning); }
        .star:focus-visible {
          outline: 2px solid var(--color-brand);
          outline-offset: 2px;
          border-radius: 4px;
        }
        .overall {
          font-size: .75rem; color: var(--color-text-subtle);
          padding: 3px 8px; background: var(--color-bg);
          border-radius: 6px; align-self: flex-start;
          font-family: system-ui, sans-serif;
        }
      </style>
      <div class="wrap">
        ${this.row('وفاداری', 'faithfulness', this._rating.faithfulness)}
        ${this.row('تکمیل وظیفه', 'taskCompletion', this._rating.taskCompletion)}
        <span class="overall">امتیاز کلی: ${this._rating.overall ?? 0} / 5</span>
      </div>
    `;

    this.$$('.star').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setScore(btn.dataset.axis, Number(btn.dataset.value));
      });
    });
  }

  row(label, axis, value) {
    return `
      <div class="row">
        <span class="label">${escapeHtml(label)}</span>
        <fieldset>
          <legend>${escapeHtml(label)}</legend>
          ${[1, 2, 3, 4, 5].map(n => `
            <button class="star ${n <= value ? 'filled' : ''}"
              data-axis="${axis}" data-value="${n}"
              aria-label="${escapeHtml(label)} ${n} از ۵"
              type="button">★</button>
          `).join('')}
        </fieldset>
      </div>
    `;
  }

  setScore(axis, value) {
    const current = { ...this._rating };
    current[axis] = value;
    const next = computeRating(current.faithfulness, current.taskCompletion);
    this._rating = next;
    this.render();
    this.emit('rating-change', { promptId: this._prompt.id, rating: next });
  }
}
customElements.define('memory-rating', MemoryRating);