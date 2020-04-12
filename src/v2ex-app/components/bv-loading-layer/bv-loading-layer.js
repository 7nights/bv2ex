import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class LoadingLayer extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        height: 100vh;
        width: 100vw;
        left: 0;
        top: var(--bv-toolbar-height);
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        background: var(--surface);
        z-index: 10;
        opacity: 1;

        animation-name: page-appear;
        animation-fill-mode: both;
        animation-duration: .3s;
        animation-timing-function: ease-out;
        contain: layout;
        transform: translate3d(0, 0, 0);
      }
      @keyframes page-appear {
        0% {
          transform: translate3d(0, 60px, 0);
        }
        100% {
          transform: translate3d(0, 0, 0);
        }
      }
      paper-spinner-lite {
        position: relative;
        top: calc(0px - var(--bv-toolbar-height));
      }
      
    </style>
    <paper-spinner-lite active=""></paper-spinner-lite>
`;
  }

  static get is() { return 'bv-loading-layer'; }

  hide(animation = true) {
    if (animation) {
      this.animate([{opacity: 1}, {opacity: 0}], {
        duration: 300,
        easing: 'ease-out'
      }).onfinish = () => {
        this.style.display = 'none';
      };
    } else {
      this.style.display = 'none';
    }
  }

  show(animation = true) {
    this.style.display = 'flex';
    if (animation) {
      this.animate([{opacity: 0}, {opacity: 1}], {
        duration: animation ? 300 : 0,
        easing: 'ease-out'
      });
    }
  }
}

window.customElements.define(LoadingLayer.is, LoadingLayer);
