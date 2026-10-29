import { BaseComponent } from '../../shared/ui/base-component.js';
import { track } from '../../shared/analytics/analytics.client.js';

const KEY = 'pcc_last_survey';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export class InsightsSurvey extends BaseComponent {
  render() {
    const last = Number(localStorage.getItem(KEY) ?? 0);
    const canShow = Date.now() - last > WEEK_MS;

    if (!canShow) {
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; margin-top: 16px; }
          p { color: var(--color-text-subtle); font-size: .85rem; margin: 0; }
        </style>
        <p>نظرسنجی این هفته ثبت شد.</p>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-top: 16px; }
        .box {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 14px;
        }
        p { margin: 0; font-size: .85rem; color: var(--color-text-muted); }
        .row { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
        button {
          padding: 6px 14px; border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent; color: var(--color-text-default);
          cursor: pointer; font: inherit; font-size: .85rem;
        }
        button:hover { border-color: var(--color-brand); }
        button:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      <div class="box">
        <p>این هفته چطور بود؟</p>
        <div class="row">
          <button data-v="good">عالی</button>
          <button data-v="ok">متوسط</button>
          <button data-v="bad">ضعیف</button>
        </div>
      </div>
    `;

    this.$$('button').forEach(b => b.addEventListener('click', () => {
      track('survey.response', { value: b.dataset.v });
      localStorage.setItem(KEY, String(Date.now()));
      this.render();
    }));
  }
}
customElements.define('insights-survey', InsightsSurvey);