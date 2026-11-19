<template>
  <span v-if="item.label || item.subLabel" class="js-nav-item-labels">
    <span
      v-if="item.label"
      :class="[
        'js-nav-item-labels__main',
        { 'js-nav-item-labels--wrap': shouldWrapLabel },
      ]"
    >
      <JsMarkdown
        :parse="shouldParseLabel"
        :val="item.label"
        :text-test-id="item.dataTestId ? item.dataTestId + ':label' : ''"
      />
    </span>
    <span
      v-if="item.subLabel"
      :class="[
        'js-nav-item-labels__sub',
        { 'js-nav-item-labels--wrap': shouldWrapSubLabel },
      ]"
    >
      <JsMarkdown
        :parse="shouldParseSubLabel"
        :val="item.subLabel"
        :text-test-id="item.dataTestId ? item.dataTestId + ':sublabel' : ''"
      />
    </span>
  </span>
</template>

<script>
import JsMarkdown from "../Markdown.vue";

export default {
  name: "JsNavItemLabels",
  components: {
    JsMarkdown,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
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
  },
  computed: {
    resolvedParse() {
      return this.item.parseMarkdown !== undefined
        ? this.item.parseMarkdown
        : this.parseMarkdown;
    },
    shouldParseLabel() {
      if (typeof this.resolvedParse === "boolean") return this.resolvedParse;
      return Boolean(String(this.resolvedParse || "").match(/label|\*/));
    },
    shouldParseSubLabel() {
      if (typeof this.resolvedParse === "boolean") return this.resolvedParse;
      return Boolean(String(this.resolvedParse || "").match(/subLabel|\*/));
    },
    shouldWrapLabel() {
      return Boolean(
        this.wrap || this.wrapLabel || this.item.wrap || this.item.wrapLabel
      );
    },
    shouldWrapSubLabel() {
      return Boolean(
        this.wrap ||
          this.wrapSubLabel ||
          this.item.wrap ||
          this.item.wrapSubLabel
      );
    },
  },
};
</script>

<style scoped>
.js-nav-item-labels {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1 1 auto;
  text-align: left;
  line-height: 1.3;
}

.js-nav-item-labels__main,
.js-nav-item-labels__sub {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.js-nav-item-labels__main {
  font-weight: 600;
}

.js-nav-item-labels__sub {
  font-size: 0.85em;
  font-weight: 400;
  opacity: 0.85;
}

.js-nav-item-labels--wrap {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
</style>
