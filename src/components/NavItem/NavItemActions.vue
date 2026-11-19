<template>
  <i
    v-if="action(item)"
    :class="[
      'icn act fa-' + action(item),
      'fa-' + (item.actionFX || 'nofx'),
      'fa-' + (item.actionIconVariant || 'solid'),
      { 'fa-spin': action(item) === 'spinner' },
    ]"
  />
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const action = (item) => {
  //support older action props
  let act = item.actionIcon;
  if (act === false) return false;
  if (typeof act === "string") return act;
  if (item.linkExtNew) act = "external-link-square-alt";
  if (item.wait) act = "spinner";
  if (item.check) act = "check";
  if (item.arrow) act = "angle-right";
  if (item.items) act = "caret-down";
  if (item.kabob) act = "ellipsis-vertical";
  return act;
};
</script>
