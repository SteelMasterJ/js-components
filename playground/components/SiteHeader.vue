<script setup>
import { computed } from "vue";
import { JsDrop, JsIcon, JsNavItem } from "@steelmasterj/js-components";
import { useSafeRoute } from "../composables/useSafeRoute.js";
import { getComponentsByCategory } from "../data/componentRegistry.js";

const { currentPath, currentSlug } = useSafeRoute();

const categories = getComponentsByCategory();

const brandItem = computed(() => ({
  label: "js-components",
  link: "/",
  active: currentPath.value === "/",
}));

const playgroundNavItem = computed(() => ({
  label: "Playground",
  icon: "table-cells",
  link: "/",
}));

function buildCategoryDropdownItems(cat) {
  const slug = currentSlug.value;
  if (cat.id !== "navigation") {
    return [
      { header: true, label: cat.label },
      ...cat.items.map((doc) => ({
        label: doc.name,
        subLabel: doc.summary,
        icon: doc.icon,
        link: `/components/${doc.slug}`,
        active: slug === doc.slug,
      })),
    ];
  }

  const primary = cat.items.filter((d) => !d.slug.startsWith("js-nav-item-"));
  const subs = cat.items.filter((d) => d.slug.startsWith("js-nav-item-"));

  return [
    { header: true, label: "Core Navigation" },
    ...primary.map((doc) => ({
      label: doc.name,
      subLabel: doc.summary,
      icon: doc.icon,
      link: `/components/${doc.slug}`,
      active: slug === doc.slug,
    })),
    { divider: true },
    { header: true, label: "NavItem Sub-Components" },
    ...subs.map((doc) => ({
      label: doc.name,
      subLabel: doc.summary,
      icon: doc.icon,
      link: `/components/${doc.slug}`,
      active: slug === doc.slug,
    })),
  ];
}

const desktopCategories = computed(() =>
  categories.map((cat) => ({
    id: cat.id,
    active: cat.items.some((doc) => doc.slug === currentSlug.value),
    item: {
      label: cat.label,
      items: buildCategoryDropdownItems(cat),
    },
  }))
);

const mobileTabItems = computed(() =>
  categories.map((cat, idx) => {
    const entries = buildCategoryDropdownItems(cat);
    const items =
      idx === 0
        ? [
            {
              label: "All-in-One Playground",
              subLabel: "Home showcase & component directory",
              icon: "table-cells",
              link: "/",
              active: currentPath.value === "/",
            },
            { divider: true },
            ...entries,
          ]
        : entries;

    return {
      id: cat.id,
      label: cat.shortLabel,
      items,
    };
  })
);
</script>

<template>
  <header class="site-header">
    <div class="site-container site-header__inner">
      <div class="site-header__brand">
        <JsNavItem :item="brandItem" theme="blue" size="sm">
          <template #icon>
            <JsIcon>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2zm0 2.3L6 7.7v8.6l6 3.4 6-3.4V7.7l-6-3.4z"
                />
              </svg>
            </JsIcon>
          </template>
        </JsNavItem>
      </div>

      <nav
        aria-label="Component documentation navigation"
        class="site-nav-desktop"
      >
        <ul class="site-nav-list">
          <li>
            <JsNavItem
              :item="playgroundNavItem"
              :active="currentPath === '/'"
              theme="light"
              size="sm"
            />
          </li>
          <li v-for="cat in desktopCategories" :key="cat.id">
            <JsNavItem
              :item="cat.item"
              :active="cat.active"
              theme="light"
              size="sm"
              drop-theme="light"
              drop-size="md"
              :drop-right="cat.id === 'forms' || cat.id === 'layout'"
            />
          </li>
        </ul>
      </nav>

      <nav aria-label="Mobile component navigation" class="site-nav-mobile">
        <JsDrop
          trigger-label="Components"
          trigger-icon="list-ul"
          :tabs="true"
          :right="true"
          size="md"
          theme="light"
          aria-label="All components menu"
          :items="mobileTabItems"
        />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--js-z-sticky);
  background: var(--js-color-surface);
  border-bottom: 1px solid var(--js-color-border);
  box-shadow: var(--js-shadow-sm);
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
  min-height: var(--site-header-height);
  padding-block: var(--js-space-2);
}

.site-header__brand {
  flex-shrink: 0;
}

.site-nav-desktop {
  display: none;
}

.site-nav-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-nav-mobile {
  display: flex;
  align-items: center;
}

@media (min-width: 60rem) {
  .site-nav-desktop {
    display: block;
  }

  .site-nav-mobile {
    display: none;
  }
}
</style>
