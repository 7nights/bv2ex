import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
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
class WritingPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        display: flex;
        flex-direction: column;
        margin-top: var(--bv-toolbar-height);
        color: var(--light-text-primary-color);
        min-height: 0;
        overflow: hidden;
      }
      .container {
        display: flex;
        height: calc(100vh - var(--bv-toolbar-height));
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      }
      .title-label,
      .content-label {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 10px;
      }
      .title-label {
        display: flex;
        align-items: center;
      }
      .title-label b {
        font-weight: 500;
        flex: 1;
      }
      .title-label span {
        font-size: 12px;
        line-height: 15px;
        font-weight: 400;
        color: var(--light-text-secondary-color);
      }
      .title-label .material-icons {
        font-size: 12px;
        vertical-align: middle;
        margin-right: 3px;
        color: var(--light-text-disabled-color);
      }
      #title {
        font-size: 13px;
        background-color: var(--surface-secondary);
        background-image: none;
        line-height: 31px;
        height: 31px;
        font-weight: 500;
        font-family: Roboto, 'Source Han Sans';
        outline: none;
        border-radius: 6px;
        border: none;
        margin-bottom: 20px;
        padding: 0 15px;
        transition: all .3s ease-out;
        color: var(--light-text-primary-color);
      }
      #content {
        color: var(--light-text-primary-color);
        font-size: 13px;
        background-color: var(--surface-secondary);
        background-image: none;
        outline: none;
        border-radius: 6px;
        border: none;
        resize: none;
        padding: 15px;
        flex: 1;
        margin-bottom: 20px;
        font-family: 'Noto sans';
        transition: all .3s ease-out;
      }
      #title:focus,
      #content:focus {
        background-color: var(--surface-16dp);
        box-shadow: 0 3px 16px rgba(0, 0, 0, .08);
      }
      .bottom-container {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .bottom-container .guidelines-button {
        font-size: 13px;
        color: var(--light-text-secondary-color);
        flex: 1;
      }
      .bottom-container .buttons {
        display: flex;
        flex-direction: row;
      }
      .bottom-container .buttons > div {
        line-height: 28px;
        height: 28px;
        padding: 0 12px;
        font-size: 13px;
        border-radius: 12px;
        position: relative;
      }
      .button-save {
        background: #F3F3F3;
        color: var(--blue);
        margin-right: 12px;
        font-weight: 500;
      }
      .button-create {
        background-color: var(--lighter-blue);
        color: #fff;
        font-weight: 500;
      }
      .guidelines {
        position: fixed;
        bottom: -100%;
        left: 0;
        background-color: var(--surface);
        padding: 20px;
        box-shadow: 0 -2px 8px rgba(0, 0, 0, .1);
        transition: bottom .3s ease-out;
        transform: translate3d(0, 0, 0);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }
      .guidelines .header {
        color: var(--blue);
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-bottom: 25px;
      }
      .guidelines .header span {
        flex: 1;
      }
      .guidelines .guideline {
        margin-bottom: 15px;
      }
      .guidelines .guideline .title {
        font-weight: 500;
        font-size: 14px;
      }
      .guidelines .guideline .body {
        font-size: 13px;
      }
      .posting .buttons {
        filter: grayscale(1);
      }
    </style>
    <div class\$="container [[_addClass('posting', posting)]]">
      <div class="title-label">
        <b>Title</b>
        <span on-click="goNodes"><i class="material-icons">label</i>[[_or(pageData.name, pageData.node)]]</span>
      </div>
      <input id="title">
      <div class="content-label">Content</div>
      <textarea id="content"></textarea>
      <div class="bottom-container">
        <div class="guidelines-button" on-click="toggleGuidelines">+ Community guidelines</div>
        <div class="buttons">
          <div class="button-save" on-click="savePost">SAVE<paper-ripple></paper-ripple></div>
          <div class="button-create" on-click="createTopic">CREATE<paper-ripple></paper-ripple></div>
        </div>
      </div>
    </div>
    <div class="guidelines" id="guidelines">
      <div class="header" on-click="toggleGuidelines">
        <span>Community guidelines</span>
        <i class="material-icons">expand_more</i>
      </div>
      <template is="dom-repeat" items="[[guidelines]]">
        <div class="guideline">
          <div class="title">[[item.title]]</div>
          <div class="body">[[item.body]]</div>
        </div>
      </template>
    </div>
    <app-route route="{{app.subRoute}}" pattern="/:node/:name" data="{{pageData}}">
    </app-route>
`;
  }

  static get is() { return 'bv-writing-page'; }
  static get properties() {
    return {
    };
  }
  constructor() {
    super();

    this.posting = false;
    this.guidelines = [{
      title: '尊重原创',
      body: '请不要在 V2EX 发布任何盗版下载链接，包括软件、音乐、电影等等。V2EX 是创意工作者的社区，我们尊重原创。'
    }, {
      title: '友好互助',
      body: '保持对陌生人的友善。用知识去帮助别人。'
    }];

    this.addEventListener('page-select', () => {
      this.app.toolbar.setRightMenu('notifications');
      this.app.toolbar.setMode('normal');
    });
  }
  toggleGuidelines() {
    if (this.$.guidelines.style.bottom !== '0px') {
      this.$.guidelines.style.bottom = '0px';
    } else {
      this.$.guidelines.style.bottom = '-' + (this.$.guidelines.offsetHeight + 20) + 'px';
    }
  }
  savePost() {
    window.dialog.open({content: 'Unimplemented function', negativeText: ''});
  }
  goNodes() {
    window.v2ex.goToPage(this.rootPath + 'nodes');
  }
  async createTopic() {
    // validate fields
    if (!this.pageData.node || this.posting) return;
    const title = this.$.title.value;
    const content = this.$.content.value;
    if (!title) return;
    if (!content) return;

    console.log(this.pageData, title, content);
    this.posting = true;

    let result = {};
    try {
      result = await window.BVQuerys.createTopic(this.pageData.node, title, content);
      if (result.error && result.data) {
        let div = document.createElement('div');
        div.innerHTML = result.data;
        result.data = div.innerText;
        div = null;
      }
    } catch (ex) {}
    this.posting = false;

    if (result.data && result.data.indexOf('/t') === 0) {
      this.$.title.value = '';
      this.$.content.value = '';
      return window.v2ex.goToPage(result.data);
    } else {
      window['global-error-toast'].text = 'Failed to create topic: ' + (result.data || 'Reason unknown.');
      window['global-error-toast'].open();
    }
  }
}
window.customElements.define(WritingPage.is, WritingPage);
