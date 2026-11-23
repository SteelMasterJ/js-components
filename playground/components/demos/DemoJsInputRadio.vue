<script setup>
import { ref } from "vue";
import { JsInputRadio } from "@steelmasterj/js-components";

const demoRadio = ref("comfortable");
const demoDotColor = ref("#1d6f90");
</script>

<template>
  <div class="pg-grid-2">
    <div class="pg-card">
      <h3>Standard Radio Group (selected={{ demoRadio }})</h3>
      <JsInputRadio
        v-model="demoRadio"
        label="Preferred Density"
        :items="[
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ]"
        hint="Use Arrow keys to move between radio options."
      />
    </div>

    <div class="pg-card">
      <h3>Color Swatch Dots Mode (dots=true + .js-sr-only labels, selected={{ demoDotColor }})</h3>
      <JsInputRadio
        v-model="demoDotColor"
        label="Accent Color"
        :dots="true"
        :items="[
          { label: 'Ocean Blue', value: '#1d6f90', color: '#1d6f90' },
          { label: 'Forest Green', value: '#1e7e34', color: '#1e7e34' },
          { label: 'Burnt Orange', value: '#a64b00', color: '#a64b00' },
          { label: 'Royal Purple', value: '#7b3896', color: '#7b3896' },
          { label: 'Crimson Red', value: '#c5221f', color: '#c5221f' },
        ]"
      />
    </div>
  </div>
</template>
