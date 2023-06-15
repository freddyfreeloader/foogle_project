/**
 * Key is ArrowRight, ArrowLeft, ArrowUp, or ArrowDown
 * @param key
 * @returns {boolean}
 */
export function isArrowKey(key) {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
    return keys.includes(key);
}

/**
 * Key is Enter, ' ', ArrowUp, or ArrowDown
 * @param key
 * @returns {boolean}
 */
export function isMenuNavigationKey(key) {
    const keys = ['Enter', ' ', 'ArrowUp', 'ArrowDown'];
    return keys.includes(key);
}