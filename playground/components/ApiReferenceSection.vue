<script setup>
import { computed, ref, watch } from "vue";
import { JsPanel, JsTable, JsTabs } from "@steelmasterj/js-components";
import {
  buildEmitRows,
  buildPropRows,
  buildSlotRows,
} from "../utils/inspectProps.js";

const props = defineProps({
  doc: {
    type: Object,
    required: true,
  },
});

const activeTab = ref("props");

watch(
  () => props.doc.slug,
  () => {
    activeTab.value = "props";
  }
);

const propRows = computed(() =>
  buildPropRows(props.doc.component, props.doc.propDocs)
);

const emitRows = computed(() =>
  buildEmitRows(props.doc.component, props.doc.emitDocs)
);

const slotRows = computed(() => buildSlotRows(props.doc.slots));

const tabItems = computed(() => {
  const tabs = [
    {
      id: "props",
      label: "Props",
      badge: Math.max(0, propRows.value.length - 1),
    },
  ];
  if (emitRows.value.length > 1) {
    tabs.push({
      id: "emits",
      label: "Emits",
      badge: emitRows.value.length - 1,
    });
  }
  if (slotRows.value.length > 1) {
    tabs.push({
      id: "slots",
      label: "Slots",
      badge: slotRows.value.length - 1,
    });
  }
  if (Array.isArray(props.doc.extraTables)) {
    for (const extra of props.doc.extraTables) {
      tabs.push({
        id: extra.id,
        label: extra.label,
        badge: Math.max(0, (extra.rows?.length || 1) - 1),
      });
    }
  }
  return tabs;
});
</script>

<template>
  <JsPanel
    as="section"
    :heading-level="2"
    title="Props & API Reference"
    icon="list-ul"
    :scroll="false"
    height="auto"
  >
    <JsTabs
      v-model="activeTab"
      :items="tabItems"
      align="start"
      :aria-label="`${doc.name} API reference tabs`"
    >
      <template #tab-props>
        <JsTable
          :caption="`${doc.name} Props (${propRows.length - 1} total)`"
          :rows="propRows"
          :header-row-count="1"
          :striped="true"
          :hover="true"
          :parse-markdown="true"
          padding="sm"
        />
      </template>

      <template v-if="emitRows.length > 1" #tab-emits>
        <JsTable
          :caption="`${doc.name} Emitted Events`"
          :rows="emitRows"
          :header-row-count="1"
          :striped="true"
          :hover="true"
          :parse-markdown="true"
          padding="sm"
        />
      </template>

      <template v-if="slotRows.length > 1" #tab-slots>
        <JsTable
          :caption="`${doc.name} Slots`"
          :rows="slotRows"
          :header-row-count="1"
          :striped="true"
          :hover="true"
          :parse-markdown="true"
          padding="sm"
        />
      </template>

      <template
        v-for="extra in doc.extraTables || []"
        :key="extra.id"
        #[`tab-${extra.id}`]
      >
        <JsTable
          :caption="extra.caption"
          :rows="extra.rows"
          :header-row-count="1"
          :striped="true"
          :hover="true"
          :parse-markdown="true"
          padding="sm"
        />
      </template>
    </JsTabs>
  </JsPanel>
</template>
