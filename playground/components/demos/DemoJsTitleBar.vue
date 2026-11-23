<script setup>
import { ref } from "vue";
import { JsIcon, JsNavItem, JsTitleBar } from "@steelmasterj/js-components";
import { demoThumb } from "../../data/demoAssets.js";

const lastClick = ref("");

function onClick(_e, item) {
  lastClick.value = item?.label || "(titlebar action)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastClick" class="pg-hint" role="status" aria-live="polite">
      TitleBar action clicked: <strong>{{ lastClick }}</strong>
    </p>

    <div class="pg-card">
      <h3>Full TitleBar (Breadcrumbs, Custom SVG Slot, Action Buttons, Docked Banner &amp; Description)</h3>
      <JsTitleBar
        :heading-level="3"
        title="Design *System* gn[v0.2]"
        sub-title="Lightweight, accessible Vue 3 primitives"
        :parse-markdown="true"
        background="#e6f3f8"
        :crumbs="[
          { label: 'Home', route: '/' },
          { label: 'Library', route: '#titlebar-heading' },
          { label: 'Components' },
        ]"
        :buttons="[
          { label: 'Docs', linkExt: 'https://vuejs.org', theme: 'light' },
          { label: 'New Release', icon: 'check', theme: 'blue', button: 'button', onClick },
        ]"
        banner-icon="bell"
        banner-label="Zero FontAwesome or Sass required — style SVGs directly from your app."
        banner-background="#ffffff"
        :banner-buttons="[
          { label: 'Dismiss', theme: 'dark-text', button: 'button', onClick },
        ]"
        description="Semantic <header>, <nav><ol> breadcrumbs, configurable heading levels, and responsive stacking."
      >
        <template #icon>
          <JsIcon color="#1d6f90">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </JsIcon>
        </template>
      </JsTitleBar>
    </div>

    <div class="pg-card pg-dark-card">
      <h3>Dark Theme + Dropdown Title Switcher</h3>
      <JsTitleBar
        :heading-level="3"
        :dark="true"
        title="Workspace Alpha"
        sub-title="Click heading to switch workspace"
        icon="table-cells"
        background="#1c1f23"
        drop-theme="dark"
        drop-size="md"
        :drop="[
          { header: true, label: 'Switch Workspace' },
          { label: 'Workspace Alpha', active: true, icon: 'check', onClick },
          { label: 'Workspace Beta', icon: 'bell', onClick },
          { divider: true },
          { label: 'Create Workspace', icon: 'chevron-right', onClick },
        ]"
      />
    </div>

    <div class="pg-card">
      <h3>Thumbnail Avatar + Custom <code>#actions</code> Slot</h3>
      <JsTitleBar
        :heading-level="3"
        title="Release Pipeline"
        sub-title="Automated CI & npm packaging"
        :img="demoThumb"
        img-alt="Pipeline avatar"
        button-size="sm"
      >
        <template #actions>
          <JsNavItem
            size="sm"
            theme="green"
            :item="{ label: 'Run Check', icon: 'check', button: 'button' }"
            @click="onClick"
          />
        </template>
      </JsTitleBar>
    </div>
  </div>
</template>
