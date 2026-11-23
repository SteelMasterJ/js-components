<script setup>
import { ref } from "vue";
import { JsAccordion, JsIcon } from "@steelmasterj/js-components";

const singleOpen = ref("shipping");
const multiOpen = ref(["tokens", "a11y"]);

const faqItems = [
  {
    id: "shipping",
    label: "How does keyboard navigation work?",
    subLabel: "WAI-ARIA Accordion pattern",
    icon: "info-circle",
    badge: "WCAG AA",
  },
  {
    id: "theming",
    label: "Can I customize colors and spacing?",
    subLabel: "Uses --js-* CSS custom properties",
    icon: "check-circle",
  },
  {
    id: "disabled",
    label: "Archived policy section (Disabled)",
    disabled: true,
    content: "Unavailable content.",
  },
  {
    id: "ssr",
    label: "Is JsAccordion safe for SSR / Nuxt?",
    icon: "bell",
    badge: 2,
  },
];

const darkItems = [
  {
    id: "tokens",
    label: "**Design Tokens** bl[CSS]",
    content: "Overrides `--js-color-surface-dark`, `--js-color-primary-soft`, and `--js-transition-fast` cleanly.",
  },
  {
    id: "a11y",
    label: "**Accessibility** gn[Verified]",
    content: "Semantic headings (`headingLevel`), `aria-expanded`, `aria-controls`, and `role=\"region\"` panels.",
  },
  {
    id: "motion",
    label: "_Reduced Motion_ Support",
    content: "Chevron rotation and hover transitions disable automatically under `prefers-reduced-motion: reduce`.",
  },
];

const flushItems = [
  {
    label: "Step 1: Install the package",
    content: "Run npm install @steelmasterj/js-components in your Vue 3 app.",
  },
  {
    label: "Step 2: Import the stylesheet",
    content: "Import @steelmasterj/js-components/style.css once in src/main.js.",
  },
  {
    label: "Step 3: Compose with slots",
    content: "Use #item-<id>, #item<index>, or #panel slots for rich custom content.",
  },
];
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>
        Light Theme, Bordered (default), Single-Expand, Icons, Badges &amp;
        Disabled (v-model={{ singleOpen ?? "null" }})
      </h3>
      <JsAccordion
        v-model="singleOpen"
        :items="faqItems"
        :heading-level="4"
        aria-label="Frequently asked questions"
      >
        <template #item-shipping>
          <p>
            Focus any accordion header button and press
            <strong>ArrowDown</strong>, <strong>ArrowUp</strong>,
            <strong>Home</strong>, or <strong>End</strong> to move across
            enabled headers (automatically skipping Disabled). Press
            <strong>Enter</strong> or <strong>Space</strong> to toggle.
          </p>
        </template>
        <template #item-theming>
          <p>
            Override <code>--js-color-primary</code>,
            <code>--js-color-primary-soft</code>, and
            <code>--js-radius-md</code> in your host stylesheet to match your
            brand while preserving WCAG 2.1 AA contrast.
          </p>
        </template>
        <template #item-ssr>
          <p>
            Yes! Deterministic IDs are generated via <code>createUid()</code>
            with zero unguarded <code>window</code> or <code>document</code>
            access.
          </p>
        </template>
      </JsAccordion>
    </div>

    <div class="pg-card">
      <h3>
        Dark Theme, Separated Cards, Multiple Open, Small Size &amp; Markdown
        (v-model={{ JSON.stringify(multiOpen) }})
      </h3>
      <JsAccordion
        v-model="multiOpen"
        :items="darkItems"
        :multiple="true"
        :heading-level="4"
        variant="separated"
        theme="dark"
        size="sm"
        :parse-markdown="true"
        aria-label="Dark multi-expand accordion"
      >
        <template #item-icon="{ index }">
          <JsIcon v-if="index === 0">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </JsIcon>
        </template>
      </JsAccordion>
    </div>

    <div class="pg-card">
      <h3>
        Flush Variant, Left Chevron, Non-Collapsible (Always One Open) &amp;
        Large Size
      </h3>
      <JsAccordion
        :items="flushItems"
        :collapsible="false"
        :heading-level="4"
        variant="flush"
        chevron-position="left"
        size="lg"
        aria-label="Quick start steps"
      >
        <template #panel="{ item, index }">
          <p>
            <strong>Panel {{ index + 1 }}:</strong> {{ item.content }}
          </p>
        </template>
      </JsAccordion>
    </div>
  </div>
</template>
