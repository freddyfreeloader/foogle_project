import {html} from 'lit';
import {disableTable} from '../../../.storybook/helper/disableTable';
import './confirmationDialog';

export default {
  component: 'my-confirmation-dialog',
  tags: ['autodocs'],
  render: () => html`<my-confirmation-dialog></my-confirmation-dialog>`,
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
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};

export const Default = {};

export const Example = {
  render: () => html`
    <style>
      .colored-box {
        width: 210px;
        height: 200px;

        background-color: green;
      }

      .colored-box.blue {
        background-color: blue;
      }
    </style>
    <div class="colored-box"></div>
    <button id="button" type="button">Change color</button>
    <script>
      function createDialog(e) {
        const dialog = document.createElement('my-confirmation-dialog');
        dialog.clickPoint = {x: e.clientX, y: e.clientY};
        dialog.headingText = 'This is an example dialog.';
        dialog.messageText = 'Do you want to change the color?';
        dialog.applyText = 'Yes';
        dialog.cancelText = 'No';
        dialog.saveFunction = () =>
          document.querySelector('.colored-box').classList.toggle('blue');

        document.body.append(dialog);
      }
      function initButton() {
        const button = document.querySelector('#button');
        button.onclick = (e) => createDialog(e);
      }
      initButton();
    </script>
  `,
};
