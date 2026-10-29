import { BaseComponent } from '../../shared/ui/base-component.js';
import { escapeHtml } from '../../shared/lib/pure.js';

const KEY = 'pcc_experiments';

export class InsightsExperiments extends BaseComponent {
  render() {
    const list = JSON.parse(localStorage.getItem(KEY) ?? '[]');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; margin-top: 16px; }
        .box {
          background: var(--color-surface); border: 1px solid var(--color-border);
          border-radius: var(--radius-card); padding: 14px;
        }
        .box > strong {
          font-size: .85rem; color: var(--color-text-muted);
          display: block; margin-bottom: 8px; font-weight: 500;
        }
        .item {
          border-right: 3px solid var(--color-brand);
          padding: 6px 10px; margin-top: 8px;
          font-size: .85rem; color: var(--color-text-muted);
        }
        .item b { color: var(--color-text-default); }
        .empty {
          color: var(--color-text-subtle); font-size: .85rem;
          padding: 8px 0;
        }
        input {
          font: inherit; padding: 6px 10px; width: 100%;
          box-sizing: border-box;
          background: var(--color-bg); color: var(--color-text-default);
          border: 1px solid var(--color-border); border-radius: 8px;
          margin-top: 6px;
        }
        input:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 1px; }
        button {
          margin-top: 8px; padding: 6px 14px; border-radius: 8px;
          border: none; background: var(--color-brand); color: #fff;
          cursor: pointer; font: inherit; font-size: .85rem;
        }
        button:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
      </style>
      <div class="box">
        <strong>🧪 آزمایش‌های N-of-1</strong>
        ${list.length === 0
          ? '<p class="empty">هنوز آزمایشی ثبت نشده.</p>'
          : list.map(e => `
              <div class="item">
                <b>${escapeHtml(e.hypothesis)}</b><br>
                <span>معیار: ${escapeHtml(e.metric)}</span>
              </div>
            `).join('')}
        <input id="hyp" placeholder="فرضیه (مثلاً: ترتیب جدید لیست بهتر است)">
        <input id="met" placeholder="معیار موفقیت (مثلاً: نرخ کپی)">
        <button id="add">+ افزودن آزمایش</button>
      </div>
    `;

    this.$('#add').addEventListener('click', () => {
      const hypothesis = this.$('#hyp').value.trim();
      const metric = this.$('#met').value.trim();
      if (!hypothesis || !metric) { alert('فرضیه و معیار را پر کن'); return; }
      const arr = JSON.parse(localStorage.getItem(KEY) ?? '[]');
      arr.push({ hypothesis, metric, startedAt: new Date().toISOString() });
      localStorage.setItem(KEY, JSON.stringify(arr));
      this.render();
    });
  }
}
customElements.define('insights-experiments', InsightsExperiments);