import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class FadeInImage extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
      }
    </style>
`;
  }

  static get is() { return 'bv-fadein-image'; }
  static get properties() {
    return {
      src: {
        type: String,
        observer: '_srcChange'
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      }
    };
  }
  constructor() {
    super();
    this._sid = 0;
  }
  _srcChange(src) {
    const sid = ++this._sid;
    this.style.removeProperty('background-image');
    this.style.setProperty('opacity', 0);
    let img = new Image();
    img.src = src;
    img.onload = () => {
      if (sid === this._sid) {
        this.style.setProperty('background-image', 'url(' + src + ')');
        // this.style.setProperty('width', (this.width || img.width) + 'px');
        // this.style.setProperty('height', (this.height || img.height) + 'px');
        this.animate([{opacity: 0}, {opacity: 1}], {
          duration: 300,
          fill: 'both',
          easing: 'ease-out'
        });
      }
    };
    img.onerror = () => {
      this.dispatchEvent(new CustomEvent('image-error', {detail: src}));
    };
  }
}

window.customElements.define(FadeInImage.is, FadeInImage);
