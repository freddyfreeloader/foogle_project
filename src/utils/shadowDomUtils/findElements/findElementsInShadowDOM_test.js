import {expect} from '@open-wc/testing';
import {html, LitElement} from 'lit';
import {
  findAllWebComponents,
  findInteractiveElements,
  getFocusedElement,
  queryDeep,
  queryDeepAll,
  queryDeepLast,
} from './findElementsInShadowDOM';

class InsideFirstParent1 extends LitElement {
  render() {
    return html`
      <div class="inside-inside1" tabindex="1">
        <slot></slot>
        <div class="nested-div"></div>
      </div>
      <button disabled></button>
    `;
  }
}
window.customElements.define('my-inside-first-parent1', InsideFirstParent1);

class InsideFirstParent2 extends LitElement {
  render() {
    return html`
      <div class="inside-inside2"><button></button></div>
      <div class="nested-div"></div>
    `;
  }
}
window.customElements.define('my-inside-first-parent2', InsideFirstParent2);

class FirstParent extends LitElement {
  render() {
    return html`
      <div class="first-parent" tabindex="0"></div>
      <button></button>
      <my-inside-first-parent1 class="inside-first1"
        ><button></button><input checked
      /></my-inside-first-parent1>
      <my-inside-first-parent2 class="inside-first2"></my-inside-first-parent2>
    `;
  }
}
window.customElements.define('my-first-parent', FirstParent);

class SecondParent extends LitElement {
  render() {
    return html`
      <div class="second-parent"></div>
      <button class="last-button"></button>
    `;
  }
}
window.customElements.define('my-second-parent', SecondParent);

describe('test cases for functions of findElementsInShadowDOM.js', () => {
  beforeEach(() => {
    const el = document.createElement('div');
    const firstParent = document.createElement('my-first-parent');
    const secondParent = document.createElement('my-second-parent');
    el.append(firstParent, secondParent);
    document.body.append(el);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should be rendered', async () => {
    const el = document.querySelector('div');

    expect(el).exist;
    expect(el.innerHTML).equal(
      `<my-first-parent></my-first-parent><my-second-parent></my-second-parent>`
    );
  });

  it('should find shadowHosts', async () => {
    const first = await queryDeep('my-first-parent');
    const second = await queryDeep('my-second-parent');
    const insideFirst1 = await queryDeep('my-inside-first-parent1');
    const insideFirst2 = await queryDeep('my-inside-first-parent2');
    expect(first).exist;
    expect(second).exist;
    expect(insideFirst1).exist;
    expect(insideFirst2).exist;
  });

  it('should find CSS classes', async () => {
    const first = await queryDeep('.first-parent');
    const second = await queryDeep('.second-parent');
    const insideFirst1 = await queryDeep('.inside-first1');
    const insideFirst2 = await queryDeep('.inside-first2');
    const insideinside1 = await queryDeep('.inside-inside1');
    const insideinside2 = await queryDeep('.inside-inside2');
    expect(first).exist;
    expect(second).exist;
    expect(insideFirst1).exist;
    expect(insideFirst2).exist;
    expect(insideinside1).exist;
    expect(insideinside2).exist;
  });

  it('should find buttons', async () => {
    const buttons = await queryDeepAll('button');
    expect(buttons.length).equal(5);
  });

  it('should find input', async () => {
    const input = await queryDeep('input');
    expect(input).exist;
  });

  it('should find element by attribute', async () => {
    const checkedInput = await queryDeep('[checked]');
    expect(checkedInput).exist;
    expect(checkedInput).instanceOf(HTMLInputElement);
  });

  it('should find focused element', async () => {
    const checkedInput = await queryDeep('[checked]');
    checkedInput.focus();
    const focusedElement = await getFocusedElement();
    expect(checkedInput).equal(focusedElement);
  });

  it('should find all interactive elements', async () => {
    const allInteractiveElements = await findInteractiveElements();
    expect(allInteractiveElements.length).equal(8);
  });

  it('should find element with descendant combinator selector within same shadowDOM', async () => {
    const nestedInside = await queryDeepAll('.nested-div');
    expect(nestedInside.length).equal(2);

    const descendant = await queryDeepAll('.inside-inside1 .nested-div');
    expect(descendant.length).equal(1);
  });

  it('should NOT find elements with descendant combinator selector across shadowHost borders', async () => {
    let el = await queryDeep('my-inside-first-parent1 .nested-div');
    expect(el).not.exist;

    el = await queryDeep('my-first-parent .nested-div');
    expect(el).not.exist;
  });

  it('should find all shadow hosts', async () => {
    const els = await findAllWebComponents();
    expect(els.length).equal(4);
  });

  it('should find elements only in provided root', async () => {
    let buttons = await queryDeepAll('button');
    expect(buttons.length).equal(5);

    const firstParent = await queryDeep('my-first-parent');
    buttons = await queryDeepAll('button', firstParent);
    expect(buttons.length).equal(4);
  });

  it('should find elements out of webComponent also', async () => {
    const buttonOutside = document.createElement('Button');
    document.body.append(buttonOutside);
    const queryButton = await queryDeepAll('button');
    expect(queryButton.length).equal(6);
  });

  it('should find last element', async () => {
    const lastButton = await queryDeepLast('button');
    expect(lastButton.classList.contains('last-button')).is.true;
  });
});
