<template>
  <div
    v-if="modelValue"
    ref="rootRef"
    :class="[
      'js-alert',
      'js-alert--' + type,
      'js-alert--' + variant,
      'js-alert--' + theme,
      'js-alert--' + size,
    ]"
    :role="resolvedRole || undefined"
    :aria-live="resolvedAriaLive || undefined"
  >
    <span v-if="!hideIcon" class="js-alert__icon">
      <slot name="icon" :type="type" :icon-name="resolvedIcon">
        <JsIcon :name="resolvedIcon" />
      </slot>
    </span>

    <div class="js-alert__body">
      <p v-if="title || $slots.title" class="js-alert__title">
        <slot name="title">
          <JsMarkdown :parse="shouldParse('title')" :val="title" />
        </slot>
      </p>

      <div v-if="message || $slots.default" class="js-alert__content">
        <slot>
          <JsMarkdown :parse="shouldParse('message')" :val="message" />
        </slot>
      </div>

      <div v-if="$slots.actions" class="js-alert__actions">
        <slot name="actions" :dismiss="dismiss" />
      </div>
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="js-alert__close"
      :aria-label="closeLabel"
      @click="dismiss"
    >
      <slot name="close-icon">
        <JsIcon name="close" />
      </slot>
    </button>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";

const TYPE_ICONS = {
  info: "info-circle",
  success: "check-circle",
  warning: "triangle-exclamation",
  danger: "danger-circle",
};

export default {
  name: "JsAlert",
  components: {
    JsIcon,
    JsMarkdown,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "info",
      validator(v) {
        return ["info", "success", "warning", "danger"].includes(v);
      },
    },
    variant: {
      type: String,
      default: "soft",
      validator(v) {
        return ["soft", "solid", "outline"].includes(v);
      },
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md"].includes(v);
      },
    },
    title: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    hideIcon: {
      type: Boolean,
      default: false,
    },
    dismissible: {
      type: Boolean,
      default: false,
    },
    closeLabel: {
      type: String,
      default: "Dismiss alert",
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    role: {
      type: String,
      default: "",
      validator(v) {
        return ["", "alert", "status", "note", "region"].includes(v);
      },
    },
    ariaLive: {
      type: String,
      default: "",
      validator(v) {
        return ["", "assertive", "polite", "off"].includes(v);
      },
    },
  },
  emits: ["update:modelValue", "dismiss"],
  computed: {
    resolvedIcon() {
      return this.icon || TYPE_ICONS[this.type] || "info-circle";
    },
    resolvedRole() {
      if (this.role) return this.role;
      return this.type === "danger" || this.type === "warning"
        ? "alert"
        : "status";
    },
    resolvedAriaLive() {
      if (this.ariaLive) return this.ariaLive;
      if (this.resolvedRole === "alert") return "assertive";
      if (this.resolvedRole === "status") return "polite";
      return undefined;
    },
  },
  methods: {
    shouldParse(section) {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes(section);
    },
    dismiss() {
      this.$emit("update:modelValue", false);
      this.$emit("dismiss");
    },
    focus() {
      if (this.$refs.rootRef && typeof this.$refs.rootRef.focus === "function") {
        this.$refs.rootRef.focus();
      }
    },
  },
};
</script>

<style scoped>
.js-alert {
  --js-alert-bg: var(--js-color-info-soft);
  --js-alert-border: var(--js-color-info-border);
  --js-alert-accent: var(--js-color-info);
  --js-alert-fg: var(--js-color-info-text);
  --js-alert-icon-fg: var(--js-color-info);
  --js-alert-close-hover: rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  gap: var(--js-space-3);
  width: 100%;
  box-sizing: border-box;
  padding: var(--js-space-3) var(--js-space-4);
  border: 1px solid var(--js-alert-border);
  border-inline-start-width: 4px;
  border-inline-start-color: var(--js-alert-accent);
  border-radius: var(--js-radius-md);
  background-color: var(--js-alert-bg);
  color: var(--js-alert-fg);
  font-family: var(--js-font-family);
  font-size: var(--js-font-size-sm);
  line-height: var(--js-line-height);
}

.js-alert:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-alert--sm {
  gap: var(--js-space-2);
  padding: var(--js-space-2) var(--js-space-3);
  font-size: var(--js-font-size-xs);
}

/* Light theme semantic palettes (soft default) */
.js-alert--info {
  --js-alert-bg: var(--js-color-info-soft);
  --js-alert-border: var(--js-color-info-border);
  --js-alert-accent: var(--js-color-info);
  --js-alert-fg: var(--js-color-info-text);
  --js-alert-icon-fg: var(--js-color-info);
}

.js-alert--success {
  --js-alert-bg: var(--js-color-success-soft);
  --js-alert-border: var(--js-color-success-border);
  --js-alert-accent: var(--js-color-success);
  --js-alert-fg: var(--js-color-success-text);
  --js-alert-icon-fg: var(--js-color-success);
}

.js-alert--warning {
  --js-alert-bg: var(--js-color-warning-soft);
  --js-alert-border: var(--js-color-warning-border);
  --js-alert-accent: var(--js-color-warning-border);
  --js-alert-fg: var(--js-color-warning-text-strong);
  --js-alert-icon-fg: var(--js-color-warning-text-strong);
}

.js-alert--danger {
  --js-alert-bg: var(--js-color-danger-soft);
  --js-alert-border: var(--js-color-danger-border);
  --js-alert-accent: var(--js-color-danger);
  --js-alert-fg: var(--js-color-danger-text);
  --js-alert-icon-fg: var(--js-color-danger);
}

/* Solid variant */
.js-alert--solid {
  border-inline-start-width: 1px;
}

.js-alert--solid.js-alert--info {
  --js-alert-bg: var(--js-color-info);
  --js-alert-border: var(--js-color-primary-hover);
  --js-alert-accent: var(--js-color-primary-hover);
  --js-alert-fg: var(--js-color-text-inverse);
  --js-alert-icon-fg: var(--js-color-text-inverse);
  --js-alert-close-hover: rgba(255, 255, 255, 0.18);
}

.js-alert--solid.js-alert--success {
  --js-alert-bg: var(--js-color-success);
  --js-alert-border: var(--js-color-success-hover);
  --js-alert-accent: var(--js-color-success-hover);
  --js-alert-fg: var(--js-color-text-inverse);
  --js-alert-icon-fg: var(--js-color-text-inverse);
  --js-alert-close-hover: rgba(255, 255, 255, 0.18);
}

.js-alert--solid.js-alert--warning {
  --js-alert-bg: var(--js-color-warning);
  --js-alert-border: var(--js-color-warning-border);
  --js-alert-accent: var(--js-color-warning-border);
  --js-alert-fg: var(--js-color-warning-text);
  --js-alert-icon-fg: var(--js-color-warning-text);
  --js-alert-close-hover: rgba(0, 0, 0, 0.1);
}

.js-alert--solid.js-alert--danger {
  --js-alert-bg: var(--js-color-danger);
  --js-alert-border: var(--js-color-danger-hover);
  --js-alert-accent: var(--js-color-danger-hover);
  --js-alert-fg: var(--js-color-text-inverse);
  --js-alert-icon-fg: var(--js-color-text-inverse);
  --js-alert-close-hover: rgba(255, 255, 255, 0.18);
}

/* Outline variant */
.js-alert--outline.js-alert--light {
  --js-alert-bg: var(--js-color-surface);
}

/* Dark theme (soft and outline) */
.js-alert--dark.js-alert--soft,
.js-alert--dark.js-alert--outline {
  --js-alert-close-hover: rgba(255, 255, 255, 0.14);
}

.js-alert--dark.js-alert--soft.js-alert--info {
  --js-alert-bg: var(--js-color-info-dark-bg);
  --js-alert-border: var(--js-color-info-dark-border);
  --js-alert-accent: var(--js-color-info-border);
  --js-alert-fg: var(--js-color-info-dark-text);
  --js-alert-icon-fg: var(--js-color-info-dark-text);
}

.js-alert--dark.js-alert--soft.js-alert--success {
  --js-alert-bg: var(--js-color-success-dark-bg);
  --js-alert-border: var(--js-color-success-dark-border);
  --js-alert-accent: var(--js-color-success-border);
  --js-alert-fg: var(--js-color-success-dark-text);
  --js-alert-icon-fg: var(--js-color-success-dark-text);
}

.js-alert--dark.js-alert--soft.js-alert--warning {
  --js-alert-bg: var(--js-color-warning-dark-bg);
  --js-alert-border: var(--js-color-warning-dark-border);
  --js-alert-accent: var(--js-color-warning);
  --js-alert-fg: var(--js-color-warning-dark-text);
  --js-alert-icon-fg: var(--js-color-warning-dark-text);
}

.js-alert--dark.js-alert--soft.js-alert--danger {
  --js-alert-bg: var(--js-color-danger-dark-bg);
  --js-alert-border: var(--js-color-danger-dark-border);
  --js-alert-accent: var(--js-color-danger-border);
  --js-alert-fg: var(--js-color-danger-dark-text);
  --js-alert-icon-fg: var(--js-color-danger-dark-text);
}

.js-alert--dark.js-alert--outline {
  --js-alert-bg: var(--js-color-surface-dark);
}

.js-alert--dark.js-alert--outline.js-alert--info {
  --js-alert-border: var(--js-color-info-dark-border);
  --js-alert-accent: var(--js-color-info-border);
  --js-alert-fg: var(--js-color-info-dark-text);
  --js-alert-icon-fg: var(--js-color-info-dark-text);
}

.js-alert--dark.js-alert--outline.js-alert--success {
  --js-alert-border: var(--js-color-success-dark-border);
  --js-alert-accent: var(--js-color-success-border);
  --js-alert-fg: var(--js-color-success-dark-text);
  --js-alert-icon-fg: var(--js-color-success-dark-text);
}

.js-alert--dark.js-alert--outline.js-alert--warning {
  --js-alert-border: var(--js-color-warning-dark-border);
  --js-alert-accent: var(--js-color-warning);
  --js-alert-fg: var(--js-color-warning-dark-text);
  --js-alert-icon-fg: var(--js-color-warning-dark-text);
}

.js-alert--dark.js-alert--outline.js-alert--danger {
  --js-alert-border: var(--js-color-danger-dark-border);
  --js-alert-accent: var(--js-color-danger-border);
  --js-alert-fg: var(--js-color-danger-dark-text);
  --js-alert-icon-fg: var(--js-color-danger-dark-text);
}

.js-alert__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.15rem;
  color: var(--js-alert-icon-fg);
}

.js-alert--sm .js-alert__icon {
  font-size: 1rem;
}

.js-alert__body {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--js-space-1);
}

.js-alert__title {
  margin: 0;
  font-weight: 700;
  font-size: var(--js-font-size-sm);
  line-height: 1.35;
}

.js-alert--sm .js-alert__title {
  font-size: var(--js-font-size-xs);
}

.js-alert__content {
  min-width: 0;
  word-wrap: break-word;
}

.js-alert__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
  margin-top: var(--js-space-1);
}

.js-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: var(--js-touch-min);
  min-height: var(--js-touch-min);
  margin: 0 calc(-1 * var(--js-space-2)) 0 0;
  padding: var(--js-space-1);
  border: 0;
  border-radius: var(--js-radius-md);
  background: transparent;
  color: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color var(--js-transition-fast);
}

.js-alert__close:hover {
  background-color: var(--js-alert-close-hover);
}

.js-alert__close:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

@media (max-width: 480px) {
  .js-alert {
    padding: var(--js-space-3);
  }
}
</style>
