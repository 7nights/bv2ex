import { PolymerElement } from '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-backdrop">
  <template strip-whitespace="">
      <style>
      :host {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background-color: rgba(0, 0, 0, 0);
        display: none;
      }
      .container {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--surface-4dp);
        box-shadow: 0 -1px 6px rgba(0, 0, 0, .08);
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        transform: translate3d(0, 100%, 0);
      }
      .subtitle {
        font-size: 14px;
      }
      
      </style>
      <div class="container" id="container">
        <div class="subtitle">[[subtitle]]</div>
        <slot name="content"></slot>
      </div>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * @customElement
 * @polymer
 */
class BVBackdrop extends PolymerElement {
  static get is() { return 'bv-backdrop'; }
  static get properties() {
    return {
      subtitle: {
        type: String,
        value: ''
      }
    };
  }
  connectedCallback() {
    this.addEventListener('click', (ev) => {
      const nodes = ev.composedPath();
      for (let i = 0, len = nodes.length; i < len; i++) {
        if (nodes[i].classList && nodes[i].classList.contains('reply-content')) return;
      }

      this.hide();
    });
  }
  show() {
    if (this.hiding) return;
    this.style.display = 'block';
    requestAnimationFrame(() => {
      this.animate([
        { backgroundColor: 'rgba(0, 0, 0, 0)' },
        { backgroundColor: 'rgba(0, 0, 0, .7)' }
      ], {
        duration: 300,
        easing: 'ease-out',
        fill: 'both'
      });
      this.$.container.animate([
        { transform: 'translate3d(0, 100%, 0)' },
        { transform: 'translate3d(0, 0, 0)' }
      ], {
        duration: 300,
        easing: 'ease-out',
        fill: 'both'
      });
    });
  }
  hide() {
    this.hiding = true;
    this.animate([
      { backgroundColor: 'rgba(0, 0, 0, .7)' },
      { backgroundColor: 'rgba(0, 0, 0, 0)' }
    ], {
      duration: 200,
      easing: 'ease-out',
      fill: 'both'
    });
    this.$.container.animate([
      { transform: 'translate3d(0, 0, 0)' },
      { transform: 'translate3d(0, 100%, 0)' }
    ], {
      duration: 200,
      easing: 'ease-out',
      fill: 'both'
    })
      .onfinish = () => {
        this.style.display = 'none';
        this.hiding = false;
      };
  }
}

window.customElements.define(BVBackdrop.is, BVBackdrop);
