/**
 * Checks whether vue-router's RouterLink is registered in the current Vue app.
 * Allows components to render <router-link> when available and fall back
 * gracefully to <a> or <button> when vue-router is not installed.
 *
 * @param {object} vm - Vue component instance (`this` in Options API)
 * @returns {boolean}
 */
export function hasRouter(vm) {
  return Boolean(vm && vm.$router);
}

/**
 * Resolves the appropriate interactive tag for navigation items, links, or buttons.
 *
 * @param {object} vm - Vue component instance
 * @param {object} options
 * @param {string|object} [options.to] - Vue Router destination
 * @param {string} [options.href] - External or standard URL
 * @param {boolean|string} [options.isButton] - Force button element
 * @param {boolean} [options.hasDropdown] - Trigger opens a dropdown menu
 * @returns {"router-link"|"a"|"button"}
 */
export function resolveLinkTag(
  vm,
  { to = null, href = null, isButton = false, hasDropdown = false } = {}
) {
  if (isButton || hasDropdown) {
    return "button";
  }
  if (href) {
    return "a";
  }
  if (to) {
    return hasRouter(vm) ? "router-link" : "a";
  }
  return "button";
}
