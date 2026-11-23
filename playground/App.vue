<script setup>
import { computed, getCurrentInstance } from "vue";
import { JsToast } from "@steelmasterj/js-components";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import HomeView from "./views/HomeView.vue";
import { useSafeRoute } from "./composables/useSafeRoute.js";
import { useToastConfig } from "./composables/useToastConfig.js";

const { hasRouter } = useSafeRoute();
const { toastPosition } = useToastConfig();
const appCtx = getCurrentInstance()?.appContext;
const routerViewComp = computed(() => appCtx?.components?.RouterView || null);
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <SiteHeader />
    <main id="main-content" class="site-main" tabindex="-1">
      <component :is="routerViewComp" v-if="hasRouter && routerViewComp" />
      <HomeView v-else />
    </main>
    <SiteFooter />
    <JsToast :position="toastPosition" />
  </div>
</template>
