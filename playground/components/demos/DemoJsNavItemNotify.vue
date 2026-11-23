<script setup>
import { ref } from "vue";
import { JsIcon, JsNavItem, JsNavItemNotify } from "@steelmasterj/js-components";

const liveCount = ref(3);
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>All WCAG AA Badge Colors (<code>notifyColor</code>)</h3>
      <div class="pg-row">
        <span class="pg-chip">
          <JsNavItemNotify :item="{ notifyCount: 3, notifyUnits: 'message' }" notify-color="orange" />
          orange (default)
        </span>
        <span class="pg-chip">
          <JsNavItemNotify :item="{ notifyCount: 12, notifyUnits: 'alert' }" notify-color="red" />
          red
        </span>
        <span class="pg-chip">
          <JsNavItemNotify :item="{ notifyLabel: 'Online', notifyIcon: 'check' }" notify-color="green" />
          green + label + icon
        </span>
        <span class="pg-chip">
          <JsNavItemNotify :item="{ notifyCount: 5, notifyIcon: 'bell' }" notify-color="blue" />
          blue + count + icon
        </span>
        <span class="pg-chip">
          <JsNavItemNotify :item="{ notifyLabel: 'Muted' }" notify-color="grey" />
          grey / gray
        </span>
        <span class="pg-chip pg-dark-strip pg-dark-strip--flush">
          <JsNavItemNotify :item="{ notifyLabel: 'Info' }" notify-color="light" />
          light / white
        </span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Live Region (<code>live=true</code>, <code>aria-live="polite"</code>) &amp; Custom <code>#icon</code> Slot</h3>
      <div class="pg-row">
        <JsNavItemNotify
          :item="{ notifyCount: liveCount, notifyUnits: 'unread item' }"
          notify-color="blue"
          :live="true"
        />
        <JsNavItem
          size="xs"
          theme="light"
          :item="{ label: '-1', button: 'button' }"
          @click="liveCount = Math.max(0, liveCount - 1)"
        />
        <JsNavItem
          size="xs"
          theme="blue"
          :item="{ label: '+1', button: 'button' }"
          @click="liveCount += 1"
        />
        <JsNavItemNotify :item="{ notifyLabel: 'Starred' }" notify-color="orange">
          <template #icon>
            <JsIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </template>
        </JsNavItemNotify>
      </div>
    </div>

    <div class="pg-card">
      <h3>Composed Inside <code>JsNavItem</code></h3>
      <div class="pg-row">
        <JsNavItem
          theme="light"
          notify-color="red"
          :item="{ label: 'Inbox', icon: 'bell', notifyCount: 9, notifyUnits: 'message', button: 'button' }"
        />
        <JsNavItem
          theme="dark"
          notify-color="light"
          :item="{ label: 'Deployments', notifyLabel: 'Synced', notifyIcon: 'check', button: 'button' }"
        />
      </div>
    </div>
  </div>
</template>
