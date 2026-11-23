import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { getComponentDoc } from "../data/componentRegistry.js";

const DEFAULT_DESCRIPTION =
  "Interactive living documentation and playground for @steelmasterj/js-components: 24 WCAG 2.1 AA accessible Vue 3 components.";

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "js-components — Living Documentation & Playground",
      description: DEFAULT_DESCRIPTION,
    },
  },
  {
    path: "/components/:slug",
    name: "component-doc",
    component: () => import("../views/ComponentDocView.vue"),
    meta: {
      title: "Component Docs | @steelmasterj/js-components",
      description: DEFAULT_DESCRIPTION,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
    meta: {
      title: "Page Not Found | @steelmasterj/js-components",
      description: DEFAULT_DESCRIPTION,
    },
  },
];

export function createPlaygroundRouter(history) {
  const resolvedHistory =
    history || createWebHistory(import.meta.env.BASE_URL || "/");

  const router = createRouter({
    history: resolvedHistory,
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return { el: to.hash };
      return { top: 0 };
    },
  });

  router.afterEach((to) => {
    if (typeof document === "undefined") return;

    if (to.name === "component-doc") {
      const doc = getComponentDoc(to.params.slug);
      if (doc) {
        document.title = `${doc.name} | @steelmasterj/js-components`;
        const desc = document.querySelector('meta[name="description"]');
        if (desc) desc.setAttribute("content", doc.summary);
      } else {
        document.title = "Component Not Found | @steelmasterj/js-components";
      }
    } else {
      if (to.meta?.title) document.title = String(to.meta.title);
      const desc = document.querySelector('meta[name="description"]');
      if (desc && to.meta?.description) {
        desc.setAttribute("content", String(to.meta.description));
      }
    }

    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(() => {
        const main = document.getElementById("main-content");
        if (main) main.focus({ preventScroll: true });
      });
    }
  });

  return router;
}

const router = createPlaygroundRouter();
export default router;
