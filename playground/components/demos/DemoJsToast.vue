<script setup>
import { ref } from "vue";
import { JsInput, JsNavItem, JsToast, toast } from "@steelmasterj/js-components";
import { useToastConfig } from "../../composables/useToastConfig.js";

const { toastPosition, toastPositionOptions } = useToastConfig();
const singleSnackbarOpen = ref(false);
const darkSnackbarOpen = ref(false);

function triggerDemoToast(type) {
  const copy = {
    info: { title: "Info", message: "Auto-dismisses in 5s (hover or focus to pause)." },
    success: { title: "Success", message: "Profile preferences saved." },
    warning: { title: "Warning", message: "API rate limit is at 85%." },
    danger: { title: "Error", message: "Could not sync changes to remote." },
  };
  toast[type](copy[type].message, { title: copy[type].title });
}

function triggerPersistentToast() {
  toast.info("This snackbar stays open until manually dismissed.", {
    title: "Manual Dismiss",
    duration: 0,
  });
}

function triggerUndoToast() {
  const id = toast.warning("Archived 3 items.", {
    title: "Action Required",
    duration: 7000,
    actionLabel: "Undo",
    onAction: () => {
      toast.dismiss(id);
      toast.success("Archive undone!");
    },
  });
}

function triggerSolidToast() {
  toast.success("Solid variant notification with *markdown* gn[Live].", {
    title: "Published",
    variant: "solid",
    parseMarkdown: true,
  });
}

function clearToasts() {
  toast.clear();
}
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Programmatic Queue (<code>toast.info / success / warning / danger</code>)</h3>
      <div class="pg-row" style="margin-bottom: 0.75rem;">
        <JsNavItem
          size="sm"
          theme="blue"
          :item="{ label: 'Trigger Info', icon: 'info-circle', button: 'button' }"
          @click="triggerDemoToast('info')"
        />
        <JsNavItem
          size="sm"
          theme="green"
          :item="{ label: 'Trigger Success', icon: 'check-circle', button: 'button' }"
          @click="triggerDemoToast('success')"
        />
        <JsNavItem
          size="sm"
          theme="orange"
          :item="{ label: 'Trigger Warning', icon: 'warning-triangle', button: 'button' }"
          @click="triggerDemoToast('warning')"
        />
        <JsNavItem
          size="sm"
          theme="purple"
          :item="{ label: 'Trigger Danger', icon: 'danger-circle', button: 'button' }"
          @click="triggerDemoToast('danger')"
        />
        <JsNavItem
          size="sm"
          theme="dark"
          :item="{ label: 'Manual Dismiss Only', button: 'button' }"
          @click="triggerPersistentToast"
        />
        <JsNavItem
          size="sm"
          theme="light"
          :item="{ label: 'With Undo Action', button: 'button' }"
          @click="triggerUndoToast"
        />
        <JsNavItem
          size="sm"
          theme="lightblue"
          :item="{ label: 'Solid + Markdown', button: 'button' }"
          @click="triggerSolidToast"
        />
        <JsNavItem
          size="sm"
          theme="light"
          :item="{ label: 'Clear All', button: 'button' }"
          @click="clearToasts"
        />
      </div>

      <div class="pg-row">
        <JsInput
          v-model="toastPosition"
          type="select"
          label="Toast Position"
          size="sm"
          :items="toastPositionOptions"
        />
      </div>
    </div>

    <div class="pg-card">
      <h3>Declarative <code>v-model</code> Snackbar (Light &amp; Dark)</h3>
      <div class="pg-row">
        <JsNavItem
          size="sm"
          theme="lightblue"
          :item="{
            label: singleSnackbarOpen ? 'Hide Light Snackbar' : 'Show v-model Snackbar',
            button: 'button',
          }"
          @click="singleSnackbarOpen = !singleSnackbarOpen"
        />
        <JsNavItem
          size="sm"
          theme="dark"
          :item="{
            label: darkSnackbarOpen ? 'Hide Dark Snackbar' : 'Show Dark Snackbar',
            button: 'button',
          }"
          @click="darkSnackbarOpen = !darkSnackbarOpen"
        />
      </div>
    </div>

    <JsToast
      v-model="singleSnackbarOpen"
      type="success"
      position="bottom-center"
      :auto-dismiss="false"
      title="Declarative Snackbar"
      message="Controlled directly with v-model and manual dismiss."
    />

    <JsToast
      v-model="darkSnackbarOpen"
      type="info"
      theme="dark"
      variant="outline"
      position="top-center"
      :auto-dismiss="false"
      title="Dark Theme Snackbar"
      message="Rendered with theme='dark' and variant='outline'."
    />
  </div>
</template>
