import {LitElement, html} from 'lit';
import {dispatchBubbelingCustomEvent} from '../../utils/eventHelpers/dispatchCustomEvent.js';
import {DialogBaseMixin} from '../components/mixins/dialogBaseMixin/dialogBaseMixin.js';
import {FocusManagerMixin} from '../components/mixins/focusManagerMixin/focusManagerMixin.js';
import '../components/validatedInput/validatedInput';

/**
 * Creates a modal dialog with input element.
 * 
 * Extends {@link DialogBaseMixin} and {@link FocusManagerMixin}.
 * 
 * 
 * Overwrites Dialog_Base_Mixin.content() with {@link ValidatedInput}.
 * 
 * Autofocus and preselect the input field.
 * 
 * Input value will be trimmed, validated against the validationPredicate and then dispatched with custom event 'inputConfirmed' with event.detail.inputValue = "MyInputValue".
 * 
 * @customElement my-input-dialog
 * @prop {String} validationText 
 * @prop {String} inputValue
 * @prop {Function} validationPredicate
 * @prop {Function} saveCallback
 * @fires 'inputConfirmed' when apply button was clicked and validation successful
 * @fires 'dialogClosed' when dialog is closed
 */
export class InputDialog extends DialogBaseMixin(
  FocusManagerMixin(LitElement)
) {
  static properties = {
    /** The text to display as validation message. */
    validationText: {},
    /** The value of the input field. */
    inputValue: {},
    /** The function to validate the input value when apply button is clicked.
     * 
     * Example implementation:
     * 
     *     validationPredicate = (inputValue) => !!inputValue;
     */
    validationPredicate: {},
    /** 
     * The function to call when validation was successful.
     * 
     * By default dispatches 'inputConfirmed' event with detail.input = value of the input
     */
    saveCallback: {},
  };

  constructor() {
    super();
    this.inputValue = '';
    this.validationText = 'default validation';
    this.validationPredicate = () => {
      return true;
    };
    this.saveCallback = (inputValue) =>
      dispatchBubbelingCustomEvent.call(this, 'inputConfirmed', {
        input: inputValue,
      });
  }

  get _validatedInputComponent() {
    return this.renderRoot.querySelector('.js-validated-input');
  }

  content = () => html` <my-validated-input
    slot="content"
    class="js-validated-input"
    .validationText="${this.validationText}"
    .inputValue="${this.inputValue}"
  ></my-validated-input>`;

  render() {
    return this.renderDialog();
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this.handleFocus(null, true);
  }

  async apply(event) {
    const inputValue = this._validatedInputComponent.getValue();
    const trimmedValue = inputValue.trim();

    if (this.validationPredicate(trimmedValue)) {
      this.saveCallback(trimmedValue);
      super.apply(event);
    } else {
      event.stopPropagation();
      this._validatedInputComponent.showValidationMessage();
    }
  }
}

customElements.define('my-input-dialog', InputDialog);
