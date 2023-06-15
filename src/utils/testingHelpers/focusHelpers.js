import {
  getFocusedElement,
  findInteractiveElements,
  queryDeep,
} from '../shadowDomUtils/findElements/findElementsInShadowDOM';
import {aTimeout} from '@open-wc/testing';

export async function simulateBrowserFocusManagement() {
  async function setFocus(e) {
    const focused = await getFocusedElement();
    // console.log('focused:', focused);
    const allInteractiveElements = await findInteractiveElements(document);
    // console.log('all interactive elements: ', allInteractiveElements);
    const indexFocused = allInteractiveElements.indexOf(focused);
    let elementToFocus;
    if (e.shiftKey) {
      elementToFocus = allInteractiveElements.findLast(
        (e) => allInteractiveElements.indexOf(e) < indexFocused && !e.disabled
      );
    } else {
      elementToFocus = allInteractiveElements.find(
        (e) => allInteractiveElements.indexOf(e) > indexFocused && !e.disabled
      );
    }
    // console.log('element to focus():', elementToFocus);
    elementToFocus?.focus();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      setFocus(e);
    }
  });
}

const tabEvent = (isShift = false) =>
  new KeyboardEvent('keydown', {
    key: 'Tab',
    shiftKey: isShift,
    bubbles: true,
    composed: true,
    cancelable: true,
  });

export async function dispatchTabFromFocusedElement(shiftTab = false) {
  const focusedElement = await getFocusedElement();
  focusedElement.dispatchEvent(tabEvent(shiftTab));
  await aTimeout(10);
}

export async function focusBySelector(selector) {
  const el = await queryDeep(selector);
  el.focus();
}
