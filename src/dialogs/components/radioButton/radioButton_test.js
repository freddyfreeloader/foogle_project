import {
  expect,
  fixture,
  oneEvent,
  unsafeStatic,
  html
} from '@open-wc/testing';
import {queryDeep} from '../../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';
import * as CONST from '../../../utils/testingHelpers/constants';
import {RadioButton} from './radioButton';

const tag = unsafeStatic(CONST.RADIO_BUTTON);

describe('test WebComponent RadioButton', () => {

  const defaultFixture = async ()=> fixture(html`<${tag}></${tag}>`);

  async function getBorderColor(selector) {
    const el = await queryDeep(selector);
    return window.getComputedStyle(el).borderColor;
  }

  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).instanceOf(RadioButton);
  });

  it('should render html', async () => {
    const el = await defaultFixture();

    expect(el).shadowDom.equal(
      `<div class="ring-container">
        <div class="ring" part="ring">
            <div class="dot" part="dot"></div>
        </div>
    </div>`
    );
  });

  it('should render with default CSS', async () => {
    await defaultFixture();
    const ring = await queryDeep(CONST.RING_CLASS);
    const dot = await queryDeep(CONST.DOT_CLASS);
    const stylesRing = window.getComputedStyle(ring);
    const stylesDot = window.getComputedStyle(dot);

    expect(stylesRing.width).equal('16px');
    expect(stylesRing.height).equal('16px');
    expect(stylesRing.borderRadius).equal('50%');
    expect(stylesRing.borderWidth).equal('2px');
    expect(stylesRing.borderColor).equal(CONST.RADIO_BUTTON_UNCHECKED_COLOR);

    expect(stylesDot.borderColor).equal(CONST.RADIO_BUTTON_UNCHECKED_COLOR);
    expect(stylesDot.borderWidth).equal('5px');
    expect(stylesDot.borderRadius).equal('50%');
    expect(stylesDot.transform).equal('matrix(0, 0, 0, 0, -5, -5)');
    expect(stylesDot.transition).equal('transform 0.28s ease 0s');
  });

  it('should change color when checked', async () => {
    await fixture(html`<${tag} checked="true"></${tag}>`);

    expect(await getBorderColor(CONST.RING_CLASS)).equal(
      CONST.RADIO_BUTTON_CHECKED_COLOR
    );
    expect(await getBorderColor(CONST.DOT_CLASS)).equal(
      CONST.RADIO_BUTTON_CHECKED_COLOR
    );
  });

  it('should scale up the inner dot when checked', async () => {
    const TRANSFORM_BEFORE = 'matrix(0, 0, 0, 0, -5, -5)';
    const TRANSFORM_AFTER = 'matrix(1, 0, 0, 1, -5, -5)';

    await defaultFixture();

    const button = await queryDeep(CONST.RADIO_BUTTON);
    const dot = await queryDeep(CONST.DOT_CLASS);

    function getDotTransform() {
      return window.getComputedStyle(dot).transform;
    }

    expect(getDotTransform()).equal(TRANSFORM_BEFORE);

    setTimeout(() => (button.checked = true));

    await oneEvent(dot, 'transitionend');
    expect(getDotTransform()).equal(TRANSFORM_AFTER);
  });

  it('should be stylable with ::part()', async () => {
    const RED = 'rgb(255, 0, 0)';
    const BLUE = 'rgb(0, 0, 255)';

    await fixture(html`<style>
        ::part(ring) {
          border-color: ${RED};
        }

        ::part(dot) {
          border-color: ${BLUE};
        }
      </style>
      <${tag}></${tag}>`);

    expect(await getBorderColor(CONST.RING_CLASS)).equal(RED);
    expect(await getBorderColor(CONST.DOT_CLASS)).equal(BLUE);
  });
});
