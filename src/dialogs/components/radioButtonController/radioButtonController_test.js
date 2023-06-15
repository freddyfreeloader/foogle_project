import {elementUpdated, expect, fixture, unsafeStatic, html} from '@open-wc/testing';
import {spy} from 'sinon';
import {RadioButtonController} from './radioButtonController';
import * as CONST from '../../../utils/testingHelpers/constants';
import {queryDeepAll} from '../../../utils/shadowDomUtils/findElements/findElementsInShadowDOM';

describe('test LitElement RadioButtonController', () => {
  const tag = unsafeStatic(CONST.RADIO_BUTTON_CONTROLLER);

  const options = [
    {id: 'firstId', text: 'firstOption'},
    {id: 'secondId', text: 'secondOption'},
    {id: 'thirdId', text: 'thirdOption'},
  ];

  async function label(index) {
    return (await queryDeepAll(CONST.RADIO_BUTTON_LABEL))[index];
  }

  const UP = 'Up';
  const DOWN = 'Down';
  const RIGHT = 'Right';
  const LEFT = 'Left';

  function move(direction) {
    const dir = 'Arrow' + direction;
    const el = document.querySelector(CONST.RADIO_BUTTON_CONTROLLER);
    el.dispatchEvent(new KeyboardEvent('keydown', {key: dir}));
  }

  const fixtureWithOptions = async () =>
    fixture(html`<${tag} .options=${options} ></${tag}>`);

  it('should be defined', async () => {
    const el = document.createElement(CONST.RADIO_BUTTON_CONTROLLER);
    expect(el).exist;
    expect(el).instanceOf(RadioButtonController);
  });

  it('should render with default html', async () => {
    const el = await fixture(html`<${tag}></${tag}>`);
    expect(el).shadowDom.equal(
      `<div class="oJeWuf" role="presentation"></div>`
    );
  });

  it('should render with option array', async () => {
    const el = await fixtureWithOptions();
    expect(el).shadowDom.equal(
      `
        <div class="oJeWuf" role="presentation">
          <${CONST.RADIO_BUTTON_LABEL} checked=""></${CONST.RADIO_BUTTON_LABEL}>
          <${CONST.RADIO_BUTTON_LABEL}></${CONST.RADIO_BUTTON_LABEL}>
          <${CONST.RADIO_BUTTON_LABEL}></${CONST.RADIO_BUTTON_LABEL}>
        </div>`
    );
  });

  it('should check the first item', async () => {
    await fixtureWithOptions();
    expect((await label(0)).checked).is.true;
  });

  it('should check the preselected item', async () => {
    await fixture(
      html`<${tag} .options=${options} .selectedRadio=${options[2].id} ></${tag}>`
    );
    expect((await label(0)).checked).is.false;
    expect((await label(1)).checked).is.false;
    expect((await label(2)).checked).is.true;
  });

  it('should log an error if preselected option is not a valid id', async () => {
    console.error = spy();
    await fixture(
      html`<${tag} .options=${options} .selectedRadio=${'invalid value'} ></${tag}>`
    );
    expect(console.error.called).true;
    expect(console.error.calledWith(CONST.ERROR_RADIO_BUTTON_CONTROLLER)).true;
  });

  it('should select button by click', async () => {
    await fixtureWithOptions();
    (await label(1)).click();
    expect((await label(0)).checked).is.false;
    expect((await label(1)).checked).is.true;
    expect((await label(2)).checked).is.false;
  });

  it('should select button by arrow key "Down"', async () => {
    await fixtureWithOptions();
    move(DOWN);
    expect((await label(0)).checked).is.false;
    expect((await label(1)).checked).is.true;
    expect((await label(2)).checked).is.false;
  });

  it('should switch buttons by keyboard arrow keys', async () => {
    await fixtureWithOptions();

    expect((await label(0)).checked).is.true;

    move(DOWN);
    expect((await label(1)).checked).is.true;
    await elementUpdated;

    move(UP);
    expect((await label(0)).checked).is.true;
    await elementUpdated;

    move(UP);
    expect((await label(2)).checked).is.true;
    await elementUpdated;

    move(DOWN);
    expect((await label(0)).checked).is.true;
    await elementUpdated;

    move(RIGHT);
    expect((await label(1)).checked).is.true;
    await elementUpdated;

    move(LEFT);
    expect((await label(0)).checked).is.true;
  });

  it('should ignore other keys', async () => {
    const el = await fixtureWithOptions();

    el.dispatchEvent(new KeyboardEvent('keydown', {key: 'P'}));
    expect((await label(0)).checked).is.true;
  });

  it('should return the selected option', async () => {
    const el = await fixtureWithOptions();
    expect(el.selectedOption()).equals(options[0].id);

    move(DOWN);
    await elementUpdated;

    expect(el.selectedOption()).equals(options[1].id);
  });
});
