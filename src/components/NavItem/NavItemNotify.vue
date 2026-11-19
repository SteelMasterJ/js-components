<template>
  <span
    v-if="item.notifyCount > 0 || item.notifyLabel || item.notifyIcon"
    :data-tip="notifyTipText(item)"
    :data-count="item.notifyCount"
    role="alert"
    :class="[
      'notify',
      { 'notify-tip': notifyTipText(item) },
      'notify-tip-' + (item.notifyTipPos || 'tr'),
      'notify-' + (item.notifyColor || notifyColor),
    ]"
  >
    <span v-if="item.notifyCount > 0">{{ item.notifyCount }}</span>
    <span v-if="item.notifyLabel">{{ item.notifyLabel }}</span>
    <i
      v-if="item.notifyIcon"
      :class="[
        'icn icn-sm fa-' + item.notifyIcon,
        'fa-' + (item.notifyIconVariant || 'solid'),
      ]"
    />
  </span>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const notifyTipText = (item) => {
  let tip = false;
  if (item.notifyTip) tip = item.notifyTip;
  else if (item.notifyCount > 0) {
    tip = pluralize(item.notifyCount, item.notifyUnits);
  }
  return tip;
};

const pluralize = (count, noun, suffix = "s") => {
  if (!noun) noun = "item";
  return `${count} ${noun}${count !== 1 ? suffix : ""}`;
};
</script>
