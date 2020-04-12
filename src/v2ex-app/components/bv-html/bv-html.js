import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-html">
  <template strip-whitespace="">
      <style>
      :host {
        display: inline-block;
      }
      </style>

      <slot name="content"></slot>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * @customElement
 * @polymer
 */
class BVHtml extends PolymerElement {
  static get is() { return 'bv-html'; }
  static get properties() {
    return {
      html: {
        type: String,
        observer: '_htmlChanged'
      },
      unescape: {
        type: Boolean,
        value: false
      }
    };
  }
  _htmlChanged(html) {
    var child = dom(this).queryDistributedElements('*')[0];
    if (this.unescape) {
      html = this._unescapeHtml(html);
    }
    if (child) {
      dom(child).innerHTML = html;
    } else {
      dom(this.root).innerHTML = html;
    }
  }
  _unescapeHtml(html) {
    var textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.textContent;
  }
}

window.customElements.define(BVHtml.is, BVHtml);
