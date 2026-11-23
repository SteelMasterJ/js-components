<script setup>
import { JsNavItem, JsNavItemTags } from "@steelmasterj/js-components";
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Standalone <code>JsNavItemTags</code> (Array Tags vs Color-Coded Markdown Tags)</h3>
      <div class="pg-stack">
        <div class="pg-row">
          <span>Array <code>tags</code>:</span>
          <JsNavItemTags :item="{ tags: ['Vue 3', 'Options API', 'WCAG 2.1 AA'] }" />
        </div>
        <div class="pg-row">
          <span>Markdown <code>tags</code>:</span>
          <JsNavItemTags :item="{ tags: '[Default] bl[Info] gn[Stable] yw[Review] or[Beta] rd[Breaking] pu[Pro] dk[Dark]' }" />
        </div>
      </div>
    </div>

    <div class="pg-card">
      <h3>Overlay Tag Positioning Inside <code>JsNavItem</code></h3>
      <div class="pg-row pg-row--spacious">
        <JsNavItem
          theme="light"
          :item="{
            label: 'Array Overlay',
            subLabel: 'Positioned at top-start',
            tags: ['New', 'v0.2'],
            button: 'button',
          }"
        />
        <JsNavItem
          theme="lightblue"
          :item="{
            label: 'Markdown Overlay',
            subLabel: 'Color-coded pills',
            tags: 'gn[Stable] bl[Accessible]',
            button: 'button',
          }"
        />
      </div>
    </div>
  </div>
</template>
