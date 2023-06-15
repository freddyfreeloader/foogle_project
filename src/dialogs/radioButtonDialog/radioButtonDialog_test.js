import {
  aTimeout,
  expect,
  fixture,
  waitUntil,
  unsafeStatic,
  html,
} from '@open-wc/testing';

import {spy} from 'sinon';
import {nothing} from 'lit';

import {RadioButtonDialog} from './radioButtonDialog';
import {
  getFocusedElement,
  queryDeepAll,
} from '../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';

import {
  simulateBrowserFocusManagement,
  dispatchTabFromFocusedElement,
} from '../../utils/testingHelpers/focusHelpers';
import {
  clickBackground,
  clickApplyButton,
  clickCancelButton,
  createParentNodeShortDuration,
} from '../../utils/testingHelpers/commonSetupsForDialogTesting';
import {
  BUTTON_CLASS,
  EVENT_DIALOG_CLOSED,
  EVENT_RADIODIALOG_CLOSED_WITH_APPLY,
  RADIOBUTTON_DIALOG,
  RADIO_BUTTON_CONTROLLER,
  RADIO_BUTTON_LABEL_WRAPPER_CLASS,
} from '../../utils/testingHelpers/constants';

describe('test WebComponent RadioButtonDialog', () => {
  const tag = unsafeStatic(RADIOBUTTON_DIALOG);

  const defaultFixture = async () => fixture(html`<${tag}></${tag}>`);

  const fixtureWithShortTransitionDuration = async () => {
    const parentNode = createParentNodeShortDuration();
    return fixture(html`<${tag}></${tag}>`, {parentNode});
  };

  const getCustomFixture = async (
    options,
    headingText,
    messageText,
    applyText,
    cancelText,
    preselectedOption
  ) =>
    fixture(html`
    <${tag}
        .options=${options}
        .headingText=${headingText || nothing}
        .messageText=${messageText || nothing}
        .applyText=${applyText || nothing}
        .cancelText=${cancelText || nothing}
        .preselected=${preselectedOption}
      ></${tag}>`);

  async function radioButtons() {
    return await queryDeepAll(RADIO_BUTTON_LABEL_WRAPPER_CLASS);
  }
  async function dialogButtons() {
    return await queryDeepAll(BUTTON_CLASS);
  }

  const OPTIONS = [
    {id: 'firstId', text: 'firstLabel'},
    {id: 'secondId', text: 'secondLabel'},
    {id: 'thirdId', text: 'thirdLabel'},
  ];

  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).instanceOf(RadioButtonDialog);
  });

  it('should render with default values', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
        <my-modal-background class="js-background">
         <div aria-hidden="true" class="js-focus-border" tabindex="0" > </div>
        <my-dialog-container class="js-dialog-container">
          <div aria-level="1" class="heading-text" role="heading" slot="heading" > default heading </div>
          <div slot="content">
            <div class="radio-manager-wrapper">
              default message text
              <my-radio-button-controller class="radio-manager" role="radiogroup" > </my-radio-button-controller>
            </div>
          </div>
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

  it('shoud render with custom values', async () => {
    const HEADING_TEXT = 'custom heading';
    const MESSAGE_TEXT = 'custom message';
    const APPLY_TEXT = 'custom apply';
    const CANCEL_TEXT = 'custom cancel';

    const el = await getCustomFixture(
      OPTIONS,
      HEADING_TEXT,
      MESSAGE_TEXT,
      APPLY_TEXT,
      CANCEL_TEXT
    );

    expect(el).shadowDom.equal(
      `
    <my-modal-background class="js-background">
      <div aria-hidden="true" class="js-focus-border" tabindex="0" > </div>
      <my-dialog-container class="js-dialog-container">
        <div aria-level="1" class="heading-text" role="heading" slot="heading" >${HEADING_TEXT}</div>
        <div slot="content">
         <div class="radio-manager-wrapper">${MESSAGE_TEXT}
          <my-radio-button-controller class="radio-manager" role="radiogroup" > </my-radio-button-controller>
          </div>
        </div>
        <div slot="footer">
          <my-dialog-button class="js-cancel-button" labeltext="${CANCEL_TEXT}" > </my-dialog-button>
          <my-dialog-button class="js-apply-button" labeltext="${APPLY_TEXT}" > </my-dialog-button>
        </div>
      </my-dialog-container>
      <div aria-hidden="true" class="js-focus-border" tabindex="0" > </div>
    </my-modal-background>
    `
    );

    const controller = el.shadowRoot.querySelector(RADIO_BUTTON_CONTROLLER);
    expect(controller.options).equal(OPTIONS);
  });

  describe('test event dispatching', () => {
    it('should dispatch radioDialogClosedWithApply with first option id when apply button is clicked', async () => {
      await getCustomFixture(OPTIONS);
      const spyOnApply = spy();
      document.addEventListener(
        EVENT_RADIODIALOG_CLOSED_WITH_APPLY,
        spyOnApply
      );
      await clickApplyButton();

      expect(spyOnApply.called).true;

      const event = spyOnApply.getCall(0).args[0];
      expect(event.detail.option).equal(OPTIONS[0].id);
    });

    describe('dispatch "dialogClosed", dialog should be removed', () => {
      let spyOnCustomEvent;
      const predicate = (spyOnCustomEvent) => () =>
        spyOnCustomEvent.calledOnce === true;
      const ERROR_LOG = 'Element should dispatch "dialogClosed" event';
      const TIMEOUT = {interval: 1, timeout: 100};
      const dialog = () => document.querySelector(RADIOBUTTON_DIALOG);

      function getSpyOnClosed() {
        const spyOnClosed = spy();
        document.addEventListener(EVENT_DIALOG_CLOSED, spyOnClosed);
        return spyOnClosed;
      }

      beforeEach(async () => {
        await fixtureWithShortTransitionDuration();
        await aTimeout(30);
        spyOnCustomEvent = getSpyOnClosed();
        expect(dialog()).exist;
      });

      it('should dispatch "dialogClosed" when apply button is clicked', async () => {
        setTimeout(async () => await clickApplyButton());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(dialog()).not.exist;
      });

      it('should dispatch "dialogClosed" when cancel button is clicked', async () => {
        setTimeout(async () => await clickCancelButton());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(dialog()).not.exist;
      });

      it('should dispatch "dialogClosed" when background is clicked', async () => {
        setTimeout(async () => await clickBackground());
        await waitUntil(predicate(spyOnCustomEvent), ERROR_LOG, TIMEOUT);
        expect(dialog()).not.exist;
      });
    });
  });

  async function isFocused(element) {
    const focused = await getFocusedElement();
    expect(focused).equal(element);
  }

  async function radioIsFocused(index) {
    await isFocused((await radioButtons())[index]);
  }

  async function dialogButtonIsFocused(index) {
    await isFocused((await dialogButtons())[index]);
  }

  it('should focus preselected radiobutton ', async () => {
    await getCustomFixture(OPTIONS, '', '', '', '', OPTIONS[2].id);
    await aTimeout(1);
    await radioIsFocused(2);
  });

  describe('test focus handling', () => {
    beforeEach(async () => {
      await getCustomFixture(OPTIONS);
      await aTimeout(1);
      simulateBrowserFocusManagement();
    });

    it('should set focus on first radio button', async () => {
      await radioIsFocused(0);
    });

    it('should focus cancel button when "Tab" is pressed', async () => {
      await dispatchTabFromFocusedElement();
      await dialogButtonIsFocused(0);
    });

    it('should focus apply button  when "Shift+Tab" is pressed', async () => {
      await dispatchTabFromFocusedElement(true);
      await dialogButtonIsFocused(1);
    });

    it('should trap focus', async () => {
      // test "Tab"
      await dispatchTabFromFocusedElement();
      await dialogButtonIsFocused(0);

      await dispatchTabFromFocusedElement();
      await dialogButtonIsFocused(1);

      await dispatchTabFromFocusedElement();
      await radioIsFocused(0);

      //test "Shift+Tab"
      await dispatchTabFromFocusedElement(true);
      await dialogButtonIsFocused(1);

      await dispatchTabFromFocusedElement(true);
      await dialogButtonIsFocused(0);

      await dispatchTabFromFocusedElement(true);
      await radioIsFocused(0);
    });
  });
});
