import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../font-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class ImageViewer extends PolymerElement {
  static get template() {
    return html`
    <style include="font-icons">
      :host {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-color: #000;
        z-index: 101;
        display: none;
        animation-name: fadeIn;
        animation-duration: .3s;
        animation-timing-function: ease-out;
        overscroll-behavior: contain;
        overflow: auto;
      }
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      .toolbar {
        height: 50px;
        align-items: center;
        color: #fff;
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
        padding: 0 10px;
        background-color: rgba(0, 0, 0, .6);
        position: relative;
        z-index: 10;
      }
      .toolbar > span {
        margin-right: 15px;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
      }
      .material-icons {
        font-size: 28px;
        margin-left: 5px;
      }
      .material-icons.bigger {
        font-size: 32px;
      }
      .download {
        font-size: 24px;
        margin-right: 2px;
      }
      .material-icons.disabled {
        opacity: .6 !important;
      }
      .toolbar .middle {
        flex: 1;
      }
      .images {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      #translate {
        justify-content: center;
        align-items: center;
        flex: 1;
        display: flex;
        width: 100%;
        flex-direction: column;
      }
      .images img {
        max-width: 100%;
        max-height: 100%;
        display: none;
      }
      .images img.show {
        display: block;
      }

    </style>
    <div class="toolbar">
      <i class="material-icons" on-click="close">clear</i>
      <div class="middle"></div>
      <span>[[currentImageIndex]]/[[images.length]]</span>
      <i class="material-icons download" on-click="download">get_app</i>
      <i class\$="material-icons bigger [[_isDisabled('prev', selected, images)]]" on-click="prevImage">keyboard_arrow_left</i>
      <i class\$="material-icons bigger [[_isDisabled('next', selected, images)]]" on-click="nextImage">keyboard_arrow_right</i>
    </div>
    <div id="images" style\$="transform: translate3d([[_getTranslate(_translate, _translateMove)]]);" class="images" on-touchstart="_onTouchStart" on-touchmove="_onTouchMove" on-touchend="_onTouchEnd">
      <div id="translate" style\$="transform: scale([[_getScale(_scale)]]); transform-origin: 0 0;">
        <template is="dom-repeat" items="[[images]]">
          <img class\$="[[_showImage(selected, index)]]" src\$="[[item]]">
        </template>
      </div>
    </div>
`;
  }

  // static MAX_SCALE_RATIO = 6;
  static get is() { return 'bv-image-viewer'; }
  static get properties() {
    return {
      images: {
        type: Array,
        readOnly: true
      },
      selected: {
        type: Number,
        value: 0
      },
      currentImageIndex: {
        type: Number,
        computed: '_getCurrentImageIndex(selected)'
      },
      _translate: {
        type: Object,
        value: {
          x: 0,
          y: 0
        }
      },
      _translateMove: {
        type: Object,
        value: {
          x: 0,
          y: 0
        }
      },
      _scale: {
        type: Number,
        value: 1
      },
      _origin: {
        type: Object,
        value: {
          x: 0,
          y: 0
        }
      }
    };
  }
  _getCurrentImageIndex(selected) {
    return selected + 1;
  }
  _getScale(scale) {
    return `${scale}`;
  }
  _getTranslate(t, m) {
    return `${t.x + m.x}px, ${t.y + m.y}px, 0`;
  }
  download() {
    const a = document.createElement('a');
    a.href = this.images[this.selected];
    a.download = 'download_image';
    a.click();
  }
  constructor() {
    super();

    this.resetScale();
  }
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('page-unselect', () => {
      this.close();
    });
    window.addEventListener('hashchange', (ev) => {
      if (this.showing && location.hash !== '#image-viewer') {
        this.close();
      }
    });
  }
  _onTouchStart(ev) {
    ev.preventDefault();
    let touches = ev.touches;
    // translate
    if (touches.length === 1) {
      this._startPoint = {
        x: ev.touches[0].clientX,
        y: ev.touches[0].clientY
      };
    }
    if (touches.length !== 2) return false;
    this._startPoint = null;
    let dx = touches[0].clientX - touches[1].clientX;
    let dy = touches[0].clientY - touches[1].clientY;

    this._origin = {
      x: this.$.translate.offsetLeft,
      y: this.$.translate.offsetTop
    };
    this._lastCurrentOrigin = this._currentOrigin || this._origin;
    let current = {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
    if (this._lastCurrentOrigin) {
      current = {
        x: ((current.x - this._translate.x - this._translateMove.x) - this._origin.x) / this._scale + this._origin.x,
        y: ((current.y - this._translate.y - this._translateMove.y) - this._origin.y) / this._scale + this._origin.y
      };
    }
    this._currentOrigin = current;

    this._startDiff = dx * dx + dy * dy;
  }
  _onTouchEnd(ev) {
    this._startDiff = -1;
    this._startPoint = null;
  }
  _onTouchMove(ev) {
    if (this._startPoint) {
      let touch = ev.touches[0];
      let dx = touch.clientX - this._startPoint.x;
      let dy = touch.clientY - this._startPoint.y;
      this._startPoint = {
        x: touch.clientX,
        y: touch.clientY
      };
      this._translateMove = {
        x: this._translateMove.x + dx,
        y: this._translateMove.y + dy
      };
    }

    if (this._startDiff === -1) return;
    let scaleFactor = document.documentElement.clientWidth * .7;
    scaleFactor = scaleFactor * scaleFactor;

    let touches = ev.touches;
    let dx = touches[0].clientX - touches[1].clientX;
    let dy = touches[0].clientY - touches[1].clientY;
    let _s = (dx * dx + dy * dy);
    let diff = _s - this._startDiff;
    this._startDiff = _s;
    this._scale = Math.min(Math.max(this._scale + diff / scaleFactor, 1), ImageViewer.MAX_SCALE_RATIO);

    let current = this._currentOrigin;
    let newTranslate = {
      x: -(current.x * (this._scale - 1) + this._origin.x * (1 - this._scale)),
      y: -(current.y * (this._scale - 1) + this._origin.y * (1 - this._scale))
    };
    if (this._lastCurrentOrigin && !this._lastCurrentOrigin.adjusted) {
      this._translateMove.x -= (newTranslate.x - this._translate.x);
      this._translateMove.y -= (newTranslate.y - this._translate.y);
      this._lastCurrentOrigin.adjusted = true;
    }
    this._translate = newTranslate;
  }
  _isDisabled(type, selected) {
    if (type === 'prev') {
      return selected !== 0 ? '' : 'disabled';
    }
    if (!this.images) return 'disabled';
    return selected !== this.images.length - 1 ? '' : 'disabled';
  }
  resetScale() {
    this._translateMove = {
      x: 0,
      y: 0
    };
    this._scale = 1;
    this._startDiff = -1;
    this._translate = {
      x: 0,
      y: 0
    };
    this._currentOrigin = null;
  }
  close() {
    if (location.hash === '#image-viewer') {
      return history.back();
    }
    this.showing = false;
    this.animate({opacity: [1, 0]}, {
      duration: 300,
      easing: 'ease-out'
    }).onfinish = () => {
      this.resetScale();
      this.style.display = 'none';
    };
  }
  prevImage() {
    this.resetScale();
    this.selected = Math.max(0, this.selected - 1);
  }
  nextImage() {
    this.resetScale();
    this.selected = Math.min(this.images.length - 1, this.selected + 1);
  }
  _showImage(s, i) {
    return s === i ? 'show' : '';
  }
  viewImages(images, index = 0) {
    this._setImages(images);
    this.selected = index;
    this.style.display = 'flex';
    location.hash = '#image-viewer';  
    this.showing = true;
  }
  viewImage(image) {
    return this.viewImages([image]);
  }
}
ImageViewer.MAX_SCALE_RATIO = 6;

window.customElements.define(ImageViewer.is, ImageViewer);
