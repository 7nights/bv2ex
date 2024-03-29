const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="page-share-style">
  <template>
    <style>
      :host {
        margin-top: var(--bv-toolbar-height);
        animation-name: page-appear;
        animation-fill-mode: both;
        animation-duration: .3s;
        animation-delay: .1s;
        animation-timing-function: ease-out;
        opacity: 0;
        contain: layout;
        transform: translate3d(0, 0, 0);
        position: relative;
        z-index: 1;
        min-height: var(--page-height);
        will-change: transform, opacity;
      }
      :host::before {
        content: '';
        display: block;
        height: 1px;
      }
      @keyframes page-disappear {
        0% {
          transform: translate3d(0, 0, 0);
          opacity: 1;
          content-visibility: auto;
        }
        100% {
          transform: translate3d(0, 50px, 0);
          opacity: 0;
          content-visibility: unset;
        }
      }
      @keyframes page-appear {
        0% {
          transform: translate3d(0, 50px, 0);
          opacity: 0;
          content-visibility: auto;
        }
        /** transform will influence the render of 'fixed' child elements,
         *  so we need to remove transform property at the end of the animation.
         * See: https://www.w3.org/TR/css-transforms-1/#transform-rendering
         */
        100% {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          content-visibility: unset;
        }
      }
      .opx-border {
        transform: scaleY(.5);
        background-color: #e6e6e6;
        height: 1px;
      }
      :host-context(.theme-dark) .opx-border {
        background-color: var(--surface-4dp);
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
