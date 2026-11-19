<template>
  <span
    v-if="$slots.default || item.icon"
    :class="['js-nav-item-icon', { 'js-nav-item-icon--lg': isLargeIcon }]"
    :style="item.iconColor ? { color: item.iconColor } : undefined"
  >
    <slot>
      <JsIcon :name="item.icon" :label="item.iconLabel || ''" />
    </slot>
  </span>
  <span
    v-else-if="item.img"
    :class="[
      'js-nav-item-thumb',
      { 'js-nav-item-thumb--lg': Boolean(item.subLabel) || item.imgSize === 'lg' },
    ]"
  >
    <img :src="item.img" :alt="resolvedAlt" loading="lazy" />
  </span>
  <span
    v-else-if="item.number != null"
    :class="[
      'js-nav-item-number',
      {
        'js-nav-item-number--lg':
          Boolean(item.subLabel) || item.numberSize === 'lg',
      },
    ]"
  >
    {{ item.number }}
  </span>
</template>

<script>
import JsIcon from "../Icon.vue";

export default {
  name: "JsNavItemIcon",
  components: {
    JsIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    thumb: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isLargeIcon() {
      return Boolean(
        this.item.subLabel &&
          this.item.label &&
          !(this.circle || this.item.circle) &&
          !(this.thumb || this.item.thumb)
      );
    },
    resolvedAlt() {
      if (typeof this.item.imgAlt === "string") return this.item.imgAlt;
      // If a text label accompanies the thumbnail, treat image as decorative by default
      return this.item.label ? "" : "Item thumbnail";
    },
  },
};
</script>

<style scoped>
.js-nav-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1em;
}

.js-nav-item-icon--lg {
  font-size: 1.6em;
}

.js-nav-item-thumb {
  display: block;
  flex-shrink: 0;
  width: 2.5em;
  border-radius: var(--js-radius-sm);
  overflow: hidden;
  background-color: var(--js-color-surface-alt);
}

.js-nav-item-thumb--lg {
  width: 3.5em;
}

.js-nav-item-thumb > img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.js-nav-item-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25em;
  font-weight: 700;
  line-height: 1;
}

.js-nav-item-number--lg {
  font-size: 1.75em;
}
</style>
