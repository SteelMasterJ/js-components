<template>
  <fieldset
    :id="fieldId"
    :disabled="disabled"
    :aria-invalid="isInvalid ? 'true' : undefined"
    :aria-describedby="describedBy || undefined"
    :class="[
      'js-input-radio',
      'js-input-radio--' + size,
      'js-input-radio--' + (disabled ? 'disabled' : theme),
      { 'js-input-radio--invalid': isInvalid },
      { 'js-input-radio--dots': dots },
    ]"
  >
    <legend
      v-if="label"
      :class="['js-input-radio__legend', { 'js-input-radio__legend--wrap': labelWrap }]"
    >
      <JsMarkdown :parse="shouldParseLabel" :val="label" />
    </legend>

    <div :class="['js-input-radio__list', { 'js-input-radio__list--dots': dots }]">
      <label
        v-for="(radio, i) in items"
        :key="radio.value != null ? radio.value : i"
        :class="[
          'js-input-radio__option',
          { 'js-input-radio__option--dot': dots },
          { 'js-input-radio__option--checked': modelValue === radio.value },
          { 'js-input-radio__option--disabled': Boolean(disabled || radio.disabled) },
        ]"
        :title="dots ? radio.label : undefined"
      >
        <input
          type="radio"
          :class="['js-input-radio__native', { 'js-input-radio__native--dot': dots }]"
          :name="resolvedName"
          :value="radio.value"
          :checked="modelValue === radio.value"
          :disabled="Boolean(disabled || radio.disabled)"
          :style="dotStyle(radio)"
          @change="onSelect(radio.value, $event)"
        />
        <span :class="dots ? 'js-sr-only' : 'js-input-radio__text'">
          {{ radio.label }}
        </span>
      </label>
    </div>

    <p v-if="error" :id="errorId" class="js-input-radio__error" role="alert">
      <JsIcon :name="errorIcon" />
      <span>{{ error }}</span>
    </p>
    <p v-else-if="hint || tip" :id="hintId" class="js-input-radio__hint">
      {{ hint || tip }}
    </p>
  </fieldset>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import { createUid } from "../utils/uid.js";

export default {
  name: "JsInputRadio",
  components: {
    JsIcon,
    JsMarkdown,
  },
  props: {
    uid: {
      type: [Number, String],
      default: undefined,
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    dots: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    labelWrap: {
      type: Boolean,
      default: false,
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
    const base = createUid("js-radio");
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
    resolvedName() {
      return this.name || this.generatedId;
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
  },
  methods: {
    dotStyle(radio) {
      if (!this.dots) return undefined;
      const style = {};
      if (radio.color) style.backgroundColor = radio.color;
      if (radio.img) style.backgroundImage = `url("${radio.img}")`;
      return style;
    },
    onSelect(val, event) {
      this.$emit("update:modelValue", val);
      this.$emit("change", this.uid !== undefined ? this.uid : val, event);
    },
  },
};
</script>

<style scoped>
.js-input-radio {
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

.js-input-radio__legend {
  padding: 0;
  margin-bottom: var(--js-space-1);
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  color: var(--js-color-text);
}

.js-input-radio__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2) var(--js-space-4);
  padding: var(--js-space-2) var(--js-space-3);
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-sm);
  background-color: var(--js-color-surface);
}

.js-input-radio__list--dots {
  justify-content: flex-start;
  gap: var(--js-space-3);
  border-color: transparent;
  background-color: transparent;
  padding: var(--js-space-1) 0;
}

.js-input-radio__option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.75rem;
  font-size: var(--js-font-size-sm);
  font-weight: 500;
  cursor: pointer;
}

.js-input-radio__option--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.js-input-radio__native {
  width: 1.1em;
  height: 1.1em;
  margin: 0;
  accent-color: var(--js-color-primary);
  cursor: inherit;
  flex-shrink: 0;
}

.js-input-radio__native:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

/* Swatch / Dot radio style */
.js-input-radio__native--dot {
  appearance: none;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 2px solid var(--js-color-border-strong);
  background-color: var(--js-color-surface);
  background-size: cover;
  background-position: center;
  transition: transform var(--js-transition-fast),
    box-shadow var(--js-transition-fast);
}

.js-input-radio__native--dot:hover:not(:disabled) {
  transform: scale(1.06);
}

.js-input-radio__native--dot:checked {
  border-color: var(--js-color-text);
  box-shadow: 0 0 0 2px var(--js-color-surface),
    0 0 0 4px var(--js-color-primary);
}

.js-input-radio__error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: var(--js-font-size-xs);
  font-weight: 600;
  color: var(--js-color-danger);
}

.js-input-radio__hint {
  margin: 0;
  font-size: var(--js-font-size-xs);
  color: var(--js-color-text-muted);
}

.js-input-radio--invalid .js-input-radio__list {
  border-color: var(--js-color-danger);
}

.js-input-radio--disabled .js-input-radio__list {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-disabled-text);
}

/* Sizes */
.js-input-radio--sm .js-input-radio__option {
  font-size: var(--js-font-size-xs);
}

.js-input-radio--lg .js-input-radio__option {
  font-size: var(--js-font-size-md);
}

.js-input-radio--xl .js-input-radio__option {
  font-size: var(--js-font-size-lg);
}

/* Dark theme */
.js-input-radio--dark,
.js-input-radio--dark .js-input-radio__legend {
  color: var(--js-color-text-inverse);
}

.js-input-radio--dark .js-input-radio__list:not(.js-input-radio__list--dots) {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-input-radio--dark .js-input-radio__hint {
  color: var(--js-color-text-inverse-muted);
}
</style>
