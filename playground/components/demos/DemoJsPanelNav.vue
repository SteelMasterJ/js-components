<script setup>
import { ref } from "vue";
import { JsPanelNav } from "@steelmasterj/js-components";

const lastSelect = ref("");

const panelNavItems = [
  { label: "NavItem", subLabel: "Core interactive pill", icon: "check", img: "", notifyCount: 3, button: "button" },
  { label: "Modal", subLabel: "Accessible dialog", icon: "bell", button: "button" },
  { label: "Tabs", subLabel: "WAI-ARIA tablist", icon: "table-cells", button: "button" },
  { label: "Table", subLabel: "Semantic data grid", icon: "list-ul", button: "button" },
  { label: "Panel", subLabel: "Scrollable landmark", icon: "search", button: "button" },
  { label: "TitleBar", subLabel: "Header & breadcrumbs", icon: "external", button: "button" },
];

const panelNavGroupedItems = [
  { category: "Primitives", label: "JsIcon", icon: "search", button: "button" },
  { category: "Primitives", label: "JsMarkdown", icon: "check", button: "button" },
  { category: "Navigation", label: "JsNavItem", icon: "bell", notifyCount: 2, button: "button" },
  { category: "Navigation", label: "JsBtnSplit", icon: "list-ul", button: "button" },
  { category: "Layout", label: "JsPanel", icon: "table-cells", button: "button" },
  { category: "Layout", label: "JsTitleBar", icon: "external", button: "button" },
];

function onSelect(item) {
  lastSelect.value = item?.label || "(item)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastSelect" class="pg-hint" role="status" aria-live="polite">
      Selected navigation item: <strong>{{ lastSelect }}</strong>
    </p>

    <div class="pg-card">
      <h3>Searchable + View Switcher (List / Thumb Grid) + Load All Limit (4 of 6 shown initially)</h3>
      <JsPanelNav
        aria-label="Library modules"
        :menu="true"
        :search="true"
        item-units="modules"
        layout="cols-3"
        :items-limit="4"
        :parse-markdown="true"
        :items="panelNavItems"
        @select="onSelect"
      />
    </div>

    <div class="pg-card">
      <h3>Grouped Navigation (group-label-show-count + group-labels-left + cols-2)</h3>
      <JsPanelNav
        aria-label="Grouped components"
        :grouped="true"
        group-by="category"
        :group-label-show-count="true"
        :group-labels-left="true"
        layout="cols-2"
        :items="panelNavGroupedItems"
        @select="onSelect"
      />
    </div>

    <div class="pg-card">
      <h3>Circle Icon Mode + Custom <code>#empty</code> Slot</h3>
      <div class="pg-stack">
        <JsPanelNav
          aria-label="Quick circle actions"
          :circle="true"
          layout="row"
          theme="lightblue"
          :items="[
            { label: 'Search', icon: 'search', button: 'button' },
            { label: 'Alerts', icon: 'bell', button: 'button' },
            { label: 'Verified', icon: 'check', button: 'button' },
          ]"
          @select="onSelect"
        />
        <JsPanelNav
          aria-label="Empty filter demo"
          :items="[]"
          item-units="results"
          empty-size="sm"
        >
          <template #empty>
            No matching results found — try clearing your active filters.
          </template>
        </JsPanelNav>
      </div>
    </div>
  </div>
</template>
