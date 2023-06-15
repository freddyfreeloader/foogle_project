import {getNextItem} from './getNextItem.js';
import {expect} from '@open-wc/testing';

describe('getNextItem function', () => {
  const options = document.createElement('div');
  options.innerHTML = `
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
  `;
  const currentOption = options.querySelector('button:nth-child(2)');

  function createEvent(key) {
    return new KeyboardEvent('keydown', {key: key});
  }

  it('should return the next option when arrow down key is pressed', () => {
    const nextOption = getNextItem(
      createEvent('ArrowDown'),
      options.children,
      currentOption
    );
    expect(nextOption).equal(options.children[2]);
  });

  it('should return the previous option when arrow up key is pressed', () => {
    const nextOption = getNextItem(
      createEvent('ArrowUp'),
      options.children,
      currentOption
    );
    expect(nextOption).equal(options.children[0]);
  });

  it('should return undefined if no arrow key is pressed', () => {
    const nextOption = getNextItem(
      createEvent('Enter'),
      options.children,
      currentOption
    );
    expect(nextOption).not.exist;
  });

  it('should return undefined if no options are provided', () => {
    const nextOption = getNextItem(createEvent('ArrowDown'), [], currentOption);
    expect(nextOption).not.exist;
  });

  it('should return undefined if currentOption is not provided', () => {
    const nextOption = getNextItem(
      createEvent('ArrowUp'),
      options.children,
      undefined
    );
    expect(nextOption).not.exist;
  });

  it('getNextItem returns correct item at beginning of array when arrow up key is pressed', () => {
    const options = ['a', 'b', 'c'];
    const currentOption = options[0];
    expect(getNextItem(createEvent('ArrowUp'), options, currentOption)).equal(
      'c'
    );
  });

  it('getNextItem returns correct item at end of array when arrow down key is pressed', () => {
    const options = ['a', 'b', 'c'];
    const currentOption = options[2];
    expect(getNextItem(createEvent('ArrowDown'), options, currentOption)).equal(
      'a'
    );
  });

  it('getNextItem returns undefined when empty array is passed in', () => {
    const options = [];
    const currentOption = undefined;
    expect(getNextItem(createEvent('ArrowUp'), options, currentOption)).not
      .exist;
  });
});
