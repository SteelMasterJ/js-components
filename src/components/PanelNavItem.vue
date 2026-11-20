<template>
  <JsNavItem
    :item="item"
    :size="size"
    :active="active"
    :child="child"
    :disabled="disabled"
    :block="block"
    :wrap="wrap"
    :wrap-label="wrapLabel"
    :wrap-sub-label="wrapSubLabel"
    :inset="inset"
    :circle="circle"
    :thumb="thumb"
    :theme="theme"
    :parse-markdown="parseMarkdown"
    :drop-right="resolvedDropRight"
    :drop-tabs="dropTabs"
    :drop-tab-selected="dropTabSelected"
    :drop-size="dropSize"
    :drop-theme="dropTheme"
    :notify-color="notifyColor"
    @click="(event, payload) => $emit('click', event, payload)"
    @toggle="(open) => $emit('toggle', open)"
  >
    <template v-if="$slots.tags" #tags="slotProps">
      <slot name="tags" v-bind="slotProps" />
    </template>
    <template v-if="$slots.icon" #icon="slotProps">
      <slot name="icon" v-bind="slotProps" />
    </template>
    <template v-if="$slots.default" #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
    <template v-if="$slots['notify-icon']" #notify-icon="slotProps">
      <slot name="notify-icon" v-bind="slotProps" />
    </template>
    <template v-if="$slots.action" #action="slotProps">
      <slot name="action" v-bind="slotProps" />
    </template>
    <template v-if="$slots.dropdown" #dropdown="slotProps">
      <slot name="dropdown" v-bind="slotProps" />
    </template>
  </JsNavItem>
</template>

<script>
import JsNavItem from "./NavItem.vue";

export default {
  name: "JsPanelNavItem",
  components: {
    JsNavItem,
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
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    dropRight: {
      type: Boolean,
      default: false,
    },
    dropPos: {
      type: String,
      default: "bl",
      validator(v) {
        return ["bl", "br", "tl", "tr", "l", "r"].includes(v);
      },
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
    },
  },
  emits: ["click", "toggle"],
  computed: {
    resolvedDropRight() {
      const pos = this.item.dropPos || this.dropPos;
      return Boolean(
        this.item.dropRight || this.dropRight || pos === "br" || pos === "tr"
      );
    },
  },
};
</script>
