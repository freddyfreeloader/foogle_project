import {aTimeout} from '@open-wc/testing';
import {queryDeep} from '../shadowDomUtils/findElements/findElementsInShadowDOM';
import { MODAL_BACKGROUND, APPLY_BUTTON_CLASS , CANCEL_BUTTON_CLASS} from './constants';

export function createParentNodeShortDuration() {
  const parentNode = document.createElement('div');
  const style = document.createElement('style');
  style.innerText = `
    * {
            --modal-background-transition: background-color 1ms
              cubic-bezier(0.4, 0, 0.2, 1);
            --dialog-container-slide-out-transition: all 1ms
              cubic-bezier(0.4, 0, 0.2, 1);
            --dialog-container-slide-in-transition: transform 1ms
                cubic-bezier(0, 0, 0.2, 1),
              , translate 1ms cubic-bezier(0, 0, 0.2, 1);
            --validated-input-animation-duration-blur: 1ms;
            --validated-input-animation-duration-grow: 1ms;
            --dialog-button-hover-in-out-transition: opacity 1ms linear,
              background-color 1ms linear;
            --dialog-button-click-release-transition: opacity 1ms linear;
            --dialog-button-click-and-focus-in-transition-duration: 1ms;
          }`;
  parentNode.append(style);
  return parentNode;
}

export async function clickBackground() {
  const background = await queryDeep(MODAL_BACKGROUND)
  await aTimeout(1);
  background.click();
}

export async function clickApplyButton() {
  await clickButton(APPLY_BUTTON_CLASS);
}

export async function clickCancelButton() {
  await clickButton(CANCEL_BUTTON_CLASS);
}

export async function clickButton(selector) {
  const button = (await queryDeep(selector)).getButton();
  await aTimeout(1);
  button.click();
}
