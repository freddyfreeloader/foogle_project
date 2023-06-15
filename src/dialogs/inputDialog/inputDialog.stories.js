import {html, nothing} from 'lit';
import './inputDialog';

import {disableTable} from '../../../.storybook/helper/disableTable';

export default {
  component: 'my-input-dialog',
  tags: ['autodocs'],
  render: (args) =>
    html`<my-input-dialog
      .inputValue=${args.input || nothing}
      .headingText=${args.heading || nothing}
      .applyText=${args?.applyText || nothing}
      .cancelText=${args?.cancelText || nothing}
      .validationText=${args.validation || nothing}
      .validationPredicate=${args.validationPredicate || nothing}
    ></my-input-dialog>`,

  decorators: [
    (Story) => html` ${Story()}
      <script>
        // Overwrite dialogs overflow style to enable scrolling in storybooks docs.
        function enableScrolling() {
          document.body.style.overflow = '';
        }
        setTimeout(() => enableScrolling());
      </script>`,
  ],
  argTypes: {
    properties: disableTable(),
    styles: disableTable(),
    heading: disableTable(),
    content: disableTable(),
    footer: disableTable(),
    _root: disableTable(),
    _dialog: disableTable(),
    _background: disableTable(),
    _cancelButton: disableTable(),
    _applyButton: disableTable(),
    _getFirstAndLastFocusableElement: disableTable(),
    _isTabPressed: disableTable(),
    _trapFocus: disableTable(),
    _focusFirstElement: disableTable(),
    _getBorders: disableTable(),
    _validatedInputComponent: disableTable(),
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};

export const Default = {
  args: {},
};

export const CheckIfEmpty = {
  args: {
    heading: 'Please type !',
    applyText: 'Apply',
    cancelText: 'Cancel',
    validation: 'Input is empty!',
    validationPredicate: (input) => !!input.length,
  },
};

export const WithInputValue = {
  args: {
    ...CheckIfEmpty.args,
    input: 'default',
  },
};

export const ExampleImplementation = {

  render: () => html`
    <style>
      #textbox {
        width: 200px;
        height: 200px;
        border: 1px solid black;
        cursor: pointer;
      }
    </style>
    <div id="textbox">Click to change the text!</div>
    <script>
      'use strict';

      function openDialog() {
        const dialog = document.createElement('my-input-dialog');
        dialog.headingText = 'Please provide content!';
        dialog.applyText = 'take it!';
        dialog.cancelText = "don't change";
        dialog.saveFunction = () =>
          document.removeEventListener('inputConfirmed', changeText);
        document.addEventListener('inputConfirmed', changeText);
        dialog.validationText = 'You have to provide one letter at least!';
        dialog.validationPredicate = (input) => !!input.length;

        document.body.append(dialog);
      }

      function changeText(event) {
        const value = event.detail.input;
        textbox.innerText = value;
      }

      function initTextBox() {
        const box = document.querySelector('#textbox');
        if (box) {
          box.onclick = () => openDialog();
        }
      }
      initTextBox();
    </script>
  `,
  parameters: {
    controls: {
      exclude: /.*_.*|properties|messageText|styles|heading|footer|content/g,
    },
  },
};
