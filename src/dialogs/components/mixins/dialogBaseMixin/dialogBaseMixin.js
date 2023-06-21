import {html, nothing} from 'lit';
import {styles_dialogs} from '../../styles/dialogStyles/styles_dialog';
import {dispatchBubbelingCustomEvent} from '../../../../utils/eventHelpers/dispatchCustomEvent';
import '../../modalBackground/modalBackground';
import '../../dialogButton/dialogButton';
import '../../dialogContainer/dialogContainer';

/**
 * Provides the basic implementation for dialogs.
 *
 * Composes WebComponents:
 * - ModalBackground
 * - DialogContainer
 * - DialogSubmitButton
 *
 * **Focus handling is not implemented, use FocusManagerMixin**
 *
 * Dispatches "dialogClose" event, if dialog is removed;
 *
 * ### HTML
 *
 *     <my-modal-background>
 *       <focus-border></focus-border>
 *       <my-dialog-container>
 *           <slot name=heading></slot>
 *           <slot name=content></slot>
 *           <slot name=footer></slot>
 *       </my-dialog-container>
 *       <focus-border></focus-border>
 *     </my-modal-background>
 *
 * ### Simple implementation example:
 *
 *     class MyDialog extends DialogBaseMixin(LitElement) {
 *       render() {
 *         return this.renderDialog();
 *       }
 *     }
 *     window.customElements.define('my-dialog', MyDialog);
 *
 * ### Properties to overwrite and their default implementation
 *
 * #### Static properties
 *
 * >    headingText = text for the heading ("default heading")
 *
 * >    message = text for the message ("default message text")
 *
 * >    applyText = text for apply button ("default apply")
 *
 * >    cancelText = text for cancel button ("default cancel")
 * 
 * >    clickPoint = optional object to determinate dialogs slideIn/slideOut origin/target (defaults to null => top left corner)
 *
 *
 * #### properties
 * >    saveFunction() = callback for apply button;
 *
 * >    async apply(event) = called by apply button; executes saveFunction() and calls closeDialog();
 *
 * >    renderDialog() = returns the html, must be called in the implementation;
 *
 * >    isValidEventForClose(event) = called before closing the dialog;
 *
 * >    async closeDialog(event) = to close the dialog;
 *
 * >    async isClosed() = resolve if dialog is closed (for testing purpose)
 * 
 *
 * #### Content of the heading section
 *
 *     heading = () => html`
 *       <div slot="heading" class="heading-text" role="heading" aria-level="1" >${this.headingText}</div>`;
 *
 *
 * #### Content of the message section
 *
 *     content = () => html'
 *       <div slot="content" class="content">${this.message}</div>`;
 *
 * #### Content of the footer section
 *
 *     footer = () => html`
 *       <div slot="footer">
 *         <my-dialog-button class="js-cancel-button" @click="${this.closeDialog}" .labelText="${this.cancelText}"></my-dialog-button>
 *         <my-dialog-button class="js-apply-button" @click="${this.apply}" .labelText="${this.applyText}"></my-dialog-button>
 *      </div>`;
 * 
 * **NOTE:**
 * 
 * > Lit's inline eventListener ( <div @click=${this.handleClick}></div>) doesn't work with spy test cases with mixins as expected, 
 * > because "this" referenced the mixin and not the extended class in that case.
 * > So spys on object methods won't work as expected.
 * >
 * > Use the more verbose inline event declaration: <div @click=${(event)=> this.handleClick(event)}></div> instead.
 * 
 *
 * @mixin
 * @param {*} superClass
 * @property {String} heading()
 * @property {String} content()
 * @property {String} footer()
 * @property {String} renderDialog()
 * @property {Promise} closeDialog(event)
 * @property {Boolean} isValidEventForClose(event)
 * @property {Promise} isClosed()
 * @property {Promise} apply()
 * @fires 'dialogClosed' when dialog is closed
 *
 */
export const DialogBaseMixin = (superClass) =>
  class extends superClass {
    static styles = [styles_dialogs];

    static properties = {
      /** The text of dialogs heading */
      headingText: {reflect: true},
      /** The text for cancel button */
      cancelText: {reflect: true},
      /** The text for save/apply button */
      applyText: {reflect: true},
      /** The text for dialogs content/message */
      messageText: {reflect: true},
      /** The function to call when apply button is clicked. */
      saveFunction: {},
      clickPoint: {},
    };

    constructor() {
      super();
      this.headingText = 'default heading';
      this.applyText = 'default apply';
      this.cancelText = 'default cancel';
      this.messageText = 'default message text';
      this.saveFunction = null;
      this.clickPoint = null;
    }

    get _dialog() {
      return this.renderRoot.querySelector('.js-dialog-container');
    }

    get _background() {
      return this.renderRoot.querySelector('.js-background');
    }

    get _cancelButton() {
      return this.renderRoot.querySelector('.js-cancel-button');
    }

    get _applyButton() {
      return this.renderRoot.querySelector('.js-apply-button');
    }

    /** Sets the heading element */
    heading = () => html` <div
      slot="heading"
      class="heading-text"
      role="heading"
      aria-level="1"
    >
      ${this.headingText}
    </div>`;

    /** Sets the content element */
    content = () => html` <div slot="content" class="content">
      ${this.messageText}
    </div>`;

    /** Sets the footer element */
    footer = () => html` <div slot="footer">
      <my-dialog-button
        class="js-cancel-button"
        @click="${(e)=> this.closeDialog(e)}"
        labelText="${this.cancelText}"
      ></my-dialog-button>
      <my-dialog-button
        class="js-apply-button"
        @click="${(e)=> this.apply(e)}"
        labelText="${this.applyText}"
      ></my-dialog-button>
    </div>`;

    /** Returns the default render implementation */
    renderDialog() {
      return html` <my-modal-background
        class="js-background"
        @click="${(e)=> this.closeDialog(e)}"
      >
        <div class="js-focus-border" tabindex="0" aria-hidden="true"></div>
        <my-dialog-container class="js-dialog-container" .clickPoint="${this.clickPoint ?? nothing}">
          ${this.heading()} ${this.content()} ${this.footer()}
        </my-dialog-container>
        <div class="js-focus-border" tabindex="0" aria-hidden="true"></div>
      </my-modal-background>`;
    }

    /** Checks if event is from cancel button, apply button or background */
    isValidEventForClose(event) {
      const isCancelButton = event.currentTarget === this._cancelButton;
      const isSaveButton = event.currentTarget === this._applyButton;
      const isBackground = event.target === this._background;
      return isCancelButton || isSaveButton || isBackground ;
    }
    /**
     * Closing steps:
     * 1. checks if event is valid for closing
     * 2. awaits dialog.slideOut() and background.fadeOut()
     * 3. dispatch event "dialogClosed"
     * 4. remove this element from DOM
     * 5. returns Promise<['slided out!', 'fadedOut']>
     */
    async closeDialog(event) {
      if (this.isValidEventForClose(event)) {
        event.stopPropagation();
        event.preventDefault();
        const results = await Promise.all([
          this._dialog.slideOut(),
          this._background.fadeOut(),
        ]);
        dispatchBubbelingCustomEvent.call(this, 'dialogClosed');

        this.remove();

        return results;
      } 
      return 'not valid event for close';
      
    }

    /**
     * Convenient method for testing, resolves when "dialogClosed" event is registered
     * @returns {Promise<String>} isClosed
     */
    async isClosed() {
      return await new Promise((resolve) =>
        this.addEventListener('dialogClosed', () => resolve('isClosed'))
      );
    }
    
    /**
     * Called by apply button.
     * 
     * - executes the saveFunction()
     * - calls closeDialog()
     */
    async apply(event) {
      if (this.saveFunction) {
        this.saveFunction();
      }
      await this.closeDialog(event);
    }
  };
