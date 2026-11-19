<template>
  <div
    ref="rootRef"
    :class="[
      'js-nav-item',
      'js-nav-item--' + resolvedSize,
      'js-nav-item--' + (isDisabled ? 'disabled' : resolvedTheme),
      { 'js-nav-item--inset': Boolean(item.inset || inset) },
      { 'js-nav-item--circle': isCircle },
      { 'js-nav-item--thumb': isThumb },
      { 'js-nav-item--block': Boolean(item.block || block) },
      { 'js-nav-item--open': dropdownOpen },
    ]"
    @keydown="onRootKeydown"
  >
    <component
      :is="resolvedTag"
      ref="triggerRef"
      :id="item.id || undefined"
      :class="[
        'js-nav-item__trigger',
        { 'js-nav-item__trigger--active': isActive },
        { 'js-nav-item__trigger--tip': Boolean(item.tip) },
        item.tip ? 'js-nav-item__trigger--tip-' + (item.tipPos || 'tr') : '',
      ]"
      :data-test-id="item.dataTestId || undefined"
      :data-tip="item.tip || undefined"
      :title="item.tip || undefined"
      :type="resolvedTag === 'button' ? resolvedButtonType : undefined"
      :disabled="resolvedTag === 'button' ? isDisabled : undefined"
      :aria-disabled="resolvedTag !== 'button' && isDisabled ? 'true' : undefined"
      :tabindex="resolvedTag !== 'button' && isDisabled ? -1 : undefined"
      :href="resolvedHref"
      :to="resolvedTag === 'router-link' ? resolvedTo : undefined"
      :target="isExternal ? '_blank' : undefined"
      :rel="isExternal ? 'noopener noreferrer' : undefined"
      :aria-current="isActive && resolvedTag !== 'button' ? 'page' : undefined"
      :aria-haspopup="hasDropdown ? 'menu' : undefined"
      :aria-expanded="hasDropdown ? String(dropdownOpen) : undefined"
      :aria-controls="hasDropdown ? dropdownId : undefined"
      @click="onTriggerClick"
    >
      <span v-if="hasTags" class="js-nav-item__tags">
        <slot name="tags" :item="item">
          <JsNavItemTags :item="item" />
        </slot>
      </span>

      <JsNavItemIcon
        v-if="hasIconOrMedia"
        :item="item"
        :circle="isCircle"
        :thumb="isThumb"
        class="js-nav-item__media"
      >
        <template v-if="$slots.icon" #default>
          <slot name="icon" :item="item" />
        </template>
      </JsNavItemIcon>

      <slot :item="item" />

      <JsNavItemLabels
        v-if="item.label || item.subLabel"
        :item="item"
        :parse-markdown="parseMarkdown"
        :wrap="wrap"
        :wrap-label="wrapLabel"
        :wrap-sub-label="wrapSubLabel"
        class="js-nav-item__labels"
      />

      <JsNavItemNotify
        v-if="hasNotify"
        :item="item"
        :notify-color="item.notifyColor || notifyColor"
        class="js-nav-item__notify"
      >
        <template v-if="$slots['notify-icon']" #icon>
          <slot name="notify-icon" :item="item" />
        </template>
      </JsNavItemNotify>

      <JsNavItemActions
        v-if="hasAction"
        :item="item"
        class="js-nav-item__action"
      >
        <template v-if="$slots.action" #default="{ action }">
          <slot name="action" :item="item" :action="action" />
        </template>
      </JsNavItemActions>
    </component>

    <div
      v-if="hasDropdown && dropdownOpen"
      :id="dropdownId"
      ref="dropRef"
      :class="[
        'js-nav-item__drop',
        'js-nav-item__drop--' + resolvedDropSize,
        'js-nav-item__drop--' + resolvedDropTheme,
        { 'js-nav-item__drop--right': dropAlignRight },
        { 'js-nav-item__drop--above': dropOpenAbove },
        { 'js-nav-item__drop--scrollable': !hasNestedDropdowns },
        { 'js-nav-item__drop--child': child },
      ]"
      role="menu"
      :aria-label="item.label ? `${item.label} menu` : 'Submenu'"
    >
      <slot name="dropdown" :items="item.items" :close="closeDropdown">
        <JsTabs
          v-if="isDropTabs"
          v-model="activeDropTab"
          :items="item.items"
          :theme="resolvedDropTheme"
          size="sm"
          :parse-markdown="Boolean(item.parseMarkdown || parseMarkdown)"
          :aria-label="item.label ? `${item.label} tabs` : 'Menu tabs'"
        >
          <template #panel="{ item: tab }">
            <ul class="js-nav-item__menu-list" role="none">
              <li
                v-for="(sub, idx) in tab.items || []"
                :key="sub.id || idx"
                :role="sub.divider ? 'separator' : sub.header ? 'presentation' : 'none'"
                class="js-nav-item__menu-entry"
              >
                <span v-if="sub.header" class="js-nav-item__menu-header">
                  <JsMarkdown
                    :parse="Boolean(item.parseMarkdown || parseMarkdown)"
                    :val="sub.label"
                  />
                </span>
                <hr v-else-if="sub.divider" class="js-nav-item__menu-divider" />
                <JsNavItem
                  v-else
                  :item="childItemProps(sub)"
                  :child="true"
                  :block="true"
                  :size="sub.size || 'sm'"
                  :theme="resolvedDropTheme === 'dark' ? 'light-text' : 'dark-text'"
                  :drop-theme="resolvedDropTheme"
                  :drop-size="resolvedDropSize"
                  :parse-markdown="sub.parseMarkdown || item.parseMarkdown || parseMarkdown"
                  @click="onChildClick"
                />
              </li>
            </ul>
          </template>
        </JsTabs>

        <ul v-else class="js-nav-item__menu-list" role="none">
          <li
            v-for="(sub, idx) in item.items"
            :key="sub.id || idx"
            :role="sub.divider ? 'separator' : sub.header ? 'presentation' : 'none'"
            class="js-nav-item__menu-entry"
          >
            <span v-if="sub.header" class="js-nav-item__menu-header">
              <JsMarkdown
                :parse="Boolean(item.parseMarkdown || parseMarkdown)"
                :val="sub.label"
              />
            </span>
            <hr v-else-if="sub.divider" class="js-nav-item__menu-divider" />
            <JsNavItem
              v-else
              :item="childItemProps(sub)"
              :child="true"
              :block="true"
              :size="sub.size || 'sm'"
              :theme="resolvedDropTheme === 'dark' ? 'light-text' : 'dark-text'"
              :drop-theme="resolvedDropTheme"
              :drop-size="resolvedDropSize"
              :parse-markdown="sub.parseMarkdown || item.parseMarkdown || parseMarkdown"
              @click="onChildClick"
            />
          </li>
        </ul>
      </slot>
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsTabs from "./Tabs.vue";
import JsNavItemTags from "./NavItem/NavItemTags.vue";
import JsNavItemIcon from "./NavItem/NavItemIcon.vue";
import JsNavItemLabels from "./NavItem/NavItemLabels.vue";
import JsNavItemNotify from "./NavItem/NavItemNotify.vue";
import JsNavItemActions from "./NavItem/NavItemActions.vue";
import { createUid } from "../utils/uid.js";
import { resolveLinkTag } from "../utils/router.js";
import { computeDropdownPlacement } from "../utils/position.js";

const VALID_THEMES = [
  "light",
  "light-text",
  "lightblue",
  "dark",
  "dark-text",
  "blue",
  "blue-text",
  "darkblue",
  "darkblue-text",
  "green",
  "green-text",
  "orange",
  "orange-text",
  "lightorange",
  "purple",
  "purple-text",
  "heading",
  "headingdark",
  "light-xray",
  "dark-xray",
];

const VALID_BUTTON_TYPES = ["button", "submit", "reset"];

export default {
  name: "JsNavItem",
  components: {
    JsMarkdown,
    JsTabs,
    JsNavItemTags,
    JsNavItemIcon,
    JsNavItemLabels,
    JsNavItemNotify,
    JsNavItemActions,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl", "xxl"].includes(value);
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
    child: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    wrap: {
      type: Boolean,
      default: false,
    },
    wrapLabel: {
      type: Boolean,
      default: false,
    },
    wrapSubLabel: {
      type: Boolean,
      default: false,
    },
    inset: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    thumb: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return VALID_THEMES.includes(v);
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
    dropTabs: {
      type: Boolean,
      default: false,
    },
    dropTabSelected: {
      type: Number,
      default: 0,
    },
    dropSize: {
      type: String,
      default: "auto",
      validator(v) {
        return ["auto", "sm", "md", "lg", "min"].includes(v);
      },
    },
    dropTheme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    notifyColor: {
      type: String,
      default: "orange",
      validator(v) {
        return [
          "grey",
          "gray",
          "blue",
          "green",
          "red",
          "orange",
          "light",
          "white",
        ].includes(v);
      },
    },
  },
  emits: ["click", "toggle"],
  data() {
    return {
      dropdownId: createUid("js-nav-drop"),
      dropdownOpen: false,
      dropOpenAbove: false,
      dropAlignRight: Boolean(this.item.dropRight || this.dropRight),
      activeDropTab: this.item.dropTabSelected ?? this.dropTabSelected ?? 0,
    };
  },
  watch: {
    activeDropTab() {
      if (this.dropdownOpen) {
        this.$nextTick(() => this.updateDropdownPlacement());
      }
    },
    dropRight(val) {
      if (!this.dropdownOpen) {
        this.dropAlignRight = Boolean(this.item.dropRight || val);
      }
    },
  },
  computed: {
    isDisabled() {
      return Boolean(this.item.disabled || this.disabled);
    },
    isActive() {
      return Boolean(this.item.active || this.active);
    },
    isCircle() {
      return Boolean(this.item.circle || this.circle);
    },
    isThumb() {
      return Boolean(this.item.thumb || this.thumb);
    },
    resolvedSize() {
      return this.item.size || this.size || "md";
    },
    resolvedTheme() {
      return this.item.theme || this.theme || "light";
    },
    hasDropdown() {
      return Boolean(Array.isArray(this.item.items) && this.item.items.length > 0);
    },
    hasNestedDropdowns() {
      if (!this.hasDropdown) return false;
      return this.item.items.some(
        (sub) => Array.isArray(sub.items) && sub.items.length > 0
      );
    },
    isDropTabs() {
      return Boolean(this.item.dropTabs || this.dropTabs);
    },
    resolvedDropSize() {
      return this.item.dropSize || this.dropSize || "auto";
    },
    resolvedDropTheme() {
      return this.item.dropTheme || this.dropTheme || "dark";
    },
    isExternal() {
      return Boolean(this.item.linkExt);
    },
    externalHref() {
      return this.item.linkExt || "";
    },
    resolvedTo() {
      return this.item.link || this.item.route || "";
    },
    resolvedTag() {
      return resolveLinkTag(this, {
        to: this.resolvedTo,
        href: this.externalHref,
        isButton: Boolean(this.item.button || this.item.onClick),
        hasDropdown: this.hasDropdown,
      });
    },
    resolvedButtonType() {
      if (
        typeof this.item.button === "string" &&
        VALID_BUTTON_TYPES.includes(this.item.button)
      ) {
        return this.item.button;
      }
      return "button";
    },
    resolvedHref() {
      if (this.resolvedTag !== "a") return undefined;
      if (this.isDisabled) return undefined;
      if (this.externalHref) return this.externalHref;
      if (typeof this.resolvedTo === "string" && this.resolvedTo) {
        return this.resolvedTo;
      }
      return undefined;
    },
    hasTags() {
      return Boolean(
        this.$slots.tags ||
          (typeof this.item.tags === "string" && this.item.tags.length > 0) ||
          (Array.isArray(this.item.tags) && this.item.tags.length > 0)
      );
    },
    hasIconOrMedia() {
      return Boolean(
        this.$slots.icon ||
          this.item.icon ||
          this.item.img ||
          this.item.number != null
      );
    },
    hasNotify() {
      return Boolean(
        this.$slots["notify-icon"] ||
          this.item.notifyCount > 0 ||
          this.item.notifyLabel ||
          this.item.notifyIcon
      );
    },
    hasAction() {
      if (this.$slots.action) return true;
      if (this.item.actionIcon === false) return false;
      return Boolean(
        this.item.actionIcon ||
          this.item.linkExt ||
          this.item.wait ||
          this.item.check ||
          this.item.arrow ||
          this.hasDropdown ||
          this.item.kabob
      );
    },
  },
  mounted() {
    if (typeof document !== "undefined") {
      document.addEventListener("click", this.onDocumentClick);
    }
  },
  unmounted() {
    if (typeof document !== "undefined") {
      document.removeEventListener("click", this.onDocumentClick);
    }
    this.removePositionListeners();
  },
  methods: {
    childItemProps(sub) {
      if (sub.items && sub.items.length && sub.actionIcon === undefined) {
        return { ...sub, actionIcon: "caret-right" };
      }
      return sub;
    },
    updateDropdownPlacement() {
      if (!this.dropdownOpen) return;
      const triggerEl = this.$refs.triggerRef?.$el || this.$refs.triggerRef;
      const dropEl = this.$refs.dropRef;
      const { openAbove, alignRight } = computeDropdownPlacement(
        triggerEl,
        dropEl,
        {
          preferRight: Boolean(this.item.dropRight || this.dropRight),
        }
      );
      this.dropOpenAbove = openAbove;
      this.dropAlignRight = alignRight;
    },
    addPositionListeners() {
      if (typeof window === "undefined") return;
      window.addEventListener("resize", this.updateDropdownPlacement, {
        passive: true,
      });
      window.addEventListener("scroll", this.updateDropdownPlacement, {
        passive: true,
        capture: true,
      });
    },
    removePositionListeners() {
      if (typeof window === "undefined") return;
      window.removeEventListener("resize", this.updateDropdownPlacement);
      window.removeEventListener("scroll", this.updateDropdownPlacement, {
        capture: true,
      });
    },
    openDropdown() {
      if (!this.hasDropdown || this.isDisabled) return;
      this.dropOpenAbove = false;
      this.dropAlignRight = Boolean(this.item.dropRight || this.dropRight);
      this.dropdownOpen = true;
      this.$emit("toggle", true);
      this.addPositionListeners();
      this.$nextTick(() => this.updateDropdownPlacement());
    },
    closeDropdown({ restoreFocus = false } = {}) {
      if (!this.dropdownOpen) return;
      this.dropdownOpen = false;
      this.dropOpenAbove = false;
      this.removePositionListeners();
      this.$emit("toggle", false);
      if (restoreFocus && this.$refs.triggerRef) {
        const el = this.$refs.triggerRef.$el || this.$refs.triggerRef;
        if (el && typeof el.focus === "function") {
          el.focus();
        }
      }
    },
    toggleDropdown() {
      if (this.dropdownOpen) {
        this.closeDropdown();
      } else {
        this.openDropdown();
      }
    },
    onTriggerClick(event) {
      if (this.isDisabled) {
        event.preventDefault();
        return;
      }
      if (this.hasDropdown) {
        event.preventDefault();
        this.toggleDropdown();
      }
      if (typeof this.item.onClick === "function") {
        if (this.resolvedTag === "button" && this.resolvedButtonType === "button") {
          event.preventDefault();
        }
        this.item.onClick(event, this.item);
      }
      this.$emit("click", event, this.item);
    },
    onChildClick(event, subItem) {
      // Close parent dropdown when a leaf child item is activated
      if (!subItem || !subItem.items || !subItem.items.length) {
        this.closeDropdown();
      }
    },
    onDocumentClick(event) {
      if (!this.dropdownOpen) return;
      const root = this.$refs.rootRef;
      if (root && !root.contains(event.target)) {
        this.closeDropdown();
      }
    },
    onRootKeydown(event) {
      if (event.key === "Escape" && this.dropdownOpen) {
        event.stopPropagation();
        this.closeDropdown({ restoreFocus: true });
      }
    },
  },
};
</script>

<style scoped>
.js-nav-item {
  position: relative;
  display: inline-flex;
  min-width: 0;
  max-width: 100%;
  font-family: var(--js-font-family);
}

.js-nav-item--block {
  display: flex;
  width: 100%;
}

.js-nav-item__trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.55em;
  width: 100%;
  min-width: 0;
  min-height: var(--js-touch-min);
  padding: 0.5em 0.8em;
  border: 1px solid transparent;
  border-radius: var(--js-radius-pill);
  background-color: var(--js-color-surface);
  color: var(--js-color-primary-hover);
  font-family: inherit;
  font-size: var(--js-font-size-md);
  font-weight: 600;
  line-height: 1.3;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast), border-color var(--js-transition-fast),
    box-shadow var(--js-transition-fast);
}

.js-nav-item__trigger:hover,
.js-nav-item__trigger--active {
  background-color: var(--js-color-primary-soft);
}

.js-nav-item__trigger:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-nav-item__tags {
  position: absolute;
  z-index: 1;
  top: -0.65em;
  inset-inline-start: 0.35em;
  pointer-events: none;
}

.js-nav-item__action {
  margin-inline-start: auto;
}

/* Accessible Tooltip on hover AND focus-visible */
.js-nav-item__trigger--tip::after {
  content: attr(data-tip);
  position: absolute;
  z-index: var(--js-z-tooltip);
  padding: 0.25rem 0.5rem;
  border-radius: var(--js-radius-sm);
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
  font-size: var(--js-font-size-xs);
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--js-transition-fast);
}

.js-nav-item__trigger--tip:hover::after,
.js-nav-item__trigger--tip:focus-visible::after {
  opacity: 1;
  visibility: visible;
}

.js-nav-item__trigger--tip-tr::after {
  bottom: calc(100% + 0.35rem);
  right: 0;
}

.js-nav-item__trigger--tip-tl::after {
  bottom: calc(100% + 0.35rem);
  left: 0;
}

.js-nav-item__trigger--tip-t::after {
  bottom: calc(100% + 0.35rem);
  left: 50%;
  transform: translateX(-50%);
}

.js-nav-item__trigger--tip-br::after {
  top: calc(100% + 0.35rem);
  right: 0;
}

.js-nav-item__trigger--tip-bl::after {
  top: calc(100% + 0.35rem);
  left: 0;
}

.js-nav-item__trigger--tip-b::after {
  top: calc(100% + 0.35rem);
  left: 50%;
  transform: translateX(-50%);
}

.js-nav-item__trigger--tip-l::after {
  right: calc(100% + 0.35rem);
  top: 50%;
  transform: translateY(-50%);
}

.js-nav-item__trigger--tip-r::after {
  left: calc(100% + 0.35rem);
  top: 50%;
  transform: translateY(-50%);
}

/* Sizes */
.js-nav-item--xs .js-nav-item__trigger {
  font-size: var(--js-font-size-xs);
  min-height: 1.85rem;
  padding: 0.25em 0.55em;
  gap: 0.35em;
}

.js-nav-item--sm .js-nav-item__trigger {
  font-size: var(--js-font-size-sm);
  min-height: 2rem;
  padding: 0.35em 0.65em;
  gap: 0.45em;
}

.js-nav-item--lg .js-nav-item__trigger {
  font-size: var(--js-font-size-lg);
  padding: 0.6em 1em;
}

.js-nav-item--xl .js-nav-item__trigger {
  font-size: var(--js-font-size-xl);
  padding: 0.65em 1.1em;
}

.js-nav-item--xxl .js-nav-item__trigger {
  font-size: clamp(1.75rem, 5vw, 3rem);
  border-radius: var(--js-radius-md);
  padding: 0.25em 0.5em;
}

/* Shape Variants */
.js-nav-item--inset .js-nav-item__trigger {
  box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.12);
}

.js-nav-item--circle .js-nav-item__trigger {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  padding: var(--js-space-3);
  gap: var(--js-space-1);
}

.js-nav-item--circle .js-nav-item__labels {
  flex: 0 1 auto;
  text-align: center;
  max-width: 100%;
}

.js-nav-item--circle .js-nav-item__media {
  font-size: 2rem;
}

.js-nav-item--circle .js-nav-item__action {
  margin-inline-start: 0;
}

.js-nav-item--thumb .js-nav-item__trigger {
  flex-direction: column;
  justify-content: flex-end;
  padding: 0;
  border-radius: var(--js-radius-md);
  overflow: hidden;
  width: min(100%, 11rem);
  gap: 0;
}

.js-nav-item--thumb .js-nav-item__media {
  width: 100%;
}

.js-nav-item--thumb :deep(.js-nav-item-thumb) {
  width: 100%;
  border-radius: 0;
}

.js-nav-item--thumb .js-nav-item__labels {
  width: 100%;
  padding: var(--js-space-2);
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--js-color-text);
}

.js-nav-item--thumb .js-nav-item__notify {
  position: absolute;
  top: var(--js-space-2);
  right: var(--js-space-2);
}

.js-nav-item--thumb .js-nav-item__tags {
  top: var(--js-space-2);
  inset-inline-start: var(--js-space-2);
}

/* Disabled */
.js-nav-item--disabled .js-nav-item__trigger {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-disabled-text);
  opacity: 0.72;
  cursor: not-allowed;
}

.js-nav-item--disabled .js-nav-item__trigger:hover {
  background-color: var(--js-color-disabled-bg);
}

/* Themes (WCAG 2.1 AA contrast compliant) */
.js-nav-item--light .js-nav-item__trigger {
  background-color: var(--js-color-surface);
  color: var(--js-color-primary-hover);
  border-color: var(--js-color-border);
}

.js-nav-item--light .js-nav-item__trigger:hover,
.js-nav-item--light .js-nav-item__trigger--active {
  background-color: var(--js-color-primary-soft);
}

.js-nav-item--light-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-text-inverse);
}

.js-nav-item--light-text .js-nav-item__trigger:hover,
.js-nav-item--light-text .js-nav-item__trigger--active {
  background-color: rgba(255, 255, 255, 0.16);
}

.js-nav-item--dark .js-nav-item__trigger {
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
}

.js-nav-item--dark .js-nav-item__trigger:hover,
.js-nav-item--dark .js-nav-item__trigger--active {
  background-color: var(--js-color-surface-dark-hover);
}

.js-nav-item--dark-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-text);
}

.js-nav-item--dark-text .js-nav-item__trigger:hover,
.js-nav-item--dark-text .js-nav-item__trigger--active {
  background-color: var(--js-color-surface-hover);
}

.js-nav-item--lightblue .js-nav-item__trigger {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-nav-item--lightblue .js-nav-item__trigger:hover,
.js-nav-item--lightblue .js-nav-item__trigger--active {
  background-color: #cfe8f3;
}

.js-nav-item--blue .js-nav-item__trigger {
  background-color: var(--js-color-primary);
  color: var(--js-color-primary-text);
}

.js-nav-item--blue .js-nav-item__trigger:hover,
.js-nav-item--blue .js-nav-item__trigger--active {
  background-color: var(--js-color-primary-hover);
}

.js-nav-item--blue-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-primary);
}

.js-nav-item--blue-text .js-nav-item__trigger:hover,
.js-nav-item--blue-text .js-nav-item__trigger--active {
  background-color: var(--js-color-primary-soft);
}

.js-nav-item--darkblue .js-nav-item__trigger {
  background-color: var(--js-color-primary-hover);
  color: var(--js-color-primary-text);
}

.js-nav-item--darkblue .js-nav-item__trigger:hover,
.js-nav-item--darkblue .js-nav-item__trigger--active {
  background-color: #0e3b4e;
}

.js-nav-item--darkblue-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-primary-hover);
}

.js-nav-item--darkblue-text .js-nav-item__trigger:hover,
.js-nav-item--darkblue-text .js-nav-item__trigger--active {
  background-color: var(--js-color-primary-soft);
}

.js-nav-item--green .js-nav-item__trigger {
  background-color: var(--js-color-success);
  color: var(--js-color-text-inverse);
}

.js-nav-item--green .js-nav-item__trigger:hover,
.js-nav-item--green .js-nav-item__trigger--active {
  background-color: var(--js-color-success-hover);
}

.js-nav-item--green-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-success);
}

.js-nav-item--green-text .js-nav-item__trigger:hover,
.js-nav-item--green-text .js-nav-item__trigger--active {
  background-color: rgba(30, 126, 52, 0.12);
}

.js-nav-item--orange .js-nav-item__trigger {
  background-color: var(--js-color-orange);
  color: var(--js-color-text-inverse);
}

.js-nav-item--orange .js-nav-item__trigger:hover,
.js-nav-item--orange .js-nav-item__trigger--active {
  background-color: var(--js-color-orange-hover);
}

.js-nav-item--orange-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-orange);
}

.js-nav-item--orange-text .js-nav-item__trigger:hover,
.js-nav-item--orange-text .js-nav-item__trigger--active {
  background-color: rgba(184, 86, 0, 0.12);
}

.js-nav-item--lightorange .js-nav-item__trigger {
  background-color: #fff2e6;
  color: var(--js-color-orange-hover);
}

.js-nav-item--lightorange .js-nav-item__trigger:hover,
.js-nav-item--lightorange .js-nav-item__trigger--active {
  background-color: #ffe0c4;
}

.js-nav-item--purple .js-nav-item__trigger {
  background-color: var(--js-color-purple);
  color: var(--js-color-text-inverse);
}

.js-nav-item--purple .js-nav-item__trigger:hover,
.js-nav-item--purple .js-nav-item__trigger--active {
  background-color: var(--js-color-purple-hover);
}

.js-nav-item--purple-text .js-nav-item__trigger {
  background-color: transparent;
  color: var(--js-color-purple);
}

.js-nav-item--purple-text .js-nav-item__trigger:hover,
.js-nav-item--purple-text .js-nav-item__trigger--active {
  background-color: rgba(123, 56, 150, 0.12);
}

.js-nav-item--heading .js-nav-item__trigger,
.js-nav-item--headingdark .js-nav-item__trigger {
  background-color: transparent;
  border-radius: var(--js-radius-md);
  padding: 0.25em 0.5em;
  font-size: 1.5rem;
}

.js-nav-item--heading .js-nav-item__trigger {
  color: var(--js-color-text);
}

.js-nav-item--heading .js-nav-item__trigger:hover {
  background-color: var(--js-color-surface-hover);
}

.js-nav-item--headingdark .js-nav-item__trigger {
  color: var(--js-color-text-inverse);
}

.js-nav-item--headingdark .js-nav-item__trigger:hover {
  background-color: rgba(255, 255, 255, 0.14);
}

.js-nav-item--light-xray .js-nav-item__trigger {
  background-color: rgba(255, 255, 255, 0.85);
  color: var(--js-color-text);
  backdrop-filter: blur(4px);
}

.js-nav-item--light-xray .js-nav-item__trigger:hover,
.js-nav-item--light-xray .js-nav-item__trigger--active {
  background-color: var(--js-color-surface);
}

.js-nav-item--dark-xray .js-nav-item__trigger {
  background-color: rgba(15, 23, 42, 0.55);
  color: var(--js-color-text-inverse);
  backdrop-filter: blur(4px);
}

.js-nav-item--dark-xray .js-nav-item__trigger:hover,
.js-nav-item--dark-xray .js-nav-item__trigger--active {
  background-color: rgba(15, 23, 42, 0.78);
}

/* Dropdown menu */
.js-nav-item__drop {
  position: absolute;
  top: calc(100% + 0.35rem);
  left: 0;
  z-index: var(--js-z-dropdown);
  min-width: 12rem;
  max-width: calc(100vw - 1.5rem);
  padding: var(--js-space-2);
  border-radius: var(--js-radius-md);
  box-shadow: var(--js-shadow-md);
  text-align: left;
}

.js-nav-item__drop--scrollable {
  max-height: calc(100vh - 1.5rem);
  max-height: calc(100dvh - 1.5rem);
  overflow-y: auto;
}

.js-nav-item__drop--above {
  top: auto;
  bottom: calc(100% + 0.35rem);
}

.js-nav-item__drop--right {
  left: auto;
  right: 0;
}

.js-nav-item__drop--child {
  top: 0;
  left: calc(100% + 0.25rem);
}

.js-nav-item__drop--child.js-nav-item__drop--above {
  top: auto;
  bottom: 0;
}

.js-nav-item__drop--child.js-nav-item__drop--right {
  left: auto;
  right: calc(100% + 0.25rem);
}

.js-nav-item__drop--sm {
  width: min(13rem, calc(100vw - 1.5rem));
}

.js-nav-item__drop--md {
  width: min(18rem, calc(100vw - 1.5rem));
}

.js-nav-item__drop--lg {
  width: min(23rem, calc(100vw - 1.5rem));
}

.js-nav-item__drop--min {
  min-width: unset;
}

.js-nav-item__drop--dark {
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
  border: 1px solid var(--js-color-divider-dark);
}

.js-nav-item__drop--light {
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  border: 1px solid var(--js-color-border);
}

.js-nav-item__menu-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.js-nav-item__menu-entry {
  display: block;
}

.js-nav-item__menu-header {
  display: block;
  padding: 0.35rem 0.65rem 0.2rem;
  font-size: var(--js-font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.78;
}

.js-nav-item__menu-divider {
  border: 0;
  border-top: 1px solid currentColor;
  opacity: 0.18;
  margin: 0.35rem 0;
}

@media (max-width: 640px) {
  .js-nav-item__drop--child,
  .js-nav-item__drop--child.js-nav-item__drop--right {
    position: static;
    width: 100%;
    margin-top: var(--js-space-1);
    box-shadow: none;
  }
}
</style>
