/* I have no idea why scrolling performance on Chrome Android is so terrible. */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { microTask } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
/**
 * @customElement
 * @polymer
 */
export default class RecyclerView extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        /* overflow: hidden; */
      }
      #offscreen {
        width: 100%;
        height: 0;
        position: relative;
        overflow: hidden;
        contain: paint;
      }
      #offscreen > *,
      #container > * {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
      #container {
        position: relative;
        width: 100%;
      }
    </style>
    <div id="offscreen"></div>
    <div id="container"></div>
`;
  }

  static get is() { return 'recycler-view'; }
  static get properties() {
    return {
      items: {
        type: Array,
        value: [],
        observer: '_itemsChange'
      },
      tag: {
        type: String,
        value: ''
      },
      selfScrollable: {
        type: Boolean,
        value: false
      },
      reuseItemsSize: {
        type: Number,
        value: 35
      },
      safeAreaOffset: {
        type: Number,
        value: document.documentElement.clientHeight
      },
      renderBufferRange: {
        type: Number,
        value: document.documentElement.clientHeight * .5
      },
      targetProperty: {
        type: String
      },
      classNames: {
        type: String
      }
    };
  }

  // static get observers() {
  //   return ['_itemsChange(items.splices)'];
  // }

  disable() {
    this._disabled = true;
  }
  enable() {
    if (!this._disabled) return;
    this._disabled = false;
    setTimeout(() => {
      this._scrollingElement.scrollTop === 0 && this._moveSafeArea();
    }, 140);
  }

  async _itemsChange(newValue, oldValue) {
    console.log(newValue, oldValue);
    if (!oldValue || oldValue.length === 0) {
      this._listSize.height = 0;
      this._performDetach();
    }
    await this._calculateSize();
    this._moveSafeArea();

    // TODO: handle array mutations. Detach deleted items and attach added items.
  }
  _createElementFromItem(item) {
    let tag;
    if (this.tagName) {
      tag = document.createElement(this.tag);
    }
    
    if (!tag && !this.children[0]) throw new Error('RecyclerView must have an tag-name attribute');
    else if (!tag) tag = this.children[0].cloneNode(true);

    this._applyModelToInstance(item, tag);

    return tag;
  }
  // Create and assign an instance to item.
  _createInstance(item, itemIndex) {
    if (item.__itemInstance) throw new Error('An instance was already associated to this item.');

    let ins = this._createElementFromItem(item);
    let i = this._instances.push(ins) - 1;
    this._instance2index.set(ins, itemIndex);
    item.__itemInstance = ins;

    return ins;
  }
  _applyModelToInstance(item, tag) {
    if (this.classNames) {
      tag.className = this.classNames;
    }
    if (this.targetProperty) {
      tag._setPendingProperty && tag._setPendingProperty(this.targetProperty, item) ||
        (tag[this.targetProperty] = item);
      tag._invalidateProperties && tag._invalidateProperties();
      return tag;
    }

    for (let key in item) {
      tag._setPendingProperty && tag._setPendingProperty(key, item[key]) ||
        (tag[key] = item[key]);
    }
    tag._invalidateProperties && tag._invalidateProperties();
    return tag;
  }
  // Calculate items' size and update _listSize.
  // TODO: handle array mutations. Calculate array difference then detach 
  // deleted items and attach added items.
  async _calculateSize(innerRender) {
    let heightCount = 0;
    let batched = [];
    let batchedIndex = [];
    this.items.forEach((val, i) => {
      if (val.__itemRect) return heightCount += val.__itemRect.height;

      batched.push(this.getItemRect(val));
      batchedIndex.push(i);
    });

    let result = await Promise.all(batched);

    result.forEach((val, i) => {
      if (val.height === 0) return;
      this.items[batchedIndex[i]].__itemRect = Object.assign({}, val, {
        top: heightCount, bottom: heightCount += val.height
      });
      //this.items[batchedIndex[i]].__itemRect = {...val, top: heightCount, bottom: heightCount += val.height};
    });

    let doRender = false;
    let direction = heightCount > this._listSize.height;
    if (this._listSize.height !== heightCount) doRender = true;
    this._listSize.height = heightCount;
    // apply height to the container
    this.$.container.style.height = this._listSize.height + 'px';
    doRender && !innerRender && this._debounceRender(direction);
  }
  // Assign an instance (dom element) to item. Will reuse instance if possible.
  _assignInstance(item, index, direction/* fromTop=1, fromBottom=0 */, start = 0, end = this.items.length) {
    if (direction && end === 0) end = this.items.length;

    let getItemInstance = (i) => {
      let ins = this.items[i].__itemInstance;
      if (!this._instance2index.delete(ins)) {
        throw new Error('Assert true');
      }
      this.items[i].__itemInstance = void 0;
      this._applyModelToInstance(item, ins);
      item.__itemInstance = ins;
      this._instance2index.set(ins, index);
      return ins;
    };

    if (this._instances.length >= this.reuseItemsSize || this._instances.length > this.items.length) {
      let ins = this._detachedPool.shift();

      if (ins) {
        this._applyModelToInstance(item, ins);
        item.__itemInstance = ins;
        this._instance2index.set(ins, index);
        return ins;
      }

      // if detachedPool is empty, we try to get instance from offscreen
      if (direction) {
        // from top
        for (let i = start; i < this.items.length; i++) {
          if (this.items[i].__itemInstance && !this.onScreen[i]) {
            let ins = getItemInstance(i);
            return ins;
          }
        }
        for (let i = 0; i < end; i++) {
          if (this.items[i].__itemInstance && !this.onScreen[i]) {
            let ins = this.items[i].__itemInstance;
            if (!this._instance2index.delete(ins)) {
              throw new Error('Assert true');
            }
            this.items[i].__itemInstance = void 0;
            this._applyModelToInstance(item, ins);
            item.__itemInstance = ins;
            this._instance2index.set(ins, index);
            return ins;
          }
        }
      } else {
        // from bottom
        for (let i = start; i >= 0; i--) {
          if (this.items[i].__itemInstance && !this.onScreen[i]) {
            let ins = getItemInstance(i);
            return ins;
          }
        }
        for (let i = this.items.length - 1; i > end; i--) {
          if (this.items[i].__itemInstance) {
            let ins = this.items[i].__itemInstance;
            if (!this._instance2index.delete(ins)) {
              throw new Error('Assert true');
            }
            this.items[i].__itemInstance = void 0;
            this._applyModelToInstance(item, ins);
            item.__itemInstance = ins;
            this._instance2index.set(ins, index);
            return ins;
          }
        }
      }

      // TODO
      let instance;
      // try to release items
      this._performDetach();

      if (instance = this._detachedPool.shift()) {
        this._applyModelToInstance(item, instance);
        item.__itemInstance = instance;
        this._instance2index.set(instance, index);
        return instance;
      }

      throw new Error('No avaliable reuse item.');
    }

    // Did not reach instance limit, create a new one from nowhere.
    return this._createInstance(item, index);
  }
  _performDetach() {
    for (let i = 0, len = this._instances.length; i < len; i++) {
      let ins = this._instances[i];
      let itemIndex = this._instance2index.get(ins);
      if (this.items[itemIndex] && this.items[itemIndex].__itemInstance === ins) {
        continue;
      }
      if (ins && this._detachedPool.indexOf(ins) === -1) {
        microTask.run(() => {
          this._attached.delete(ins) && ins.remove();
        });
        this._detachedPool.push(ins);
        continue;
      }
    }
  }
  _attachInstances(insts) {
    microTask.run(() => {
      insts.forEach((inst) => {
        if (this._attached.has(inst)) return;

        this._attached.set(inst, true);
        this.$.container.appendChild(inst);
      });
    });
  }
  _debounceRender(direction) {
    this.__renderDebouncer = Debouncer.debounce(
      this.__renderDebouncer
      , microTask
      , () => {
        this._render(direction);
      });
    // Polymer.enqueueDebouncer(this.__renderDebouncer);
  }
  // Try to move safe area.
  _moveSafeArea() {
    // safe area height
    const sah = 2 * this.safeAreaOffset + this._vh;
    // safe area bottom
    const sab = this._safeAreaTop + sah;
    const scrollingElement = this._scrollingElement;
    const vt = scrollingElement.scrollTop;
    const vb = vt + this._vh;

    let moved = false;
    let newTop;
    let diff = Math.abs(this._safeAreaTop - vt + (sah - this._vh) / 2);
    if (vt <= this._safeAreaTop) {
      newTop = Math.max(this._safeAreaTop - diff, 0);
      if (newTop === this._safeAreaTop) return false;
      moved = true;
    }

    if (vb >= sab) {
      newTop = Math.min(this._safeAreaTop + diff, this._listSize.height - sah);
      if (newTop === this._safeAreaTop) return false;
      moved = true;
    }

    if (!moved) return false;
    console.log('safe area moved');

    let direction = newTop > this._safeAreaTop;
    this._safeAreaTop = newTop;
    // this._render(direction);
    this._debounceRender(direction);
    return true;
  }
  get _vh() {
    if (!this.__vh) {
      this.__vh = this.selfScrollable ? this.$.container.offsetHeight :
        document.documentElement.clientHeight;
    }
    return this.__vh;
  }
  connectedCallback() {
    this._scrollingElement = this.selfScrollable ? this.$.container : document.scrollingElement;
    super.connectedCallback();
  }
  // Calculate which items should be rendered and render them on screen.
  async _render(direction) {
    console.log('render called');
    if (!this.items || !this.items[0]) return;
    if (!this.items[this.items.length - 1].__itemRect) {
      await this._calculateSize(true);
    }
    const scrollingElement = this._scrollingElement;
    // viewport height
    const vh = this._vh;
    // viewport top
    const vt = scrollingElement.scrollTop;
    // viewport bottom
    const vb = vt + vh;

    let onScreen = new Array(this.items.length);

    let heightCount = 0;
    let startIndex = -1;
    let endIndex = -1;
    
    // Find which items should be displayed on the screen and assign instances
    // for them if needed.
    this.items.forEach((val, i) => {
      val = val.__itemRect;
      let svt = this._safeAreaTop - this.renderBufferRange;
      let svb = this._safeAreaTop + 2 * this.safeAreaOffset + this._vh + this.renderBufferRange;
      if (!(heightCount + val.height < svt ||
        heightCount > svb)) {
        if (startIndex === -1) {
          startIndex = i;
        }
        onScreen[i] = true;
      } else if (endIndex === -1 && startIndex !== -1) {
        endIndex = Math.max(i - 1, 0);
      }

      heightCount += val.height;
    });
    this.onScreen = onScreen;
    if (endIndex === -1) {
      endIndex = this.items.length - 1;
    }

    let mutated = [];

    if (startIndex === -1) return;
    for (let i = startIndex; i <= endIndex; i++) {
      // Already in use (No need to assign instance because it already has one).
      if (this.items[i].__itemInstance) continue;

      let ins = this._assignInstance(this.items[i], i, direction,
        direction ? endIndex + 1 : startIndex - 1, direction ? startIndex : endIndex);
      mutated.push(ins);
      // Place the instance at the right place.
      this._applyPosition(ins);
    }
    // Need to queue operation?
    this._attachInstances(mutated);
  }
  _applyPosition(ins) {
    let item = this.items[this._instance2index.get(ins)];
    if (!item) debugger;
    if (item.__itemInstance !== ins) {
      throw new Error('Assert equal');
    }
    microTask.run(() => {
      ins.style.transform = 'translate3d(0, ' + item.__itemRect.top + 'px, 0)';
      // ins.style.top = item.__itemRect.top + 'px';
    });
  }
  // Override this method to customize a more effective measurement method.
  // The default method renders the item to get its size (may cost a bunch of times).
  getItemRect(item) {
    return new Promise((resolve, reject) => {
      // Batch renders
      let ele = this._createElementFromItem(item);
      this.$.offscreen.appendChild(ele);
      // Batch size reading because it triggers a force reflow
      microTask.run(() => {
        // Wait for template to stamp
        microTask.run(() => {
          let rect = ele.getBoundingClientRect();
          let size = {
            height: rect.height,
            width: rect.width
          };
          rect = null;
          resolve(size);
          // Batch removing.
          // Since this is a non-critical work we defer it after next render
          // to avoid possible force reflow.
          afterNextRender(this, () => {
            ele.remove();
          });
        });
      });
    });
  }
  constructor() {
    super();

    this._instance2index = new WeakMap();
    this._instances = [];
    this._listSize = {
      height: 0,
      width: 0
    };
    this._safeAreaTop = 0;
    this._attached = new WeakMap();
    this.__renderDebouncer = null;
    this._detachedPool = [];
    this._disabled = true;
    
    window.addEventListener('scroll', window.BVUtils.throttle((ev) => {
      if (ev && ev.detail) this._scrollingElement = ev.detail;
      if (this._disabled) return;
      this._moveSafeArea();
    }, 13), {passive: true});
  }
}
window.customElements.define(RecyclerView.is, RecyclerView);
