<script setup>
import { ref } from "vue";
import { JsIcon, JsInput } from "@steelmasterj/js-components";

const demoText = ref("");
const demoCombo = ref("");
const demoSelect = ref("");
const demoTextarea = ref("");
const demoInvalid = ref("not-an-email");
const demoFloat = ref("Floating active");
const demoDarkInput = ref("");

const comboItems = [
  { label: "Vue 3", subLabel: "Options & Composition API" },
  { label: "Vite", subLabel: "Fast library bundler" },
  { label: "Vitest", subLabel: "Unit test runner" },
  { label: "Vanilla CSS", subLabel: "Custom properties, zero Sass" },
];
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Text, Autocomplete Combobox (Arrow/Enter/Esc + Viewport Flip), Select &amp; Textarea</h3>
      <div class="pg-grid-2">
        <JsInput
          v-model="demoText"
          label="Full Name"
          placeholder="Jane Doe"
          icon="search"
          hint="Native $attrs like maxlength=40 are forwarded directly."
          maxlength="40"
          autocomplete="name"
        />
        <JsInput
          v-model="demoCombo"
          label="Framework (Autocomplete)"
          placeholder="Type or focus to search..."
          :items="comboItems"
          drop-theme="light"
          hint="Use ArrowDown/ArrowUp, Enter, or Escape."
        />
        <JsInput
          v-model="demoSelect"
          type="select"
          label="Role"
          placeholder="Select a role..."
          :items="[
            { label: 'Frontend Engineer', value: 'fe' },
            { label: 'Accessibility Lead', value: 'a11y' },
            { label: 'Design Systems', value: 'ds' },
          ]"
        />
        <JsInput
          v-model="demoTextarea"
          type="textarea"
          label="Bio"
          :rows="3"
          placeholder="Write a short summary..."
        />
      </div>
    </div>

    <div class="pg-card">
      <h3>States &amp; Variants (Error + role="alert", Floating Label, Custom SVG #icon, Notify, Disabled &amp; Dark)</h3>
      <div class="pg-grid-2">
        <JsInput
          v-model="demoInvalid"
          type="email"
          label="Work Email"
          placeholder="name@company.com"
          :invalid="true"
          error="Please enter a valid work email address."
        />
        <JsInput
          v-model="demoFloat"
          label="Floating Label"
          :label-placeholder="true"
          :notify-count="3"
          notify-color="blue"
        >
          <template #icon>
            <JsIcon color="#1d6f90">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsInput>
        <JsInput
          model-value="Read-only value"
          label="Disabled Input"
          :disabled="true"
          size="sm"
        />
        <div class="pg-dark-strip pg-dark-strip--flush">
          <JsInput
            v-model="demoDarkInput"
            label="Dark Theme Input"
            theme="dark"
            placeholder="Type in dark mode..."
            icon="bell"
          />
        </div>
      </div>
    </div>
  </div>
</template>
