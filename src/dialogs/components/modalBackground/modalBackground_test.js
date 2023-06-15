import {ModalBackground} from './modalBackground';

import {
  expect,
  elementUpdated,
  fixture,
  waitUntil,
  aTimeout,
  unsafeStatic,
  html,
} from '@open-wc/testing';
import {spy} from 'sinon';
import {dispatchBubbelingCustomEvent} from '../../../utils/eventHelpers/dispatchCustomEvent';
import * as CONST from '../../../utils/testingHelpers/constants';

const tag = unsafeStatic(CONST.MODAL_BACKGROUND);

const BACKGROUND_CLASS = 'grey-background';
const GREY = 'rgba(0, 0, 0, 0.6)';
const WHITE = 'rgba(0, 0, 0, 0)';
const RED = 'rgb(200, 0, 0)';

const getFixture = async (nofadeIn = false) =>
  fixture(html` <${tag} .nofadein="${nofadeIn}" ></${tag}>`);

const parentNode = document.createElement('div');
parentNode.setAttribute(
  'style',
  '--modal-background-transition: background-color 1ms cubic-bezier(0.4, 0, 0.2, 1);'
);

const createFixtureWithCustomTransition = async (nofadeIn = false) =>
  fixture(html`<${tag} .nofadein="${nofadeIn}"></${tag}> `, {parentNode});

const getMainClass = (el) =>
  el.renderRoot.querySelector(CONST.MODAL_BACKGROUND_MAIN_CLASS);

const backgroundClassIsActive = (el) => {
  return getMainClass(el).classList.contains(BACKGROUND_CLASS);
};

const color = (el) => {
  return window.getComputedStyle(getMainClass(el)).backgroundColor;
};

describe('test Lit Webelement modal-background', () => {
  it('should be defined', async () => {
    const el = await getFixture();
    expect(el).instanceof(ModalBackground);
  });

  it('should render default DOM', async () => {
    const el = await getFixture();
    expect(el).shadowDom.equal(
      `
        <div aria-hidden="true" class="modal">
           <slot></slot>
        </div>
        `
    );
  });

  it('should render default CSS and classes', async () => {
    const el = await getFixture();
    expect(backgroundClassIsActive(el)).false;
    expect(color(el)).equals(WHITE);
  });

  it('should fade out by "close" event', async () => {
    const el = await getFixture();
    await aTimeout(1);
    expect(backgroundClassIsActive(el)).true;
    dispatchBubbelingCustomEvent.call(el, 'close');
    expect(backgroundClassIsActive(el)).false;
  });

  // skipped, because test is slow with default values
  it.skip('background should fade in and fade out with default values(500ms)', async () => {
    const background = await getFixture();

    await waitUntil(
      () => color(background) === GREY,
      'background color did not changed',
      {interval: 100, timeout: 1000}
    );
    expect(backgroundClassIsActive(background)).to.be.true;

    const fadeOut = await background.fadeOut();
    expect(fadeOut).equals('fadedOut');
    await waitUntil(
      () => color(background) === WHITE,
      'background color did not changed',
      {interval: 100, timeout: 1000}
    );
    expect(backgroundClassIsActive(background)).is.false;
  });

  it('should fade in and fade out with custom transistion-duration', async () => {
    const el = await createFixtureWithCustomTransition();

    await waitUntil(
      () => color(el) === GREY,
      'background color did not changed',
      {interval: 2, timeout: 200}
    );
    expect(backgroundClassIsActive(el)).to.be.true;

    const res = await el.fadeOut();
    expect(res).to.equal(CONST.RESOLVE_TEXT_FADE_OUT);
    await waitUntil(
      () => color(el) === WHITE,
      'background color did not changed',
      {interval: 2, timeout: 200}
    );
    expect(backgroundClassIsActive(el)).is.false;
  });

  it('should color background immediately if nofadeIn is true', async () => {
    const background = await getFixture(true);

    expect(backgroundClassIsActive(background)).to.be.true;
    expect(color(background)).equals(GREY);
  });

  it('should prevent click events', async () => {
    document.body.innerHTML = `
            <div>
                <${CONST.MODAL_BACKGROUND}>
                    <button type="button">Click</button>
                </${CONST.MODAL_BACKGROUND}>
            </div>`;
    const el = document.querySelector(CONST.MODAL_BACKGROUND);
    await elementUpdated(el);

    const parent = document.querySelector('div');
    const button = parent.querySelector('button');
    const spyOnParent = spy();
    const spyOnBackground = spy();

    parent.addEventListener('click', spyOnParent);
    el.addEventListener('click', spyOnBackground);

    button.click();

    expect(spyOnParent.called).false;
    expect(spyOnBackground.called).true;
  });

  it('should be setable with customCssProperties', async () => {
    document.body.innerHTML = `
    <div>
        <style>
            * {
                --modal-background-color: ${RED};
            }
        </style>
        <${CONST.MODAL_BACKGROUND} nofadein=true"></${CONST.MODAL_BACKGROUND}>
    </div>`;
    const el = document.querySelector(CONST.MODAL_BACKGROUND);
    await elementUpdated(el);

    expect(color(el)).equal(RED);
  });
});
