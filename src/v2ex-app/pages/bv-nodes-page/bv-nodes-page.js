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
class NodesPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        color: var(--light-text-primary-color);
        position: relative;
      }
      .nodes-container {
        padding: 0 16px 20px;
      }
      .nodes-header {
        margin-bottom: 20px;
        padding: 0 2px;
      }
      .nodes-header h2 {
        margin: 0;
        font-size: 20px;
      }
      :host-context(.theme-dark) section:nth-child(2) .nodes-header h2 {
        border-top-color: var(--surface-4dp);
      }
      section:nth-child(2) .nodes-header h2 {
        padding-top: 13px;
        border-top: 1px solid #f3f3f3;
      }
      .nodes-header .subtitle {
        color: var(--light-text-secondary-color);
        font-size: 12px;
      }
      .nodes {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-left: -14px;
        overflow: hidden;
      }
      :host-context(.theme-dark) .nodes .node {
        background-color: var(--surface-2dp);
      }
      .nodes .node {
        background-color: #F3F3F3;
        font-size: 13px;
        margin-left: 14px;
        color: var(--light-text-secondary-color);
        line-height: 21px;
        padding: 0 12px;
        border-radius: 12px;
        margin-bottom: 15px;
        text-decoration: none;
        position: relative;
      }
      section .expand-nodes {
        display: flex;
        align-items: center;
      }
      section .expand-nodes .opx-border {
        flex: 1;
      }
      section:not(.expanded) .nodes {
        height: 175px;
      }
      .expand-nodes paper-button {
        font-size: 13px;
        color: var(--blue);
        font-weight: 500;
        text-transform: none;
        margin-left: 5px;
      }
      :host-context(.theme-dark) .background-image {
        filter: invert(.8);
      }
      .background-image {
        width: 60px;
        position: absolute;
        right: 20px;
        top: -4px;
      }

      #search-container {
        margin: 2px 0 18px;
        position: relative;
      }
      .search-input-wrapper {
        display: flex;
        align-items: center;
        background-color: var(--input-background);
        width: calc(100vw - 120px);
        line-height: 32px;
        border-radius: 32px;
      }
      .search-input-wrapper i {
        margin: 0 4px 0 10px;
        font-size: 16px;
        color: var(--light-text-secondary-color);
      }
      .search-input-wrapper i.clear {
        margin-right: 10px;
        display: none;
      }
      .search-input-wrapper i.clear.show {
        display: inline-block;
      }
      #search-input {
        outline: none;
        background-image: none;
        background-color: transparent;
        color: var(--light-text-secondary-color);
        border: none;
        line-height: 32px;
        flex: 1;
        font-size: 14px;
      }
      #search-results {
        position: absolute;
        background-color: var(--surface-4dp);
        left: 0;
        right: 0;
        z-index: 10;
        padding: 4px 18px;
        margin-top: 5px;
        box-shadow: var(--md-box-shadow-4dp);
        display: none;
        border-radius: 16px;
      }
      #search-results.show {
        display: block;
      }
      .search-node {
        font-size: 14px;
        color: var(--light-text-primary-color);
        margin: 12px 0;
        cursor: pointer;
        text-decoration: none;
        display: block;
      }
      .search-node:active {
        opacity: .6;
      }
      .search-node > div {
        font-size: 12px;
        color: var(--light-text-secondary-color);
      }
    </style>
    <div class="nodes-container">
      <img src="./assets/nodes-dotted.png" class="background-image">
      <div id="search-container">
        <div class="search-input-wrapper">
          <i class="material-icons">search</i>
          <input id="search-input" type="text" value="{{keywords::input}}" />
          <i on-click="clearKeywords" class\$="material-icons clear [[_addClass('show', keywords)]]">clear</i>
        </div>
        <div id="search-results" class\$="[[_showSearchResults(searchResults)]]">
          <template is="dom-repeat" items="[[searchResults]]">
            <a class="search-node" href\$="/go/[[item.node]]">
              <span>[[item.nodeName]]</span>
              <div>[[item.node]]</div>
            </a>
          </template>
        </div>
      </div>
      <template is="dom-repeat" items="[[nodeSections]]">
        <section class\$="[[_addClass('expanded', item.expanded)]]">
          <div class="nodes-header">
            <h2>[[item.header.title]]</h2>
            <div class="subtitle">
              [[item.header.subtitle]] • [[item.nodes.length]] nodes
            </div>
          </div>
          <div class="nodes">
            <template is="dom-repeat" items="[[item.nodes]]" as="node">
              <a href\$="/go/[[node.node]]" class="node">[[node.nodeName]]</a>
            </template>
          </div>
          <template is="dom-if" if="[[_showExpandButton(item.nodes)]]">
            <div class="expand-nodes" on-click="toggleExpandSection">
              <div class="opx-border"></div>
              <paper-button>[[_ternary(item.expanded, 'Collapse', 'Show all')]]</paper-button>
            </div>
          </template>
        </section>
      </template>
    </div>
`;
  }

  static get is() { return 'bv-nodes-page'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      keywords: {
        type: String,
        observer: '_onSearchKeywordsChange'
      }
    };
  }
  _showSearchResults(searchResults) {
    return searchResults && searchResults.length > 0 ? 'show' : '';
  }
  toggleExpandSection(ev) {
    this.set(`nodeSections.${ev.model.index}.expanded`, !this.nodeSections[ev.model.index].expanded);
  }
  clearKeywords() {
    this.keywords = '';
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
  _showExpandButton(nodes) {
    return nodes.length >= 25;
  }
  _onSearchKeywordsChange(ev) {
    const results = [];
    if (!this.keywords) {
      return this.searchResults = results;
    }
    this.nodeSections.forEach((node) => {
      node.nodes.forEach((node) => {
        if (node.node.indexOf(this.keywords) !== -1 ||
          node.nodeName.indexOf(this.keywords) !== -1) {
          results.push(node);
        }
      });
    });
    this.searchResults = results.slice(0, 10);;
  }
  constructor() {
    super();

    this.searchResults = [];

    this.addEventListener('page-select', async () => {
      this.app.toolbar.setRightMenu('notifications');
      this.app.toolbar.setMode('plain');

      if (!this.nodeSections) {
        window.loading.show();
        const sections = await window.BVQuerys.nodes();
        window.loading.hide();
        if (sections && sections.data && sections.data.length > 0) {
          this.nodeSections = sections.data;
        }
      }
    });

    this.addEventListener('page-unselect', () => {
    });
  }
}
window.customElements.define(NodesPage.is, NodesPage);
