/**
 * Minimal built-in SVG path icons (24x24 viewBox, stroke-based) for internal
 * component chrome (chevrons, close, search, alert, etc.) so `js-components`
 * has zero external icon library dependencies.
 *
 * Consumers can pass any custom SVG into component `#icon` slots or render
 * their own icons and style them directly with vanilla CSS.
 */
export const BUILTIN_ICONS = {
  "chevron-down": "M6 9l6 6 6-6",
  "chevron-up": "M18 15l-6-6-6 6",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "angle-down": "M6 9l6 6 6-6",
  "angle-up": "M18 15l-6-6-6 6",
  "angle-left": "M15 18l-6-6 6-6",
  "angle-right": "M9 18l6-6-6-6",
  "caret-down": "M7 10l5 5 5-5",
  "caret-right": "M10 7l5 5-5 5",
  close: "M18 6L6 18M6 6l12 12",
  times: "M18 6L6 18M6 6l12 12",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2l-4.35-4.35",
  check: "M20 6L9 17l-5-5",
  alert: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  "triangle-exclamation":
    "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 0 1-3.46 0",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3",
  "external-link-square-alt":
    "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3",
  "ellipsis-vertical": "M12 5h.01M12 12h.01M12 19h.01",
  spinner: "M21 12a9 9 0 1 1-6.219-8.56",
  "list-ul": "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  "table-cells": "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
};

/**
 * Looks up a built-in SVG path by icon name.
 * @param {string} name
 * @returns {string|null}
 */
export function getBuiltinIconPath(name) {
  if (!name || typeof name !== "string") return null;
  return BUILTIN_ICONS[name] || null;
}
