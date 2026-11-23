<script setup>
import { ref } from "vue";
import { JsInput, JsMarkdown } from "@steelmasterj/js-components";

const liveInput = ref(
  "Try **bold**, _italic_, [Vue Docs](https://vuejs.org), and colored tags like gn[Ready] bl[v3] or[Beta]."
);
</script>

<template>
  <div class="pg-stack">
    <div class="pg-card">
      <h3>Plain Text Mode (parse=false)</h3>
      <JsMarkdown val="This *remains* plain _text_ with [unparsed] tags." />
    </div>

    <div class="pg-card">
      <h3>Parsed Rich Text, Safe Links &amp; Tooltip Title (parse=true, show-title=true)</h3>
      <JsMarkdown
        :parse="true"
        :show-title="true"
        val="**Bold**, *also bold*, _semantic em_, [Accessible Link](https://vuejs.org), and bare URL https://developer.mozilla.org"
      />
    </div>

    <div class="pg-card">
      <h3>All 12 WCAG-Checked Tag Colors</h3>
      <JsMarkdown
        :parse="true"
        val="[default] bl[blue] db[dark-blue] lb[light-blue] lt[light] wh[white] dk[dark] yw[yellow] or[orange] pu[purple] gn[green] rd[red]"
      />
    </div>

    <div class="pg-card">
      <h3>Selective Parse Tokens (parse="bold|tags" vs array)</h3>
      <div class="pg-stack">
        <div>
          <strong>Array <code>['tags']</code> (only tags parsed):</strong>
          <JsMarkdown
            :parse="['tags']"
            val="*Not bold* _not italic_ gn[Parsed Tag] bl[Info]"
          />
        </div>
        <div>
          <strong>XSS &amp; Unsafe URL Sanitization:</strong>
          <JsMarkdown
            :parse="true"
            val='<script>alert("xss")</script> [Blocked JS Link](javascript:alert(1)) &amp; *safe bold*'
          />
        </div>
      </div>
    </div>

    <div class="pg-card">
      <h3>Live Markdown Preview</h3>
      <div class="pg-stack">
        <JsInput
          v-model="liveInput"
          type="textarea"
          label="Edit Inline Markdown"
          :rows="2"
          size="sm"
        />
        <div class="pg-chip" style="border-radius: var(--js-radius-md); padding: 0.6rem 0.85rem;">
          <JsMarkdown :parse="true" :val="liveInput" />
        </div>
      </div>
    </div>
  </div>
</template>
