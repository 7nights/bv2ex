import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '../../components/bv-time/bv-time.js';
import '../../components/bv-html/bv-html.js';
import '../../components/bv-load-more/bv-load-more.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../../../recycler-view.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class NotificationsPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
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

        --read-item-background: rgba(0, 0, 0, .03);
      }
      :host::before {
        height: 0 !important;
      }
      :host-context(.theme-dark) .tips {
        border-bottom-color: var(--surface-4dp);
        background-color: var(--surface-16dp);
      }
      .tips {
        font-size: 13px;
        color: var(--light-text-secondary-color);
        background: #f2f2f2;
        padding: 10px 15px;
        border-bottom: 1px dashed #ddd;
      }
      .tabs {
        display: flex;
        flex-direction: row;
        padding-left: 8px;
        background: var(--surface);
        position: sticky;
        top: var(--bv-toolbar-height);
        z-index: 1;
        overflow: hidden;
        transform: translate3d(0, 0, 0);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12);
      }
      .tab {
        font-size: 14px;
        font-weight: 500;
        padding: 0 12px 8px;
        height: 28px;
        line-height: 28px;
        color: var(--light-text-secondary-color);
        position: relative;
      }
      .tab.active {
        color: var(--blue);
      }
      .tab-border {
        position: absolute;
        bottom: -5px;
        border-top: 8px solid var(--blue);
        border-radius: 4px;
        width: 48px;
        left: 0;
        transform: translate3d(0, 0, 0);
        transition: all .3s cubic-bezier(0.4, 0.0, 0.2, 1);
      }
      .notifications-container {
        flex: 1;
        overflow: auto;
        color: var(--light-text-secondary-color);
        position: relative;
      }
      .notifications-container b {
        color: var(--light-text-primary-color);
      }
      .notifications-container .item {
        padding: 20px 16px;
        display: flex;
        flex-direction: row;
      }
      .notifications-container .item.read {
        background-color: var(--read-item-background);
      }
      :host-context(.theme-dark) .notifications-container .item-border {
        background-color: var(--surface-8dp);
      }
      .notifications-container .item-border {
        transform: scaleY(.4);
        background-color: #eee;
        height: 1px;
        margin-left: 66px;
      }
      .notifications-container .item-border.read {
        background-color: #d8d8d8;
        margin-left: 0;
      }
      .notifications-container .left-container {
        margin-right: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .notifications-container .right-container {
        font-size: 14px;
        overflow: hidden;
      }
      .notifications-container .right-container .payload {
        display: block;
      }
      .in-arrow {
        font-size: 22px;
        color: #ccc;
        vertical-align: middle;
      }
      .in-arrow.collected {
        font-size: 16px;
        position: relative;
        top: -2px;
        color: var(--orange);
      }
      .in-arrow.mentioned,
      .in-arrow.reply {
        font-size: 16px;
        position: relative;
        top: -2px;
        color: var(--blue);
      }
      .in-arrow.reply {
        transform: rotateY(180deg);
      }
      .in-arrow.thanked_reply,
      .in-arrow.thanked_topic {
        font-size: 16px;
        position: relative;
        top: -2px;
        color: #f31212;
      }
      .scroll-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      bv-time {
        color: var(--light-text-secondary-color);
        font-size: 12px;
        margin-top: 8px;
      }
      .title {
        font-size: 14px;
        font-weight: 600;
      }
      bv-html {
        margin-top: 10px;
        color: var(--light-text-primary-color);
        word-break: break-all;
      }
      bv-html a {
        background-color: #6b6966;
        color: #fff;
        border-radius: 4px;
        text-decoration: none;
      }
      .item.read bv-html a {
        background-color: #6b6966;
      }
      .item.read bv-html a img {
        max-width: 100%;
      }
      .unread-split-container {
        padding-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--read-item-background);
        position: relative;
      }
      .unread-split-container::before {
        content: '';
        width: 100%;
        height: 2px;
        background: linear-gradient(180deg, rgba(0,0,0,.03), rgba(0, 0, 0,0));
        position: absolute;
        top: 0;
      }
      :host-context(.theme-dark) .unread-split {
        border-color: var(--surface-12dp);
      }
      .unread-split {
        font-size: 13px;
        color: var(--light-text-secondary-color);
        background-color: var(--surface-1dp);
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        padding: 0 12px;
        border-radius: 100px;
        height: 30px;
      }
      .unread-split .material-icons {
        font-size: 14px;
        margin-right: 4px;
        position: relative;
        top: -1px;
      }
      .load-more-content {
        font-size: 13px;
        width: 100%;
        text-align: center;
        padding: 15px 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .load-more-content paper-spinner-lite {
        margin-right: 10px;
      }
      :host-context(.theme-dark) .enable-fcm {
        background-color: var(--surface-16dp);
      }
      :host-context(.theme-dark) .enable-fcm .learn-more {
        background-color: #ad9455;
      }
      .enable-fcm {
        padding: 10px;
        margin: 15px 8px 10px;
        background-color: #FDF9EF;
        position: relative;
      }
      .enable-fcm .header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      .enable-fcm .header .material-icons {
        font-size: 18px;
        color: #FEE43F;
        margin-right: 7px;
        position: relative;
        top: -1px;
      }
      .enable-fcm .header b {
        font-size: 14px;
      }
      .enable-fcm .content {
        font-size: 13px;
      }
      .enable-fcm .content div {
        width: calc(100% - 90px);
      }
      .enable-fcm .content img {
        float: right;
        position: absolute;
        width: 55px;
        bottom: 0;
        right: 15px;
      }
      .enable-fcm .content .learn-more {
        position: absolute;
        top: -5px;
        right: 5px;
        font-size: 13px;
        border-radius: 4px;
        background: #EFC862;
        color: #fff;
        box-shadow: 0 3px 16px rgba(0,0,0,.15);
        padding: 6px;
      }
    </style>
    <div class="scroll-container">
      <div id="tabs" class="tabs" on-click="_onTabClick">
        <div class\$="tab [[_getSelectedTabClass(0, selected)]]">[[_getFirstTabName(app.notificationCount)]]<span>[[_getTabCount('new', app.notificationCount)]]</span><paper-ripple></paper-ripple></div>
        <div class\$="tab [[_getSelectedTabClass(1, selected)]]">Replies<span>[[_getTabCount('replies')]]</span><paper-ripple></paper-ripple></div>
        <div class\$="tab [[_getSelectedTabClass(2, selected)]]">Mentions<span>[[_getTabCount('mentions')]]</span><paper-ripple></paper-ripple></div>
        <div class\$="tab [[_getSelectedTabClass(3, selected)]]">Likes<span>[[_getTabCount('likes')]]</span><paper-ripple></paper-ripple></div>
        <div id="tab-border" class="tab-border"></div>
      </div>
      <div class="notifications-container">
        <template is="dom-if" if="[[_isFCMNotEnabled()]]">
          <div class="enable-fcm">
            <div class="header">
              <i class="material-icons">stars</i>
              <b>FCM not enabled</b>
            </div>
            <div class="content">
              <div>Want to get informed when someone likes your topic? Try to enable FCM on your server, that's can be done within 5 minutes.</div>
              <img src="../../../../assets/noti-with-border3.png">
              <span class="learn-more" on-click="_learnFCMSetup">Learn more<paper-ripple></paper-ripple></span>
            </div>
          </div>
        </template>
        <template is="dom-repeat" items="[[_filterNotifications(notifications, selected)]]">
          <template is="dom-if" if="[[_needUnreadSplit(app.notificationCount, index)]]">
            <div class="unread-split-container"><div class="unread-split">
              <i class="material-icons">notifications_none</i>
              Previous notifications
            </div></div>
          </template>
          <div class\$="item [[_isUnread(index)]] [[_needUnreadSplit(app.notificationCount, index, 1)]]">
            <div class="left-container">
              <bv-user-avatar user="[[item.member]]" src="[[item.avatar]]"></bv-user-avatar>
              <bv-time time="[[item.time]]"></bv-time>
            </div>
            <div class="right-container" on-click="_onNotificationClick">
              <b>[[item.member]]</b> [[_getActionName(item.type)]] <i class\$="in-arrow material-icons [[item.type]]">[[_getActionIcon(item.type)]]</i> <span class="title">[[item.title]]</span>
              <bv-html class="payload" html="[[_filterUndefined(item.payload)]]"><div slot="content"></div></bv-html>
            </div>
          </div>
          <div class\$="item-border [[_needUnreadSplit(app.notificationCount, index, 1)]]"></div>
        </template>
      </div>
      <bv-load-more id="loadmore" on-loadmore="_onloadmore" on-click="fetch" threshold="0">
        <template is="dom-if" if="[[!loading]]"><div class="load-more-content">Click to load more.</div></template>
        <template is="dom-if" if="[[loading]]"><div class="load-more-content"><paper-spinner-lite active=""></paper-spinner-lite>Loading...</div></template>
      </bv-load-more>
    </div>
    <app-route route="{{app.subRoute}}" pattern="/:title" data="{{pageData}}">
    </app-route>
`;
  }

  static get is() { return 'bv-notifications-page'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      notifications: {
        type: Array,
        value: [],
        observer: '_notificationsChange'
      },
      pageData: {
        type: Object
      },
      selected: {
        type: Number,
        value: 0,
        observer: '_selectedChange'
        // observer: function (newValue, oldValue) {
        //   debugger;
        //   if (newValue !== oldValue) this.setTabBorderPosition(newValue);
        // }
      }
    };
  }
  _getFirstTabName(count) {
    return count > 0 ? 'New' : 'All';
  }
  _getActionName(type) {
    switch (type) {
      case 'mentioned':
        return 'mentioned you';
      case 'thanked_reply':
        return 'liked your comment';
      case 'thanked_topic':
        return 'liked your topic';
      case 'reply':
        return 'replied';
      case 'recharge':
        return 'completed your recharge';
      default:
        return type;
    }
  }
  _getActionIcon(type) {
    switch (type) {
      case 'mentioned':
        return 'alternate_email';
      case 'thanked_reply':
        return 'favorite';
      case 'thanked_topic':
        return 'favorite';
      case 'reply':
        return 'reply';
      case 'collected':
        return 'bookmark';
      default:
        return 'arrow_right';
    }
  }
  _isFCMNotEnabled() {
    return !window.FCM_ENABLED;
  }
  _onNotificationClick(ev) {
    let model = ev.model;
    this.disappear()
      .then(() => {
        window.v2ex.goToPage(this.rootPath + 't/' + model.item.t);
      });
  }
  _needUnreadSplit(count, index, classMode) {
    // MOCK / TODO
    if (classMode && index >= count) return 'read';
    if (index === count) return true;
    return false;
  }
  _learnFCMSetup() {
    window.open('https://www.github.com/7nights/bv2ex', '_blank');
  }
  _isUnread() {
    return '';
  }
  _selectedChange(newValue, oldValue) {
    if (newValue !== oldValue) this.setTabBorderPosition(newValue);
  }
  _onTabClick(ev) {
    let tab;
    if (ev.target.classList.contains('tab')) {
      tab = ev.target;
    } else if (ev.target.parentElement.classList.contains('tab')) {
      tab = ev.target.parentElement;
    }
    if (tab) {
      const index = [].findIndex.call(this.$.tabs.querySelectorAll('.tab'), (val) => val === tab);
      if (index !== -1 && index !== this.selected) {
        this.selected = index;
      }
    }
  }
  _filterNotifications(notifications) {
    // all
    if (this.selected === 0) return notifications;
    else if (this.selected === 1) {
      // replies
      return notifications.filter(val => val.type === 'reply');
    } else if (this.selected === 2) {
      // mentions
      return notifications.filter(val => val.type === 'mentioned');
    } else if (this.selected === 3) {
      // thanks
      return notifications.filter(val => val.type === 'thanked_reply');
    }
  }
  _getTabCount(type) {
    switch (type) {
      case 'new':
        return this.app.notifications > 0 ? `(${this.app.notifications})` : '';
    }
    return '';
  }
  _getSelectedTabClass(selected) {
    return selected === this.selected ? 'active' : '';
  }
  _jumpToTopic(ev) {
    let path = ev.composedPath();
    let i = 0;
    let target;
    while (target = path[i++]) {
      if (target.tagName === 'BV-TIMELINE-POST') {
        return this.disappear()
          .then(() => {
            // v2ex.setLoadingPage(this.rootPath + 't/' + ev.model.item.t, new Promise(() => {}));
            window.v2ex.goToPage(this.rootPath + 't/' + target.post.t);
          });
      }
    }
  }
  _notificationsChange() {
    console.log('changed!!!', this.notifications);
  }
  _substr(str = '', len) {
    if (str.length > len) return str.substr(0, len) + '...';
    return str;
  }
  _handleNotifications(notifications) {
    return notifications.map((val) => {
      return {...val, payload: val.type === 'thanked_reply' ? this._substr(val.payload, 140) : val.payload};
    });
  }
  async fetch() {
    this.loading = true;
    let result = await window.BVQuerys.notifications(null, this.page++);
    this.loading = false;
    if (result && result.data) {
      result = this._handleNotifications(result.data.notifications);
    }
    this.notifications = this.notifications.concat(result);
    this.$.loadmore.reset();
  }
  connectedCallback() {
    super.connectedCallback();
    
    this.addEventListener('page-select', async (ev) => {
      // do not reload when back from topic page
      if (ev.detail.oldPage && ev.detail.oldPage.tagName === 'BV-TOPIC-PAGE' && !window._fromNotification) {
        this.$.loadmore.enable();
        this.setTabBorderPosition();
        return;
      }

      this.selected = 0;
      this.loading = true;
      this.page = 2;
      this.set('notifications', []);
      let result = await window.BVQuerys.notifications();
      this.loading = false;
      if (result && result.data) {
        result = this._handleNotifications(result.data.notifications);
      }
      this.set('notifications', result || []);
      this.$.loadmore.enable();
      this.setTabBorderPosition();
    });

    this.addEventListener('page-unselect', () => {
      this.$.loadmore.disable();
    });

    this.$.loadmore.addEventListener('loadmore', this.fetch.bind(this));
  }
  setTabBorderPosition() {
    let rect = this.$.tabs.querySelectorAll('.tab')[this.selected].getBoundingClientRect();
    if (rect.width === 0 && this.parentElement.selectedPage === this) {
      return setTimeout(() => this.setTabBorderPosition(), 400);
    }
    this.$['tab-border'].style = `transform: translate3d(${rect.x}px, 0, 0); width: ${rect.width}px;`;
  }
  constructor() {
    super();

    this.page = 2;
    this.loading = false;

    this.addEventListener('page-select', () => {
      this.app.toolbar.setRightMenu();
      this.app.toolbar.setMode('no-border');
    });

    this.addEventListener('page-unselect', () => {
      // TODO
      // this.$['recycler-view'].disable();
      this.set('app.notificationCount', 0);
    });
  }
}
window.customElements.define(NotificationsPage.is, NotificationsPage);
