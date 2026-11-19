<template>
  <nav
    :class="[
      'panel-nav',
      'panel-nav-' + (theme || 'notheme'),
      'panel-nav-' + size,
    ]"
  >
    <div v-if="menu">
      <JsBtnSplit size="sm" :items="menuConfigButtons" />
    </div>
    <div v-if="showSearch" class="search">
      <div v-if="searchOpen" :class="['input', { active: searchOpen }]">
        <i class="icn fas fa-search"></i>
        <input
          :placeholder="'Search ' + itemUnits"
          id="panelNavQ"
          type="text"
          v-model="q"
          ref="filterQ"
        />
        <label
          :class="{ none: count == 0 }"
          v-if="q.length && count > 0 && count <= total"
          for="panelNavQ"
          >{{ count }}</label
        >
        <button @click="clear" class="clear" type="button">
          <i class="icn fas fa-times"></i>
        </button>
      </div>
      <button v-else @click="activate" type="button" class="activate">
        <i class="icn fas fa-search"></i> Search {{ itemUnits }}
      </button>
    </div>
    <div v-if="count" class="items">
      <div v-if="grouped" class="grouped">
        <div
          v-for="(group, key) in filteredItems"
          :key="group.id || key"
          :class="[
            'group',
            { 'group-labels-left': groupLabelsLeft },
            { 'group-labels-hidden': groupLabelsHidden },
          ]"
        >
          <div v-if="key.length" class="groupLabel">
            <JsMarkdown
              :parse="parseMarkdown.match(/group|\*/)"
              :val="getGroupLabel(key, group.length)"
            />
          </div>
          <div
            :class="[
              'layout',
              'layout-' + layout,
              'layout-gap-' + layoutGap,
              { 'layout-compact': layoutCompact },
              { 'layout-cols-1': columns === '1' },
              { 'layout-cols-2': columns === '2' },
              { 'layout-cols-3': columns === '3' },
              { 'layout-cols-4': columns === '4' },
              { 'layout-cols-5': columns === '5' },
              { 'layout-rows': !grid },
              { 'layout-rows-right': layoutRight },
            ]"
          >
            <template v-for="(item, j) in group">
              <div class="hdr" v-if="item.header" :key="item.id || j">
                <JsMarkdown :val="item.label" />
              </div>
              <div
                v-else-if="
                  item.divider &&
                  ['cols-1', 'row', 'space-first', 'space-last'].includes(
                    layout
                  )
                "
                :class="[
                  'divider',
                  {
                    'divider-v': ['row', 'space-first', 'space-last'].includes(
                      layout
                    ),
                  },
                ]"
                :key="item.id || j"
              ></div>
              <JsBtnSplit
                v-if="item.split && item.items"
                :items="item.items"
                :theme="item.theme || theme"
                :circle="item.circle || circle"
                :thumb="item.thumb || thumb"
                :size="item.size || size"
                :grow="item.splitGrow || splitGrow"
                :dropRight="item.dropRight || dropRight"
                :dropSize="item.dropSize || dropSize"
                :dropTheme="item.dropTheme || dropTheme"
                :parseMarkdown="item.parseMarkdown || parseMarkdown"
                :spaced="item.spaced"
                :key="item.id || j"
              />
              <JsPanelNavItem
                v-else
                :key="item.id || j"
                :item="item"
                :theme="item.theme || theme"
                :circle="item.circle || circle"
                :thumb="item.thumb || thumb"
                :size="item.size || size"
                :dropRight="item.dropRight || dropRight"
                :dropTabs="item.dropTabs || dropTabs"
                :dropTabSelected="item.dropTabSelected"
                :dropSize="item.dropSize || dropSize"
                :parseMarkdown="item.parseMarkdown || parseMarkdown"
                :dropTheme="item.dropTheme || dropTheme"
              />
            </template>
          </div>
        </div>
      </div>
      <div
        v-else
        :class="[
          'layout',
          'layout-' + layout,
          'layout-gap-' + layoutGap,

          { 'layout-compact': layoutCompact },
          { 'layout-cols-1': columns === '1' },
          { 'layout-cols-2': columns === '2' },
          { 'layout-cols-3': columns === '3' },
          { 'layout-cols-4': columns === '4' },
          { 'layout-cols-5': columns === '5' },
          { 'layout-rows': !grid },
          { 'layout-rows-right': layoutRight },
        ]"
      >
        <template v-for="(item, i) in filteredItems">
          <div class="hdr" v-if="item.header" :key="item.id || i">
            <JsMarkdown :val="item.label" />
          </div>
          <div
            v-else-if="
              item.divider &&
              ['cols-1', 'row', 'space-first', 'space-last'].includes(layout)
            "
            :class="[
              'divider',
              {
                'divider-v': ['row', 'space-first', 'space-last'].includes(
                  layout
                ),
              },
            ]"
            :key="item.id || i"
          ></div>
          <JsBtnSplit
            v-else-if="item.split && item.items"
            :items="item.items"
            :theme="item.theme || theme"
            :circle="item.circle || circle"
            :thumb="item.thumb || thumb"
            :size="item.size || size"
            :grow="item.splitGrow || splitGrow"
            :dropRight="item.dropRight || dropRight"
            :dropSize="item.dropSize || dropSize"
            :dropTheme="item.dropTheme || dropTheme"
            :parseMarkdown="item.parseMarkdown || parseMarkdown"
            :spaced="item.spaced"
            :key="item.id || i"
          />
          <JsPanelNavItem
            v-else-if="!item.header && !item.divider"
            :key="item.id || i"
            :item="item"
            :theme="item.theme || theme"
            :circle="item.circle || circle"
            :thumb="item.thumb || thumb"
            :size="item.size || size"
            :dropRight="item.dropRight || dropRight"
            :dropTabs="item.dropTabs || dropTabs"
            :dropTabSelected="item.dropTabSelected"
            :dropSize="item.dropSize || dropSize"
            :dropTheme="item.dropTheme || dropTheme"
            :parseMarkdown="item.parseMarkdown || parseMarkdown"
          />
        </template>
      </div>
    </div>
    <div
      :class="['empty', 'empty-' + emptySize]"
      v-else-if="search || (!search && total == 0)"
    >
      No {{ itemUnits }}
    </div>
    <div
      class="limited"
      v-if="!ignoreItemsLimit && itemsLimit && this.items.length > itemsLimit"
    >
      <JsPanelNavItem :item="{ label: 'Load All', onClick: removeItemsLimit }">
      </JsPanelNavItem>
    </div>
  </nav>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsBtnSplit from "./BtnSplit.vue";
import JsPanelNavItem from "./NavItem.vue/index.js";

export default {
  name: "JsPanelNav",
  components: {
    JsMarkdown,
    JsBtnSplit,
    JsPanelNavItem,
  },
  data() {
    return {
      q: "",
      searchOpen: false,
      ignoreItemsLimit: false,
    };
  },
  props: {
    menu: Boolean,
    menuConfig: {
      type: Array,
      default: () => [
        { button: { icon: "list-ul", tip: "List View" }, layout: "cols-1" },
        {
          button: { icon: "table-cells", tip: "Grid View" },
          layout: "cols-auto",
          size: "lg",
          style: "thumb",
        },
      ],
    },
    grouped: Boolean,
    search: Boolean,
    searchMinCount: {
      type: Number,
      default: 2,
    },
    searchableProperties: {
      type: Array,
      default: () => [
        "route",
        "link",
        "linkExt",
        "label",
        "subLabel",
        "tip",
        "tags",
        "icon",
        "notifyLabel",
        "notifyTip",
        "notifyIcon",
        "notifyUnits",
      ],
    },
    columns: {
      type: String,
      default: "all",
    },
    itemUnits: {
      type: String,
      default: "items",
    },
    items: Array,
    itemsLimit: {
      type: Number,
      default: null,
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    groupBy: {
      type: String,
      default: "group",
    },
    groupLabelsHidden: Boolean,
    groupLabelsLeft: Boolean,
    groupLabelShowCount: Boolean,
    groupLabelsLarge: Boolean,
    grid: { type: Boolean, default: true },
    spaced: Boolean,
    layout: {
      type: String,
      default: "cols-auto",
      validator(v) {
        return [
          "cols-auto",
          "cols-1",
          "cols-2",
          "cols-3",
          "cols-4",
          "cols-5",
          "row",
          "rows",
          "rows-right",
          "spaced",
          "centered",
          "space-first",
          "space-last",
        ].includes(v);
      },
    },
    layoutGap: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    emptySize: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    layoutRight: { type: Boolean, default: false },
    layoutCompact: { type: Boolean, default: false },
    size: String,
    theme: String,
    split: Boolean,
    circle: Boolean,
    thumb: Boolean,
    splitGrow: String,
    dropRight: Boolean,
    dropSplit: Boolean,
    dropTabs: Boolean,
    dropSize: String,
    dropTheme: String,
  },
  computed: {
    menuConfigButtons() {
      return this.menuConfig.map((mC) => ({
        ...mC.button,
        config: {
          layout: mC.layout || "cols-auto",
          size: mC.size || "md",
          style: mC.style || "",
        },
        onClick: this.changeConfig,
      }));
    },
    count() {
      let count = 0;
      if (Array.isArray(this.filteredItems)) {
        count = this.filteredItems.length;
      } else {
        for (const key in this.filteredItems) {
          count += this.filteredItems[key].length;
        }
      }
      return count;
    },
    total() {
      return this.items.length;
    },
    showSearch() {
      return (
        this.search &&
        (this.total >= this.searchMinCount || this.trimmedQuery.length)
      );
    },
    trimmedQuery() {
      return this.q.trim();
    },

    filteredItems() {
      let filteredItems = this.items;
      const q = this.trimmedQuery.toLowerCase();
      //filter by query
      if (q.length)
        filteredItems = this.items.filter((item) => this.findInObject(item, q));

      //enforce item limit
      if (!this.ignoreItemsLimit && this.itemsLimit)
        filteredItems = filteredItems.slice(0, this.itemsLimit);
      //because scrolling size changes when filtering
      if (this.$parent.setScrollHints) this.$parent.setScrollHints();
      return this.grouped
        ? this.groupByKey(filteredItems, this.groupBy)
        : filteredItems;
    },
    groupedItems(key) {
      return this.groupByKey(this.items, key);
    },
    compactLayout() {
      return this.size === "xs" || this.size === "sm";
    },
  },
  methods: {
    removeItemsLimit() {
      this.ignoreItemsLimit = true;
    },
    changeConfig(e, item) {
      item.active = true;
      this.layout = item.config.layout;
      // this.size = item.config.size;
      this.circle = item.config.style === "circle";
      this.thumb = item.config.style === "thumb";
    },
    groupByKey: function (xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    findInObject(o, q) {
      return Object.keys(o).some((a) => {
        if (
          Array.isArray(o[a]) ||
          (typeof o[a] === "object" && o[a] !== null)
        ) {
          return this.findInObject(o[a], q);
        }
        return typeof o[a] === "string"
          ? (this.searchableProperties.includes(a) || !isNaN(Number(a))) &&
              o[a].toLowerCase().includes(q)
          : false;
      });
    },
    getGroupLabel: function (groupName, groupItemsCount) {
      if (this.groupLabelShowCount && groupItemsCount > 1)
        groupName += ` (${groupItemsCount})`;
      return groupName;
    },
    activate: function () {
      this.searchOpen = true;
      this.$nextTick(() => {
        this.$refs.filterQ.focus();
      });
    },
    clear: function () {
      if (this.q.length) {
        this.q = "";
      } else {
        this.searchOpen = false;
      }
    },
    pluralize(count, noun, suffix = "s") {
      return `${count} ${noun}${count !== 1 ? suffix : ""}`;
    },
  },
};
</script>
<style lang="scss">
.panel-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  .search {
    display: inline-flex;
    margin-bottom: 1em;
    position: sticky;
    z-index: 1;
    margin-left: auto;
    background: #fff;
    padding: 0 0.25em;
    border-radius: 0.25em;
    top: 0;
    right: 0;
    button {
      padding: 0;
      background: none;
      border: none;
      font-family: inherit; /* 1 */
      font-size: 0.85em; /* 1 */
      font-weight: 600;
      line-height: 1.15; /* 1 */
      margin: 0; /* 2 */
      overflow: visible;
      text-transform: none;
      cursor: pointer;
      color: #333;
    }
    .activate {
      padding: 0.25em 0;
      margin-left: auto;
      .icn {
        font-size: 0.8em;
      }
    }
    .input {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.25em;
      padding: 0.25em 0.5em;
      gap: 0.25em;
      flex: 1;
      align-self: flex-end;
      &.active {
        align-self: stretch;
      }
      .icn {
        font-size: 0.8em;
        color: #666;
        padding: 0 0.5em;
      }
      input {
        width: 100%;
        flex: 1;
        border: none;
        outline: none;
        padding: 0.25em;
        font-size: 0.9em;
        border-radius: 0.5em;
        background: #fff;
        background: transparent;
      }
      label {
        font-size: 0.8em;
        background: #c9ffda;
        padding: 0 0.5em;
        border-radius: 5em;
        white-space: nowrap;
        color: #666;
        &.none {
          background: #ffd0c9;
        }
      }
    }
  }
  .empty,
  .empty-md {
    margin: 5em 0;
    background: #efefef;
    padding: 0.5em 1em;
    border-radius: 100px;
    align-self: center;
    font-size: 0.85em;
    &.empty-sm {
      margin: 0.5em 0;
    }
    &.empty-lg {
      margin: 10em 0;
    }
  }
  .limited {
    padding: 1em;
    align-self: center;
  }
  .grouped {
    .group {
      margin-bottom: 1em;
      align-items: flex-start;
      .groupLabel {
        font-size: 0.85em;
        /* border-bottom: 1px solid #fff; */
        color: #fff;
        font-weight: 700;
        margin-bottom: 0.75em;
        line-height: 1.1;
        white-space: nowrap;
        strong {
          display: block;
          font-size: 1.45em;
          white-space: nowrap;
        }
      }
      &:last-child {
        margin: 0;
      }
    }
    .group-labels-left {
      display: flex;
      gap: 1em;
      .groupLabel {
        min-width: 3em;
      }
    }
    .group-labels-hidden .groupLabel {
      display: none;
    }
  }
  .hdr {
    color: rgba(0, 0, 0, 0.8);
    font-size: 0.85em;
    font-weight: 700;
    display: flex;
    align-items: center;
    grid-column-start: 1;
    a {
      color: #a4d5ff;
      text-decoration: none;
    }
    .tag {
      color: #222;
      background: #fff;
    }
  }
  .hdr + .panel-nav-item {
    grid-column-start: 1;
  }
  .divider {
    height: 1px;
    margin: 0.35em 0;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.4);
    &.divider-v {
      height: unset;
      border-radius: 100px;
      width: 2px;
      margin: 0.5em 0.2em;
    }
  }
  .divider {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .layout,
  .layout-gap-md {
    gap: 0.75em;
    &.layout-gap-sm,
    &.layout-compact {
      gap: 0.5em;
    }
    &.layout-gap-lg {
      gap: 1.5em;
    }
    &.layout-cols-auto,
    &.layout-cols-1,
    &.layout-cols-2,
    &.layout-cols-3,
    &.layout-cols-4,
    &.layout-cols-5 {
      display: grid;
      /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-auto-columns: 1fr;
      align-items: start;
      > .panel-nav-item.panel-nav-item-thumb > .item .thumb {
        width: 100% !important;
      }
    }
    &.layout-cols-1 {
      grid-template-columns: 1fr;
    }
    &.layout-cols-2 {
      grid-template-columns: 1fr 1fr;
    }
    &.layout-cols-3 {
      grid-template-columns: 1fr 1fr 1fr;
    }
    &.layout-cols-4 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    &.layout-cols-5 {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    &.layout-row,
    &.layout-rows,
    &.layout-rows-right,
    &.layout-spaced,
    &.layout-centered,
    &.layout-space-first,
    &.layout-space-last {
      display: flex;
      flex-wrap: wrap;
      align-items: stretch;
      > .panel-nav-item-xs {
        max-width: 12em;
      }
      > .panel-nav-item-sm {
        max-width: 16em;
      }
      > .panel-nav-item-md {
        max-width: 20em;
      }
      > .panel-nav-item-lg {
        max-width: 28em;
      }
      > .panel-nav-item-xl {
        max-width: 34em;
      }
    }
    &.layout-row,
    &.layout-space-first,
    &.layout-space-last {
      flex-wrap: nowrap;
    }
    &.layout-spaced {
      justify-content: space-between;
    }
    &.layout-centered {
      justify-content: space-evenly;
    }
    &.layout-space-first > :first-child {
      margin-right: auto;
    }
    &.layout-space-last > :last-child {
      margin-left: auto;
    }
    &.layout-rows-right {
      justify-content: flex-end;
    }
    &.layout-row {
      display: inline-flex;
    }
  }
  &.panel-nav-notheme,
  &.panel-nav-light,
  &.panel-nav-dark,
  &.panel-nav-blue,
  &.panel-nav-darkblue,
  &.panel-nav-lightblue {
    .grouped .groupLabel {
      font-size: 0.85em;
      /* border-bottom: 1px solid #fff; */
      color: #222;
      font-weight: 600;
      margin-bottom: 0.75em;
    }
    .search {
      .input {
        background: #444;
        border: 1px solid #222;
        color: #fff;
        input {
          color: #fff;
          &::placeholder {
            color: #ccc;
            opacity: 1; /* Firefox */
          }
        }
        .icn {
          color: #fff;
        }
        label {
          background: #000;
          color: #fff;
        }
      }
      button {
        color: #000;
      }
    }
  }
}
.panel-nav + .panel-nav {
  margin-top: 1em;
}
</style>
