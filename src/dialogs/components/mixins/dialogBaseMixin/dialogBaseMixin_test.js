import {
  defineCE,
  expect,
  fixture,
  unsafeStatic,
  waitUntil,
  html,
} from '@open-wc/testing';

import {spy} from 'sinon';
import {LitElement} from 'lit';

import {DialogBaseMixin} from './dialogBaseMixin';
import {
  clickApplyButton,
  clickBackground,
  clickCancelButton,
  createParentNodeShortDuration,
} from '../../../../utils/testingHelpers/commonSetupsForDialogTesting';
import {queryDeep} from '../../../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';
import * as CONST from '../../../../utils/testingHelpers/constants';
import {clickElementBySelector} from '../../../../utils/testingHelpers/clickHelpers';

const tagName = defineCE(
  class extends DialogBaseMixin(LitElement) {
    render() {
      return this.renderDialog();
    }
  }
);

const tag = unsafeStatic(tagName);

async function defaultFixture() {
  return fixture(html`<${tag}></${tag}>`);
}

const mixin = tagName;

const getShortDurationFixture = async () => {
  const parentNode = createParentNodeShortDuration();
  await fixture(html`<${tag}></${tag}>`, {parentNode});
  const dialog = document.querySelector(mixin);
  return dialog;
};

const isGrey = async () => {
  const background = await queryDeep(CONST.MODAL_BACKGROUND_MAIN_CLASS);
  return (
    window.getComputedStyle(background).backgroundColor ===
    CONST.DEFAULT_BACKGROUND_COLOR
  );
};

describe('Lit WebComponent: DialogBaseMixin', () => {
  it('should render with default values', async () => {
    const dialog = await defaultFixture();
    expect(dialog).shadowDom.equal(
      `
    <${CONST.MODAL_BACKGROUND} class="js-background">
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
        <${CONST.DIALOG_CONTAINER} class="js-dialog-container">
            <div aria-level="1" class="heading-text" role="heading" slot="heading">default heading</div>
            <div class="content" slot="content">default message text</div>
            <div slot="footer">
                <${CONST.DIALOG_BUTTON} class="js-cancel-button" labeltext="default cancel"></${CONST.DIALOG_BUTTON}>
                <${CONST.DIALOG_BUTTON} class="js-apply-button" labeltext="default apply"></${CONST.DIALOG_BUTTON}>
            </div>
        </${CONST.DIALOG_CONTAINER}>
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
    </${CONST.MODAL_BACKGROUND}>
    `
    );
  });

  it('should render with custom properties', async () => {
    const HEADER = 'custom heading';
    const CANCEL = 'custom cancel';
    const APPLY = 'custom apply';
    const MESSAGE = 'custom message';

    const dialog = await fixture(html`
            <${tag} headingText=${HEADER} messageText= ${MESSAGE} cancelText=${CANCEL}
                          applyText=${APPLY}></${tag}>
        `);

    expect(dialog).shadowDom.equal(
      `
      <${CONST.MODAL_BACKGROUND} class="js-background">
       <div aria-hidden="true" class="js-focus-border" tabindex="0" > </div>
       <${CONST.DIALOG_CONTAINER} class="js-dialog-container">
         <div aria-level="1" class="heading-text" role="heading" slot="heading" >${HEADER}</div>
         <div class="content" slot="content">${MESSAGE}</div>
         <div slot="footer">
           <${CONST.DIALOG_BUTTON} class="js-cancel-button" labeltext="${CANCEL}"></${CONST.DIALOG_BUTTON}>
           <${CONST.DIALOG_BUTTON} class="js-apply-button" labeltext="${APPLY}"></${CONST.DIALOG_BUTTON}>
         </div>
       </${CONST.DIALOG_CONTAINER}>
       <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
      </${CONST.MODAL_BACKGROUND}>
      `
    );
  });

  const clickTestSetup = async () => {
    const dialog = await getShortDurationFixture();

    await waitUntil(async () => await isGrey(), 'background is not ready', {
      interval: 2,
      timeout: 100,
    });
    const spyOnCloseDialog = spy(dialog, 'closeDialog');
    const spyOnIsValidEventForClose = spy(dialog, 'isValidEventForClose');
    const spyOnApply = spy(dialog, 'apply');

    return {dialog, spyOnCloseDialog, spyOnIsValidEventForClose, spyOnApply};
  };

  const clickExpectation = async (
    spyOnCloseDialog,
    spyOnIsValidEventForClose,
    resultIsClosed
  ) => {
    expect(spyOnCloseDialog.calledOnce).true;
    expect(spyOnIsValidEventForClose.calledOnce).true;
    expect(resultIsClosed).equals(CONST.RESOLVE_TEXT_ISCLOSED);

    const resultSpyCloseFunction = await spyOnCloseDialog.returnValues[0];
    expect(resultSpyCloseFunction[0]).equals(CONST.RESOLVE_TEXT_SLIDE_OUT);
    expect(resultSpyCloseFunction[1]).equals(CONST.RESOLVE_TEXT_FADE_OUT);
    expect(spyOnIsValidEventForClose.returned(true)).true;
  };

  it('should remove oneself by click on cancel button', async () => {
    const {dialog, spyOnCloseDialog, spyOnIsValidEventForClose} =
      await clickTestSetup();

    setTimeout(async () => await clickCancelButton());
    const resultIsClosed = await dialog.isClosed();

    expect(document.querySelector(mixin)).not.exist;
    await clickExpectation(
      spyOnCloseDialog,
      spyOnIsValidEventForClose,
      resultIsClosed
    );
  });

  it('should remove oneself by click on background', async () => {
    const {dialog, spyOnCloseDialog, spyOnIsValidEventForClose} =
      await clickTestSetup();

    setTimeout(async () => await clickBackground());
    const resultIsClosed = await dialog.isClosed();

    expect(document.querySelector(mixin)).not.exist;
    await clickExpectation(
      spyOnCloseDialog,
      spyOnIsValidEventForClose,
      resultIsClosed
    );
  });

  it('should remove oneself by click on apply button', async () => {
    const {dialog, spyOnCloseDialog, spyOnIsValidEventForClose} =
      await clickTestSetup();

    setTimeout(async () => await clickApplyButton());
    const resultIsClosed = await dialog.isClosed();

    expect(document.querySelector(mixin)).not.exist;

    await clickExpectation(
      spyOnCloseDialog,
      spyOnIsValidEventForClose,
      resultIsClosed
    );
  });

  it('should NOT remove oneself by click on other dialog content', async () => {
    const {spyOnCloseDialog, spyOnIsValidEventForClose} =
      await clickTestSetup();

    await clickElementBySelector(CONST.FOCUS_BORDER_CLASS);
    await clickElementBySelector(CONST.HEADING_TEXT_CLASS);
    await clickElementBySelector(CONST.CONTENT_CLASS);
    await clickElementBySelector(CONST.DIALOG_CONTAINER_CLASS);

    expect(document.querySelector(mixin)).exist;
    expect(spyOnIsValidEventForClose.callCount).equal(4);
    expect(spyOnCloseDialog.callCount).equal(4);

    expect(spyOnIsValidEventForClose.alwaysReturned(false)).true;

    const returnValues = spyOnCloseDialog.returnValues;
    for (let i; i <= returnValues.length; i++) {
      const res = await spyOnCloseDialog.returnValues[i];
      expect(res).to.equal(CONST.RESOLVE_TEXT_CLOSE_DIALOG_FAIL);
    }
  });

  it('should call apply() if apply button is clicked', async () => {
    const {spyOnApply} = await clickTestSetup();
    await clickApplyButton();
    expect(spyOnApply.calledOnce).true;
  });

  it('should call saveFunction() if apply button is clicked', async () => {
    const {dialog} = await clickTestSetup();

    dialog.saveFunction = spy();
    await clickApplyButton();

    expect(dialog.saveFunction.calledOnce).true;
  });

  const dispatchEventSetup = async (target) => {
    const {dialog} = await clickTestSetup();

    const callback = spy();
    document.addEventListener(CONST.EVENT_DIALOG_CLOSED, callback);

    await clickElementBySelector(target);
    await dialog.isClosed();

    expect(callback.calledOnce).true;
  };

  it('should dispatch custom event if dialog is closed by apply button click', async () => {
    await dispatchEventSetup(CONST.APPLY_BUTTON_CLASS);
  });

  it('should dispatch custom event if dialog is closed by cancel button click', async () => {
    await dispatchEventSetup(CONST.CANCEL_BUTTON_CLASS);
  });

  it('should dispatch custom event if dialog is closed by background click', async () => {
    await dispatchEventSetup(CONST.MODAL_BACKGROUND);
  });
});
