<template>
  <header
    :class="[
      'js-title-bar',
      { 'js-title-bar--dark': dark },
      { 'js-title-bar--bg': Boolean(background) },
      { 'js-title-bar--drop': Boolean(drop && drop.length) },
    ]"
  >
    <nav
      v-if="crumbs && crumbs.length"
      class="js-title-bar__crumbs"
      aria-label="Breadcrumb"
    >
      <ol class="js-title-bar__crumb-list">
        <li
          v-for="(crumb, i) in crumbs"
          :key="crumb.id != null ? crumb.id : i"
          class="js-title-bar__crumb"
        >
          <span
            v-if="i === crumbs.length - 1"
            class="js-title-bar__crumb-current"
            aria-current="page"
          >
            <JsMarkdown :parse="shouldParse('crumbs')" :val="crumb.label" />
          </span>
          <component
            :is="crumbTag(crumb)"
            v-else
            class="js-title-bar__crumb-link"
            :to="crumbTag(crumb) === 'router-link' ? crumbTarget(crumb) : undefined"
            :href="crumbTag(crumb) === 'a' ? crumbTarget(crumb) : undefined"
            :target="crumb.linkExt ? '_blank' : undefined"
            :rel="crumb.linkExt ? 'noopener noreferrer' : undefined"
          >
            <JsMarkdown :parse="shouldParse('crumbs')" :val="crumb.label" />
          </component>
        </li>
      </ol>
    </nav>

    <div
      class="js-title-bar__inner"
      :style="background ? { background } : undefined"
    >
      <div class="js-title-bar__heading-wrap">
        <span
          v-if="img && !hasDrop"
          :class="['js-title-bar__thumb', { 'js-title-bar__thumb--lg': Boolean(resolvedSubTitle) }]"
        >
          <img :src="img" :alt="imgAlt || ''" loading="lazy" />
        </span>

        <span
          v-if="($slots.icon || icon) && !hasDrop"
          :class="['js-title-bar__icon', { 'js-title-bar__icon--lg': Boolean(resolvedSubTitle) }]"
        >
          <slot name="icon">
            <JsIcon :name="icon" />
          </slot>
        </span>

        <component :is="headingTag" class="js-title-bar__heading">
          <JsNavItem
            v-if="hasDrop"
            :theme="dark ? 'headingdark' : 'heading'"
            :drop-tabs="dropTabs"
            :drop-size="dropSize"
            :drop-theme="dropTheme"
            :drop-tab-selected="dropTabSelected"
            :parse-markdown="parseMarkdown"
            :wrap="true"
            :item="{
              label: resolvedTitle,
              icon: icon,
              subLabel: resolvedSubTitle,
              items: drop,
              img: img,
              imgAlt: imgAlt,
              actionIcon: 'chevron-down',
            }"
          >
            <template v-if="$slots.icon" #icon>
              <slot name="icon" />
            </template>
          </JsNavItem>

          <span v-else class="js-title-bar__text">
            <span class="js-title-bar__title">
              <JsMarkdown :parse="shouldParse('title')" :val="resolvedTitle" />
            </span>
            <span v-if="resolvedSubTitle" class="js-title-bar__subtitle">
              <JsMarkdown :parse="shouldParse('subTitle')" :val="resolvedSubTitle" />
            </span>
          </span>
        </component>
      </div>

      <div v-if="(buttons && buttons.length) || $slots.actions" class="js-title-bar__actions">
        <slot name="actions">
          <JsPanelNav
            v-if="buttons && buttons.length"
            aria-label="Page actions"
            :size="buttonSize"
            :items="buttons"
            layout="rows"
            :parse-markdown="parseMarkdown"
          />
        </slot>
      </div>
    </div>

    <div
      v-if="bannerLabel"
      :class="[
        'js-title-bar__banner',
        { 'js-title-bar__banner--docked': Boolean(background) },
        { 'js-title-bar__banner--dark': bannerBackgroundDark },
      ]"
      :style="bannerBackground ? { background: bannerBackground } : undefined"
    >
      <div class="js-title-bar__banner-text">
        <slot name="banner-icon">
          <JsIcon v-if="bannerIcon" :name="bannerIcon" class="js-title-bar__banner-icon" />
        </slot>
        <span class="js-title-bar__banner-label">{{ bannerLabel }}</span>
      </div>
      <JsPanelNav
        v-if="bannerButtons && bannerButtons.length"
        class="js-title-bar__banner-buttons"
        aria-label="Banner actions"
        :items="bannerButtons"
        layout="rows"
        size="sm"
        :parse-markdown="parseMarkdown"
      />
    </div>

    <p v-if="description" class="js-title-bar__description">
      {{ description }}
    </p>

    <div v-if="$slots.default" class="js-title-bar__extra">
      <slot />
    </div>
  </header>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsNavItem from "./NavItem.vue";
import JsPanelNav from "./PanelNav.vue";
import { resolveLinkTag } from "../utils/router.js";

export default {
  name: "JsTitleBar",
  components: {
    JsIcon,
    JsMarkdown,
    JsNavItem,
    JsPanelNav,
  },
  props: {
    headingLevel: {
      type: Number,
      default: 1,
      validator(v) {
        return v >= 1 && v <= 6;
      },
    },
    title: {
      type: String,
      default: "",
    },
    subTitle: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Title",
    },
    subLabel: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
    imgAlt: {
      type: String,
      default: "",
    },
    background: {
      type: String,
      default: "",
    },
    buttons: {
      type: Array,
      default: () => [],
    },
    bannerLabel: {
      type: String,
      default: "",
    },
    bannerButtons: {
      type: Array,
      default: () => [],
    },
    bannerBackground: {
      type: String,
      default: "",
    },
    bannerBackgroundDark: {
      type: Boolean,
      default: false,
    },
    bannerIcon: {
      type: String,
      default: "",
    },
    buttonSize: {
      type: String,
      default: "md",
      validator(value) {
        return ["sm", "md", "lg"].includes(value);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    crumbs: {
      type: Array,
      default: () => [],
    },
    drop: {
      type: Array,
      default: () => [],
    },
    dropTabs: {
      type: Boolean,
      default: false,
    },
    dropTabSelected: {
      type: Number,
      default: 0,
    },
    dropSize: {
      type: String,
      default: "auto",
    },
    dropTheme: {
      type: String,
      default: "dark",
    },
    dark: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    headingTag() {
      return `h${this.headingLevel}`;
    },
    resolvedTitle() {
      return this.title || this.label;
    },
    resolvedSubTitle() {
      return this.subTitle || this.subLabel;
    },
    hasDrop() {
      return Boolean(Array.isArray(this.drop) && this.drop.length > 0);
    },
  },
  methods: {
    shouldParse(section) {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes(section) || pm.includes("label");
    },
    crumbTarget(crumb) {
      return crumb.linkExt || crumb.link || crumb.route || "#";
    },
    crumbTag(crumb) {
      return resolveLinkTag(this, {
        to: crumb.link || crumb.route || null,
        href: crumb.linkExt || null,
      });
    },
  },
};
</script>

<style scoped>
.js-title-bar {
  position: relative;
  font-family: var(--js-font-family);
  color: var(--js-color-text);
  margin-bottom: var(--js-space-4);
}

.js-title-bar__crumbs {
  margin-bottom: var(--js-space-3);
}

.js-title-bar__crumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--js-font-size-sm);
}

.js-title-bar__crumb {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.js-title-bar__crumb:not(:last-child)::after {
  content: "/";
  color: var(--js-color-text-muted);
}

.js-title-bar__crumb-link {
  color: var(--js-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.js-title-bar__crumb-link:hover {
  color: var(--js-color-primary-hover);
  text-decoration: underline;
}

.js-title-bar__crumb-link:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
  border-radius: 2px;
}

.js-title-bar__crumb-current {
  color: var(--js-color-text-muted);
  font-weight: 600;
}

.js-title-bar__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
  border-radius: var(--js-radius-lg);
}

.js-title-bar--bg .js-title-bar__inner {
  padding: var(--js-space-4);
}

.js-title-bar__heading-wrap {
  display: flex;
  align-items: center;
  gap: var(--js-space-3);
  flex: 1 1 16rem;
  min-width: 0;
}

.js-title-bar__icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.js-title-bar__icon--lg {
  font-size: 2.4rem;
}

.js-title-bar__thumb {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--js-radius-md);
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--js-color-surface-alt);
}

.js-title-bar__thumb--lg {
  width: 4.5rem;
  height: 4.5rem;
}

.js-title-bar__thumb > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.js-title-bar__heading {
  margin: 0;
  font-size: 1rem;
  min-width: 0;
  flex: 1 1 auto;
}

.js-title-bar__text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.js-title-bar__title {
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.15;
}

.js-title-bar__subtitle {
  font-size: var(--js-font-size-md);
  font-weight: 500;
  opacity: 0.85;
}

.js-title-bar__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
}

.js-title-bar__banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-3);
  margin-top: var(--js-space-3);
  padding: var(--js-space-3) var(--js-space-4);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
}

.js-title-bar__banner--docked {
  margin: 0 var(--js-space-4);
  border-top: 0;
  border-radius: 0 0 var(--js-radius-md) var(--js-radius-md);
  box-shadow: inset 0 6px 8px -6px rgba(0, 0, 0, 0.14);
}

.js-title-bar__banner--dark {
  color: var(--js-color-text-inverse);
  border-color: var(--js-color-divider-dark);
}

.js-title-bar__banner-text {
  display: flex;
  align-items: center;
  gap: var(--js-space-2);
  font-size: var(--js-font-size-md);
  font-weight: 600;
  flex: 1 1 14rem;
}

.js-title-bar__banner-icon {
  font-size: 1.15em;
}

.js-title-bar__description {
  margin: var(--js-space-3) 0 0;
  color: var(--js-color-text-muted);
  line-height: var(--js-line-height);
}

.js-title-bar__extra {
  margin-top: var(--js-space-3);
}

.js-title-bar--dark .js-title-bar__inner {
  color: var(--js-color-text-inverse);
}

.js-title-bar--dark .js-title-bar__crumb-link {
  color: var(--js-color-primary-soft);
}

.js-title-bar--dark .js-title-bar__crumb-current,
.js-title-bar--dark .js-title-bar__description {
  color: var(--js-color-text-inverse-muted);
}

@media (max-width: 600px) {
  .js-title-bar__banner--docked {
    margin: 0 var(--js-space-2);
  }
}
</style>
