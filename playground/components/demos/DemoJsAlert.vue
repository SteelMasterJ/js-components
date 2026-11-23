<script setup>
import { ref } from "vue";
import { JsAlert, JsNavItem } from "@steelmasterj/js-components";

const alertDismissibleOpen = ref(true);
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>All 4 Semantic States (Soft Default)</h3>
      <div class="pg-stack">
        <JsAlert
          type="info"
          title="Information"
          message="A new version of `@steelmasterj/js-components` is available."
          :parse-markdown="true"
        />
        <JsAlert
          type="success"
          title="Changes Saved"
          message="Your workspace configuration has been updated."
        />
        <JsAlert
          type="warning"
          title="Storage Almost Full"
          message="You are using 90% of your allocated quota."
        />
        <JsAlert
          type="danger"
          title="Deployment Failed"
          message="Unable to reach the build server. Please try again."
        />
      </div>
    </div>

    <div class="pg-card">
      <h3>Solid, Outline &amp; Compact (size="sm") Variants + Custom Slots</h3>
      <div class="pg-stack">
        <JsAlert
          type="success"
          variant="solid"
          title="Solid Success Banner"
          message="High-emphasis feedback with accessible contrast."
        />
        <JsAlert
          type="info"
          variant="outline"
          size="sm"
          :hide-icon="true"
          title="Compact Outline (size=sm, hideIcon=true)"
          message="Compact inline notice without a leading icon."
        />
        <JsAlert
          type="warning"
          variant="outline"
          title="Outline Warning with JsNavItem Action"
          message="Review pending permissions before continuing."
        >
          <template #actions="{ dismiss }">
            <JsNavItem
              size="xs"
              theme="orange"
              :item="{ label: 'Acknowledge', button: 'button', onClick: dismiss }"
            />
          </template>
        </JsAlert>
        <JsAlert
          v-model="alertDismissibleOpen"
          type="info"
          :dismissible="true"
          title="Dismissible Alert (Custom SVG Icon)"
          message="Click the close button to dismiss, or restore below."
        >
          <template #icon>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </template>
        </JsAlert>
        <div v-if="!alertDismissibleOpen">
          <JsNavItem
            size="sm"
            theme="light"
            :item="{
              label: 'Restore Dismissible Alert',
              button: 'button',
              onClick: () => { alertDismissibleOpen = true; },
            }"
          />
        </div>
      </div>
    </div>

    <div class="pg-card pg-dark-card">
      <h3>Dark Theme Alerts</h3>
      <div class="pg-stack">
        <JsAlert
          type="info"
          theme="dark"
          title="Dark Info"
          message="AA-compliant contrast on dark surfaces."
        />
        <JsAlert
          type="success"
          theme="dark"
          variant="soft"
          title="Dark Success"
          message="Build artifacts verified cleanly."
        />
        <JsAlert
          type="danger"
          theme="dark"
          variant="outline"
          title="Dark Outline Danger"
          message="Session expired. Sign in again to continue."
        />
      </div>
    </div>
  </div>
</template>
