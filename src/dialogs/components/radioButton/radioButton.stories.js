import {html} from 'lit';
import {setRange} from '../../../../.storybook/helper/setRange';
import './radioButton';
import {buttonStyles} from './storyStyles';

export default {
  component: 'my-radio-button',
  tags: ['autodocs'],
  render: (args) =>
    html` <my-radio-button ?checked=${args.checked}></my-radio-button>`,
  decorators: [
    (Story, context) => html` <style>
        ${buttonStyles(context.args)}
      </style>
      <div class="decorator">${Story()}</div>`,
  ],
  argTypes: {
    colorChecked: {
      description: 'The color if the button is checked.',
      control: 'color',
    },
    colorUnchecked: {
      description: 'The color if the button is not checked.',
      control: 'color',
    },
    dotTransition: {
      description: 'The time in ms until the inner dot transition ends.',
      control: setRange(2000),
    },
    buttonsize: {
      description: 'The size of the button in px.',
      control: setRange(100),
    },
  },
};

export const Unchecked = {
  args: {
    checked: false,
    colorChecked: '#1a73e8',
    colorUnchecked: 'rgba(0, 0, 0, .54)',
    dotTransition: 280,
    buttonsize: 16,
  },
};

export const Checked = {
  args: {
    ...Unchecked.args,
    checked: true,
  },
};

export const CustomSize = {
  args: {
    ...Checked.args,
    buttonsize: 36,
  },
};
