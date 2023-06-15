import {css, html, LitElement} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import '../selectionIndicator/selectionIndicator.js';
import '../radioButton/radioButton.js';

// TODO Code is hard to understand
// TODO "mouseDown" and "greySelection" are bad property names
// TODO changing "mouseDown" property with javascript timeout is a hacky solution -> use CSS transition instead?

/**
 * The label wrapper around a radio button with text.
 * 
 * - Listens to mouse and focus events.
 * - Changes Tabindex from -1 to 0 if checked.
 * - Uses WebComponents RadioButton and SelectionIndicator.
 * 
 * @webComponent my-radio-button-label
 * @attr checked
 * @props checked
 * @props id
 * @props text
 * @props index
 * @props size
 * @props mousedown
 * @props pulse
 * @props greySelection
 * @property {Function} focus 
 */
export class RadioButtonLabel extends LitElement {
  static styles = [
    css`

    :host {
      display: block;
    }
      /*q9udnd*/

      .label-container {
        display: inline-block;
        padding-top: 5px;
        cursor: pointer;
        user-select: none;
      }

      /*zJKIV*/

      .radio-button-wrapper {
        position: relative;
        z-index: 0;
        vertical-align: middle;

        display: inline-block;
        box-sizing: content-box;
        width: 20px;
        height: 20px;
        
        outline: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
        cursor: pointer;
      }

      /*EvptXb*/

      .radio-button-wrapper-margin {
        margin: 4px 16px 8px 0;
      }

      my-selection-indicator {
        background-color: rgba(62, 80, 180, 0.2);
      }
      .grey-selection my-selection-indicator {
        background-color: rgba(0, 0, 0, 0.2);
      }
    `,
  ];
  static properties = {
    /** The id of option object */
    id: {state: true},
    /** The text to display */
    text: {state: true},
    /** Set aria-checked */
    checked: {type: Boolean, reflect: true},
    /** The size of the option array */
    size: {state: true},
    /** The index of the option Array */
    index: {state: true},
    /** True after mousedown event */
    mouseDown: {state: true},
    /** True if receives focus event */
    pulse: {state: true},
    /** Sets alternative background color of selectionIndicator, if button is already checked */
    greySelection: {state: true},
  };

  constructor() {
    super();
    this.checked = false;
    this.id = 0;
    this.text = '';
    this.size = 0;
    this.index = 0;

    this.mouseDown = false;
    this.pulse = false;
    this.greySelection = false;
  }

  get _button() {
    return this.renderRoot.querySelector('.radio-button-wrapper');
  }

  willUpdate(_changedProperties) {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has('mouseDown')) {
      this.greySelection = this.checked;
    }
    if (_changedProperties.has('pulse')) {
      if (this.pulse) {
        this.greySelection = false;
      } 
    }
  }

  render() {
    const id = this.id;
    const text = this.text;
    const checked = this.checked;
    const size = this.size;
    const index = this.index;
    const classmapWrapper = {
      'radio-button-wrapper': true,
      'radio-button-wrapper-margin': true,
      focused: this.pulse,
      mousedown: this.mouseDown,
      'checked-state': this.checked,
      'grey-selection': this.greySelection,
    };
    const classmapSelectionIndicator = {
      focused: this.pulse,
      mousedown: this.mouseDown,
    };
    return html` <label
      class="label-container"
      id="${id}"
      @mouseleave="${this._handleMouseLeave}"
      @mousedown="${this._handleMouseDown}"
      @mouseup="${this._handleMouseUp}"
      @focusout="${this._handleBlur}"
    >
      <div
        class="${classMap(classmapWrapper)}"
        @focus="${this._handleFocus}"
        tabindex="${checked ? '0' : '-1'}"
        aria-labelledby="${id}"
        role="radio"
        aria-checked="${checked}"
        aria-posinset="${index}"
        aria-setsize="${size}"
      >
        <my-selection-indicator
          class=${classMap(classmapSelectionIndicator)}
        ></my-selection-indicator>
        <my-radio-button ?checked=${this.checked}></my-radio-button>
      </div>
      ${text}
    </label>`;
  }

  /** Convient function to set the focus. */
  focus() {
    this._button.focus();
  }

  _handleFocus() {
    this.pulse = !this.mouseDown;
  }

  _handleBlur = () => {
    this.mouseDown = false;
    this.pulse = false;
  };

  _handleMouseDown(event) {
    if (event.button === 0) {
      this.mouseDown = true;
    }
  }

  _handleMouseUp() {
    setTimeout(() => {
      this.mouseDown = false;
    }, 300);
  }

  _handleMouseLeave() {
    this.mouseDown = false;
  }
}

customElements.define('my-radio-button-label', RadioButtonLabel);
