<template>
  <span v-if="item.icon" class="icon" :title="item.icon"
    >&#x200b;
    <i
      :style="{ color: item.iconColor }"
      :class="[
        'icn',
        {
          'icn-x2':
            item.subLabel &&
            item.label &&
            !(circle || item.circle) &&
            !(thumb || item.thumb),
        },
        'fa-' + item.icon,
        'fa-' + (item.iconVariant || 'solid'),
      ]"
    />
  </span>
  <span
    v-else-if="item.img"
    :title="item.label"
    :class="['thumb', { 'thumb-x2': item.subLabel || item.imgSize == 'lg' }]"
  >
    <img :src="item.img" alt="thumb" />
  </span>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
