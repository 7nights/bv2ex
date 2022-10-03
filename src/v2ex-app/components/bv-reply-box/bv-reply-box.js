import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { BVBehaviors } from '../../behaviors.js';
import '../bv-user-avatar/bv-user-avatar.js';
import icons from '../../font-icons.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
/**
 * @customElement
 * @polymer
 */
class ReplyBox extends mixinBehaviors([BVBehaviors.UtilBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        box-shadow: 0 -1px 6px rgba(0, 0, 0, .08);
        background-color: var(--surface-4dp);
        transform: translate3d(0, 63px, 0);
        transition: transform .3s ease-out;
        z-index: 20;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        overflow: hidden;
      }
      :host(.editing) textarea {
        height: 70px;
      }
      :host(.editing) .textarea {
        height: 95px;
      }
      :host(.editing) .buttons {
        display: flex;
      }
      :host .textarea {
        height: 55px;
        display: flex;
        flex-direction: row;
      }
      :host(:not(.show)) .textarea {
        height: 55px;
      }
      :host(:not(.show)) .buttons {
        display: none;
      }
      :host(.show) {
        /* display: block; */
        transform: translate3d(0, 0, 0);
      }
      .buttons {
        display: none;
        flex-direction: row;
        align-items: center;
        padding: 10px 15px;
        margin-bottom: 5px;
      }
      textarea {
        height: 30px;
        padding-top: 20px;
        padding-right: 10px;
        outline: none;
        border: none;
        font-family: Roboto, 'Noto Sans CJK JP';
        flex: 1;
        resize: none;
        font-size: 14px;
        color: var(--light-text-primary-color);
        background-color: var(--surface-4dp);
      }
      textarea::placeholder {
        color: var(--light-text-secondary-color);
      }
      img.avatar {
        margin: 11px 20px 0 15px;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        border: 1px solid #eee;
        box-sizing: border-box;
      }
      .words-count {
        font-size: 13px;
        font-weight: 500;
        color: var(--light-text-disabled-color);
      }
      .emoji {
        color: var(--light-text-secondary-color);
        margin-left: 10px;
      }
      .emoji i {
        vertical-align: top;
      }
      .blank {
        flex: 1;
      }
      bv-light-button {
        height: 28px;
        padding: 0 15px;
        font-weight: bold;
        font-size: 14px;
        font-family: Roboto;
        position: relative;
      }
      .cancel-button {
        margin-right: 0px;
      }
      .submit-button {
        margin-right: -10px;
      }
      #sending {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: none;
      }
      #progress {
        transform: scaleX(0);
        transform-origin: 0 0;
        background-color: rgba(54, 139, 254, 0.25);
        height: 100%;
      }
      .emoji-item {
        float: left;
        padding: 5px;
        margin-right: 5px;
      }
      .emoji-item img {
        width: 24px;
        height: 24px;
        margin: 0;
        border: none;
      }
      .emoji-selector {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 54px;
        right: 0;
        background: #fff;
        align-items: center;
        padding: 0 15px;
        box-sizing: border-box;
        display: none;
      }
      .emoji-selector.show {
        display: flex;
      }
      .cancel-emoji-input {
        color: var(--light-text-secondary-color);
      }
      .emoji-container {
        flex: 1;
      }
    </style>
    <div class="textarea">
      <img class="avatar" src="[[avatar]]">
      <textarea id="textarea" on-focus="_onTextareaFocus" placeholder="Leave a comment" value="{{replyContent::input}}"></textarea>
    </div>
    <div class="buttons">
      <div class="words-count"><span>[[wordsCount]]</span> word(s)</div>
      <div class="emoji" on-click="showEmojiSelector"><i class="material-icons">sentiment_very_satisfied</i></div>
      <div class="blank"></div>
      <bv-light-button class="no-background secondary cancel-button" on-click="_clearReplyContent"><paper-ripple></paper-ripple>CLEAR</bv-light-button>
      <bv-light-button class="no-background submit-button" on-click="_submitReply"><paper-ripple></paper-ripple>POST</bv-light-button>
    </div>
    <div class\$="emoji-selector [[_addClass('show', ifShowEmojiSelector)]]">
      <div class="emoji-container">
        <template is="dom-repeat" items="[[emojis]]">
          <div class="emoji-item" on-click="emojiSelect">
            <template is="dom-if" if="[[item.image]]">
              <img src\$="[[item.image]]" width="20" height="20">
            </template>
            <span>[[item.code]]</span>
          </div>
        </template>
      </div>
      <bv-light-button class="cancel-emoji-input" on-click="hideEmojiSelector">Cancel</bv-light-button>
    </div>
    <div id="sending">
      <div id="progress"></div>
    </div>
`;
  }

  static get is() { return 'bv-reply-box'; }
  static get properties() {
    return {
      avatar: {
        type: String
      },
      replyContent: {
        type: String,
        value: '',
        notify: true
      },
      wordsCount: {
        type: Number,
        computed: '_getWordsCount(replyContent)'
      },
      topic: {
        type: String,
        value: ''
      },
      once: {
        type: String,
        value: ''
      }
    };
  }
  focusInput(doNotScroll = false) {
    !doNotScroll && window.scrollBy(0, 50);
    setTimeout(() => {
      this.$.textarea.focus();
    }, 0);
  }
  emojiSelect(ev) {
    const emoji = ev.model.item;
    document.execCommand('insertText', false, emoji.inputCode);
    this.ifShowEmojiSelector = false;
  }
  hideEmojiSelector() {
    this.ifShowEmojiSelector = false;
    this.$.textarea.focus();
  }
  showEmojiSelector() {
    this.ifShowEmojiSelector = true;
    this.$.textarea.focus();
  }
  handleReplyContent(text) {
    // handle emojis
    this.emojis.forEach((val) => {
      text = text.replace(new RegExp(val.inputCode, 'g'), () => {
        return val.image || val.code;
      });
    });
    return text;
  }
  handleReplyContentForHtml(text) {
    // handle emojis
    this.emojis.forEach((val) => {
      text = text.replace(new RegExp(val.inputCode, 'g'), () => {
        if (val.image) {
          return `<img src="${val.image}" width="20" height="20" />`
        }
        return val.code;
      });
    });
    return text;
  }
  async _submitReply() {
    if (this.replyContent.trim().length === 0) {
      // TODO: notice user
      return;
    }
    this.$.sending.style.display = 'block';
    let ended = false;
    setTimeout(() => {
      if (ended) return;
      this.$.progress.animate([{
        transform: 'scaleX(0)',
        easing: 'ease-out'
      }, {
        transform: 'scaleX(.4)',
        offset: .7,
        easing: 'ease-in'
      }, {
        transform: 'scaleX(.8)'
      }], {
        duration: 3000,
        fill: 'both'
      });
    }, 150);

    // TODO: send reply
    let result;
    let realReplyContent = this.handleReplyContent(this.replyContent);
    try {
      result = await window.BVQuerys.reply(this.topic, realReplyContent, this.once);
      if (result.error) throw new Error(result.error.message);
    } catch (ex) {
      console.error(ex);
      this.$.sending.style.display = 'none';
      this.dispatchEvent(new CustomEvent('reply-failed', {detail: {t: this.topic, error: ex}}));
      return;
    }
    console.log(result);
    this.$.textarea.blur();
    this.classList.remove('editing');
    ended = true;
    this.$.progress.animate([{
      transform: 'scaleX(.8)'
    }, {
      transform: 'scaleX(1)'
    }], {
      duration: 300,
      fill: 'both',
      easing: 'ease-out'
    }).onfinish = () => {
      let c = this.handleReplyContentForHtml(this.replyContent);
      this.replyContent = '';
      this.$.sending.style.display = 'none';
      this.dispatchEvent(new CustomEvent('reply-sent', {detail: {t: this.topic, content: c}}));
    };
  }
  _clearReplyContent() {
    window.dialog.open({
      content: 'Clear reply content?',
      positiveText: 'Yes',
      negativeText: 'Cancel'
    })
      .then(ret => {
        this.replyContent = ''
      });
  }
  _getWordsCount(val) {
    let latinWords = 0;
    val = val.replace(/([a-zA-Z])+/g, ($0) => {
      latinWords++;
      return '';
    });
    return (val.length + latinWords) || 0;
  }
  _onTextareaFocus() {
    this.classList.add('editing');
    if (this.listenerAdded) return;
    this.listenerAdded = true;
    const self = this;
    document.addEventListener('click', function fn(ev) {
      if (ev.target !== self) {
        self.classList.remove('editing');
        document.removeEventListener('click', fn);
        self.listenerAdded = false;
      } else {
        self.$.textarea.focus();
      }
    });
  }
  constructor() {
    super();

    this._show = false;
    this.emojis = [{
      image: 'https://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a1/2018new_doge02_org.png',
      code: '',
      inputCode: ':doge:'
    }, {
      image: 'https://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/hot_wosuanle_thumb.png',
      code: '',
      inputCode: ':sour:'
    }];
  }
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [icons];
    const animationKeyframs = [{
      transform: 'translate3d(0, 55px, 0)'
    }, {
      transform: 'translate3d(0, 0, 0)'
    }];
    const animationOptions = {
      duration: 1000,
      easing: 'ease-out',
      fill: 'none'
    };
    
    v2ex.addEventListener('page-unselect', (ev) => {
      if (ev.detail.oldPage.getAttribute('name') === 'topic') {
        this.classList.remove('show');
        this._show = false;
      }
    });
    window.addEventListener('scroll', BVUtils.throttle((ev) => {
      if (v2ex.selected !== 'topic') return;
      // if (ev.detail && ev.detail.originalEvent) ev = ev.detail.originalEvent;
      if (document.scrollingElement.scrollTop >= 50) {
        if (!this._show) {
          this.classList.add('show');
          // this._animation && this._animation.cancel();
          // this._animation = this.animate(animationKeyframs, animationOptions);
          this._show = true;
        }
      } else {
        if (this._show) {
          // this._animation && this._animation.cancel();
          // this._animation = this.animate(animationKeyframs, {...animationOptions, direction: 'reverse'});
          // this._animation.onfinish = () => {
          //     this.classList.remove('show');
          //     this._show = false;
          //   };
          this.classList.remove('show');
          this._show = false;
        }
      }
    }, 120), {passive: true});
  }
}

window.customElements.define(ReplyBox.is, ReplyBox);
