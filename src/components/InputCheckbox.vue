<template>
  <fieldset
    v-if="isGroup"
    :id="fieldId"
    :disabled="disabled"
    :aria-invalid="isInvalid ? 'true' : undefined"
    :aria-describedby="describedBy || undefined"
    :class="[
      'js-input-checkbox',
      'js-input-checkbox--' + size,
      'js-input-checkbox--' + (disabled ? 'disabled' : theme),
      { 'js-input-checkbox--invalid': isInvalid },
    ]"
  >
    <legend v-if="label" :class="['js-input-checkbox__legend', { 'js-input-checkbox__legend--wrap': labelWrap }]">
      <JsMarkdown :parse="shouldParseLabel" :val="displayLabel" />
    </legend>

    <div class="js-input-checkbox__box">
      <span
        v-if="$slots.icon || icon"
        class="js-input-checkbox__icon"
        :style="iconColor ? { color: iconColor } : undefined"
      >
        <slot name="icon">
          <JsIcon :name="icon" />
        </slot>
      </span>

      <div :class="['js-input-checkbox__layout', 'js-input-checkbox__layout--' + layout]">
        <label
          v-for="(cb, i) in items"
          :key="cb.value != null ? cb.value : i"
          :class="[
            'js-input-checkbox__option',
            { 'js-input-checkbox__option--disabled': Boolean(disabled || cb.disabled) },
          ]"
        >
          <input
            type="checkbox"
            class="js-input-checkbox__native"
            :value="cb.value"
            :checked="isChecked(cb.value)"
            :disabled="Boolean(disabled || cb.disabled)"
            @change="onGroupToggle(cb.value, $event)"
          />
          <span class="js-input-checkbox__text">{{ cb.label }}</span>
        </label>
      </div>

      <JsNavItemNotify
        v-if="hasNotify"
        :item="notifyItem"
        :notify-color="notifyColor"
      />
    </div>

    <p v-if="error" :id="errorId" class="js-input-checkbox__error" role="alert">
      <JsIcon :name="errorIcon" />
      <span>{{ error }}</span>
    </p>
    <p v-else-if="hint || tip" :id="hintId" class="js-input-checkbox__hint">
      {{ hint || tip }}
    </p>
  </fieldset>

  <div
    v-else
    :class="[
      'js-input-checkbox',
      'js-input-checkbox--single',
      'js-input-checkbox--' + size,
      'js-input-checkbox--' + (disabled ? 'disabled' : theme),
      { 'js-input-checkbox--invalid': isInvalid },
    ]"
  >
    <label :for="fieldId" class="js-input-checkbox__option">
      <input
        :id="fieldId"
        type="checkbox"
        class="js-input-checkbox__native"
        :checked="Boolean(modelValue)"
        :disabled="disabled"
        :aria-invalid="isInvalid ? 'true' : undefined"
        :aria-describedby="describedBy || undefined"
        @change="onSingleChange"
      />
      <span class="js-input-checkbox__text">
        <JsMarkdown :parse="shouldParseLabel" :val="label" />
      </span>
    </label>

    <p v-if="error" :id="errorId" class="js-input-checkbox__error" role="alert">
      <JsIcon :name="errorIcon" />
      <span>{{ error }}</span>
    </p>
    <p v-else-if="hint || tip" :id="hintId" class="js-input-checkbox__hint">
      {{ hint || tip }}
    </p>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsNavItemNotify from "./NavItem/NavItemNotify.vue";
import { createUid } from "../utils/uid.js";

export default {
  name: "JsInputCheckbox",
  components: {
    JsIcon,
    JsMarkdown,
    JsNavItemNotify,
  },
  props: {
    uid: {
      type: [Number, String],
      default: undefined,
    },
    modelValue: {
      type: [Array, Boolean],
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    id: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: "",
    },
    tip: {
      type: String,
      default: "",
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    errorIcon: {
      type: String,
      default: "alert",
    },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl"].includes(value);
      },
    },
    notifyCount: {
      type: Number,
      default: 0,
    },
    notifyTip: {
      type: String,
      default: "",
    },
    notifyLabel: {
      type: String,
      default: "",
    },
    notifyIcon: {
      type: String,
      default: "",
    },
    notifyUnits: {
      type: String,
      default: "item",
    },
    notifyColor: {
      type: String,
      default: "orange",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    labelWrap: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: "cols-auto",
      validator(v) {
        return [
          "cols-auto",
          "cols-1",
          "cols-2",
          "cols-3",
          "cols-4",
          "cols-5",
          "rows",
          "spaced",
          "centered",
        ].includes(v);
      },
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
  },
  emits: ["update:modelValue", "change"],
  data() {
    const base = createUid("js-cb");
    return {
      generatedId: base,
      errorId: `${base}-err`,
      hintId: `${base}-hint`,
    };
  },
  computed: {
    fieldId() {
      return this.id || this.generatedId;
    },
    isGroup() {
      return Array.isArray(this.items) && this.items.length > 0;
    },
    selectedArray() {
      return Array.isArray(this.modelValue) ? this.modelValue : [];
    },
    displayLabel() {
      const count =
        this.selectedArray.length > 1 ? ` (${this.selectedArray.length})` : "";
      return `${this.label}${count}`;
    },
    isInvalid() {
      return Boolean(this.invalid || this.error);
    },
    describedBy() {
      if (this.error) return this.errorId;
      if (this.hint || this.tip) return this.hintId;
      return "";
    },
    shouldParseLabel() {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes("label");
    },
    hasNotify() {
      return Boolean(
        this.notifyCount > 0 || this.notifyLabel || this.notifyIcon
      );
    },
    notifyItem() {
      return {
        notifyCount: this.notifyCount,
        notifyTip: this.notifyTip,
        notifyLabel: this.notifyLabel,
        notifyIcon: this.notifyIcon,
        notifyUnits: this.notifyUnits,
        notifyColor: this.notifyColor,
      };
    },
  },
  methods: {
    isChecked(val) {
      return this.selectedArray.includes(val);
    },
    onGroupToggle(val, event) {
      const next = [...this.selectedArray];
      const idx = next.indexOf(val);
      if (event.target.checked && idx === -1) {
        next.push(val);
      } else if (!event.target.checked && idx !== -1) {
        next.splice(idx, 1);
      }
      this.$emit("update:modelValue", next);
      this.$emit("change", this.uid !== undefined ? this.uid : next, event);
    },
    onSingleChange(event) {
      const checked = Boolean(event.target.checked);
      this.$emit("update:modelValue", checked);
      this.$emit("change", this.uid !== undefined ? this.uid : checked, event);
    },
  },
};
</script>

<style scoped>
.js-input-checkbox {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--js-space-1);
  font-family: var(--js-font-family);
  color: var(--js-color-text);
}

.js-input-checkbox__legend {
  padding: 0;
  margin-bottom: var(--js-space-1);
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  color: var(--js-color-text);
}

.js-input-checkbox__box {
  display: flex;
  align-items: flex-start;
  gap: var(--js-space-2);
  padding: var(--js-space-3);
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-sm);
  background-color: var(--js-color-surface);
}

.js-input-checkbox__box:focus-within {
  border-color: var(--js-color-focus);
  box-shadow: 0 0 0 2px rgba(0, 95, 204, 0.2);
}

.js-input-checkbox__icon {
  display: inline-flex;
  align-items: center;
  color: var(--js-color-text-muted);
  padding-top: 0.15rem;
}

.js-input-checkbox__layout {
  flex: 1 1 auto;
  min-width: 0;
  gap: var(--js-space-2) var(--js-space-4);
}

.js-input-checkbox__layout--cols-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 8.5rem), 1fr));
}

.js-input-checkbox__layout--cols-1 {
  display: grid;
  grid-template-columns: 1fr;
}

.js-input-checkbox__layout--cols-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.js-input-checkbox__layout--cols-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.js-input-checkbox__layout--cols-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.js-input-checkbox__layout--cols-5 {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.js-input-checkbox__layout--rows,
.js-input-checkbox__layout--spaced,
.js-input-checkbox__layout--centered {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.js-input-checkbox__layout--spaced {
  justify-content: space-between;
}

.js-input-checkbox__layout--centered {
  justify-content: center;
}

.js-input-checkbox__option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.75rem;
  font-size: var(--js-font-size-sm);
  font-weight: 500;
  cursor: pointer;
}

.js-input-checkbox__option--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.js-input-checkbox__native {
  width: 1.1em;
  height: 1.1em;
  margin: 0;
  accent-color: var(--js-color-primary);
  cursor: inherit;
  flex-shrink: 0;
}

.js-input-checkbox__native:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-input-checkbox__error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: var(--js-font-size-xs);
  font-weight: 600;
  color: var(--js-color-danger);
}

.js-input-checkbox__hint {
  margin: 0;
  font-size: var(--js-font-size-xs);
  color: var(--js-color-text-muted);
}

.js-input-checkbox--invalid .js-input-checkbox__box {
  border-color: var(--js-color-danger);
}

.js-input-checkbox--disabled .js-input-checkbox__box {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-disabled-text);
  border-color: var(--js-color-border);
}

/* Sizes */
.js-input-checkbox--sm .js-input-checkbox__option {
  font-size: var(--js-font-size-xs);
}

.js-input-checkbox--lg .js-input-checkbox__option {
  font-size: var(--js-font-size-md);
}

.js-input-checkbox--xl .js-input-checkbox__option {
  font-size: var(--js-font-size-lg);
}

/* Dark theme */
.js-input-checkbox--dark,
.js-input-checkbox--dark .js-input-checkbox__legend {
  color: var(--js-color-text-inverse);
}

.js-input-checkbox--dark .js-input-checkbox__box {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-input-checkbox--dark .js-input-checkbox__hint {
  color: var(--js-color-text-inverse-muted);
}

@media (max-width: 520px) {
  .js-input-checkbox__layout--cols-2,
  .js-input-checkbox__layout--cols-3,
  .js-input-checkbox__layout--cols-4,
  .js-input-checkbox__layout--cols-5 {
    grid-template-columns: 1fr;
  }
}
</style>
