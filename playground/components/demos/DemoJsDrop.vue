<script setup>
import { markRaw, ref } from "vue";
import { JsDrop, JsMarkdown, JsNavItem } from "@steelmasterj/js-components";

const controlledDropOpen = ref(false);
const lastSelect = ref("");
const dynamicModalContent = markRaw(JsMarkdown);

const dropSimpleItems = [
  { header: true, label: "Actions" },
  { label: "View Details", icon: "search" },
  { label: "Mark Complete", icon: "check" },
  { divider: true },
  { label: "Vue Docs", linkExt: "https://vuejs.org" },
];

const tabbedItems = [
  {
    id: "recent",
    label: "Recent",
    items: [
      { label: "*Project Alpha* gn[Active]", subLabel: "Updated 2m ago" },
      { label: "Design Tokens", subLabel: "Updated 1h ago" },
    ],
  },
  {
    id: "starred",
    label: "Starred",
    items: [
      { label: "Component Guide bl[Docs]", linkExt: "https://vuejs.org" },
      { label: "Accessibility Checklist", icon: "check" },
    ],
  },
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

    <div class="pg-card">
      <h3>Triggered Dropdowns (Auto-Flips Above Near Bottom Edge, Escape &amp; Outside-Click Close)</h3>
      <div class="pg-row">
        <JsDrop
          trigger-label="Dark Menu (sm)"
          trigger-icon="list-ul"
          theme="dark"
          size="sm"
          :items="dropSimpleItems"
          @select="onSelect"
        />
        <JsDrop
          trigger-label="Light Tabbed (md, right)"
          trigger-icon="table-cells"
          theme="light"
          size="md"
          :tabs="true"
          :right="true"
          :parse-markdown="true"
          :items="tabbedItems"
          @select="onSelect"
        />
        <JsDrop
          trigger-label="Dynamic :component (md)"
          theme="light"
          size="md"
          :component="dynamicModalContent"
          :component-props="{
            val: 'Rendered inside **JsDrop** via `:component` gn[Live]',
            parse: true,
          }"
        />
        <JsDrop
          v-model="controlledDropOpen"
          trigger-label="v-model Controlled"
          theme="dark"
          size="sm"
        >
          <template #default="{ close }">
            <div class="pg-drop-custom">
              <p>Custom slot content inside <code>JsDrop</code>.</p>
              <JsNavItem
                size="xs"
                theme="blue"
                :item="{ label: 'Close Programmatically', button: 'button' }"
                @click="close"
              />
            </div>
          </template>
        </JsDrop>
        <JsDrop theme="light" size="md" :items="dropSimpleItems" @select="onSelect">
          <template #trigger="{ open, toggle, panelId }">
            <JsNavItem
              theme="lightblue"
              size="sm"
              :item="{
                label: open ? 'Close Custom Trigger' : 'Custom #trigger Slot',
                icon: 'bell',
                button: 'button',
                ariaExpanded: open,
                ariaControls: panelId,
              }"
              @click="toggle"
            />
          </template>
        </JsDrop>
      </div>
    </div>

    <div class="pg-card">
      <h3>Standalone Inline Panels (No Trigger — Backwards-Compatible Panel Mode)</h3>
      <div class="pg-row pg-row--top">
        <JsDrop
          theme="dark"
          size="sm"
          aria-label="Inline dark panel"
          :items="dropSimpleItems"
          @select="onSelect"
        />
        <JsDrop
          theme="light"
          size="md"
          :tabs="true"
          :parse-markdown="true"
          aria-label="Inline light tabbed panel"
          :items="tabbedItems"
          @select="onSelect"
        />
      </div>
    </div>
  </div>
</template>
