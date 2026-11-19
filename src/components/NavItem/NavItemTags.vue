<template>
  <JsMarkdown
    v-if="typeof item.tags === 'string'"
    :parse="true"
    :text-test-id="item.dataTestId ? item.dataTestId + ':tags' : undefined"
    :val="item.tags"
    class="tags tags-md"
  />
  <div v-else-if="item.tags" class="tags">
    <span v-for="(tag, i) in item.tags" :key="i" class="tag">{{ tag }}</span>
  </div>
</template>

<script setup>
import JsMarkdown from "../Markdown.vue";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
