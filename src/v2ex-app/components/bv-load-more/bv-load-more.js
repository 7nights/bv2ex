import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { animationFrame } from '@polymer/polymer/lib/utils/async.js';
/**
 * @customElement
 * @polymer
 */
class LoadMore extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
      }
    </style>
    <slot></slot>
`;
  }

  static get is() { return 'bv-load-more'; }
  static get properties() {
    return {
      threshold: {
        type: Number,
        value: document.documentElement.clientHeight * 1.2
      },
      disabled: {
        type: Boolean,
        value: true
      },
      limit: {
        type: Number,
        value: 1000
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    // window.addEventListener('scroll', this, {passive: true});
    this._lastDispatched = 0;
    let observer = new IntersectionObserver((entries) => {
      if (this.disabled) return console.log('Loadmore event is prevented because it\'s disabled');
      if (this._dispatched) return console.log('Loadmore event is prevented because it has already dispatched');
      // disappear
      if (!entries[0].isIntersecting) return console.log('loadmore prevented: ', entries);
      console.log(entries);

      this.dispatchLoadmoreEvent();
    }, {
      rootMargin: document.documentElement.clientHeight + this.threshold + 'px'
    });
    observer.observe(this);
  }
  dispatchLoadmoreEvent() {
    let now = Date.now();
    let diff = now - this._lastDispatched;
    if (diff < this.limit) {
      return setTimeout(this.dispatchLoadmoreEvent.bind(this), this.limit - diff + 16);
    }
    if (this.disabled) return;
    console.log('dispatch loadmore!!!');
    this._dispatched = true;
    this._lastDispatched = now;
    this.dispatchEvent(new CustomEvent('loadmore'));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this, {passive: true});
  }
  handleEvent(ev) {
    if (ev.type === 'scroll') {
      if (this.disabled) return;
      if (this._dispatched) return;
      animationFrame.run(() => {
        this.performViewportCheck();
      });
    }
  }
  performViewportCheck() {
    const rect = this.getBoundingClientRect();
    if (rect.top - 2 * document.documentElement.clientHeight <= this.threshold) {
      this.dispatchLoadmoreEvent();
    }
  }
  enable() {
    this.disabled = false;
    this.reset();
  }
  disable() {
    this.disabled = true;
  }
  reset() {
    this._dispatched = false;
    if (this.disabled) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.performViewportCheck();
      });
    });
  }
}

window.customElements.define(LoadMore.is, LoadMore);
