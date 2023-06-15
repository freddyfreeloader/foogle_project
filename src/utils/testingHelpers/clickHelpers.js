import {aTimeout} from '@open-wc/testing';
import {queryDeep} from '../shadowDomUtils/findElements/findElementsInShadowDOM';

export async function clickElementBySelector(selector) {
  const el = await queryDeep(selector);
  await aTimeout(20);
  el.click();
}

export async function clickElement(node) {
  if (node.shadowRoot) {
    await node.elementUpdated;
  }
  node.click();
}
