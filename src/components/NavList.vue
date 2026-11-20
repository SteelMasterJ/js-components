<template>
  <div :class="['js-nav-list', 'js-nav-list--' + theme]">
    <ul
      :class="['js-nav-list__items', { 'js-nav-list__items--scroll': shouldScroll }]"
      :role="menu ? 'menu' : undefined"
      :aria-label="ariaLabel || undefined"
    >
      <li
        v-for="(subItem, i) in items"
        :key="subItem.id != null ? subItem.id : i"
        :role="itemRole(subItem)"
        class="js-nav-list__entry"
      >
        <div v-if="subItem.header" class="js-nav-list__header">
          <JsMarkdown
            :parse="shouldParseHeader(subItem)"
            :val="subItem.label"
          />
        </div>

        <hr v-else-if="subItem.divider" class="js-nav-list__divider" />

        <div v-else-if="subItem.component" class="js-nav-list__custom">
          <component :is="subItem.component" v-bind="subItem.props || {}" />
        </div>

        <JsBtnSplit
          v-else-if="subItem.split && Array.isArray(subItem.items)"
          :items="subItem.items"
          :theme="theme === 'dark' ? 'light-text' : 'dark-text'"
          :size="subItem.size || size"
          :grow="subItem.grow || 'all'"
          :spaced="Boolean(subItem.spaced)"
          :drop-right="Boolean(subItem.dropRight)"
          :drop-size="subItem.dropSize || dropSize || 'auto'"
          :drop-theme="theme"
          :parse-markdown="subItem.parseMarkdown || parseMarkdown"
          @click="onSelect"
        />

        <slot v-else name="item" :item="subItem" :index="i">
          <JsNavItem
            :class="{ 'js-nav-list__thumb': Boolean(subItem.thumb) }"
            :child="true"
            :block="true"
            :size="subItem.size || size"
            :drop-size="subItem.dropSize || dropSize || 'auto'"
            :drop-theme="theme"
            :parse-markdown="subItem.parseMarkdown || parseMarkdown"
            :item="normalizeItem(subItem)"
            :theme="subItem.theme || (theme === 'dark' ? 'light-text' : 'dark-text')"
            @click="onSelect"
          />
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsNavItem from "./NavItem.vue";
import JsBtnSplit from "./BtnSplit.vue";

export default {
  name: "JsNavList",
  components: {
    JsMarkdown,
    JsNavItem,
    JsBtnSplit,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["xs", "sm", "md", "lg", "xl"].includes(v);
      },
    },
    dropSize: {
      type: String,
      default: "auto",
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    theme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    menu: {
      type: Boolean,
      default: false,
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
    ariaLabel: {
      type: String,
      default: "",
    },
  },
  emits: ["select", "click"],
  computed: {
    hasNestedItems() {
      return this.items.some(
        (item) => Array.isArray(item.items) && item.items.length > 0 && !item.split
      );
    },
    shouldScroll() {
      return this.scrollable && !this.hasNestedItems;
    },
  },
  methods: {
    itemRole(subItem) {
      if (!this.menu) return undefined;
      if (subItem.divider) return "separator";
      if (subItem.header) return "presentation";
      return "none";
    },
    shouldParseHeader(subItem) {
      const pm =
        subItem.parseMarkdown !== undefined
          ? subItem.parseMarkdown
          : this.parseMarkdown;
      if (typeof pm === "boolean") return pm;
      return Boolean(String(pm || "").match(/header|\*/));
    },
    normalizeItem(subItem) {
      if (
        Array.isArray(subItem.items) &&
        subItem.items.length > 0 &&
        subItem.actionIcon === undefined
      ) {
        return { ...subItem, actionIcon: "caret-right" };
      }
      return subItem;
    },
    onSelect(event, item) {
      this.$emit("click", event, item);
      this.$emit("select", item, event);
    },
  },
};
</script>

<style scoped>
.js-nav-list {
  font-family: var(--js-font-family);
  min-width: 0;
}

.js-nav-list__items {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}

.js-nav-list__items--scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 20rem;
}

.js-nav-list__entry {
  position: relative;
}

.js-nav-list__header {
  font-size: var(--js-font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.4rem 0.65rem 0.2rem;
}

.js-nav-list__entry:nth-child(n + 2) > .js-nav-list__header {
  margin-top: 0.35rem;
}

.js-nav-list__divider {
  border: 0;
  height: 1px;
  margin: 0.35rem 0;
}

.js-nav-list__custom {
  padding: 0.25rem 0.5rem;
}

.js-nav-list--light {
  color: var(--js-color-text);
}

.js-nav-list--light .js-nav-list__header {
  color: var(--js-color-text-muted);
}

.js-nav-list--light .js-nav-list__divider {
  background-color: var(--js-color-divider);
}

.js-nav-list--dark {
  color: var(--js-color-text-inverse);
}

.js-nav-list--dark .js-nav-list__header {
  color: var(--js-color-text-inverse-muted);
}

.js-nav-list--dark .js-nav-list__divider {
  background-color: var(--js-color-divider-dark);
}
</style>
