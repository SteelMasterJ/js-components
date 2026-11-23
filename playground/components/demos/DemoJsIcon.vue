<script setup>
import { ref } from "vue";
import { JsIcon, JsInput, JsInputCheckbox, JsNavItem } from "@steelmasterj/js-components";

const directionalIcons = [
  "chevron-down",
  "chevron-up",
  "chevron-left",
  "chevron-right",
  "angle-down",
  "angle-up",
  "angle-left",
  "angle-right",
  "caret-down",
  "caret-right",
];

const actionIcons = [
  "search",
  "check",
  "close",
  "times",
  "external",
  "external-link-square-alt",
  "ellipsis-vertical",
  "spinner",
];

const statusIcons = [
  "info-circle",
  "check-circle",
  "warning-triangle",
  "triangle-exclamation",
  "alert",
  "danger-circle",
  "x-circle",
  "bell",
  "list-ul",
  "table-cells",
];

const selectedIcon = ref("bell");
const selectedColor = ref("#1d6f90");
const spinEnabled = ref(false);

const iconOptions = [
  ...directionalIcons,
  ...actionIcons,
  ...statusIcons,
].map((name) => ({ label: name, value: name }));

const colorOptions = [
  { label: "Ocean Blue (#1d6f90)", value: "#1d6f90" },
  { label: "Forest Green (#1e7e34)", value: "#1e7e34" },
  { label: "Burnt Orange (#a64b00)", value: "#a64b00" },
  { label: "Crimson Red (#c5221f)", value: "#c5221f" },
  { label: "Royal Purple (#7b3896)", value: "#7b3896" },
  { label: "Inherit (empty)", value: "" },
];
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Built-in Directional Icons</h3>
      <div class="pg-row">
        <span v-for="iconName in directionalIcons" :key="iconName" class="pg-chip">
          <JsIcon :name="iconName" />
          {{ iconName }}
        </span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Built-in Actions &amp; UI Chrome Icons</h3>
      <div class="pg-row">
        <span v-for="iconName in actionIcons" :key="iconName" class="pg-chip">
          <JsIcon :name="iconName" :spin="iconName === 'spinner'" />
          {{ iconName }}{{ iconName === "spinner" ? " (spin)" : "" }}
        </span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Built-in Status &amp; View Icons (with Semantic Colors)</h3>
      <div class="pg-row">
        <span class="pg-chip"><JsIcon name="info-circle" color="#1d6f90" /> info-circle</span>
        <span class="pg-chip"><JsIcon name="check-circle" color="#1e7e34" /> check-circle</span>
        <span class="pg-chip"><JsIcon name="warning-triangle" color="#a64b00" /> warning-triangle</span>
        <span class="pg-chip"><JsIcon name="triangle-exclamation" color="#a64b00" /> triangle-exclamation</span>
        <span class="pg-chip"><JsIcon name="alert" color="#c5221f" /> alert</span>
        <span class="pg-chip"><JsIcon name="danger-circle" color="#c5221f" /> danger-circle</span>
        <span class="pg-chip"><JsIcon name="x-circle" color="#c5221f" /> x-circle</span>
        <span class="pg-chip"><JsIcon name="bell" /> bell</span>
        <span class="pg-chip"><JsIcon name="list-ul" /> list-ul</span>
        <span class="pg-chip"><JsIcon name="table-cells" /> table-cells</span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Accessible Label (<code>role="img"</code>), Custom SVG Slot &amp; Interactive Tester</h3>
      <div class="pg-stack">
        <div class="pg-row">
          <span class="pg-chip">
            <JsIcon label="Custom star" color="#a64b00">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </JsIcon>
            Custom SVG slot (with label="Custom star")
          </span>
          <span class="pg-chip">
            <JsIcon name="check" color="#1e7e34" label="Verified" />
            Standalone meaningful icon (role="img")
          </span>
          <span class="pg-chip">
            <JsIcon name="spinner" :spin="true" color="#1d6f90" />
            Animated spin (honors prefers-reduced-motion)
          </span>
        </div>

        <div class="pg-grid-2">
          <JsInput
            v-model="selectedIcon"
            type="select"
            label="Icon Name"
            size="sm"
            :items="iconOptions"
          />
          <JsInput
            v-model="selectedColor"
            type="select"
            label="Color Prop"
            size="sm"
            :items="colorOptions"
          />
        </div>

        <div class="pg-row">
          <JsInputCheckbox
            v-model="spinEnabled"
            label="Enable spin animation"
            size="sm"
          />
          <span class="pg-chip">
            Preview:
            <JsIcon
              :name="selectedIcon"
              :color="selectedColor"
              :spin="spinEnabled"
              :label="`Preview ${selectedIcon}`"
            />
            <code>{{ selectedIcon }}</code>
          </span>
          <JsNavItem
            size="xs"
            theme="light"
            :item="{ label: 'Reset', button: 'button' }"
            @click="() => { selectedIcon = 'bell'; selectedColor = '#1d6f90'; spinEnabled = false; }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
