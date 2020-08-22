import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../font-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class BottomNavigation extends mixinBehaviors([BVBehaviors.UtilBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="font-icons">
      :host {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        box-shadow: 0 -1px 6px rgba(0, 0, 0, .08);
        background-color: var(--surface-4dp);
        transform: translate3d(0, 63px, 0);
        transition: transform .3s ease-out;
        z-index: 10;
        display: flex;
        flex-direction: row;
        height: 56px;
      }
      :host(.show) {
        /* display: block; */
        transform: translate3d(0, 0, 0);
      }
      a.item {
        position: relative;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 7px;
        /* color: #A5A5A5; */
        color: rgb(117, 117, 117);
        text-decoration: none;
      }
      a.item div {
        transition: transform .2s ease-out;
        will-change: transform;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      a.item.active div {
        /* transform: translate3d(0, -2px, 0); */
      }
      a.item i {
        font-size: 24px;
      }
      a.item {
        transition: color .2s ease-out;
      }
      a.item span {
        margin-top: 1px;
        font-size: 12px;
        -webkit-font-smoothing: antialiased;
        transform: scale(1);
        transition: transform .2s ease-out, color .2s ease-out;
        will-change: transform;
        font-family: 'Google Sans';
        font-weight: 500;
      }
      a.item.active span {
        /* transform: scale(1.1666666666666667); */
      }
      a.item.active i,
      a.item.active span {
        color: var(--blue);
      }
      a.item.active img {
        opacity: 1;
      }
      a.item img {
        opacity: 1;
      }
    </style>

    <a on-click="itemClicked" class\$="item [[_selected('home', app.currentPage)]]" href="/">
      <!-- <paper-ripple></paper-ripple> -->
      <div>
        <!-- <i class="material-icons">home</i> -->
        <img width="25" height="25" src="[[_getIcon('/assets/icons/material/home.svg', 'home', app.currentPage)]]">
        <span>Timeline</span>
      </div>
    </a>
    <a on-click="itemClicked" class\$="item [[_selected('today', app.currentPage)]]" href="/today" data-key="today">
      <!-- <paper-ripple></paper-ripple> -->
      <div>
        <i class="material-icons">whatshot</i>
        <span>Today</span>
      </div>
    </a>
    <a on-click="itemClicked" class\$="item [[_selected('nodes', app.currentPage)]]" href="/nodes">
      <!-- <paper-ripple></paper-ripple> -->
      <div>
        <i class="material-icons">apps</i>
        <span>Nodes</span>
      </div>
    </a>
    <a on-click="itemClicked" class\$="item [[_selected('others', app.currentPage)]]" href="/others">
      <!-- <paper-ripple></paper-ripple> -->
      <div>
        <!-- <i class="material-icons">menu</i> -->
        <img width="25" height="25" src\$="[[_getIcon('/assets/icons/material/perm_identity.svg', 'others', app.currentPage)]]">
        <span>Me</span>
      </div>
    </a>
`;
  }

  static get SCROLL_THRESHOLD() { return 150; }
  static get is() { return 'bv-bottom-navigation'; }
  static get properties() {
    return {
      visible: {
        type: Boolean,
        value: true
      },
      app: {
        type: Object
      }
    };
  }
  _getIcon(icon, selected) {
    selected = this._selected(selected);
    if (selected === 'active') {
      return icon;
    } else {
      return icon.replace(/\.svg/, '-black.svg');
    }
  }
  _selected(i) {
    const page = this.app.currentPage;
    if ((page === '' || page === 'home') && i === 'home') {
      return 'active';
    }
    if (page === 'today' && i === 'today') {
      return 'active';
    }
    if (page === 'nodes' && i === 'nodes') {
      return 'active';
    }
    if (page === 'others' && i === 'others') {
      return 'active';
    }
  }
  itemClicked(ev) {
    if (ev.currentTarget.classList.contains('active')) {
      document.scrollingElement.scrollTop = 0;
    }
    // if (ev.currentTarget.dataset.key === 'today') {
    //   v2ex.goToPage('/list/Today', {
    //     posts: BVUtils.userStorage.get('recentViews'),
    //     name: 'Today'
    //   });
    // }
  }
  constructor() {
    super();

    this._show = true;
    this._lastScrollTop = 0;
    this._scrollAmount = 0;
    this._scrollDirection = 0;
  }
  changeScrollingElement() {
    // TODO
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('page-select', (ev) => {
      if (['nodes', 'home', 'others', ''].indexOf(this.app.currentPage) === -1) {
        this.classList.remove('show');
        this._show = false;
        this.visible = false;
        return;
      }
      this.visible = true;
      this._show = true;
      this.classList.add('show');
    });
    window.addEventListener('scroll', BVUtils.throttle((ev) => {
      // if (ev.detail && ev.detail.originalEvent) ev = ev.detail.originalEvent;
      if (!this.visible) return;
      let scrollTop = document.scrollingElement.scrollTop;
      let forceShow = false;
      if (scrollTop === 0) {
        forceShow = true;
      }
      if (scrollTop >= this._lastScrollTop) {
        // direction: 1
        if (this._scrollDirection !== 1) {
          this._scrollAmount = 0;
          this._scrollDirection = 1;
        }
        this._scrollAmount += (scrollTop - this._lastScrollTop);
      } else {
        // direction: -1
        if (this._scrollDirection !== -1) {
          this._scrollAmount = 0;
          this._scrollDirection = -1;
        }
        this._scrollAmount += this._lastScrollTop - scrollTop;
      }

      this._lastScrollTop = scrollTop;

      if (this._scrollDirection === 1 && this._scrollAmount >= BottomNavigation.SCROLL_THRESHOLD) {
        if (this._show) {
          this.classList.remove('show');
          this._show = false;
        }
      } else if (forceShow || (this._scrollDirection === -1 && this._scrollAmount >= BottomNavigation.SCROLL_THRESHOLD)) {
        if (!this._show) {
          this.classList.add('show');
          this._show = true;
        }
      }
    }, 120), {passive: true});
  }
}

window.customElements.define(BottomNavigation.is, BottomNavigation);
