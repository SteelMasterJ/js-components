import { computed, getCurrentInstance } from "vue";

/**
 * Safely reads vue-router availability and current route metadata without
 * triggering Vue 3 injection warnings when vue-router is not installed
 * (such as legacy unit tests that mount App.vue without a router plugin).
 */
export function useSafeRoute() {
  const inst = getCurrentInstance();
  const appCtx = inst?.appContext;

  const hasRouter = computed(() =>
    Boolean(
      appCtx?.components?.RouterView ||
        appCtx?.config?.globalProperties?.$router
    )
  );

  const currentRoute = computed(() => {
    if (!hasRouter.value) return null;
    return appCtx?.config?.globalProperties?.$route || null;
  });

  const currentPath = computed(() => currentRoute.value?.path || "/");

  const currentSlug = computed(() => {
    const slug = currentRoute.value?.params?.slug;
    return typeof slug === "string" ? slug : "";
  });

  return {
    hasRouter,
    currentRoute,
    currentPath,
    currentSlug,
  };
}

export function useSafeRouter() {
  const inst = getCurrentInstance();
  const appCtx = inst?.appContext;

  const router = computed(
    () => appCtx?.config?.globalProperties?.$router || null
  );

  function push(to) {
    if (router.value) {
      return router.value.push(to);
    }
    return undefined;
  }

  return {
    router,
    push,
  };
}
