import {DialogButton} from './dialogButton';
import {expect, fixture, unsafeStatic, html} from '@open-wc/testing';
import {spy} from 'sinon';
import * as CONST from '../../../utils/testingHelpers/constants';

const tag = unsafeStatic(CONST.DIALOG_BUTTON);

describe('test WebComponent DialogButton', () => {
  const getDefaultFixture = async () => await fixture(html`<${tag}></${tag}>`);

  it('should be defined', async () => {
    const el = await getDefaultFixture();
    expect(el).exist;
    expect(el).instanceOf(DialogButton);
  });

  it('should render default html', async () => {
    const el = await getDefaultFixture();
    expect(el).shadowDom.equal(
      `
            <div class="button" part="button" tabindex="0">
              <div class="highlight" part="highlight"></div>
              <div class="focused"></div>
              <span class="text" part="text"></span>
            </div>
            `
    );
  });

  it('should render with text', async () => {
    const testText = 'myLabelText';
    const el = await fixture(html`<${tag} .labelText=${testText}></${tag}>`);
    expect(el).shadowDom.equal(
      `
            <div class="button" part="button" tabindex="0">
              <div class="highlight" part="highlight"></div>
              <div class="focused"></div>
              <span class="text" part="text">${testText}</span>
            </div>
            `
    );
  });

  it('should return the button element', async () => {
    const el = await getDefaultFixture();
    const button = el.getButton();
    expect(button).exist;
    expect(button).instanceOf(HTMLElement);
  });

  it('should dispatch a click event when keyboard "Enter"', async () => {
    const el = await getDefaultFixture();
    const clickSpy = spy();
    document.addEventListener('click', clickSpy);
    const keyboardEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      composed: true,
    });
    el.getButton().dispatchEvent(keyboardEvent);
    expect(clickSpy.calledOnce).is.true;
  });
});
