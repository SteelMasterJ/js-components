<script setup>
import { ref } from "vue";
import { JsForm, JsNavItem, toast } from "@steelmasterj/js-components";

defineProps({
  full: {
    type: Boolean,
    default: true,
  },
});

const formSubmittedPayload = ref(null);
const demoFormModel = ref({
  steps: [
    {
      label: "Step 1: Project Basics",
      subLabel:
        "Try clicking Next with empty required fields to see the accessible error summary links.",
      icon: "list-ul",
      end: 4,
    },
    {
      label: "Step 2: Configuration",
      subLabel: "Choose deployment options and confirm settings.",
      icon: "check",
    },
  ],
  items: [
    {
      name: "projectName",
      label: "Project Name",
      placeholder: "e.g. my-app",
      value: "",
      span: "1 / 7",
      validation: [{ min: 3 }],
    },
    {
      name: "ownerEmail",
      type: "email",
      label: "Owner Email",
      placeholder: "you@example.com",
      value: "",
      span: "7 / 13",
    },
    {
      name: "visibility",
      type: "select",
      label: "Visibility",
      placeholder: "Choose visibility...",
      value: "public",
      span: "1 / 7",
      items: [
        { label: "Public", value: "public" },
        { label: "Private", value: "private" },
      ],
      actions: [{ name: "accessCode", action: "show", value: "private" }],
    },
    {
      name: "accessCode",
      label: "Private Access Code",
      placeholder: "Shown only when Private is selected",
      value: "",
      span: "7 / 13",
      hide: true,
    },
    {
      name: "features",
      type: "checkbox",
      label: "Included Capabilities",
      layout: "cols-2",
      value: ["a11y"],
      items: [
        { label: "WCAG 2.1 AA", value: "a11y" },
        { label: "Tree-shaking", value: "tree" },
        { label: "Dark Theme", value: "dark" },
        { label: "SSR Ready", value: "ssr" },
      ],
    },
    {
      name: "accent",
      type: "radio",
      label: "Brand Accent",
      dots: true,
      value: "#1d6f90",
      items: [
        { label: "Ocean Blue", value: "#1d6f90", color: "#1d6f90" },
        { label: "Forest Green", value: "#1e7e34", color: "#1e7e34" },
        { label: "Royal Purple", value: "#7b3896", color: "#7b3896" },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      label: "Release Notes (Optional)",
      optional: true,
      placeholder: "Optional details...",
      value: "",
    },
    {
      type: "alert",
      alertType: "info",
      title: "Inline Form Alert",
      message:
        "Schema items with `type: 'alert'` render JsAlert directly inside a step without affecting submission data.",
      parseMarkdown: true,
    },
  ],
});

const darkFormStatus = ref({
  type: "info",
  title: "Draft Mode",
  message: "Toggle status banner type above or dismiss it.",
  dismissible: true,
});

const darkFormModel = ref({
  items: [
    {
      name: "workspace",
      label: "Workspace Name",
      placeholder: "acme-design",
      value: "acme-design",
      span: "1 / 7",
    },
    {
      name: "region",
      type: "select",
      label: "Region",
      value: "us-east",
      span: "7 / 13",
      items: [
        { label: "US East", value: "us-east" },
        { label: "EU West", value: "eu-west" },
      ],
    },
  ],
});

function onFormSubmit(payload) {
  formSubmittedPayload.value = payload;
  toast.success("Form payload captured successfully.", {
    title: "Form Submitted",
  });
}

function setDarkStatus(type) {
  const titles = {
    info: "Draft Mode",
    success: "Saved Successfully",
    danger: "Sync Error",
  };
  darkFormStatus.value = {
    type,
    title: titles[type],
    message: `Form status banner set to type="${type}".`,
    dismissible: true,
  };
}
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Multi-Step Wizard (Conditional Fields, Validation Summary &amp; Inline Alert)</h3>
      <JsForm
        v-model="demoFormModel"
        submit-button-label="Create Project"
        :parse-markdown="true"
        @submit="onFormSubmit"
      />
      <div v-if="formSubmittedPayload" class="pg-submit-result" role="status" aria-live="polite">
        <strong>Submitted payload:</strong>
        <pre>{{ JSON.stringify(formSubmittedPayload, null, 2) }}</pre>
      </div>
    </div>

    <div v-if="full" class="pg-card pg-dark-card">
      <h3>Dark Theme Single-Step Form with Dismissible <code>status</code> Banner</h3>
      <div class="pg-row" style="margin-bottom: 0.75rem;">
        <JsNavItem size="xs" theme="blue" :item="{ label: 'Info Status', button: 'button' }" @click="setDarkStatus('info')" />
        <JsNavItem size="xs" theme="green" :item="{ label: 'Success Status', button: 'button' }" @click="setDarkStatus('success')" />
        <JsNavItem size="xs" theme="purple" :item="{ label: 'Danger Status', button: 'button' }" @click="setDarkStatus('danger')" />
      </div>
      <JsForm
        v-model="darkFormModel"
        theme="dark"
        size="sm"
        :status="darkFormStatus"
        submit-button-label="Save Workspace"
        @dismiss-status="darkFormStatus = null"
        @submit="onFormSubmit"
      />
    </div>
  </div>
</template>
