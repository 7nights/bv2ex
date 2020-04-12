import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors';
// import 's-html/s-html.js';
import '../../components/s-html/s-html.js';
import '../../font-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
const containerAnimationOptions = {
  duration: 300,
  easing: 'cubic-bezier(.25,.1,.25,1)'
};
/**
 * @customElement
 * @polymer
 */
class PostPreview extends mixinBehaviors([BVBehaviors.UtilBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="font-icons">
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - var(--bv-toolbar-height));
        margin-top: var(--bv-toolbar-height);
        z-index: 11;
        display: none;
        will-change: transform;
        overscroll-behavior: contain;
      }
      scale-animation-container {
        --sac-height: 100%;
        --sac-width: 100%;
        box-sizing: border-box;
        background-color: var(--surface-8dp);
        --sac-animation-duration: .3s;
      }
      s-html {
        display: block;
        flex: 1;
        padding: 0 20px;
        font-size: 14px;
        overflow: hidden;
        word-break: break-all;
      }
      .content {
        overflow: hidden;
        flex: 1;
        position: relative;
      }
      .mask {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 80px;
        width: 100%;
        background-image: linear-gradient(180deg, rgba(255, 255, 255, 0), var(--surface-8dp));
      }
      .read-more {
        @apply --bv-gradient-bg;
        width: 105px;
        height: 36px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .24);
        justify-content: center;
        align-items: center;
        margin: 20px auto 60px;
        border-radius: 36px;
        display: flex;
      }
      .read-more:hover {
        opacity: .3;
      }
      .read-more .material-icons {
        font-size: 16px;
        margin-right: 4px;
      }
    </style>

    <template is="dom-if" if="{{post}}">
      <scale-animation-container id="sac" mode="Y" initial-scale="[[initScale]]">
        <bv-timeline-post post="[[post]]"></bv-timeline-post>
        <div class="content">
          <s-html html="[[contentRendered]]"></s-html>
          <div class="mask"></div>
        </div>
        <div class="read-more" data-preview-read-more-btn="true">
          <i class="material-icons">visibility</i>
          <span>Read more</span>
        </div>
      </scale-animation-container>
    </template>
`;
  }

  static get is() { return 'bv-post-preview'; }
  static get properties() {
    return {
      post: {
        type: Object,
        value: undefined
      },
      initScale: {
        type: Number,
        value: .1
      },
      contentRendered: {
        type: String,
        computed: 'getContent(post.content)'
      }
    };
  }
  connectedCallback() {
    if (this.parentElement !== document.body) {
      document.body.appendChild(this);
    }
  }
  getContent(c) {
    if (c === null) return '<div style="color: #999; text-align: center;">No content to preview.</div>';
    if (!c) return '';
    return this._filterHTMLTag(c || '', 1);
  }
  show(post) {
    this.showing = true;
    this.post = post.post;
    const rect = post.getClientRects()[0];
    let y = rect.top;
    this.initScale = post.clientHeight / document.documentElement.clientHeight;
    this.style.display = 'block';
    if (!this._toolbarHeight) {
      this._toolbarHeight = parseInt(getComputedStyle(this).getPropertyValue('--bv-toolbar-height'), 10) || 56;
    }

    this._lastY = y - this._toolbarHeight;
    this.animate({
      transform: ['translate3d(0, ' + this._lastY + 'px, 0)', 'translate3d(0, 0, 0)']
    }, containerAnimationOptions);
    flush();
    this.shadowRoot.querySelector('#sac').updateStyles();
    this.shadowRoot.querySelector('#sac').expand();
  }
  updateContent(c, t) {
    if (t === this._normalizeTopic(this.post.t)) {
      this.set('post.content', c);
    }
  }
  hide(immediate) {
    if (!this.post || !this.showing) return;
    this.showing = false;
    if (immediate) {
      this.style.display = 'none';
      this.post = void 0;
      return;
    }
    this.shadowRoot.querySelector('#sac').collapse();
    let animation = this.animate({
      transform: ['translate3d(0, 0, 0)', 'translate3d(0, ' + this._lastY + 'px, 0)']
    }, containerAnimationOptions);
    animation.onfinish = () => {
      this.style.display = 'none';
      this.post = void 0;
    };
  }
}

window.customElements.define(PostPreview.is, PostPreview);
