import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../components/bv-fadein-image/bv-fadein-image.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * @customElement
 * @polymer
 */
class TopicContent extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          overflow: hidden;
          word-break: break-all;
          margin-bottom: 25px;
          line-height: 1.5;
          user-select: text;
        }
        img {
          max-width: 100%;
        }
        p {
          margin-top: 0;
        }
        .image-container {
          display: flex;
          flex-direction: row;
          overflow: auto;
          padding: 10px 10px 10px 15px;
          margin: 0 -15px 0 -21px;
          -webkit-overflow-scrolling: touch;
        }
        .image-container .image-wrap {
          overflow: hidden;
          width: 55vw;
          height: calc(55vw * 0.618);
          flex-shrink: 0;
          box-shadow: 0 3px 6px rgba(0, 0, 0, .16);
          border-radius: 4px;
          margin-right: 15px;
          border: 1px solid #e6e6e6;
          background-size: cover;
          background-repeat: no-repeat;
          margin-bottom: 16px;
        }
        .markdown_body p:last-child {
          margin-bottom: 0;
          /* margin-bottom: -25px;
          padding-bottom: 25px; */
        }
        .markdown_body ul {
          -webkit-padding-start: 20px;
        }
        hr {
          border-color: #ddd;
          border-style: dashed;
          border-width: 1px;
          border-top-width: 0;
          margin-bottom: 1em;
        }
        h1 {
          font-size: 20px;
        }
        h2 {
          font-size: 16px;
        }
        h3, h4, h5, h6 {
          font-size: 14px;
        }
        a {
          color: var(--blue);
          text-decoration: none;
        }
        pre {
          overflow: auto;
          /* background-color: #f2f2f2; */
          padding: 8px;
          font-size: 13px;
          border-radius: 4px;
        }
        :host-context(.theme-dark) pre {
          background-color: #282828;
        }
      </style>
    `;
  }
  static get is() { return 'bv-topic-content'; }
  static get properties() {
    return {
      content: {
        type: Object,
        value: '',
        observer: '_contentChange'
      }
    };
  }
  constructor() {
    super();
    this.imageWidth = document.documentElement.clientWidth * .55;
    this.imageHeight = this.imageWidth * .618;
  }
  _contentChange() {
    if (!this._styleText) {
      this._styleText = this.shadowRoot.children[0].textContent;
    }
    this.shadowRoot.innerHTML = '<style>' + this._styleText + '</style>' + `<link rel="stylesheet"
    href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/gruvbox-dark.min.css">` + this.handleContent(this.content);
    [].forEach.call(this.shadowRoot.querySelectorAll('pre code'), (val) => {
      if (!window.hljs) {
        setTimeout(() => {
          window.hljs.highlightBlock(val);
        }, 1000);
      } else {
        window.hljs.highlightBlock(val);
      }
    });
  }
  handleContent(c) {
    if (!c) return '';

    // Transform image URL to image tag
    c = c.replace(/<a [^>]*? href="([^"]*?)\.(jpg|png)".*?<\/a>/g, ($, $1, $2) => {
      let v2exImg = $1.match(/^\/i\/(.*)/);
      if (v2exImg) {
        $1 = 'https://i.v2ex.co/' + v2exImg[1];
      }
      return `<br /><img src="${$1}.${$2}" />`;
    });

    return c.replace(/(<p>[\n ]*?<img (.*?)>[\n ]*?<\/p>[\n ]*){2,}/g, ($) => {
      let index = 0;
      return '<div class="image-container">' + $.replace(/<p>[\n ]*?<img (.*?)src="(.*?)"(.*?)>[\n ]*?<\/p>/g, ($, $1, $2) => {
        return `<div class="image-wrap"><bv-fadein-image data-index="${index++}" width="${this.imageWidth}" height="${this.imageHeight}" src="${$2}"></bv-fadein-image></div>`;
      }) + '</div>';
    })
      .replace(/<p>[\n ]*?(<img (.*?)>[\n ]*)*?<\/p>/g, ($, imgs) => {
        let index = 0;
        return '<div class="image-container">' + $.replace(/<img (.*?)src="(.*?)"(.*?)>/g, ($, $1, src) => {
          return `<div class="image-wrap"><bv-fadein-image data-index="${index++}" width="${this.imageWidth}" height="${this.imageHeight}" src="${src}"></bv-fadein-image></div>`;
        }) + '</div>';
      })
      .replace(/<a href.*?>(<img (.*?)>[\n ]*)*?<\/a>/g, ($, imgs) => {
        let index = 0;
        return '<div class="image-container">' + $.replace(/<a href.*?><img (.*?)src="(.*?)"(.*?)><\/a>/g, ($, $1, src) => {
          return `<div class="image-wrap"><bv-fadein-image data-index="${index++}" width="${this.imageWidth}" height="${this.imageHeight}" src="${src}"></bv-fadein-image></div>`;
        }) + '</div>';
      })
      .replace(/((<br \/>)*?<img ([^>]*?)>[\r\n ]*){2,}/g, ($) => {
        let index = 0;
        return '<div class="image-container">' + $.replace(/<img (.*?)src="(.*?)"(.*?)>/g, ($, $1, src) => {
          return `<div class="image-wrap"><bv-fadein-image data-index="${index++}" width="${this.imageWidth}" height="${this.imageHeight}" src="${src}"></bv-fadein-image></div>`;
        }) + '</div>';
      });
  }
  connectedCallback() {
    super.connectedCallback();
    
    this.addEventListener('click', (ev) => {
      let target = ev.composedPath()[0];
      let index = target.dataset.index;
      if (target.tagName === 'BV-FADEIN-IMAGE') {
        let container = target.parentElement;
        while (container) {
          if (container.classList.contains('image-container')) break;
          container = container.parentElement;
        }
        if (container) {
          let images = container.querySelectorAll('bv-fadein-image');
          images = [].map.call(images, (val) => val.src);
          window['image-viewer'].viewImages(images, +index);
        }
      }
    });
  }
}

window.customElements.define(TopicContent.is, TopicContent);
