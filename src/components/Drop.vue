<template>
  <div
    ref="rootRef"
    :class="['js-drop', { 'js-drop--triggered': hasTrigger }]"
    @keydown="onKeydown"
  >
    <div v-if="hasTrigger" ref="triggerWrapRef" class="js-drop__trigger-wrap">
      <slot
        name="trigger"
        :open="isOpen"
        :toggle="toggle"
        :panel-id="panelId"
      >
        <button
          ref="triggerBtnRef"
          type="button"
          class="js-drop__trigger"
          :aria-expanded="String(isOpen)"
          aria-haspopup="true"
          :aria-controls="panelId"
          @click="toggle"
        >
          <JsIcon v-if="triggerIcon" :name="triggerIcon" />
          <span>{{ triggerLabel }}</span>
          <JsIcon
            name="caret-down"
            :class="['js-drop__caret', { 'js-drop__caret--open': isOpen }]"
          />
        </button>
      </slot>
    </div>

    <div
      v-if="panelVisible"
      :id="panelId"
      ref="panelRef"
      :class="[
        'js-drop__panel',
        'js-drop__panel--' + size,
        'js-drop__panel--' + theme,
        { 'js-drop__panel--floating': hasTrigger },
        { 'js-drop__panel--right': panelAlignRight },
        { 'js-drop__panel--above': panelOpenAbove },
      ]"
      :role="hasTrigger ? 'region' : undefined"
      :aria-label="ariaLabel"
    >
      <slot :close="close">
        <component
          :is="component"
          v-if="component"
          v-bind="componentProps"
        />

        <JsTabs
          v-else-if="tabs && items.length"
          v-model="activeTab"
          :items="items"
          :theme="theme"
          size="sm"
          :parse-markdown="Boolean(parseMarkdown)"
          :aria-label="ariaLabel"
          @change="(payload) => $emit('tab-change', payload)"
        >
          <template #panel="{ item: tab }">
            <JsNavList
              :theme="theme"
              :items="tab.items || []"
              :parse-markdown="parseMarkdown"
              :menu="true"
              @select="onListSelect"
            />
          </template>
        </JsTabs>

        <JsNavList
          v-else-if="items.length"
          :theme="theme"
          :items="items"
          :parse-markdown="parseMarkdown"
          :menu="true"
          @select="onListSelect"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsNavList from "./NavList.vue";
import JsTabs from "./Tabs.vue";
import { createUid } from "../utils/uid.js";
import { computeDropdownPlacement } from "../utils/position.js";

export default {
  name: "JsDrop",
  components: {
    JsIcon,
    JsNavList,
    JsTabs,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    component: {
      type: [Object, Function, String],
      default: null,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    triggerLabel: {
      type: String,
      default: "",
    },
    triggerIcon: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: undefined,
    },
    right: {
      type: Boolean,
      default: false,
    },
    tabs: {
      type: Boolean,
      default: false,
    },
    tabSelected: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: "auto",
      validator(v) {
        return ["auto", "sm", "md", "lg"].includes(v);
      },
    },
    theme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    closeOnSelect: {
      type: Boolean,
      default: true,
    },
    ariaLabel: {
      type: String,
      default: "Dropdown menu",
    },
  },
  emits: ["update:modelValue", "open", "close", "select", "tab-change"],
  data() {
    return {
      panelId: createUid("js-drop"),
      internalOpen: false,
      activeTab: this.tabSelected,
      panelOpenAbove: false,
      panelAlignRight: Boolean(this.right),
    };
  },
  computed: {
    hasTrigger() {
      return Boolean(this.triggerLabel || this.$slots.trigger);
    },
    isControlled() {
      return this.modelValue !== undefined;
    },
    isOpen() {
      return this.isControlled ? Boolean(this.modelValue) : this.internalOpen;
    },
    panelVisible() {
      return this.hasTrigger ? this.isOpen : true;
    },
  },
  watch: {
    tabSelected(val) {
      this.activeTab = val;
    },
    activeTab() {
      if (this.hasTrigger && this.isOpen) {
        this.$nextTick(() => this.updatePlacement());
      }
    },
    isOpen(open) {
      if (open) {
        this.addListeners();
        this.$nextTick(() => this.updatePlacement());
      } else {
        this.removeListeners();
        this.panelOpenAbove = false;
      }
    },
    right(val) {
      if (!this.isOpen) {
        this.panelAlignRight = Boolean(val);
      }
    },
  },
  mounted() {
    if (this.hasTrigger && this.isOpen) {
      this.addListeners();
      this.$nextTick(() => this.updatePlacement());
    }
  },
  unmounted() {
    this.removeListeners();
  },
  methods: {
    open() {
      if (this.isOpen) return;
      this.panelOpenAbove = false;
      this.panelAlignRight = Boolean(this.right);
      this.internalOpen = true;
      this.$emit("update:modelValue", true);
      this.$emit("open");
    },
    close({ restoreFocus = false } = {}) {
      if (!this.isOpen) return;
      this.internalOpen = false;
      this.$emit("update:modelValue", false);
      this.$emit("close");
      if (restoreFocus) {
        const btn =
          this.$refs.triggerBtnRef ||
          this.$refs.triggerWrapRef?.querySelector(
            'button, a[href], [tabindex]:not([tabindex="-1"])'
          );
        if (btn && typeof btn.focus === "function") {
          btn.focus();
        }
      }
    },
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    updatePlacement() {
      if (!this.hasTrigger || !this.isOpen) return;
      const triggerEl = this.$refs.triggerWrapRef;
      const panelEl = this.$refs.panelRef;
      const { openAbove, alignRight } = computeDropdownPlacement(
        triggerEl,
        panelEl,
        { preferRight: Boolean(this.right) }
      );
      this.panelOpenAbove = openAbove;
      this.panelAlignRight = alignRight;
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
        this.close();
      }
    },
    onKeydown(event) {
      if (event.key === "Escape" && this.hasTrigger && this.isOpen) {
        event.stopPropagation();
        this.close({ restoreFocus: true });
      }
    },
    onListSelect(item, event) {
      this.$emit("select", item, event);
      const hasSubItems = Array.isArray(item?.items) && item.items.length > 0;
      if (this.hasTrigger && this.closeOnSelect && !hasSubItems) {
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.js-drop {
  position: relative;
  display: inline-block;
  max-width: 100%;
  font-family: var(--js-font-family);
}

.js-drop__trigger-wrap {
  display: inline-flex;
}

.js-drop__trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--js-space-2);
  min-height: var(--js-touch-min);
  padding: 0.45rem 0.85rem;
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  font-family: inherit;
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--js-transition-fast);
}

.js-drop__trigger:hover {
  background-color: var(--js-color-surface-hover);
}

.js-drop__trigger:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-drop__caret {
  transition: transform var(--js-transition-fast);
}

.js-drop__caret--open {
  transform: rotate(180deg);
}

.js-drop__panel {
  min-width: 11.5rem;
  max-width: calc(100vw - 1.5rem);
  padding: var(--js-space-2);
  border-radius: var(--js-radius-md);
  box-shadow: var(--js-shadow-md);
  text-align: left;
}

.js-drop__panel--floating {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: var(--js-z-dropdown);
}

.js-drop__panel--above {
  top: auto;
  bottom: calc(100% + 0.35rem);
}

.js-drop__panel--right {
  left: auto;
  right: 0;
}

.js-drop__panel--dark {
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
  border: 1px solid var(--js-color-divider-dark);
}

.js-drop__panel--light {
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  border: 1px solid var(--js-color-border);
}

.js-drop__panel--sm {
  width: min(13rem, calc(100vw - 1.5rem));
}

.js-drop__panel--md {
  width: min(18rem, calc(100vw - 1.5rem));
}

.js-drop__panel--lg {
  width: min(23rem, calc(100vw - 1.5rem));
}
</style>
