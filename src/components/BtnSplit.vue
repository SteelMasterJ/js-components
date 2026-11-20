<template>
  <div
    :class="[
      'js-btn-split',
      'js-btn-split--grow-' + grow,
      { 'js-btn-split--spaced': spaced },
    ]"
    role="group"
    :aria-label="resolvedAriaLabel"
  >
    <JsNavItem
      v-for="(item, i) in items"
      :key="item.id != null ? item.id : i"
      class="js-btn-split__item"
      :item="item"
      :theme="item.theme || theme"
      :circle="Boolean(item.circle || circle)"
      :thumb="Boolean(item.thumb || thumb)"
      :size="item.size || size"
      :drop-right="item.dropRight !== undefined ? item.dropRight : dropRight"
      :drop-tabs="Boolean(item.dropTabs)"
      :drop-tab-selected="item.dropTabSelected ?? 0"
      :drop-size="item.dropSize || dropSize"
      :drop-theme="item.dropTheme || dropTheme"
      :parse-markdown="item.parseMarkdown || parseMarkdown"
      @click="(event, payload) => $emit('click', event, payload)"
      @toggle="(open) => $emit('toggle', open, item)"
    />
  </div>
</template>

<script>
import JsNavItem from "./NavItem.vue";

export default {
  name: "JsBtnSplit",
  components: {
    JsNavItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    ariaLabel: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "md",
      validator(v) {
        return ["xs", "sm", "md", "lg"].includes(v);
      },
    },
    grow: {
      type: String,
      default: "none",
      validator(v) {
        return [
          "first",
          "first-hover",
          "first-hover-1",
          "last",
          "all",
          "none",
        ].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    circle: {
      type: Boolean,
      default: false,
    },
    thumb: {
      type: Boolean,
      default: false,
    },
    spaced: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
    },
    dropSize: {
      type: String,
      default: "auto",
      validator(value) {
        return ["auto", "sm", "md", "lg", "min"].includes(value);
      },
    },
    dropTheme: {
      type: String,
      default: "dark",
      validator(value) {
        return ["light", "dark"].includes(value);
      },
    },
    dropRight: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click", "toggle"],
  computed: {
    resolvedAriaLabel() {
      if (this.ariaLabel) return this.ariaLabel;
      const count = this.items.length;
      return `${count} ${count === 1 ? "action" : "actions"}`;
    },
  },
};
</script>

<style scoped>
.js-btn-split {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  gap: 1px;
}

.js-btn-split__item {
  display: flex;
}

/* Connected pill segments — direct child `>` keeps nested dropdown items untouched */
.js-btn-split:not(.js-btn-split--spaced)
  > .js-btn-split__item:not(:first-child):not(:last-child)
  > :deep(.js-nav-item__trigger) {
  border-radius: 0;
}

.js-btn-split:not(.js-btn-split--spaced)
  > .js-btn-split__item:first-child:not(:last-child)
  > :deep(.js-nav-item__trigger) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.js-btn-split:not(.js-btn-split--spaced)
  > .js-btn-split__item:last-child:not(:first-child)
  > :deep(.js-nav-item__trigger) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

/* Grow modes */
.js-btn-split--grow-first,
.js-btn-split--grow-first-hover,
.js-btn-split--grow-first-hover-1,
.js-btn-split--grow-last,
.js-btn-split--grow-all {
  display: flex;
  width: 100%;
}

.js-btn-split--grow-first > .js-btn-split__item:first-child,
.js-btn-split--grow-first-hover > .js-btn-split__item:first-child,
.js-btn-split--grow-first-hover-1 > .js-btn-split__item:first-child {
  flex: 1 1 auto;
}

.js-btn-split--grow-last > .js-btn-split__item:last-child {
  flex: 1 1 auto;
}

.js-btn-split--grow-all > .js-btn-split__item {
  flex: 1 1 0;
}

.js-btn-split--grow-all > .js-btn-split__item > :deep(.js-nav-item__trigger) {
  justify-content: center;
}

.js-btn-split--grow-all
  > .js-btn-split__item
  > :deep(.js-nav-item__trigger > .js-nav-item__labels) {
  flex: 0 1 auto;
}

/* Hover cascade for first-hover variants */
.js-btn-split--grow-first-hover-1
  > .js-btn-split__item:first-child:hover
  + .js-btn-split__item
  > :deep(.js-nav-item__trigger),
.js-btn-split--grow-first-hover
  > .js-btn-split__item:first-child:hover
  ~ .js-btn-split__item
  > :deep(.js-nav-item__trigger) {
  background-color: var(--js-color-primary-soft);
}

/* Spaced pill mode */
.js-btn-split--spaced {
  justify-content: space-between;
  gap: var(--js-space-2);
}

@media (max-width: 480px) {
  .js-btn-split {
    flex-wrap: wrap;
    row-gap: var(--js-space-1);
  }
}
</style>
