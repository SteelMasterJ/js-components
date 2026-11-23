<script setup>
import { markRaw, ref } from "vue";
import { JsMarkdown, JsNavList } from "@steelmasterj/js-components";

const lastSelect = ref("");

const navListDemoItems = [
  { header: true, label: "Workspace" },
  { label: "Dashboard", icon: "table-cells", active: true },
  { label: "Notifications", icon: "bell", notifyCount: 6, notifyColor: "red" },
  { divider: true },
  {
    split: true,
    items: [
      { label: "Import", button: "button" },
      { label: "Export", button: "button" },
    ],
  },
  { divider: true },
  {
    label: "Nested Tools",
    items: [
      { label: "Token Inspector" },
      { label: "WCAG Audit", icon: "check" },
    ],
  },
];

const navListLightItems = [
  { header: true, label: "Resources *v3*" },
  {
    component: markRaw(JsMarkdown),
    props: {
      val: "Custom **component** row rendered inside JsNavList bl[Live]",
      parse: true,
    },
  },
  { divider: true },
  { label: "Design System", subLabel: "Tokens & vanilla CSS", icon: "check" },
  { label: "External Guide", linkExt: "https://vuejs.org" },
];

function onSelect(item) {
  lastSelect.value = item?.label || "(selected)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastSelect" class="pg-hint" role="status" aria-live="polite">
      Last selected: <strong>{{ lastSelect }}</strong>
    </p>

    <div class="pg-grid-2">
      <div class="pg-card pg-dark-card">
        <h3>Dark Theme (menu=true, Headers, Dividers, Embedded JsBtnSplit &amp; Nested Submenu)</h3>
        <JsNavList
          theme="dark"
          size="sm"
          :menu="true"
          :parse-markdown="true"
          aria-label="Dark navigation list"
          :items="navListDemoItems"
          @select="onSelect"
        />
      </div>

      <div class="pg-card">
        <h3>Light Theme (Custom :component Entry, Badges &amp; External Link)</h3>
        <JsNavList
          theme="light"
          size="sm"
          :parse-markdown="true"
          aria-label="Light navigation list"
          :items="navListLightItems"
          @select="onSelect"
        />
      </div>
    </div>
  </div>
</template>
