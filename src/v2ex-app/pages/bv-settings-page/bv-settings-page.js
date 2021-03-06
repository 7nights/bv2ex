import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
import '../../components/bv-user-avatar/bv-user-avatar.js';
import '@polymer/paper-ripple/paper-ripple.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class SettingsPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        margin-top: 0;
        color: var(--light-text-primary-color);
      }
      :host(.page-selected) {
        display: flex !important;
      }
      .banner {
        position: relative;
        padding: 0 15px 15px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .12);
      }
      .banner h1 {
        font-size: 20px;
        font-family: Google Sans;
        color: var(--light-text-primary-color);
      }
      :host-context(.theme-dark) .banner .daily-sentence {
        color: var(--light-text-secondary-color);
      }
      .banner .daily-sentence {
        color: #95989A;
        font-size: 12px;
      }
      .banner bv-user-avatar {
        position: absolute;
        right: 15px;
        top: 10px;
        --bv-user-avatar-size: 32px;
        --bv-user-avatar-border-size: 0px;
      }
      .list {
        flex: 1;
        background-color: var(--surface-secondary);
      }
      .list .item {
        display: flex;
        flex-direction: row;
        min-height: 75px;
        align-items: center;
        position: relative;
        border-bottom: 1px solid var(--border-color);
      }
      .list .item.section {
        border-bottom: none;
      }
      .list .item i {
        font-size: 28px;
        margin: 0 25px 0 18px;
      }
      .list .item b {
        font-size: 18px;
      }
      .list .item > div span {
        color: var(--light-text-secondary-color);
        font-size: 12px;
      }
      .list .item .title {
        display: flex;
        flex-direction: column;
      }
      .list .item .title b {
        margin-bottom: 5px;
      }
      .list .menu {
        --paper-toggle-button-checked-bar-color:  var(--blue);
        --paper-toggle-button-checked-button-color:  var(--blue);
        --paper-toggle-button-checked-ink-color: var(--blue);

        display: flex;
        flex-direction: row;
        padding-left: 70px;
        padding-right: 15px;
        margin-bottom: 30px;
      }
      .list .menu .menu-info {
        flex: 1;
        margin-right: 10px;
      }
      .list .menu .menu-title {
        font-weight: 500;
        font-size: 14px;
        color: var(--light-text-primary-color);
        margin-bottom: 5px;
      }
      .list .menu .menu-content {
        font-size: 12px;
        color: var(--light-text-secondary-color);
      }
      .menu-switcher {
        display: flex;
      }
    </style>
    <div class="banner">
      <h1>Hi, [[app.userInfo.username]]</h1>
      <div class="daily-sentence">[[getSentence()]]</div>
      <bv-user-avatar src\$="[[app.userInfo.avatar]]" user="[[app.userInfo.username]]"></bv-user-avatar>
    </div>
    <div class="list" id="list">
      <div class="item" name="Profile">
        <paper-ripple></paper-ripple>
        <i class="material-icons">face</i>
        <b>Profile</b>
      </div>
      <div class="item" name="History">
        <paper-ripple></paper-ripple>
        <i class="material-icons">timer</i>
        <div class="title">
          <b>History</b>
          <span>50 topics you recently read</span>
        </div>
      </div>
      <div class="item" name="Collected">
        <paper-ripple></paper-ripple>
        <i class="material-icons">bookmark_border</i>
        <div class="title">
          <b>Collected</b>
          <span>Collected topics</span>
        </div>
      </div>
      <div class="item section" name="Settings">
        <i class="material-icons">settings</i>
        <div class="title">
          <b>Settings</b>
        </div>
      </div>
      <div class="menu" on-click="changeThemeColor">
        <div class="menu-info">
          <div class="menu-title">Theme color</div>
          <div class="menu-content">{{colorSchemeText}}</div>
        </div>
      </div>
      <div class="menu">
        <div class="menu-info">
          <div class="menu-title">Compact mode</div>
          <div class="menu-content">Display more topics in one page. Restart needed to take effect.</div>
        </div>
        <div class="menu-switcher">
          <paper-toggle-button checked="{{compactMode}}"></paper-toggle-button>
        </div>
      </div>
    </div>
`;
  }

  static get is() { return 'bv-settings-page'; }
  static get properties() {
    return {
      themeColor: {
        type: String,
        value: 'auto',
        observer: '_settingsChange'
      },
      compactMode: {
        type: Boolean,
        value: false,
        observer: '_settingsChange'
      },
      colorSchemeText: {
        type: String,
        computed: '_getColorScheme(themeColor)'
      }
    };
  }
  constructor() {
    super();

    // load settings
    window.BVUtils.settings.load(this, 'user-settings', window.SETTINGS_FIELDS);

    this.addEventListener('page-select', () => {
      window.v2ex.children.toolbar.setMode('hidden');
      console.log(this.app.userInfo.avatar);
    });
  }
  changeThemeColor() {
    if (this.themeColor === 'auto') {
      this.themeColor = 'dark';
    } else if (this.themeColor === 'dark') {
      this.themeColor = 'light';
    } else {
      this.themeColor = 'auto';
    }
  }
  _getColorScheme(themeColor) {
    if (themeColor === 'auto') return 'Use System Selection (Default)';
    if (themeColor === 'light') return 'Light';
    if (themeColor === 'dark') return 'Dark';
  }
  _settingsChange() {
    window.BVUtils.settings.save(this, 'user-settings', window.SETTINGS_FIELDS);
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (this.themeColor === 'auto') window.APPLY_SYSTEM_COLOR_SCHEME();
    else if (this.themeColor === 'light') {
      document.body.classList.remove('theme-dark');
      metaThemeColor.setAttribute('content', '#ffffff');
    } else if (this.themeColor === 'dark') {
      document.body.classList.add('theme-dark');
      metaThemeColor.setAttribute('content', '#121212');
    }
  }
  getSentence() {
    const sentences = [
      'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
      'If a thing is worth doing it is worth doing well.',
      'Big mouthfuls ofter choke.',
      'All things are difficult before they are easy.',
      'The best preparation for tomorrow is doing your best today.'
    ];
    return sentences[Math.floor(Math.random() * sentences.length)];
  }
  connectedCallback() {
    super.connectedCallback();

    this.$.list.addEventListener('click', (ev) => {
      let target = ev.target;
      while (target) {
        if (target.classList.contains('item')) {
          break;
        }
        target = target.parentElement;
      }
      if (!target) return;
      this['_menuClick' + target.getAttribute('name')]();
    });
  }
  _menuClickProfile() {
    const hasUsername = this.app.userInfo.username ? Promise.resolve() : window.BVQuerys.recent();
    Promise.all([hasUsername, this.disappear()])
      .then(() => {
        v2ex.goToPage('/member/' + this.app.userInfo.username);
      });
  }
  _menuClickHistory() {
    this.disappear()
      .then(() => {
        v2ex.goToPage('/list/History', {
          posts: BVUtils.userStorage.get('recentViews'),
          name: 'History',
          tips: 'Showing 50 topics you\'ve recently read on this device.'
        });
      });
  }
  _menuClickCollected() {
    this.disappear()
      .then(() => {
        v2ex.goToPage('/collected');
      });
  }
}
window.customElements.define(SettingsPage.is, SettingsPage);
