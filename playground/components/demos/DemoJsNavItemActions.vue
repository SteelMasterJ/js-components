<script setup>
import { JsIcon, JsNavItem, JsNavItemActions } from "@steelmasterj/js-components";
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Standalone <code>JsNavItemActions</code> Priority &amp; States</h3>
      <div class="pg-row">
        <span class="pg-chip"><JsNavItemActions :item="{ linkExt: 'https://vuejs.org' }" /> linkExt</span>
        <span class="pg-chip"><JsNavItemActions :item="{ wait: true }" /> wait (spinner)</span>
        <span class="pg-chip"><JsNavItemActions :item="{ check: true }" /> check</span>
        <span class="pg-chip"><JsNavItemActions :item="{ arrow: true }" /> arrow</span>
        <span class="pg-chip"><JsNavItemActions :item="{ items: [{ label: 'A' }] }" /> items (caret-down)</span>
        <span class="pg-chip"><JsNavItemActions :item="{ kabob: true }" /> kabob</span>
        <span class="pg-chip"><JsNavItemActions :item="{ actionIcon: 'search', actionIconColor: '#1d6f90' }" /> actionIcon override</span>
        <span class="pg-chip">
          <JsNavItemActions :item="{ arrow: true }">
            <JsIcon color="#a64b00">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" />
              </svg>
            </JsIcon>
          </JsNavItemActions>
          Custom SVG slot
        </span>
      </div>
    </div>

    <div class="pg-card">
      <h3>Composed Inside <code>JsNavItem</code> (Including <code>actionIcon: false</code> Suppression)</h3>
      <div class="pg-row">
        <JsNavItem theme="light" :item="{ label: 'External', linkExt: 'https://vuejs.org' }" />
        <JsNavItem theme="light" :item="{ label: 'External (No Icon)', linkExt: 'https://vuejs.org', actionIcon: false }" />
        <JsNavItem theme="light" :item="{ label: 'Working', wait: true, button: 'button' }" />
        <JsNavItem theme="light" :item="{ label: 'Saved', check: true, button: 'button' }" />
        <JsNavItem theme="light" :item="{ label: 'Continue', arrow: true, button: 'button' }" />
        <JsNavItem theme="light" :item="{ label: 'Options', kabob: true, button: 'button' }" />
      </div>
    </div>
  </div>
</template>
