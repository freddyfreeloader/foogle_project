import {LitElement, html, css} from 'lit';
import {DialogBaseMixin} from '../components/mixins/dialogBaseMixin/dialogBaseMixin';
import {FocusManagerMixin} from '../components/mixins/focusManagerMixin/focusManagerMixin';
import {dispatchBubbelingCustomEvent} from '../../utils/eventHelpers/dispatchCustomEvent';
import '../components/radioButtonController/radioButtonController';

/**
 * Creates a modal dialog with options as radio buttons to select.
 *
 * Extends {@link DialogBaseMixin} and {@link FocusManagerMixin}.
 *
 * Autofocus the first or preselected radio button.
 *
 * @customElement my-radio-button-dialog
 * @fires radioDialogClosedWithApply
 * @fires radioDialogClosedWithCancel
 * @fires radioDialogClosed
 **/
export class RadioButtonDialog extends DialogBaseMixin(
  FocusManagerMixin(LitElement)
) {
  static styles = [
    DialogBaseMixin.styles || [],
    css`
      /*MOfPbb*/

      /*LeSEHf*/
      .radio-manager {
        padding: 20px 6px 15px;
      }
    `,
  ];
  static properties = {
    /**
     * Array of options to be displayed in the dialog.
     *
     * Options objects have to provide properties "id" and "name"
     * e.g.:
     *     {id: "myFirstOptionId", name: "theLabelToShowNextToTheButton"}
     *
     */
    options: {state: true},
    /**
     * The id of the provided options that should be preselect at start.
     */
    preselected: {},
  };

  constructor() {
    super();
    this.options = [];
    this.preselected = null;
  }

  get _selectedOption() {
    const manager = this.renderRoot.querySelector('my-radio-button-controller');
    return manager.selectedOption();
  }

  content = () => html` <div slot="content">
    <div class="radio-manager-wrapper">
      ${this.messageText}
      <my-radio-button-controller
        class="radio-manager"
        role="radiogroup"
        .options="${this.options}"
        .selectedRadio=${this.preselected}
      ></my-radio-button-controller>
    </div>
  </div>`;

  render() {
    return this.renderDialog();
  }

  async firstUpdated(...args) {
    super.firstUpdated(...args);
    this.handleFocus(null, true);
  }

  async apply(event) {
    if (event.currentTarget === this._applyButton) {
      const option = this._selectedOption;
      dispatchBubbelingCustomEvent('radioDialogClosedWithApply', {
        option: option,
      });
    }
    dispatchBubbelingCustomEvent('radioDialogClosed');

    super.apply(event);
  }
}
customElements.define('my-radio-button-dialog', RadioButtonDialog);
