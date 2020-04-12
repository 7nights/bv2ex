import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../../page-share-style.js';
import '../../font-icons.js';
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
class CipherInputer extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        --input-font-size: 15px;
      }
      input {
        outline: none;
        border: 1px solid var(--light-blue-border);
        background-color: var(--light-blue-bg);
        color: var(--light-blue-fg);
        font-size: var(--input-font-size);
        font-weight: bold;
        margin-right: 14px;
        border-radius: 4px;
        line-height: 50px;
        width: var(--input-font-size);
        padding: 0 12px;
        text-align: center;
      }
      input:last-child {
        margin-right: 0;
      }
      input:focus {
        background-color: var(--light-blue-fg);
        color: #fff;
      }
    </style>
    <template is="dom-repeat" items="[[inputs]]">
      <input type\$="[[type]]" on-input="onInput" on-keydown="onKeydown">
    </template>
`;
  }

  static get is() { return 'bv-cipher-inputer'; }
  static get properties() {
    return {
      value: {
        type: String,
        value: '',
        notify: true,
        observer: 'onValueChange'
      },
      size: {
        type: Number,
        value: 4
      },
      type: {
        type: String,
        value: 'number'
      },
      inputs: {
        type: Array,
        computed: '_getInputElements(size)'
      }
    };
  }
  focus() {
    this.shadowRoot.querySelector('input').focus();
  }
  onValueChange(newValue) {
    Array.from(this.shadowRoot.querySelectorAll('input')).forEach(($input, i) => {
      $input.value = ('' + newValue)[i] || '';
    });
  }
  onInput(event) {
    if (!(/[0-9]/.test(event.data))) {
      event.target.value = '';
      return;
    }
    event.target.value = event.data;
    this.onKeydown({
      keyCode: 13,
      preventDefault: () => {}
    });
  }
  onKeydown(event) {
    // enter
    if (event.keyCode === 13) {
      event.preventDefault();
      let value = '';
      for (let $input of Array.from(this.shadowRoot.querySelectorAll('input'))) {
        if (!(/[0-9]/.test($input.value))) {
          $input.value = '';
          $input.focus();
          return;
        }
        value += $input.value;
      }

      this.value = value;
      this.dispatchEvent(new CustomEvent('finish', {detail: this.value}));
    } else if (event.keyCode === 8) {
      // backspace
      if (event.target.value === '') {
        const $input = this.shadowRoot.querySelectorAll('input')[Math.max(0, event.model.index - 1)];
        $input.value = '';
        $input.focus();
      }
    }
  }
  _getInputElements(size) {
    return Array.from(Array(size).keys());
  }
  constructor() {
    super();
  }
}

window.customElements.define(CipherInputer.is, CipherInputer);
/**
 * @customElement
 * @polymer
 */
class LoginPage extends mixinBehaviors([BVBehaviors.UtilBehavior, BVBehaviors.PageBehavior], PolymerElement) {
  static get template() {
    return html`
    <style include="page-share-style"></style>
    <style include="font-icons">
      :host {
        display: flex;
        overflow: hidden;
        height: 100vh;
        margin-top: 0;
        background-color: #fefefe;
        background-image: url(../../../../assets/login-bg.png);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: 95px;
        flex-direction: column;
      }
      :host(.page-selected) {
        display: flex !important;
      }
      #logo {
        width: 84px;
        height: 84px;
        margin-top: 30px;
      }
      .center {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .bv2ex {
        color: #313131;
        font-size: 20px;
        font-family: Google Sans;
        font-weight: bold;
        text-shadow: 4px 4px rgba(49, 49, 49, .12);
        position: relative;
        z-index: 1;
      }
      .name-box {
        margin: 0 auto;
        width: 290px;
        height: 46px;
        position: relative;
      }
      .name-box .background {
        background-color: rgba(255, 255, 255, .73);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .left-corner {
        position: absolute;
        left: 0;
        top: 0;
      }
      .left-corner .part-1 {
        border-top: 3px solid #E86868;
        width: 16px;
      }
      .left-corner .part-2 {
        border-left: 3px solid #3985FF;
        height: 13px;
      }
      .right-corner {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      .right-corner .part-1 {
        border-bottom: 3px solid #E86868;
        width: 10px;
        height: 11px;
        position: relative;
        top: 11px;
      }
      .right-corner .part-2 {
        border-right: 3px solid #3985FF;
        height: 11px;
      }
      .blank {
        flex: 1;
      }
      .login-area {
        margin: 0 30px 30px;
      }
      .login-area .tips {
        font-size: 12px;
        font-family: Google Sans;
        color: #95989A;
        margin-bottom: 15px;
      }
      .login-area a,
      .footer .app-name {
        color: #358CFD;
        text-decoration: none;
      }
      .input-box {
        height: 40px;
        background: rgba(245, 245, 245, .8);
        margin-bottom: 15px;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        padding: 0 15px;
        justify-items: center;
        align-items: center;
      }
      .input-box input,
      .captcha-box input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        font-size: 13px;
        font-family: Roboto;
        font-weight: bold;
        color: #666;
      }
      .captcha-box input.highlight {
        border: 1px solid #ff4f4f;
      }
      .input-box input::-webkit-input-placeholder {
        color: #95989A;
      }
      .captcha-box {
        height: 40px;
        display: flex;
        flex-direction: row;
      }
      .captcha-image-container {
        height: 40px;
        width: 160px;
        background-color: #fff;
        margin-right: 15px;
      }
      .captcha-image-container img {
        height: 40px;
      }
      .captcha-box input {
        height: 100%;
        background: rgba(245, 245, 245, .8);
        border-radius: 4px;
        padding: 0 15px;
        width: 0;
      }
      div.right {
        justify-content: flex-end;
        display: flex;
        flex-direction: row;
      }
      #captcha {
        filter: grayscale(1);
        opacity: .7;
      }
      paper-button {
        background-image: linear-gradient(90deg, #3088FE 0%, #519BFC 100%);
        color: #fff;
        width: 90px;
        height: 36px;
        font-size: 14px;
        font-weight: 500;
      }
      .button-container {
        margin-top: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #95989A;
      }
      .footer .bg {
        background-color: rgba(255, 255, 255, .7);
      }
      .footer .love {
        color: #F8121A;
      }
      .login-area .material-icons {
        width: 20px;
        height: 20px;
        font-size: 20px;
        color: #95989A;
      }
      .cipher-container {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(255, 255, 255, .8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        flex-direction: column;
      }
      .cipher-tips {
        margin-top: 25px;
        font-size: 14px;
        color: var(--blue);
      }
    </style>
    <div class="center"><img id="logo" src="./assets/logo-without-bg.png"></div> 
    <div class="center name-box">
      <div class="background"></div>
      <div class="bv2ex">A Better Way to Experience</div>
      <div class="left-corner">
        <div class="part-1"></div>
        <div class="part-2"></div>
      </div>
      <div class="right-corner">
        <div class="part-1"></div>
        <div class="part-2"></div>
      </div>
    </div>
    <div class="blank"></div>
    <div class="login-area">
      <div class="tips">！User name and password will be auto filled because of <a href="#">server configuration</a>.</div>
      <div class="username-box input-box">
        <input value="{{usernameValue::input}}" name="username" placeholder="USERNAME" disabled="">
        <i class="material-icons">face</i>
      </div>
      <div class="password-box input-box">
        <input value="{{passwordValue::input}}" type="password" name="password" placeholder="PASSWORD" disabled="">
        <i class="material-icons">https</i>
      </div>
      <div class="captcha-box">
        <div class="captcha-image-container">
          <img id="captcha" src="[[captchaUrl]]">
        </div>
        <input value="{{captchaValue::input}}" id="captcha-input" name="captcha" class\$="[[_addClass('highlight', _highlightCaptcha)]]">
      </div>
      <div class="right button-container">
        <paper-button raised="" on-click="signIn">SIGN IN</paper-button>
      </div>
      <div class="footer">
        <span class="bg"><span class="app-name">A Better Way to Experience</span> from <b>Sean</b> with <span class="love">❤</span></span>
      </div>
    </div>
    <template is="dom-if" if="[[pageData.needCipher]]">
      <div class="cipher-container">
        <div class="input-button-container">
          <bv-cipher-inputer id="cipher-inputer" size="4" value="{{cipher}}" on-finish="onCipherInput"></bv-cipher-inputer>
        </div>
        <div class="cipher-tips">[[cipherTips]]</div>
      </div>
    </template>
    <app-route route="{{app.subRoute}}" pattern="/:needCipher" data="{{pageData}}">
    </app-route>
`;
  }

  static get is() { return 'bv-login-page'; }
  static get properties() {
    return {
      captchaUrl: {
        type: String,
        value: `${BVQuerys.SERVER_ADDRESS}/captcha`
      },
      app: {
        type: Object
      }
    };
  }
  constructor() {
    super();

    this._highlightCaptcha = false;
    this.cipherTips = 'Please enter the cipher to unlock.';

    this.addEventListener('page-select', () => {
      window.v2ex.children.toolbar.setMode('hidden');
      this.$.captcha.src = this.captchaUrl + '?t=' + Date.now();

      if (this.pageData.needCipher) {
        setTimeout(() => {
          this.shadowRoot.querySelector('#cipher-inputer').focus();
        }, 140);
      }
    });
  }
  onCipherInput() {
    window.BVQuerys.submitCipher(this.cipher)
      .then(ret => {
        if (ret.data === true) {
          window.v2ex.goToPage(this.rootPath);
          return;
        }
        throw new Error('failed to login');
      })
      .catch(ex => {
        console.error(ex);
        this.cipherTips = 'Please check your cipher and try again.';
        this.cipher = '';
        this.shadowRoot.querySelector('#cipher-inputer').focus();
      });
  }
  async signIn() {
    if (!this.captchaValue || this.captchaValue.trim().length === 0) {
      this._highlightCaptcha = true;
      this.$['captcha-input'].focus();
      return;
    }
    console.log('Try to sign in...');
    let result = await window.BVQuerys.signIn(this.captchaValue.trim());
    if (!result) {
      // TODO: failed to sign in
      console.error('login failed.');
      window['global-error-toast'].text = 'Failed to login, please retry.';
      window['global-error-toast'].open();
      setTimeout(() => {
        location.href = '/';
      }, 3000);
    } else {
      location.href = '/';
    }
  }
}
window.customElements.define(LoginPage.is, LoginPage);
