<script setup>
import { ref } from "vue";
import { JsInputCheckbox } from "@steelmasterj/js-components";

const demoChecks = ref(["kb", "contrast"]);
const demoSingleCheck = ref(true);
const demoDarkChecks = ref(["email"]);
</script>

<template>
  <div class="pg-grid-2">
    <div class="pg-card">
      <h3>Checkbox Group (layout="cols-2", selected: {{ demoChecks.join(", ") || "none" }})</h3>
      <JsInputCheckbox
        v-model="demoChecks"
        label="Enabled Features"
        icon="check"
        layout="cols-2"
        :items="[
          { label: 'Keyboard Nav', value: 'kb' },
          { label: 'WCAG AA Contrast', value: 'contrast' },
          { label: 'Vanilla CSS', value: 'css' },
          { label: 'SSR Safe (disabled)', value: 'ssr', disabled: true },
        ]"
        hint="Multi-column layouts collapse cleanly to 1 column on mobile."
      />
    </div>

    <div class="pg-card">
      <h3>Single Boolean Checkbox &amp; Error State (checked={{ demoSingleCheck }})</h3>
      <div class="pg-stack">
        <JsInputCheckbox
          v-model="demoSingleCheck"
          label="I agree to the *terms* and privacy policy"
          :parse-markdown="true"
          :error="demoSingleCheck ? '' : 'Acceptance is required to continue.'"
        />
        <div class="pg-dark-strip pg-dark-strip--flush">
          <JsInputCheckbox
            v-model="demoDarkChecks"
            label="Dark Theme Options"
            theme="dark"
            layout="rows"
            :items="[
              { label: 'Email', value: 'email' },
              { label: 'SMS', value: 'sms' },
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
