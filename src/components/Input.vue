<template>
  <div
    ref="rootRef"
    :class="[
      'js-input',
      'js-input--' + size,
      'js-input--' + (disabled ? 'disabled' : theme),
      { 'js-input--label-top': labelTop },
      { 'js-input--invalid': isInvalid },
      { 'js-input--label-placeholder': labelPlaceholder },
      { 'js-input--has-value': hasValue },
      wrapperClass,
    ]"
    :style="wrapperStyle"
    @keydown="onRootKeydown"
  >
    <label
      v-if="label"
      :for="fieldId"
      :class="[
        'js-input__label',
        { 'js-input__label--wrap': labelWrap },
        { 'js-input__label--visible': hasValue },
      ]"
    >
      <JsMarkdown :parse="shouldParseLabel" :val="label" />
    </label>

    <div class="js-input__field-wrap">
      <div class="js-input__anchor">
        <div
          ref="controlBoxRef"
          :class="['js-input__box', { 'js-input__box--multiline': type === 'textarea' }]"
        >
          <span
            v-if="$slots.icon || icon"
            class="js-input__icon"
            :style="iconColor ? { color: iconColor } : undefined"
          >
            <slot name="icon">
              <JsIcon :name="icon" />
            </slot>
          </span>

          <span
            v-else-if="img"
            :class="['js-input__thumb', { 'js-input__thumb--lg': imgSize === 'lg' }]"
          >
            <img :src="img" :alt="imgAlt || ''" loading="lazy" />
          </span>

          <slot name="prefix" />

          <div class="js-input__control">
            <div v-if="isSelect" class="js-input__select-wrap">
              <input
                v-if="controlName"
                type="hidden"
                :name="controlName"
                :value="modelValue"
                :disabled="disabled"
              />
              <button
                :id="fieldId"
                ref="inputRef"
                type="button"
                v-bind="selectTriggerAttrs"
                class="js-input__native js-input__select-trigger"
                role="combobox"
                aria-haspopup="listbox"
                :aria-expanded="String(dropdownOpen)"
                :aria-controls="listboxId"
                :aria-activedescendant="activeOptionId || undefined"
                :aria-invalid="isInvalid ? 'true' : undefined"
                :aria-describedby="describedBy || undefined"
                :disabled="disabled"
                @click="onSelectTriggerClick"
                @keydown="onSelectKeydown"
                @focus="$emit('focus', $event)"
                @blur="$emit('blur', $event)"
              >
                <span
                  :class="[
                    'js-input__select-value',
                    { 'js-input__select-placeholder': !selectedOption },
                  ]"
                >
                  {{ selectedOption ? selectedOption.label : selectPlaceholderText || "\u00A0" }}
                </span>
                <JsIcon
                  name="caret-down"
                  :class="['js-input__caret', { 'js-input__caret--open': dropdownOpen }]"
                />
              </button>
            </div>

            <textarea
              v-else-if="type === 'textarea'"
              :id="fieldId"
              ref="inputRef"
              v-bind="controlAttrs"
              class="js-input__native js-input__textarea"
              :value="modelValue"
              :disabled="disabled"
              :placeholder="resolvedPlaceholder"
              :rows="rows"
              :aria-invalid="isInvalid ? 'true' : undefined"
              :aria-describedby="describedBy || undefined"
              @input="onNativeInput"
              @change="onNativeChange"
              @focus="$emit('focus', $event)"
              @blur="$emit('blur', $event)"
            ></textarea>

            <input
              v-else
              :id="fieldId"
              ref="inputRef"
              v-bind="controlAttrs"
              class="js-input__native"
              :type="type"
              :step="type === 'number' ? step : undefined"
              :value="modelValue"
              :disabled="disabled"
              :placeholder="resolvedPlaceholder"
              :autofocus="autoFocus || undefined"
              :role="hasAutocomplete ? 'combobox' : undefined"
              :aria-autocomplete="hasAutocomplete ? 'list' : undefined"
              :aria-expanded="hasAutocomplete ? String(dropdownOpen) : undefined"
              :aria-controls="hasAutocomplete ? listboxId : undefined"
              :aria-activedescendant="activeOptionId || undefined"
              :aria-invalid="isInvalid ? 'true' : undefined"
              :aria-describedby="describedBy || undefined"
              @input="onNativeInput"
              @change="onNativeChange"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @keydown="onInputKeydown"
            />
          </div>

          <slot name="suffix" />

          <JsNavItemNotify
            v-if="hasNotify"
            :item="notifyItem"
            :notify-color="notifyColor"
            class="js-input__notify"
          />

          <span v-if="$slots.action || resolvedAction" class="js-input__action">
            <slot name="action" :action="resolvedAction">
              <JsIcon :name="resolvedAction" />
            </slot>
          </span>
        </div>

        <div
          v-if="hasDropdown && dropdownOpen && dropdownItems.length"
          :id="listboxId"
          ref="dropRef"
          role="listbox"
          :aria-label="label ? `${label} options` : 'Options'"
          :class="[
            'js-input__drop',
            'js-input__drop--' + dropSize,
            'js-input__drop--' + resolvedDropTheme,
            { 'js-input__drop--right': dropAlignRight },
            { 'js-input__drop--above': dropOpenAbove },
          ]"
        >
          <button
            v-for="(item, idx) in dropdownItems"
            :id="optionId(idx)"
            :key="item.id != null ? item.id : item.value != null ? item.value : idx"
            type="button"
            role="option"
            tabindex="-1"
            :disabled="Boolean(item.disabled)"
            :aria-disabled="item.disabled ? 'true' : undefined"
            :aria-selected="String(isSelect ? isOptionSelected(item) : idx === activeOptionIndex)"
            :class="[
              'js-input__option',
              { 'js-input__option--active': idx === activeOptionIndex },
              { 'js-input__option--selected': isSelect && isOptionSelected(item) },
              { 'js-input__option--disabled': Boolean(item.disabled) },
            ]"
            @mousedown.prevent="selectOption(item)"
            @click="selectOption(item)"
            @mouseenter="activeOptionIndex = item.disabled ? activeOptionIndex : idx"
          >
            <span class="js-input__option-text">
              <span class="js-input__option-label">
                <JsMarkdown :parse="shouldParseLabel" :val="item.label" />
              </span>
              <span v-if="item.subLabel" class="js-input__option-sub">
                {{ item.subLabel }}
              </span>
            </span>
            <JsIcon
              v-if="isSelect && isOptionSelected(item)"
              name="check"
              class="js-input__option-check"
            />
          </button>
        </div>
      </div>

      <p
        v-if="error"
        :id="errorId"
        class="js-input__error"
        role="alert"
      >
        <JsIcon :name="errorIcon" class="js-input__error-icon" />
        <span>{{ error }}</span>
      </p>

      <p v-else-if="hint || tip" :id="hintId" class="js-input__hint">
        {{ hint || tip }}
      </p>
    </div>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsNavItemNotify from "./NavItem/NavItemNotify.vue";
import { createUid } from "../utils/uid.js";
import { findInObject } from "../utils/search.js";
import { computeDropdownPlacement } from "../utils/position.js";

export default {
  name: "JsInput",
  inheritAttrs: false,
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
      type: [String, Number],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    step: {
      type: [String, Number],
      default: "1",
    },
    rows: {
      type: Number,
      default: 3,
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
    labelTop: {
      type: Boolean,
      default: true,
    },
    labelPlaceholder: {
      type: Boolean,
      default: false,
    },
    placeholder: {
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
    actionIcon: {
      type: [String, Boolean],
      default: undefined,
    },
    img: {
      type: String,
      default: "",
    },
    imgAlt: {
      type: String,
      default: "",
    },
    imgSize: {
      type: String,
      default: "md",
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
    autoFocus: {
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
    dropRight: {
      type: Boolean,
      default: false,
    },
    dropSize: {
      type: String,
      default: "auto",
      validator(v) {
        return ["auto", "sm", "md", "lg"].includes(v);
      },
    },
    dropTheme: {
      type: String,
      default: "",
      validator(v) {
        return ["", "light", "dark"].includes(v);
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
    searchableProperties: {
      type: Array,
      default: () => ["label", "subLabel"],
    },
  },
  emits: ["update:modelValue", "change", "select", "focus", "blur"],
  data() {
    const base = createUid("js-in");
    return {
      generatedId: base,
      errorId: `${base}-err`,
      hintId: `${base}-hint`,
      listboxId: `${base}-list`,
      dropdownOpen: false,
      activeOptionIndex: -1,
      dropOpenAbove: false,
      dropAlignRight: Boolean(this.dropRight),
    };
  },
  computed: {
    fieldId() {
      return this.id || this.generatedId;
    },
    wrapperClass() {
      return this.$attrs.class;
    },
    wrapperStyle() {
      return this.$attrs.style;
    },
    controlAttrs() {
      const { class: _c, style: _s, ...rest } = this.$attrs;
      return rest;
    },
    controlName() {
      return this.$attrs.name || "";
    },
    selectTriggerAttrs() {
      const { name: _n, ...rest } = this.controlAttrs;
      return rest;
    },
    isSelect() {
      return this.type === "select";
    },
    resolvedDropTheme() {
      return this.dropTheme || this.theme;
    },
    hasValue() {
      return (
        this.modelValue !== null &&
        this.modelValue !== undefined &&
        String(this.modelValue).length > 0
      );
    },
    isInvalid() {
      return Boolean(this.invalid || this.error);
    },
    describedBy() {
      if (this.error) return this.errorId;
      if (this.hint || this.tip) return this.hintId;
      return "";
    },
    resolvedPlaceholder() {
      if (this.placeholder) return this.placeholder;
      if (this.label && this.labelPlaceholder) return this.label;
      return "";
    },
    selectPlaceholderText() {
      if (this.placeholder) return this.placeholder;
      if (this.labelPlaceholder && this.label) return `Choose ${this.label}...`;
      return "";
    },
    shouldParseLabel() {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes("label");
    },
    hasAutocomplete() {
      return this.type === "text" && this.items.length > 0;
    },
    hasDropdown() {
      return this.isSelect || this.hasAutocomplete;
    },
    filteredItems() {
      const q = String(this.modelValue ?? "").trim();
      if (!q.length) return this.items;
      return this.items.filter((item) =>
        findInObject(item, q, this.searchableProperties)
      );
    },
    dropdownItems() {
      return this.isSelect ? this.items : this.filteredItems;
    },
    selectedOption() {
      if (!this.isSelect) return null;
      return this.items.find((item) => this.isOptionSelected(item)) || null;
    },
    activeOptionId() {
      if (
        !this.dropdownOpen ||
        this.activeOptionIndex < 0 ||
        this.activeOptionIndex >= this.dropdownItems.length
      ) {
        return "";
      }
      return this.optionId(this.activeOptionIndex);
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
    resolvedAction() {
      if (this.error) return this.errorIcon;
      if (this.actionIcon === false) return "";
      if (typeof this.actionIcon === "string") return this.actionIcon;
      if (this.hasAutocomplete) return "caret-down";
      return "";
    },
  },
  watch: {
    dropdownOpen(open) {
      if (open) {
        this.addListeners();
        this.$nextTick(() => this.updatePlacement());
      } else {
        this.removeListeners();
        this.activeOptionIndex = -1;
        this.dropOpenAbove = false;
      }
    },
  },
  unmounted() {
    this.removeListeners();
  },
  methods: {
    optionId(index) {
      return `${this.listboxId}-opt-${index}`;
    },
    optionValue(item) {
      return item && item.value !== undefined ? item.value : item?.label;
    },
    isOptionSelected(item) {
      if (!this.hasValue && this.optionValue(item) !== "") return false;
      return String(this.optionValue(item)) === String(this.modelValue);
    },
    findNextEnabledIndex(startIndex, step) {
      const list = this.dropdownItems;
      const len = list.length;
      if (!len) return -1;
      for (let i = 0; i < len; i += 1) {
        const next = (startIndex + step * (i + 1) + len * 2) % len;
        if (!list[next]?.disabled) return next;
      }
      return -1;
    },
    findFirstEnabledIndex() {
      return this.dropdownItems.findIndex((item) => !item?.disabled);
    },
    findLastEnabledIndex() {
      for (let i = this.dropdownItems.length - 1; i >= 0; i -= 1) {
        if (!this.dropdownItems[i]?.disabled) return i;
      }
      return -1;
    },
    scrollActiveOptionIntoView() {
      this.$nextTick(() => {
        const drop = this.$refs.dropRef;
        if (!drop || this.activeOptionIndex < 0) return;
        const opt = drop.querySelector(`#${this.optionId(this.activeOptionIndex)}`);
        if (opt && typeof opt.scrollIntoView === "function") {
          opt.scrollIntoView({ block: "nearest" });
        }
      });
    },
    focus() {
      if (this.$refs.inputRef && typeof this.$refs.inputRef.focus === "function") {
        this.$refs.inputRef.focus();
      }
    },
    onNativeInput(event) {
      const val =
        this.type === "number" && event.target.value !== ""
          ? Number(event.target.value)
          : event.target.value;
      this.$emit("update:modelValue", val);
      if (this.hasAutocomplete) {
        this.dropdownOpen = true;
        this.activeOptionIndex = -1;
      }
    },
    onNativeChange(event) {
      this.$emit("change", this.uid !== undefined ? this.uid : event.target.value, event);
    },
    openSelectDropdown() {
      if (this.disabled || !this.items.length) return;
      const selectedIdx = this.items.findIndex(
        (item) => !item?.disabled && this.isOptionSelected(item)
      );
      this.dropdownOpen = true;
      this.activeOptionIndex =
        selectedIdx >= 0 ? selectedIdx : this.findFirstEnabledIndex();
      this.scrollActiveOptionIntoView();
    },
    onSelectTriggerClick() {
      if (this.disabled) return;
      if (this.dropdownOpen) {
        this.dropdownOpen = false;
      } else {
        this.openSelectDropdown();
      }
    },
    onSelectKeydown(event) {
      if (this.disabled) return;
      const list = this.dropdownItems;
      if (!list.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openSelectDropdown();
        } else {
          this.activeOptionIndex = this.findNextEnabledIndex(this.activeOptionIndex, 1);
          this.scrollActiveOptionIntoView();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openSelectDropdown();
        } else {
          const base = this.activeOptionIndex < 0 ? 0 : this.activeOptionIndex;
          this.activeOptionIndex = this.findNextEnabledIndex(base, -1);
          this.scrollActiveOptionIntoView();
        }
      } else if (event.key === "Home") {
        event.preventDefault();
        if (!this.dropdownOpen) this.dropdownOpen = true;
        this.activeOptionIndex = this.findFirstEnabledIndex();
        this.scrollActiveOptionIntoView();
      } else if (event.key === "End") {
        event.preventDefault();
        if (!this.dropdownOpen) this.dropdownOpen = true;
        this.activeOptionIndex = this.findLastEnabledIndex();
        this.scrollActiveOptionIntoView();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.openSelectDropdown();
        } else if (
          this.activeOptionIndex >= 0 &&
          list[this.activeOptionIndex] &&
          !list[this.activeOptionIndex].disabled
        ) {
          this.selectOption(list[this.activeOptionIndex]);
        }
      } else if (event.key === "Tab" && this.dropdownOpen) {
        this.dropdownOpen = false;
      } else if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        const ch = event.key.toLowerCase();
        const start = this.activeOptionIndex >= 0 ? this.activeOptionIndex : -1;
        for (let i = 1; i <= list.length; i += 1) {
          const idx = (start + i) % list.length;
          const item = list[idx];
          if (
            item &&
            !item.disabled &&
            String(item.label || "")
              .toLowerCase()
              .startsWith(ch)
          ) {
            if (!this.dropdownOpen) this.dropdownOpen = true;
            this.activeOptionIndex = idx;
            this.scrollActiveOptionIntoView();
            break;
          }
        }
      }
    },
    onInputFocus(event) {
      if (this.hasAutocomplete && !this.disabled) {
        this.dropdownOpen = true;
      }
      this.$emit("focus", event);
    },
    onInputBlur(event) {
      this.$emit("blur", event);
    },
    onInputKeydown(event) {
      if (!this.hasAutocomplete || this.disabled) return;
      const list = this.dropdownItems;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!this.dropdownOpen) {
          this.dropdownOpen = true;
          this.activeOptionIndex = this.findFirstEnabledIndex();
        } else {
          this.activeOptionIndex = this.findNextEnabledIndex(this.activeOptionIndex, 1);
        }
        this.scrollActiveOptionIntoView();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (this.dropdownOpen && list.length > 0) {
          const base = this.activeOptionIndex < 0 ? 0 : this.activeOptionIndex;
          this.activeOptionIndex = this.findNextEnabledIndex(base, -1);
          this.scrollActiveOptionIntoView();
        }
      } else if (
        event.key === "Enter" &&
        this.dropdownOpen &&
        this.activeOptionIndex >= 0 &&
        list[this.activeOptionIndex] &&
        !list[this.activeOptionIndex].disabled
      ) {
        event.preventDefault();
        this.selectOption(list[this.activeOptionIndex]);
      } else if (event.key === "Tab" && this.dropdownOpen) {
        this.dropdownOpen = false;
      }
    },
    onRootKeydown(event) {
      if (event.key === "Escape" && this.dropdownOpen) {
        event.stopPropagation();
        this.dropdownOpen = false;
        this.focus();
      }
    },
    selectOption(item) {
      if (!item || item.disabled) return;
      const nextVal = this.optionValue(item);
      this.$emit("update:modelValue", nextVal);
      this.$emit("select", item);
      this.$emit("change", this.uid !== undefined ? this.uid : nextVal);
      this.dropdownOpen = false;
      this.focus();
    },
    updatePlacement() {
      if (!this.dropdownOpen) return;
      const { openAbove, alignRight } = computeDropdownPlacement(
        this.$refs.controlBoxRef,
        this.$refs.dropRef,
        { preferRight: Boolean(this.dropRight) }
      );
      this.dropOpenAbove = openAbove;
      this.dropAlignRight = alignRight;
    },
    addListeners() {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      document.addEventListener("click", this.onDocumentClick);
      window.addEventListener("resize", this.updatePlacement, { passive: true });
      window.addEventListener("scroll", this.updatePlacement, {
        passive: true,
        capture: true,
      });
    },
    removeListeners() {
      if (typeof window === "undefined" || typeof document === "undefined") return;
      document.removeEventListener("click", this.onDocumentClick);
      window.removeEventListener("resize", this.updatePlacement);
      window.removeEventListener("scroll", this.updatePlacement, {
        capture: true,
      });
    },
    onDocumentClick(event) {
      const root = this.$refs.rootRef;
      if (root && !root.contains(event.target)) {
        this.dropdownOpen = false;
      }
    },
  },
};
</script>

<style scoped>
.js-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--js-space-2);
  width: 100%;
  min-width: 0;
  font-family: var(--js-font-family);
  color: var(--js-color-text);
}

.js-input--label-top {
  flex-direction: column;
  align-items: stretch;
  gap: var(--js-space-1);
}

.js-input__label {
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  color: var(--js-color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.js-input__label--wrap {
  white-space: normal;
}

.js-input--label-placeholder {
  position: relative;
}

.js-input--label-placeholder .js-input__label {
  position: absolute;
  top: 0.25rem;
  inset-inline-start: calc(var(--js-space-3) + 1px);
  max-width: calc(100% - 2 * var(--js-space-3) - 2px);
  z-index: 1;
  font-size: var(--js-font-size-xs);
  line-height: 1.2;
  color: var(--js-color-text-muted);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--js-transition-fast);
}

.js-input--label-placeholder.js-input--has-value .js-input__label--visible {
  opacity: 1;
}

.js-input--label-placeholder.js-input--has-value .js-input__box {
  padding-top: 1.2rem;
  padding-bottom: 0.3rem;
}

.js-input--label-placeholder.js-input--has-value .js-input__native {
  padding-top: 0;
  padding-bottom: 0;
}

.js-input__field-wrap {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--js-space-1);
}

.js-input__anchor {
  position: relative;
  width: 100%;
  min-width: 0;
}

.js-input__box {
  display: flex;
  align-items: center;
  gap: var(--js-space-2);
  width: 100%;
  min-width: 0;
  min-height: var(--js-touch-min);
  padding: 0 var(--js-space-3);
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-sm);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  transition: border-color var(--js-transition-fast),
    box-shadow var(--js-transition-fast),
    padding var(--js-transition-fast);
}

.js-input__box--multiline {
  align-items: flex-start;
  padding-block: var(--js-space-2);
}

.js-input__box:focus-within {
  border-color: var(--js-color-focus);
  box-shadow: 0 0 0 2px rgba(0, 95, 204, 0.2);
}

.js-input__control {
  flex: 1 1 auto;
  min-width: 0;
}

.js-input__native {
  display: block;
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--js-font-size-md);
  line-height: 1.4;
  padding: 0.45rem 0;
}

.js-input__native::placeholder {
  color: var(--js-color-text-muted);
  opacity: 0.85;
}

.js-input__textarea {
  resize: vertical;
  padding: 0.15rem 0;
}

.js-input__select-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.js-input__select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-2);
  width: 100%;
  min-width: 0;
  text-align: left;
  cursor: pointer;
}

.js-input__select-value {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.js-input__select-placeholder {
  color: var(--js-color-text-muted);
  opacity: 0.85;
}

.js-input__caret {
  flex-shrink: 0;
  pointer-events: none;
  color: var(--js-color-text-muted);
  transition: transform var(--js-transition-fast);
}

.js-input__caret--open {
  transform: rotate(180deg);
}

.js-input__icon,
.js-input__action {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--js-color-text-muted);
}

.js-input__thumb {
  width: 2rem;
  height: 2rem;
  border-radius: var(--js-radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.js-input__thumb--lg {
  width: 2.75rem;
  height: 2.75rem;
}

.js-input__thumb > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Error & Hint */
.js-input__error {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-size: var(--js-font-size-xs);
  font-weight: 600;
  color: var(--js-color-danger);
}

.js-input__hint {
  margin: 0;
  font-size: var(--js-font-size-xs);
  color: var(--js-color-text-muted);
}

.js-input--invalid .js-input__box {
  border-color: var(--js-color-danger);
}

.js-input--invalid .js-input__box:focus-within {
  box-shadow: 0 0 0 2px rgba(197, 34, 31, 0.22);
}

.js-input--invalid .js-input__action {
  color: var(--js-color-danger);
}

/* Sizes */
.js-input--xs .js-input__native {
  font-size: var(--js-font-size-xs);
  padding: 0.25rem 0;
}

.js-input--sm .js-input__native {
  font-size: var(--js-font-size-sm);
  padding: 0.35rem 0;
}

.js-input--lg .js-input__native {
  font-size: var(--js-font-size-lg);
  padding: 0.55rem 0;
}

.js-input--xl .js-input__native {
  font-size: var(--js-font-size-xl);
  padding: 0.65rem 0;
}

/* Disabled */
.js-input--disabled .js-input__box {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-disabled-text);
  border-color: var(--js-color-border);
  cursor: not-allowed;
}

.js-input--disabled .js-input__native {
  cursor: not-allowed;
}

/* Dark theme */
.js-input--dark {
  color: var(--js-color-text-inverse);
}

.js-input--dark .js-input__label {
  color: var(--js-color-text-inverse);
}

.js-input--dark .js-input__box {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-input--dark.js-input--label-placeholder .js-input__label,
.js-input--dark .js-input__select-placeholder,
.js-input--dark .js-input__native::placeholder,
.js-input--dark .js-input__hint,
.js-input--dark .js-input__icon,
.js-input--dark .js-input__caret {
  color: var(--js-color-text-inverse-muted);
}

/* Dropdown (Select & Autocomplete — matches JsDrop / JsNavItem styling) */
.js-input__drop {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: var(--js-z-dropdown);
  min-width: 100%;
  max-width: calc(100vw - 1.5rem);
  max-height: 16rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--js-space-2);
  border-radius: var(--js-radius-md);
  box-shadow: var(--js-shadow-md);
  text-align: left;
}

.js-input__drop--above {
  top: auto;
  bottom: calc(100% + 0.35rem);
}

.js-input__drop--right {
  left: auto;
  right: 0;
}

.js-input__drop--sm {
  width: min(14rem, calc(100vw - 1.5rem));
}

.js-input__drop--md {
  width: min(19rem, calc(100vw - 1.5rem));
}

.js-input__drop--lg {
  width: min(24rem, calc(100vw - 1.5rem));
}

.js-input__drop--light {
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  color: var(--js-color-text);
}

.js-input__drop--dark {
  background-color: var(--js-color-surface-dark);
  border: 1px solid var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-input__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-2);
  width: 100%;
  min-height: 2.25rem;
  padding: 0.45rem 0.7rem;
  border: 0;
  border-radius: var(--js-radius-md);
  background: transparent;
  color: inherit;
  font-family: inherit;
  font-size: var(--js-font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast);
}

.js-input__option-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.js-input__option-check {
  flex-shrink: 0;
  color: var(--js-color-primary);
}

.js-input__drop--dark .js-input__option-check {
  color: var(--js-color-text-inverse);
}

.js-input__drop--light .js-input__option:hover:not(:disabled),
.js-input__drop--light .js-input__option--active:not(:disabled) {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-input__drop--light .js-input__option--selected {
  color: var(--js-color-primary-hover);
}

.js-input__drop--dark .js-input__option:hover:not(:disabled),
.js-input__drop--dark .js-input__option--active:not(:disabled) {
  background-color: var(--js-color-surface-dark-hover);
}

.js-input__option--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.js-input__option-label {
  font-weight: 600;
}

.js-input__option-sub {
  font-size: var(--js-font-size-xs);
  opacity: 0.8;
}
</style>
