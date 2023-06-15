import {html} from 'lit';
import './radioButtonController';
import * as RadioButtonStories from '../radioButton/radioButton.stories';
import {buttonStyles} from '../radioButton/storyStyles';

import {userEvent, within, fireEvent} from '@storybook/testing-library';
import {disableTable} from '../../../../.storybook/helper/disableTable';
import {setRange} from '../../../../.storybook/helper/setRange';

export default {
  component: 'my-radio-button-controller',
  tags: ['autodocs'],
  render: (args) =>
    html`<my-radio-button-controller
      role="presentation"
      .options=${args.options}
    ></my-radio-button-controller> `,
  decorators: [
    (Story, context) => html`
      <style>
        ${buttonStyles(context.args)} .decorator {
          width: 400px;
          height: 200px;
          border: 1px dashed black;
        }
      </style>
      <div class="decorator">${Story()}</div>
    `,
  ],
  args: {
    options: [
      {id: 'first', text: 'First Radio Button'},
      {id: 'second', text: 'Second Radio Button'},
      {id: 'third', text: 'Third Radio Button'},
    ],
    ...RadioButtonStories.Unchecked.args,
  },
  argTypes: {
    ...RadioButtonStories.default.argTypes,
    buttonsize: disableTable(),
  },
  parameters: {
    controls: {
      exclude: /^_.*/g,
    },
  },
};

export const Default = {};

export const ShortText = {
  args: {
    options: [
      {id: 'first', text: 'First'},
      {id: 'second', text: 'Second'},
      {id: 'third', text: 'Third'},
    ],
    ...RadioButtonStories.Unchecked.args,
  },
}

export const LongText = {
  args: {
    options: [
      {id: 'first', text: 'First radio button with a very long text as label'},
      {id: 'second', text: 'Second radio button with a very long text as label'},
      {id: 'third', text: 'Third'},
    ],
    ...RadioButtonStories.Unchecked.args,
  },
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const PreselectedButton = {
  render: (args) =>
    html`<my-radio-button-controller
      role="presentation"
      .options=${args.options}
      .selectedRadio=${args.options[1].id}
    ></my-radio-button-controller> `,
}

export const PlayDemo = {
  args: {
    speed: 300,
  },
  argTypes: {
    speed: {
      description: 'Waiting for next step in ms',
      control: setRange(3000),
    },
  },
  play: async ({args, canvasElement, step}) => {
    const sleepDuration = args.speed;
    const canvas = within(canvasElement);

    const controller = await canvas.findByRole('presentation');

    function label(index) {
      return controller.shadowRoot.querySelectorAll('my-radio-button-label')[
        index
      ];
    }

    function labelContainer(index) {
      return label(index).shadowRoot.querySelector('.label-container');
    }
    function focusLabel(index) {
      return label(index).shadowRoot.querySelector('.radio-button-wrapper');
    }

    async function clickLabel(index) {
      await fireEvent.mouseDown(labelContainer(index));
      await sleep(sleepDuration);
      await userEvent.click(label(index));
      await fireEvent.mouseUp(labelContainer(index));
      await sleep(sleepDuration);
    }

    async function pressKey(key) {
      await fireEvent.keyDown(label(1), {key: key});
      await sleep(sleepDuration);
    }

    // selection indicator should be blue

    await step('click Labels, selection indicator should be blue', async () => {
      await clickLabel(1);
      await clickLabel(2);
      await clickLabel(0);
    });

    // selection indicator should by grey
    await clickLabel(0);

    // selection indicator should pulse
    await fireEvent.focus(focusLabel(0));
    await sleep(sleepDuration);
    await userEvent.click(label(0));
    await fireEvent.mouseUp(labelContainer(0));
    await sleep(sleepDuration);
    await fireEvent.focusOut(focusLabel(0));

    // selection should move down, restart on top if last button was selected
    await pressKey('ArrowDown');
    await pressKey('ArrowDown');
    await pressKey('ArrowDown');

    await pressKey('ArrowRight');
    await pressKey('ArrowRight');
    await pressKey('ArrowRight');

    // selection should move up, restart on bottom if first button was selected
    await pressKey('ArrowUp');
    await pressKey('ArrowUp');
    await pressKey('ArrowUp');

    await pressKey('ArrowLeft');
    await pressKey('ArrowLeft');
    await pressKey('ArrowLeft');

    await fireEvent.focus(focusLabel(0));
  },
};
