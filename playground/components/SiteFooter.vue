<script setup>
import { JsNavItem } from "@steelmasterj/js-components";
</script>

<template>
  <footer class="site-footer">
    <div class="site-container site-footer__inner">
      <div class="site-footer__meta">
        <strong>@steelmasterj/js-components v0.2.0</strong>
        <span>
          Vue 3 Options API library &bull; Pure vanilla CSS &bull; WCAG 2.1 AA
          accessible &bull; 320px+ responsive
        </span>
      </div>
      <nav aria-label="Footer navigation" class="site-footer__links">
        <JsNavItem
          size="xs"
          theme="light"
          :item="{ label: 'All-in-One Playground', icon: 'table-cells', link: '/' }"
        />
        <JsNavItem
          size="xs"
          theme="light"
          :item="{
            label: 'GitHub Repository',
            linkExt: 'https://github.com/SteelMasterJ/js-components',
          }"
        />
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--js-color-border);
  background: var(--js-color-surface);
  padding-block: var(--js-space-5);
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-4);
}

.site-footer__meta {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-1);
  font-size: var(--js-font-size-sm);
  color: var(--js-color-text-muted);
}

.site-footer__meta strong {
  color: var(--js-color-text);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--js-space-2);
}
</style>
