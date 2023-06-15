import {isArrowKey} from './eventKeyChecker';

/**
 *
 * Works like a focus trap circle:
 * 
 * by ArrowDown or ArrowRight returns the next item of array, if end of array is reached it returns the first item.
 * 
 * ArrowUp or ArrowLeft works same way but reverse.
 * 
 * @param {KeyboardEvent} event the keyboard event, ArrowUp, ArrowLeft, ArrowDown, ArrowRight
 * @param {Array} options the options to find next item
 * @param {Object} currentOption the item of options array that is currently selected
 * @returns by ArrowDown/ArrowRight: the next item of the options array or the first, if currentOption is already the last item of array, by ArrowUp/ArrowLeft: the item before the currentOption or the last item if currentItem is the first item
 */
export function getNextItem(event, options, currentOption) {
  if (!options.length || !isArrowKey(event.key) || !currentOption) {
    return;
  }

  const currentIndex = currentOption
    ? Array.from(options).indexOf(currentOption)
    : -1;

  let nextIndex = -1;
  const lastIndex = options.length - 1;

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      nextIndex = currentIndex > 0 ? currentIndex - 1 : lastIndex;
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      nextIndex = currentIndex < lastIndex ? currentIndex + 1 : 0;
      break;
  }

  return options[nextIndex];
}
