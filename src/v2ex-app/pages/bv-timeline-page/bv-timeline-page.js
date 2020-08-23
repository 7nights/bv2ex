import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import './bv-timeline-post.js';
import './bv-post-preview.js';
import '../../components/bv-load-more/bv-load-more.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-scroller/bv-scroller.js';
import RecyclerView from '../../../recycler-view.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../../../scale-animation-container.js';
import '../../mock-data.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class NewPostsButton extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        position: fixed;
        bottom: 66px;
        left: 50%;
        z-index: 2;
      }
      :host-context(body:not(.selected-page-timeline)) {
        display: none;
      }
      .have-new-posts {
        @apply --bv-gradient-bg;
        width: 105px;
        height: 36px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .24);
        justify-content: center;
        align-items: center;
        border-radius: 36px;
        display: flex;
        margin-left: -57px;
        animation-name: slideUp;
        animation-duration: .5s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(.46,1.37,.43,1.17);
        display: none;
      }
      .have-new-posts.show {
        display: flex;
      }
      .have-new-posts .material-icons,
      .have-new-posts img {
        margin-right: 5px;
      }
      @keyframes slideUp {
        0% {
          transform: translate3d(0, 96px, 0);
        }
        100% {
          transform: translate3d(0, 0, 0);
        }
      }
    </style>
    <div class\$="have-new-posts [[_isShowing(show)]]" on-click="reload"><img src="./assets/icons/material/refresh-white.svg" width="18" height="18">New Posts</div>
`;
  }

  static get is() { return 'bv-new-posts-button'; }
  static get properties() {
    return {
      show: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
  }
  _isShowing(show) {
    return show ? 'show' : '';
  }
}

window.customElements.define(NewPostsButton.is, NewPostsButton);
class MyRecyclerView extends RecyclerView {
  static get is() { return 'my-recycler-view'; }
  getItemRect(item) {
    return new Promise((resolve) => {
      if (!this.__renderItem) {
        this.__renderItem = this._createElementFromItem(item)
        this.$.offscreen.appendChild(this.__renderItem);
      } else {
        this._applyModelToInstance(item, this.__renderItem);
      }
      flush();
      let rect = this.__renderItem.getBoundingClientRect();
      return resolve({
        width: rect.width,
        height: rect.height
      });
    });
  }
}
window.customElements.define(MyRecyclerView.is, MyRecyclerView);
/**
 * @customElement
 * @polymer
 */
class TimelinePage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        display: block;
        /* background-image: url(../../assets/bg-big.png);
        background-size: cover;
        background-attachment: fixed; */
        /* overflow: hidden; */
        position: relative;
      }
      .search-box {
        background-color: var(--surface-4dp);
        color: var(--light-text-secondary-color);
        height: 46px;
        line-height: 46px;
        border-radius: 8px;
        padding: 0 14px;
        box-sizing: border-box;
        margin: 0 20px 5px;
        font-size: 12px;
        display: flex;
        align-items: center;
        transition: box-shadow .3s ease-out, transform .2s ease-in-out;
        position: relative;
        border: 1px solid var(--border-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
      }
      :host-context(.theme-dark) .search-box {
        border-color: #000;
      }
      .search-box.focus {
        transform: scale(1.05);
        box-shadow: 0 3px 16px rgba(0, 0, 0, .1);
      }
      .search-box input {
        flex: 1;
        background: none transparent;
        border: none;
        outline: none;
        font-family: 'Google Sans';
        color: var(--light-text-secondary-color);
      }
      .search-box i {
        margin-right: 8px;
        font-size: 14px;
      }
      .loading-layer {
        height: 100vh;
        width: 100vw;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        background: var(--surface);
        z-index: 10;
        opacity: 1;
      }
      .loading-layer.hide {
        display: none;
      }
      .loading-layer paper-spinner-lite {
        position: relative;
        top: calc(0px - var(--bv-toolbar-height) - 30px);
      }
      .have-new-posts {
        @apply --bv-gradient-bg;
        width: 105px;
        height: 36px;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .24);
        justify-content: center;
        align-items: center;
        border-radius: 36px;
        display: flex;
        position: fixed;
        bottom: 60px;
        left: 50%;
        margin-left: -57px;
        animation-name: slideUp;
        animation-duration: .5s;
        animation-fill-mode: both;
        animation-timing-function: cubic-bezier(.46,1.37,.43,1.17);
        display: none;
      }
      .have-new-posts.show {
        display: flex;
      }
      .have-new-posts .material-icons {
        margin-right: 5px;
      }
      @keyframes slideUp {
        0% {
          transform: translate3d(0, 96px, 0);
        }
        100% {
          transform: translate3d(0, 0, 0);
        }
      }
      :host-context(.theme-dark) .search-box {
        margin-top: 0;
      }
      :host-context(.theme-dark) #recycler-view {
        background-image: url(../../../../assets/bg-big-lighter-dark.png);
        background-size: 100vw auto;
        /* for performance reason */
        /* background-attachment: fixed; */
        background-color: var(--surface-1dp);
        border-top: 1px solid var(--surface-4dp);
        margin-top: 24px;
      }

      .node-banner {
        /* padding: 20px 10px; */
        margin: 0px 15px 10px 20px;
        padding: 25px 0 20px 0;
        /* background-color: #FDF9EE; */
        display: flex;
        flex-direction: row;
        overflow: hidden;
        position: relative;
        border-bottom: 1px dashed var(--border-color);
      }
      :host-context(.theme-dark) .node-banner {
        margin-bottom: -20px;
        border-bottom: none;
      }
      .node-banner .left {
        flex: 1;
      }
      .node-banner .left .top-desc {
        display: flex;
        flex-direction: row;
        color: #BFBFBF;
        font-size: 10px;
        align-items: center;
      }
      :host-context(.theme-dark) .node-banner .left i {
        color: var(--color-secondary-600);
      }
      .node-banner .left i {
        font-size: 14px;
        color: #FEE43F;
        margin-right: 5px;
      }
      .node-banner .left .node-name {
        font-size: 20px;
        font-weight: bold;
        color: var(--light-text-primary-color);
        margin-left: 2px;
        margin-top: 5px;
      }
      .node-banner .right {
        position: relative;
        display: flex;
        align-items: center;
        min-width: 70px;
      }
      :host-context(.theme-dark) .node-banner .right-background {
        filter: invert(.8);
      }
      .node-banner .right-background {
        width: 70px;
        position: absolute;
        right: 120px;
        top: -4px;
      }
      :host-context(.theme-dark) .node-banner .remove-node-filter {
        background-color: #2d2c28;
        color: #c17545;
      }
      .node-banner .remove-node-filter {
        /* border: 2px solid #ED7C36; */
        color: #ED7C36;
        font-size: 12px;
        padding: 6px 6px;
        border-radius: 30px;
        /* background: #FDF9EE; */
        background-color: #f5edd9;
        position: relative;
        z-index: 1;
        font-weight: bold;
      }
      .bv-scroller-group.hide-children .bv-scroller-item {
        display: none !important;
      }
      #loadmore {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
      }
      .no-posts-tip {
        font-size: 13px;
        color: var(--light-text-secondary-color);
        text-align: center;
        margin-top: 10px;
      }
    </style>
    <template is="dom-if" if="[[_showSearchBox(app.subRoute.prefix)]]">
      <div class\$="search-box [[searchBoxFocus]]">
        <paper-ripple></paper-ripple>
        <i class="fa fa-google"></i>
        <!-- <span>Search posts in Google</span> -->
        <input on-focus="_addFocusClass" on-blur="_removeFocusClass" placeholder="Search posts with Google" value="{{searchKeywords::input}}" type="search" on-keydown="handleSearchKeydown">
      </div>
    </template>
    
    <div id="loading" class="loading-layer">
      <paper-spinner-lite active=""></paper-spinner-lite>
    </div>

    <template is="dom-if" if="[[_equal(app.subRoute.prefix, '/go')]]">
      <div class="node-banner">
        <img class="right-background" src="./assets/nodes-dotted.png">
        <div class="left">
          <div class="top-desc">
            <i class="material-icons">label</i>
            <span>Showing topics in</span>
          </div>
          <div class="node-name">[[_currentCategoryName]]</div>
        </div>
        <div class="right">
          <div class="remove-node-filter" on-click="createTopic"><i class="fa fa-pencil"></i> New topic</div>
        </div>
      </div>
    </template>

    <!-- <bv-scroller id="scroller" enabled="true">
      <template is="dom-repeat" items="[[_slicePostsIntoGroups(posts)]]">
        <div class="bv-scroller-group">
          <template is="dom-repeat" items="[[item]]" >
            <bv-timeline-post class="bv-scroller-item" on-click="_jumpToTopic" on-touchstart="_postTouchStart" on-touchend="_postTouchEnd" on-touchmove="_postTouchMove" on-longtouch="_postLongTouch" post="[[item]]" index="[[index]]"></bv-timeline-post>
          </template>
        </div>
      </template>
    </bv-scroller> -->

    <my-recycler-view id="recycler-view" on-click="_jumpToTopic2" style="display: block;" reuse-items-size="[[resueItemsSize]]" items="[[posts]]" tag="bv-timeline-post" target-property="post" on-longtouch="_postLongTouch"></my-recycler-view>

    <!-- <template is="dom-repeat" items="[[posts]]" >
      <bv-timeline-post class="bv-scroller-item" on-click="_jumpToTopic" on-touchstart="_postTouchStart" on-touchend="_postTouchEnd" on-touchmove="_postTouchMove" on-longtouch="_postLongTouch" post="[[item]]" index="[[index]]"></bv-timeline-post>
    </template> -->

    <template is="dom-if" if="[[_not(posts.length)]]">
      <div class="no-posts-tip">No posts found.</div>
    </template>

    <bv-load-more id="loadmore">
      <paper-spinner-lite active="[[_showLoadmore(_page, maxPage)]]"></paper-spinner-lite>
    </bv-load-more>
    <!-- <div class\$="have-new-posts [[_addClass('show', _haveNewPosts)]]" on-click="reload"><i class="material-icons">refresh</i>New Posts</div> -->
    <bv-new-posts-button append-to-body="" show="[[_haveNewPosts]]" on-click="reload"></bv-new-posts-button>
    <bv-post-preview id="preview" post="[[selectedPost]]"></bv-post-preview>
    <app-route route="{{app.subRoute}}" pattern="/:category" data="{{pageData}}">
    </app-route>
`;
  }

  constructor() {
    super();
    this._loadingShowing = true;
    this.postLongtouchHandlers = new BVUtils.LongtouchHandlers();
    this._page = 1;
    this._postsMap = new Map();
    this._lastFetchTime = 0;
    this.resueItemsSize = 35;
    
    // load compact mode
    const settings = BVUtils.settings.load({}, 'user-settings', window.SETTINGS_FIELDS);
    if (settings.compactMode) {
      document.body.classList.add('compact');
      this.resueItemsSize = 50;
    }

    // extract recent views' reply count
    const items = BVUtils.userStorage.get('recentViews') || [];
    this._recentPostReplies = {};
    items.forEach(val => {
      this._recentPostReplies[val.t] = val.replyCount;
    });

    // show the refresh button if we haven't fetched new posts
    // for 5 minutes.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden &&
        Date.now() - this._lastFetchTime >= 1000 * 60 * 5) {
        this._haveNewPosts = true;
      }
    });

    this.addEventListener('page-unselect', () => {
      document.body.classList.remove('selected-page-timeline');
      this.$['recycler-view'].disable();
      // this._lastScrollTop = document.scrollingElement.scrollTop;
      window.scrollTo(0, 0);
      this._show = false;
      this.$.loadmore.disable();
    });
    this.addEventListener('page-select', async () => {
      this.$['recycler-view'].enable(true);
      document.body.classList.add('selected-page-timeline');
      this.maxPage = -1;
      let reseted = false;
      if (this.app.subRoute.prefix === '/go' && this.pageData.category !== this._currentCategory) {
        this._currentCategory = this.pageData.category;
        this.reset();
        document.scrollingElement.scrollTop = 0;
        reseted = true;
      } else if (this.app.subRoute.prefix !== '/go' && this.app.subRoute.prefix !== '/collected') {
        // if previous mode is not 'home', we reset timeline data
        if (this._currentCategory) {
          this.reset();
          document.scrollingElement.scrollTop = 0;
          reseted = true;
        }
        this._currentCategory = null;
      } else if (this.app.currentPage === 'collected') {
        this._currentCategory = '_collected';
        this.reset();
        document.scrollingElement.scrollTop = 0;
        reseted = true;
      }

      // Set title to Node if in node mode
      if (this._currentCategory) {
        this.set('app.pageName', 'Node');
      }
      if (this.app.currentPage === 'collected') {
        this.set('app.pageName', 'Collected');
      }

      if (!reseted) {
        //document.scrollingElement.scrollTop = this._lastScrollTop;
      }
      this.app.toolbar.setRightMenu('notifications');
      this.app.toolbar.setMode('normal');
      this._show = true;

      if (!this.posts || this.posts.length === 0) {
        let response;
        try {
          response = await (this.queryPosts());
        } catch (ex) {
          this.$.loadmore.enable();
          // TODO: show error page
          throw new Error(ex);
        }
        this.set('app.notificationCount', response.notificationCount || 0);
        if (response.pageInfo) {
          this.maxPage = response.pageInfo.total;
        } else {
          this.maxPage = -1;
        }
        // timeline
        this.posts = this.handlePosts(response.data);
        if (this._currentCategory && this.app.currentPage !== 'collected') {
          this._currentCategoryName = (this.posts[0] && this.posts[0].nodeName) || this.pageData.category;
        }
        this.$.loadmore.enable();
      } else {
        this.$.loadmore.enable();
      }
    });
  }
  static get is() { return 'bv-timeline-page'; }
  static get properties() {
    return {
      posts: {
        type: Array,
        value: [],
        observer: '_postsChange'
      },
      searchKeywords: {
        type: String
      },
      searchBoxFocus: {
        type: String,
        value: ''
      },
      selectedPost: {
        type: Object
      },
      _hideLoading: {
        type: Boolean,
        computed: '_getHideLoading(posts)'
      },
      _show: {
        type: Boolean,
        value: false
      }
    };
  }
  _slicePostsIntoGroups(posts) {
    const GROUP_SIZE = 100;
    const arr = [];
    let i = 0;
    let len = posts.length;
    while (i < len) {
      arr.push(posts.slice(i, i + GROUP_SIZE));
      i += GROUP_SIZE;
    }
    return arr;
  }
  _showSearchBox(prefix) {
    return prefix === '/home' || prefix === '/';
  }
  queryPosts(page) {
    if (this.app.currentPage === 'collected') {
      return window.BVQuerys.collected(page);
    }
    if (this._currentCategory) {
      return window.BVQuerys.node(this._currentCategory, page);
    }

    this._lastFetchTime = Date.now();
    return window.BVQuerys.recent(page);
  }
  createTopic() {
    window.v2ex.goToPage(this.rootPath + 'create-topic/' + this.pageData.category + '/' + this._currentCategoryName);
  }
  // add unread status etc...
  handlePosts(posts) {
    return posts.map(post => {
      this._normalizeTopic(post);
      let id = post.id;
      if (id in this._recentPostReplies && +this._recentPostReplies[id] !== +post.replyCount) {
        post.unread = true;
      }
      return post;
    });
  }
  addPosts(posts) {
    posts = posts.filter((post) => {
      this._normalizeTopic(post);
      let id = post.id;
      if (id in this._recentPostReplies && +this._recentPostReplies[id] !== +post.replyCount) {
        post.unread = true;
      }
      if (this._postsMap.has(id)) {
        console.warn('already have ' + id, post.title);
        if (!this._haveNewPosts) {
          // janky may block animation
          setTimeout(() => {
            this._haveNewPosts = true;
          }, 1000);
        }
        return false;
      } else {
        this._postsMap.set(id, 1);
      }
      return true;
    });

    //this.push('posts', ...posts);
    // this.notifyPath('posts');
    this.posts = this.posts.concat(posts);
    this._disableLoadmore = false;
    this.$.loadmore.reset();
    console.log('loadmore reset');
  }
  connectedCallback() {
    super.connectedCallback();
    //on-touchstart="_postTouchStart" on-touchend="_postTouchEnd" on-touchmove="_postTouchMove"
    this.$['recycler-view'].addEventListener('touchstart', this._postTouchStart.bind(this));
    this.$['recycler-view'].addEventListener('touchend', this._postTouchEnd.bind(this), {passive: true});
    this.$['recycler-view'].addEventListener('touchmove', this._postTouchMove.bind(this));
    this.$['preview'].addEventListener('touchend', this._postTouchEnd.bind(this), {passive: true});
    
    this.$.loadmore.addEventListener('loadmore', async () => {
      if (this._disableLoadmore) return console.log('disabled loadmore');
      let posts = await this.queryPosts(++this._page);
      // this.push.apply(this, ['posts', ...posts.data]);
      this.addPosts(posts.data);
      this.app.notificationCount = posts.notificationCount;
    });
    // this.$.loadmore.enable();
  }
  _postsChange() {
    if (this.posts && this.posts.length > 0) {
      this._disableLoadmore = false;
      this.$.loadmore.reset();

      if (this._loadingShowing) {
        this._loadingShowing = false;
        this.$.loading.animate([{opacity: 1}, {opacity: 0}], {
          duration: 300
        }).onfinish = () => {
          if (this._loadingShowing) return;
          this.$.loading.style.display = 'none';
        };
      }
    } else {
      this._disableLoadmore = true;
      this._loadingShowing = true;
      this.$.loading.style.display = 'flex';
    }

    if (this.maxPage === 0) {
      this.$.loading.style.display = 'none';
    }
    if (this._page >= this.maxPage && this.maxPage !== -1) {
      this._disableLoadmore = true;
      this.$.loadmore.disable();
    }
    this.$.scroller && this.$.scroller.notifyGroupChange();
  }
  _showLoadmore() {
    return !(this._page >= this.maxPage && this.maxPage !== -1);
  }
  reset() {
    this._postsMap = new Map();
    this.posts = [];
    this._page = 1;
    this._haveNewPosts = false;
    this.maxPage = -1;
    console.log('posts reset');
  }
  async reload() {
    document.scrollingElement.scrollTo(0, 0);
    this.reset();
    let response = await this.queryPosts();
    this.set('app.notificationCount', response.notificationCount || 0);
    // timeline
    this.posts = this.handlePosts(response.data);
  }
  _getHideLoading(posts) {
    return posts && posts.length > 0;
  }
  _postTouchStart(ev) {
    let arr = ev.composedPath();
    let target;
    let i = 0;
    while (target = arr[i++]) {
      if (target.tagName === 'BV-TIMELINE-POST') {
        this.postLongtouchHandlers.touchStart(ev, target);
        return;
      }
    }
    // ev.preventDefault();
    // this.postLongtouchHandlers.touchStart(ev);
  }
  _postTouchMove(ev) {
    this.postLongtouchHandlers.touchMove(ev);
    if (this._previewing) {
      ev.preventDefault();
    }
  }
  _filterNonjson(o) {
    let obj = {};
    for (let key in o) {
      if (key.indexOf('__') !== 0) obj[key] = o[key];
    }
    return obj;
  }
  _postTouchEnd(ev) {
    this.postLongtouchHandlers.touchEnd(ev);
    
    let navigated = false;
    let endEle = this.$.preview.shadowRoot.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
    let target = endEle;
    while (target) {
      if (target.dataset.previewReadMoreBtn === 'true') {
        navigated = true;
        if (this._lastPreviewPost) { this._lastPreviewPost.unread = false; }
        window.v2ex.goToPage(this.rootPath + 't/' + this._lastPreviewTopic, this._lastPreviewPost ? {post: this._filterNonjson(this._lastPreviewPost)} : null);
      }
      target = target.parentElement;
    }

    this.$.preview.hide(navigated);
    this._previewing = false;
  }
  _postLongTouch(ev) {
    this._lastPreviewPost = null;
    this._lastPreviewTopic = ev.detail.target.post.t;
    // navigator.vibrate([100]);
    let target = ev.detail.target;
    if (!target.post.content) {
      window.BVQuerys.topic(target.post.t)
        .then((data) => {
          if (data.error) throw new Error(data.error);

          this.$.preview.updateContent(data.content, data.t);
          // target.post = data;
          for (let key in data) {
            target.post[key] = data[key];
          }
          target.post._wholePost = true;
          this._lastPreviewPost = data;
        });
    } else if (target.post._wholePost) {
      this._lastPreviewPost = target.post;
    }
    this.$.preview.show(target);
    this._previewing = true;
  }
  _addFocusClass() {
    this.searchBoxFocus = 'focus';
  }
  _removeFocusClass() {
    this.searchBoxFocus = '';
  }
  _jumpToTopic2(ev) {
    let path = ev.composedPath();
    let i = 0;
    let target;
    while (target = path[i++]) {
      if (target.tagName === 'A') return;
      if (target.tagName === 'BV-TIMELINE-POST') {
        return this._jumpToTopic({
          model: {item: target.post},
          target
        });
      }
    }
  }
  _jumpToTopic(ev) {
    window.pendingPostQuery = {
      t: ev.model.item.t,
      request: window.BVQuerys.topic(ev.model.item.t)
    };
    this.disappear()
      .then(() => {
        // v2ex.setLoadingPage(this.rootPath + 't/' + ev.model.item.t, new Promise(() => {}));
        ev.target.set('post.unread', false);
        window.v2ex.goToPage(this.rootPath + 't/' + ev.model.item.t);
      });
  }
  handleSearchKeydown(ev) {
    if (ev.keyCode === 13) {
      window.open('https://www.google.com/search?q=site:v2ex.com/t%20' + encodeURIComponent(this.searchKeywords));
    }
  }
}

window.customElements.define(TimelinePage.is, TimelinePage);
