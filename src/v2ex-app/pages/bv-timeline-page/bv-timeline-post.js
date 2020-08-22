import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '../../components/bv-time/bv-time.js';
import '../../components/bv-light-button/bv-light-button.js';
import '../../font-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class TimelinePost extends mixinBehaviors([BVBehaviors.UtilBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="font-icons">
      :host {
        display: flex;
        padding: 15px 15px 10px 20px;
      }
      :host-context(.compact) :host {
        padding: 10px 15px 10px 20px;
      }
      :host-context(.compact) bv-light-button {
        height: 24px;
        line-height: 24px;
        min-width: 24px;
        padding: 0 8px;
        font-size: 13px;
        /* border-bottom: 1px solid #f2f2f2;
        padding: 15px 0;
        margin: 0 15px 0 20px; */
      }
      :host-context(.compact)::after {
        /* content: '';
        display: block;
        width: calc(100% - 60px);
        height: 1px;
        background-color: #f2f2f2;
        position: absolute;
        left: 0;
        bottom: 0;
        box-sizing: border-box;
        margin-left: 60px; */
      }
      :host(:active) {
        background-color: rgba(0, 0, 0, .15);
      }
      :host-context(.theme-dark):host(:active) {
        background-color: var(--surface-6dp);
      }
      :host(.hide-thumbs-up) .up-count {
        display: none;
      }
      :host(.align-center) {
        align-items: center;
      }
      :host(.large-padding) {
        padding: 22px 15px 22px 20px;
      }
      .title-and-node {
        line-height: 2rem;
      }
      :host-context(.compact) .title-and-node {
        line-height: 1.2em;
      }
      bv-light-button {
        padding: 0 1.2rem;
        height: 2.6rem;
        line-height: 2.6rem;
        border-radius: 2.6rem;
      }
      .title {
        font-size: 14px;
        font-weight: 500;
        color: var(--light-text-primary-color);
        vertical-align: middle;
        font-family: Roboto, "Source Han Sans";
        word-break: break-all;
      }
      .node-name, .author {
        font-size: 11px;
        vertical-align: middle;
        margin-right: 6px;
        color: var(--text-secondary-color);
      }
      .fa-caret-right {
        /* margin-right: 2px; */
        font-size: 11px;
        color: var(--text-secondary-color);
        margin-left: 2px;
        vertical-align: middle;
      }
      .node-name {
        margin-right: 2px;
        background: #f1f1f1;
        color: #828282;
        /*#c7ad43*/

        border-radius: 9px;
        padding: 0 6px;
        line-height: 18px;
        display: inline-block;
      }
      :host-context(.theme-dark) .node-name {
        background-color: rgba(255, 255, 255, .15);
        color: #adadad;
      }
      .left-column {
        margin-right: 15px;
      }
      :host-context(.compact) .left-column bv-user-avatar {
        --bv-user-avatar-size: 28px;
        --bv-user-avatar-border-size: 0px;
        box-shadow: none;
        border: 1px solid var(--border-color);
      }
      :host-context(.compact) .up-count {
        display: none;
      }
      .right-column {
        flex: 1;
      }
      .post-info {
        line-height: 25px;
        margin-top: 10px;
        display: flex;
        align-items: center;
      }
      :host-context(.compact) .post-info {
        margin-top: 5px;
      }
      .post-info.hide {
        display: none;
      }
      .post-info .left {
        flex: 1;
        color: var(--text-secondary-color);
      }
      .post-info .left b {
        font-size: 11px;
        font-weight: bold;
        font-family: 'Noto Sans';
      }
      .post-info .material-icons {
        font-size: 14px;
        vertical-align: middle;
        margin-right: 2px;
        color: var(--light-text-disabled-color);
        position: relative;
        top: 1px;
      }
      bv-time {
        font-size: 11px;
      }
      .circle {
        width: 4px;
        height: 4px;
        border-radius: 4px;
        background-color: var(--text-secondary-color);
        display: inline-block;
        margin: 0 2px;
        position: relative;
        top: -2px;
      }
      .up-count {
        margin-top: 8px;
        font-size: 10px;
        color: #c9c9c9;
        text-align: center;
      }
      .up-count .fa {
        font-size: 12px;
        margin-right: 2px;
      }
      :host-context(.toolbar-deep) .pined {
        animation-name: none;
      }
      .pined {
        font-size: 18px;
        vertical-align: middle;
        margin-right: 5px;
        position: relative;
        top: -2px;
        color: transparent;
        /** make it bling-bling! */
        background-image: linear-gradient(-75deg, #ecd330 0%, #ecd330 30%, rgba(236, 210, 49, 0.51) 30%, rgba(236, 210, 49, 0.51) 33%, #ecd330 50%);
        -webkit-background-clip: text;
        animation-name: background-x;
        will-change: background-position;
        animation-iteration-count: infinite;
        animation-duration: 3s;
        animation-timing-function: ease-out;
        width: 18px;
        height: 18px;
        background-size: 24px 18px;
        transform: translate3d(0, 0, 0);
      }
      @keyframes background-x {
        0% {
          background-position-x: 0px;
        }
        50% {
          background-position-x: 24px;
        }
        100% {
          background-position-x: 24px;
        }
      }
    </style>
    <div class="left-column">
      <bv-user-avatar src="[[post.avatar]]" user="[[post.member]]"></bv-user-avatar>
      <div class="up-count">
        <i class="fa fa-chevron-up"></i>
        <span>[[post.upCount]]</span>
      </div>
    </div>
    <div class="right-column">
      <div class="title-and-node">
        <template is="dom-if" if="[[post.pined]]"><i class="material-icons pined">publish</i></template>
        <b class="title">[[_processTitle(post.title)]]</b>
        <div style="display: inline-block;">
          <i class="fa fa-caret-right" aria-hidden="true"></i>
          <template is="dom-if" if="[[post.nodeName]]">
            <span class="node-name">[[post.nodeName]]</span>
          </template>
        </div>
        <b class="author">[[post.member]]</b>
        
        
      </div>
      <div class\$="post-info [[_hideReply(post.t)]]">

        <div class="left">
          <i class="material-icons">sms</i>
          <bv-time time="[[post.lastReply.time]]"></bv-time>
          <span class="circle"></span>
          <b>[[post.lastReply.user]]</b>
        </div>
        <bv-light-button class\$="[[_hasUnreadReply(post.unread)]]">[[_getReplyCount(post.t)]]</bv-light-button>

      </div>
    </div>
`;
  }

  static get is() { return 'bv-timeline-post'; }
  static get properties() {
    return {
      post: {
        type: Object,
        notify: true
      }
    };
  }
  _hasUnreadReply(unread) {
    return unread ? 'unread' : '';
  }
  _processTitle(t) {
    const span = document.createElement('span');
    span.innerHTML = t;
    return span.innerText;
  }
  _getReplyCount(t) {
    let index = t.indexOf('#reply');
    if (~index) return t.substr(index + 6);
    else return 0;
  }
  _hasReply(t) {
    return +this._getReplyCount(t) > 0;
  }
  _hideReply(t) {
    return +this._getReplyCount(t) > 0 ? '' : 'hide';
  }
}

window.customElements.define(TimelinePost.is, TimelinePost);
