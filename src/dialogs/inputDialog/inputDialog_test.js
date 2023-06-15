import {
  expect,
  fixture,
  waitUntil,
  aTimeout,
  unsafeStatic,
  html,
} from '@open-wc/testing';
import {spy} from 'sinon';

import {InputDialog} from './inputDialog';
import {
  findAllWebComponents,
  queryDeep,
} from '../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';
import {
  clickApplyButton,
  clickBackground,
  clickCancelButton,
  createParentNodeShortDuration,
} from '../../utils/testingHelpers/commonSetupsForDialogTesting';
import {
  EVENT_INPUT_CONFIRMED,
  INPUT_DIALOG,
  VALIDATED_INPUT,
  VALIDATED_INPUT_TEXT_CLASS,
} from '../../utils/testingHelpers/constants';

describe('test WebComponent InputDialog', () => {
  const tag = unsafeStatic(INPUT_DIALOG);

  const defaultFixture = async () => fixture(html`<${tag}></${tag}>`);

  const customFixtureWithShortTransitionDuration = async () => {
    const parentNode = createParentNodeShortDuration();
    const el = await fixture(html`<${tag}></${tag}>`, {parentNode});
    await findAllWebComponents();
    return el;
  };

  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).instanceOf(InputDialog);
  });

  it('should render with default values', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
        <my-modal-background class="js-background">
        <div aria-hidden="true" class="js-focus-border" tabindex="0" > </div>
        <my-dialog-container class="js-dialog-container">
          <div aria-level="1" class="heading-text" role="heading" slot="heading" > default heading </div>
          <my-validated-input class="js-validated-input" slot="content" > </my-validated-input>
          <div slot="footer">
            <my-dialog-button class="js-cancel-button" labeltext="default cancel" > </my-dialog-button>
            <my-dialog-button class="js-apply-button" labeltext="default apply" > </my-dialog-button>
          </div>
        </my-dialog-container>
        <div aria-hidden="true" class="js-focus-border" tabindex="0" >
        </div>
      </my-modal-background>
        `
    );
  });

  it('should render with custom values', async () => {
    const HEADING_TEXT = 'custom heading';
    const CANCEL_TEXT = 'custom cancel';
    const APPLY_TEXT = 'custom apply';
    const spyOnApply = spy();
    const saveFunction = () => spyOnApply();
    const VALIDATION_TEXT = 'custom validation';
    const INPUT_VALUE = 'input value';
    const validationPredicate = (value) => value === INPUT_VALUE;
    const spyOnSave = spy();
    const saveCallback = (value) => spyOnSave(value);

    const el = await fixture(html`<${tag}
      .headingText=${HEADING_TEXT}
      .cancelText=${CANCEL_TEXT}
      .applyText=${APPLY_TEXT}
      .saveFunction=${saveFunction}
      .inputValue=${INPUT_VALUE}
      .validationPredicate=${validationPredicate}
      .validationText=${VALIDATION_TEXT}
      .saveCallback=${saveCallback}
    ></${tag}>`);

    expect(el).shadowDom.equal(
      `
      <my-modal-background class="js-background">
        <div aria-hidden="true" class="js-focus-border" tabindex="0"></div>
        <my-dialog-container class="js-dialog-container">
          <div aria-level="1" class="heading-text" role="heading" slot="heading">${HEADING_TEXT}</div>
          <my-validated-input class="js-validated-input" slot="content" > </my-validated-input>
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

    expect(spyOnSave.called).true;
    expect(spyOnApply.called).true;
  });

  describe('test event dispatching', () => {
    let spyOnCustomEvent;

    beforeEach(async () => {
      spyOnCustomEvent = spy();
    });

    it('should dispatch event when dialog is applied', async () => {
      await defaultFixture();

      document.addEventListener(EVENT_INPUT_CONFIRMED, spyOnCustomEvent);
      await clickApplyButton();

      expect(spyOnCustomEvent.calledOnce).true;
      const value = spyOnCustomEvent.getCall(0).args[0];
      expect(value.detail.input).equal('');
    });

    it('should dispatch custom event with input value when dialog is applied', async function () {
      const INPUT_TEXT = 'inputText to check';
      await fixture(html`<${tag} .inputValue=${INPUT_TEXT}></${tag}>`);
      document.addEventListener(EVENT_INPUT_CONFIRMED, spyOnCustomEvent);
      await clickApplyButton();

      const value = spyOnCustomEvent.getCall(0).args[0];
      expect(value.detail.input).equal(INPUT_TEXT);
    });

    describe('dispatch "dialogClosed" event, dialog should be removed', () => {
      const predicate = (spy) => () => spy.calledOnce === true;
      const ERROR_LOG = 'Element should dispatch dialogClosed event';
      const TIMEOUT = {interval: 1, timeout: 100};
      const getDialog = () => document.querySelector(INPUT_DIALOG);

      beforeEach(async () => {
        await customFixtureWithShortTransitionDuration();
        await aTimeout(30);
        spyOnCustomEvent = spy();
        document.addEventListener('dialogClosed', spyOnCustomEvent);
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

  describe('test validation message', () => {
    let el;
    const VALIDATION_MESSAGE = 'my validation message';
    const textContainer = async () =>
      await queryDeep(VALIDATED_INPUT_TEXT_CLASS);
    const validationComponent = async () => await queryDeep(VALIDATED_INPUT);

    beforeEach(async () => {
      el = await defaultFixture();
      el.validationText = VALIDATION_MESSAGE;
    });

    it('should render validation input and textContainer', async () => {
      await clickApplyButton();
      expect(await validationComponent()).exist;
      expect(await textContainer()).exist;
    });

    it('should show validation message if predicate returns false', async () => {
      el.validationPredicate = () => false;
      await clickApplyButton();
      expect((await textContainer()).innerText).equal(VALIDATION_MESSAGE);
    });

    it('should NOT show validation message if predicate returns true', async () => {
      el.validationPredicate = () => true;
      await clickApplyButton();
      expect((await textContainer()).innerText).equal('');
    });
  });
});
