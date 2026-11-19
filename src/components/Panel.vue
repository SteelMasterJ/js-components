<template>
  <div
    :id="_uid"
    :class="[
      'panel',
      { 'panel-cover-link': primaryActionCoverLink },
      { 'panel-hover': primaryActionHover },
      { 'panel-compact': compact },
    ]"
    :style="{
      backgroundColor: backgroundColor,
      gridColumn: spanVal,
    }"
  >
    <div
      class="above"
      v-if="aboveNote || $slots.above"
      :style="{
        borderColor: backgroundColor,
      }"
    >
      <slot v-if="$slots.above" name="above"></slot>
      <JsMarkdown
        class="note"
        v-else
        :parse="parseMarkdown.match(/title|\*/)"
        :val="aboveNote"
      />
    </div>
    <div v-if="backgroundImage" class="bg">
      <div
        :class="[
          'bg-cover-img',
          { 'bg-cover-img-padded': backgroundImagePadded },
          { 'bg-cover-img-zoom': backgroundImageZoom },
          { 'bg-cover-img-centered': backgroundImageCentered },
          { 'bg-cover-img-shade-top': backgroundImageShadeTop },
          { 'bg-cover-img-left': backgroundPositionLeft },
          ,
          { 'bg-cover-img-right': backgroundPositionRight },
        ]"
        :style="[
          { backgroundImage: 'url(' + backgroundImage + ')' },
          {
            backgroundSize: backgroundImageSize
              ? `${backgroundImageSize}px`
              : undefined,
          },
        ]"
      ></div>
    </div>
    <div v-if="$slots.header">
      <div class="header" v-if="$slots.header">
        <slot name="header"></slot>
      </div>
    </div>
    <div
      v-if="
        icon ||
        img ||
        title ||
        $slots.headerLeft ||
        $slots.headerRight ||
        $slots.subActions
      "
      :class="[
        'title',
        'title-' + titleSize,
        { 'title-dark': titleDark },
        { 'title-transparent': titleBackgroundTransparent },
      ]"
    >
      <div class="text" v-if="icon || img || title">
        <i v-if="icon" :class="['icn fas', 'fa-' + icon]" :title="title"></i>
        <span v-if="img" class="thumb"><img :src="img" alt="thumb" /></span>
        <h2
          v-if="title"
          class="label"
          :data-test-id="titleTestId"
          :title="title"
        >
          <JsMarkdown :parse="parseMarkdown.match(/title|\*/)" :val="title" />
        </h2>
      </div>

      <div class="header-left" v-if="$slots.headerLeft">
        <slot name="headerLeft"></slot>
      </div>
      <div class="header-right" v-if="$slots.headerRight">
        <slot name="headerRight"></slot>
      </div>
      <div class="sub-actions" v-if="$slots.subActions">
        <slot name="subActions"></slot>
      </div>
    </div>
    <div v-if="banner || notify" class="above-text">
      <div v-if="banner" :class="['banner', { 'banner-dark': bannerDark }]">
        <JsMarkdown :parse="parseMarkdown.match(/banner|\*/)" :val="banner" />
      </div>
      <div v-if="notify" :class="['notify', { 'notify-dark': notifyDark }]">
        {{ notify }} <i class="icn fas fa-bell"></i>
      </div>
    </div>
    <div class="content-wrap">
      <div
        ref="content"
        @scroll.passive="setScrollHints"
        :class="[
          'content',
          'content-' + height,
          { 'content-no-scroll': scroll === false },
          { 'content-hide-scrollbars': !scrollbars },
          { 'content-scroll-y': contentScrollY },
          { 'content-scroll-x': contentScrollX },
        ]"
      >
        <div class="content-tab content-tab-active">
          <slot />
        </div>
      </div>
      <a
        v-if="showScrollDown"
        @click.prevent="nudgeScroll('y', 1)"
        class="scroll-btn scroll-btn-down"
        href="#"
        title="scroll"
        ><i class="icn fas fa-angle-down"></i
      ></a>
      <a
        v-if="showScrollUp"
        @click.prevent="nudgeScroll('y', -1)"
        class="scroll-btn scroll-btn-up"
        href="#"
        title="scroll"
        ><i class="icn fas fa-angle-up"></i
      ></a>
      <a
        v-if="showScrollRight"
        @click.prevent="nudgeScroll('x', 1)"
        class="scroll-btn scroll-btn-right"
        href="#"
        title="scroll"
        ><i class="icn fas fa-angle-right"></i
      ></a>
      <a
        v-if="showScrollLeft"
        @click.prevent="nudgeScroll('x', -1)"
        class="scroll-btn scroll-btn-left"
        href="#"
        title="scroll"
        ><i class="icn fas fa-angle-left"></i
      ></a>
    </div>
    <JsPanelNavItem
      :class="[
        'action',
        { 'action-centered': primaryAction.circle || primaryAction.pill },
      ]"
      v-if="primaryAction"
      :size="
        primaryAction.size ||
        (primaryAction.circle || primaryAction.pill ? 'md' : 'xl')
      "
      :circle="primaryAction.pill"
      :theme="
        primaryAction.theme ||
        (primaryAction.dark || primaryAction.circle
          ? 'dark-xray'
          : 'light-xray')
      "
      :item="primaryAction"
    />
    <a
      v-if="caption"
      :target="caption.ext"
      :href="caption.link"
      :class="['caption', { 'caption-dark': caption.dark }]"
      ><div class="text"><JsMarkdown :val="caption.label" /></div>
    </a>
    <div v-if="footer" class="below-text">
      <a
        v-if="footer.link"
        :target="footer.ext"
        :href="footer.link"
        class="footer"
        ><i v-if="footer.icon" :class="'icn fas fa-' + footer.icon"></i>
        <JsMarkdown :val="footer.label" />
      </a>
      <span v-else class="footer">
        <i v-if="footer.icon" :class="'icn fas fa-' + footer.icon"></i>
        {{ footer.label }}
      </span>
    </div>
    <div class="below-text" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsPanelNavItem from "./PanelNavItem.vue";

export default {
  name: "JsPanel",
  components: {
    JsMarkdown,
    JsPanelNavItem,
  },
  data() {
    return {
      contentScrollX: false,
      contentScrollY: false,
      contentScrolled: false,
      contentScrolledLeft: false,
      contentScrolledRight: false,
      contentScrolledTop: false,
      contentScrolledBottom: false,
      ob: null,
      currentTab: 1,
    };
  },
  props: {
    // Main h2 header
    title: {
      type: String,
      default: null,
    },
    // optional data-test-id for the title
    titleTestId: {
      type: String,
      default: "panel:title",
    },
    // Title text color, defaults to light on dark
    titleDark: Boolean,
    titleSize: {
      type: String,
      default: "md",
    },
    aboveNote: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: null,
    },
    bannerDark: {
      type: Boolean,
      default: true,
    },
    notify: {
      type: String,
      default: null,
    },
    notifyDark: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Object,
      default: null,
    },
    // Icon shown in top-left corner of panel container
    icon: {
      type: String,
      default: null,
    },
    img: {
      type: String,
      default: null,
    },
    titleBackgroundTransparent: Boolean,
    parseMarkdown: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "md",
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
    backgroundImage: String,
    backgroundImagePadded: Boolean,
    backgroundImageCentered: Boolean,
    backgroundImageShadeTop: Boolean,
    backgroundImageZoom: Boolean,
    backgroundColor: String,
    backgroundImageSize: {
      type: Number,
      default: null,
    },
    backgroundPositionLeft: Boolean,
    backgroundPositionRight: Boolean,
    primaryAction: Object,
    primaryActionHover: Boolean,
    primaryActionCoverLink: Boolean,
    caption: Object,
    subActions: Array,
    span: {
      type: String,
      default: "1",
    },
  },
  mounted() {
    if (this.scrollHint) this.setScrollHints();
    // window.addEventListener("resize", this.setScrollHints);
  },
  unmounted() {
    window.removeEventListener("resize", this.setScrollHints);
  },
  computed: {
    spanVal() {
      return this.span === "all" ? "1/-1" : `span ${this.span}`;
    },
    showScrollDown() {
      return this.scroll && !this.contentScrolledBottom && this.contentScrollY;
    },
    showScrollUp() {
      return this.scroll && !this.contentScrolledTop && this.contentScrollY;
    },
    showScrollLeft() {
      return this.scroll && !this.contentScrolledLeft && this.contentScrollX;
    },
    showScrollRight() {
      return this.scroll && !this.contentScrolledRight && this.contentScrollX;
    },
  },
  methods: {
    nudgeScroll: function (dir, n) {
      this.$nextTick(() => {
        const c = this.$refs.content;
        if (dir === "x") this.$refs.content.scrollLeft += c.clientWidth * n;
        if (dir === "y") this.$refs.content.scrollTop += c.clientHeight * n;
      });
    },
    setScrollHints: function () {
      this.$nextTick(() => {
        const c = this.$refs.content;
        this.contentScrollX = c.scrollWidth > c.clientWidth;
        this.contentScrollY = c.scrollHeight > c.clientHeight;
        this.contentScrolledLeft = c.scrollLeft < 1;
        this.contentScrolledRight =
          Math.abs(c.scrollWidth - c.clientWidth - c.scrollLeft) < 1;
        this.contentScrolledTop = c.scrollTop < 1;
        this.contentScrolledBottom =
          Math.abs(c.scrollHeight - c.clientHeight - c.scrollTop) < 1;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  flex: 1;
  line-height: normal;
  letter-spacing: normal;
  background-color: #f8f9fa;
  border-radius: 1em;
  text-align: left;
  position: relative;

  &.panel-hover {
    .action {
      opacity: 0;
    }
    &:hover .action {
      opacity: 1;
    }
  }
  &.panel-cover-link {
    overflow: hidden;
    ::deep(.action) {
      > a {
        border: 2px solid red;
      }
    }
    .action > a:before {
      border: 1px solid blue;
      content: "";
      position: absolute;
      top: -1600%;
      left: -20%;
      bottom: 100%;
      right: -20%;
      /* background: rgba(255, 0, 0, 0.2); */
    }
    .action.panel-nav-item-circle > a:before {
      top: -200%;
      left: -200%;
      bottom: -200%;
      right: -200%;
    }
  }
  .above {
    position: absolute;
    z-index: 2;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 100px;
    border: 0.15em solid;
    border-color: #fff;
    .note {
      display: block;
      padding: 0.15em 1.25em;
      font-weight: 500;
      font-size: 0.95em;
    }
  }
  .title,
  .content,
  .caption,
  .below-text {
    padding: 1em 1.2em;
    position: relative;
  }
  .header {
    padding: 0 1.2em;
    border-radius: 1em 1em 0 0;
    overflow: hidden;
  }
  .title {
    display: flex;
    gap: 0.75em;
    align-items: center;
    background: #eee;
    /* background: #e1effc; */
    /* background: #e5f9ff; */
    border-radius: 1em 1em 0 0;
    z-index: 1;
    .text {
      display: flex;
      gap: 0.75em;
      align-items: center;
      flex: 1;

      > .icn {
        font-size: 1.4em;
      }
      > .label {
        min-width: 7em;
        margin: 0;
        font-size: 1.2em;
      }
      .thumb {
        width: 3em;
        min-width: 3em;
        border-radius: 0.25em;
        overflow: hidden;
        display: block;
        position: relative;
        background: #666;
        img {
          width: 100%;
          height: auto;
          display: block;
          transition: all 0.3s;
        }
      }
    }

    .sub-actions,
    .header-left,
    .header-right {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
      align-items: center;
    }
    .sub-actions,
    .header-right {
      margin-left: auto;
    }
    .header-left {
      margin-right: auto;
    }
    &.title-sm .text {
      gap: 0.5em;
      > .icn {
        font-size: 1em;
      }
      .label {
        font-size: 1em;
      }
      .thumb {
        width: 2em;
        min-width: 2em;
        border-radius: 0.15em;
      }
    }
    &.title-dark,
    &.title-dark.title-transparent {
      color: #222;
    }
    &.title-transparent {
      background: none;
      padding-bottom: 0;
      color: #fff;
    }
    &.title-transparent + .above-text {
      padding-top: 0.75em;
    }
  }
  .above-text {
    display: flex;
    justify-content: space-between;
    margin: 0 1.25em 0.25em 1.25em;
    .banner,
    .notify {
      color: #222;
      font-weight: 500;
      padding: 0;
      font-size: 0.95em;
      position: relative;
    }
    .banner {
      flex: 1;
      &.banner-dark {
        color: #fff;
      }
    }
    .notify {
      margin-left: auto;
      text-align: right;
      font-style: italic;

      &.notify-dark {
        color: #fff;
      }
      .icn {
        font-size: 0.8em;
      }
    }
  }
  :not(.title-transparent) + .above-text {
    margin-top: 1em;
  }
  .above + .content-wrap {
    margin-top: 1em;
  }
  .content-wrap {
    position: relative;
    padding-top: 1em;
    flex: 1;
    .scroll-btn {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2em;
      height: 2em;
      border-radius: 1em;
      text-decoration: none;
      z-index: 3;
      opacity: 0;
      transition: 0.3s all;
      &:hover {
        background: rgba(255, 255, 255, 0.3);
        .icn {
          background: #000;
        }
      }
      .icn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.8em;
        height: 1.8em;
        border-radius: 0.75em;
        backdrop-filter: blur(3px);
        background: rgba(0, 0, 0, 0.6);
        box-shadow: 0px 2px 7px 3px rgba(255, 255, 255, 0.7);
        color: #fff;
      }
    }
    .scroll-btn-right,
    .scroll-btn-left {
      height: 5em;
      top: 50%;
      .icn {
        width: 1em;
      }
    }
    .scroll-btn-down,
    .scroll-btn-up {
      width: 5em;
      left: 50%;
      .icn {
        height: 1em;
      }
    }
    .scroll-btn-right {
      right: 0.25em;
      transform: translate(-25%, -50%);
    }
    .scroll-btn-left {
      left: 0.25em;
      transform: translate(25%, -50%);
    }
    .scroll-btn-down {
      bottom: 0;
      transform: translate(-50%, -25%);
    }
    .scroll-btn-up {
      top: 0.25em;
      transform: translate(-50%, 25%);
    }
  }
  .content,
  .content-md {
    min-height: 1em;
    max-height: 220px;
    /* overflow: auto; */
    scroll-behavior: smooth;
    padding-top: 0;
    &.content-hide-scrollbars {
      -ms-overflow-style: none; /* for Internet Explorer, Edge */
      scrollbar-width: none; /* for Firefox */
      overflow-y: scroll;
    }
    &.content-no-scroll {
      max-height: unset;
      overflow-y: unset;
    }
    &.content-hide-scrollbars::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
    &.content-sm {
      min-height: 40px;
      max-height: 80px;
    }
    &.content-lg {
      min-height: 140px;
      max-height: 350px;
    }
    &.content-xl {
      min-height: 240px;
      max-height: 400px;
    }
    &.content-auto {
      max-height: unset;
    }
    &.content-tab {
      display: none;
    }
    &.content-tab-active {
      display: block;
    }
    &.content-scroll-x {
      display: flex;
    }
    .hit {
      width: 1px;
      height: 1px;
    }
  }
  .action {
    margin: 0.5em;
    transition: all 0.5s;

    &.action-hidden,
    &.action-hover {
      opacity: 0;
    }
    &.action-centered {
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: 0;
    }
  }
  &:not(.panel-hover) .action {
    animation: fadeIn 0.5s ease-out;
  }
  .caption {
    text-decoration: none;
    transition: all 0.25s;
    display: flex;
    .text {
      color: #222;
      font-size: 0.85em;
      border-radius: 20px;
      padding: 0.15em 0.75em;
      background: rgba(255, 255, 255, 0.5);
    }
    &:hover,
    &:active,
    &:focus {
      color: blue;
    }
    &.caption-dark .text {
      color: #fff;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .footer {
    display: block;
    font-size: 0.9em;
    font-weight: 500;
    border-radius: 20px;
    padding: 1em 1.2em;
    text-align: center;
    a {
      color: #2783a8;
      text-decoration: none;
      &:hover {
        color: darken(#2783a8, 20);
      }
    }
  }
  .bg {
    position: absolute;
    border-radius: 1em;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .bg-cover-img {
      position: absolute;
      transition: all 0.25s ease-in-out;
      transform-origin: center;
      border-radius: 1em;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-size: cover;
      background-position: center 0;
      background-repeat: no-repeat;
      &:after {
        content: "";
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        border-radius: 1em;
        border: 1px solid rgba(0, 0, 0, 0.1);
        /* box-shadow: inset 0px 0 0.8em 0px rgba(0, 0, 0, 0.2); */
      }
      &.bg-cover-img-left {
        background-position: left 0;
      }
      &.bg-cover-img-right {
        background-position: right 0;
      }
      &.bg-cover-img-padded {
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        background-size: contain;
      }
      &.bg-cover-img-centered {
        background-position: center center;
      }
      &.bg-cover-img-shade-top {
        &:after {
          content: "";
          position: absolute;
          left: -2em;
          right: -2em;
          box-shadow: inset 0px 0 0.8em 0px rgba(0, 0, 0, 0.2),
            inset 0px 3em 3.3em 0px rgb(0 0 0 / 70%);
        }
      }
    }
  }
  &.panel-compact {
    > .title,
    > .content-wrap {
      padding-top: 0.5em;
      .content {
        padding-left: 0.6em;
        padding-right: 0.6em;
        padding-bottom: 0.5em;
      }
    }
  }
  &:hover {
    > .content-wrap {
      > .scroll-btn {
        opacity: 1;
      }
      > .scroll-btn-up {
        transform: translate(-50%, 0);
      }
      > .scroll-btn-down {
        transform: translate(-50%, 0);
      }
      > .scroll-btn-left {
        transform: translate(0, -50%);
      }
      > .scroll-btn-right {
        transform: translate(0, -50%);
      }
    }
    > .bg .bg-cover-img-zoom {
      /* background-position-y: 5px; */
      transform: scale(1.05);
    }
    > .action-hover {
      opacity: 1;
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
