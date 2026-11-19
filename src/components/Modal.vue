<template>
  <Teleport :to="teleportTo" :disabled="disableTeleport">
    <div
      v-if="modelValue"
      class="js-modal-backdrop"
      @click.self="onBackdropClick"
    >
      <section
        ref="dialogRef"
        :class="['js-modal', 'js-modal--' + size]"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="hasHeader ? titleId : undefined"
        :aria-label="!hasHeader ? ariaLabel : undefined"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <header v-if="hasHeader" class="js-modal__header">
          <div class="js-modal__title-wrap">
            <slot name="header" :titleId="titleId">
              <component
                :is="headingTag"
                v-if="title"
                :id="titleId"
                class="js-modal__title"
              >
                {{ title }}
              </component>
            </slot>
          </div>
          <button
            v-if="!hideClose"
            type="button"
            class="js-modal__close"
            :aria-label="closeLabel"
            @click="close"
          >
            <slot name="close-icon">
              <JsIcon name="close" />
            </slot>
          </button>
        </header>

        <div class="js-modal__body">
          <slot>
            <component
              :is="component"
              v-if="component"
              v-bind="componentProps"
            />
          </slot>
        </div>

        <footer v-if="$slots.footer" class="js-modal__footer">
          <slot name="footer" :close="close" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>

<script>
import JsIcon from "./Icon.vue";
import { createUid } from "../utils/uid.js";

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default {
  name: "JsModal",
  components: {
    JsIcon,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    ariaLabel: {
      type: String,
      default: "Dialog",
    },
    headingLevel: {
      type: Number,
      default: 2,
      validator(v) {
        return v >= 1 && v <= 6;
      },
    },
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg", "full"].includes(v);
      },
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true,
    },
    closeOnEsc: {
      type: Boolean,
      default: true,
    },
    hideClose: {
      type: Boolean,
      default: false,
    },
    closeLabel: {
      type: String,
      default: "Close dialog",
    },
    component: {
      type: [Object, Function, String],
      default: null,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    teleportTo: {
      type: [String, Object],
      default: "body",
    },
    disableTeleport: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "open", "close"],
  data() {
    return {
      titleId: createUid("js-modal-title"),
      previouslyFocused: null,
      originalBodyOverflow: "",
    };
  },
  computed: {
    hasHeader() {
      return Boolean(this.title || this.$slots.header || !this.hideClose);
    },
    headingTag() {
      return `h${this.headingLevel}`;
    },
  },
  watch: {
    modelValue(isOpen) {
      if (isOpen) {
        this.onOpen();
      } else {
        this.onCloseCleanup();
      }
    },
  },
  mounted() {
    if (this.modelValue) {
      this.onOpen();
    }
  },
  unmounted() {
    this.unlockScroll();
  },
  methods: {
    close() {
      if (!this.modelValue) return;
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    onBackdropClick() {
      if (this.closeOnBackdrop) {
        this.close();
      }
    },
    onOpen() {
      if (typeof document === "undefined") return;
      this.previouslyFocused = document.activeElement;
      this.lockScroll();
      this.$emit("open");
      this.$nextTick(() => {
        this.focusInitialElement();
      });
    },
    onCloseCleanup() {
      this.unlockScroll();
      if (
        this.previouslyFocused &&
        typeof this.previouslyFocused.focus === "function"
      ) {
        this.previouslyFocused.focus();
      }
      this.previouslyFocused = null;
    },
    lockScroll() {
      if (typeof document === "undefined") return;
      this.originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    },
    unlockScroll() {
      if (typeof document === "undefined") return;
      document.body.style.overflow = this.originalBodyOverflow || "";
    },
    getFocusableElements() {
      const dialog = this.$refs.dialogRef;
      if (!dialog) return [];
      return Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    },
    focusInitialElement() {
      const focusable = this.getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else if (this.$refs.dialogRef) {
        this.$refs.dialogRef.focus();
      }
    },
    onKeydown(event) {
      if (event.key === "Escape" && this.closeOnEsc) {
        event.stopPropagation();
        this.close();
        return;
      }

      if (event.key === "Tab") {
        const focusable = this.getFocusableElements();
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
  },
};
</script>

<style scoped>
.js-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--js-z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--js-space-4);
  background-color: rgba(15, 23, 42, 0.55);
  overflow-y: auto;
}

.js-modal {
  display: flex;
  flex-direction: column;
  width: min(100%, 34rem);
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-lg);
  box-shadow: var(--js-shadow-lg);
  overflow: hidden;
  font-family: var(--js-font-family);
}

.js-modal:focus {
  outline: none;
}

.js-modal:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-modal--sm {
  width: min(100%, 24rem);
}

.js-modal--md {
  width: min(100%, 34rem);
}

.js-modal--lg {
  width: min(100%, 52rem);
}

.js-modal--full {
  width: 100%;
  height: calc(100vh - 2rem);
  height: calc(100dvh - 2rem);
}

.js-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
  padding: var(--js-space-4) var(--js-space-5);
  border-bottom: 1px solid var(--js-color-divider);
}

.js-modal__title-wrap {
  min-width: 0;
  flex: 1;
}

.js-modal__title {
  margin: 0;
  font-size: var(--js-font-size-lg);
  font-weight: 600;
  line-height: 1.3;
  color: var(--js-color-text);
}

.js-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--js-touch-min);
  min-height: var(--js-touch-min);
  padding: var(--js-space-1);
  border: 0;
  border-radius: var(--js-radius-md);
  background: transparent;
  color: var(--js-color-text-muted);
  font-size: 1.125rem;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast);
}

.js-modal__close:hover {
  background-color: var(--js-color-surface-hover);
  color: var(--js-color-text);
}

.js-modal__close:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--js-space-5);
  line-height: var(--js-line-height);
}

.js-modal__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--js-space-2);
  padding: var(--js-space-3) var(--js-space-5);
  border-top: 1px solid var(--js-color-divider);
  background-color: var(--js-color-surface-alt);
}

@media (max-width: 480px) {
  .js-modal-backdrop {
    padding: var(--js-space-2);
  }

  .js-modal__header,
  .js-modal__body,
  .js-modal__footer {
    padding-inline: var(--js-space-4);
  }
}
</style>
