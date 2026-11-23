<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  JsNavItem,
  JsPanel,
  JsTitleBar,
  toast,
} from "@steelmasterj/js-components";
import ApiReferenceSection from "../components/ApiReferenceSection.vue";
import NotFoundView from "./NotFoundView.vue";
import {
  getAdjacentDocs,
  getComponentDoc,
} from "../data/componentRegistry.js";

const route = useRoute();

const slug = computed(() => String(route.params.slug || ""));
const doc = computed(() => getComponentDoc(slug.value));
const adjacent = computed(() => getAdjacentDocs(slug.value));

const subComponentLinks = [
  { label: "JsNavItemIcon", slug: "js-nav-item-icon" },
  { label: "JsNavItemLabels", slug: "js-nav-item-labels" },
  { label: "JsNavItemNotify", slug: "js-nav-item-notify" },
  { label: "JsNavItemTags", slug: "js-nav-item-tags" },
  { label: "JsNavItemActions", slug: "js-nav-item-actions" },
];

const crumbs = computed(() => {
  if (!doc.value) return [];
  return [
    { label: "Playground", route: "/" },
    { label: doc.value.categoryLabel, route: "/#directory" },
    { label: doc.value.name },
  ];
});

const fullSnippet = computed(() => {
  if (!doc.value) return "";
  return `${doc.value.importSnippet}\n\n${doc.value.usageSnippet}`;
});

async function copySnippet() {
  if (!fullSnippet.value) return;
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullSnippet.value);
    }
    toast.success(`Copied ${doc.value.name} snippet.`, { title: "Copied" });
  } catch {
    toast.info("Select and copy the code snippet below.", { title: "Clipboard" });
  }
}
</script>

<template>
  <div v-if="doc" class="site-container pg-doc">
    <JsTitleBar
      :heading-level="1"
      :title="doc.name"
      :sub-title="doc.summary"
      :description="doc.description"
      :icon="doc.icon"
      background="#ffffff"
      :crumbs="crumbs"
      :buttons="[
        { label: 'All-in-One Playground', icon: 'table-cells', theme: 'light', link: '/' },
        { label: 'Copy Usage', icon: 'check', theme: 'blue', button: 'button', onClick: copySnippet },
      ]"
    />

    <JsPanel
      as="section"
      :heading-level="2"
      title="Overview, Quick Start & Accessibility"
      icon="info-circle"
      :scroll="false"
      height="auto"
    >
      <div class="pg-doc__overview">
        <div class="pg-stack">
          <h3 class="pg-doc__subhead">Quick Start</h3>
          <pre class="pg-code-block"><code>{{ fullSnippet }}</code></pre>
        </div>

        <div class="pg-stack">
          <h3 class="pg-doc__subhead">WCAG 2.1 AA &amp; Semantics</h3>
          <ul class="pg-doc__a11y">
            <li v-for="(note, idx) in doc.accessibilityNotes" :key="idx">
              {{ note }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="doc.slug === 'js-nav-item'"
        class="pg-doc__related"
      >
        <h3 class="pg-doc__subhead">Composed Sub-Components</h3>
        <div class="pg-row">
          <JsNavItem
            v-for="sub in subComponentLinks"
            :key="sub.slug"
            size="sm"
            theme="lightblue"
            :item="{
              label: sub.label,
              arrow: true,
              link: `/components/${sub.slug}`,
            }"
          />
        </div>
      </div>

      <div
        v-else-if="doc.slug.startsWith('js-nav-item-')"
        class="pg-doc__related"
      >
        <h3 class="pg-doc__subhead">Parent Component</h3>
        <div class="pg-row">
          <JsNavItem
            size="sm"
            theme="lightblue"
            :item="{
              label: 'Back to JsNavItem',
              icon: 'chevron-left',
              link: '/components/js-nav-item',
            }"
          />
        </div>
      </div>
    </JsPanel>

    <ApiReferenceSection :doc="doc" />

    <JsPanel
      as="section"
      :heading-level="2"
      :title="`${doc.name} Variations Suite`"
      icon="table-cells"
      :scroll="false"
      height="auto"
    >
      <component :is="doc.demoComponent" />
    </JsPanel>

    <nav aria-label="Adjacent components" class="pg-doc__pager">
      <div class="pg-doc__pager-prev">
        <JsNavItem
          v-if="adjacent.prev"
          size="sm"
          theme="light"
          :item="{
            label: adjacent.prev.name,
            subLabel: 'Previous component',
            icon: 'chevron-left',
            link: `/components/${adjacent.prev.slug}`,
          }"
        />
      </div>
      <div class="pg-doc__pager-next">
        <JsNavItem
          v-if="adjacent.next"
          size="sm"
          theme="light"
          :item="{
            label: adjacent.next.name,
            subLabel: 'Next component',
            arrow: true,
            link: `/components/${adjacent.next.slug}`,
          }"
        />
      </div>
    </nav>
  </div>

  <NotFoundView v-else />
</template>

<style scoped>
.pg-doc {
  display: flex;
  flex-direction: column;
  gap: var(--site-section-gap);
}

.pg-doc__overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
  gap: var(--js-space-4);
}

.pg-doc__subhead {
  margin: 0;
  font-size: var(--js-font-size-sm);
  color: var(--js-color-text-muted);
}

.pg-doc__a11y {
  margin: 0;
  padding-inline-start: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: var(--js-space-2);
  font-size: var(--js-font-size-sm);
}

.pg-doc__related {
  margin-top: var(--js-space-4);
  padding-top: var(--js-space-4);
  border-top: 1px solid var(--js-color-divider);
  display: flex;
  flex-direction: column;
  gap: var(--js-space-2);
}

.pg-doc__pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
}

.pg-doc__pager-next {
  margin-inline-start: auto;
}
</style>
