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
/**
 * @customElement
 * @polymer
 */
class ListPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        color: var(--light-text-primary-color);
      }
      .tips {
        font-size: 13px;
        color: var(--light-blue-fg);
        background: var(--light-blue-bg);
        padding: 10px 15px;
        margin: 15px 15px 0;
        border-radius: 4px;
        display: none;
        /* border-bottom: 1px dashed #ddd; */
      }
      .tips.show {
        display: block;
      }
    </style>
    <div class\$="tips [[_addClass('show', tips)]]">[[tips]]</div>
    <my-recycler-view id="recycler-view" reuse-items-size="50" on-click="_jumpToTopic" style="display: block;" items="[[posts]]" tag="bv-timeline-post" target-property="post" class-names="hide-thumbs-up align-center large-padding"></my-recycler-view>
    <app-route route="{{app.subRoute}}" pattern="/:title" data="{{pageData}}">
    </app-route>
`;
  }

  static get is() { return 'bv-list-page'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      posts: {
        type: Array,
        value: [],
        observer: '_postsChange'
      },
      pageData: {
        type: Object
      }
    };
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
  _postsChange() {}
  constructor() {
    super();

    this.addEventListener('page-select', () => {
      this.app.toolbar.setRightMenu('notifications');
      this.app.toolbar.setMode('normal');
      
      this.$['recycler-view'].enable();
      if (history.state && history.state.posts) {
        this.app.toolbar.set('app.pageName', this.pageData.title);
        this.set('posts', history.state.posts);
        this.set('tips', history.state.tips || '');
      }
    });

    this.addEventListener('page-unselect', () => {
      this.$['recycler-view'].disable();
    });
  }
}
window.customElements.define(ListPage.is, ListPage);
