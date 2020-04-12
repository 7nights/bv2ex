import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '../../components/bv-time/bv-time.js';
import '../../components/bv-html/bv-html.js';
import '../../components/bv-load-more/bv-load-more.js';
import '../../components/bv-light-button/bv-light-button.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class MemberPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        display: flex;
        flex-direction: column;
        /* height: calc(100vh - var(--bv-toolbar-height)); */
        color: var(--light-text-primary-color);
        min-height: calc(100vh - var(--bv-toolbar-height));
        background-color: #F7F7F7;
        --light-bg: #eee;
        --light-bg2: #f3f3f3;
        --read-item-background: rgba(0, 0, 0, .03);
      }
      :host-context(.theme-dark) {
        background-color: var(--surface);
        --light-bg: var(--surface-2dp);
        --light-bg-2: var(--surface-2dp);
      }

      img[src=""],
      img:not([src]) {
        opacity: 0;
      }

      :host-context(.theme-dark) .card {
        background-image: url('../../../../assets/card-bg-dark.png');
      }
      .card {
        background-color: var(--surface-8dp);
        margin: 20px 12px;
        border-radius: 4px;
        padding: 12px 15px;
        /* box-shadow: 0 12px 17px 2px rgba(0, 0, 0, .08), 0 5px 22px 4px rgba(0, 0, 0, .06), 0 7px 8px 0 rgba(0, 0, 0, .04); */
        box-shadow: 0 3px 10px rgba(0, 0, 0, .06);
        background-image: url('../../../../assets/card-bg.png');
        background-size: cover;
        position: relative;
        min-height: 70px;
      }
      .info {
        display: flex;
        align-items: flex-start;
      }
      /* .info .avatar {
        width: 48px;
        height: 48px;
        border: none;
        outline: none;
        border-radius: 4px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
        margin-right: 25px;
      } */
      .info .avatar {
        margin: 0 25px 0 2px;
      }
      .info .detail {
        flex: 1;
        margin-top: 3px;
      }
      .info .detail .name {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
      .info .detail .name b {
        font-size: 18px;
        margin-right: 6px;
      }
      .info .user-number {
        background-color: var(--yellow);
        color: var(--surface);
        font-size: 11px;
        text-align: center;
        border-radius: 2px;
        padding: 0 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90px;
        min-width: 48px;
        left: 40px;
        top: 65px;
        transform: translateX(-50%);
        position: absolute;
      }
      paper-button {
        margin: 8px -5px 0 0;
        min-height: 24px;
        min-width: 50px;
        padding: 0 10px;
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary-text-color);
        background-color: var(--light-bg);
        border-radius: 24px;
      }
      .info .action {}
      .info .action.hide {
        display: none;
      }
      .info .company,
      .info .bio {
        font-size: 13px;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        margin-top: 3px;
      }
      .info .company img,
      .info .bio img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      .card .introduction {
        margin-top: 20px;
        font-size: 13px;
        color: var(--disabled-text-color);
      }
      .widgets {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 10px 0 0 -5px;
        padding-top: 15px;
      }
      .widget {
        background-color: var(--light-bg-2);
        border-radius: 20px;
        display: flex;
        align-items: center;
        margin: 0 5px 10px;
        height: 20px;
        padding: 0 10px 0 4px;
        font-size: 13px;
      }
      .widget img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
        filter: grayscale(1);
      }
      .widget i {
        font-size: 16px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        margin-right: 4px;
        color: #333;
        text-align: center;
        vertical-align: middle;
        border-radius: 18px;
      }
      .posts-hidden {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        padding-top: 50px !important;
      }
      .posts-hidden img {
        margin-right: 5px;
        position: relative;
        top: -1px;
      }
      .posts,
      .posts-tab,
      .posts-hidden {
        background-color: var(--surface);
        padding: 10px 20px;
      }
      .posts-container-shadow {
        box-shadow: 0 -1px 6px rgba(0, 0, 0, .05);
        width: 100%;
        height: 5px;
        position: relative;
        top: 5px;
        margin-top: 8px;
        background: var(--surface);
      }
      .posts-tab {
        color: var(--blue);
        font-weight: 500;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: sticky;
        top: var(--bv-toolbar-height);
        z-index: 1;
        padding-bottom: 0;
        padding-top: 15px;
      }
      .posts-tab .tab {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .posts-tab .opx-border {
      }
      .posts-tab i {
        margin-left: 4px;
        font-size: 20px;
      }
      .posts {
        padding: 10px 0;
        min-height: 100vh;
        font-size: 14px;
        color: var(--light-text-primary-color);
      }
      .post {
        padding: 14px 20px;
        min-height: 40px;
        position: relative;
      }
      .post:active {
        background-color: var(--surface-8dp);
      }
      .post:first-child {
        padding-top: 10px;
      }
      .post .header {
        margin-bottom: 5px;
      }
      .post .header .fa {
        color: var(--light-text-disabled-color);
      }
      .post .node {
        color: var(--light-text-secondary-color);
        background-color: var(--light-bg);
        padding: 1px 5px;
        border-radius: 16px;
        line-height: 16px;
        font-size: 12px;
      }
      .post .header b {
        font-weight: 500;
        font-family: Roboto, 'Source Han Sans';
      }
      .post .last-reply,
      .reply-to .info {
        display: flex;
        align-items: center;
        color: var(--light-text-disabled-color);
        font-size: 12px;
        line-height: 16px;
      }
      .last-reply .middle {
        flex: 1;
      }
      .last-reply .material-icons {
        font-size: 14px;
        margin-right: 5px;
        margin-top: 1px;
      }
      .last-reply .user {
        margin-right: 5px;
        font-weight: 500;
      }
      .last-reply .time {
        margin-left: 5px;
      }
      .reply-to {
      }
      .reply-to .info b {
        margin: 0 5px;
      }
      :host-context(.theme-dark) .reply-content {
        background-color: var(--surface-1dp);
      }
      .reply-content {
        font-size: 13px;
        color: var(--light-text-primary-color);
        background-color: #f1f1f1;
        border-radius: 8px;
        border-top-left-radius: 0;
        padding: 8px;
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        display: inline-block;
        max-width: 100%;
      }
      .reply-content bv-html a {
        background-color: rgba(53, 140, 254, 0.64);
        color: #ffffff;
        background-color: var(--surface);
        color: #666;
        padding: 0px 2px;
        text-decoration: none;
        border-radius: 2px;
        word-break: break-all;
      }
      bv-light-button {
        /* min-width: initial; */
      }
      .hidden {
        display: none !important;
      }
      .empty-info {
        margin: -13px 0 10px 73px;
        font-size: 13px;
        color: var(--light-text-secondary-color);
        display: flex;
        align-items: center;
      }
      .empty-info img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }
      .online-dot {
        display: none;
      }
      .online-dot.online {
        display: block;
        width: 8px;
        height: 8px;
        background-color: #38DF4D;
        box-shadow: 0 2px 6px rgba(0,0,0,.09);
        border-radius: 4px;
      }
      #loadmore {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
      }
      #loadmore.hide {
        visibility: hidden;
      }
    </style>
    <div class="scroll-container">
      <div class="card">
        <div class="info">
          <span class="user-number">No. [[userInfo.memberNo]]</span>
          <bv-user-avatar class="avatar" src="[[userInfo.avatar]]"></bv-user-avatar>
          <div class="detail">
            <div class="name">
              <b>[[pageData.member]]</b>
              <i class\$="online-dot [[_addClass('online', userInfo.isOnline)]]"></i>
            </div>
            <template is="dom-if" if="[[userInfo.bio]]"><div class="bio"><img src="../../../../assets/icons/material/outline-portrait-24px.svg">[[userInfo.bio]]</div></template>
            <template is="dom-if" if="[[userInfo.company]]"><div class="company"><img src="../../../../assets/icons/material/outline-business_center-24px.svg">[[userInfo.company]]</div></template>
          </div>
          <paper-button class\$="action [[_hideBlockButton(pageData.member, app.userInfo.username)]]" on-click="toggleBlock">[[_ternary(userInfo.isBlocked, 'UNBLOCK', 'BLOCK')]]</paper-button>
        </div>
        <div class\$="introduction [[_getDisplay('introduction', userInfo.introduction)]]"><bv-html class="payload" html="[[userInfo.introduction]]"><div slot="content"></div></bv-html></div>
        <div class\$="widgets [[_getDisplay('widgets', userInfo.widgets)]]">
          <template is="dom-repeat" items="[[userInfo.widgets]]">
            <div class="widget" on-click="_onWidgetClick">
              <template is="dom-if" if="[[_getWidgetType('icon', item)]]">
                <i class\$="fa fa-[[_getWidgetIcon(item)]]"></i>
              </template>
              <template is="dom-if" if="[[_getWidgetType('image', item)]]">
                <img src\$="[[_getWidgetIcon(item)]]">
              </template>
              [[item.title]]
            </div>
          </template>
        </div>
        <div class\$="empty-info [[_getDisplay('emptyInfo', userInfo.widgets, userInfo.introduction, userInfo.bio, userInfo.company)]]">
          <img src="../../../../assets/icons/material/unknown-black.svg">
          <span>[[pageData.member]] is a bit mysterious.</span>
        </div>
      </div>

      <div class="posts-container-shadow"></div>
      <div class="posts-tab" on-click="switchPostsType">
        <div class="tab">
          <span>[[_getPostsType(currentPostsType)]]</span>
          <i class="material-icons">expand_more</i>
        </div>
        <div class="opx-border"></div>
      </div>
      <template is="dom-if" if="[[_showPostsHidden(userInfo.ifPostsHidden, currentPostsType)]]">
        <div class="posts-hidden">
          <img src="../../../../assets/icons/material/lock.svg">
          <span>Posts are hidden by [[pageData.member]].</span>
        </div>
      </template>
      <template is="dom-if" if="[[_showNoPosts(userInfo.ifPostsHidden, posts, currentPostsType)]]">
        <div class="posts-hidden">
          <span><b>[[pageData.member]]</b> never posted anything.</span>
        </div>
      </template>
      <div class="posts">
        <template is="dom-repeat" items="[[_getPosts(currentPostsType, posts, replies)]]">
          <div class="post" on-click="_onPostClick">
            <div class="header">
              <span class="node">[[item.nodeName]]</span>
              <i class="fa fa-caret-right" aria-hidden="true"></i>
              <b>[[item.title]]</b>
            </div>
            <template is="dom-if" if="[[item.lastReply]]">
              <div class="last-reply">
                <i class="material-icons">sms</i>
                <span class="user">[[item.lastReply.user]]</span>
                <span> last replied </span>
                <span class="time">[[item.lastReply.time]]</span>
                <div class="middle"></div>
                <bv-light-button>[[_getReplyCount(item.t)]]</bv-light-button>
              </div>
            </template>

            <template is="dom-if" if="[[item.replyTo]]">
              <div class="reply-to">
                <div class="info">
                  <span class="desc">replied</span>
                  <b>[[item.replyTo]]</b>
                  <span class="time">[[item.time]]</span>
                </div>
                <div class="reply-content">
                  <bv-html html="[[item.replyContent]]"><div slot="content"></div></bv-html>
                </div>
              </div>
            </template>
          </div>
        </template>
        <bv-load-more id="loadmore" class\$="[[hideLoading]]">
          <paper-spinner-lite active=""></paper-spinner-lite>
        </bv-load-more>
      </div>
    </div>
    <app-route route="{{app.subRoute}}" pattern="/:member" data="{{pageData}}">
    </app-route>
`;
  }

  static get is() { return 'bv-member-page'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      pageData: {
        type: Object
      }
    };
  }
  constructor() {
    super();

    this.currentPostsType = 'post';
    this.currentPostsPage = 1;
    this.currentRepliesPage = 1;
    this.hideLoading = '';

    this.addEventListener('page-select', async () => {
      // Redirect when params are invalid
      if (!this.pageData || !this.pageData.member) {
        window.location.href = '/';
        window.dispatchEvent(new CustomEvent('location-changed'));
        return;
      }

      this.app.toolbar.setRightMenu();
      this.app.toolbar.setMode('shadow');

      window.loading.show(false);
      const result = await BVQuerys.member(this.pageData.member);
      window.loading.hide();
      this.userInfo = result.data;
      this.currentPostsType = 'post';
      this.posts = result.data.posts;
      this.replies = result.data.replies;
      this.currentPostsPage = 1;
      this.currentRepliesPage = 1;
      this.currentPostsMaxPage = undefined;
      this.currentRepliesMaxPage = undefined;

      this.$.loadmore.enable();
    });

    this.addEventListener('page-unselect', () => {
      this.$.loadmore.disable();
    });
  }
  _getPosts(type, a, b) {
    if (type === 'post') return a;
    return b;
  }
  connectedCallback() {
    super.connectedCallback();

    this.$.loadmore.addEventListener('loadmore', () => {
      if (this.loading) return;
      this.fetchData();
    });
  }
  async fetchData() {
    if (this.currentPostsType === 'post') {
      if ((this.currentPostsMaxPage !== undefined &&
      this.currentPostsPage > this.currentPostsMaxPage) ||
        (!this.posts || this.posts.length === 0)) {
          this.hideLoading = 'hide';
          return;
        }
    } else {
      if ((this.currentRepliesMaxPage !== undefined &&
      this.currentRepliesPage > this.currentRepliesMaxPage) ||
        (!this.replies || this.replies.length === 0)) {
          this.hideLoading = 'hide';
          return;
        }
    }

    this.hideLoading = '';
    this.loading = true;
    const type = this.currentPostsType;
    let result;
    try {
      const page = this.currentPostsType === 'post' ? this.currentPostsPage : this.currentRepliesPage;
      result = await BVQuerys.member(this.pageData.member, this.currentPostsType === 'post' ? 'topics' : 'replies', page);

      if (page === 1) {
        if (type === 'post') {
          result.data.posts = result.data.posts.slice(this.posts.length);
        } else {
          result.data.replies = result.data.replies.slice(this.replies.length);
        }
      }

      if (!result.data.pageInfo) {
        result.data.pageInfo = {
          total: 1
        };
      }

      if (type === 'post') {
        this.currentPostsMaxPage = result.data.pageInfo.total;
        this.currentPostsPage++;
      } else {
        this.currentRepliesMaxPage = result.data.pageInfo.total;
        this.currentRepliesPage++;
      }
    } catch (ex) {
      throw ex;
    } finally {
      this.loading = false;
    }

    if (type === 'post') {
      this.posts = this.posts.concat(result.data.posts);
    } else {
      this.replies = this.replies.concat(result.data.replies);
    }
    this.$.loadmore.reset();
  }
  toggleBlock() {
    if (this.userInfo.isBlocked === false) {
      BVQuerys.blockUser(this.userInfo.memberId, this.pageData.member, this.userInfo.blockActionToken);
    } else {
      BVQuerys.unblockUser(this.userInfo.memberId, this.pageData.member, this.userInfo.blockActionToken);
    }
    this.set('userInfo.isBlocked', !this.userInfo.isBlocked);
  }
  _hideBlockButton(a, b) {
    return a === b ? 'hide' : '';
  }
  _getDisplay(type) {

    switch (type) {
      case 'widgets':
        if (!this.userInfo.widgets || this.userInfo.widgets.length === 0) return 'hidden';
        break;
      case 'introduction':
        if (!this.userInfo.introduction) return 'hidden';
        break;
      case 'emptyInfo':
        if ((!this.userInfo.widgets || this.userInfo.widgets.length === 0) && !this.userInfo.introduction && !this.userInfo.bio && !this.userInfo.company) return '';
        else return 'hidden';
    }
  }
  _showPostsHidden(ifPostsHidden, postsType) {
    return ifPostsHidden && postsType === 'post';
  }
  _showNoPosts(ifPostsHidden, posts, postsType) {
    return !ifPostsHidden && postsType === 'post' && (!posts || posts.length === 0);
  }
  _onPostClick(ev) {
    const id = ev.model.item.t;
    // target.querySelector('paper-ripple').animateRipple();
    this.disappear()
      .then(() => {
        window.v2ex.goToPage(this.rootPath + 't/' + id);
      });
  }
  switchPostsType() {
    document.scrollingElement.scrollTop = 0;
    if (this.currentPostsType === 'post') {
      this.currentPostsType = 'reply';
    } else {
      this.currentPostsType = 'post';
    }

    this.$.loadmore.reset();
  }
  _getPostsType(type) {
    if (type === 'post') return 'POSTS';
    
    return 'REPLIES';
  }
  _getWidgetType(type, widget) {
    if (type === "icon") {
      if (this._getWidgetIcon(widget).indexOf('://') === -1) return true;
      return false;
    } else if (type === 'image') {
      if (this._getWidgetIcon(widget).indexOf('://') === -1) return false;
      return true;
    }
  }
  _onWidgetClick(ev) {
    const widget = ev.model.item;
    widget.url && window.open(widget.url, '_blank');
  }
  _getWidgetIcon(widget) {
    const { iconUrl } = widget;
    if (~iconUrl.indexOf('twitter')) return 'twitter';
    else if (~iconUrl.indexOf('instagram')) return 'instagram';
    else if (~iconUrl.indexOf('dribbble')) return 'dribbble';
    else if (~iconUrl.indexOf('goodreads')) return 'goodreads';
    else if (~iconUrl.indexOf('github')) return 'github';
    else if (~iconUrl.indexOf('steam')) return 'steam';
    else if (~iconUrl.indexOf('twitch')) return 'twitch';
    // else if (~iconUrl.indexOf('social_ps')) return 'playstation';
    // else if (~iconUrl.indexOf('social_bn')) return 'battle-net';
    else if (~iconUrl.indexOf('geo')) return 'map-marker';
    else if (~iconUrl.indexOf('telegram')) return 'telegram';
    else if (~iconUrl.indexOf('home')) return 'home';

    // TODO: replace icons
    return 'https://www.v2ex.com' + iconUrl; 
  }
}
window.customElements.define(MemberPage.is, MemberPage);
