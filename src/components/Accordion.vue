<template>
  <div
    :class="[
      'js-accordion',
      'js-accordion--' + variant,
      'js-accordion--' + size,
      'js-accordion--' + theme,
      'js-accordion--chevron-' + chevronPosition,
    ]"
    :aria-label="ariaLabel || undefined"
  >
    <div
      v-for="(item, i) in items"
      :key="itemKey(item, i)"
      :class="[
        'js-accordion__item',
        {
          'js-accordion__item--open': isItemOpen(item, i),
          'js-accordion__item--disabled': Boolean(item.disabled),
        },
      ]"
    >
      <component :is="headingTag" class="js-accordion__heading">
        <button
          :ref="(el) => setTriggerRef(i, el)"
          type="button"
          :id="triggerId(i)"
          :aria-expanded="isItemOpen(item, i) ? 'true' : 'false'"
          :aria-controls="panelId(i)"
          :disabled="Boolean(item.disabled)"
          :class="[
            'js-accordion__trigger',
            { 'js-accordion__trigger--open': isItemOpen(item, i) },
          ]"
          @click="toggleItem(item, i)"
          @keydown="onKeydown($event, i)"
        >
          <span
            v-if="chevronPosition === 'left'"
            :class="[
              'js-accordion__chevron',
              { 'js-accordion__chevron--open': isItemOpen(item, i) },
            ]"
            aria-hidden="true"
          >
            <slot
              name="chevron"
              :item="item"
              :index="i"
              :open="isItemOpen(item, i)"
            >
              <JsIcon name="chevron-down" />
            </slot>
          </span>

          <span
            v-if="$slots['item-icon'] || item.icon"
            class="js-accordion__icon"
          >
            <slot
              name="item-icon"
              :item="item"
              :index="i"
              :open="isItemOpen(item, i)"
            >
              <JsIcon v-if="item.icon" :name="item.icon" />
            </slot>
          </span>

          <span class="js-accordion__label-group">
            <span class="js-accordion__label">
              <slot
                name="item-label"
                :item="item"
                :index="i"
                :open="isItemOpen(item, i)"
              >
                <JsMarkdown :parse="parseMarkdown" :val="item.label" />
              </slot>
            </span>
            <span v-if="item.subLabel" class="js-accordion__sub-label">
              <JsMarkdown :parse="parseMarkdown" :val="item.subLabel" />
            </span>
          </span>

          <span
            v-if="item.badge != null && item.badge !== ''"
            class="js-accordion__badge"
          >
            {{ item.badge }}
          </span>

          <span
            v-if="chevronPosition !== 'left'"
            :class="[
              'js-accordion__chevron',
              { 'js-accordion__chevron--open': isItemOpen(item, i) },
            ]"
            aria-hidden="true"
          >
            <slot
              name="chevron"
              :item="item"
              :index="i"
              :open="isItemOpen(item, i)"
            >
              <JsIcon name="chevron-down" />
            </slot>
          </span>
        </button>
      </component>

      <div
        role="region"
        :id="panelId(i)"
        :aria-labelledby="triggerId(i)"
        :hidden="!isItemOpen(item, i)"
        class="js-accordion__panel"
      >
        <div class="js-accordion__body">
          <slot
            v-if="item.id != null && $slots['item-' + item.id]"
            :name="'item-' + item.id"
            :item="item"
            :index="i"
            :open="isItemOpen(item, i)"
            :toggle="() => toggleItem(item, i)"
          />
          <slot
            v-else-if="$slots['item' + i]"
            :name="'item' + i"
            :item="item"
            :index="i"
            :open="isItemOpen(item, i)"
            :toggle="() => toggleItem(item, i)"
          />
          <slot
            v-else
            name="panel"
            :item="item"
            :index="i"
            :open="isItemOpen(item, i)"
            :toggle="() => toggleItem(item, i)"
          >
            <JsMarkdown
              v-if="item.content != null && item.content !== ''"
              :parse="parseMarkdown"
              :val="String(item.content)"
            />
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import { createUid } from "../utils/uid.js";

export default {
  name: "JsAccordion",
  components: {
    JsIcon,
    JsMarkdown,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Array],
      default: undefined,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    collapsible: {
      type: Boolean,
      default: true,
    },
    headingLevel: {
      type: Number,
      default: 3,
      validator(v) {
        return v >= 1 && v <= 6;
      },
    },
    variant: {
      type: String,
      default: "bordered",
      validator(v) {
        return ["bordered", "separated", "flush"].includes(v);
      },
    },
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    chevronPosition: {
      type: String,
      default: "right",
      validator(v) {
        return ["right", "left"].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: false,
    },
    ariaLabel: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "change", "toggle", "open", "close"],
  data() {
    return {
      uid: createUid("js-accordion"),
      internalOpenKeys: this.computeInitialOpenKeys(),
      triggerRefs: [],
    };
  },
  computed: {
    headingTag() {
      return `h${this.headingLevel}`;
    },
    isControlled() {
      return this.modelValue !== undefined;
    },
    openKeySet() {
      const keys = this.isControlled
        ? this.normalizeModelValue(this.modelValue)
        : this.internalOpenKeys;

      if (!this.multiple && keys.length > 1) {
        return new Set([keys[0]]);
      }
      return new Set(keys);
    },
  },
  beforeUpdate() {
    this.triggerRefs = [];
  },
  methods: {
    setTriggerRef(index, el) {
      if (el) {
        this.triggerRefs[index] = el;
      }
    },
    itemKey(item, index) {
      return item && item.id != null ? item.id : index;
    },
    triggerId(index) {
      return `${this.uid}-trigger-${index}`;
    },
    panelId(index) {
      return `${this.uid}-panel-${index}`;
    },
    computeInitialOpenKeys() {
      const openKeys = [];
      for (let i = 0; i < this.items.length; i += 1) {
        const item = this.items[i];
        if (item && item.open && !item.disabled) {
          openKeys.push(this.itemKey(item, i));
          if (!this.multiple) break;
        }
      }
      if (!openKeys.length && !this.collapsible && !this.multiple) {
        const firstEnabled = this.items.findIndex((item) => item && !item.disabled);
        if (firstEnabled !== -1) {
          openKeys.push(this.itemKey(this.items[firstEnabled], firstEnabled));
        }
      }
      return openKeys;
    },
    normalizeModelValue(val) {
      if (val === null || val === undefined || val === "") return [];
      const rawList = Array.isArray(val) ? val : [val];
      const resolved = [];

      for (const entry of rawList) {
        const idx = this.resolveItemIndex(entry);
        if (idx !== -1 && !this.items[idx].disabled) {
          const key = this.itemKey(this.items[idx], idx);
          if (!resolved.includes(key)) {
            resolved.push(key);
          }
        }
      }
      return resolved;
    },
    resolveItemIndex(entry) {
      if (typeof entry === "number") {
        if (this.items[entry]) return entry;
        return this.items.findIndex((item) => item && item.id === entry);
      }
      if (typeof entry === "string") {
        return this.items.findIndex((item) => item && item.id === entry);
      }
      return -1;
    },
    isItemOpen(item, index) {
      if (!item || item.disabled) return false;
      return this.openKeySet.has(this.itemKey(item, index));
    },
    toggleItem(item, index) {
      if (!item || item.disabled) return;
      const key = this.itemKey(item, index);
      const currentlyOpen = this.isItemOpen(item, index);

      let nextKeys;
      if (this.multiple) {
        const currentList = Array.from(this.openKeySet);
        if (currentlyOpen) {
          if (!this.collapsible && currentList.length <= 1) return;
          nextKeys = currentList.filter((k) => k !== key);
        } else {
          nextKeys = [...currentList, key];
        }
      } else if (currentlyOpen) {
        if (!this.collapsible) return;
        nextKeys = [];
      } else {
        nextKeys = [key];
      }

      const nextOpen = !currentlyOpen;
      const nextValue = this.multiple
        ? nextKeys
        : nextKeys.length > 0
          ? nextKeys[0]
          : null;

      if (!this.isControlled) {
        this.internalOpenKeys = nextKeys;
      }

      this.$emit("update:modelValue", nextValue);
      this.$emit("change", { value: nextValue, openKeys: nextKeys });
      this.$emit("toggle", { item, index, open: nextOpen, value: nextValue });
      this.$emit(nextOpen ? "open" : "close", { item, index, value: nextValue });
    },
    findNextEnabledIndex(startIndex, direction) {
      const len = this.items.length;
      if (len === 0) return -1;
      for (let step = 1; step <= len; step += 1) {
        const idx = (startIndex + direction * step + len) % len;
        if (this.items[idx] && !this.items[idx].disabled) return idx;
      }
      return startIndex;
    },
    onKeydown(event, currentIndex) {
      if (!this.items.length) return;
      let targetIndex = null;

      if (event.key === "ArrowDown") {
        targetIndex = this.findNextEnabledIndex(currentIndex, 1);
      } else if (event.key === "ArrowUp") {
        targetIndex = this.findNextEnabledIndex(currentIndex, -1);
      } else if (event.key === "Home") {
        targetIndex = this.items.findIndex((item) => item && !item.disabled);
      } else if (event.key === "End") {
        for (let i = this.items.length - 1; i >= 0; i -= 1) {
          if (this.items[i] && !this.items[i].disabled) {
            targetIndex = i;
            break;
          }
        }
      }

      if (targetIndex !== null && targetIndex >= 0) {
        event.preventDefault();
        const btn = this.triggerRefs[targetIndex];
        if (btn && typeof btn.focus === "function") {
          btn.focus();
        }
      }
    },
  },
};
</script>

<style scoped>
.js-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  font-family: var(--js-font-family);
  line-height: var(--js-line-height);
  color: var(--js-color-text);
  text-align: left;
}

/* Variants */
.js-accordion--bordered {
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md);
  overflow: hidden;
}

.js-accordion--bordered .js-accordion__item + .js-accordion__item {
  border-top: 1px solid var(--js-color-divider);
}

.js-accordion--separated {
  gap: var(--js-space-2);
}

.js-accordion--separated .js-accordion__item {
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md);
  overflow: hidden;
}

.js-accordion--flush .js-accordion__item {
  border-bottom: 1px solid var(--js-color-divider);
}

.js-accordion--flush .js-accordion__item:first-child {
  border-top: 1px solid var(--js-color-divider);
}

.js-accordion__item {
  min-width: 0;
}

.js-accordion__heading {
  margin: 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.js-accordion__trigger {
  display: flex;
  align-items: center;
  gap: var(--js-space-3);
  width: 100%;
  min-width: 0;
  min-height: var(--js-touch-min);
  padding: var(--js-space-3) var(--js-space-4);
  border: 0;
  background-color: var(--js-color-surface-alt);
  color: var(--js-color-text);
  font-family: inherit;
  font-size: var(--js-font-size-md);
  font-weight: 600;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast);
}

.js-accordion--flush .js-accordion__trigger {
  background-color: transparent;
  padding-inline: var(--js-space-2);
}

.js-accordion__trigger:hover:not(:disabled) {
  background-color: var(--js-color-surface-hover);
}

.js-accordion__trigger:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: -2px;
  position: relative;
  z-index: 1;
}

.js-accordion__trigger--open {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-accordion--flush .js-accordion__trigger--open {
  background-color: transparent;
  color: var(--js-color-primary);
}

.js-accordion__trigger:disabled {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-disabled-text);
  opacity: 0.72;
  cursor: not-allowed;
}

.js-accordion--flush .js-accordion__trigger:disabled {
  background-color: transparent;
}

.js-accordion__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1em;
}

.js-accordion__label-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1 1 auto;
  min-width: 0;
}

.js-accordion__label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.js-accordion__sub-label {
  font-size: var(--js-font-size-sm);
  font-weight: 400;
  color: var(--js-color-text-muted);
  overflow-wrap: anywhere;
}

.js-accordion__trigger--open .js-accordion__sub-label {
  color: inherit;
  opacity: 0.85;
}

.js-accordion__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 1.25em;
  padding: 0.05em 0.45em;
  border-radius: var(--js-radius-pill);
  font-size: 0.75em;
  font-weight: 700;
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-accordion__trigger--open .js-accordion__badge {
  background-color: var(--js-color-primary);
  color: var(--js-color-primary-text);
}

.js-accordion__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--js-transition-fast);
}

.js-accordion__chevron--open {
  transform: rotate(180deg);
}

.js-accordion__panel {
  background-color: var(--js-color-surface);
  border-top: 1px solid var(--js-color-divider);
}

.js-accordion--flush .js-accordion__panel {
  background-color: transparent;
  border-top-color: transparent;
}

.js-accordion__panel[hidden] {
  display: none;
}

.js-accordion__body {
  padding: var(--js-space-4);
  min-width: 0;
  overflow-wrap: anywhere;
}

.js-accordion--flush .js-accordion__body {
  padding: var(--js-space-2) var(--js-space-2) var(--js-space-4);
}

/* Sizes */
.js-accordion--sm .js-accordion__trigger {
  font-size: var(--js-font-size-sm);
  padding: var(--js-space-2) var(--js-space-3);
  gap: var(--js-space-2);
}

.js-accordion--sm .js-accordion__body {
  padding: var(--js-space-3);
  font-size: var(--js-font-size-sm);
}

.js-accordion--lg .js-accordion__trigger {
  font-size: var(--js-font-size-lg);
  padding: var(--js-space-4) var(--js-space-5);
}

.js-accordion--lg .js-accordion__body {
  padding: var(--js-space-5);
}

/* Dark theme */
.js-accordion--dark {
  color: var(--js-color-text-inverse);
}

.js-accordion--dark.js-accordion--bordered,
.js-accordion--dark.js-accordion--separated .js-accordion__item {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
}

.js-accordion--dark.js-accordion--bordered .js-accordion__item + .js-accordion__item,
.js-accordion--dark.js-accordion--flush .js-accordion__item,
.js-accordion--dark.js-accordion--flush .js-accordion__item:first-child {
  border-color: var(--js-color-divider-dark);
}

.js-accordion--dark .js-accordion__trigger {
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
}

.js-accordion--dark.js-accordion--flush .js-accordion__trigger {
  background-color: transparent;
}

.js-accordion--dark .js-accordion__trigger:hover:not(:disabled) {
  background-color: var(--js-color-surface-dark-hover);
}

.js-accordion--dark .js-accordion__trigger--open {
  background-color: var(--js-color-surface-dark-hover);
  color: var(--js-color-primary-soft);
}

.js-accordion--dark.js-accordion--flush .js-accordion__trigger--open {
  background-color: transparent;
  color: var(--js-color-primary-soft);
}

.js-accordion--dark .js-accordion__trigger:disabled {
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse-muted);
  opacity: 0.5;
}

.js-accordion--dark .js-accordion__sub-label {
  color: var(--js-color-text-inverse-muted);
}

.js-accordion--dark .js-accordion__badge {
  background-color: var(--js-color-info-dark-bg);
  color: var(--js-color-info-dark-text);
}

.js-accordion--dark .js-accordion__trigger--open .js-accordion__badge {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-accordion--dark .js-accordion__panel {
  background-color: var(--js-color-surface-dark);
  border-top-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-accordion--dark.js-accordion--flush .js-accordion__panel {
  background-color: transparent;
  border-top-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .js-accordion__trigger,
  .js-accordion__chevron {
    transition: none;
  }
}
</style>
