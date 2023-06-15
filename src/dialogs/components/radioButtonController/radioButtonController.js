import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';
import {RadioButtonLabel} from '../radioButtonLabel/radioButtonLabel.js';
import {getNextItem} from '../../../utils/keyboardFunctions/getNextItem.js';

const item = 'my-radio-button-label';

/**
 * Controller for switching radio buttons labels.
 * Receives an option array object with props:
 *
 * - id: to identify the option
 * - text: the text to display near the radio button
 *
 * Automatically selects the first radio button or @prop selectedRadio
 * Handles keyboard events to switch buttons
 * @customElement my-radio-button-controller
 * @property options
 * @props options
 * @props selectedRadio
 */
export class RadioButtonController extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      :host {
        padding-top: 20px;
        padding-bottom: 15px;
      }
    `,
  ];

  static properties = {
    /** The selected radio button */
    selectedRadio: {state: true},
    /**  The selectable options */
    options: {state: true},
  };

  constructor() {
    super();
    this.options = [];
    this.selectedRadio = null;
  }

  get _radios() {
    return this.renderRoot?.querySelectorAll(item);
  }

  get _selectedRadio() {
    return this.renderRoot?.querySelector(item + '[checked]');
  }

  /**
   * Returns the option.id of the selected radio button.
   * @returns {string}
   */
  selectedOption() {
    return this._selectedRadio?.id;
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this._selectFirstRadio();
    this.addEventListener('keydown', this._handleKeyDown);
    this.renderRoot.addEventListener('click', this._handleClick);
  }

  _selectFirstRadio = () => {
    if (!this.options?.length) {
      return;
    }
    let radio = this.renderRoot.querySelector(item);
    if (this.selectedRadio) {
      const preselectedRadio = [...this.renderRoot.querySelectorAll(item)].find(
        (r) => r.id === this.selectedRadio
      );
      if (!preselectedRadio) {
        console.error(
          'RadioButtonDialog wants to preselect an option, but option cannot be found! You must provide a valid id of the option array, e.g.option[2].id for preselected property.'
        );
      } else {
        radio = preselectedRadio;
      }
    }
    radio.checked = true;
    radio.pulse = false;
  };

  render() {
    return html`
      <div role="presentation" class="oJeWuf">
        ${map(
          this.options,
          (option, index) => html` <my-radio-button-label
            .text="${option.text}"
            .id="${option.id}"
            .size="${this.options.length}"
            .index="${index}"
          >
          </my-radio-button-label>`
        )}
      </div>
    `;
  }

  _handleKeyDown(event) {
    const nextRadio = getNextItem(event, this._radios, this._selectedRadio);
    if (!nextRadio) {
      return;
    }

    event.preventDefault();

    this._switchRadio(nextRadio);
    nextRadio.focus();
  }

  _handleClick = (event) => {
    if (event.button === 0 && event.target instanceof RadioButtonLabel) {
      this._switchRadio(event.target);
    }
  };

  _switchRadio = (radio) => {
    this._removeSelectionClass();
    this._addSelectionClass(radio);
  };

  _removeSelectionClass = () => {
    this._radios.forEach((radio) => {
      radio.checked = false;
    });
  };

  _addSelectionClass = (radio) => {
    radio.checked = true;
    this.selectedRadio = radio.id;
  };
}

customElements.define(
  'my-radio-button-controller',
  RadioButtonController
);
