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
      <p>
        Slide-In:
        <input
          type="radio"
          id="centerin"
          name="slidein"
          value="center"
          checked
        />
        center <input type="radio" id="topin" name="slidein" value="top" /> top
        <input type="radio" id="rightin" name="slidein" value="right" /> right
        <input type="radio" id="leftin" name="slidein" value="left" /> left
        <input type="radio" id="bottomin" name="slidein" value="bottom" />
        bottom
        <input type="radio" id="clickin" name="slidein" value="click" /> click
        <input id="shouldscalein" type="checkbox" checked /> scale in
      </p>

      <p>
        Slide-Out:
        <input
          type="radio"
          id="centerout"
          name="slideout"
          value="center"
          checked
        />
        center
        <input type="radio" id="topout" name="slideout" value="top" /> top
        <input type="radio" id="rightout" name="slideout" value="right" /> right
        <input type="radio" id="leftout" name="slideout" value="left" /> left
        <input type="radio" id="bottomout" name="slideout" value="bottom" />
        bottom
        <input type="radio" id="clickout" name="slideout" value="click" /> click
        <input id="shouldscaleout" type="checkbox" checked /> scale out
      </p>
      <br />
      <button id="center" type="button">open the dialog</button>
    </div>

    <script>
      function createSlot(element, slotName, content) {
        const el = document.createElement(element);
        el.slot = slotName;
        el.innerHTML = content;
        return el;
      }

      function addDialog(e) {
        const el = document.createElement('my-dialog-container');
        el.clickPoint = {x: e.clientX, y: e.clientY};
        const optionIn = [...document.querySelectorAll('input')].filter(
          (i) => i.checked === true && i.name === 'slidein'
        )[0].value;
        const optionOut = [...document.querySelectorAll('input')].filter(
          (i) => i.checked === true && i.name === 'slideout'
        )[0].value;
        el.slideInOrigin = optionIn;
        el.slideOutTarget = optionOut;

        el.noScaleIn = !document.getElementById('shouldscalein').checked;
        el.noScaleOut = !document.getElementById('shouldscaleout').checked;

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
      center.onclick = (e) => addDialog(e);
    </script>
  `,
};
