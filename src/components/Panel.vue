<template>
  <component
    :is="as"
    :id="panelId"
    :aria-labelledby="title ? titleId : undefined"
    :class="[
      'js-panel',
      { 'js-panel--cover-link': primaryActionCoverLink },
      { 'js-panel--hover': primaryActionHover },
      { 'js-panel--compact': compact },
      { 'js-panel--has-bg': Boolean(backgroundImage) },
    ]"
    :style="rootStyle"
  >
    <div
      v-if="aboveNote || $slots.above"
      class="js-panel__above"
      :style="backgroundColor ? { borderColor: backgroundColor } : undefined"
    >
      <slot name="above">
        <JsMarkdown
          class="js-panel__note"
          :parse="shouldParse('title')"
          :val="aboveNote"
        />
      </slot>
    </div>

    <div v-if="backgroundImage" class="js-panel__bg" aria-hidden="true">
      <div
        :class="[
          'js-panel__bg-img',
          { 'js-panel__bg-img--padded': backgroundImagePadded },
          { 'js-panel__bg-img--zoom': backgroundImageZoom },
          { 'js-panel__bg-img--centered': backgroundImageCentered },
          { 'js-panel__bg-img--shade-top': backgroundImageShadeTop },
          { 'js-panel__bg-img--left': backgroundPositionLeft },
          { 'js-panel__bg-img--right': backgroundPositionRight },
        ]"
        :style="bgImageStyle"
      ></div>
    </div>

    <div v-if="$slots.header" class="js-panel__custom-header">
      <slot name="header" />
    </div>

    <header
      v-if="hasTitleBar"
      :class="[
        'js-panel__title',
        'js-panel__title--' + titleSize,
        { 'js-panel__title--dark': titleDark },
        { 'js-panel__title--transparent': titleBackgroundTransparent },
      ]"
    >
      <div v-if="icon || img || title || $slots.icon" class="js-panel__heading-group">
        <span v-if="$slots.icon || icon" class="js-panel__icon">
          <slot name="icon">
            <JsIcon :name="icon" />
          </slot>
        </span>
        <span v-if="img" class="js-panel__thumb">
          <img :src="img" :alt="resolvedImgAlt" loading="lazy" />
        </span>
        <component
          :is="headingTag"
          v-if="title"
          :id="titleId"
          class="js-panel__heading"
          :data-test-id="titleTestId || undefined"
        >
          <JsMarkdown :parse="shouldParse('title')" :val="title" />
        </component>
      </div>

      <div v-if="$slots.headerLeft" class="js-panel__header-left">
        <slot name="headerLeft" />
      </div>
      <div v-if="$slots.headerRight" class="js-panel__header-right">
        <slot name="headerRight" />
      </div>
      <div v-if="$slots.subActions" class="js-panel__sub-actions">
        <slot name="subActions" />
      </div>
    </header>

    <div v-if="banner || notify" class="js-panel__above-text">
      <div
        v-if="banner"
        :class="['js-panel__banner', { 'js-panel__banner--dark': bannerDark }]"
      >
        <JsMarkdown :parse="shouldParse('banner')" :val="banner" />
      </div>
      <div
        v-if="notify"
        :class="['js-panel__notify', { 'js-panel__notify--dark': notifyDark }]"
      >
        <span>{{ notify }}</span>
        <JsIcon name="bell" />
      </div>
    </div>

    <div class="js-panel__content-wrap">
      <div
        ref="contentRef"
        :class="[
          'js-panel__content',
          'js-panel__content--' + height,
          { 'js-panel__content--no-scroll': scroll === false },
          { 'js-panel__content--hide-scrollbars': !scrollbars },
          { 'js-panel__content--scroll-y': contentScrollY },
          { 'js-panel__content--scroll-x': contentScrollX },
        ]"
        @scroll.passive="setScrollHints"
      >
        <slot />
      </div>

      <button
        v-if="showScrollUp"
        type="button"
        class="js-panel__scroll-btn js-panel__scroll-btn--up"
        aria-label="Scroll content up"
        @click="nudgeScroll('y', -1)"
      >
        <JsIcon name="chevron-up" />
      </button>
      <button
        v-if="showScrollDown"
        type="button"
        class="js-panel__scroll-btn js-panel__scroll-btn--down"
        aria-label="Scroll content down"
        @click="nudgeScroll('y', 1)"
      >
        <JsIcon name="chevron-down" />
      </button>
      <button
        v-if="showScrollLeft"
        type="button"
        class="js-panel__scroll-btn js-panel__scroll-btn--left"
        aria-label="Scroll content left"
        @click="nudgeScroll('x', -1)"
      >
        <JsIcon name="chevron-left" />
      </button>
      <button
        v-if="showScrollRight"
        type="button"
        class="js-panel__scroll-btn js-panel__scroll-btn--right"
        aria-label="Scroll content right"
        @click="nudgeScroll('x', 1)"
      >
        <JsIcon name="chevron-right" />
      </button>
    </div>

    <JsNavItem
      v-if="primaryAction"
      :class="[
        'js-panel__action',
        {
          'js-panel__action--centered': Boolean(
            primaryAction.circle || primaryAction.pill
          ),
        },
      ]"
      :size="
        primaryAction.size ||
        (primaryAction.circle || primaryAction.pill ? 'md' : 'lg')
      "
      :circle="Boolean(primaryAction.circle)"
      :theme="
        primaryAction.theme ||
        (primaryAction.dark || primaryAction.circle
          ? 'dark-xray'
          : 'light-xray')
      "
      :item="primaryAction"
      @click="(event, item) => $emit('action-click', event, item)"
    />

    <a
      v-if="caption"
      :href="caption.link || caption.linkExt || undefined"
      :target="captionIsExternal ? '_blank' : undefined"
      :rel="captionIsExternal ? 'noopener noreferrer' : undefined"
      :class="['js-panel__caption', { 'js-panel__caption--dark': caption.dark }]"
    >
      <span class="js-panel__caption-text">
        <JsMarkdown :parse="shouldParse('caption')" :val="caption.label" />
      </span>
    </a>

    <footer v-if="footer || $slots.footer" class="js-panel__footer">
      <slot name="footer">
        <a
          v-if="footer && (footer.link || footer.linkExt)"
          :href="footer.link || footer.linkExt"
          :target="footerIsExternal ? '_blank' : undefined"
          :rel="footerIsExternal ? 'noopener noreferrer' : undefined"
          class="js-panel__footer-link"
        >
          <JsIcon v-if="footer.icon" :name="footer.icon" />
          <JsMarkdown :parse="shouldParse('footer')" :val="footer.label" />
        </a>
        <span v-else-if="footer" class="js-panel__footer-text">
          <JsIcon v-if="footer.icon" :name="footer.icon" />
          <span>{{ footer.label }}</span>
        </span>
      </slot>
    </footer>
  </component>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsNavItem from "./NavItem.vue";
import { createUid } from "../utils/uid.js";

export default {
  name: "JsPanel",
  components: {
    JsIcon,
    JsMarkdown,
    JsNavItem,
  },
  provide() {
    return {
      jsPanelRefreshScroll: this.setScrollHints,
    };
  },
  props: {
    as: {
      type: String,
      default: "section",
      validator(v) {
        return ["section", "article", "div", "aside"].includes(v);
      },
    },
    headingLevel: {
      type: Number,
      default: 2,
      validator(v) {
        return v >= 1 && v <= 6;
      },
    },
    title: {
      type: String,
      default: "",
    },
    titleTestId: {
      type: String,
      default: "",
    },
    titleDark: {
      type: Boolean,
      default: false,
    },
    titleSize: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    aboveNote: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    bannerDark: {
      type: Boolean,
      default: true,
    },
    notify: {
      type: String,
      default: "",
    },
    notifyDark: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Object,
      default: null,
    },
    icon: {
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
    titleBackgroundTransparent: {
      type: Boolean,
      default: false,
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    height: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg", "xl", "auto"].includes(v);
      },
    },
    scroll: {
      type: Boolean,
      default: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    scrollbars: {
      type: Boolean,
      default: false,
    },
    scrollHint: {
      type: Boolean,
      default: true,
    },
    backgroundImage: {
      type: String,
      default: "",
    },
    backgroundImagePadded: {
      type: Boolean,
      default: false,
    },
    backgroundImageCentered: {
      type: Boolean,
      default: false,
    },
    backgroundImageShadeTop: {
      type: Boolean,
      default: false,
    },
    backgroundImageZoom: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    backgroundImageSize: {
      type: Number,
      default: null,
    },
    backgroundPositionLeft: {
      type: Boolean,
      default: false,
    },
    backgroundPositionRight: {
      type: Boolean,
      default: false,
    },
    primaryAction: {
      type: Object,
      default: null,
    },
    primaryActionHover: {
      type: Boolean,
      default: false,
    },
    primaryActionCoverLink: {
      type: Boolean,
      default: false,
    },
    caption: {
      type: Object,
      default: null,
    },
    span: {
      type: [String, Number],
      default: "1",
    },
  },
  emits: ["action-click"],
  data() {
    return {
      panelId: createUid("js-panel"),
      titleId: createUid("js-panel-title"),
      contentScrollX: false,
      contentScrollY: false,
      contentScrolledLeft: true,
      contentScrolledRight: true,
      contentScrolledTop: true,
      contentScrolledBottom: true,
      resizeObserver: null,
    };
  },
  computed: {
    headingTag() {
      return `h${this.headingLevel}`;
    },
    hasTitleBar() {
      return Boolean(
        this.icon ||
          this.img ||
          this.title ||
          this.$slots.icon ||
          this.$slots.headerLeft ||
          this.$slots.headerRight ||
          this.$slots.subActions
      );
    },
    resolvedImgAlt() {
      if (this.imgAlt) return this.imgAlt;
      return this.title ? "" : "Panel image";
    },
    spanVal() {
      if (this.span === "all") return "1 / -1";
      return this.span && String(this.span) !== "1"
        ? `span ${this.span}`
        : undefined;
    },
    rootStyle() {
      const style = {};
      if (this.backgroundColor) style.backgroundColor = this.backgroundColor;
      if (this.spanVal) style.gridColumn = this.spanVal;
      return style;
    },
    bgImageStyle() {
      const escaped = String(this.backgroundImage).replace(/"/g, '\\"');
      const style = {
        backgroundImage: `url("${escaped}")`,
      };
      if (this.backgroundImageSize) {
        style.backgroundSize = `${this.backgroundImageSize}px`;
      }
      return style;
    },
    captionIsExternal() {
      return Boolean(
        this.caption && (this.caption.ext === "_blank" || this.caption.linkExt)
      );
    },
    footerIsExternal() {
      return Boolean(
        this.footer && (this.footer.ext === "_blank" || this.footer.linkExt)
      );
    },
    showScrollDown() {
      return (
        this.scrollHint &&
        this.scroll &&
        !this.contentScrolledBottom &&
        this.contentScrollY
      );
    },
    showScrollUp() {
      return (
        this.scrollHint &&
        this.scroll &&
        !this.contentScrolledTop &&
        this.contentScrollY
      );
    },
    showScrollLeft() {
      return (
        this.scrollHint &&
        this.scroll &&
        !this.contentScrolledLeft &&
        this.contentScrollX
      );
    },
    showScrollRight() {
      return (
        this.scrollHint &&
        this.scroll &&
        !this.contentScrolledRight &&
        this.contentScrollX
      );
    },
  },
  mounted() {
    if (this.scrollHint) {
      this.setScrollHints();
      if (typeof ResizeObserver !== "undefined" && this.$refs.contentRef) {
        this.resizeObserver = new ResizeObserver(() => this.setScrollHints());
        this.resizeObserver.observe(this.$refs.contentRef);
      } else if (typeof window !== "undefined") {
        window.addEventListener("resize", this.setScrollHints, { passive: true });
      }
    }
  },
  unmounted() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.setScrollHints);
    }
  },
  methods: {
    shouldParse(section) {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes(section);
    },
    nudgeScroll(dir, direction) {
      this.$nextTick(() => {
        const c = this.$refs.contentRef;
        if (!c) return;
        if (dir === "x") c.scrollLeft += c.clientWidth * 0.8 * direction;
        if (dir === "y") c.scrollTop += c.clientHeight * 0.8 * direction;
      });
    },
    setScrollHints() {
      this.$nextTick(() => {
        const c = this.$refs.contentRef;
        if (!c) return;
        this.contentScrollX = c.scrollWidth > c.clientWidth + 1;
        this.contentScrollY = c.scrollHeight > c.clientHeight + 1;
        this.contentScrolledLeft = c.scrollLeft < 1;
        this.contentScrolledRight =
          Math.abs(c.scrollWidth - c.clientWidth - c.scrollLeft) < 2;
        this.contentScrolledTop = c.scrollTop < 1;
        this.contentScrolledBottom =
          Math.abs(c.scrollHeight - c.clientHeight - c.scrollTop) < 2;
      });
    },
  },
};
</script>

<style scoped>
.js-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  font-family: var(--js-font-family);
  line-height: var(--js-line-height);
  color: var(--js-color-text);
  background-color: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-lg);
  text-align: left;
}

.js-panel--hover .js-panel__action {
  opacity: 0;
}

.js-panel--hover:hover .js-panel__action,
.js-panel--hover:focus-within .js-panel__action {
  opacity: 1;
}

.js-panel--cover-link {
  overflow: hidden;
}

.js-panel--cover-link .js-panel__action :deep(.js-nav-item__trigger)::before {
  content: "";
  position: absolute;
  inset: -100vh -100vw;
}

.js-panel__above {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--js-color-surface);
  border: 2px solid var(--js-color-border);
  border-radius: var(--js-radius-pill);
  padding: 0.15rem 0.9rem;
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  white-space: nowrap;
  max-width: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
}

.js-panel__bg {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  pointer-events: none;
}

.js-panel__bg-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  transition: transform 320ms ease;
}

.js-panel:hover .js-panel__bg-img--zoom {
  transform: scale(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .js-panel__bg-img {
    transition: none;
  }

  .js-panel:hover .js-panel__bg-img--zoom {
    transform: none;
  }
}

.js-panel__bg-img--left {
  background-position: left top;
}

.js-panel__bg-img--right {
  background-position: right top;
}

.js-panel__bg-img--centered {
  background-position: center center;
}

.js-panel__bg-img--padded {
  inset: var(--js-space-4);
  background-size: contain;
}

.js-panel__bg-img--shade-top::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.15) 45%,
    transparent 100%
  );
}

.js-panel__custom-header {
  position: relative;
  z-index: 1;
  border-radius: var(--js-radius-lg) var(--js-radius-lg) 0 0;
  overflow: hidden;
}

.js-panel__title {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-3);
  padding: var(--js-space-3) var(--js-space-4);
  background-color: var(--js-color-surface-alt);
  border-bottom: 1px solid var(--js-color-divider);
  border-radius: var(--js-radius-lg) var(--js-radius-lg) 0 0;
}

.js-panel__title--transparent {
  background-color: transparent;
  border-bottom-color: transparent;
  color: var(--js-color-text-inverse);
}

.js-panel__title--dark,
.js-panel__title--dark.js-panel__title--transparent {
  color: var(--js-color-text);
}

.js-panel__heading-group {
  display: flex;
  align-items: center;
  gap: var(--js-space-3);
  min-width: 0;
  flex: 1 1 auto;
}

.js-panel__icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.25em;
  flex-shrink: 0;
}

.js-panel__thumb {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--js-radius-sm);
  overflow: hidden;
  flex-shrink: 0;
  background-color: var(--js-color-surface-hover);
}

.js-panel__thumb > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.js-panel__heading {
  margin: 0;
  font-size: var(--js-font-size-lg);
  font-weight: 700;
  line-height: 1.25;
  min-width: 0;
  overflow-wrap: anywhere;
}

.js-panel__title--sm .js-panel__heading {
  font-size: var(--js-font-size-md);
}

.js-panel__title--sm .js-panel__thumb {
  width: 2rem;
  height: 2rem;
}

.js-panel__title--lg .js-panel__heading {
  font-size: var(--js-font-size-xl);
}

.js-panel__header-left,
.js-panel__header-right,
.js-panel__sub-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
}

.js-panel__header-right,
.js-panel__sub-actions {
  margin-inline-start: auto;
}

.js-panel__above-text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-2);
  padding: var(--js-space-2) var(--js-space-4) 0;
  font-size: var(--js-font-size-sm);
  font-weight: 500;
}

.js-panel__banner--dark,
.js-panel__notify--dark {
  color: var(--js-color-text-inverse);
}

.js-panel__notify {
  display: inline-flex;
  align-items: center;
  gap: var(--js-space-1);
  margin-inline-start: auto;
  font-style: italic;
}

.js-panel__content-wrap {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-width: 0;
}

.js-panel__content {
  padding: var(--js-space-4);
  scroll-behavior: smooth;
  overflow: auto;
}

.js-panel__content--sm {
  min-height: 3rem;
  max-height: 7rem;
}

.js-panel__content--md {
  min-height: 3rem;
  max-height: 15rem;
}

.js-panel__content--lg {
  min-height: 8rem;
  max-height: 22rem;
}

.js-panel__content--xl {
  min-height: 12rem;
  max-height: 28rem;
}

.js-panel__content--auto,
.js-panel__content--no-scroll {
  max-height: none;
  overflow: visible;
}

.js-panel__content--hide-scrollbars {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.js-panel__content--hide-scrollbars::-webkit-scrollbar {
  display: none;
}

.js-panel__scroll-btn {
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: 0;
  border-radius: var(--js-radius-pill);
  background-color: rgba(15, 23, 42, 0.72);
  color: var(--js-color-text-inverse);
  box-shadow: var(--js-shadow-sm);
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    opacity var(--js-transition-fast);
}

.js-panel__scroll-btn:hover {
  background-color: rgba(15, 23, 42, 0.92);
}

.js-panel__scroll-btn:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-panel__scroll-btn--up {
  top: var(--js-space-2);
  left: 50%;
  transform: translateX(-50%);
}

.js-panel__scroll-btn--down {
  bottom: var(--js-space-2);
  left: 50%;
  transform: translateX(-50%);
}

.js-panel__scroll-btn--left {
  left: var(--js-space-2);
  top: 50%;
  transform: translateY(-50%);
}

.js-panel__scroll-btn--right {
  right: var(--js-space-2);
  top: 50%;
  transform: translateY(-50%);
}

.js-panel__action {
  position: relative;
  z-index: 1;
  margin: var(--js-space-2) var(--js-space-4);
  transition: opacity var(--js-transition-base);
}

.js-panel__action--centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

.js-panel__caption {
  position: relative;
  z-index: 1;
  display: inline-flex;
  padding: 0 var(--js-space-4) var(--js-space-3);
  text-decoration: none;
}

.js-panel__caption-text {
  font-size: var(--js-font-size-sm);
  color: var(--js-color-text);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.2rem 0.75rem;
  border-radius: var(--js-radius-pill);
}

.js-panel__caption--dark .js-panel__caption-text {
  color: var(--js-color-text-inverse);
  background-color: rgba(15, 23, 42, 0.65);
}

.js-panel__caption:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-panel__footer {
  position: relative;
  z-index: 1;
  padding: var(--js-space-3) var(--js-space-4);
  border-top: 1px solid var(--js-color-divider);
  text-align: center;
  font-size: var(--js-font-size-sm);
  font-weight: 500;
}

.js-panel__footer-link,
.js-panel__footer-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--js-space-2);
}

.js-panel__footer-link {
  color: var(--js-color-primary);
  text-decoration: none;
}

.js-panel__footer-link:hover {
  color: var(--js-color-primary-hover);
  text-decoration: underline;
}

.js-panel__footer-link:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
  border-radius: 2px;
}

.js-panel--compact .js-panel__title,
.js-panel--compact .js-panel__content,
.js-panel--compact .js-panel__footer {
  padding: var(--js-space-2) var(--js-space-3);
}

@media (max-width: 640px) {
  .js-panel {
    grid-column: 1 / -1;
  }
}
</style>
