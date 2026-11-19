<template>
  <header
    :class="[
      'title-bar',
      { 'title-bar-dark': dark },
      { 'title-bar-bg': background },
      { 'title-bar-drop': drop },
    ]"
  >
    <nav class="crumbs" aria-label="breadcrumb">
      <div class="crumb" v-for="(c, i) in crumbs" :key="i">
        <span v-if="i == crumbs.length - 1" class="text" aria-current="page"
          ><JsMarkdown :parse="parseMarkdown.match(/crumbs|\*/)" :val="c.label"
        /></span>
        <router-link v-else :to="c.link || c.route"
          ><JsMarkdown :parse="parseMarkdown.match(/crumbs|\*/)" :val="c.label"
        /></router-link>
      </div>
    </nav>
    <div
      class="inner"
      :style="{
        background: background,
      }"
    >
      <div class="heading">
        <span v-if="img && !drop" :class="['thumb', { 'thumb-x2': subTitle }]"
          ><img :src="img" alt="thumb"
        /></span>
        <span class="icon" v-if="icon && !drop"
          >&#x200b;
          <i
            :class="['icn', { 'icn-x2': subTitle }, 'fas fa-' + icon]"
          ></i
        ></span>
        <h1>
          <div v-if="drop" class="dropwrap">
            <JsPanelNavItem
              :theme="dark ? 'headingdark' : 'heading'"
              :dropTabs="dropTabs"
              :dropSize="dropSize"
              :dropTheme="dropTheme"
              :dropTabSelected="dropTabSelected"
              :parseMarkdown="parseMarkdown"
              wrap
              :item="{
                label: title,
                icon: icon,
                iconOptions: iconOptions,
                iconVariant: iconVariant,
                subLabel: subTitle,
                items: drop,
                img: img,
                actionIcon: 'angle-down',
              }"
            />
          </div>
          <div v-else class="text">
            <div class="title">
              <JsMarkdown
                :parse="parseMarkdown.match(/title|label|\*/)"
                :val="title || label"
              />
            </div>
            <div v-if="subTitle || subLabel" class="sub-title">
              <JsMarkdown
                :parse="parseMarkdown.match(/subTitle|subLabel|\*/)"
                :val="subTitle || subLabel"
              />
            </div>
          </div>
        </h1>
      </div>
      <JsPanelNav
        v-if="buttons"
        :size="buttonSize"
        :items="buttons"
        layout="rows"
        :parseMarkdown="parseMarkdown"
      />
      <slot />
    </div>
    <div
      :class="[
        'banner',
        { 'banner-bg-docked': background },
        { 'banner-bg-dark': bannerBackgroundDark },
      ]"
      v-if="bannerLabel"
      :style="{
        background: bannerBackground,
      }"
    >
      <div class="banner-text">
        <i
          v-if="bannerIcon"
          :class="['banner-icon', 'fas fa-' + bannerIcon]"
        ></i>
        <div class="banner-label">{{ bannerLabel }}</div>
      </div>
      <JsPanelNav
        class="banner-buttons"
        v-if="bannerButtons"
        :items="bannerButtons"
        layout="rows"
        :parseMarkdown="parseMarkdown"
      />
    </div>
    <div class="description" v-if="description">{{ description }}</div>
    <slot />
  </header>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsPanelNav from "./PanelNav.vue";
import JsPanelNavItem from "./PanelNavItem.vue";

export default {
  name: "JsTitleBar",
  components: {
    JsMarkdown,
    JsPanelNav,
    JsPanelNavItem,
  },
  props: {
    title: { type: String, default: "Title" },
    subTitle: String,
    label: { type: String, default: "Title" },
    subLabel: String,
    icon: String,
    iconOptions: Object,
    iconVariant: String,
    description: String,
    img: String,
    background: String,
    buttons: Array,
    bannerLabel: String,
    bannerButtons: Array,
    bannerBackground: String,
    bannerBackgroundDark: Boolean,
    bannerIcon: String,
    buttonSize: {
      type: String,
      default: "lg",
      validator(value) {
        return ["sm", "md", "lg"].includes(value);
      },
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    crumbs: Array,
    drop: Array,
    dropTabs: Boolean,
    dropTabSelected: {
      type: Number,
      default: 0,
    },
    dropSize: String,
    dropTheme: String,
    dark: Boolean,
  },
};
</script>
<style lang="scss">
.title-bar {
  padding: 0.5em 0 2em 0;
  margin-top: 2.6em;
  margin-bottom: 0.8em;
  border-radius: 1em;
  position: relative;
  /* background: rgba(255, 255, 255, 0.3); */
  /* padding: 0.5em 1em; */
  .inner {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75em;
    align-items: flex-start;
    border-radius: 1em;
    &.inner-bg {
      padding: 0.65em;
    }
    .heading {
      display: flex;
      align-items: center;
      gap: 0.75em;
      flex: 1;
      min-width: 30em;
    }
    .icon {
      display: flex;
      align-items: center;
      .icn {
        text-align: center;
        &.icn-x2 {
          font-size: 2.8em;
        }
      }
    }
    .thumb {
      width: 5.5em;
      min-width: 5.5em;
      border-radius: 0.5em;
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
      &.thumb-x2 {
        width: 5.5em;
        min-width: 5.5em;
      }
    }
    h1 {
      display: flex;
      margin: 0;
      color: #222;
      flex: 1;
      font-size: 1em;
      min-width: 40%;
      font-weight: bold;
      > .dropwrap {
        margin-top: -0.5em;
        margin-left: -0.5em;
      }
      > .text {
        .title {
          font-size: 2em;
          line-height: 1;
        }
        .sub-title {
          font-size: 0.95em;
          font-weight: 500;
          .tag {
            font-weight: 600;
          }
        }
        .tag {
          color: #fff;
          background: #2783a8;
        }
      }
    }
  }
  .crumbs {
    display: flex;
    gap: 1.5em;
    font-size: 0.85em;
    margin-bottom: 1.6em;
    animation: fadeIn 1s ease-out;
    .crumb {
      position: relative;
      color: #333;
      font-weight: 500;
      a {
        text-decoration: none;
        color: #1b5c75;
        &:before {
          content: "/";
          position: absolute;
          top: 50%;
          right: -0.75em;
          transform: translate(50%, -50%);
        }
      }
    }
  }
  .description {
    margin-top: 1.4em;
  }
  .banner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2em;
    border-radius: 0.5em;
    padding: 0.65em;
    background: #fff;
    margin-top: 1.4em;

    .banner-text {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-size: 1.25em;
      font-weight: 500;
      .banner-label {
        flex: 1;
      }
    }
    .banner-buttons {
    }
    &.banner-bg-dark {
      .banner-text {
        color: #fff;
      }
    }
    &.banner-bg-docked {
      box-shadow: inset 0px 10px 10px #0000001a;
      margin: 0 1.25em 0 1.25em;
      border-radius: 0 0 0.5em 0.5em;
    }
  }
  &.title-bar-dark {
    .inner h1 {
      color: #fff;
    }
  }
  &.title-bar-bg {
    .inner {
      padding: 0.75em;
      h1 {
        > .drop {
          margin: -0.25em;
        }
        > .text {
          margin: 0 0.25em;
        }
      }
    }
    &.title-bar-drop {
      .inner {
        padding-bottom: 0.25em;
      }
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
