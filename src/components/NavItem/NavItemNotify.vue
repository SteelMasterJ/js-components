<template>
  <span
    v-if="hasNotify"
    :class="[
      'js-nav-item-notify',
      'js-nav-item-notify--' + resolvedColor,
      { 'js-nav-item-notify--count-only': isCountOnly },
    ]"
    :title="tipText || undefined"
    :aria-label="accessibleLabel || undefined"
    :aria-live="live ? 'polite' : undefined"
  >
    <span v-if="item.notifyCount > 0" class="js-nav-item-notify__count">{{
      item.notifyCount
    }}</span>
    <span v-if="item.notifyLabel" class="js-nav-item-notify__label">{{
      item.notifyLabel
    }}</span>
    <template v-if="$slots.icon || item.notifyIcon">
      <slot name="icon">
        <JsIcon v-if="item.notifyIcon" :name="item.notifyIcon" />
      </slot>
    </template>
  </span>
</template>

<script>
import JsIcon from "../Icon.vue";
import { pluralize } from "../../utils/search.js";

const VALID_COLORS = [
  "grey",
  "gray",
  "blue",
  "green",
  "red",
  "orange",
  "light",
  "white",
];

export default {
  name: "JsNavItemNotify",
  components: {
    JsIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    notifyColor: {
      type: String,
      default: "orange",
      validator(v) {
        return VALID_COLORS.includes(v);
      },
    },
    live: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasNotify() {
      return Boolean(
        this.item.notifyCount > 0 ||
          this.item.notifyLabel ||
          this.item.notifyIcon ||
          this.$slots.icon
      );
    },
    isCountOnly() {
      return Boolean(
        this.item.notifyCount > 0 &&
          !this.item.notifyLabel &&
          !this.item.notifyIcon &&
          !this.$slots.icon
      );
    },
    resolvedColor() {
      const color = this.item.notifyColor || this.notifyColor || "orange";
      return VALID_COLORS.includes(color) ? color : "orange";
    },
    tipText() {
      if (this.item.notifyTip) return this.item.notifyTip;
      if (this.item.notifyCount > 0) {
        return pluralize(this.item.notifyCount, this.item.notifyUnits);
      }
      return "";
    },
    accessibleLabel() {
      if (this.tipText) return this.tipText;
      if (this.item.notifyLabel) return this.item.notifyLabel;
      return "";
    },
  },
};
</script>

<style scoped>
.js-nav-item-notify {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  min-width: 1.65em;
  min-height: 1.65em;
  padding: 0.22em 0.55em;
  border-radius: var(--js-radius-pill);
  font-size: max(0.75rem, 0.78em);
  font-weight: 600;
  font-variant-numeric: proportional-nums;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Optical balance for numeric-only pills (offsets sans-serif left side-bearing) */
.js-nav-item-notify--count-only {
  gap: 0;
  padding: 0.22em 0.5em 0.22em 0.42em;
}

.js-nav-item-notify--orange {
  background-color: var(--js-color-orange);
  color: var(--js-color-text-inverse);
}

.js-nav-item-notify--blue {
  background-color: var(--js-color-primary);
  color: var(--js-color-primary-text);
}

.js-nav-item-notify--green {
  background-color: var(--js-color-success);
  color: var(--js-color-text-inverse);
}

.js-nav-item-notify--red {
  background-color: var(--js-color-danger);
  color: var(--js-color-text-inverse);
}

.js-nav-item-notify--grey,
.js-nav-item-notify--gray {
  background-color: var(--js-color-text-muted);
  color: var(--js-color-text-inverse);
}

.js-nav-item-notify--light,
.js-nav-item-notify--white {
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  box-shadow: inset 0 0 0 1px var(--js-color-border);
}
</style>
