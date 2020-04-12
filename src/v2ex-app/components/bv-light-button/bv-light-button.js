import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 */
class LightButton extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        @apply --light-bg-button;
        height: 2.5rem;
        min-width: 46px;
        padding: 0 1rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        border-radius: 2.5rem;
        line-height: 2.5rem;
        font-family: "Noto Sans";
      }
      :host-context(.theme-dark) {
        background-color: var(--surface-3dp);
      }
      :host(.highlight) {
        background-color: var(--blue);
        color: #ffffff;
      }
      :host(.unread)::before {
        content: '';
        padding: 3px;
        border-radius: 3px;
        background-color: var(--blue);
        margin-right: 4px;
      }
      :host(.no-background) {
        color: var(--blue);
        background: transparent;
        border-radius: 2px;
      }
      :host(.no-background.secondary) {
        color: var(--light-text-secondary-color);
        background: transparent;
      }
    </style>
    <slot></slot>
`;
  }

  static get is() { return 'bv-light-button'; }
}

window.customElements.define(LightButton.is, LightButton);
