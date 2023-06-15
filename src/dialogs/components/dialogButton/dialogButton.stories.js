import {html} from 'lit';
import {disableTable} from '../../../../.storybook/helper/disableTable';
import {setRange} from '../../../../.storybook/helper/setRange';
import './dialogButton';

export default {
  component: 'my-dialog-button',
  tags: ['autodocs'],
  args: {
    buttonText: 'Submit',
  },
  argTypes: {
    _button: disableTable(),
  },

  render: (args) =>
    html` <my-dialog-button .labelText=${args.buttonText}></my-dialog-button> `,
  decorators: [
    (story) => html`<div style="margin: 2em">
      <div>
        <p>
          If toggle of pseudo states fails, please reload/refresh the browser
          manually
        </p>
      </div>
      ${story()}
    </div>`,
  ],
};

export const Primary = {};

export const Hover = {};
Hover.parameters = {pseudo: {hover: true}};

export const Focus = {};
Focus.parameters = {pseudo: {focus: true}};

export const Active = {};
Active.parameters = {pseudo: {active: true}};

export const FocusAndActiveAndHover = {};
FocusAndActiveAndHover.parameters = {
  pseudo: {hover: true, focus: true, active: true},
};

export const FocusDemo = {
  render: () => html`
    <style>
      .buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px dashed black;
        width: 220px;
        height: 100px;
      }
    </style>
    <div class="buttons-container">
      <div class="focus-border" tabindex="0"></div>
      <my-dialog-button .labelText=${'Cancel'}></my-dialog-button
      ><my-dialog-button .labelText=${'Ok'}></my-dialog-button>
      <div class="focus-border" tabindex="0"></div>
    </div>
    <script>
      'use strict';
      (function setFocusTrap() {
        let [focusStart, focusEnd] = document.querySelectorAll('.focus-border');
        let [button1, button2] = document.querySelectorAll('my-dialog-button');

        focusStart.addEventListener('focusin', () =>
          button2.getButton().focus()
        );
        focusEnd.addEventListener('focusin', () => button1.getButton().focus());
      })();
    </script>
  `,
};

export const Playground = {
  args: {
    hoverInOutDuration: 15,
    releaseClickDuration: 150,
    clickAndFocusDuration: 75,
    colorHighlight: '#620080',
  },
  argTypes: {
    hoverInOutDuration: {
      description:
        'Sets the time in ms for hover in and out transitionduration',
      control: setRange(1000),
    },
    releaseClickDuration: {
      description:
        'Sets the time in ms from mouse release until end of transition',
      control: setRange(1000),
    },
    clickAndFocusDuration: {
      description:
        'Sets the time in ms for active (clicked) state transitionduration',
      control: setRange(1000),
    },
    colorHighlight: {
      control: 'color',
    },
    buttonText: disableTable(),
  },
  parameters: {
    controls: {expanded: true},
  },
  render: (args) => html`
    <style>
      .buttons-container {
        display: flex;
        justify-content: center;
        align-items: center;

        border: 1px dashed black;
        width: 220px;
        height: 100px;
      }

      my-dialog-button::part(highlight)::before,
      my-dialog-button::part(highlight)::after {
        background-color: ${args.colorHighlight};
      }

      my-dialog-button::part(highlight)::after {
        transition: opacity ${args.releaseClickDuration}ms linear;
      }

      .button:hover my-dialog-button::part(highlight)::before {
        transition: opacity ${args.hoverInOutDuration}ms linear,
          background-color ${args.hoverInOutDuration}ms linear;
        opacity: 0.33;
      }
      .button:focus my-dialog-button::part(highlight)::before {
        transition: opacity ${args.clickAndFocusDuration}ms linear,
          background-color ${args.clickAndFocusDuration}ms linear;
        opacity: 0.66;
      }
      .button:active my-dialog-button::part(highlight)::after {
        transition: opacity ${args.clickAndFocusDuration}ms linear;
        opacity: 0.63;
      }
    </style>
    <div class="buttons-container">
      <span class="button" tabindex="0"
        ><my-dialog-button .labelText=${'Cancel'}></my-dialog-button
      ></span>
      <span class="button"
        ><my-dialog-button .labelText=${'Ok'}></my-dialog-button
      ></span>
    </div>
  `,
};
