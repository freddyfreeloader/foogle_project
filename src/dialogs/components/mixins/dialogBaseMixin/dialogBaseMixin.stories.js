import {html, LitElement} from 'lit';
import * as backgroundStories from '../../modalBackground/modalBackground.stories';
import * as dialogContainerStories from '../../dialogContainer/dialogContainer.stories';

import {disableTable} from '../../../../../.storybook/helper/disableTable';

import {DialogBaseMixin} from './dialogBaseMixin';

/**
 * Provides the basic implementation for dialogs.
 *
 * Composes WebComponents:
 * - ModalBackground
 * - Dialog_flexContainer
 * - DialogButton
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
 *     class MyDialog extends Dialog_Base_Mixin(LitElement) {
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
 *
 *
 * @see DialogBaseMixin
 */
class Base extends DialogBaseMixin(LitElement) {
  render() {
    return this.renderDialog();
  }
}
window.customElements.define('my-base', Base);

export default {
  component: 'my-base',
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: [
        'properties',
        '_root',
        '_dialog',
        '_background',
        '_cancelButton',
        '_applyButton',
        'styles',
        'heading',
        'content',
        'footer',
      ],
    },
  },
  decorators: [
    (Story) => html`<div>${Story()}</div>
      <script>
        setTimeout(() => {
          document.body.style.overflow = '';
        });
      </script>`,
  ],
};
export const Default = {};

/**
 * Demonstration implementation
 */
export const Demo = {
  args: {
    ...backgroundStories.default.args,
    ...dialogContainerStories.Playground.args,
  },
  argTypes: {
    ...backgroundStories.default.argTypes,
    ...dialogContainerStories.Playground.argTypes,

    headingText: disableTable(),
    messageText: disableTable(),
    applyText: disableTable(),
    cancelText: disableTable(),
    scroll: disableTable(),
  },

  render: (args) => html`<style>
      * {
        --modal-background-transition: background-color
          ${args.fadeInOutDuration
            ? args.fadeInOutDuration.toString()
            : '500'}ms
          cubic-bezier(0.4, 0, 0.2, 1);
        --modal-background-color: ${args.colorBackground};
        --dialog-container-slide-out-transition: all ${args.slideOutDuration}ms
          cubic-bezier(0.4, 0, 0.2, 1);
        --dialog-container-transform: all ${args.containerTransition}ms
          cubic-bezier(0.4, 0, 0.2, 1);
        --dialog-container-slide-in-transition: transform
          ${args.shadowTransition}ms cubic-bezier(0, 0, 0.2, 1);
      }

      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        border: solid 1px black;
        background-color: lightgrey;
        padding: 5px 5px;
      }

      #close-span,
      #apply-span {
        padding: 0 5px;
        color: red;
      }</style
    ><button id="button" type="button">Open Dialog</button>
    <hr />
    <h3>Listen to saveFunction():</h3>
    <p>Callback is executed immediately.</p>
    <div class="box">Called Apply: <span id="apply-span">0</span> times.</div>
    <hr />
    <h3>Listen to "dialogClosed" event:</h3>
    <p>Event will dispatch after awaiting for all transitions.</p>
    <div class="box">Called Close: <span id="close-span">0</span> times.</div>
    <script>
      'use strict';
      function increment(selector) {
        const span = document.querySelector(selector);
        let parsedText = parseInt(span.innerText, 10);
        span.innerText = ++parsedText;
      }
      function incrementClose() {
        increment('#close-span');
        document.removeEventListener('dialogClosed', incrementClose);
      }

      function openDialog() {
        const dialog = document.createElement('my-base');
        dialog.applyText = 'apply';
        dialog.cancelText = 'cancel';
        dialog.headingText = 'Demonstration Dialog';
        dialog.messageText =
          'Click on background or cancel to close, click on apply to close and execute saveFunction';
        dialog.saveFunction = () => {
          increment('#apply-span');
        };
        document.addEventListener('dialogClosed', incrementClose);
        document.body.append(dialog);
      }

      button.onclick = () => openDialog();
    </script>`,
};
