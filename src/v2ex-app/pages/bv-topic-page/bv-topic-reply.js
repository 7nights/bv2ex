import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '../../components/bv-time/bv-time.js';
import fontIcons from '../../font-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';
/**
 * @customElement
 * @polymer
 */
class TopicReply extends PolymerElement {
  static get template() {
    return html`
    <style >
      :host {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        padding-top: 20px;
      }
      .avatar {
        margin: 0 16px 0 15px;
        flex-shrink: 0;
        --bv-user-avatar-size: 42px;
      }
      .content {
        flex: 1;
        margin-right: 15px;
        overflow: hidden;
        /* border-bottom: 1px solid #eee; */
        /* padding-bottom: 8px; */
      }
      :host-context(.theme-dark) .content-border {
        background-color: var(--surface-6dp);
      }
      .content-border {
        width: 100%;
        height: 1px;
        background-color: #ddd;
        transform: scaleY(.4);
        /* margin-top: 12px; */
      }
      .floor-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        line-height: 15px;
      }
      .floor-header .floor-number {
        font-weight: 800;
        font-size: 14px;
        color: var(--light-text-secondary-color);
        margin-right: 10px;
      }
      .floor-header > b {
        font-size: 14px;
        font-weight: 600;
        color: var(--light-text-primary-color);
        /* color: rgb(70, 70, 70); */
      }
      .floor-header bv-time {
        color: var(--light-text-disabled-color);
        font-size: 11px;
      }
      :host-context(.theme-dark) #reply-content {
        color: var(--light-text-secondary-color);
      }
      #reply-content {
        margin-top: 10px;
        font-size: 14px;
        line-height: 1.5;
        /* color: var(--light-text-primary-color); */
        color: rgb(70, 70, 70);
        word-break: break-all;
        user-select: text;
      }
      #reply-content a {
        color: gray;
        /* color: var(--blue); */
        /* color: var(--google-blue-500); */
        /* color: rgb(35, 111, 216); */
        /* text-decoration: none; */
      }
      #reply-content a[href^="/member"] {
        text-decoration: none;
        font-weight: 500;
        /* fix for OnePlus */
        font-family: 'Roboto';
        color: black;
        /* color: var(--blue); */
      }
      #reply-content a[href^="/member"]::after {
        content: 'sms';
        font-family: 'Material Icons';
        margin-left: 1px;
        margin-right: 2px;
        vertical-align: middle;
        color: var(--light-text-primary-color);
      }
      :host-context(.theme-dark) #reply-content a[href^="/member"] {
        color: var(--light-text-primary-color);
      }
      /* #reply-content img {
        height: 150px;
        display: block;
      } */
      #reply-content img {
        max-width: 100%;
      }
      .buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
        margin-bottom: 12px;
      }
      .buttons bv-light-button .material-icons {
        font-size: 15px;
        transition: color .3s ease-out;
        /* color: #6b6b76; */
        color: #666;
      }
      .buttons bv-light-button {
        transition: background-color .3s ease-out;
      }
      .buttons .like {
        color: #f31212;
        margin-right: 8px;
        position: relative;
      }
      .buttons .like.liked::after {
        content: '+1';
        position: absolute;
        bottom: 10px;
        left: 26px;
        font-size: 15px;

        animation-name: fade-out-up;
        animation-duration: .8s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
      }
      @keyframes fade-out-up {
        0% {
          transform: translate3d(0, 0, 0);
          opacity: 1;
        }
        100% {
          transform: translate3d(0, -20px, 0);
          opacity: 0;
        }
      }
      .buttons .like > span {
        color: var(--light-text-secondary-color);
        transition: color .3s ease-out;
        margin-left: 4px;
        font-size: 13px;
        display: none;
      }
      .buttons .like > span.show {
        display: inline-block;
      }
      .buttons .like.liked > span {
        color: #fff;
      }
      .buttons .like.liked {
        background-color: #f31212;
      }
      .buttons .like.liked .material-icons {
        color: #fff;
      }
      :host-context(.theme-dark) .quote {
        background-color: var(--surface-1dp);
      }
      .quote {
        font-size: 13px;
        color: var(--light-text-primary-color);
        background-color: #efefef;
        border-radius: var(--border-radius);
        border-top-left-radius: 0;
        padding: 8px;
        display: none;
        position: relative;
        overflow: hidden;
        margin-top: 10px;
      }
      .quote.show {
        /* display: inline-block;
        vertical-align: top; */
        display: block;
      }
      #quote-content {
        /* max-height: 100px; */
        overflow: hidden;
        color: rgb(75, 75, 75);
      }
      .quote.expanded #quote-content {
        max-height: none;
      }
      #quote-content img {
        max-width: 100%;
      }
      :host-context(.theme-dark) #quote-content {
        color: var(--light-text-secondary-color);
      }
      #quote-content a {
        background-color: rgba(53, 140, 254, 0.64);
        color: #ffffff;
        background-color: var(--surface-12dp);
        color: #666;
        padding: 0px 2px;
        text-decoration: none;
        border-radius: 2px;
        word-break: break-all;
      }
      .quote .header {
        font-size: 10px;
        margin-bottom: 6px;
        color: #95989A;
        /* color: var(--light-text-secondary-color); */
      }
      .quote .header b {
        color: var(--light-text-primary-color);
      }
      #show-more-quote {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 12px;
        color: var(--blue);
        text-align: right;
        width: 100%;
        padding-right: 15px;
        box-sizing: border-box;
        background: linear-gradient(180deg, rgba(235, 235, 235,0), rgb(235, 235, 235) 50%);
        padding-top: 20px;
        padding-bottom: 10px;
      }
      #show-more-quote.show {
        display: block;
      }
      .quote.expanded #show-more-quote {
        display: none !important;
      }
      .king-icon {
        display: none;
        margin-left: 6px;
        margin-top: -1px;
      }
      .king-icon.show {
        display: inline-block;
      }
      .op-icon {
        display: none;
        margin-left: 5px;
        font-size: 10px;
        padding: 0 2px;
        color: #fff;
        background-color: var(--blue);
        border-radius: 4px;
      }
      .op-icon.show {
        display: inline-block;
      }
    </style>
    <bv-user-avatar class="avatar" src="[[reply.avatar]]" user="[[reply.member]]" default-background-color="#eee"></bv-user-avatar>
    <div class="content">
      <div class="floor-header">
        <span class="floor-number">[[reply.floor]]</span>
        <b>[[reply.member]]</b>
        <img class\$="king-icon [[_isKing(reply.member, king)]]" src="./assets/my-crown.24.png" height="12">
        <!-- <span class\$="op-icon [[_isKing(reply.member, king)]]">OP</span> -->
        <span style="flex: 1;"></span>
        <bv-time time="[[reply.time]]"></bv-time>
      </div>
      <div>
        <div id="quote" class="quote">
          <div class="header">Reply to <b>[[reply.quote.member]]</b>'s comment at #[[reply.quote.floor]]:</div>
          <div id="quote-content"></div>
          <!-- <div id="show-more-quote" on-click="showMoreQuote">Show more</div> -->
        </div>
      </div>
      <div id="reply-content" on-click="_onReplyContentClick"></div>
      <div class="buttons">
        <bv-light-button class\$="like [[_getLiked(reply.liked)]]" on-click="_addLike">
          <i class="material-icons">favorite</i>
          <span class\$="[[_showLikesCount(reply.likes)]]">[[reply.likes]]</span>
        </bv-light-button>
        <bv-light-button on-click="_onReplyComment" class="reply"><i class="material-icons">reply</i></bv-light-button>
      </div>
      <div class="content-border"></div>
    </div>
`;
  }

  static get is() { return 'bv-topic-reply'; }
  static get observers() {
    return [
      '_handleReplyContent(reply.content)',
      '_handleReplyQuote(reply.quote)'
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [fontIcons];
  }
  _getLiked(liked) {
    return liked ? 'liked' : '';
  }
  showMoreQuote(ev) {
    let quote = ev.target;
    while (quote.id !== 'quote' && quote) quote = quote.parentElement;
    quote && quote.classList.toggle('expanded');
  }
  _isKing(a, b) {
    return a === b ? 'show' : '';
  }
  _addLike(ev) {
    this.dispatchEvent(new CustomEvent('reply-like', {detail: this.reply, bubbles: true, composed: true}));
  }
  _onReplyComment() {
    this.dispatchEvent(new CustomEvent('reply-comment', {detail: this.reply, bubbles: true, composed: true}));
  }
  _handleReplyContent(content) {
    content = content.replace(/<a target="_blank" href="https:\/\/www.v2ex.com\/t\//g, '<a href="/t/');

    // reply @ to make it prettier
    content = content.replace(/@<a href="\/member\//g, '<a href="/member/');

    this.$['reply-content'].innerHTML = content;
  }
  _onReplyContentClick(ev) {
    try {
      if (ev.target.matches('a[href^="/member/"]')) {
        ev.stopPropagation();
        ev.preventDefault();

        this.dispatchEvent(new CustomEvent('show-previous-comments', {detail: {reply: this.reply, by: ev.target.innerText}, bubbles: true, composed: true}));
      }
    } catch (ex) {}
  }
  _showLikesCount(count) {
    return count && count > 0 ? 'show' : '';
  }
  _handleReplyQuote(quote) {
    if (!quote) return this.$.quote.classList.remove('show');
    this.$.quote.classList.add('show');
    this.$['quote-content'].innerHTML = quote.content;

    // Enabling this function need to solve repliesGroup height issue.
    return;
    // Avoid forced reflow, align multi operations.
    microTask.run(() => {
      if (this.$['quote-content'].scrollHeight !== this.$['quote-content'].offsetHeight) {
        this.$['show-more-quote'].classList.add('show');
      }
    });
  }
}

window.customElements.define(TopicReply.is, TopicReply);
