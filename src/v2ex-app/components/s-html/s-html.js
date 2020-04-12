import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class SHtml extends PolymerElement {
  static get template() {
    return html``;
  }
  static get properties() {
    return {
      html: {
        type: String,
        observer: '_contentChanged'
      }
    };
  }
  constructor() {
    super();
  }
  _contentChanged(newValue) {
    this.shadowRoot.innerHTML = newValue;
  }
}

customElements.define('s-html', SHtml);
