/* I have no idea why scrolling performance on Chrome Android is so terrible. */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import { microTask } from '@polymer/polymer/lib/utils/async.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-scroller">
  <template strip-whitespace="">
    <slot></slot>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * @customElement
 * @polymer
 */
class ChromeAndroidScrollingSaviour extends PolymerElement {
  static get is() { return 'bv-scroller'; }
  static get properties() {
    return {
      enabled: {
        type: Boolean,
        value: false
      },
      groupVolumn: {
        type: Number,
        value: 20
      },
      items: {
        type: Array,
        value: []
      },
      visibleRange: {
        type: Number,
        value: 300
      }
    };
  }
  _sliceItemsIntoGroups() {
    const arr = [];
    let i = 0;
    let len = this.items.length;
    while (i < len) {
      arr.push(this.items.slice(i, i + this.groupVolumn));
      i += this.groupVolumn;
    }
    return arr;
  }
  notifyGroupChange() {
    microTask.run(() => {
      microTask.run(() => {
        const groups = this.querySelectorAll('.bv-scroller-group');
        //Polymer.flush();
        groups.forEach((g) => {
          g.style.height = g.scrollHeight + 'px';
        });
      });
    });
  }
  constructor() {
    super();
    ChromeAndroidScrollingSaviour._instances.push(this);
  }
}

if (!ChromeAndroidScrollingSaviour._listenerAdded) {
  ChromeAndroidScrollingSaviour._listenerAdded = true;
  ChromeAndroidScrollingSaviour._instances = [];

  const screenHeight = document.documentElement.clientHeight;
  window.addEventListener('scroll', BVUtils.throttle(() => {
    let i = 0;
    let ins = ChromeAndroidScrollingSaviour._instances[i];
    while (ins) {
      if (!ins.enabled) {
        ins = ChromeAndroidScrollingSaviour._instances[++i]
        continue;
      }
      break;
    }
    if (!ins) return;
    let groups = ins.querySelectorAll('.bv-scroller-group');
    const visible = {};
    groups.forEach((node, i) => {
      if (node.scrollHeight !== node.offsetHeight) {
        node.style.height = node.scrollHeight + 'px';
      }

      const scrollTop = document.scrollingElement.scrollTop;

      let vb = scrollTop + screenHeight;
      let bt = node.offsetTop - vb;
      let gb = node.offsetTop + node.offsetHeight;
      if (node.offsetTop >= scrollTop && gb <= vb) {
        return visible[i] = 1;
      }
      if ((bt >= 0 && bt <= window.visibleRange) || (vb >= node.offsetTop && vb <= gb)) {
        return visible[i] = 1;
      }
      // viewport top to group bottom
      let tb = scrollTop - gb;
      if ((tb >= 0 && tb <= window.visibleRange) || (scrollTop >= node.offsetTop && scrollTop <= gb)) {
        return visible[i] = 1;
      }
    });
    for (let i = 0, len = groups.length; i < len; i++) {
      if (visible[i]) {
        groups[i].classList.remove('hide-children');
      } else {
        groups[i].classList.add('hide-children');
      }
    }
  }, 40), {passive: true});
}

window.customElements.define(ChromeAndroidScrollingSaviour.is, ChromeAndroidScrollingSaviour);
