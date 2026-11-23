<script setup>
import { ref } from "vue";
import { JsIcon, JsNavItem, JsPanel } from "@steelmasterj/js-components";
import { demoHeroBg, demoThumb } from "../../data/demoAssets.js";

const lastAction = ref("");

function onAction(_e, item) {
  lastAction.value = item?.label || "(panel action)";
}
</script>

<template>
  <div class="pg-stack">
    <p v-if="lastAction" class="pg-hint" role="status" aria-live="polite">
      Panel action clicked: <strong>{{ lastAction }}</strong>
    </p>

    <div class="pg-grid-2">
      <JsPanel
        title="Scrollable *Panel* bl[Live]"
        :heading-level="3"
        :parse-markdown="true"
        icon="list-ul"
        height="sm"
        :scroll-hint="true"
        :footer="{ label: 'View all activity', linkExt: 'https://vuejs.org', icon: 'external' }"
      >
        <template #headerRight>
          <JsNavItem
            size="xs"
            theme="lightblue"
            :item="{ label: 'Refresh', button: 'button' }"
            @click="onAction"
          />
        </template>
        <p v-for="n in 8" :key="n" class="pg-panel-line">
          Activity entry #{{ n }} — scroll or click the accessible chevron nudge buttons.
        </p>
      </JsPanel>

      <JsPanel
        as="article"
        title="Compact Card with Above Note"
        :heading-level="3"
        above-note="Featured gn[New]"
        :parse-markdown="true"
        :compact="true"
        height="auto"
        :scroll="false"
        :img="demoThumb"
        img-alt="Geometric emblem"
        banner="Updated today"
        :banner-dark="false"
        notify="2 updates"
        :notify-dark="false"
      >
        <p class="pg-panel-line">
          Uses semantic <code>&lt;article&gt;</code>, <code>&lt;header&gt;</code>, and
          <code>&lt;footer&gt;</code> with zero rigid <code>min-width</code> locks.
        </p>
        <template #footer>
          <JsNavItem
            size="sm"
            theme="blue"
            :item="{ label: 'Open Details', arrow: true, button: 'button' }"
            @click="onAction"
          />
        </template>
      </JsPanel>

      <JsPanel
        title="Hero Background Panel"
        :heading-level="3"
        :title-background-transparent="true"
        :background-image="demoHeroBg"
        :background-image-shade-top="true"
        :background-image-zoom="true"
        height="md"
        :scroll="false"
        :primary-action="{ label: 'Explore', icon: 'search', button: 'button', circle: true }"
        :caption="{ label: 'Hover to zoom background', link: '#panel-heading', dark: true }"
        @action-click="onAction"
      >
        <template #icon>
          <JsIcon color="#ffffff">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </JsIcon>
        </template>
      </JsPanel>

      <JsPanel
        as="aside"
        title="Dark Title & SubActions Slot"
        :heading-level="3"
        :title-dark="true"
        title-size="lg"
        background-color="#25282c"
        height="auto"
        :scroll="false"
      >
        <template #subActions>
          <div class="pg-row" style="padding: 0.35rem 0;">
            <JsNavItem
              size="xs"
              theme="light-text"
              :item="{ label: 'Filter', icon: 'search', button: 'button' }"
              @click="onAction"
            />
            <JsNavItem
              size="xs"
              theme="light-text"
              :item="{ label: 'Alerts', icon: 'bell', button: 'button' }"
              @click="onAction"
            />
          </div>
        </template>
        <p class="pg-panel-line" style="color: var(--js-color-text-inverse);">
          Demonstrates <code>as="aside"</code>, <code>titleDark</code>, <code>titleSize="lg"</code>,
          <code>backgroundColor</code>, and the <code>#subActions</code> slot.
        </p>
      </JsPanel>
    </div>
  </div>
</template>
