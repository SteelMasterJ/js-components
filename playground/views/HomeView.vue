<script setup>
import { computed } from "vue";
import {
  JsNavItem,
  JsPanel,
  JsPanelNav,
  JsTitleBar,
} from "@steelmasterj/js-components";
import { COMPONENT_DOCS } from "../data/componentRegistry.js";

import DemoJsNavItem from "../components/demos/DemoJsNavItem.vue";
import DemoJsBtnSplit from "../components/demos/DemoJsBtnSplit.vue";
import DemoJsNavList from "../components/demos/DemoJsNavList.vue";
import DemoJsDrop from "../components/demos/DemoJsDrop.vue";
import DemoJsPanelNavItem from "../components/demos/DemoJsPanelNavItem.vue";
import DemoJsTitleBar from "../components/demos/DemoJsTitleBar.vue";
import DemoJsPanel from "../components/demos/DemoJsPanel.vue";
import DemoJsPanelNav from "../components/demos/DemoJsPanelNav.vue";
import DemoJsTable from "../components/demos/DemoJsTable.vue";
import DemoJsInput from "../components/demos/DemoJsInput.vue";
import DemoJsInputCheckbox from "../components/demos/DemoJsInputCheckbox.vue";
import DemoJsInputRadio from "../components/demos/DemoJsInputRadio.vue";
import DemoJsForm from "../components/demos/DemoJsForm.vue";
import DemoJsModal from "../components/demos/DemoJsModal.vue";
import DemoJsMarkdown from "../components/demos/DemoJsMarkdown.vue";
import DemoJsTabs from "../components/demos/DemoJsTabs.vue";
import DemoJsIcon from "../components/demos/DemoJsIcon.vue";
import DemoJsAlert from "../components/demos/DemoJsAlert.vue";
import DemoJsToast from "../components/demos/DemoJsToast.vue";
import DemoJsAccordion from "../components/demos/DemoJsAccordion.vue";

const directoryItems = computed(() =>
  COMPONENT_DOCS.map((doc) => ({
    category: doc.categoryLabel,
    label: doc.name,
    subLabel: doc.summary,
    icon: doc.icon,
    arrow: true,
    link: `/components/${doc.slug}`,
  }))
);

const sections = [
  {
    id: "navitem-heading",
    title: "1. JsNavItem (Core Component & Composed Sub-Items)",
    slug: "js-nav-item",
    demo: DemoJsNavItem,
  },
  {
    id: "btnsplit-heading",
    title: "2. JsBtnSplit (Split Button Groups — Grow Modes, Spaced Pills, Sizes & Dropdowns)",
    slug: "js-btn-split",
    demo: DemoJsBtnSplit,
  },
  {
    id: "navlist-heading",
    title: "3. JsNavList (Headers, Semantic Dividers, Nested Submenus, Embedded Split & Custom Component)",
    slug: "js-nav-list",
    demo: DemoJsNavList,
  },
  {
    id: "drop-heading",
    title: "4. JsDrop (Triggered Popovers w/ Viewport Flip, Tabbed Menus, Dynamic :component & Inline Panels)",
    slug: "js-drop",
    demo: DemoJsDrop,
  },
  {
    id: "panelnavitem-heading",
    title: "5. JsPanelNavItem (Thin Wrapper Delegating to JsNavItem + dropPos & Slot Forwarding)",
    slug: "js-panel-nav-item",
    demo: DemoJsPanelNavItem,
  },
  {
    id: "titlebar-heading",
    title: "6. JsTitleBar (Breadcrumbs, Configurable Heading Level, Docked Banner, Dropdown Header & Dark Theme)",
    slug: "js-title-bar",
    demo: DemoJsTitleBar,
  },
  {
    id: "panel-heading",
    title: "7. JsPanel (Semantic Landmarks, Header/Footer Slots, Scroll Nudges, Compact & Background Card)",
    slug: "js-panel",
    demo: DemoJsPanel,
  },
  {
    id: "panelnav-heading",
    title: "8. JsPanelNav (Live Search + <output> Count, View Switcher, Grouping, Limit & Responsive Grids)",
    slug: "js-panel-nav",
    demo: DemoJsPanelNav,
  },
  {
    id: "table-heading",
    title: "9. JsTable (Semantic Caption & Scope Headers, Sticky Column, Themes, Actions & Dark Mode)",
    slug: "js-table",
    demo: DemoJsTable,
  },
  {
    id: "input-heading",
    title: "10. JsInput (Text, Select, Textarea, Autocomplete Combobox, Floating Label, $attrs, Validation & Dark Theme)",
    slug: "js-input",
    demo: DemoJsInput,
  },
  {
    id: "checkbox-heading",
    title: "11. JsInputCheckbox (Semantic <fieldset>/<legend> Groups, Single Boolean Mode & Responsive Grids)",
    slug: "js-input-checkbox",
    demo: DemoJsInputCheckbox,
  },
  {
    id: "radio-heading",
    title: "12. JsInputRadio (Semantic <fieldset>/<legend>, Accessible Color Swatch Dots & Dark Theme)",
    slug: "js-input-radio",
    demo: DemoJsInputRadio,
  },
  {
    id: "form-heading",
    title: "13. JsForm (Multi-Step Wizard, Validation Summary Links, Conditional Show/Hide & Responsive Grid)",
    slug: "js-form",
    demo: DemoJsForm,
    props: { full: false },
  },
  {
    id: "modal-heading",
    title: "14. JsModal (Sizes, Slots, Dynamic Component, Focus Trap & Escape)",
    slug: "js-modal",
    demo: DemoJsModal,
  },
  {
    id: "md-heading",
    title: "15. JsMarkdown (Inline Formatting, Accessible Tags & XSS Safety)",
    slug: "js-markdown",
    demo: DemoJsMarkdown,
  },
  {
    id: "tabs-heading",
    title: "16. JsTabs (Themes, Sizes, Alignments, Keyboard Arrows & Disabled)",
    slug: "js-tabs",
    demo: DemoJsTabs,
  },
  {
    id: "icons-heading",
    title: "17. JsIcon (Built-in Chrome & Slotted Custom SVGs)",
    slug: "js-icon",
    demo: DemoJsIcon,
  },
  {
    id: "alert-heading",
    title: "18. JsAlert (Semantic States, Distinct SVG Icons, Variants & Dismissible)",
    slug: "js-alert",
    demo: DemoJsAlert,
  },
  {
    id: "toast-heading",
    title: "19. JsToast (Programmatic & Declarative Snackbar Composing JsAlert)",
    slug: "js-toast",
    demo: DemoJsToast,
  },
  {
    id: "accordion-heading",
    title: "20. JsAccordion (Bordered, Separated & Flush Variants, Multi-Expand, Keyboard Nav & Dark Theme)",
    slug: "js-accordion",
    demo: DemoJsAccordion,
  },
];
</script>

<template>
  <div class="site-container pg-home">
    <JsTitleBar
      :heading-level="1"
      title="js-components Playground"
      sub-title="Living Documentation & All-in-One Interactive Showcase (25 Components)"
      description="Explore every @steelmasterj/js-components primitive on one page below, or open any dedicated component page for its full prop reference, accessibility notes, and variation suite."
      background="#ffffff"
      :buttons="[
        {
          label: 'Browse Directory',
          icon: 'search',
          theme: 'lightblue',
          route: '#directory',
        },
        {
          label: 'JsNavItem Docs',
          arrow: true,
          theme: 'blue',
          link: '/components/js-nav-item',
        },
      ]"
    />

    <JsPanel
      id="directory"
      as="section"
      :heading-level="2"
      title="Component Directory (All 25 Exports)"
      icon="list-ul"
      :scroll="false"
      height="auto"
    >
      <JsPanelNav
        aria-label="Component directory"
        :search="true"
        :grouped="true"
        group-by="category"
        :group-label-show-count="true"
        layout="cols-3"
        item-units="components"
        :items="directoryItems"
      />
    </JsPanel>

    <section
      v-for="sec in sections"
      :key="sec.id"
      class="pg-section"
      :aria-labelledby="sec.id"
    >
      <div class="pg-section__header">
        <h2 :id="sec.id">{{ sec.title }}</h2>
        <JsNavItem
          size="xs"
          theme="lightblue"
          :item="{
            label: 'Props & Full Docs',
            arrow: true,
            link: `/components/${sec.slug}`,
          }"
        />
      </div>
      <component :is="sec.demo" v-bind="sec.props || {}" />
    </section>
  </div>
</template>

<style scoped>
.pg-home {
  display: flex;
  flex-direction: column;
  gap: var(--site-section-gap);
}

.pg-section {
  background: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-lg);
  padding: clamp(1rem, 2.5vw, 1.5rem);
  min-width: 0;
}

.pg-section__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
  margin-bottom: var(--js-space-4);
}

.pg-section__header > h2 {
  margin: 0;
  font-size: 1.15rem;
}
</style>
