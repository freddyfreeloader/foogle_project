import {html} from 'lit';
import {disableTable} from '../../../../.storybook/helper/disableTable';
import {setRange} from '../../../../.storybook/helper/setRange';
import {setCategory} from '../../../../.storybook/helper/setCategory';
import './selectionIndicator';

export default {
  component: 'my-selection-indicator',
  tags: ['autodocs'],
  render: (args) =>
    html`
      <my-selection-indicator
        class="${args.focused ? 'focused' : ''} ${args.mousedown
          ? 'mousedown'
          : ''}"
      ></my-selection-indicator>
    `,
  decorators: [
    (Story, context) => html` <style>
            .decorator {
              display: flex;
              justify-content: center;
              align-content: space-around;
              /* border: 1px solid black; */
            }

            .parent {
              position: relative;
              justify-content: center;
              align-items: center;

              display: flex;
              width: 40px;
              height: 40px;

              /* border: solid black 1px; */
            }

            .content {
              border: solid black 1px;
              border-radius: 50%;

              width: 100%;
              height: 100%;
            }

            my-selection-indicator.mousedown {
          animation: spread ${context.args.spreadDuration
          ? context.args.spreadDuration
          : 300}ms;
          animation-fill-mode: forwards;
          opacity: 1;
        }
        @keyframes spread {
          0% {
            transform: scale(${context.args.spreadStartScale
          ? context.args.spreadStartScale
          : 1.5});
            opacity: 0;
          }
          100% {
            transform: scale(${context.args.spreadEndScale
          ? context.args.spreadEndScale
          : 2.5});
            opacity: 1;
          }
        }

        my-selection-indicator.focused {
          animation: pulse ${context.args.pulseDuration
          ? context.args.pulseDuration
          : 700}ms infinite alternate;
          opacity: 1;
        }
        @keyframes pulse {
          0% {
            transform: scale(${context.args.pulseStartScale
          ? context.args.pulseStartScale
          : 2});
            opacity: 0;
          }
          100% {
            transform: scale(${context.args.pulseEndScale
          ? context.args.pulseEndScale
          : 2.5});
            opacity: 1;
          }
        }

            ${context.args.colorStyles
          ? context.args.colorStyles(context.args.color)
          : null}
          ${context.args.sizeStyles ? context.args.sizeStyles(context.args.size) : null}
      </style>
      <div class="decorator">
        <div class="parent">
          ${Story()}
          <div class="content"></div>
        </div>
      </div>`,
  ],

  argTypes: {
    sizeStyles: disableTable(),
    colorStyles: disableTable(),
  },
};

export const Default = {
  args: {
    focused: false,
    mousedown: false,
  },
};

export const Focused = {
  args: {
    focused: true,
  },
};

export const Mousedown = {
  args: {
    mousedown: true,
  },
};

export const Playground = {
  args: {
    focused: true,
    mousedown: false,
    color: 'rgba(62, 80, 180, 0.2)',
    colorStyles: (color) => `my-selection-indicator {
        background-color: ${color}; }`,
    size: 40,
    sizeStyles: (size) => `.parent {
          width: ${size}px;
          height: ${size}px;
        }`,
    spreadDuration: 200,
    spreadStartScale: 1.5,
    spreadEndScale: 2.5,
    pulseDuration: 700,
    pulseStartScale: 2,
    pulseEndScale: 2.5,
  },
  argTypes: {
    color: {
      table: setCategory('general settings'),
      control: 'color',
    },
    size: {
      table: setCategory('general settings'),
      control: setRange(200),
      description: 'The size of the parent element',
    },
    spreadDuration: {
      table: setCategory('on mousedown'),
      control: setRange(2000),
    },
    spreadStartScale: {
      table: setCategory('on mousedown'),
      control: setRange(5, 0.1, 0.1),
    },
    spreadEndScale: {
      table: setCategory('on mousedown'),
      control: setRange(5, 0.1, 0.1),
    },
    pulseDuration: {
      table: setCategory('on focus'),
      control: setRange(2000),
    },
    pulseStartScale: {
      table: setCategory('on focus'),
      control: setRange(5, 0.1, 0.1),
    },
    pulseEndScale: {
      table: setCategory('on focus'),
      control: setRange(5, 0.1, 0.1),
    }
  },
};
