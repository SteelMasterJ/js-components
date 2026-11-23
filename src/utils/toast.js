import { reactive } from "vue";
import { createUid } from "./uid.js";

export const toastState = reactive({
  items: [],
});

/**
 * Normalizes a string or options object into a toast entry.
 * @param {string|object} input
 * @param {object} [overrides]
 * @returns {object}
 */
function normalizeToast(input, overrides = {}) {
  const base = typeof input === "string" ? { message: input } : input || {};
  const opts = { ...base, ...overrides };

  return {
    id: opts.id || createUid("js-toast"),
    type: opts.type || "info",
    title: opts.title || "",
    message: opts.message || "",
    duration: opts.duration,
    dismissible: opts.dismissible,
    variant: opts.variant,
    theme: opts.theme,
    icon: opts.icon || "",
    hideIcon: Boolean(opts.hideIcon),
    actionLabel: opts.actionLabel || "",
    onAction: typeof opts.onAction === "function" ? opts.onAction : null,
    parseMarkdown: opts.parseMarkdown ?? "",
  };
}

export const toast = {
  /**
   * Adds a toast notification to the global toast queue.
   * @param {string|object} input
   * @param {object} [overrides]
   * @returns {string} The created toast ID
   */
  show(input, overrides = {}) {
    const entry = normalizeToast(input, overrides);
    toastState.items.push(entry);
    return entry.id;
  },
  info(input, opts = {}) {
    return this.show(input, { ...opts, type: "info" });
  },
  success(input, opts = {}) {
    return this.show(input, { ...opts, type: "success" });
  },
  warning(input, opts = {}) {
    return this.show(input, { ...opts, type: "warning" });
  },
  danger(input, opts = {}) {
    return this.show(input, { ...opts, type: "danger" });
  },
  dismiss(id) {
    const idx = toastState.items.findIndex((item) => item.id === id);
    if (idx !== -1) {
      toastState.items.splice(idx, 1);
    }
  },
  clear() {
    toastState.items.splice(0, toastState.items.length);
  },
};
