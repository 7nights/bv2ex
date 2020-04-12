import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../font-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class UserAvatar extends PolymerElement {
  static get template() {
    return html`
    <style include="font-icons"></style>
    <style>
      :host {
        --bv-user-avatar-size: 48px;
        --bv-user-avatar-border-size: 2px;

        display: flex;
        box-shadow: 0 1px 4px rgba(0, 0, 0, .12);
        overflow: hidden;
        border: var(--bv-user-avatar-border-size) solid #fff;
        box-sizing: border-box;
        width: var(--bv-user-avatar-size);
        height: var(--bv-user-avatar-size);
        border-radius: var(--bv-user-avatar-size);
      }
      a {
        width: calc(var(--bv-user-avatar-size) - 2 * var(--bv-user-avatar-border-size));
        height: calc(var(--bv-user-avatar-size) - 2 * var(--bv-user-avatar-border-size));
        position: relative;
        box-sizing: border-box;
        border: 2px solid var(--surface);
        border-radius: var(--bv-user-avatar-size);
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 100%;
        visibility: hidden;
      }
      i.material-icons {
        font-size: calc(var(--bv-user-avatar-size) - 2 * var(--bv-user-avatar-border-size) + 10px);
        display: none;
        position: relative;
        top: -5px;
        left: -5px;
      }
      :host(.gravatar) {
        /* --bv-user-avatar-border-size: 0px; */
      }
      :host(.gravatar) img {
        /* display: none; */
      }
      :host(.gravatar) i {
        display: none;
        /* display: inline-block; */
      }
    </style>
    <a id="container" href\$="/member/[[user]]">
      <img id="image" src="[[getAvatar(src)]]">
      <i id="icon" class="material-icons">
        account_circle
      </i>
    </a>
`;
  }

  static get is() { return 'bv-user-avatar'; }
  static get properties() {
    return {
      src: {
        type: String
      },
      user: {
        type: String
      },
      defaultBackgroundColor: {
        type: String,
        value: 'transparent'
      }
    };
  }
  static get COLORS() {
    /**
     * The 200 colors from material color palette.
     * See https://material.io/guidelines/style/color.html#color-color-palette
     */
    // return ['#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#E6EE9C', '#FFF59D', '#FFE082', '#FFCC80', '#FFAB91', '#BCAAA4', '#EEEEEE'];

    return [{ dark: '#f44336', light: '#EF9A9A' }, { dark : '#e91e63', light: '#f48fb1' }, 
      { dark: '#9c27b0', light: '#ce93d8' }, { dark: '#673ab7', light: '#b39ddb' }, 
      { dark: '#3f51b5', light: '#9fa8da' }, { dark: '#2196f3', light: '#90caf9' },
      { dark: '#03a9f4', light: '#81d4fa' }, { dark: '#00bcd4', light: '#80deea' },
      { dark: '#009688', light: '#80cbc4' }, { dark: '#4caf50', light: '#a5d6a7' },
      { dark: '#8bc34a', light: '#c5e1a5' }, { dark: '#cddc39', light: '#e6ee9c' },
      { dark: '#ffeb3b', light: '#fff59d' }, { dark: '#ffc107', light: '#ffe082' },
      { dark: '#ff9800', light: '#ffcc80' }, { dark: '#ff5722', light: '#ffab91' },
      { dark: '#795548', light: '#bcaaa4' }, { dark: '#9e9e9e', light: '#eeeeee' },
      { dark: '#b0bec5', light: '#607d8b' }];
  }
  get defaultAvatar() {
    return this.rootPath + 'assets/avatar/avatar-1.png';
  }
  constructor() {
    super();

    this._sid = 0;
    this.errorRetried = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.inited = false;

    this.$.image.onload = () => {
      if (this.$.image.src.indexOf(this.lastLoadUrl) === -1 && this.inited) return;
      this.inited = true;

      this.$.image.style.visibility = 'visible';
      this.$.image.animate([{opacity: 0}, {opacity: 1}], {
        duration: 300,
        fill: 'both',
        easing: 'ease-out'
      });
    };
    this.$.image.onerror = () => {
      if (this.errorRetried) return;
      console.warn('Failed to load ' + this.$.image.src + ', retrying...');
      this.errorRetried = true;
      this.$.image.src = this.$.image.src;
    };
  }
  loadImage(src) {
    this.errorRetried = false;
    this.$.image.style.opacity = 0;
    this.lastLoadUrl = src;
  }
  getAvatar(src) {
    let sid = ++this._sid;

    if (!src) {
      return this.defaultAvatar;
    }
    const AVATAR_SIZE = 25;

    this.$.image.style.visibility = 'hidden';
    let gravatar = src.match(/gravatar\/(.*?)[$|?]/);
    if (gravatar) {
      this.classList.add('gravatar');
      let hash = this._hash(gravatar[1]);
      hash = hash + Math.pow(2, 31);
      const color = UserAvatar.COLORS[hash % UserAvatar.COLORS.length];
      this.$.container.style.backgroundColor = color.dark;
      this.$.icon.style.color = color.light;
      this.$.image.style.visibility = 'visible';
      // TODO:
      if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
        return src.replace(/&d=(.*?)($|&)/, () => {
          return '&d=' + encodeURIComponent(this.rootPath + 'assets/avatar/avatar-' + (hash % AVATAR_SIZE + 1) + '.png');
        });
      }
      return this.rootPath + 'assets/avatar/avatar-' + (hash % AVATAR_SIZE + 1) + '.png';
    }
    this.classList.remove('gravatar');
    this.$.container.style.backgroundColor = this.defaultBackgroundColor;

    // replace to high resolution avatar
    let hrSrc = src.replace(/_normal\./, '_large.');
    this.loadImage(hrSrc);

    return hrSrc;
  }
  _hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      let character = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash = hash & hash;
    }
    return hash;
  }
}

window.customElements.define(UserAvatar.is, UserAvatar);
