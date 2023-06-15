import {html} from 'lit';
import './modalBackground';

import {setRange} from '../../../../.storybook/helper/setRange';
import {disableTable} from '../../../../.storybook/helper/disableTable';

export default {
  component: 'my-modal-background',
  tags: ['autodocs'],
  args: {
    colorBackground: 'rgba(0, 0, 0, .6)',
    fadeInOutDuration: 500,
  },
  argTypes: {
    colorBackground: {
      description: 'The color of the background.',
      control: 'color',
    },
    fadeInOutDuration: {
      description:
        'The time in ms until the background color has full/no opacity.',
      control: setRange(5000),
    },
    scroll: {
      description:
        'The component disables scrolling with document.body.style.overflow = "hidden". But this disables scrolling in storybook too, so the stories enable overflow by default. You can change scroll behaviour, but you have to reload the page manually.',
    },
    _modal: disableTable(),
  },
  parameters: {
    controls: {
      expanded: true,
      hideNoControlsWarning: true,
    },
  },
  render: () => html` <my-modal-background></my-modal-background>`,

  decorators: [
    (Story, context) =>
      html`<style>
          * {
            --modal-background-transition: background-color
              ${context.args.duration
                ? context.args.fadeInOutDuration.toString()
                : '500'}ms
              cubic-bezier(0.4, 0, 0.2, 1);
            --modal-background-color: ${context.args.colorBackground};
          }
          .main-content {
            font-size: 30px;
          }

          .dialog-container {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            top: 20%;
            left: 20%;
            height: 50%;
            width: 50%;

            border: 1px solid black;
            background-color: lightblue;
          }
          .dialog-content {
            border: solid 2px black;
            padding: 2px;
          }
        </style>
        <div class="main-content">
          <button type="button">not clickable button</button>
          <div>
            this is the main content, the button should not clickable and the
            window should not scrollable.
            <p>
              For storybook presentation scrolling is enabled, so you can scroll
              through the docs.
            </p>
            <p>
              Disable scrolling by control panel (maybe you have to reload
              browser page), so you get the origin implementation, but storybook
              Docs are not scrollable now.
            </p>
          </div>
        </div>
        ${Story()}`,
  ],
};

export const DefaultWithDummyText = {
  parameters: {
    controls: {
      exclude: /^_.*/g,
      expanded: true,
      hideNoControlsWarning: true,
    },
  },
  args: {
    scroll: true,
  },
};

export const DialogExampleWithFadeOutFadeIn = {
  
  args: {
    scroll: true,
  },

  render: (args) =>
    html`<style>
        my-modal-background {
          --modal-background-transition: background-color
            ${args.fadeInOutDuration
              ? args.fadeInOutDuration.toString()
              : '500'}ms
            cubic-bezier(0.4, 0, 0.2, 1);
          --modal-background-color: ${args.colorBackground};
        }
      </style>
      <my-modal-background id="background">
        <div class="dialog-container">
          <div class="dialog-content">
            <button id="buttonclose" type="button">fade out</button>
            <button id="buttongrey" type="button">fade in</button>
          </div>
        </div>
      </my-modal-background>
      <script>
        buttonclose.addEventListener('click', () =>
          buttonclose.dispatchEvent(
            new CustomEvent('close', {bubbles: true, composed: true})
          )
        );
        buttongrey.addEventListener('click', () =>
          background.shadowRoot
            .querySelector('.modal')
            .classList.add('grey-background')
        );

        function toggleScroll() {
          setTimeout(() => {
            const overflow = ${args.scroll} ? '' : 'hidden';
            document.body.style.overflow = overflow;
          });
        }
        toggleScroll();
      </script>`,
};
