<template>
  <JsMarkdown
    v-if="typeof item.tags === 'string' && item.tags.length > 0"
    :parse="true"
    :text-test-id="item.dataTestId ? item.dataTestId + ':tags' : ''"
    :val="item.tags"
    class="js-nav-item-tags js-nav-item-tags--md"
  />
  <ul
    v-else-if="Array.isArray(item.tags) && item.tags.length > 0"
    class="js-nav-item-tags"
    aria-label="Tags"
  >
    <li v-for="(tag, i) in item.tags" :key="i" class="js-nav-item-tags__item">
      <span class="js-tag">{{ tag }}</span>
    </li>
  </ul>
</template>

<script>
import JsMarkdown from "../Markdown.vue";

export default {
  name: "JsNavItemTags",
  components: {
    JsMarkdown,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.js-nav-item-tags {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.js-nav-item-tags__item {
  display: inline-flex;
}
</style>
