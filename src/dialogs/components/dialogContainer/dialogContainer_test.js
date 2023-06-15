import {expect, fixture, aTimeout, waitUntil, unsafeStatic, html} from '@open-wc/testing';
import {createParentNodeShortDuration} from '../../../utils/testingHelpers/commonSetupsForDialogTesting';
import * as CONST from '../../../utils/testingHelpers/constants';

import {DialogContainer} from './dialogContainer';

const tag = unsafeStatic(CONST.DIALOG_CONTAINER);

const defaultFixture = async () =>
  await fixture(html`<${tag}></${tag}>`);

const fastFixture = async () => {
  const parentNode = createParentNodeShortDuration();
  await fixture(html`<${tag}></${tag}>`, {
    parentNode,
  });
  return document.querySelector(CONST.DIALOG_CONTAINER);
};

describe('test WebComponenet DialogContainer', function () {
  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).is.instanceOf(DialogContainer);
  });

  it('should render with default html', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
        <div class="container" id="dialog">
          <div class="center-vertically-box"></div>
          <div class="dialog dialog-size" role="dialog">
            <div class="heading-container">
              <slot name="heading"></slot>
            </div>
            <span class="content-container">
              <slot name="content"></slot>
            </span>
            <div class="footer-container">
              <slot name="footer"></slot>
            </div>
          </div>
          <div class="center-vertically-box"></div>
        </div>
        `
    );
  });

  it('should return a resolved promise by calling slideOut()', async function () {
    const el = await fastFixture();
    await aTimeout(10);
    await waitUntil(
      async () => (
        (await el.slideOut()) === CONST.RESOLVE_TEXT_SLIDE_OUT,
        'could not resolve',
        {interval: 5, timeout: 100}
      )
    );
  });
});
