import {expect} from '@open-wc/testing';
import {spy} from 'sinon';
import {dispatchBubbelingCustomEvent} from './dispatchCustomEvent.js';

describe('test function dispatchBubbelingCustumEvent', () => {
  const testName = 'Josh';
  const testEventType = 'test';
  const testDetailObject = {name: testName};

  it('should dispatch event from element', async () => {
    const el = document.createElement('div');
    document.body.append(el);
    expect(el).exist;
    const eventSpy = spy();
    el.addEventListener(testEventType, eventSpy);

    const event = dispatchBubbelingCustomEvent.call(
      el,
      testEventType,
      testDetailObject
    );

    expect(event).instanceOf(CustomEvent);
    expect(event.target).equal(el);
    expect(event.type).equal(testEventType);
    expect(event.bubbles).true;
    expect(event.composed).true;
    expect(event.detail.name).equal(testName);
    expect(eventSpy.calledOnce).true;
    expect(eventSpy.getCall(0).args[0].detail.name).equal(testName);
  });

  it('should dispatch event from document', async () => {
    const eventSpy = spy();
    document.addEventListener(testEventType, eventSpy);

    const event = dispatchBubbelingCustomEvent(testEventType, testDetailObject);

    expect(event).instanceOf(CustomEvent);
    expect(event.target).equal(document);
    expect(event.type).equal(testEventType);
    expect(event.bubbles).true;
    expect(event.composed).true;
    expect(event.detail.name).equal(testName);
    expect(eventSpy.calledOnce).true;
    expect(eventSpy.getCall(0).args[0].detail.name).equal(testName);
  });
});
