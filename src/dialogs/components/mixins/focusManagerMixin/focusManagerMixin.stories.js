import {html, css, LitElement} from 'lit';
import {FocusManagerMixin} from './focusManagerMixin';

/**
 * Manages keyboard focus handling for WebComponents.
 *
 * Component must provide "focus borders" with class "js-focus-border" and tabindex=0, so FocusManagerMixin can detect focusable elements between the borders and can trap the focus.
 *
 *
 * By default, FocusManager
 * - sets focus to the first focus border, so keyboard "Tab" events will be detected by the eventListener of the element, then
 * - listen to the first "Tab" event, then
 * - does a deep search with awaiting all updates of nested components, then
 * - collect all focusable elements, then
 * - sets the focus on the first focusable element after the first focus border
 *
 * The next "Tab" events will be handled by the browser focus management, usually following the HTML structure.
 *
 * If focus is on the last focusable element and "Tab" is pressed, FocusManger starts searching for the first focusable element again and focus this element.
 *
 * Shift-Tab works same way reverse.
 *
 * Optional parameters:
 *
 * - firstToFocus: The element that should receive the focus firstly, default to the first focusable element
 * - autoFocus: Immediately focus the first element without waiting for the first "Tab" event, default false
 *
 * Usage:
 *
 *     class MyWebElement extends FocusManagerMixin(LitElement) {
 *
 *     // .. //
 *
 *       firstUpdated() {
 *        //optional settings
 *         handleFocus(?firstElementThatShouldBeFocused, shouldImmediatelyFocusTheFirstElement = false)
 *       }
 *
 *       render() {return html`
 *         <div class="js-focus-border" tabindex=0></div>
 *           <focusableElement></focusableElement>
 *           <focusableElement></focusableElement>
 *         <div class="js-focus-border" tabindex=0></div>
 *         <notFocused></notFocused>
 *        `};
 *     }
 *
 * **Accessibility concerns**
 *
 * The focus will be trapped between the provided borders, so user can't (without mouse) escape, so you must provide an "exit strategy", e.g. a close button.
 *
 *
 * @customElement my-focus-implementation
 * @attr focusSecondElement
 * @attr shouldAutofocus
 * @attr disableButtons
 *
 */
class FocusManagerExample extends FocusManagerMixin(LitElement) {
  static styles = [
    css`
      :host {
        display: block;
        margin: 20px;
        border: 2px dashed green;
      }

      .inside-border {
        margin: 20px;
        border: 2px dashed blue;
      }

      .focusable {
        border: 1px solid black;
        width: 90px;
      }

      .focusable:focus {
        outline: red 2px solid;
      }

      .toggle-button {
        display: inline;
        cursor: pointer;
      }

      .toggle-button::before {
        content: '\u2190';
      }
      .focusable,
      input,
      button,
      a {
        margin: 5px;
        padding: 2px 5px;
      }

      .js-focus-border {
        margin: 2px 0px;
        width: 100%;
        height: 2px;
        background-color: blue;
      }

      .js-focus-border:focus {
        outline: 2px solid red;
      }

      a {
        display: block;
      }
    `,
  ];

  static properties = {
    shouldAutofocus: {type: Boolean, reflect: true},
    focusSecondElement: {type: Boolean, reflect: true},
    disableButtons: {type: Boolean, reflect: true},
  };

  constructor() {
    super();
    this.shouldAutofocus = false;
    this.focusSecondElement = false;
    this.disableButtons = false;
  }

  firstUpdated() {
    let firstElementToFocus = null;
    if (this.focusSecondElement) {
      firstElementToFocus = this.renderRoot.querySelector('.second-element');
    }
    this.handleFocus(firstElementToFocus, this.shouldAutofocus);
  }

  _toggler = () => html`<button
    class="toggle-button"
    tabindex="-1"
    type="button"
    @mousedown=${(e) => e.preventDefault()}
    @click=${this._toggleDisable}
  >
    ${this.disableButtons ? 'enable' : 'disable'}
  </button>`;

  _togglingButton = () => html`<button
      class="focusable"
      type="button"
      ?disabled=${this.disableButtons}
    >
      Button
    </button>
    ${this._toggler()}`;

  _togglingInput = () => html`<input
      class="focusable"
      type="text"
      value="input value"
      ?disabled=${this.disableButtons}
    />
    ${this._toggler()}`;

  _outsideButton = () =>
    html`<button type="button">
      inside component, but outside focus border
    </button>`;

  _focusBorder = () => html`<div class="js-focus-border" tabindex="0"></div>`;

  render() {
    return html` <div>
      ${this._outsideButton()} ${this._focusBorder()}
      <div class="inside-border">
        ${this._togglingButton()}
        <div class="focusable first-element" tabindex="0">First</div>
        ${this._togglingButton()}
        <div class="focusable second-element" tabindex="0">Second</div>
        ${this._togglingInput()}
        <a href="" @click=${(e) => e.preventDefault()}>My Link</a>
        <div class="focusable third-element" tabindex="0">Third</div>
        ${this._togglingButton()}
      </div>
      ${this._focusBorder()} ${this._outsideButton()}
    </div>`;
  }

  _toggleDisable = (e) => {
    e.preventDefault;
    e.stopPropagation;
    function toggleDisableState() {
      const elementToDisable = e.target.previousElementSibling;
      elementToDisable.disabled = !elementToDisable.disabled;
    }
    function toggleButtonText() {
      e.target.innerText =
        e.target.innerText.trim() === 'enable' ? ' disable' : ' enable';
    }
    toggleDisableState();
    toggleButtonText();
  };
}
window.customElements.define('my-focus-implementation', FocusManagerExample);

export default {
  component: 'my-focus-implementation',
  tags: ['autodocs'],
  render: (args) =>
    html`<my-focus-implementation
      ?shouldautofocus="${args.autofocus}"
      ?focussecondelement=${args.focusSecond}
      ?disableButtons=${args.disableButtons}
    ></my-focus-implementation>`,

  decorators: [
    (Story) => html`
      <style>
        .container {
          border: 2px red dashed;
          width: 400px;
        }
        button {
          margin: 5px;
        }
      </style>
      <div class="container">
        <button type="button">outside of component</button>
        ${Story()}
        <button type="button">outside of component</button>
      </div>
    `,
  ],
  parameters: {
    controls: {
      exclude: /.*_.*/,
    }
  }
};

export const Default = {};

export const AutoFocus = {
  args: {
    autofocus: true,
  },
};

export const FocusSecondElement = {
  args: {
    focusSecond: true,
  },
};

export const AutoFocusSecondElement = {
  args: {
    focusSecond: true,
    autofocus: true,
  },
};

export const DisabledButtons = {
  args: {
    disableButtons: true,
  },
};
