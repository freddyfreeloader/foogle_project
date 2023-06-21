import {html} from 'lit';
import {disableTable} from '../../../.storybook/helper/disableTable';
import './radioButtonDialog';

export default {
  component: 'my-radio-button-dialog',
  tags: ['autodocs'],
  render: () => html`<my-radio-button-dialog></my-radio-button-dialog>`,
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
    _selectedOption: disableTable(),
    _dialog: disableTable(),
    _background: disableTable(),
    _cancelButton: disableTable(),
    _applyButton: disableTable(),
    _isTabPressed: disableTable(),
    _getFirstAndLastFocusableElement: disableTable(),
    _trapFocus: disableTable(),
    _focusFirstElement: disableTable(),
    _getBorders: disableTable(),
    heading: disableTable(),
    footer: disableTable(),
    content: disableTable(),
    styles: disableTable(),
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
  },
};

export const Default = {};

/**
 * Test property settings,
 * test event dispatching.
 */
export const Example = {
  render: () => html`
    <style>
      .colored-box {
        margin-top: 10px;
        width: 400px;
        height: 100px;
        border: 2px solid black;
      }

      .colored-box.blue {
        background-color: blue;
      }
      .colored-box.red {
        background-color: red;
      }
      .colored-box.green {
        background-color: green;
      }
    </style>
    <button id="button" type="button">Open Dialog</button>
    <div class="colored-box"></div>

    <script>
      function changeColor(event) {
        const color = event.detail.option;
        const box = document.querySelector('.colored-box');
        box.classList.remove('blue');
        box.classList.remove('red');
        box.classList.remove('green');
        box.classList.add(color);
      }

      function openDialog(e) {
        const dialog = document.createElement('my-radio-button-dialog');
        dialog.clickPoint = {x: e.clientX, y: e.clientY};
        dialog.headingText = 'Color The Box';
        dialog.messageText = 'Choose a color for the box';
        dialog.cancelText = 'Cancel';
        dialog.applyText = 'Apply';
        const myOptions = [
          {id: 'blue', text: 'Blue'},
          {id: 'green', text: 'Green'},
          {id: 'red', text: 'Red'},
        ];
        dialog.options = myOptions;

        document.addEventListener('radioDialogClosedWithApply', changeColor);
        dialog.saveFunction = () =>
          document.removeEventListener(
            'radioDialogClosedWithApply',
            changeColor
          );

        document.body.append(dialog);
      }

      function initButton() {
        const button = document.querySelector('#button');
        button.onclick = (e) => openDialog(e);
      }

      initButton();
    </script>
  `,
};
/**
 * Text from an original google dialog, to compare with the original.
 */
export const GoogleDialogExample = {
  render: () => html`
    <button id="button" type="button">Open Dialog</button>
    <script>
      function openDialog(e) {
        const dialog = document.createElement('my-radio-button-dialog');
        dialog.clickPoint = {x: e.clientX, y: e.clientY};
        dialog.headingText = 'Dieses Label löschen';
        dialog.messageText =
          'Das Label enthält 2 Kontakte. Wähle aus, was damit passieren soll.';
        dialog.cancelText = 'Abbrechen';
        dialog.applyText = 'Löschen';
        const myOptions = [
          {id: 'firstId', text: 'Kontakte behalten und dieses Label löschen'},
          {id: 'secondId', text: 'Alle Kontakte und dieses Label löschen'},
        ];
        dialog.options = myOptions;
        document.body.append(dialog);
      }

      function initButton() {
        const button = document.querySelector('#button');
        button.onclick = (e) => openDialog(e);
      }

      initButton();
    </script>
  `,
};
