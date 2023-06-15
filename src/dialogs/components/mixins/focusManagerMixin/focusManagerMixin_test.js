import {
  defineCE,
  expect,
  fixture,
  unsafeStatic,
  aTimeout, html
} from '@open-wc/testing';

import {spy} from 'sinon';
import {LitElement} from 'lit';

import {FocusManagerMixin} from './focusManagerMixin';
import {
  getFocusedElement,
  queryDeep,
} from '../../../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';
import {
  dispatchTabFromFocusedElement,
  focusBySelector,
  simulateBrowserFocusManagement,
} from '../../../../utils/testingHelpers/focusHelpers';
import { ERROR_FOCUS_MANAGER } from '../../../../utils/testingHelpers/constants';

const focusMixin = defineCE(
  class extends FocusManagerMixin(LitElement) {
    static properties = {
      autoFocus: {type: Boolean},
      preselected: {type: Boolean},
      disableFirstBorder: {type: Boolean},
    };

    constructor() {
      super();
      this.autoFocus = false;
      this.preselected = false;
      this.disableFirstBorder = false;
    }

    firstUpdated() {
      if (this.autoFocus || this.preselected) {
        const secondButton = this.renderRoot.querySelector('#button2');
        this.handleFocus(
          this.preselected ? secondButton : null,
          this.autoFocus
        );
      }
    }
    focusBorder = (disableBorder) => {
      if (!disableBorder) {
        return html`<div
          id="first-border"
          class="js-focus-border"
          tabindex="0"
        ></div>`;
      }
    };

    render() {
      return html`
        <div class="out-of-border" tabindex="0"></div>
        ${this.focusBorder(this.disableFirstBorder)}
        <button id="button1" type="button" class="focusable">Button</button>
        <button id="button2" type="button" class="focusable">Button</button>
        <button id="button3" type="button" class="focusable">Button</button>
        <div id="last-border" class="js-focus-border" tabindex="0"></div>
        <div class="out-of-border" tabindex="0"></div>
      `;
    }
  }
);

const tag = unsafeStatic(focusMixin);

const defaultFixture = async () => fixture(html`<${tag}></${tag}>`)

async function customFixture(
  preselected,
  autoFocusElement,
  disableBorder = false
) {
  const el = await fixture(
    html`<${tag} ?preselected=${preselected} ?autoFocus=${autoFocusElement} ?disableFirstBorder=${disableBorder}></${tag}>`
  );
  await aTimeout(1);
  return el;
}

describe('FocusManagerMixin', () => {
  const BUTTON_1 = '#button1';
  const BUTTON_2 = '#button2';
  const BUTTON_3 = '#button3';
  const FIRST_BORDER = '#first-border';

  it('should render with default values', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
      <div class='out-of-border' tabindex="0"></div>
      <div id="first-border" class="js-focus-border" tabindex="0" ></div>
      <button type="button" class="focusable " id="button1" >Button</button>
      <button type="button" class="focusable " id="button2">Button</button>
      <button type="button" class="focusable " id="button3">Button</button>
      <div id="last-border" class="js-focus-border" tabindex="0" > </div>
      <div class="out-of-border" tabindex="0" ></div>
      `
    );
  });
  
  describe('test default focus behaviour', () => {
    beforeEach(async () => {
      await defaultFixture();
      simulateBrowserFocusManagement();
      await aTimeout(1);
    });

    it('should set focus on first border', async () => {
      expect(await getFocusedElement()).equal(await queryDeep(FIRST_BORDER));
    });

    it('should focus the first element when "Tab" is pressed', async () => {
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));
    });

    it('should forward focus from last onto first element by "Tab" (trap focus)', async () => {
      await focusBySelector(BUTTON_3);

      await aTimeout(1);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_3));

      await dispatchTabFromFocusedElement();
      await aTimeout(1);

      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));
    });

    it('should forward focus from first onto last element by "Shift+Tab" (trap focus)', async () => {
      await focusBySelector(BUTTON_1);
      await aTimeout(1);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));

      await dispatchTabFromFocusedElement(true);
      await aTimeout(1);

      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_3));
    });

    it('should move focus down the DOM by "Tab"', async () => {
      expect(await getFocusedElement()).equal(await queryDeep(FIRST_BORDER));
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_2));
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_3));
    });

    it('should move focus up the DOM by "ShiftTab"', async () => {
      await focusBySelector(BUTTON_3);
      await aTimeout(1);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_3));
      await dispatchTabFromFocusedElement(true);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_2));
      await dispatchTabFromFocusedElement(true);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));
    });
  });

  describe('test optional settings', () => {
    it('should focus the first button if autofocus is true', async () => {
      await customFixture(false, true);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_1));
    });

    it('should focus the second button if autofocus is true and firstElementToFocus is set', async () => {
      await customFixture(true, true);
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_2));
    });

    it('should NOT focus immediately the second button if autofocus is false and firstElementToFocus is set', async () => {
      await customFixture(true, false);
      expect(await getFocusedElement()).equal(await queryDeep(FIRST_BORDER));
    });

    it('should focus the second button if autofocus is false and firstElementToFocus is set after "Tab"', async () => {
      await customFixture(true, false);
      await dispatchTabFromFocusedElement();
      expect(await getFocusedElement()).equal(await queryDeep(BUTTON_2));
    });

    it('should log error if element has not two focus borders', async () => {
      console.error = spy();
      await customFixture(false, false, true);
      expect(console.error.calledWith(ERROR_FOCUS_MANAGER)).true;
    });
  });
});
