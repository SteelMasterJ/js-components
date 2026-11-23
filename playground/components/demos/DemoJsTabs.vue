<script setup>
import { ref } from "vue";
import { JsIcon, JsTabs } from "@steelmasterj/js-components";

const activeTab1 = ref("overview");
const activeTab2 = ref(0);

const tabItems1 = [
  { id: "overview", label: "Overview", icon: "search" },
  { id: "notifications", label: "Notifications", icon: "bell", badge: 4 },
  { id: "disabled", label: "Disabled", disabled: true },
  { id: "settings", label: "Settings", icon: "check" },
];

const tabItems2 = [
  { label: "*Featured* gn[New]" },
  { label: "Analytics bl[Pro]" },
  { label: "Exports" },
];

const tabItems3 = [
  { label: "General", content: "Core configuration options." },
  { label: "Security", content: "Password & 2FA controls." },
  { label: "Billing", content: "Invoices and subscription details." },
  { label: "Integrations", content: "Webhooks and API keys." },
  { label: "Audit Log", content: "Recent account activity." },
];
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>
        Light Theme, Stretch (default), Icons, Badges &amp; Disabled Tab
        (v-model={{ activeTab1 }})
      </h3>
      <JsTabs
        v-model="activeTab1"
        :items="tabItems1"
        aria-label="Account sections"
      >
        <template #tab-overview>
          <p>
            Use <strong>ArrowLeft</strong>, <strong>ArrowRight</strong>,
            <strong>Home</strong>, and <strong>End</strong> while focused on
            a tab to move cleanly across enabled tabs (skipping Disabled).
          </p>
        </template>
        <template #tab-notifications>
          <p>
            You have 4 unread notifications rendered inside named slot
            <code>#tab-notifications</code>.
          </p>
        </template>
        <template #tab-settings>
          <p>
            Settings panel content (accessible <code>role="tabpanel"</code>).
          </p>
        </template>
      </JsTabs>
    </div>

    <div class="pg-card">
      <h3>
        Dark Theme, Small Size, Start-Aligned + Markdown Labels &amp; Custom
        SVG Slot
      </h3>
      <JsTabs
        v-model="activeTab2"
        :items="tabItems2"
        theme="dark"
        size="sm"
        align="start"
        :parse-markdown="true"
        aria-label="Dark theme tabs"
      >
        <template #tab-icon="{ index }">
          <JsIcon v-if="index === 0">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              />
            </svg>
          </JsIcon>
        </template>
        <template #tab0>
          <p>
            Rendered via index-based slot <code>#tab0</code> with a custom
            slotted SVG icon.
          </p>
        </template>
        <template #tab1>
          <p>Rendered via index-based slot <code>#tab1</code>.</p>
        </template>
        <template #tab2>
          <p>Rendered via index-based slot <code>#tab2</code>.</p>
        </template>
      </JsTabs>
    </div>

    <div class="pg-card">
      <h3>
        Large Size, Center-Aligned + Fallback Scoped #panel Slot (5 Tabs —
        Responsive Scroll on Mobile)
      </h3>
      <JsTabs
        :items="tabItems3"
        size="lg"
        align="center"
        aria-label="Large scrollable tabs"
      >
        <template #panel="{ item, index }">
          <p>
            Dynamic panel #{{ index + 1 }}: <strong>{{ item.label }}</strong>
            — {{ item.content }}
          </p>
        </template>
      </JsTabs>
    </div>
  </div>
</template>
