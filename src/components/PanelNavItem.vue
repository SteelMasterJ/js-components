<template>
  <div
    ref="navitem"
    :class="[
      'panel-nav-item',
      'panel-nav-item-' + (item.size || size || 'md'),
      'panel-nav-item-' +
        (item.disabled || disabled ? 'disabled' : item.theme || theme),
      { 'panel-nav-item-inset': item.inset },
      { 'panel-nav-item-circle': item.circle || circle },
      { 'panel-nav-item-thumb': item.thumb || thumb },
      { 'panel-nav-item-drop': item.items },
    ]"
    :key="item.label + item.icon"
  >
    <component
      @click.prevent="item.onClick ? item.onClick($event, item) : undefined"
      :is="
        (item.linkExt || item.linkNew || item.linkExtNew) && !item.items
          ? 'a'
          : item.button
          ? 'button'
          : 'router-link'
      "
      :disabled="item.disabled"
      tabindex="0"
      :class="[
        'item',
        { 'item-active': item.active },
        { tip: item.tip },
        'tip-' + (item.tipPos || 'tr'),
      ]"
      :data-tip="item.tip"
      :href="
        item.linkNew || item.linkExt || item.linkExtNew
          ? item.linkNew || item.linkExt || item.linkExtNew
          : item.button
          ? false
          : '#'
      "
      :target="item.linkNew || item.linkExtNew ? '_blank' : false"
      :type="item.button"
      :to="
        item.onClick || item.items || item.linkExt || item.linkExtNew
          ? ''
          : item.link || item.route || ''
      "
      :role="item.onClick || item.items ? 'button' : false"
    >
      <JsMarkdown
        v-if="typeof item.tags === 'string'"
        :parse="[]"
        :val="item.tags"
        class="tags tags-md" />
      <div v-else-if="item.tags" class="tags">
        <span v-for="(tag, i) in item.tags" :key="i" class="tag">{{
          tag
        }}</span>
      </div>
      <span class="icon" :title="item.icon" v-if="item.icon"
        >&#x200b;
        <i
          :style="{ color: item.iconColor }"
          :class="[
            'icn',
            {
              'icn-x2':
                item.subLabel &&
                item.label &&
                !(circle || item.circle) &&
                !(thumb || item.thumb),
            },
            'fa-' + item.icon,
            'fa-' + (item.iconVariant || 'solid'),
          ]"
        ></i
      ></span>
      <span
        v-else-if="item.img"
        :title="item.label"
        :class="[
          'thumb',
          { 'thumb-x2': item.subLabel || item.imgSize == 'lg' },
        ]"
        ><img :src="item.img" alt="thumb"
      /></span>
      <span
        v-else-if="item.number"
        :class="[
          'number',
          { 'number-x2': item.subLabel || item.numberSize == 'lg' },
        ]"
        >{{ item.number }}</span
      >
      <slot />
      <div v-if="item.label || item.subLabel" class="labels">
        <span
          v-if="item.label"
          :class="['label', { 'label-wrap': item.wrap || item.wrapLabel }]"
          ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="item.label"
        /></span>
        <span
          v-if="item.subLabel"
          :class="[
            'sub-label',
            { 'sub-label-wrap': item.wrap || item.wrapSubLabel },
          ]"
          ><JsMarkdown
            :parse="parseMarkdown.match(/subLabel|\*/)"
            :val="item.subLabel"
        /></span>
      </div>
      <span
        v-if="item.notifyCount > 0 || item.notifyLabel || item.notifyIcon"
        :data-tip="notifyTipText(item)"
        :data-count="item.notifyCount"
        role="alert"
        :class="[
          'notify',
          { 'notify-tip': notifyTipText(item) },
          'notify-' + (item.notifyColor || notifyColor),
        ]"
      >
        <span v-if="item.notifyCount > 0">{{ item.notifyCount }}</span>
        <span v-if="item.notifyLabel">{{ item.notifyLabel }}</span
        ><i
          v-if="item.notifyIcon"
          :class="[
            'icn icn-sm fa-' + item.notifyIcon,
            'fa-' + (item.notifyIconVariant || 'solid'),
          ]"
        ></i
      ></span>
      <i
        v-if="action(item)"
        :class="[
          'icn act fa-' + action(item),
          'fa-' + (item.actionFX || 'nofx'),
          'fa-' + (item.actionIconVariant || 'solid'),
          { 'fa-spin': action(item) === 'spinner' },
        ]"
      ></i
    ></component>
    <div
      v-if="item.items"
      ref="drop"
      :class="[
        'drop',
        'drop-' + (item.dropSize || dropSize || 'auto'),
        'drop-' + (item.dropTheme || dropTheme || 'dark'),
        'drop-' + (item.dropPos || dropPos),
        { 'drop-right': item.dropRight || dropRight },
      ]"
    >
      <div v-if="dropTabs" class="tabs">
        <template v-for="(tab, i) in item.items">
          <input
            class="tab-input"
            :name="_uid + 'tabs'"
            type="radio"
            :checked="dropTabSelected == i"
            :id="_uid + 'tab' + i"
            :key="'ti' + (tab.id || i)"
          />
          <label
            :style="{ width: 96 / item.items.length + '%' }"
            class="tab-label"
            :for="_uid + 'tab' + i"
            :key="'tl' + (tab.id || i)"
            :title="tab.label"
            tabindex="0"
            ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="tab.label"
          /></label>
          <div class="tab-content" :key="'tc' + (tab.id || i)">
            <JsNavList
              :parseMarkdown="item.parseMarkdown || parseMarkdown"
              :theme="item.dropTheme || dropTheme"
              :dropSize="item.dropSize || dropSize"
              :items="tab.items"
            />
          </div>
        </template>
      </div>
      <JsNavList
        v-else
        :parseMarkdown="item.parseMarkdown || parseMarkdown"
        :theme="item.dropTheme || dropTheme"
        :dropSize="item.dropSize || dropSize"
        :items="item.items"
      />
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsNavList from "./NavList.vue";

export default {
  name: "JsPanelNavItem",
  components: {
    JsMarkdown,
    JsNavList,
  },

  data() {
    return {
      tabbedIndex: 0,
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    // items: Array,
    // label: String,
    // subLabel: String,
    // icon: String,
    // number: Number
    // iconColor: String,
    // iconVariant: String,
    // actionIcon: String,
    // img: String,
    // link: String,
    // linkExt: String,
    // linkExtNew: String,
    // route: String,
    // tip: String,
    // tags: Array,
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl", "xxl"].includes(value);
      },
    },
    active: Boolean,
    child: Boolean,
    disabled: Boolean,
    wrap: Boolean,
    wrapLabel: Boolean,
    wrapSubLabel: Boolean,
    inset: Boolean,
    circle: Boolean,
    thumb: Boolean,
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return [
          "light",
          "light-text",
          "lightblue",
          "dark",
          "dark-text",
          "blue",
          "blue-text",
          "darkblue",
          "darkblue-text",
          "green",
          "green-text",
          "orange",
          "orange-text",
          "purple",
          "purple-text",
          "heading",
          "headingdark",
          "light-xray",
          "dark-xray",
        ].includes(v);
      },
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    dropFixed: Boolean,
    dropRight: Boolean,
    dropTabs: Boolean,
    dropTabSelected: {
      type: Number,
      default: 0,
    },
    dropSize: {
      type: String,
      default: "auto",
      validator(v) {
        return ["auto", "sm", "md", "lg", "min"].includes(v);
      },
    },
    dropPos: {
      type: String,
      default: "bl",
      validator(v) {
        return ["bl", "br", "tl", "tr", "l", "r"].includes(v);
      },
    },
    dropTheme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    notifyCount: Number,
    notifyTip: String,
    notifyLabel: String,
    notifyIcon: String,
    notifyUnits: {
      type: String,
      default: "item",
    },
    notifyColor: {
      type: String,
      default: "orange",
      validator(v) {
        return [
          "grey",
          "gray",
          "blue",
          "green",
          "red",
          "orange",
          "light",
          "white",
        ].includes(v);
      },
    },
  },
  mounted() {
    const positionDrop = (this.dropFixed || this.item.dropFixed) && !this.child;
    if (positionDrop) {
      const drop = this.$refs.drop;
      const scrollParent = this.hasScrollParent(drop);
      if (scrollParent) {
        const nav = this.$refs.navitem;
        nav.addEventListener("focusin", () => {
          this.position(true, scrollParent);
        });
        nav.addEventListener("focusout", () => {
          this.position(false, scrollParent);
        });
      }
    }
  },
  computed: {},
  methods: {
    back(e) {
      const el = e.target;
      el.closest(".panel-nav-item-root").querySelector(".item").focus();
    },
    hasScrollParent(el) {
      let isScroll = false;
      while (el) {
        if (el.nodeName == "BODY") break;
        isScroll =
          window.getComputedStyle(el).getPropertyValue("overflow-y") ==
          "scroll";
        if (isScroll) {
          break;
        } else {
          el = el.parentNode;
        }
      }
      return isScroll ? el : false;
    },
    position(set, scrollParent) {
      if (set) {
        console.log("position...");
        const drop = this.$refs.drop;
        // freeze body
        document.body.style.height = "100%";
        document.body.style.overflow = "hidden";
        //freeze scroll ancestor
        scrollParent.style.overflow = "hidden";
        // position drop
        const bounds = this.$refs.navitem.getBoundingClientRect();
        const top = bounds.bottom;
        const left = bounds.left;
        drop.style.top = `${top}px`;
        drop.style.left = `${left}px`;
        drop.style.position = "fixed";
      } else {
        console.log("unPosition...");
        // unfreeze body
        document.body.style.height = "auto";
        document.body.style.overflow = "visible";
        //unfreeze scroll ancestor
        scrollParent.style.overflowY = "unset";
      }
    },
    action(item) {
      //support older action props
      let act = item.actionIcon;
      if (act === false) return false;
      if (typeof act === "string") return act;
      if (item.linkExtNew) act = "external-link-square-alt";
      if (item.wait) act = "spinner";
      if (item.check) act = "check";
      if (item.arrow) act = "angle-right";
      if (item.items) act = "caret-down";
      if (item.kabob) act = "ellipsis-vertical";
      return act;
    },
    notifyTipText(item) {
      let tip = false;
      if (item.notifyTip) tip = item.notifyTip;
      else if (item.notifyCount > 0)
        tip = this.pluralize(item.notifyCount, item.notifyUnits);
      return tip;
    },
    pluralize(count, noun, suffix = "s") {
      if (!noun) noun = "item";
      return `${count} ${noun}${count !== 1 ? suffix : ""}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.panel-nav-item,
.panel-nav-item-light {
  position: relative;
  min-width: 0;
  > .item {
    display: flex;
    transition: all 0.35s;
    gap: 0.65em;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 1.05em;
    border: none;
    font-family: inherit;
    cursor: pointer;
    background: #fff;
    text-align: left;
    padding: 0.5em 0.7em;
    color: darken(#2783a8, 15%);
    font-weight: 600;
    font-size: 1em;
    min-width: 0;
    position: relative;
    outline: none;
    &focus:not(:focus-visible) {
      background: #fff;
    }
    &:focus-visible {
      outline: 2px solid #f915d0;
      outline-offset: 2px;
    }
    > .tags {
      position: absolute;
      z-index: 1;
      top: -0.75em;
      left: -0.25em;
      display: flex;
      gap: 0.25em;
      &.tags-md {
        margin-top: -0.22em;
      }
      .tag {
        font-size: 0.8em;
        font-weight: 600;
        line-height: 1;
        background: #333;
        border-radius: 0.25em;
        white-space: nowrap;
        line-height: normal;
        color: #fff;
        padding: 0 0.35em;
      }
    }
    .icon,
    .act,
    .labels,
    .notify {
      font-size: 0.9em;
    }
    .icon {
      display: flex;
      align-items: center;
      .icn {
        min-width: 1.25em;
        text-align: center;
        &.icn-x2 {
          font-size: 1.85em;
        }
      }
    }
    .act {
      min-width: 1em;
      font-size: 0.85em;
      text-align: center;
    }
    .thumb {
      width: 3em;
      border-radius: 0.25em;
      overflow: hidden;
      display: block;
      position: relative;
      img {
        width: 100%;
        height: auto;
        display: block;
        transition: all 0.3s;
      }
      &.thumb-x2 {
        width: 4em;
        border-radius: 0.5em;
      }
    }
    .labels {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      .tag {
        color: #fff;
        background: #2783a8;
      }
      .label,
      .sub-label {
        min-width: 0;
        /* display: flex; */
        align-items: center;
        gap: 0.5em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        strong {
          font-weight: bolder;
        }
      }
      .sub-label {
        font-size: 0.8em;
        font-weight: 500;
        .tag {
          font-weight: 600;
        }
      }
      .label-wrap,
      .sub-label-wrap {
        white-space: wrap;
      }
    }
    .notify,
    .notify-orange {
      display: flex;
      gap: 0.2em;
      align-items: center;
      justify-content: center;
      min-width: 1.25em;
      height: 1.15em;
      text-align: center;
      border-radius: 100px;
      background: #f5940f;
      color: #fff;
      font-weight: 500;
      padding: 0 0.35em;
      position: relative;
      > * {
        font-size: 0.85em;
      }
      > .icn-sm {
        font-size: 0.7em;
      }
      &.notify-grey,
      &.notify-gray {
        background: #aaa;
      }
      &.notify-light,
      &.notify-white {
        background: #fff;
        color: #444;
      }
      &.notify-red {
        background: #dc0808;
      }
      &.notify-green {
        background: #268743;
      }
      &.notify-blue {
        background: #5cabe0;
      }
    }

    &:hover,
    &:active,
    &:focus,
    &.item-active {
      background: rgba(255, 255, 255, 1);
      background: #e1effc;
    }
    &.tip {
      &:after {
        content: attr(data-tip);
        text-transform: initial;
        position: absolute;
        z-index: 999;
        transform: translate(0, 100%);
        padding: 0.1em 0.35em;
        border-radius: 0.25em;
        background: #333;
        font-size: 0.85rem;
        font-weight: 500;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        display: none;
      }
      &:hover:not(:focus):after {
        display: block;
      }
    }
    &.tip-tr:after,
    &.tip-tl:after {
      top: -0.25em;
      transform: translate(0, -100%);
    }
    &.tip-br:after,
    &.tip-bl:after {
      bottom: -0.25em;
      transform: translate(0, 100%);
    }
    &.tip-tr:after {
      right: 0;
    }
    &.tip-tl:after {
      left: 0;
    }
    &.tip-br:after {
      right: 0;
    }
    &.tip-bl:after {
      left: 0;
    }
    &.tip-l:after {
      left: -0.25em;
      top: 50%;
      transform: translate(-100%, -50%);
    }
    &.tip-r:after {
      right: -0.25em;
      top: 50%;
      transform: translate(100%, -50%);
    }
    &.tip-t:after {
      left: 50%;
      top: -0.25em;
      transform: translate(-50%, -100%);
    }
    &.tip-b:after {
      left: 50%;
      bottom: -0.25em;
      transform: translate(-50%, 100%);
    }
  }
  > .drop,
  > .drop-auto,
  > .drop-dark {
    display: none;
    animation: folddown 0.3s ease-out;
    position: absolute;
    min-width: 170px;
    z-index: 1000;
    padding: 0.6em;
    left: 0;
    top: 100%;
    border-radius: 0.5em;
    background: #3c3434;
    text-align: left;
    transform: translateY(0.2rem);
    box-shadow: 0px 5px 12px 3px rgba(0, 0, 0, 0.3);
    font-size: 0.95em;
    .drop {
      left: 100%;
      top: 0;
      transform: translate(0.2em, 0);
      animation: none;
    }
    &.drop-right {
      left: unset;
      right: 0;
      .drop {
        left: unset;
        right: 100%;
        top: 0;
        transform: translate(-0.2em, 0);
        animation: none;
      }
    }
    &.drop-br {
      left: unset;
      right: 0;
    }
    &.drop-tl {
      top: unset;
      bottom: 100%;
      transform: translateY(-0.2rem);
    }
    &.drop-tr {
      left: unset;
      top: unset;
      bottom: 100%;
      right: 0;
      transform: translateY(-0.2rem);
    }
    &.drop-r {
      left: 100%;
      top: 0;
      transform: translateX(0.2em);
    }
    &.drop-l {
      right: 100%;
      left: unset;
      top: 0;
      transform: translateX(-0.2em);
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      .tab-input {
        position: absolute;
        opacity: 0;
      }
      .tab-label {
        cursor: pointer;
        color: rgb(175, 175, 175);
        text-align: center;
        white-space: nowrap;
        margin: 0.35em 0 1.25em 0;
        font-size: 0.85em;
        font-weight: 500;
        padding: 0;
        background: rgba(0, 0, 0, 0.35);
        transition: all 0.2s;
        &:hover,
        &:active {
          color: #fff;
          background: #444;
        }
        &:first-of-type {
          border-radius: 1em 0 0 1em;
        }
        &:last-of-type {
          border-radius: 0 1em 1em 0;
        }
      }
      .tab-content {
        display: none;
        order: 99;
        width: 100%;
      }
      .tab-input:checked + .tab-label {
        color: #222;
        background: #eaeaea;
        background: rgba(255, 255, 255, 0.8);
      }
      .tab-input:checked + .tab-label + .tab-content {
        display: block;
      }
    }
    &.drop-light {
      background: #fff;
      .tab-label {
        color: #797979;
        background: #ededed;
        &:active {
          color: #fff;
          background: rgb(0 0 0 / 80%);
        }
      }
      .tab-input:checked + .tab-label {
        color: #fff;
        background: rgb(98 98 98);
      }
    }

    &.drop-sm {
      width: 200px;
    }
    &.drop-md {
      width: 280px;
    }
    &.drop-lg {
      width: 360px;
    }
    &.drop-min {
      min-width: unset;
    }
    &.drop-pinned {
      display: block;
    }
  }
  //the magic is here - open drops
  &:focus-within > .drop,
  //ensures all sub-drops are displayed
  .drop:hover {
    display: block;
  }

  &.panel-nav-item-drop:focus-within {
    &:after {
      content: "";
      // background: red;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0.5em;
      cursor: pointer;
      //delay showing cover to support click event on drop btn
      animation: cover 1s ease-out;
    }
  }
  &.panel-nav-item-xs {
    > .item {
      gap: 0.5em;

      font-size: 0.8em;
      font-weight: 500;
      padding: 0.15em 0.35em;
      .thumb {
        width: 2em;
        border-radius: 0.1em;
        &.thumb-x2 {
          width: 3.5em;
        }
      }
    }
  }
  &.panel-nav-item-sm {
    > .item {
      font-size: 0.85em;
      gap: 0.5em;
      .thumb {
        width: 2.4em;
        border-radius: 0.1em;
        &.thumb-x2 {
          width: 3.6em;
        }
      }
    }
  }
  &.panel-nav-item-lg {
    > .item {
      font-size: 1.15em;
      .thumb {
        width: 3.8em;
        &.thumb-x2 {
          width: 4.8em;
        }
      }
    }
  }
  &.panel-nav-item-xl {
    > .item {
      font-size: 1.35em;
      /* border-radius: 100px; */
      .sub-label {
        font-size: 0.75em;
      }
      .thumb {
        width: 4.8em;
        &.thumb-x2 {
          // width: 5.8em;
        }
      }
    }
  }
  &.panel-nav-item-xxl {
    > .item {
      font-size: 4.75em;
      border-radius: 0.2em;
      padding: 0 0.2em;
      .thumb {
        width: 4.8em;
        &.thumb-x2 {
          width: 5.8em;
        }
      }
    }
  }
  &.panel-nav-item-inset {
    > .item {
      position: relative;
      &:before {
        position: absolute;
        content: "";
        top: 0.25em;
        left: 0.25em;
        right: 0.25em;
        bottom: 0.25em;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 0.75em;
        z-index: 1;
      }
    }
  }
  &.panel-nav-item-circle {
    display: flex;
    justify-self: center;
    > .item {
      flex-direction: column;
      justify-content: center;
      border-radius: 5em;
      width: 9em;
      height: 9em;
      padding: 0.5em;
      gap: 0;
      > .tags {
        top: 0.5em;
        left: 0.5em;
      }
      .labels {
        text-align: center;
        flex: 0;
      }
      .icon {
        font-size: 4em;
      }
      .thumb {
        border-radius: 0.5em;
        margin: 0.7em 0;
        width: 7em !important;
      }
      &:before {
        border-radius: 5em;
      }
    }
    > .drop {
      animation: folddown2 0.3s ease-out;
      left: 50%;
      transform: translate(-50%, -1.2em);
    }
  }
  &.panel-nav-item-thumb {
    min-width: auto;
    > .item {
      flex-direction: column;
      justify-content: center;
      gap: 0;
      padding: 0;
      > .tags {
        top: 0.5em;
        left: 0.5em;
      }
      .labels {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        line-height: 1.1;
        backdrop-filter: blur(4px);
        background: rgba(255, 255, 255, 0.85);
        border-radius: 0 0 0.25em 0.25em;
        font-size: 0.85em;
        font-weight: 600;
        padding: 0.5em 0.5em;
      }
      .icon {
        font-size: 4em;
      }
      .act {
        position: absolute;
        bottom: 0.5em;
        right: 0.5em;
      }
      .notify {
        position: absolute;
        top: 0.5em;
        right: 0.5em;
      }
      .thumb,
      .thumb-x2 {
        border-radius: 0.5em;
        width: 11em;
      }
      &:hover,
      &:active,
      &:focus {
        .labels {
          /* color: #2783a8; */
          /* background: rgba(255, 255, 255, 0.95); */
        }
      }
    }
    &.panel-nav-item-xs > .item {
      .thumb,
      .thumb-x2 {
        width: 7em;
      }
    }
    &.panel-nav-item-sm > .item {
      .thumb,
      .thumb-x2 {
        width: 9em;
      }
    }
    &.panel-nav-item-lg > .item {
      .thumb,
      .thumb-x2 {
        width: 13em;
      }
    }
    &.panel-nav-item-xl > .item {
      .thumb,
      .thumb-x2 {
        width: 17em;
      }
    }
  }
  &.panel-nav-item-disabled {
    > .item * {
      cursor: not-allowed;
      opacity: 0.75;
      // color: #fff;
      // background: #bbb;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: unset;
      }
      // .tag {
      //   background: #bbb;
      //   color: #ccc;
      // }
      // .icn {
      //   color: #fff;
      // }
    }
  }
  &.panel-nav-item-heading,
  &.panel-nav-item-headingdark {
    > .item {
      background: none;
      color: #222;
      &:hover,
      &:focus,
      &:active {
        background: rgba(255, 255, 255, 0.15);
        background: rgba(0, 0, 0, 0.05);
      }
      padding: 0.25em 0.5em;
      .icn {
        font-size: 1.25em;
        &.icn-x2 {
          font-size: 2.85em;
        }
      }
      .labels {
        line-height: 1.2;
        .label {
          font-size: 2.2em;
        }
        .sub-label {
          font-size: 1.1em;
        }
      }
    }
  }
  &.panel-nav-item-headingdark {
    > .item {
      color: #fff;
    }
  }
  &.panel-nav-item-light-nohover {
    > .item {
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: #fff;
      }
    }
  }
  &.panel-nav-item-light-xray {
    > .item {
      color: #111;
      background: rgb(247 247 247 / 85%);
      backdrop-filter: blur(1px);
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: #fff;
      }
      .tag {
        background: #fff;
        color: #222;
      }
    }
  }
  &.panel-nav-item-dark-xray {
    > .item {
      color: #fff;
      background: rgb(0 0 0 / 30%);
      backdrop-filter: blur(1px);
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: rgb(0 0 0 / 64%);
      }
      .tag {
        background: #444;
        color: #999;
      }
    }
  }
  &.panel-nav-item-light-text {
    > .item {
      color: #fff;
      background: none;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: rgba(0, 0, 0, 0.5);
      }
      .tag {
        background: #fff;
        color: #222;
      }
    }
  }
  &.panel-nav-item-dark-text {
    > .item {
      color: #222;
      background: none;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: rgba(0, 0, 0, 0.05);
      }
      .tag {
        background: #222;
        color: #111;
      }
    }
  }
  &.panel-nav-item-dark {
    > .item {
      color: #fff;
      background: #333;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: #000;
      }
      .tag {
        background: #fff;
        color: #222;
      }
    }
  }
  &.panel-nav-item-lightblue {
    $c: #1b5c75;
    $c: #1b75bc;
    $bg: #e1effc;
    $bg: #e5f9ff;
    $bgHover: darken($bg, 10%);
    > .item {
      color: $c;
      background: $bg;
      background: $bg;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        color: darken($c, 15%);
        background: $bgHover;
      }
      .tag {
        background: $bg;
        color: #fff;
      }
    }
    &.panel-nav-item-thumb > .item {
      .labels {
        background: $bg;
      }
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        .labels {
          background: $bgHover;
        }
      }
    }
  }
  &.panel-nav-item-blue {
    > .item {
      color: #fff;
      background: #2783a8;

      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#2783a8, 15%);
      }
      .tag {
        background: #fff;
        color: #2783a8;
      }
    }
  }
  &.panel-nav-item-blue-text {
    > .item {
      color: #2783a8;
    }
  }
  &.panel-nav-item-darkblue {
    > .item {
      color: #fff;
      background: #1b5c75;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#1b5c75, 10%);
      }
      .tag {
        background: #fff;
        color: #1b5c75;
      }
    }
  }
  &.panel-nav-item-darkblue-text {
    > .item {
      color: #1b5c75;
    }
  }
  &.panel-nav-item-green {
    > .item {
      color: #fff;
      background: #41b445;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#41b445, 10%);
      }
      .tag {
        background: #fff;
        color: #41b445;
      }
    }
  }
  &.panel-nav-item-green-text {
    > .item {
      color: #41b445;
    }
  }
  &.panel-nav-item-orange {
    > .item {
      color: #fff;
      background: #ed9137;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#ed9137, 10%);
      }
      .tag {
        background: #fff;
        color: #ed9137;
      }
    }
  }
  &.panel-nav-item-orange-text {
    > .item {
      color: #ed9137;
    }
  }
  &.panel-nav-item-lightorange {
    > .item {
      color: #ed9137;
      background: #fff2e6;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#fff2e6, 10%);
      }
      .tag {
        background: #ed9137;
        color: #fff;
      }
    }
  }
  &.panel-nav-item-purple {
    > .item {
      color: #fff;
      background: #974bb7;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: darken(#974bb7, 10%);
      }
      .tag {
        background: #fff;
        color: #974bb7;
      }
    }
  }
  &.panel-nav-item-purple-text {
    > .item {
      color: #974bb7;
    }
  }
}
@keyframes cover {
  0% {
    bottom: 100%;
  }
  100% {
    bottom: 0;
  }
}
@keyframes folddown {
  0% {
    transform-origin: top center;
    transform: translateY(-1em);
  }
  100% {
  }
}
@keyframes foldup {
  0% {
    transform-origin: bottom center;
    transform: translateY(-1em);
  }
  100% {
  }
}
@keyframes folddown2 {
  0% {
    transform-origin: top center;
    transform: translate(-50%, -2em);
  }
  100% {
  }
}
</style>
