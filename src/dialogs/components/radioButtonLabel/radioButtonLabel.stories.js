import {html} from 'lit';
import './radioButtonLabel';

export default {
  component: 'my-radio-button-label',
  tags: ['autodocs'],
  render: (args) =>
    html`<my-radio-button-label
      .checked=${args.checked}
      .text=${args.text}
      .pulse=${args.pulse}
      .mouseDown=${args.mouseDown}
      .greySelection=${args.greySelection}
    ></my-radio-button-label>`,
    decorators: [(Story) => html`
    <style>
      .decorator {
        border: 1px dashed black;
        width: 200px;
      }
    </style>
    <div class="decorator">${Story()}</div>
    
    `],

  parameters: {
    controls: {
      exclude: /size|index|id|^_.*/g,
    },
  },
  args: {
    text: 'Radio Button Text',
  },
};

export const LabelAndText = {
  args: {
    text: 'Radio Button Text',
  },
};
export const Checked = {
  args: {
    checked: true,
  },
};
export const Mousedown = {
  args: {
    mouseDown: true,
  },
};
export const Pulse = {
  args: {
    pulse: true,
  },
};
export const CheckedAndMousedown = {
  args: {
    checked: true,
    mouseDown: true,
  },
};

export const LongText = {
  args:{
    text: 'Very long label text to check for vertical text align',
  },
}
