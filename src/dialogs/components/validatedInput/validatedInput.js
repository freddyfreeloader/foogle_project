import {LitElement, html, css} from 'lit';
import {validatedInputStyles} from './validatedInput.styles';

/**
 * Creates an input element
 *
 * Features:
 *
 * - scales up colored underline by selection/focus, depends on click location
 * - shows validation message when showValidationMessage() is called
 * - preselect input value if not empty
 *
 * @customElement my-validated-input
 * @cssprop {background-color} --validated-input-underline-color-default rgba(0, 0, 0, 0.12)
 * @cssprop {background-color} --validated-input-underline-color-select '#4285f4'
 * @cssprop {color} --validated-input-text-color-error '#d50000'
 * @cssprop {background-color} --validated-input-underline-color-error '#d50000'
 * @cssprop {animation-duration} --validated-input-animation-duration-grow 500ms
 * @cssprop {animation-duration} --validated-input-animation-duration-blur 300ms
 *
 */
export class ValidatedInput extends LitElement {
  static styles = [validatedInputStyles, css``];

  static properties = {
    inputValue: {},
    validationText: {},
  };

  constructor() {
    super();
    this.validationText = 'default validation message';
    this.inputValue = '';
  }

  firstUpdated() {
    if (this.inputValue) {
      this._input.select();
    }
  }

  render() {
    return html`
      <div class="box box--inline">
        <div class="content">
          <div class="content-flex">
            <div class="input-container">
              <input
                id="input"
                class="input-element"
                type="text"
                tabindex="0"
                value="${this.inputValue}"
                @mousedown="${this._addBlueLine}"
                @focus="${this._addBlueLine}"
                @focusout="${this._removeBlueLine}"
                autocomplete="off"
              />
            </div>
            <div class="underline"></div>
            <div class="underline underline--blue"></div>
          </div>
        </div>
        <div class="validation-container">
          <div class="validation-text"></div>
        </div>
      </div>
    `;
  }

  //** API **//

  /**
   * Returns the value of the input element
   * @returns {String} the value of input element
   */
  getValue() {
    return this._input.value;
  }
  /**
   * Returns the input element
   * @returns {HtmlElement} the input element
   */
  getInputElement() {
    return this._input;
  }

  /**
   * Colors the underline and displays the validation message.
   */
  showValidationMessage = () => {
    const validationBox = this._inputValidation;
    if (validationBox.innerText === '') {
      validationBox.append(this.validationText);
      this._underline.classList.add('red-line');
    }
  };

  /**
   * Removes validation message and blur error underline.
   */
  removeValidationMessage = () => {
    this._inputValidation.innerText = '';
    this._underline.classList.remove('red-line');
  };
  //** API **//

  get _input() {
    return this.renderRoot.querySelector('.input-element');
  }

  get _underline() {
    return this.renderRoot.querySelector('.underline--blue');
  }

  get _inputValidation() {
    return this.renderRoot.querySelector('.validation-text');
  }

  _addBlueLine(event) {
    event.stopPropagation();
    const blueLine = this._underline;
    if (event.type === 'mousedown') {
      blueLine.style.transformOrigin = '' + event.offsetX + 'px center';
    }
    blueLine.classList.add('grow-and-show');
  }

  _removeBlueLine(event) {
    event.stopPropagation();
    const blueLine = this._underline;
    blueLine.classList.remove('grow-and-show');
    blueLine.style.transformOrigin = null;
  }
}

customElements.define('my-validated-input', ValidatedInput);
