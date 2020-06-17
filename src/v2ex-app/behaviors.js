import '@polymer/polymer/polymer-element.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-behaviors">
  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
export const BVBehaviors = {};
BVBehaviors.UtilBehavior = {
  _isEmpty: function (arg) {
    return !!arg;
  },
  _and: function (a, b) {
    return a && b;
  },
  _or: function (a, b) {
    return a || b;
  },
  _ternary: function (boolean, yes, no) {
    return boolean ? yes : no;
  },
  _addClass: function (name, prop) {
    return prop ? name : '';
  },
  _addClassIfNot: function (name, prop) {
    return prop ? '' : name;
  },
  _equal: function (a, b) {
    return a == b;
  },
  _not(a) {
    return !a;
  },
  _notEqual: function (a, b) {
    return a != b;
  },
  _filterUndefined(text) {
    if (text === 'undefined') return '';
    if (text === undefined) return '';

    return text;
  },
  _filterHTMLTag(html, preserveWrap = false) {
    const d = document.createElement('div');
    d.innerHTML = html;
    const innerText = d.innerText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return !preserveWrap ? innerText : innerText.replace(/\n/g, '<br />').replace(/(<br \/>){2,}/g, '<br />');
  },
  _normalizeTopic(t) {
    if (typeof t === 'object') {
      let id = t.t;
      let replyCount = 0;
      let index = id.indexOf('#');
      if (~index) {
        replyCount = id.substr(index + 6);
        id = id.substr(0, index);
      }
      if (replyCount) {
        t.replyCount = replyCount;
        t.id = id;
      }
      return t;
    }
    let index = t.indexOf('#');
    if (~index) return t.substr(0, index);
    return t;
  },
  _getReplyCount(t) {
    const index = t.indexOf('#');
    if (~index) return t.substr(index + 6);
    else return 0;
  }
};

BVBehaviors.PageBehavior = {
  properties: {
    app: {
      type: Object,
      notify: true,
      value: () => {
        return window.t.app;
      }
    },
    appRoot: {
      type: Object,
      notify: true,
      value: () => {
        return window.t;
      }
    },
    pageData: {
      type: Object
    }
  },
  connectedCallback() {
    [].forEach.call(this.shadowRoot.querySelectorAll('[append-to-body]'), (v) => {
      document.body.appendChild(v);
    });

    this.addEventListener('page-select', () => {
      document.scrollingElement.scrollTop = 0;
    });
    this.addEventListener('page-unselect', () => {
      window.loading.hide(false);
    });
  },
  disappear() {
    return new Promise((resolve, reject) => {
      const ani = this.animate([{
        transform: 'translate3d(0, 0, 0)',
        opacity: 1
      }, {
        transform: 'translate3d(0, 50px, 0)',
        opacity: 0
      }], {
        duration: 300,
        easing: 'ease-out'
      });
      ani.onfinish = resolve;
      ani.oncancel = reject;
    });
  },
  // handleScrollEvent_(ev) {
  //   const event = new CustomEvent('pagescroll', {
  //     detail: {
  //       originalEvent: ev
  //     }
  //   });
  //   window.dispatchEvent(event);
  // },
  // disconnectedCallback() {
  //   this.removeEventListener('scroll', this.handleScrollEvent_, {passive: true});
  // },
  // connectedCallback() {
  //   this.addEventListener('scroll', this.handleScrollEvent_, {passive: true});
  // }
};
