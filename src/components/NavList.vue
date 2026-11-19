<template>
  <div :class="['drop-nav', 'drop-nav-' + theme]">
    <div v-if="0 && scroll" class="scroll" />
    <ul :class="['drop-nav-items', { 'drop-nav-items-scroll': scroll }]">
      <li v-for="(subItem, i) in items" :key="subItem.id || i">
        <div class="hdr" v-if="subItem.header">
          <JsMarkdown
            :parse="parseMarkdown.match(/header|\*/)"
            :val="subItem.label"
          />
        </div>
        <div class="divider" v-else-if="subItem.divider"></div>
        <div v-else-if="subItem.component">
          <component :is="subItem.component" v-bind="subItem.props || {}" />
        </div>

        <JsBtnSplit
          v-else-if="subItem.split && subItem.items"
          :items="subItem.items"
          theme="light-text"
          :size="subItem.size || size"
          :grow="subItem.grow || 'all'"
          :spaced="subItem.spaced"
          :dropRight="subItem.dropRight"
          :dropSize="subItem.dropSize || dropSize"
          :parseMarkdown="subItem.parseMarkdown || parseMarkdown"
        />
        <JsPanelNavItem
          :class="['test', { 'list-thumb': subItem.thumb }]"
          v-else
          :child="true"
          :size="subItem.size || size"
          :dropSize="subItem.dropSize || dropSize"
          :dropTheme="theme"
          :parseMarkdown="subItem.parseMarkdown || parseMarkdown"
          :item="{
            ...subItem,
            actionIcon:
              subItem.items && !subItem.actionIcon
                ? 'caret-right'
                : subItem.actionIcon,
          }"
          :theme="theme === 'dark' ? 'light-text' : 'dark-text'"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";

export default {
  name: "JsNavList",
  components: {
    JsMarkdown,
    JsBtnSplit: () => import("./BtnSplit.vue"),
    JsPanelNavItem: () => import("./PanelNavItem.vue"),
  },
  data() {
    return {};
  },
  props: {
    items: Array,
    size: {
      type: String,
      default: "md",
    },
    closeOnClick: Boolean,
    dropSize: String,
    parseMarkdown: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "dark",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    spaced: Boolean,
  },
  computed: {
    scroll() {
      // const haveSubItems = (item) => ((item.split || item.dropTabs) && item.items) && !item.items.items;
      const noSubItems = (item) => !item.items;
      // const splitItems = items.split && item.items.items;
      // const tabItems = items.tabs && item.items.items;
      // const haveSubItems = (item) =>
      //   (item.split && item.items.items) ||
      //   (item.dropTabs && item.items.items) ||
      //   item.items.items;
      return this.items.every(noSubItems);
    },
  },
};
</script>
<style lang="scss">
.drop-nav {
  transition: all 0.35s;
  .scroll {
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 5px;
    background: red;
  }
  .drop-nav-items {
    width: 100%;
    // overflow-y: auto;
    // overflow-x: hidden;
    // max-height: 25em;
    margin: 0;
    padding: 0;
    list-style: none;
    &.drop-nav-items-scroll {
      // max-height: unset;
      // overflow: visible;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 20em;
    }
    .hdr {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.85em;
      font-weight: 500;
      padding: 0.35em 0.5em;
      margin-bottom: 0.15em;
      a {
        color: #a4d5ff;
        text-decoration: none;
      }
      .tag {
        color: #222;
        background: #fff;
      }
    }
    .divider {
      height: 1px;
      margin: 0.35em -0.6em;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.4);
    }
    li {
      position: relative;
    }
    li:nth-child(n + 2) > .hdr {
      margin-top: 0.5em;
    }
    .list-thumb .thumb {
      width: 100%;
    }
  }
  &.drop-nav-light {
    .hdr {
      color: rgba(0, 0, 0, 0.8);
    }
    .divider {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  &.drop-nav-dark {
    .hdr {
      color: rgba(255, 255, 255, 0.9);
    }
    .divider {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
