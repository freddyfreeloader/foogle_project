import {html} from 'lit';
import {setRange} from '../../../../.storybook/helper/setRange';
import './dialogContainer';

export default {
  component: 'my-dialog-container',
  tags: ['autodocs'],
  parameters: {
    controls: {
      exclude: /^_.*/g,
    },
  },
};

export const Default = {};
export const Playground = {
  args: {
    slideOutDuration: 500,
    slideInDuration: 225,
  },
  argTypes: {
    slideOutDuration: {
      control: setRange(5000),
    },
    slideInDuration: {
      control: setRange(5000),
    },
  },
  render: (args) => html`
    <style>
      * {
        --dialog-container-slide-out-transition: all ${args.slideOutDuration}ms
          cubic-bezier(0.4, 0, 0.2, 1);
        --dialog-container-slide-in-transition: transform
            ${args.slideInDuration}ms cubic-bezier(0, 0, 0.2, 1),
          translate ${args.slideInDuration}ms cubic-bezier(0, 0, 0.2, 1);
      }
      button {
        margin: 5px;
        display: block;
      }
    </style>
    <div id="decorator" class="decorator">
      <button id="center" type="button">centered by default</button>
      <button id="leftin" type="button">slide in from left</button>
      <button id="rightin" type="button">slide in from right</button>
      <button id="popup" type="button">slide in from bottom</button>
      <button id="popdown" type="button">slide in from top</button>
      <button id="mouseposition" type="button">
        slide in from mouse click position
      </button>
      <input id="shouldscale" type="checkbox" checked /> Dialog should scale up
    </div>

    <script>
      function createSlot(element, slotName, content) {
        const el = document.createElement(element);
        el.slot = slotName;
        el.innerHTML = content;
        return el;
      }

      function addDialog(e, option) {
        const el = document.createElement('my-dialog-container');

        if (option === 'mouseposition') {
          el.startPoint = {x: e.clientX, y: e.clientY};
        } else {
          el.appearance = option;
        }

        const checkBox = document.querySelector('input');
        if (!checkBox.checked) {
          el.noscale = true;
        }

        const heading = createSlot('DIV', 'heading', 'Dialog Heading');
        const content = createSlot(
          'DIV',
          'content',
          'The message of the dialog.'
        );
        const footer = createSlot('BUTTON', 'footer', 'Slide out!');
        footer.onclick = async () => {
          const res = await el.slideOut();
          removeDialog();
        };

        el.append(heading);
        el.append(content);
        el.append(footer);

        document.body.append(el);
      }

      function removeDialog() {
        const dialog = document.querySelector('my-dialog-container');
        dialog.remove();
      }
      mouseposition.onclick = (e) => addDialog(e, 'mouseposition');
      popup.onclick = (e) => addDialog(e, 'bottom');
      popdown.onclick = (e) => addDialog(e, 'top');
      leftin.onclick = (e) => addDialog(e, 'left');
      rightin.onclick = (e) => addDialog(e, 'right');
      center.onclick = (e) => addDialog(e, 'center');
    </script>
  `,
};
