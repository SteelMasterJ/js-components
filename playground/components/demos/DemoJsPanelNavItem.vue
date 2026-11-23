<script setup>
import { ref } from "vue";
import { JsIcon, JsPanel, JsPanelNavItem } from "@steelmasterj/js-components";

const lastClick = ref("");

const dropSimpleItems = [
  { header: true, label: "Actions" },
  { label: "View Details", icon: "search" },
  { label: "Mark Complete", icon: "check" },
  { divider: true },
  { label: "Vue Docs", linkExt: "https://vuejs.org" },
];

function onClick(_e, item) {
  lastClick.value = item?.label || "(clicked)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastClick" class="pg-hint" role="status" aria-live="polite">
      Last clicked: <strong>{{ lastClick }}</strong>
    </p>

    <div class="pg-card">
      <h3><code>dropPos</code> Variants &amp; Slot Forwarding (<code>#icon</code>, <code>#tags</code>)</h3>
      <div class="pg-row">
        <JsPanelNavItem
          theme="blue"
          drop-pos="br"
          :item="{
            label: 'Panel Item (dropPos=br)',
            icon: 'bell',
            notifyCount: 2,
            items: dropSimpleItems,
          }"
          @click="onClick"
        />
        <JsPanelNavItem
          theme="light"
          drop-pos="bl"
          :item="{
            label: 'Panel Item (dropPos=bl)',
            icon: 'list-ul',
            items: dropSimpleItems,
          }"
          @click="onClick"
        />
        <JsPanelNavItem
          theme="light"
          :item="{ label: 'Forwarded Custom SVG Slot', subLabel: 'Delegates to JsNavItem', button: 'button' }"
          @click="onClick"
        >
          <template #icon>
            <JsIcon color="#1e7e34">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsPanelNavItem>
      </div>
    </div>

    <JsPanel
      as="div"
      :heading-level="3"
      title="Inside JsPanel Header Slot"
      height="auto"
      :scroll="false"
    >
      <template #headerRight>
        <JsPanelNavItem
          size="xs"
          theme="lightblue"
          drop-pos="br"
          drop-theme="light"
          :item="{
            label: 'Panel Menu',
            icon: 'ellipsis-vertical',
            items: dropSimpleItems,
          }"
          @click="onClick"
        />
      </template>
      <p class="pg-panel-line">
        <code>JsPanelNavItem</code> wraps <code>JsNavItem</code> with panel-centric
        <code>dropPos</code> alignment (<code>bl</code>, <code>br</code>, <code>tl</code>,
        <code>tr</code>, <code>l</code>, <code>r</code>) and forwards all slots and events.
      </p>
    </JsPanel>
  </div>
</template>
