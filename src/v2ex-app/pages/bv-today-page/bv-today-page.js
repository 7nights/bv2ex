import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '../../../recycler-view.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { flush } from '@polymer/polymer/lib/utils/flush';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
/**
 * @customElement
 * @polymer
 */
class TodayPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get kFetchInterval() {
    return  1000 * 60 * 5;
  }
  static get template() {
    return html`
      <style include="page-share-style"></style>
      <style include="font-icons"></style>
      <style>
        :host {
          min-height: var(--page-height);
          display: flex;
          flex-direction: column;
          color: var(--light-text-primary-color);
        }
        :host .empty {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: var(--page-height);
        }
        :host .icon-pic {
          position: relative;
          width: 350px;
          text-align: center;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: -100px;
          opacity: .75;
        }
        :host .empty img.dinosaur {
          width: 88px;
        }
        :host .empty img.line {
          width: 100%;
          position: absolute;
          top: 10px;
          left: 10px;
        }
        :host .empty .text {
          margin-top: 40px;
          width: 80vw;
        }
        :host .empty .text > div {
          margin-bottom: 15px;
          font-weight: bold;
          font-family: 'Google Sans';
          font-size: 20px;
        }
        .tips {
          padding: 0px 5px;
          font-family: 'Google Sans';
          margin: 15px 15px 5px;
          border-radius: 4px;
          color: var(--light-text-secondary-color);
          font-size: 12px;
          font-weight: 600;
          display: none;
        }
        .tips.show {
          display: block;
        }
        :host-context(.theme-dark) .post:nth-of-type(-n + 4) .post-card {
          background-color: #32332d;
        }
        .post:nth-of-type(-n + 3) .post-card {
          background-color: #fcfdf9;
        }
        .title-line {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
        }
        .title-line .title {
          flex: 1;
          font-size: 16px;
          font-family: Roboto, "Source Han Sans";
          font-weight: 500;
          padding-right: 15px;
        }
        .post:nth-of-type(-n + 3) .post-card .title-line .title i {
          font-size: 16px;
        }
        .title-line .title i {
          /* background-color: var(--orange);
          color: var(--dark-text-primary-color); */
          color: var(--blue);
          font-family: 'Google Sans';
          font-size: 20px;
          min-width: 18px;
          padding: 0 6px;
          display: inline-block;
          text-align: center;
          height: 18px;
          line-height: 18px;
          border-radius: 9px;
          font-style: normal;
          margin-right: 2px;
        }
        .post {
          padding-top: 9px;
          margin-bottom: 30px;
          word-break: break-all;
        }
        .block {
          overflow: hidden;
        }
        .post-card {
          margin: 0px 15px 12px 20px;
          padding: 15px;
          border-radius: 6px;
          box-shadow: 0 18px 36px 1px rgba(0, 0, 0, 0.04), 0 5px 16px rgba(0, 0, 0, 0.1);
          background-size: contain;
          background-color: var(--surface-4dp);
          transition: background-color .3s ease-out;
        }
        .post-card .content {
          font-size: 14px;
          color: var(--light-text-secondary-color);
        }
        .post-replies {
          padding: 0 25px;
          font-size: 14px;
          overflow: hidden;
          color: var(--light-text-secondary-color);
        }
        .post-replies .post-reply {
          display: flex;
          flex-direction: row;
        }
        .post-replies img.avatar {
          width: 24px;
          height: 24px;
          margin-right: 12px;
          border-radius: 12px;
        }
        .post-replies .reply-content {
          flex: 1;
          margin-bottom: 10px;
        }
        .post-replies .likes {
          float: right;
          color: var(--light-text-disabled-color);
        }
        .post-replies .likes i {
          /* color: #f31212; */
          margin-right: 2px;
          font-size: 13px;
          position: relative;
          top: 2px;
        }
        .post-info {
          font-size: 13px;
          /* color: var(--light-text-disabled-color); */
          padding: 0 25px;
          display: flex;
          flex-direction: row;
          clear: both;
          font-family: 'Google Sans';
          font-weight: 500;
          color: var(--blue);
          margin-bottom: 15px;
          justify-content: flex-end;
        }
        .post-info > div {
          margin-right: 5px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .post-info i.material-icons {
          font-size: 12px;
          margin-right: 2px;
        }
        .post-loading {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          display: none;
          overscroll-behavior: none;
          overflow: auto;
          height: 100vh;
        }
        .post-loading .post {
          padding-bottom: 40px;
        }
        .post-loading .post-info,
        .post-loading .post-replies {
          display: none;
        }
        #post-loading-post {
          position: relative;
          z-index: 5;
        }
        #post-loading-background {
          position: absolute;
        }
        scale-animation-container {
          --sac-height: 101vh;
          --sac-width: 100vw;
          box-sizing: border-box;
          background-color: var(--surface-4dp);
          --sac-animation-duration: .3s;
          position: relative;
        }
        .spinner-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .page-loading {
          height: var(--page-height);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background-color: var(--surface);
        }
        :host-context(.theme-dark) .icon-pic img.line {
          filter: invert(1);
        }
        :host-context(.theme-dark) .icon-pic img.dinosaur {
          filter: invert(.8);
        }
      </style>
      <template is="dom-if" if="[[loading]]">
        <div id="page-loading" class="page-loading"><paper-spinner-lite active></paper-spinner-lite></div>
      </template>
      <p class\$="tips [[_addClass('show', updatedOn)]]">Last updated on: [[updatedOn]]</p>
      <template is="dom-repeat" items="[[posts]]">
        <div class="post" on-click="_jumpToTopic">
          <div class="post-card">
            <div class="title-line">
              <div class="title">
                <i>[[_getFloor(index)]]</i>
                [[_filterHTMLTag(item.title)]]
              </div>
              <bv-user-avatar class="avatar" src="[[item.avatar]]" user="[[item.author]]"></bv-user-avatar>
            </div>
            <div class="content">
              <s-html html="[[_filterHTMLTag(item.content)]]"></s-html>
            </div>
          </div>
          <div class="post-info">
            <div class="clicks"><i class="material-icons">remove_red_eye</i>[[item.clicks]]</div>
            <div class="replies"><i class="material-icons">sms</i>[[item.replyCount]]</div>
          </div>
          <div class="post-replies">
            <template is="dom-repeat" items="[[item.topComments]]">
              <div class="post-reply">
                <img class="avatar" src\$="[[item.avatar]]" />
                <div class="reply-content">
                  <s-html html="[[_filterHTMLTag(item.content)]]"></s-html>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template is="dom-if" if="{{_isEmpty(loading, posts)}}">
        <div class="empty">
          <div class="icon-pic">
            <img class="dinosaur" src="./assets/dinosaur-2.png" />
            <img class="line" src="./assets/line.png" />
          </div>
          <div class="text">
            <div>Please come back later...</div>
            The warrior is grabbing your newspaper from the dinosaur.
          </div>
        </div>
      </template>

      <div class="post-loading" id="post-loading">
        <scale-animation-container id="sac" mode="Y" initial-scale="[[initScale]]">
          <div style="width: 100%;height: var(--bv-toolbar-height)"></div>
          <div class="post" id="post-loading-post">
          </div>
          <div class="spinner-wrapper"><paper-spinner-lite active></paper-spinner-lite>
        </scale-animation-container></div>
      </div>
    `;
  }
  static get is() { return 'bv-today-page'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      posts: {
        type: Array,
        value: []
      },
      initScale: {
        type: Number,
        value: 1
      }
    };
  }
  _isEmpty() {
    return !this.loading && (!this.posts || this.posts.length === 0);
  }
  _getFloor(index) {
    if (index === 0) return '🥇';
    else if (index === 1) return '🥈';
    else if (index === 2) return '🥉';
    return index + 1;
  }
  async _jumpToTopic(ev) {
    const request = window.BVQuerys.topic(ev.model.item.t);
    window.pendingPostQuery = {
      t: ev.model.item.t,
      request
    };
    this.$['post-loading'].style.display = 'block';
    const ele = ev.currentTarget.querySelector('.post-card').cloneNode(true);
    ele.querySelector('s-html').html = ev.currentTarget.querySelector('s-html').html;
    ele.querySelector('bv-user-avatar').src = ev.currentTarget.querySelector('bv-user-avatar').src;
    this.$['post-loading-post'].appendChild(ele);
    const top = ev.currentTarget.offsetTop;
    if (!this._toolbarHeight) {
      this._toolbarHeight = parseInt(getComputedStyle(this).getPropertyValue('--bv-toolbar-height'), 10) || 56;
    }
    let y = ev.currentTarget.getBoundingClientRect().top;
    let height = ev.currentTarget.getBoundingClientRect().height;
    this.$['post-loading'].style.top = (top - y) + 'px';
    // this.$['sac'].style.paddingTop = this._toolbarHeight + 'px';
    this.initScale = (ele.clientHeight + this._toolbarHeight) / document.documentElement.clientHeight;
    flush();
    this.$['sac'].updateStyles();
    this.$['sac'].expand();
    this.$['post-loading'].animate({
      transform: ['translate3d(0, ' + ( y - this._toolbarHeight ) + 'px, 0)', 'translate3d(0, 0, 0)']
    }, {
      duration: 300,
      easing: 'cubic-bezier(.25,.1,.25,1)'
    });
    await request;
    this.disappear()
      .then(() => {
        this.$['post-loading'].style.display = 'none';
        this.$['post-loading-post'].innerHTML = '';
        window.v2ex.goToPage(this.rootPath + 't/' + ev.model.item.t);
      });
  }
  disappear() {
    return new Promise((resolve) => {
      this.animate({
        opacity: [1, 0]
      }, {
        duration: 300,
        easing: 'cubic-bezier(.25,.1,.25,1)'
      });
      this.$['post-loading-post'].animate({
        transform: ['scale(1, 1) translate3d(0, 0, 0)', 'scale(0.985, 0.985) translate3d(0, 10px, 0)']
      }, {
        duration: 300,
        easing: 'cubic-bezier(.25,.1,.25,1)'
      }).onfinish = resolve;
    });
  }
  async fetchTodayList() {
    this.loading = true;
    this.lastFetched = Date.now();
    let posts;
    try {
      posts = await window.BVQuerys.today();
    } catch (ex) {
      posts = [];
    }
    this.shadowRoot.querySelector('#page-loading').animate({
      opacity: [1, 0]
    }, {
      duration: 300,
      easing: 'ease-out'
    }).onfinish = () => {
      this.loading = false;
    };

    const d = new Date(0 + posts.days * 24 * 60 * 60 * 1000);
    this.updatedOn = posts.days ? `${MONTHS[d.getMonth()]} ${d.getDay() + 1} ${d.getFullYear()}` : '';
    this.set('posts', (posts.data || []).map((post) => {
      try {
        const detail = JSON.parse(post.content_json);
        let topComments = [];
        (detail.topComments || []).forEach((comment) => {
          if (comment.likes === 1 && topComments.length > 3) return;
          topComments.push(comment);
        });
        return {...post, ...detail, topComments};
      } catch (ex) {
        return post;
      }
    }));
  }
  connectedCallback() {
    super.connectedCallback();

    this.lastFetched = 0;
    this.addEventListener('page-select', () => {
      this.app.toolbar.setRightMenu();
      this.app.toolbar.setMode('normal');

      this.$['post-loading'].style.display = 'none';
      this.$['post-loading-post'].innerHTML = '';

      const now = Date.now();
      if (now - this.lastFetched <= TodayPage.kFetchInterval) {
        return;
      }

      this.fetchTodayList();
    });
  }
}
window.customElements.define(TodayPage.is, TodayPage);
