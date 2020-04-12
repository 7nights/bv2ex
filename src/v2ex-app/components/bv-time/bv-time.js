import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '../../font-icons.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bv-time">
  <template strip-whitespace="">
    <style include="font-icons">
      :host {
        display: inline;
        white-space: nowrap;
      }
      #via {
        margin-left: 2px;
      }
    </style>
    [[getDisplayTime(time)]]
    <span id="via"></span>
  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer.content);
/**
 * @customElement
 * @polymer
 */
class BVTime extends PolymerElement {
  static get is() { return 'bv-time'; }
  static get properties() {
    return {
      time: {
        type: String
      }
    };
  }
  // todo
  getDisplayTime() {
    if (!this.time) return '';
    let via = '';
    let t = this.time
      .replace(/via Android/, () => {
        via = '<i class="fa fa-android"></i>';
        return '';
      })
      .replace(/via iPhone/, () => {
        via = '<i class="fa fa-apple"></i>';
        return '';
      })
      .replace(/via iPad/, () => {
        via = '<i class="fa fa-tablet"></i>';
        return '';
      });
    if (via) {
      this.$.via.innerHTML = via;
    }
    if (~t.indexOf('刚刚')) return 'Just now';

    let times = t.match(/[0-9]* (小时|分钟|天)/g);
    if (times) times = times.filter((val) => val !== '');
    else return t;

    let s = '';
    times.forEach((val) => {
      let numerical = val.match(/[0-9]*/);
      let plural;
      if (numerical) numerical = numerical[0];
      else return;

      if (numerical !== 1) {
        plural = 's';
      } else {
        plural = '';
      }
      if (s.length > 0 && s[s.length - 1] !== ' ') s += ' ';
      if (~val.indexOf('天')) return s += numerical + 'd';
      else if (~val.indexOf('分钟')) return s += numerical + 'min';
      else if (~val.indexOf('小时')) return s += numerical + 'h';
      else return t;
    });

    return s;
  }

  handleNumerical(t, numerical) {
    let plural;
    if (numerical !== 1) {
      plural = 's';
    } else {
      plural = '';
    }
    if (~t.indexOf('天')) return numerical + ' day' + plural;
    else if (~t.indexOf('分钟')) return numerical + ' minute' + plural;
    else if (~t.indexOf('小时')) return numerical + ' hour' + plural;
    else return t;
  }
}

window.customElements.define(BVTime.is, BVTime);
