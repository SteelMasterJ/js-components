<script setup>
import { JsNavItem, JsNavItemLabels } from "@steelmasterj/js-components";
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Standalone <code>JsNavItemLabels</code> (Truncated, Wrapped, Selective Wrap &amp; Markdown)</h3>
      <div class="pg-grid-2">
        <div class="pg-chip" style="border-radius: var(--js-radius-md); padding: 0.65rem 0.85rem;">
          <JsNavItemLabels
            :item="{
              label: 'Single-Line Truncated Primary Label That Overflows Narrow Containers',
              subLabel: 'Single-line truncated secondary subtitle as well',
            }"
          />
        </div>
        <div class="pg-chip" style="border-radius: var(--js-radius-md); padding: 0.65rem 0.85rem;">
          <JsNavItemLabels
            :wrap="true"
            :parse-markdown="true"
            :item="{
              label: '**Wrapped** *Markdown* Label gn[Ready]',
              subLabel: 'Both `label` and _subLabel_ wrap cleanly across narrow 320px viewports.',
            }"
          />
        </div>
        <div class="pg-chip" style="border-radius: var(--js-radius-md); padding: 0.65rem 0.85rem;">
          <JsNavItemLabels
            :wrap-label="true"
            :item="{
              label: 'wrapLabel=true allows the primary heading to wrap onto multiple lines cleanly',
              subLabel: 'subLabel stays single-line truncated here for contrast',
            }"
          />
        </div>
        <div class="pg-chip" style="border-radius: var(--js-radius-md); padding: 0.65rem 0.85rem;">
          <JsNavItemLabels
            :wrap-sub-label="true"
            parse-markdown="subLabel"
            :item="{
              label: 'Selective Markdown (parseMarkdown=subLabel)',
              subLabel: 'Primary *stays raw*, while _subLabel_ parses **markdown** bl[Tag].',
            }"
          />
        </div>
      </div>
    </div>

    <div class="pg-card">
      <h3>Composed Inside <code>JsNavItem</code></h3>
      <div class="pg-grid-2">
        <JsNavItem
          :block="true"
          theme="light"
          :item="{
            label: 'Truncated Long Label For Navigation Bars And Dense Toolbars',
            subLabel: 'Secondary metadata truncated with ellipsis',
            button: 'button',
          }"
        />
        <JsNavItem
          :block="true"
          theme="lightblue"
          :wrap="true"
          :parse-markdown="true"
          :item="{
            label: '*Wrapped* Composed Label gn[v3]',
            subLabel: 'Full descriptive subLabel wraps cleanly inside block JsNavItem.',
            button: 'button',
          }"
        />
      </div>
    </div>
  </div>
</template>
