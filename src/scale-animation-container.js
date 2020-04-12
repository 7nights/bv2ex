import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
const scope = {};
(function (global) {
  /**
   * https://github.com/gre/bezier-easing
   * BezierEasing - use bezier curve for transition easing function
   * by Gaëtan Renaudeau 2014 - 2015 – MIT License
   */

  // These values are established by empiricism with tests (tradeoff: performance VS precision)
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C (aA1)      { return 3.0 * aA1; }

  // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

  // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
   for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
     var currentSlope = getSlope(aGuessT, mX1, mX2);
     if (currentSlope === 0.0) {
       return aGuessT;
     }
     var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
     aGuessT -= currentX / currentSlope;
   }
   return aGuessT;
  }

  global.BezierEasing = function bezier (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    if (mX1 !== mY1 || mX2 !== mY2) {
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      if (mX1 === mY1 && mX2 === mY2) {
        return x; // linear
      }
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0) {
        return 0;
      }
      if (x === 1) {
        return 1;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };
})(scope);

function getScaleAnimation(startScale, cubicBezier, steps = 100, inverse = false, node = document.head, mode, id) {
  let outerAnimation = [];
  let innerAnimation = [];
  let easing = scope.BezierEasing.apply(null, cubicBezier);

  for (let i = 0; i <= steps; i++) {
    let p = 100 / steps * i;
    generateAnimation({
      start: inverse ? 1 : startScale,
      end: inverse ? startScale : 1,
      step: parseInt(p, 10),
      p: easing(p / 100),
      outerAnimation,
      innerAnimation,
      mode
    });
  }

  outerAnimation = outerAnimation.join('\n');
  innerAnimation = innerAnimation.join('\n');

  return {
    outerAnimation,
    innerAnimation,
    activateAnimation(name, invName = name + '-inverse') {
      let style = document.createElement('style');
      id && style.setAttribute('id', id + '_' + (inverse ? 'inverse' : 'normal'));
      style.textContent = `@keyframes ${name} {${outerAnimation}} \n @keyframes ${invName} {${innerAnimation}}`;
      node.appendChild(style);

      return {
        inverse(name, invName = name + '-inverse') {
          getScaleAnimation(startScale, cubicBezier, steps, !inverse, node, mode, id).activateAnimation(name, invName);
        }
      };
    }
  };
}

function generateAnimation({start, end, step, p, outerAnimation, innerAnimation, mode = ''}) {
  let scale = start + (end - start) * p;
  let invScale = 1 / scale;
  outerAnimation.push(`${step}% {transform: scale${mode}(${scale});}`);
  innerAnimation.push(`${step}% {transform: scale${mode}(${invScale});}`);
}

class ScaleAnimationContainer extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        --sac-animation-duration: .5s;
        --sac-transform-origin: 0 0;
        --sac-height: auto;
        --sac-width: auto;

        height: var(--sac-height);
        width: var(--sac-width);
        display: block;
        animation-fill-mode: both;
        overflow: hidden;
        animation-timing-function: linear;
        animation-duration: var(--sac-animation-duration);
        transform-origin: var(--sac-transform-origin);
      }
      .inner {
        height: var(--sac-height);
        width: var(--sac-width);
        animation-fill-mode: both;
        overflow: hidden;
        animation-timing-function: linear;
        animation-duration: var(--sac-animation-duration);
        transform-origin: var(--sac-transform-origin);
        @apply --sac-inner-style;
        display: flex;
        flex-direction: column;
      }
      :host(.sac-collapsed) {
        animation-name: outerScaleClose;
      }
      :host(.sac-expanded) {
        animation-name: outerScale;
      }
      :host(.sac-collapsed) .inner {
        animation-name: innerScaleClose;
      }
      :host(.sac-expanded) .inner {
        animation-name: innerScale;
      }
    </style>
    <div class="inner">
      <slot></slot>
    </div>
`;
  }

  static get is() { return 'scale-animation-container'; }
  static get properties() {
    return {
      initialScale: {
        type: Number,
        value: .1
      },
      cubicBezier: {
        type: Array,
        value: [.25,.1,.25,1]
      },
      inverse: {
        type: Boolean,
        value: false
      },
      steps: {
        type: Number,
        value: 100
      },
      mode: {
        type: String,
        value: ''
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.shadowRoot.querySelector('animation-style')) {
      this.updateStyles();
      const style = document.createElement('style');
      style.textContent = `:host {transform: scale${this.mode}(${this.initialScale}); } .inner {transform: scale${this.mode}(${1 / this.initialScale});}`;
      style.setAttribute('id', 'animation-style');
      this.shadowRoot.appendChild(style);
    }
  }

  updateStyles() {
    let style = this.shadowRoot.querySelector('#animation_normal');
    if (style) {
      style.remove();
      this.shadowRoot.querySelector('#animation_inverse').remove();
    }
    const animation = getScaleAnimation(this.initialScale, this.cubicBezier, this.steps, this.inverse, this.shadowRoot, this.mode, 'animation');
    animation
      .activateAnimation('outerScale', 'innerScale')
      .inverse('outerScaleClose', 'innerScaleClose');
  }

  toggle() {
    if (this.classList.contains('sac-expanded')) {
      this.collapse();
    } else {
      this.expand();
    }
  }
  expand() {
    this.classList.remove('sac-collapsed');
    this.classList.add('sac-expanded');
  }
  collapse() {
    this.classList.remove('sac-expanded');
    this.classList.add('sac-collapsed');
  }
}
window.customElements.define(ScaleAnimationContainer.is, ScaleAnimationContainer);
