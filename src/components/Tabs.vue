<template>
  <div :class="['js-tabs', 'js-tabs--' + size, 'js-tabs--' + theme]">
    <div
      :class="['js-tabs__list', 'js-tabs__list--' + align]"
      role="tablist"
      :aria-label="ariaLabel"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, i) in items"
        :key="itemKey(item, i)"
        :ref="(el) => setTabRef(i, el)"
        type="button"
        role="tab"
        :id="tabId(i)"
        :aria-selected="isSelected(item, i) ? 'true' : 'false'"
        :aria-controls="panelId(i)"
        :tabindex="isSelected(item, i) ? 0 : -1"
        :disabled="Boolean(item.disabled)"
        :class="[
          'js-tabs__tab',
          { 'js-tabs__tab--active': isSelected(item, i) },
        ]"
        @click="selectTab(item, i)"
      >
        <slot name="tab-icon" :item="item" :index="i">
          <JsIcon v-if="item.icon" :name="item.icon" />
        </slot>
        <span class="js-tabs__label">
          <slot name="tab-label" :item="item" :index="i">
            <JsMarkdown :parse="parseMarkdown" :val="item.label" />
          </slot>
        </span>
        <span v-if="item.badge != null && item.badge !== ''" class="js-tabs__badge">
          {{ item.badge }}
        </span>
      </button>
    </div>

    <div class="js-tabs__panels">
      <section
        v-for="(item, i) in items"
        :key="itemKey(item, i)"
        v-show="isSelected(item, i)"
        role="tabpanel"
        :id="panelId(i)"
        :aria-labelledby="tabId(i)"
        :tabindex="isSelected(item, i) ? 0 : -1"
        class="js-tabs__panel"
      >
        <slot
          v-if="item.id != null && $slots['tab-' + item.id]"
          :name="'tab-' + item.id"
          :item="item"
          :index="i"
        />
        <slot
          v-else-if="$slots['tab' + i]"
          :name="'tab' + i"
          :item="item"
          :index="i"
        />
        <slot v-else name="panel" :item="item" :index="i">
          {{ item.content }}
        </slot>
      </section>
    </div>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import { createUid } from "../utils/uid.js";

export default {
  name: "JsTabs",
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
      type: [Number, String],
      default: null,
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
    align: {
      type: String,
      default: "stretch",
      validator(v) {
        return ["start", "center", "stretch"].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: false,
    },
    ariaLabel: {
      type: String,
      default: "Tabs",
    },
  },
  emits: ["update:modelValue", "change"],
  data() {
    return {
      uid: createUid("js-tabs"),
      internalValue: null,
      tabRefs: [],
    };
  },
  computed: {
    activeIndex() {
      const value =
        this.modelValue !== null && this.modelValue !== undefined
          ? this.modelValue
          : this.internalValue;

      if (typeof value === "number" && this.items[value] && !this.items[value].disabled) {
        return value;
      }
      if (typeof value === "string") {
        const byId = this.items.findIndex(
          (item) => item.id === value && !item.disabled
        );
        if (byId !== -1) return byId;
      }

      const preselected = this.items.findIndex(
        (item) => item.selected && !item.disabled
      );
      if (preselected !== -1) return preselected;

      const firstEnabled = this.items.findIndex((item) => !item.disabled);
      return firstEnabled !== -1 ? firstEnabled : 0;
    },
  },
  beforeUpdate() {
    this.tabRefs = [];
  },
  methods: {
    setTabRef(index, el) {
      if (el) {
        this.tabRefs[index] = el;
      }
    },
    itemKey(item, index) {
      return item.id != null ? item.id : index;
    },
    tabId(index) {
      return `${this.uid}-tab-${index}`;
    },
    panelId(index) {
      return `${this.uid}-panel-${index}`;
    },
    isSelected(item, index) {
      return index === this.activeIndex;
    },
    selectTab(item, index) {
      if (!item || item.disabled) return;
      const nextValue =
        typeof this.modelValue === "string" && item.id != null
          ? item.id
          : index;
      this.internalValue = nextValue;
      this.$emit("update:modelValue", nextValue);
      this.$emit("change", { item, index, value: nextValue });
    },
    findNextEnabledIndex(startIndex, direction) {
      const len = this.items.length;
      if (len === 0) return -1;
      for (let step = 1; step <= len; step += 1) {
        const idx = (startIndex + direction * step + len) % len;
        if (!this.items[idx].disabled) return idx;
      }
      return startIndex;
    },
    onKeydown(event) {
      if (!this.items.length) return;
      let targetIndex = null;

      if (event.key === "ArrowRight") {
        targetIndex = this.findNextEnabledIndex(this.activeIndex, 1);
      } else if (event.key === "ArrowLeft") {
        targetIndex = this.findNextEnabledIndex(this.activeIndex, -1);
      } else if (event.key === "Home") {
        targetIndex = this.items.findIndex((item) => !item.disabled);
      } else if (event.key === "End") {
        for (let i = this.items.length - 1; i >= 0; i -= 1) {
          if (!this.items[i].disabled) {
            targetIndex = i;
            break;
          }
        }
      }

      if (targetIndex !== null && targetIndex >= 0) {
        event.preventDefault();
        this.selectTab(this.items[targetIndex], targetIndex);
        this.$nextTick(() => {
          const btn = this.tabRefs[targetIndex];
          if (btn && typeof btn.focus === "function") {
            btn.focus();
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.js-tabs {
  font-family: var(--js-font-family);
  color: var(--js-color-text);
  min-width: 0;
}

.js-tabs__list {
  display: flex;
  align-items: stretch;
  gap: var(--js-space-1);
  overflow-x: auto;
  scrollbar-width: thin;
  background-color: var(--js-color-surface-alt);
  border-bottom: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md) var(--js-radius-md) 0 0;
  padding: var(--js-space-1) var(--js-space-1) 0;
}

.js-tabs__list--start {
  justify-content: flex-start;
}

.js-tabs__list--center {
  justify-content: center;
}

.js-tabs__list--stretch .js-tabs__tab {
  flex: 1 1 auto;
}

.js-tabs__tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--js-space-2);
  min-height: var(--js-touch-min);
  padding: var(--js-space-2) var(--js-space-4);
  border: 0;
  border-radius: var(--js-radius-sm) var(--js-radius-sm) 0 0;
  background: transparent;
  color: var(--js-color-text-muted);
  font-family: inherit;
  font-size: var(--js-font-size-md);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast);
}

.js-tabs__tab:hover:not(:disabled):not(.js-tabs__tab--active) {
  background-color: var(--js-color-surface-hover);
  color: var(--js-color-text);
}

.js-tabs__tab:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: -2px;
}

.js-tabs__tab--active {
  color: var(--js-color-primary);
  background-color: var(--js-color-surface);
}

.js-tabs__tab--active::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 3px;
  background-color: var(--js-color-primary);
  border-radius: 3px 3px 0 0;
}

.js-tabs__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.js-tabs__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25em;
  padding: 0.05em 0.4em;
  border-radius: var(--js-radius-pill);
  font-size: 0.75em;
  font-weight: 700;
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-tabs__panel {
  padding: var(--js-space-4);
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-top: 0;
  border-radius: 0 0 var(--js-radius-md) var(--js-radius-md);
}

.js-tabs__panel:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: -2px;
}

/* Sizes */
.js-tabs--sm .js-tabs__tab {
  font-size: var(--js-font-size-sm);
  padding: var(--js-space-1) var(--js-space-3);
}

.js-tabs--lg .js-tabs__tab {
  font-size: var(--js-font-size-lg);
  padding: var(--js-space-3) var(--js-space-5);
}

/* Dark theme */
.js-tabs--dark {
  color: var(--js-color-text-inverse);
}

.js-tabs--dark .js-tabs__list {
  background-color: var(--js-color-surface-dark);
  border-bottom-color: var(--js-color-divider-dark);
}

.js-tabs--dark .js-tabs__tab {
  color: var(--js-color-text-inverse-muted);
}

.js-tabs--dark .js-tabs__tab:hover:not(:disabled):not(.js-tabs__tab--active) {
  background-color: var(--js-color-surface-dark-hover);
  color: var(--js-color-text-inverse);
}

.js-tabs--dark .js-tabs__tab--active {
  background-color: var(--js-color-surface-dark-hover);
  color: var(--js-color-text-inverse);
}

.js-tabs--dark .js-tabs__tab--active::after {
  background-color: var(--js-color-primary-soft);
}

.js-tabs--dark .js-tabs__panel {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}
</style>
