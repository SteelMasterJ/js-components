<script setup>
import { ref } from "vue";
import { JsTable } from "@steelmasterj/js-components";

const lastCell = ref("");

const tableLightRows = [
  [
    "Component",
    "Batch",
    { label: "Status", align: "c" },
    { label: "WCAG AA", align: "c" },
    { label: "Action", align: "r" },
  ],
  [
    { label: "*JsNavItem*", icon: "check", iconBG: true },
    "2A",
    { label: "Complete", theme: "green", align: "c" },
    { label: "Verified", theme: "blue", align: "c" },
    { label: "Inspect", button: true, align: "r" },
  ],
  [
    { label: "*JsBtnSplit*", icon: "list-ul" },
    "2B",
    { label: "Complete", theme: "green", align: "c" },
    { label: "Verified", theme: "blue", align: "c" },
    { label: "Docs", linkExt: "https://vuejs.org", align: "r" },
  ],
  [
    { label: "*JsTable*", icon: "table-cells" },
    "2C",
    { label: "In Review", theme: "yellow", align: "c" },
    { label: "Verified", theme: "blue", align: "c" },
    { label: "Inspect", button: true, align: "r" },
  ],
  [
    { label: "*JsForm*", icon: "alert" },
    "2D",
    { label: "Queued", theme: "grey", align: "c" },
    { label: "Pending", theme: "muted", align: "c" },
    { label: "Next", button: true, align: "r" },
  ],
];

const tableDarkRows = [
  [
    "Artifact",
    { label: "Format", align: "c" },
    { label: "Status", align: "c" },
    { label: "Notes", align: "r" },
  ],
  [
    "js-components.js",
    { label: "ESM", align: "c" },
    { label: "Tree-shakeable", theme: "green", align: "c" },
    { label: "Vue 3 Options API", align: "r" },
  ],
  [
    "style.css",
    { label: "Vanilla CSS", align: "c" },
    { label: "Zero Sass", theme: "blue", align: "c" },
    { label: "--js-* tokens", align: "r" },
  ],
];

function onCellClick({ cell }) {
  lastCell.value = cell?.label || "(cell)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastCell" class="pg-hint" role="status" aria-live="polite">
      Clicked interactive table cell: <strong>{{ lastCell }}</strong>
    </p>

    <div class="pg-card">
      <h3>Light Table (Striped, Hover, V-Lines, Row Headers, Sticky First Col, Cell Themes &amp; Interactive Cells)</h3>
      <JsTable
        caption="Component Readiness Matrix (Batch 2A–2C)"
        :rows="tableLightRows"
        :header-row-count="1"
        :header-col-count="1"
        :left-col-sticky="true"
        :striped="true"
        :hover="true"
        :v-lines="true"
        :parse-markdown="true"
        @cell-click="onCellClick"
      />
    </div>

    <div class="pg-card pg-dark-card">
      <h3>Dark Theme Table (Compact Padding, Right-Aligned Metrics)</h3>
      <JsTable
        caption="Bundle Snapshot (Dark Theme)"
        :rows="tableDarkRows"
        :dark="true"
        :striped="true"
        :hover="true"
        padding="sm"
        :parse-markdown="true"
        @cell-click="onCellClick"
      />
    </div>
  </div>
</template>
