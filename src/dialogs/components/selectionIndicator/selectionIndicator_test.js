import {expect, fixture, oneEvent, unsafeStatic, html} from '@open-wc/testing';
import {SELECTION_INDICATOR} from '../../../utils/testingHelpers/constants';
import {SelectionIndicator} from './selectionIndicator';

describe('test WebComponent SelectionIndicator', () => {
  const tag = unsafeStatic(SELECTION_INDICATOR);

  const selectionIndicator = () => document.querySelector(SELECTION_INDICATOR);
  const PARENT_SIZE = '40px';

  it('should be defined', async () => {
    const el = document.createElement(SELECTION_INDICATOR);
    expect(el).exist;
    expect(el).instanceOf(SelectionIndicator);
  });

  const parentStyle = () => {
    return html` <style>
      .parent {
        position: relative;
        width: ${PARENT_SIZE};
        height: ${PARENT_SIZE};
      }

      .contentToSelect {
        position: relative;
        width: 20px;
        height: 20px;
        border: solid black 1px;
        border-radius: 50%;
      }
    </style>`;
  };
  // to speed up test
  const shortStyle = () => {
    return html` <style>
      my-selection-indicator.mousedown {
        animation: radialInkSpread 1ms;
        animation-fill-mode: forwards;
        opacity: 1;
      }
      @keyframes radialInkSpread {
        0% {
          transform: scale(1.5);
          opacity: 0;
        }
        100% {
          transform: scale(2.5);
          opacity: 1;
        }
      }
    </style>`;
  };

  const parentNode = () => {
    return html`
    <div class="parent">
    <${tag}></${tag}>
    <div class="contentToSelect"></div>
  </div>`;
  };

  it('should render with default values and size of parent', async () => {
    await fixture(html`${parentStyle()} ${parentNode()}`);
    const computedStyles = window.getComputedStyle(selectionIndicator());
    expect(computedStyles.backgroundColor).equal('rgba(0, 0, 0, 0.2)');
    expect(computedStyles.opacity).equal('0');
    expect(computedStyles.borderRadius).equal('50%');
    expect(computedStyles.width).equal(PARENT_SIZE);
    expect(computedStyles.height).equal(PARENT_SIZE);
  });

  it('should scale up and gets full opacity with class "mousedown"', async () => {
    await fixture(html`${parentStyle()} ${shortStyle()} ${parentNode()}`);

    const el = selectionIndicator();
    setTimeout(() => el.classList.add('mousedown'));
    await oneEvent(el, 'animationend');
    const opacity = window.getComputedStyle(el).opacity;
    const transform = window.getComputedStyle(el).transform;

    expect(opacity).equals('1');
    expect(transform).equals('matrix(2.5, 0, 0, 2.5, 0, 0)');
  });
});
