import {expect, fixture, aTimeout, unsafeStatic, html} from '@open-wc/testing';
import * as CONST from '../../../utils/testingHelpers/constants';
import {RadioButtonLabel} from './radioButtonLabel';

describe('test LitElement RadioButtonLabel', () => {
  const tag = unsafeStatic(CONST.RADIO_BUTTON_LABEL);

  const defaultFixture = async () => fixture(html`<${tag}></${tag}>`);
  const checkedFixture = async () => fixture(html`<${tag} checked></${tag}>`);

  function getCompStyle(element) {
    return window.getComputedStyle(element);
  }
  function getSelectionIndicator(label) {
    return label.shadowRoot.querySelector(CONST.SELECTION_INDICATOR);
  }
  function getWrapper(label) {
    return label.shadowRoot.querySelector(
      CONST.RADIO_BUTTON_LABEL_WRAPPER_CLASS
    );
  }
  function getButton(label) {
    return label.shadowRoot.querySelector(CONST.RADIO_BUTTON);
  }

  const buttonSize = CONST.RADIO_BUTTON_LABEL_BUTTON_SIZE;

  it('should be defined', async () => {
    const el = await defaultFixture();
    expect(el).exist;
    expect(el).instanceOf(RadioButtonLabel);
  });

  it('should render default html', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
       <label class="label-container" id="0">
       <div
         aria-checked="false"
         aria-labelledby="0"
         aria-posinset="0"
         aria-setsize="0"
         class="radio-button-wrapper radio-button-wrapper-margin"
         role="radio"
         tabindex="-1">
         <${CONST.SELECTION_INDICATOR}></${CONST.SELECTION_INDICATOR}>
         <${CONST.RADIO_BUTTON}></${CONST.RADIO_BUTTON}>
       </div>
     </label>`
    );
  });

  it('should render with text and checked', async () => {
    const el = await fixture(
      html`<${tag} .text=${'myText'} .checked=${true} ></${tag}>`
    );
    expect(el).shadowDom.equal(
      `
       <label class="label-container" id="0">
       <div
         aria-checked="true"
         aria-labelledby="0"
         aria-posinset="0"
         aria-setsize="0"
         class="checked-state grey-selection radio-button-wrapper radio-button-wrapper-margin"
         role="radio"
         tabindex="0">
         <${CONST.SELECTION_INDICATOR}></${CONST.SELECTION_INDICATOR}>
         <${CONST.RADIO_BUTTON} checked></${CONST.RADIO_BUTTON}>
       </div>
       myText
     </label>`
    );
  });

  describe('test CSS', () => {
    it('should render with default CSS', async () => {
      const el = await defaultFixture();
      expect(getCompStyle(getWrapper(el)).height).equal(buttonSize);
      expect(getCompStyle(getWrapper(el)).width).equal(buttonSize);
      expect(getCompStyle(getSelectionIndicator(el)).backgroundColor).equal(
        CONST.SELECTION_INDICATOR_COLOR_UNCHECKED
      );
    });

    it('should render alternative color of selectionIndicator if label is checked', async () => {
      const el = await checkedFixture();
      expect(getCompStyle(getSelectionIndicator(el)).backgroundColor).equal(
        CONST.SELECTION_INDICATOR_COLOR_CHECKED
      );
    });
  });

  it('should be focusable if checked', async () => {
    const el = await checkedFixture();
    expect(getWrapper(el).tabIndex).equal(0);
  });

  describe('test propagation of state', () => {
    it('should propagate checked state to radioButton', async () => {
      const el = await checkedFixture();
      expect(getButton(el).checked).is.true;
    });

    it('should propagate pulse state to selectionIndicator', async () => {
      const el = await fixture(html`<${tag} .pulse=${true}></${tag}>`);
      expect(getSelectionIndicator(el).classList.value).contain('focused');
    });

    it('should propagate mousedown state to selectionIndicator', async () => {
      const el = await fixture(html`<${tag} .mouseDown=${true}></${tag}>`);
      expect(getSelectionIndicator(el).classList.value).contain('mousedown');
    });
  });

  describe('test changing mouseDown prop by mouse event', () => {
    let el;
    const DOWN = 'mousedown';
    const UP = 'mouseup';
    const LEAVE = 'mouseleave';

    beforeEach(async () => {
      el = await defaultFixture();
    });

    function mouseEvent(eventType) {
      getButton(el).dispatchEvent(new MouseEvent(eventType, {bubbles: true}));
    }

    it('should change to true by mousedown', async () => {
      mouseEvent(DOWN);
      expect(el.mouseDown).is.true;
    });

    it('should change to false by mouseup after 300ms', async () => {
      mouseEvent(DOWN);
      expect(el.mouseDown).is.true;

      mouseEvent(UP);
      await aTimeout(150);
      expect(el.mouseDown).is.true;

      await aTimeout(150);
      expect(el.mouseDown).is.false;
    });

    it('should change to false by mouseleave', async () => {
      mouseEvent(DOWN);
      expect(el.mouseDown).is.true;

      mouseEvent(LEAVE);
      expect(el.mouseDown).is.false;
    });
  });
});
