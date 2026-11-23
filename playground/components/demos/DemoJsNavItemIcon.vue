<script setup>
import { JsIcon, JsNavItem, JsNavItemIcon } from "@steelmasterj/js-components";
import { demoThumb } from "../../data/demoAssets.js";
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Standalone <code>JsNavItemIcon</code> Modes (Icon, Colored, Large w/ subLabel, Number, Thumbnail, Slot)</h3>
      <div class="pg-row pg-row--spacious">
        <span class="pg-chip">
          <JsNavItemIcon :item="{ icon: 'bell' }" />
          Built-in Icon
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ icon: 'check-circle', iconColor: '#1e7e34' }" />
          Colored Icon
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ icon: 'search', label: 'Search', subLabel: 'Scales up' }" />
          Large Icon (label + subLabel)
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ number: 42 }" />
          Number (42)
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ number: 7, subLabel: 'Alerts' }" />
          Large Number
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ img: demoThumb, imgAlt: 'User avatar' }" />
          Thumbnail Image
        </span>
        <span class="pg-chip">
          <JsNavItemIcon :item="{ iconColor: '#7b3896' }">
            <JsIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </JsIcon>
          </JsNavItemIcon>
          Custom SVG Slot
        </span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Composed Inside <code>JsNavItem</code> (Default, Circle, Thumb)</h3>
      <div class="pg-row">
        <JsNavItem
          theme="light"
          :item="{ label: 'Number Media', subLabel: 'Active users', number: 128, button: 'button' }"
        />
        <JsNavItem
          theme="blue"
          :circle="true"
          :item="{ label: 'Circle', icon: 'bell', button: 'button' }"
        />
        <JsNavItem
          theme="light"
          :thumb="true"
          :item="{ label: 'Thumb Card', subLabel: 'Lazy image', img: demoThumb, imgAlt: 'Preview', button: 'button' }"
        />
      </div>
    </div>
  </div>
</template>
