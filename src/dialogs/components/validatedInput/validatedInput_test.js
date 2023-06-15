import {expect, fixture, elementUpdated, unsafeStatic, html} from '@open-wc/testing';
import {VALIDATED_INPUT} from '../../../utils/testingHelpers/constants';
import {ValidatedInput} from './validatedInput';

describe('test LitElement ValidatedInput', () => {
  const tag = unsafeStatic(VALIDATED_INPUT);
  const defaultFixture = async () => fixture(html`<${tag}></${tag}>`);

  const colorFocused = 'rgb(66, 133, 244)'; // === #4285f4
  const colorError = 'rgb(213, 0, 0)'; // === #d50000
  const defaultValidationMessage = 'default validation message';

  function query(selector) {
    const el = document.querySelector(VALIDATED_INPUT);
    return el.shadowRoot.querySelector(selector);
  }

  function colorOfUnderline() {
    const underline = query('.underline--blue');
    return window.getComputedStyle(underline).backgroundColor;
  }

  function errorMessage() {
    return query('.validation-text').innerText;
  }

  function transformOrigin() {
    const underline = query('.underline--blue');
    return window.getComputedStyle(underline).transformOrigin;
  }

  function clickInput(el) {
    const input = el.getInputElement();
    input.dispatchEvent(new MouseEvent('mousedown'));
  }

  it('should be defined', async () => {
    const el = document.createElement(VALIDATED_INPUT);
    expect(el).exist;
    expect(el).instanceOf(ValidatedInput);
  });

  it('should render default html', async () => {
    const el = await defaultFixture();
    expect(el).shadowDom.equal(
      `
        <div class="box box--inline">
          <div class="content">
            <div class="content-flex">
              <div class="input-container">
                <input
                  autocomplete="off"
                  class="input-element"
                  id="input"
                  tabindex="0"
                  type="text"
                  value=""
                >
              </div>
              <div class="underline"></div>
              <div class="underline underline--blue"></div>
            </div>
          </div>
          <div class="validation-container">
            <div class="validation-text"></div>
          </div>
        </div>
        `
    );
  });

  it('should return input element when getInputElement() is called', async () => {
    const el = await defaultFixture();
    expect(el.getInputElement()).instanceOf(HTMLInputElement);
  });

  it('should return input value if getValue() is called', async () => {
    const el = await defaultFixture();
    const TEST_INPUT = 'test input';

    el.inputValue = TEST_INPUT;
    await elementUpdated;
    expect(el.getValue()).equal(TEST_INPUT);
  });

  it('should add and remove message when showValidationMessage() / removeValidationMessage() is called', async () => {
    const el = await defaultFixture();
    expect(errorMessage()).equal('');

    el.showValidationMessage();
    expect(errorMessage()).equal(defaultValidationMessage);

    el.removeValidationMessage();
    expect(errorMessage()).equal('');
  });

  it('should change background color of underline', async () => {
    const el = await defaultFixture();
    expect(colorOfUnderline()).equal(colorFocused);

    el.showValidationMessage();
    expect(colorOfUnderline()).equal(colorError);

    el.removeValidationMessage();
    expect(colorOfUnderline()).equal(colorFocused);
  });

  it('should transform origin underline by mouse click', async () => {
    const el = await defaultFixture();
    expect(transformOrigin()).equal('392px 1px');
    clickInput(el);
    expect(transformOrigin()).equal('-8px 1px');
  });

  it('should render with input value', async () => {
    const TEST_TEXT = 'my validation text';
    const el = await fixture(html`<${tag} .inputValue=${TEST_TEXT}></${tag}>`);
    expect(el.getValue()).equal(TEST_TEXT);
  });
});
