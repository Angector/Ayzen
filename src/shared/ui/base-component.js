export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host { box-sizing: border-box; }
      *, *::before, *::after { box-sizing: inherit; }
      button { font: inherit; cursor: pointer; }
      [hidden] { display: none !important; }
    `);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    if (!this._mounted) {
      this.render();
      this._mounted = true;
    }
  }

  render() {}

  $(sel) { return this.shadowRoot.querySelector(sel); }
  $$(sel) { return [...this.shadowRoot.querySelectorAll(sel)]; }

  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}