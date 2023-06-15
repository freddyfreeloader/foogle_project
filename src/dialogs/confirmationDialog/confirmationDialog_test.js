import {
  aTimeout,
  expect,
  fixture,
  waitUntil,
  unsafeStatic,
  html,
} from '@open-wc/testing';

import {spy} from 'sinon';
import {ConfirmationDialog} from './confirmationDialog';
import {
  dispatchTabFromFocusedElement,
  simulateBrowserFocusManagement,
} from '../../utils/testingHelpers/focusHelpers';
import {
  getFocusedElement,
  queryDeep,
  queryDeepAll,
} from '../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';
import {
  clickBackground,
  clickApplyButton,
  clickCancelButton,
  createParentNodeShortDuration,
} from '../../utils/testingHelpers/commonSetupsForDialogTesting';
import {
  CONFIRMATION_DIALOG,
  EVENT_DIALOG_CLOSED,
  FOCUS_BORDER_CLASS,
} from '../../utils/testingHelpers/constants';

describe('test WebComponent ConfirmationDialog', () => {
  const tag = unsafeStatic(CONFIRMATION_DIALOG);

  const defaultFixture = async () => fixture(html`<${tag}></${tag}>`);

  const customFixtureWithShortTransitionDuration = async () => {
    const parentNode = createParentNodeShortDuration();
    return fixture(html`<${tag}></${tag}>`, {parentNode});
  };

  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).instanceOf(ConfirmationDialog);
  });

  it('should render with default values', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
        <my-modal-background class="js-background">
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
        <my-dialog-container class="js-dialog-container">
          <div aria-level="1" class="heading-text" role="heading" slot="heading">default heading</div>
          <div class="content" slot="content">default message text</div>
          <div slot="footer">
            <my-dialog-button class="js-cancel-button" labeltext="default cancel"></my-dialog-button>
            <my-dialog-button class="js-apply-button" labeltext="default apply"></my-dialog-button>
          </div>
        </my-dialog-container>
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
      </my-modal-background>
        `
    );
  });

  it('should render with custom values', async () => {
    const HEADING_TEXT = 'custom heading';
    const MESSAGE_TEXT = 'custom message';
    const CANCEL_TEXT = ' custom cancel';
    const APPLY_TEXT = 'custom apply';
    const spyOnSaveFunction = spy();
    const saveFunction = () => spyOnSaveFunction();

    const el = await fixture(html`
    <${tag}
      .headingText=${HEADING_TEXT}
      .messageText=${MESSAGE_TEXT}
      .cancelText=${CANCEL_TEXT}
      .applyText=${APPLY_TEXT}
      .saveFunction=${saveFunction}
       ></${tag}>`);

    expect(el).shadowDom.equal(
      `
      <my-modal-background class="js-background">
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
        <my-dialog-container class="js-dialog-container">
          <div aria-level="1" class="heading-text" role="heading" slot="heading">${HEADING_TEXT}</div>
          <div class="content" slot="content">${MESSAGE_TEXT}</div>
          <div slot="footer">
            <my-dialog-button class="js-cancel-button" labeltext="${CANCEL_TEXT}"></my-dialog-button>
            <my-dialog-button class="js-apply-button" labeltext="${APPLY_TEXT}"></my-dialog-button>
          </div>
        </my-dialog-container>
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
      </my-modal-background>
        `
    );

    await clickApplyButton();
    expect(spyOnSaveFunction.called).true;
  });

  describe('test event dispatching', () => {
    describe('dispatch "dialogClosed" event, dialog should be removed', () => {
      const predicate = (spy) => () => spy.calledOnce === true;
      const ERROR_LOG = 'Element should dispatch dialogClosed event';
      const TIMEOUT = {interval: 1, timeout: 100};
      const getDialog = () => document.querySelector(CONFIRMATION_DIALOG);
      let spyOnCustomEvent;

      beforeEach(async () => {
        await customFixtureWithShortTransitionDuration();
        await aTimeout(30);
        spyOnCustomEvent = spy();
        document.addEventListener(EVENT_DIALOG_CLOSED, spyOnCustomEvent);
        expect(getDialog()).exist;
      });

      it('should dispatch "dialogClosed" when dialog is canceled', async function () {
        setTimeout(async () => await clickCancelButton());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(getDialog()).not.exist;
      });

      it('should dispatch "dialogClosed"  when dialog is applied', async function () {
        setTimeout(async () => await clickApplyButton());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(getDialog()).not.exist;
      });

      it('should dispatch "dialogClosed"  when background is clicked', async function () {
        setTimeout(async () => await clickBackground());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(getDialog()).not.exist;
      });
    });
  });

  describe('test focus handling', () => {
    beforeEach(async () => {
      await defaultFixture();
      simulateBrowserFocusManagement();
      await aTimeout(1);
    });

    it('should focus first focus border', async () => {
      expect(await getFocusedElement()).equal(
        await queryDeep(FOCUS_BORDER_CLASS)
      );
    });

    it('should focus cancel button after first "Tab"', async () => {
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(
        (await queryDeepAll('.button'))[0]
      );
    });

    it('should focus cancel button after first "Shift+Tab"', async () => {
      await dispatchTabFromFocusedElement(true);
      expect(await getFocusedElement()).equal(
        (await queryDeepAll('.button'))[0]
      );
    });
  });
});
