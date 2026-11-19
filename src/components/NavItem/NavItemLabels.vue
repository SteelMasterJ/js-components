<template>
  <div v-if="item.label || item.subLabel" class="labels">
    <span
      v-if="item.label"
      :class="['label', { 'label-wrap': item.wrap || item.wrapLabel }]"
    >
      <JsMarkdown
        :parse="(item.parseMarkdown || parseMarkdown).match(/label|\*/)"
        :val="item.label"
        :text-test-id="item.dataTestId ? item.dataTestId + ':label' : undefined"
      />
    </span>
    <span
      v-if="item.subLabel"
      :class="[
        'sub-label',
        { 'sub-label-wrap': item.wrap || item.wrapSubLabel },
      ]"
    >
      <JsMarkdown
        :parse="(item.parseMarkdown || parseMarkdown).match(/subLabel|\*/)"
        :text-test-id="
          item.dataTestId ? item.dataTestId + ':sublabel' : undefined
        "
        :val="item.subLabel"
      />
    </span>
  </div>
</template>

<script setup>
import JsMarkdown from "../Markdown.vue";

defineProps({
  item: {
    type: Object,
    required: true,
  },
  parseMarkdown: {
    type: String,
    default: "",
  },
});
</script>
