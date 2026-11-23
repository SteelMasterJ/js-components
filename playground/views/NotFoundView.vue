<script setup>
import { JsAlert, JsNavItem, JsTitleBar } from "@steelmasterj/js-components";
</script>

<template>
  <div class="site-container pg-not-found">
    <JsTitleBar
      :heading-level="1"
      title="Component Not Found"
      sub-title="404"
      background="#ffffff"
      :crumbs="[{ label: 'Playground', route: '/' }, { label: 'Not Found' }]"
    />

    <JsAlert
      type="warning"
      title="Unknown Route"
      message="The requested component documentation page could not be found."
    >
      <template #actions>
        <JsNavItem
          size="sm"
          theme="blue"
          :item="{ label: 'Back to Playground', icon: 'chevron-left', link: '/' }"
        />
      </template>
    </JsAlert>
  </div>
</template>

<style scoped>
.pg-not-found {
  display: flex;
  flex-direction: column;
  gap: var(--site-section-gap);
}
</style>
