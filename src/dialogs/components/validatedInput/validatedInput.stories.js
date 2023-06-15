import {html} from 'lit';
import {disableTable} from '../../../../.storybook/helper/disableTable';
import {setRange} from '../../../../.storybook/helper/setRange';
import './validatedInput';
export default {
  component: 'my-validated-input',
  tags: ['autodocs'],
  render: (args) =>
    html`<my-validated-input .inputValue=${args?.text} .validationText=${args.validationText}></my-validated-input>`,
  decorators: [
    (Story) => html` <style>
        .decorator {
          width: 250px;
          border: 1px dashed black;
        }
      </style>
      <div class="decorator">${Story()}</div>`,
  ],
  argTypes: {
    _input: disableTable(),
    _underline: disableTable(),
    _inputValidation: disableTable(),
  },
};

export const Default = {};

export const WithText = {
  args: {
    text: 'dummy text',
  },
};

export const WithValidationMessage = {
  args: {
    text: 'wrong input text',
    validationText: "It's always false",
  },
  decorators: [
    (Story) => html`
      <script>
        function showMessage() {
          const validatedInput = document.querySelector('my-validated-input');
          validatedInput.showValidationMessage();
        }
        setTimeout(() => showMessage());
      </script>
      ${Story()}
    `,
  ],
};

export const Playground = {
  args: {
    validationText: 'my validation Text',
    underlineDefault: 'rgba(0, 0, 0, 0.12)',
    underlineSelect: '#4285f4',
    underlineError: '#d50000',
    errorTextColor: '#d50000',
    animationDurationGrow: 500,
    animationDurationBlur: 300,
  },
  argTypes: {
    underlineDefault: {control: 'color'},
    underlineSelect: {control: 'color'},
    underlineError: {control: 'color'},
    errorTextColor: {control: 'color'},
    animationDurationGrow: {control: setRange(2000)},
    animationDurationBlur: {control: setRange(2000)},
  },
  render: (args) => html`
    <style>
      * {
        --validated-input-underline-color-default: ${args.underlineDefault};
        --validated-input-underline-color-select: ${args.underlineSelect};
        --validated-input-text-color-error: ${args.errorTextColor};
        --validated-input-underline-color-error: ${args.underlineError};
        --validated-input-animation-duration-grow: ${args.animationDurationGrow}ms;
        --validated-input-animation-duration-blur: ${args.animationDurationBlur}ms;
      }
    </style>
    <my-validated-input .validationText=${args.validationText}></my-validated-input>
    <button id="button-show" type="button">validate</button>
    <button id="button-remove" type="button">reset</button>
    <script>
      function getInput() {
        return document.querySelector('my-validated-input');
      }
      
      function showMessage() {
        getInput().showValidationMessage();
      }

      function removeMessage() {
        getInput().removeValidationMessage();
      }

      function initButtons() {
        document.querySelector('#button-show').onclick = () => showMessage();
        document.querySelector('#button-remove').onclick = () => removeMessage();
      }

      initButtons();
    </script>
  `,
};
