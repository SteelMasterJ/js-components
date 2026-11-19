<template>
  <span
    :class="['js-icon', { 'js-icon--spin': spin }]"
    :style="color ? { color } : undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <slot>
      <svg
        v-if="builtinPath"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        focusable="false"
        aria-hidden="true"
      >
        <path :d="builtinPath" />
      </svg>
      <span v-else-if="iconClass" :class="iconClass" aria-hidden="true"></span>
    </slot>
  </span>
</template>

<script>
import { getBuiltinIconPath } from "../utils/icons.js";

export default {
  name: "JsIcon",
  props: {
    name: {
      type: String,
      default: "",
    },
    iconClass: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    builtinPath() {
      return getBuiltinIconPath(this.name);
    },
  },
};
</script>

<style scoped>
.js-icon > svg {
  fill: none;
}
</style>
