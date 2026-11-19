<template>
  <span v-if="$slots.default || resolvedAction" class="js-nav-item-action">
    <slot :action="resolvedAction">
      <JsIcon
        :name="resolvedAction"
        :color="item.actionIconColor || ''"
        :spin="resolvedAction === 'spinner'"
      />
    </slot>
  </span>
</template>

<script>
import JsIcon from "../Icon.vue";

export default {
  name: "JsNavItemActions",
  components: {
    JsIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    resolvedAction() {
      const act = this.item.actionIcon;
      if (act === false) return "";
      if (typeof act === "string" && act.length > 0) return act;
      if (this.item.linkExt) return "external";
      if (this.item.wait) return "spinner";
      if (this.item.check) return "check";
      if (this.item.arrow) return "chevron-right";
      if (this.item.items && this.item.items.length) return "caret-down";
      if (this.item.kabob) return "ellipsis-vertical";
      return "";
    },
  },
};
</script>

<style scoped>
.js-nav-item-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9em;
}
</style>
