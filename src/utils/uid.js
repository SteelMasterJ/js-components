let counter = 0;

/**
 * Generates a unique, DOM-safe ID string (replaces removed Vue 2 `this._uid`).
 * @param {string} [prefix="js"]
 * @returns {string}
 */
export function createUid(prefix = "js") {
  counter += 1;
  return `${prefix}-${counter}`;
}
