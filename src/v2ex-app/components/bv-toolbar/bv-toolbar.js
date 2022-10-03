import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '../../font-icons.js';
import { BVBehaviors } from '../../behaviors.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
 * @customElement
 * @polymer
 */
class BVToolbar extends mixinBehaviors([BVBehaviors.UtilBehavior], PolymerElement) {
  constructor() {
    super();
    if (!window._bv_toolbar_event) {
      window._bv_toolbar_event = 'attached';
      let timer = null;
      let self = this;
      window.addEventListener('scroll', function fn(ev, target) {
        // if (ev && ev.detail && ev.detail.originalEvent) ev = ev.detail.originalEvent;
        if (timer && ev) {
          return;
        } else if (ev) {
          timer = setTimeout(fn, 120);
          return;
        }
        timer = null;
        // console.log(document.scrollingElement.scrollTop);
        if (document.scrollingElement.scrollTop >= 50) {
          self.classList.add('shadow');
          document.body.classList.add('toolbar-deep');
        } else {
          self.classList.remove('shadow');
          document.body.classList.remove('toolbar-deep');
        }
      }, { passive: true });
    }
  }
  static get template() {
    return html`
    <style include="font-icons">
    :host {
      display: block;
      padding: 0 15px 0 20px;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      background-color: transparent;
      --bv-toolbar-height: 56px;
      transition: box-shadow 0.3s ease-out, transform 0.3s ease-out, background-color 0.2s cubic-bezier(0, 0, 0.1, 1);
    }
    
    :host(.shadow),
    :host-context(.shadow-toolbar) {
      background-color: rgba(var(--surface_rgb), .95);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }
    :host(.shadow) .bottom-split-border,
    :host-context(.shadow-toolbar) .bottom-split-border {
      border-bottom-color: transparent;
    }

    :host-context(.no-border-toolbar) {
      background-color: var(--surface);
    }
    
    :host-context(.theme-dark):host(.shadow),
    :host-context(.theme-dark.shadow-toolbar) {
      background-color: var(--surface-1dp);
    }
    
    :host(.no-toolbar) {
      transform: translate3d(0, calc(-10px - var(--bv-toolbar-height)), 0);
    }
    
    :host(.no-border-toolbar) .bottom-split-border {
      border-bottom-color: transparent !important;
    }

    :host-context(.smaller-toolbar):host {
      background-color: var(--surface);
    }
    
    :host-context(.smaller-toolbar):host(.shadow) {
      padding-top: 3px !important;
      padding-bottom: 3px;
    }
    
    :host-context(.no-border-toolbar):host(.shadow) {
      box-shadow: none !important;
    }
    
    :host-context(.theme-dark) .notification-button {
      background-color: var(--surface-4dp);
      color: var(--light-text-primary-color);
    }
    :host-context(.theme-dark) .bottom-split-border {
      border-bottom-color: transparent;
    }
    
    .container {
      height: var(--bv-toolbar-height);
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .container .back-button {
      display: none;
      position: relative;
      left: -18px;
      animation-name: back-button-animation;
      animation-fill-mode: backwards;
      animation-timing-function: ease-out;
      animation-duration: 0.3s;
      will-change: transform;
      margin-right: -20px;
      padding: 10px;
    }
    .container .back-button.show {
      display: block;
    }
    .container .back-button:active {
      opacity: 0.6;
    }
    
    @keyframes back-button-animation {
      0% {
        transform: translate3d(-10px, 0, 0);
        opacity: 0;
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    iron-selector > [name]:not(.iron-selected) {
      display: none;
    }
    
    .menu-container {
      -webkit-tap-highlight-color: transparent;
      padding: 0;
      --paper-menu-button-dropdown-background: var(--surface-24dp);
      --paper-menu-button-content: {
        box-shadow: var(--md-box-shadow-4dp);
      };
    }
    .menu-container .menu-item {
      min-width: 90px;
      padding: 15px 20px;
      outline: none;
      position: relative;
    }
    .menu-container .menu-list {
      padding: 10px 0;
    }
    .menu-container paper-item {
      min-width: 60px;
    }
    .menu-container paper-listbox {
      display: block;
    }
    .menu-container .menu-button {
      @apply --blue-bg;
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 24px;
      line-height: 24px;
      text-align: center;
    }
    .menu-container .menu-button .material-icons {
      vertical-align: middle;
      font-size: 21px;
    }
    
    .page-name {
      font-size: 22px;
      font-weight: bold;
      font-family: "Google Sans";
    }
    
    .back-to-top {
      flex: 1;
      height: 100%;
    }
    
    .bottom-split-border {
      /* border-bottom: 1px solid rgba(199, 199, 199, 0.1); */
    }
    
    .notification-button {
      position: relative;
      display: flex;
      height: 24px;
      align-items: center;
      border-radius: 24px;
      background-color: #9F9F9F;
      color: #fff;
      min-width: 24px;
      justify-content: center;
    }
    .notification-button span {
      font-weight: bold;
      font-size: 12px;
    }
    .notification-button .material-icons.notifications {
      font-size: 16px;
      position: relative;
      top: -1px;
    }
    .notification-button[data-read=unread] {
      background-color: var(--blue) !important;
      color: #fff !important;
      padding: 0 10px;
    }
    .notification-button[data-read=unread] .material-icons.notifications {
      left: -2px;
    }
    </style>
    <div class="container">
      <i on-click="back" class\$="material-icons back-button [[_addClass('show', _isNotHomePage)]]">keyboard_arrow_left</i>
      <div class="page-name">[[app.pageName]]</div>
      <div class="back-to-top" on-click="_backToTop"></div>
      <iron-selector attr-for-selected="name" selected="{{rightMenuName}}">
        <div name="none"></div>
        <div name="notifications" class="notification-button" on-click="_jumpToNotifications" data-read\$="[[_addClass('unread', haveUnreadNotification)]]">
          <paper-ripple></paper-ripple>
          <i class="material-icons notifications">notifications</i>
          <template is="dom-if" if="{{haveUnreadNotification}}">
            <span>[[app.notificationCount]]</span>
          </template>
        </div>
        <paper-menu-button id="paper-menu" horizontal-align="right" horizontal-offset="0" vertical-offset="-5" name="menu" class="menu-container">
          <div class="menu-button" slot="dropdown-trigger">
            <paper-ripple></paper-ripple>
            <i class="material-icons">more_horiz</i>
          </div>
          <div class="menu-list" slot="dropdown-content">
            <template is="dom-repeat" items="[[rightMenus]]">
              <div on-click="_menuClicked" class="menu-item">
                <paper-ripple></paper-ripple>
                [[item]]
              </div>
            </template>
          </div>
        </paper-menu-button>
      </iron-selector>
    </div>
    <template is="dom-if" if="{{_equal(mode, 'normal')}}"><div class="bottom-split-border"></div></template>
    `;
  }
  static get is() { return 'bv-toolbar'; }
  static get properties() {
    return {
      app: {
        type: Object,
        notify: true
      },
      haveUnreadNotification: {
        type: Boolean,
        computed: '_caclHaveUnreadNotification(app.notificationCount)'
      },
      mode: {
        type: String,
        value: 'normal'
      },
      _isNotHomePage: {
        type: Boolean,
        computed: '_isNotHome(app.pageName)'
      },
      rightMenuName: {
        type: String,
        value: 'notifications'
      },
      rightMenus: {
        type: Array
      }
    };
  }
  _jumpToNotifications() {
    window.v2ex.goToPage(this.rootPath + 'notifications');
  }
  _menuClicked(ev) {
    for (let i = 0, len = ev.target.parentElement.children.length; i < len; i++) {
      if (ev.target.parentElement.children[i] === ev.target) {
        setTimeout(() => {
          this.$['paper-menu'].close();
          typeof this._menus[i].onclick === 'function' && this._menus[i].onclick(this._menus[i], i);
          this.dispatchEvent(new CustomEvent('menu-click', {detail: {menu: this._menus[i], index: i}}));
        }, 100);
      }
    }
  }
  _backToTop() {
    document.scrollingElement.scrollTop = 0;
  }
  _isNotHome(pageName) {
    return pageName !== 'Timeline';
  }
  _caclHaveUnreadNotification(count) {
    return this.app.notificationCount > 0;
  }
  back() {
    history.back();
  }
  setMode(mode) {
    switch (mode) {
      case 'plain': {
        this.mode = 'plain';
        document.body.classList.add('smaller-toolbar');
        break;
      }
      case 'no-border': {
        this.mode = 'no-border';
        document.body.classList.add('no-border-toolbar');
        break;
      }
      case 'hidden': {
        this.mode = 'hidden';
        this.classList.add('no-toolbar');
        break;
      }
      case 'shadow': {
        this.mode = 'shadow';
        document.body.classList.add('shadow-toolbar');
        break;
      }
      default: {
        this.mode = 'normal';
        document.body.classList.remove('smaller-toolbar');
      }
    }
    if (mode !== 'hidden') this.classList.remove('no-toolbar');
    if (mode !== 'no-border') document.body.classList.remove('no-border-toolbar');
    if (mode !== 'plain') document.body.classList.remove('smaller-toolbar');
    if (mode !== 'shadow') document.body.classList.remove('shadow-toolbar');
  }
  setRightMenu(type, menu) {
    if (!type) type = 'none';
    if (type === 'normal' || type === 'notifications') {
      this.rightMenuName = 'notifications';
    } else if (type === 'menu') {
      this.rightMenuName = 'menu';
      this._menus = menu;
      this.rightMenus = menu.map((val) => {
        if (typeof val === 'string') return val;
        return val.label;
      });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.app.toolbar = this;
  }
}

window.customElements.define(BVToolbar.is, BVToolbar);
