<script setup>
import { ref } from "vue";
import { JsBtnSplit } from "@steelmasterj/js-components";

const lastClick = ref("");

const splitPublishItems = [
  { label: "Publish", icon: "check", button: "button" },
  {
    tip: "Publish options",
    items: [
      { label: "Publish Now", icon: "check" },
      { label: "Schedule...", icon: "bell" },
      { divider: true },
      { label: "Save as Draft" },
    ],
  },
];

function onClick(_e, item) {
  lastClick.value = item?.label || item?.tip || "(clicked)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastClick" class="pg-hint" role="status" aria-live="polite">
      Last clicked: <strong>{{ lastClick }}</strong>
    </p>

    <div class="pg-card">
      <h3>Connected Split Button with Action Dropdown &amp; Sizes (sm, md, lg)</h3>
      <div class="pg-row">
        <JsBtnSplit
          size="sm"
          theme="blue"
          aria-label="Publish actions small"
          :items="splitPublishItems"
          @click="onClick"
        />
        <JsBtnSplit
          size="md"
          theme="lightblue"
          aria-label="Publish actions medium"
          :items="splitPublishItems"
          @click="onClick"
        />
        <JsBtnSplit
          size="lg"
          theme="green"
          aria-label="Publish actions large"
          :items="splitPublishItems"
          @click="onClick"
        />
      </div>
    </div>

    <div class="pg-card">
      <h3>Grow Modes (grow="first", grow="first-hover", grow="last", grow="all")</h3>
      <div class="pg-stack">
        <JsBtnSplit
          grow="first"
          theme="light"
          aria-label="Grow first group"
          :items="[
            { label: 'Primary (grow=first)', icon: 'check', button: 'button' },
            { label: 'Edit', button: 'button' },
            { icon: 'ellipsis-vertical', tip: 'More', items: [{ label: 'Archive' }, { label: 'Delete' }] },
          ]"
          @click="onClick"
        />
        <JsBtnSplit
          grow="first-hover"
          theme="light"
          aria-label="Grow first-hover group"
          :items="[
            { label: 'Hover me to highlight siblings (grow=first-hover)', button: 'button' },
            { label: 'Info', button: 'button' },
            { label: 'Open', arrow: true, button: 'button' },
          ]"
          @click="onClick"
        />
        <JsBtnSplit
          grow="last"
          theme="light"
          aria-label="Grow last group"
          :items="[
            { icon: 'bell', tip: 'Alerts', button: 'button' },
            { label: 'Stretched Trailing Button (grow=last)', button: 'button' },
          ]"
          @click="onClick"
        />
        <JsBtnSplit
          grow="all"
          theme="dark"
          aria-label="Equal width segmented buttons"
          :items="[
            { label: 'Day', active: true, button: 'button' },
            { label: 'Week', button: 'button' },
            { label: 'Month', button: 'button' },
          ]"
          @click="onClick"
        />
      </div>
    </div>

    <div class="pg-card">
      <h3>Spaced Pill Mode (spaced=true) &amp; Circle Mode (circle=true)</h3>
      <div class="pg-stack">
        <JsBtnSplit
          :spaced="true"
          grow="all"
          theme="lightblue"
          aria-label="Spaced navigation actions"
          :items="[
            { label: 'Back', icon: 'chevron-left', button: 'button' },
            { label: 'Save Draft', button: 'button' },
            { label: 'Next', icon: 'chevron-right', button: 'button' },
          ]"
          @click="onClick"
        />
        <JsBtnSplit
          :circle="true"
          :spaced="true"
          theme="purple"
          aria-label="Circle icon actions"
          :items="[
            { label: 'Alerts', icon: 'bell', button: 'button' },
            { label: 'Find', icon: 'search', button: 'button' },
          ]"
          @click="onClick"
        />
      </div>
    </div>
  </div>
</template>
