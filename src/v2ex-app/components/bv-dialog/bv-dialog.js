import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-dialog">
  <template strip-whitespace="">
      <style>
      :host {
        overflow: auto;
        overscroll-behavior-y: none;
        --paper-dialog-background-color: var(--surface-24dp);
      }
      paper-dialog {
        width: 80vw;
        border-radius: 4px;
        overflow: auto;
        overscroll-behavior-y: none;
        --paper-font-title_-_font-size: 18px;

        animation-name: fade-in-scale;
        animation-duration: .2s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
      }
      @keyframes fade-in-scale {
        0% {
          transform: scale(.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      paper-button {
        font-family: 'Google Sans';
        color: var(--blue);
        font-weight: 500;
      }
      :host-context(.theme-dark) h2 {
        color: var(--light-text-primary-color);
      }
      :host-context(.theme-dark) p {
        color: var(--light-text-secondary-color);
      }
      p {
        color: #555;
        font-size: 15px;
      }
      .hide {
        display: none;
      }
      paper-dialog h2 {
        margin-top: 22px !important;
      }
      </style>
      <paper-dialog id="dialog" modal="">
        <h2 class\$="[[_hideTitle(title)]]">[[title]]</h2>
        <p>[[content]]</p>
        <div class="buttons">
          <paper-button dialog-dismiss="" on-click="_onNegativeClick">[[negativeText]]</paper-button>
          <paper-button dialog-confirm="" on-click="_onPositiveClick">[[positiveText]]</paper-button>
        </div>
      </paper-dialog>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * @customElement
 * @polymer
 */
class BVDialog extends PolymerElement {
  static get is() { return 'bv-dialog'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      }
    };
  }
  connectedCallback() {
    this.app.dialog = this;
    window.dialog = this;

    this.title = '';
    this.content = '';
    this.positiveText = '';
    this.negativeText = '';
  }
  _hideTitle() {
    if (this.title) return '';
    return 'hide';
  }
  open({
    title = '',
    content = '',
    positiveText = 'OK',
    negativeText = 'CANCEL'
  } = {}) {
    return new Promise((resolve, reject) => {
      this.title = title;
      this.content = content;
      this.positiveText = positiveText;
      this.negativeText = negativeText;
      this._resolve = resolve;
      this._reject = reject;

      this.$.dialog.open();
    });
  }
  _onPositiveClick() {
    this._resolve();
  }
  _onNegativeClick() {
    this._reject();
  }
}

window.customElements.define(BVDialog.is, BVDialog);
