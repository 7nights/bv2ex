import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../../../scale-animation-container.js';
import './bv-topic-content.js';
import './bv-topic-reply.js';
import '../../components/bv-light-button/bv-light-button.js';
import '../../components/bv-backdrop/bv-backdrop.js';
import '../../components/bv-reply-box/bv-reply-box.js';
import '../../components/bv-load-more/bv-load-more.js';
import '../../components/bv-time/bv-time.js';
import '../../mock-data.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * @customElement
 * @polymer
 */
class TopicPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
      <style include="page-share-style">
        :host {
          padding-bottom: 20px;
          background: var(--surface);
          min-height: 100vh;
        }

        :host-context(.theme-dark) .topic-card {
          background-image: url(../../../../assets/card-bg-dark.png);
          background-size: cover;
        }
        :host-context(.theme-dark) .topic-card .buttons-line .up-down .down {
          background-color: var(--surface-16dp);
        }
        :host-context(.theme-dark) .comment-area-header {
          background-color: var(--surface-1dp);
        }

        .topic-card {
          margin: 9px 15px;
          padding: 15px;
          border-radius: var(--border-radius);
          box-shadow: 0 13px 36px 1px rgba(0, 0, 0, 0.04), 0 3px 16px rgba(0, 0, 0, 0.08);
          background-image: url(../../../../assets/card-bg.png);
          background-size: contain;
          background-color: var(--surface-4dp);
        }
        .topic-card.enter-animation {
          animation-name: scaleBounce3;
          animation-duration: 0.6s;
          animation-timing-function: ease-in-out;
        }
        .topic-card .circle {
          width: 4px;
          height: 4px;
          background-color: var(--text-secondary-color);
          display: inline-block;
          margin: 0 2px;
          position: relative;
          top: -2px;
          border-radius: 2px;
        }
        .topic-card .title-line {
          display: flex;
          flex-direction: row;
        }
        .topic-card .title-line .follow-post {
          padding: 1px 2px;
          border-radius: 2px;
          display: inline-block;
          margin-right: 5px;
          line-height: 1;
          position: relative;
          top: -1px;
          transition: all 0.3s ease-out;
          position: relative;
        }
        .topic-card .title-line .follow-post .background {
          background-color: #f5c035;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 2px;
        }
        .topic-card .title-line .follow-post.following .background {
          animation-name: shrinkToMiss;
          animation-duration: 0.4s;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }
        .topic-card .title-line .follow-post.following .fa {
          color: #f5c035 !important;
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.12));
          animation-name: scaleBounce2;
          animation-duration: 0.4s;
          animation-timing-function: ease-in-out;
        }
        .topic-card .title-line .title {
          line-height: 1.6em;
          padding-top: 2px;
          flex: 1;
          font-weight: bold;
          font-size: 16px;
          word-break: break-all;
          margin-right: 15px;
        }
        .topic-card .title-line .title .fa {
          position: relative;
          z-index: 1;
          vertical-align: top;
          font-size: 16px;
          color: #FEE43F;
          color: #fff;
          transition: color 0.4s ease-out;
        }
        .topic-card .title-line .avatar img {
          vertical-align: top;
          width: 48px;
          height: 48px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
          border-radius: 12px;
        }
        .topic-card .buttons-line {
          display: flex;
          flex-direction: row;
          margin-top: 2.2rem;
          justify-content: space-between;
          align-items: center;
        }
        .topic-card .buttons-line .up-down {
          margin-top: 15px;
          font-size: 10px;
          font-weight: bold;
          display: flex;
          flex-direction: row;
        }
        .topic-card .buttons-line .up-down .up, .topic-card .buttons-line .up-down .down {
          height: 24px;
          line-height: 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 8px;
          min-width: 38px;
          box-sizing: border-box;
          border-radius: 24px;
          justify-content: center;
        }
        .topic-card .buttons-line .up-down .up {
          @apply --blue-bg;
          margin-right: 7px;
        }
        .topic-card .buttons-line .up-down .up > span {
          padding-right: 3px;
        }
        .topic-card .buttons-line .up-down .down {
          background-color: #D9D9D9;
          color: #fff;
        }
        .topic-card .buttons-line .up-down .material-icons {
          font-size: 18px;
        }
        .topic-card .buttons-line .likes-collects {
          display: flex;
          flex-direction: row;
        }
        .topic-card .buttons-line .likes-collects.disabled {
          opacity: .5;
        }
        .topic-card .buttons-line .likes-collects .material-icons {
          font-size: 18px;
        }
        .topic-card .buttons-line .likes-collects .like.liked {
          color: #f31212;
        }
        .topic-card .buttons-line .likes-collects .like {
          margin-right: 15px;
        }
        .topic-card .buttons-line .likes-collects .like.liked .material-icons {
          animation-name: scaleBounce;
          animation-duration: 0.4s;
          animation-timing-function: cubic-bezier(0.32, 1.31, 0.66, 1.27);
        }
        .topic-card .buttons-line .likes-collects .collect.collected {
          color: var(--blue);
        }
        .topic-card .buttons-line .likes-collects .like, .topic-card .buttons-line .likes-collects .collect {
          position: relative;
          color: var(--light-text-secondary-color);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .topic-card .buttons-line .likes-collects .like .icon, .topic-card .buttons-line .likes-collects .collect .icon {
          font-size: 19px;
          font-weight: bold;
          display: flex;
          height: 23px;
          align-items: center;
          margin-bottom: 4px;
        }
        .topic-card .buttons-line .likes-collects .like .icon .count, .topic-card .buttons-line .likes-collects .collect .icon .count {
          margin-left: 3px;
          display: none;
        }
        .topic-card .buttons-line .likes-collects .like .icon .count.show, .topic-card .buttons-line .likes-collects .collect .icon .count.show {
          display: block;
        }
        .topic-card .buttons-line .likes-collects .like > span, .topic-card .buttons-line .likes-collects .collect > span {
          font-size: 9px;
          opacity: 0.7;
        }
        .topic-card .info-line {
          margin-top: 3.5vw;
          font-size: 12px;
          color: var(--light-text-secondary-color);
        }
        .topic-card .info-line .fa-chevron-right {
          font-size: 10px;
          margin-left: 2px;
        }
        .topic-card .info-line .node-name {
          margin-right: 2px;
          border-radius: 2px;
          padding: 1px 3px;
          color: var(--light-text-secondary-color);
          text-decoration: none;
        }
        .topic-card .info-line .material-icons {
          font-size: 12px;
        }

        .hide {
          display: none !important;
        }

        .previous-comments {
          --bv-user-avatar-size: 42px;
        }

        .user-header {
          font-size: 12px;
          color: red;
        }

        bv-reply-box {
          visibility: hidden;
        }

        bv-reply-box[visibility=show-reply-box] {
          visibility: visible;
        }

        .appended {
          margin-bottom: 30px;
        }
        .appended bv-light-button {
          display: inline-block;
          margin-left: 20px;
          color: #777;
          border-bottom-left-radius: 0;
        }
        .appended .topic-content {
          margin-top: 15px;
        }
        .appended.enter-animation .topic-content {
          opacity: 1;
        }

        .topic-content {
          margin-top: 0;
          font-size: 14px;
          /** Make sure the width of content area is an integer multiple of font size. */
          padding: 0 15px 0 21px;
          display: block;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }
        .topic-content.has-content {
          margin-top: 30px;
        }
        .topic-content.enter-animation {
          opacity: 1;
        }
        .topic-content img {
          max-width: 100% !important;
        }

        .replies-group.hide-children bv-topic-reply {
          display: none;
        }

        .no-comment-tip {
          display: none;
        }
        .no-comment-tip.show {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 30px 0;
          margin-top: -25px;
        }
        .no-comment-tip .material-icons {
          margin-right: 5px;
        }
        .no-comment-tip bv-light-button {
          height: 40px;
          padding: 0 15px;
        }

        .comment-area-header {
          background: #F8F8F8;
          height: 60px;
          background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0) 3px);
          display: flex;
          align-items: center;
          padding-left: 15px;
        }
        .comment-area-header .comment-count {
          height: 30px;
        }
        .comment-area-header .comment-count .material-icons {
          position: relative;
          top: 1px;
          font-size: 16px;
          margin-right: 5px;
        }

        .loading-layer {
          display: flex;
          left: 0;
          top: 0;
          background-color: var(--surface);
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100vh;
          position: fixed;
          z-index: 2;
        }
        .loading-layer paper-spinner-lite {
          position: relative;
          top: calc(-10px - var(--bv-toolbar-height));
        }
        .loading-layer.hide {
          display: none;
        }

        #loadmore {
          display: block;
          text-align: center;
        }

        #loadmore paper-spinner-lite {
          margin-top: 16px;
        }

        #loadmore paper-spinner-lite.hide {
          display: none;
        }

        @keyframes scaleBounce {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes scaleBounce2 {
          0% {
            transform: scale(1);
          }
          70% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes scaleBounce3 {
          0% {
            transform: scale(1) translate3d(0, 10px, 0);
          }
          50% {
            transform: scale(1.015) translate3d(0, -2px, 0);
          }
          100% {
            transform: scale(1) translate3d(0, 0, 0);
          }
        }
        @keyframes shrinkToMiss {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(0);
          }
        }
      </style>
      <style include="font-icons">
        :host {
          display: block;
          /* overflow: auto; */
          padding-bottom: 55px;
          height: auto;
        }
      </style>
      
      <div class\$="loading-layer [[_addClass('hide', _hideLoading)]]" on-touchstart="_preventDefault" on-scroll="_preventDefault" on-wheel="_preventDefault">
        <paper-spinner-lite active=""></paper-spinner-lite>
      </div>

      <div class\$="topic-card [[_addClass('enter-animation', _hideLoading)]]">
        <div class="title-line">
          <div class="title">
            <div class\$="follow-post [[_addClass('following', post.isFollowing)]]" on-click="toggleFollow">
              <div class="background"></div>
              <i class="fa fa-star"></i>
            </div>
            [[_filterHTMLTag(post.title)]]
          </div>
          <bv-user-avatar class="avatar" src="[[post.avatar]]" user="[[post.author]]"></bv-user-avatar>
          <!-- <div class="avatar">
            <img src="[[post.avatar]]" />
          </div> -->
        </div>
        <div class="info-line">
          <b class="author">[[post.author]]</b>
          <i class="fa fa-chevron-right"></i>
          <a href\$="/go/[[post.node]]" class="node-name">[[post.nodeName]]</a>
          <i class="circle"></i>
          <!-- <span class="created">[[post.time]]</span> -->
          <bv-time time="[[post.time]]"></bv-time>
          <i class="circle"></i>
          <span class="clicks"> [[post.clicks]] clicks</span>
        </div>
        <div class="buttons-line">
          <div class="up-down">
            <div class="up"><i class="material-icons">keyboard_arrow_up</i><span>[[post.upCount]]</span></div>
            <div class="down"><i class="material-icons">keyboard_arrow_down</i></div>
          </div>
          <div class\$="likes-collects [[_addClass('disabled', post.isSelf)]]">
            <div class\$="like [[_addClass('liked', post.liked)]]" on-click="_sendThanks">
              <paper-ripple></paper-ripple>
              <div class="icon">
                <i class="material-icons">[[_ternary(post.liked, 'favorite', 'favorite_border')]]</i>
                <span class\$="count [[_addClass('show', post.likes)]]">[[post.likes]]</span>
              </div>
              <span>THANKS</span>
            </div>
            <div class\$="collect [[_addClass('collected', post.collected)]]" on-click="_collectPost">
              <paper-ripple></paper-ripple>
              <div class="icon">
                <i class="material-icons">[[_ternary(post.collected, 'bookmark', 'bookmark_border')]]</i>
                <span class\$="count [[_addClass('show', post.collects)]]">[[post.collects]]</span>
              </div>
              <span>COLLECTS</span>
            </div>
          </div>
        </div>
      </div>

      <bv-topic-content content="[[post.content]]" class\$="topic-content [[_addClass('enter-animation', _hideLoading)]] [[_addClass('has-content', post.content)]]"></bv-topic-content>

      <template is="dom-repeat" items="[[post.appended]]" id="dom-repeat">
        <div class\$="appended [[_addClass('enter-animation', _hideLoading)]]">
          <bv-light-button><bv-time time="[[item.time]]"></bv-time></bv-light-button>
          <bv-topic-content content="[[item.content]]" class="topic-content"></bv-topic-content>
        </div>
      </template>

      <div class\$="comment-area-header [[_addClass('hide', _hideCommentHeader)]]">
        <bv-light-button class="comment-count">
          <i class="material-icons">sms</i>
          [[post.replyCount]]
        </bv-light-button>
      </div>
      <div on-click="_focusReplyBox" class\$="no-comment-tip [[_addClass('show', _hideCommentHeader)]]">
        <bv-light-button class="comment-count">
          <i class="material-icons">airline_seat_legroom_extra</i>
          <b>Sit on the sofa!</b>
        </bv-light-button>
      </div>

      <bv-reply-box topic="[[getTopic(post)]]" on-reply-failed="_replyFailed" on-reply-sent="_replySent" once="[[post.actions.once]]" reply-content="{{currentReplyValue}}" id="reply-box" append-to-body="" visibility\$="[[_addClass('show-reply-box', visible)]]" avatar="[[app.userInfo.avatar]]"></bv-reply-box>

      <template is="dom-repeat" items="[[repliesGroup]]">
        <div class="replies-group" group-id\$="[[index]]">
          <template is="dom-repeat" items="[[item]]">
            <bv-topic-reply reply="[[item]]" index="[[index]]" king="[[post.author]]"></bv-topic-reply>
          </template>
        </div>
      </template>

      <bv-load-more id="loadmore">
        <paper-spinner-lite active="" class\$="[[_addClass('hide', _noMoreReplies)]]"></paper-spinner-lite>
      </bv-load-more>

      <bv-backdrop append-to-body="" id="previous-comments">
        <div class="previous-comments" slot="content">
          <div class="user-header">
            <bv-user-avatar class="avatar" src="[[previousComments.0.avatar]]" user="[[previousComments.0.member]]"></bv-user-avatar>
            <b>[[previousComments.0.member]]</b>
          </div>
          <div class="comments-container">
            <template is="dom-repeat" items="[[previousComments]]">
              <div class="previous-comment">
                <div class="floor-number">[[item.floor]]</div>
                <bv-html html="[[item.content]]"><div class="reply-content" slot="content"></div></bv-html>
              </div>
            </template>
          </div>
        </div>
      </bv-backdrop>

      <paper-toast id="share-toast" text="[[_shareToastMessage]]" append-to-body=""></paper-toast>
      <app-route route="{{app.subRoute}}" pattern="/:t" data="{{pageData}}">
      </app-route>
    `;
  }
  static get is() { return 'bv-topic-page'; }
  static get properties() {
    return {
      post: {
        type: Object
      },
      testItems: {
        type: Array,
        value: []
      },
      visible: {
        type: Boolean
      },
      _hideCommentHeader: {
        type: Boolean,
        computed: '_getHideCommentHeader(post.replies, repliesCount)'
      },
      repliesGroup: {
        type: Array,
        computed: '_getRepliesGroup(post.replies)',
        observer: '_repliesGroupChange'
      },
      pageData: {
        type: Object
      },
      previousComments: {
        type: Array,
        value: []
      },
      _hideLoading: {
        type: Boolean,
        computed: '_getHideLoading(post)'
      },
      _page: {
        type: Number,
        value: 1
      },
      currentReplyValue: {
        type: String,
        value: ''
      }
    };
  }
  getTopic() {
    return this.pageData.t;
  }
  async toggleFollow() {
    // window.BVQuerys
    const following = this.post.isFollowing;
    await window.BVQuerys.alterFollowing(!following, this.post.t, this.post.title);
    this.set('post.isFollowing', !following);
  }
  async _sendThanks() {
    if (this.post.liked || this.post.isSelf) return;

    try {
      await this.app.dialog.open({
        title: '',
        content: 'Do you want to spend 10 copper coins to appreciate this post?',
        positiveText: 'Yes',
        negativeText: 'Cancel'
      });
    } catch (ex) {
      return;
    }

    this.set('post.liked', true);
    this.set('post.likes', +this.post.likes + 1);
    await window.BVQuerys.like(this.post.t, this.post.actions.likeAction);
  }
  async _collectPost() {
    if (this.post.isSelf) return;
    let result;
    if (this.post.collected) {
      try {
        result = await window.BVQuerys.uncollect(this.post.t, this.post.actions.collectAction);
        if (result.error) throw new Error(result.error.message || '');
      } catch (ex) {
        console.error(ex, result);
        this._shareToastMessage = 'Failed to uncollect post.';
        this.$['share-toast'].open();
        return;
      }
      this._shareToastMessage = 'Post uncollected!';
      this.$['share-toast'].open();
      // this.set('post.collected', false);
      // this.set('post.collects', +this.post.collects - 1);
      if (result.data && result.data.post) {
        this.post = result.data.post;
      }

      return;
    }
    try {
      result = await window.BVQuerys.collect(this.post.t, this.post.actions.collectAction);
      if (result.error) throw new Error(result.error.message || '');
    } catch (ex) {
      console.error(ex, result);
      this._shareToastMessage = 'Failed to collect post.';
      this.$['share-toast'].open();
      return;
    }
    this._shareToastMessage = 'Post collected!';
    this.$['share-toast'].open();
    // this.set('post.collected', true);
    // this.set('post.collects', +this.post.collects + 1);
    if (result.data && result.data.post) {
      this.post = result.data.post;
    }
  }
  _replySent(ev) {
    this._shareToastMessage = 'Reply sent!';
    this.$['share-toast'].open();

    const {content} = ev.detail;
    this.push('post.replies', {
      avatar: this.app.userInfo.avatar,
      content,
      floor: ((this.post && this.post.replies && this.post.replies.length > 0 && +this.post.replies[this.post.replies.length - 1].floor) || 0) + 1,
      likes: 0,
      member: this.app.userInfo.username,
      time: 'Just now'
    });
    this.notifyPath('post.replies');
  }
  _replyFailed(ev) {
    this._shareToastMessage = 'Failed to send reply. ' +
      (ev && ev.detail && ev.detail.error && (ev.detail.error.message || ev.detail.error)) || '';
    this.$['share-toast'].open();
  }
  _getHideLoading(p) {
    if (p && p.replies && p.replies.length < p.replyCount) {
      this._noMoreReplies = false;
    }

    if (p) {
      this.classList.add('scrollable');
    } else {
      this.classList.remove('scrollable');
    }
    return p;
  }
  _getRepliesGroup(replies) {
    if (!replies) return [];

    replies.forEach((val, n) => {
      if (val._doneQuote || (val.content[0] !== '@' && val.content[0] !== '#')) return;

      val._doneQuote = true;
      let flag = false;
      val.content = val.content.replace(/@(.*?) #([0-9]*)[ \r\n]/, ($, $1, $2) => {
        let member = $1;
        let floor = +$2;
        member = member.match(/\/member\/(.*?)"/);
        if (member) {
          member = member[1];
        } else {
          member = $1;
        }

        for (let i = Math.min(floor + 1, replies.length); i--;) {
          if (replies[i].member === member) {
            val.quote = {
              member,
              floor,
              content: replies[i].content,
              time: replies[i].time
            };
            break;
          }
        }
        flag = true;
        return '';
      });
      if (flag) return;
      // let match = val.content.match(/@(.*?) #([0-9]*)[ \n]/);
      // if (match) {
      //   let member = match[1];
      //   let floor = +match[2];
      //   member = member.match(/\/member\/(.*?)"/);
      //   member = member[1];

      //   for (let i = floor + 1; i--;) {
      //     if (replies[i].member === member) {
      //       val.quote = {
      //         member,
      //         floor,
      //         content: replies[i].content,
      //         time: replies[i].time
      //       };
      //       break;
      //     }
      //   }

      //   return;
      // }
      val.content = val.content.replace(/#([0-9]*)/, ($, floor) => {
        floor = +floor;
        for (let i = Math.min(floor + 2, replies.length); i--;) {
          if (+replies[i].floor === floor) {
            val.quote = {
              floor,
              member: replies[i].member,
              content: replies[i].content,
              time: replies[i].time
            };
          }
        }
        return '';
      });
      // let match = val.content.match(/#([0-9]*)/);
      // if (match) {
      //   let floor = +match[1];
      //   // floor starts from 1
      //   for (let i = floor + 2; i--;) {
      //     if (+replies[i].floor === floor) {
      //       val.quote = {
      //         floor,
      //         member: replies[floor].member,
      //         content: replies[floor].content,
      //         time: replies[floor].time
      //       };
      //     }
      //   }
      // }
    });

    const arr = [];
    const GROUP_SIZE = 25;
    let i = 0;
    let len = replies.length;
    while (i < len) {
      arr.push(replies.slice(i, i + GROUP_SIZE));
      i += GROUP_SIZE;
    }

    return arr;
  }
  _repliesGroupChange() {
    if (!this._shown) return this._deferRepliesGroupChange = true;
    const screenHeight = document.documentElement.clientHeight;
    if (this._repliesGroup) {
      [].forEach.call(this._repliesGroup, (val) => {
        val.classList.remove('hide-children');
        val.style.removeProperty('height');
      });
    }
    flush();
    // Wait 1 tick for template to stamp.
    microTask.run(() => {
      this._repliesGroup = this.shadowRoot.querySelectorAll('.replies-group');
      if (this._repliesGroup.length === 0) return;
      this._repliesGroupInfo = [].map.call(this._repliesGroup, (g) => {
        let result = {
          offsetTop: g.offsetTop,
          offsetHeight: g.offsetHeight,
          screenHeight
        };
        g.style.height = result.offsetHeight + 'px';
        return result;
      });

      this.$.loadmore.reset();
    });
  }
  _getHideCommentHeader(count, count2) {
    if ((!count || count.length === 0) && !count2) return true;
    return false;
  }
  _preventDefault(ev) {
    ev.preventDefault();
  }
  resetTopic() {
    this._page = 1;
    this._noMoreReplies = true;
    this._cacheData = null;
    this.queryTopicData(this.post.t);
  }
  async queryTopicData(t, getFromState) {
    const HISTORY_LIST_LENGTH = 50;

    this._page = 1;
    this._noMoreReplies = true;
    this.repliesCount = 0;

    const replyCount = window.location.hash.split('#reply').pop() || undefined;

    if (this._cacheData && this._cacheData.t === t) {
      this.post = this._cacheData;
      return Promise.resolve(this._cacheData);
    }
    if (getFromState && history.state && history.state.post && history.state.post.t && history.state.post.t.indexOf(t) === 0) {
      this.post = history.state.post;
      return Promise.resolve(history.state.post);
    }

    this.post = void 0;
    let result;
    let sid = ++this._sid;
    try {
      let request;
      // if we already sent the request before entring the page (e.g. when
      // a user clicks a post and the previous page is disappearing) we use
      // it directly
      if (window.pendingPostQuery && BVUtils.normalizeTopic(window.pendingPostQuery.t) === t) {
        request = window.pendingPostQuery.request;
        window.pendingPostQuery = null;
      } else {
        request = window.BVQuerys.topic(t);
      }
      result = await request;
      if (result.author === this.app.userInfo.username) {
        result.isSelf = true;
        result.liked = false;
      }
      let historyViews = BVUtils.userStorage.get('recentViews');
      if (!historyViews || historyViews.constructor !== Array) {
        historyViews = [];
      }
      let _t = BVUtils.normalizeTopic(t);
      let found = false;
      for (let i = historyViews.length; i--;) {
        if (historyViews[i].t === _t) {
          let item = historyViews.splice(i, 1)[0];
          if (replyCount) {
            item.replyCount = replyCount;
          }
          historyViews.unshift(item);
          found = true;
          break;
        }
      }
      if (!found) {
        if (historyViews.length >= HISTORY_LIST_LENGTH) {
          historyViews.pop();
        }
        historyViews.unshift({
          t: _t,
          author: result.author,
          title: result.title,
          avatar: result.avatar,
          nodeName: result.nodeName,
          node: result.node,
          replyCount
        });
      }
      BVUtils.userStorage.set('recentViews', historyViews);
      if (sid !== this._sid) return 'SID_NOT_MATCH';
      if (result.error) {
        throw result.error;
      }
    } catch (ex) {
      if (this.app.currentPage === 'topic') {
        history.back();
        window['global-error-toast'].text = 'Could not fetch topic, please try again later.';
        window['global-error-toast'].open();
        throw ex;
      }
    }
    
    let replies = result.replies;
    // defer replies
    delete result.replies;
    this.post = result;
    this.repliesCount = replies.length;
    this._cacheData = this.post;
    this._cacheData.t = t;
    // defer setting replies for better performance
    setTimeout(() => {
      this.post.replies = replies;
      if (this.post && this.post.replies && this.post.replies.length < this.post.replyCount) {
        this._noMoreReplies = false;
      }
      this.notifyPath('post.replies');
    }, 0);
    // return BVUtils.pSetTimeout(1500)
    //   .then(() => {
    //     this.post = MOCK_DATA[Math.random() <= .5 ? 'TOPIC' : 'TOPIC2'];
    //     this._cacheData = this.post;
    //     this._cacheData.t = t;
    //   });
  }
  constructor() {
    super();

    this._onMenuClick = this._onMenuClick.bind(this);
    this._sid = 0;

    this._lastRenderedReplyCount = 0;

    /** if page is activated, data fetched & dom rendered */
    this._shown = false;

    let screenHeight = document.documentElement.clientHeight;
    window.addEventListener('scroll', BVUtils.throttle((ev) => {
      if (v2ex.selectedPage !== this) return;
      // if (ev.detail && ev.detail.originalEvent) ev = ev.detail.originalEvent;
      if (!this._repliesGroupInfo || this._repliesGroupInfo.length === 0) return;
      if (!this._shown) return;
      let scrollTop = document.scrollingElement.scrollTop;
      const VISIBLE_RANGE = screenHeight * 0 + 200;

      const visible = {};
      let offsetRedo;
      this._repliesGroupInfo.forEach((g, i) => {
        if (this._repliesGroup[i] &&
          ((this._repliesGroup[i].scrollHeight !== g.offsetHeight) || (this._repliesGroup[i].offsetTop !== g.offsetTop))) {
          if (this._repliesGroup[i].scrollHeight === 0) {
            debugger;
          }
          let node = this._repliesGroup[i];
          let _scrollHeight = node.scrollHeight;
          let _offsetTop = node.offsetTop;
          node.style.height = _scrollHeight + 'px';
          this._repliesGroupInfo[i] = {
            offsetTop: _offsetTop,
            offsetHeight: _scrollHeight
          };
          if (!offsetRedo) {
            offsetRedo = true;
          }
        }
        if (i > offsetRedo) {
          this._repliesGroupInfo[i].offsetTop = this._repliesGroup[i].offsetTop;
        }
        // viewport bottom to group top
        let vb = scrollTop + screenHeight;
        let bt = g.offsetTop - vb;
        let gb = g.offsetTop + g.offsetHeight;
        if (g.offsetTop >= scrollTop && gb <= vb) {
          return visible[i] = 1;
        }
        if ((bt >= 0 && bt <= VISIBLE_RANGE) || (vb >= g.offsetTop && vb <= gb)) {
          return visible[i] = 1;
        }
        // viewport top to group bottom
        let tb = scrollTop - gb;
        if ((tb >= 0 && tb <= VISIBLE_RANGE) || (scrollTop >= g.offsetTop && scrollTop <= gb)) {
          return visible[i] = 1;
        }
      });
      for (let i = 0, len = this._repliesGroup.length; i < len; i++) {
        if (visible[i]) {
          this._repliesGroup[i].classList.remove('hide-children');
        } else {
          this._repliesGroup[i].classList.add('hide-children');
        }
      }
    }, 40), {passive: true});
    
    // create global styles
    const style = document.createElement('style');
    style.innerHTML = `
      .previous-comments bv-user-avatar {
        --bv-user-avatar-size: 42px;
      }
      .previous-comments .user-header {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 15px;
      }
      .previous-comments .user-header b {
        margin-left: 10px;
      }
      .previous-comments .reply-content {
        font-size: 13px;
        line-height: 18px;
        color: var(--light-text-primary-color);
        word-break: break-all;
      }
      .previous-comments .reply-content a {
        color: var(--blue);
        text-decoration: none;
      }
      .previous-comments .previous-comment:first-child {
        background-color: transparent !important;
      }
      .previous-comments .previous-comment {
        display: flex;
        flex-direction: row;
        padding: 15px;
        border-bottom: 1px solid #e6e6e6;
        background-color: #f5f5f5;
      }
      .theme-dark .previous-comments .previous-comment {
        background-color: var(--surface-1dp);
        border-bottom: 1px solid var(--border-color);
      }
      .previous-comments .previous-comment:last-of-type {
        border-bottom: none;
        padding-bottom: 20px;
      }
      .previous-comment .floor-number {
        font-weight: 800;
        font-size: 14px;
        color: var(--light-text-secondary-color);
        margin-right: 10px;
      }
      .previous-comments .comments-container {
        max-height: calc(100vh - 140px - var(--bv-toolbar-height));
        overflow: auto;
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);
  }
  _focusReplyBox() {
    this.$['reply-box'].focusInput();
  }
  onMutePost() {
    console.log('on mute post...');
  }
  _onMenuClick(menu) {
    if (menu.id === 'Refresh') {
      history.replaceState(null, null, location.href);
      this.resetTopic();
      document.scrollingElement.scrollTop = 0;
    } else if (menu.id === 'Mute') {
    } else if (menu.id === 'Share') {
      if (!window.navigator.share) {
        this._shareToastMessage = 'Current Chrome version doesn\'t support share!';
        this.$['share-toast'].open();
        return;
      }
      const div = document.createElement('div');
      div.innerHTML = this.post.content;
      window.navigator.share({
        title: this.post.title,
        text: this.post.title + ' - ' + div.innerText.substr(0, 100) + (div.innerText.length > 100 ? '...' : ''),
        url: 'https://v2ex.com/t/' + this.post.t
      })
        .then(() => {
          this._shareToastMessage = 'Share success!';
          this.$['share-toast'].open();
        })
        .catch(() => {
          this._shareToastMessage = 'Failed to share!';
          this.$['share-toast'].open();
        });
    } else if (menu.id === 'CopyUrl') {
      const t = location.href.match(/t\/([0-9]*)/);
      if (t && t[1]) {
        const url = `https://www.v2ex.com/t/${t[1]}`;
        navigator.clipboard.writeText(url)
          .then(() => {
            this._shareToastMessage = 'Copied to clipboard';
            this.$['share-toast'].open();
          }, () => {
            this._shareToastMessage = 'Failed to copy, please try to use the share function.';
            this.$['share-toast'].open();
          });
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('reply-comment', (ev) => {
      this.currentReplyValue = '@' + ev.detail.member + ' #' + ev.detail.floor + '\n' +
        this.currentReplyValue;
      this.$['reply-box'].focusInput();
    });
    this.addEventListener('reply-like', (ev) => {
      const reply = ev.composedPath()[0];
      this.app.dialog.open({
        title: '',
        content: 'Do you want to spend 10 copper coins to appreciate this comment?',
        positiveText: 'Yes',
        negativeText: 'Cancel'
      })
        .then(async () => {
          await window.BVQuerys.likeComment(ev.detail.id);
          reply.set('reply.liked', true);
          reply.set('reply.likes', ev.detail.likes + 1);
        });
    });
    this.addEventListener('show-previous-comments', (ev) => {
      console.log('s-p-c', ev.detail);
      const floor = +ev.detail.reply.floor;
      const by = ev.detail.by;

      const replies = [];
      for (let i = 0, len = floor; i < len; i++) {
        if (this.post.replies[i].member === by) {
          replies.push(this.post.replies[i]);
        }
      }
      
      if (replies.length > 0) {
        this.previousComments = replies.reverse();
        this.$['previous-comments'].show();
      }
    });
    this.addEventListener('page-unselect', (ev) => {
      // if (ev.detail.oldPage === ev.detail.newPage) {
      //   document.scrollingElement.scrollTop = 0;
      // }
      this._shown = false;
      this.visible = false;
      this.$.loadmore.disable();
    })
    this.addEventListener('page-select', async (ev) => {
      // Redirect when params are invalid
      if (!this.pageData || !this.pageData.t) {
        window.location.href = '/';
        window.dispatchEvent(new CustomEvent('location-changed'));
        return;
      }
      // TODO: clear content if post not equals
      let queryResult = await !this.post || (this.post.t !== this.pageData.t) ? this.queryTopicData(this.pageData.t, true) : Promise.resolve();
      if (queryResult === 'SID_NOT_MATCH') return;
      this.$.loadmore.enable();
      this._shown = true;
      v2ex.children.toolbar.setMode('plain');
      v2ex.children.toolbar.setRightMenu('menu', [{
        label: 'Refresh',
        id: 'Refresh',
        onclick: this._onMenuClick
      }, {
        label: 'Mute',
        id: 'Mute',
        onclick: this._onMenuClick
      }, {
        label: 'Share',
        id: 'Share',
        onclick: this._onMenuClick
      }, {
        label: 'Copy Url',
        id: 'CopyUrl',
        onclick: this._onMenuClick
      }]);
      setTimeout(() => {
        if (this._shown) {
          this.visible = true;
        }
      }, 500);
      if (this._deferRepliesGroupChange) {
        this._deferRepliesGroupChange = false;
        this._repliesGroupChange();
      }
    });

    this.$.loadmore.addEventListener('loadmore', async () => {
      if (this.post && this.post.replies && this.post.replies.length > 0 && +this.post.replies[this.post.replies.length - 1].floor < this.post.replyCount && !this._noMoreReplies) {
        let post = await window.BVQuerys.topic(this.post.t, ++this._page);
        // TODO: update appended
        console.time('replies');
        if (post.replies[0] && +post.replies[0].floor <= +this.post.replies[this.post.replies.length - 1].floor) {
          this._noMoreReplies = true;
          return console.warn('No more new replies.');
        }

        // this.push('post.replies', ...post.replies);
        this.push.apply(this, ['post.replies'].concat(post.replies));
        this.notifyPath('post.replies');
        // this.set('post.replies', this.post.replies.concat(post.replies));
        console.timeEnd('replies');
      } else if (this.post && this.post.replies && +this.post.replies[this.post.replies.length - 1].floor >= this.post.replyCount) {
        this._noMoreReplies = true;
      }
    });

    // transform property will create a stacking context and a containing 
    // block which makes its' fixed children attached to it visually instead
    // of attached to the viewport.
    // Use append-to-body property (which is implemented in PageBehaviour)
    // document.body.appendChild(this.$['reply-box']);
    // document.body.appendChild(this.$['share-toast']);
  }
}

window.customElements.define(TopicPage.is, TopicPage);
