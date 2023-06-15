import {LitElement, html, css} from 'lit';
import {dialogButtonStyles} from './dialogButton.styles';

/**
 * Button for dialogs
 * 
 * Google's styling for dialog buttons.
 *
 * @customElement my-dialog-button
 * @prop {String} labelText
 * @attr {String} labelText
 * @prop {Function} getButton returns the focusable button-like element
 * @cssprop {Transition} --dialog-button-hover-in-out-transition opacity 15ms linear, background-color 15ms linear
 * @cssprop {Transition} --dialog-button-click-release-transition opacity 150ms linear
 * @cssprop {TransitionDuration} --dialog-button-click-and-focus-in-transition-duration 75ms
 * @csspart button styles for main button
 * @csspart highlight styles for pseudo states
 * @csspart text styles for button text
 */
export class DialogButton extends LitElement {
  static properties = {
    /** The text to display on the button. */
    labelText: {reflect: true},
  };

  static styles = [dialogButtonStyles, css``];

  render() {
    return html`
      <div
        class="button"
        part="button"
        tabindex="0"
        @mousedown="${(e) => e.preventDefault()}"
        @keydown="${this._handleEnter}"
      >
        <div class="highlight" part="highlight"></div>
        <div class="focused"></div>
        <span class="text" part="text">${this.labelText}</span>
      </div>
    `;
  }

  get _button() {
    return this.renderRoot.querySelector('.button');
  }

  /** Returns the main button element. */
  getButton() {
    return this._button;
  }

  /** Converts keyboard "Enter" event to click() on button.  */
  _handleEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this._button.click();
    }
  }
}

customElements.define('my-dialog-button', DialogButton);
