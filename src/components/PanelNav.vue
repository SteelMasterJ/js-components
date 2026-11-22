<template>
  <nav
    :class="[
      'js-panel-nav',
      'js-panel-nav--' + (theme || 'notheme'),
      size ? 'js-panel-nav--' + size : '',
    ]"
    :aria-label="ariaLabel"
  >
    <div v-if="menu || showSearch" class="js-panel-nav__toolbar">
      <JsBtnSplit
        v-if="menu"
        size="sm"
        aria-label="View layout options"
        :items="menuConfigButtons"
      />

      <div v-if="showSearch" class="js-panel-nav__search" role="search">
        <div v-if="searchOpen" class="js-panel-nav__search-box">
          <JsIcon name="search" class="js-panel-nav__search-icon" />
          <input
            :id="searchId"
            ref="filterRef"
            v-model="query"
            type="search"
            class="js-panel-nav__search-input"
            :placeholder="'Search ' + itemUnits"
            :aria-label="'Search ' + itemUnits"
            @input="$emit('search', query)"
          />
          <output
            v-if="trimmedQuery.length > 0"
            :for="searchId"
            aria-live="polite"
            :class="[
              'js-panel-nav__search-count',
              { 'js-panel-nav__search-count--empty': count === 0 },
            ]"
          >
            {{ count }}
          </output>
          <button
            type="button"
            class="js-panel-nav__search-clear"
            :aria-label="query.length ? 'Clear search query' : 'Close search'"
            @click="clearSearch"
          >
            <JsIcon name="close" />
          </button>
        </div>
        <button
          v-else
          type="button"
          class="js-panel-nav__search-trigger"
          @click="openSearch"
        >
          <JsIcon name="search" />
          <span>Search {{ itemUnits }}</span>
        </button>
      </div>
    </div>

    <div v-if="count > 0" class="js-panel-nav__items">
      <div v-if="grouped" class="js-panel-nav__grouped">
        <section
          v-for="(group, key) in filteredItems"
          :key="key"
          :class="[
            'js-panel-nav__group',
            { 'js-panel-nav__group--labels-left': groupLabelsLeft },
            { 'js-panel-nav__group--labels-hidden': groupLabelsHidden },
          ]"
        >
          <div v-if="String(key).length > 0" class="js-panel-nav__group-label">
            <JsMarkdown
              :parse="shouldParse('group')"
              :val="getGroupLabel(key, group.length)"
            />
          </div>

          <div :class="layoutClasses">
            <template v-for="(item, j) in group" :key="item.id != null ? item.id : j">
              <div v-if="item.header" class="js-panel-nav__hdr">
                <JsMarkdown :parse="shouldParse('header')" :val="item.label" />
              </div>

              <hr
                v-else-if="item.divider && supportsDivider"
                :class="[
                  'js-panel-nav__divider',
                  { 'js-panel-nav__divider--vertical': isVerticalDivider },
                ]"
              />

              <JsBtnSplit
                v-else-if="item.split && Array.isArray(item.items)"
                :items="item.items"
                :theme="item.theme || theme || 'light'"
                :circle="Boolean(item.circle || activeCircle)"
                :thumb="Boolean(item.thumb || activeThumb)"
                :size="item.size || size || 'md'"
                :grow="item.splitGrow || splitGrow || 'none'"
                :drop-right="item.dropRight !== undefined ? item.dropRight : dropRight"
                :drop-size="item.dropSize || dropSize || 'auto'"
                :drop-theme="item.dropTheme || dropTheme || 'dark'"
                :parse-markdown="item.parseMarkdown || parseMarkdown"
                :spaced="Boolean(item.spaced)"
                @click="onItemClick"
              />

              <JsNavItem
                v-else-if="!item.header && !item.divider"
                :item="item"
                :block="isGridLayout"
                :theme="item.theme || theme || 'light'"
                :circle="Boolean(item.circle || activeCircle)"
                :thumb="Boolean(item.thumb || activeThumb)"
                :size="item.size || size || 'md'"
                :drop-right="item.dropRight !== undefined ? item.dropRight : dropRight"
                :drop-tabs="Boolean(item.dropTabs || dropTabs)"
                :drop-tab-selected="item.dropTabSelected ?? 0"
                :drop-size="item.dropSize || dropSize || 'auto'"
                :drop-theme="item.dropTheme || dropTheme || 'dark'"
                :parse-markdown="item.parseMarkdown || parseMarkdown"
                @click="onItemClick"
              />
            </template>
          </div>
        </section>
      </div>

      <div v-else :class="layoutClasses">
        <template v-for="(item, i) in filteredItems" :key="item.id != null ? item.id : i">
          <div v-if="item.header" class="js-panel-nav__hdr">
            <JsMarkdown :parse="shouldParse('header')" :val="item.label" />
          </div>

          <hr
            v-else-if="item.divider && supportsDivider"
            :class="[
              'js-panel-nav__divider',
              { 'js-panel-nav__divider--vertical': isVerticalDivider },
            ]"
          />

          <JsBtnSplit
            v-else-if="item.split && Array.isArray(item.items)"
            :items="item.items"
            :theme="item.theme || theme || 'light'"
            :circle="Boolean(item.circle || activeCircle)"
            :thumb="Boolean(item.thumb || activeThumb)"
            :size="item.size || size || 'md'"
            :grow="item.splitGrow || splitGrow || 'none'"
            :drop-right="item.dropRight !== undefined ? item.dropRight : dropRight"
            :drop-size="item.dropSize || dropSize || 'auto'"
            :drop-theme="item.dropTheme || dropTheme || 'dark'"
            :parse-markdown="item.parseMarkdown || parseMarkdown"
            :spaced="Boolean(item.spaced)"
            @click="onItemClick"
          />

          <JsNavItem
            v-else-if="!item.header && !item.divider"
            :item="item"
            :block="isGridLayout"
            :theme="item.theme || theme || 'light'"
            :circle="Boolean(item.circle || activeCircle)"
            :thumb="Boolean(item.thumb || activeThumb)"
            :size="item.size || size || 'md'"
            :drop-right="item.dropRight !== undefined ? item.dropRight : dropRight"
            :drop-tabs="Boolean(item.dropTabs || dropTabs)"
            :drop-tab-selected="item.dropTabSelected ?? 0"
            :drop-size="item.dropSize || dropSize || 'auto'"
            :drop-theme="item.dropTheme || dropTheme || 'dark'"
            :parse-markdown="item.parseMarkdown || parseMarkdown"
            @click="onItemClick"
          />
        </template>
      </div>
    </div>

    <p
      v-else-if="search || total === 0"
      :class="['js-panel-nav__empty', 'js-panel-nav__empty--' + emptySize]"
      role="status"
    >
      <slot name="empty">No {{ itemUnits }}</slot>
    </p>

    <div
      v-if="!ignoreItemsLimit && itemsLimit && total > itemsLimit"
      class="js-panel-nav__limited"
    >
      <JsNavItem
        :item="{ label: loadAllLabel, button: 'button', onClick: removeItemsLimit }"
        theme="lightblue"
        size="sm"
      />
    </div>
  </nav>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsBtnSplit from "./BtnSplit.vue";
import JsNavItem from "./NavItem.vue";
import { createUid } from "../utils/uid.js";
import { findInObject } from "../utils/search.js";

const VALID_LAYOUTS = [
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
];

export default {
  name: "JsPanelNav",
  components: {
    JsIcon,
    JsMarkdown,
    JsBtnSplit,
    JsNavItem,
  },
  inject: {
    jsPanelRefreshScroll: {
      default: null,
    },
  },
  props: {
    ariaLabel: {
      type: String,
      default: "Navigation",
    },
    menu: {
      type: Boolean,
      default: false,
    },
    menuConfig: {
      type: Array,
      default: () => [
        { button: { icon: "list-ul", tip: "List View" }, layout: "cols-1" },
        {
          button: { icon: "table-cells", tip: "Grid View" },
          layout: "cols-auto",
          style: "thumb",
        },
      ],
    },
    grouped: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
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
    items: {
      type: Array,
      default: () => [],
    },
    itemsLimit: {
      type: Number,
      default: null,
    },
    loadAllLabel: {
      type: String,
      default: "Load All",
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    groupBy: {
      type: String,
      default: "group",
    },
    groupLabelsHidden: {
      type: Boolean,
      default: false,
    },
    groupLabelsLeft: {
      type: Boolean,
      default: false,
    },
    groupLabelShowCount: {
      type: Boolean,
      default: false,
    },
    grid: {
      type: Boolean,
      default: true,
    },
    layout: {
      type: String,
      default: "cols-auto",
      validator(v) {
        return VALID_LAYOUTS.includes(v);
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
    layoutRight: {
      type: Boolean,
      default: false,
    },
    layoutCompact: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
    },
    theme: {
      type: String,
      default: "",
    },
    circle: {
      type: Boolean,
      default: false,
    },
    thumb: {
      type: Boolean,
      default: false,
    },
    splitGrow: {
      type: String,
      default: "none",
    },
    dropRight: {
      type: Boolean,
      default: false,
    },
    dropTabs: {
      type: Boolean,
      default: false,
    },
    dropSize: {
      type: String,
      default: "auto",
    },
    dropTheme: {
      type: String,
      default: "dark",
    },
  },
  emits: ["click", "select", "search", "config-change"],
  data() {
    return {
      searchId: createUid("js-nav-q"),
      query: "",
      searchOpen: false,
      ignoreItemsLimit: false,
      activeLayout: this.layout,
      activeCircle: this.circle,
      activeThumb: this.thumb,
      activeConfigIndex: -1,
    };
  },
  watch: {
    layout(val) {
      this.activeLayout = val;
    },
    circle(val) {
      this.activeCircle = val;
    },
    thumb(val) {
      this.activeThumb = val;
    },
    count() {
      if (typeof this.jsPanelRefreshScroll === "function") {
        this.jsPanelRefreshScroll();
      }
    },
  },
  computed: {
    menuConfigButtons() {
      return this.menuConfig.map((mC, idx) => ({
        ...mC.button,
        button: "button",
        active: this.activeConfigIndex === idx,
        config: {
          index: idx,
          layout: mC.layout || "cols-auto",
          style: mC.style || "",
        },
        onClick: this.changeConfig,
      }));
    },
    total() {
      return this.items.length;
    },
    trimmedQuery() {
      return this.query.trim();
    },
    showSearch() {
      return (
        this.search &&
        (this.total >= this.searchMinCount || this.trimmedQuery.length > 0)
      );
    },
    filteredItems() {
      let list = this.items;
      const q = this.trimmedQuery.toLowerCase();
      if (q.length) {
        list = list.filter((item) =>
          findInObject(item, q, this.searchableProperties)
        );
      }
      if (!this.ignoreItemsLimit && this.itemsLimit) {
        list = list.slice(0, this.itemsLimit);
      }
      return this.grouped ? this.groupByKey(list, this.groupBy) : list;
    },
    count() {
      if (Array.isArray(this.filteredItems)) {
        return this.filteredItems.length;
      }
      return Object.values(this.filteredItems).reduce(
        (sum, group) => sum + group.length,
        0
      );
    },
    supportsDivider() {
      return ["cols-1", "row", "rows", "space-first", "space-last"].includes(
        this.activeLayout
      );
    },
    isVerticalDivider() {
      return ["row", "rows", "space-first", "space-last"].includes(
        this.activeLayout
      );
    },
    isGridLayout() {
      return (
        this.grid &&
        [
          "cols-auto",
          "cols-1",
          "cols-2",
          "cols-3",
          "cols-4",
          "cols-5",
        ].includes(this.activeLayout)
      );
    },
    layoutClasses() {
      return [
        "js-panel-nav__layout",
        "js-panel-nav__layout--" + this.activeLayout,
        "js-panel-nav__gap--" + this.layoutGap,
        { "js-panel-nav__layout--compact": this.layoutCompact },
        this.columns !== "all" ? "js-panel-nav__layout--cols-" + this.columns : "",
        { "js-panel-nav__layout--rows": !this.grid },
        { "js-panel-nav__layout--rows-right": this.layoutRight },
      ];
    },
  },
  methods: {
    shouldParse(section) {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes(section);
    },
    removeItemsLimit() {
      this.ignoreItemsLimit = true;
    },
    changeConfig(_event, item) {
      const cfg = item.config;
      if (!cfg) return;
      this.activeConfigIndex = cfg.index;
      this.activeLayout = cfg.layout;
      this.activeCircle = cfg.style === "circle";
      this.activeThumb = cfg.style === "thumb";
      this.$emit("config-change", cfg);
    },
    groupByKey(list, key) {
      return list.reduce((acc, item) => {
        const groupKey = item[key] != null ? String(item[key]) : "";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    },
    getGroupLabel(groupName, groupItemsCount) {
      if (this.groupLabelShowCount && groupItemsCount > 1) {
        return `${groupName} (${groupItemsCount})`;
      }
      return groupName;
    },
    openSearch() {
      this.searchOpen = true;
      this.$nextTick(() => {
        if (this.$refs.filterRef) {
          this.$refs.filterRef.focus();
        }
      });
    },
    clearSearch() {
      if (this.query.length) {
        this.query = "";
        this.$emit("search", "");
        this.$nextTick(() => {
          if (this.$refs.filterRef) this.$refs.filterRef.focus();
        });
      } else {
        this.searchOpen = false;
      }
    },
    onItemClick(event, item) {
      this.$emit("click", event, item);
      this.$emit("select", item, event);
    },
  },
};
</script>

<style scoped>
.js-panel-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--js-space-3);
  font-family: var(--js-font-family);
  min-width: 0;
}

.js-panel-nav__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-2);
}

.js-panel-nav__search {
  display: inline-flex;
  align-items: center;
  margin-inline-start: auto;
  max-width: 100%;
}

.js-panel-nav__search-trigger {
  display: inline-flex;
  align-items: center;
  gap: var(--js-space-2);
  min-height: var(--js-touch-min);
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  font: inherit;
  font-size: var(--js-font-size-sm);
  font-weight: 600;
  cursor: pointer;
}

.js-panel-nav__search-trigger:hover {
  background-color: var(--js-color-surface-hover);
}

.js-panel-nav__search-trigger:focus-visible,
.js-panel-nav__search-clear:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-panel-nav__search-box {
  display: inline-flex;
  align-items: center;
  gap: var(--js-space-1);
  padding: 0.2rem 0.45rem;
  border: 1px solid var(--js-color-border-strong);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  max-width: 100%;
}

.js-panel-nav__search-box:focus-within {
  outline: var(--js-focus-ring);
  outline-offset: 1px;
}

.js-panel-nav__search-icon {
  color: var(--js-color-text-muted);
}

.js-panel-nav__search-input {
  width: min(14rem, 55vw);
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: var(--js-font-size-sm);
  padding: 0.25rem;
}

.js-panel-nav__search-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  padding: 0.1rem 0.4rem;
  border-radius: var(--js-radius-pill);
  font-size: var(--js-font-size-xs);
  font-weight: 700;
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-panel-nav__search-count--empty {
  background-color: #fde8e8;
  color: var(--js-color-danger);
}

.js-panel-nav__search-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border: 0;
  border-radius: var(--js-radius-sm);
  background: transparent;
  color: var(--js-color-text-muted);
  cursor: pointer;
}

.js-panel-nav__search-clear:hover {
  background-color: var(--js-color-surface-hover);
  color: var(--js-color-text);
}

/* Groups */
.js-panel-nav__grouped {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-4);
}

.js-panel-nav__group {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-2);
}

.js-panel-nav__group--labels-left {
  flex-direction: row;
  align-items: flex-start;
  gap: var(--js-space-4);
}

.js-panel-nav__group--labels-left .js-panel-nav__layout {
  flex: 1 1 auto;
}

.js-panel-nav__group--labels-hidden .js-panel-nav__group-label {
  display: none;
}

.js-panel-nav__group-label {
  font-size: var(--js-font-size-sm);
  font-weight: 700;
  color: var(--js-color-text-muted);
  min-width: 4.5rem;
}

.js-panel-nav__hdr {
  grid-column: 1 / -1;
  font-size: var(--js-font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--js-color-text-muted);
  padding-top: var(--js-space-2);
}

.js-panel-nav__divider {
  grid-column: 1 / -1;
  border: 0;
  height: 1px;
  width: 100%;
  margin: var(--js-space-1) 0;
  background-color: var(--js-color-divider);
}

.js-panel-nav__divider--vertical {
  width: 1px;
  height: auto;
  align-self: stretch;
  margin: 0.25rem var(--js-space-1);
}

/* Layouts */
.js-panel-nav__layout {
  display: grid;
  gap: var(--js-space-3);
  min-width: 0;
}

.js-panel-nav__gap--sm,
.js-panel-nav__layout--compact {
  gap: var(--js-space-2);
}

.js-panel-nav__gap--lg {
  gap: var(--js-space-5);
}

.js-panel-nav__layout--cols-auto {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  align-items: start;
}

.js-panel-nav__layout--cols-1 {
  grid-template-columns: 1fr;
}

.js-panel-nav__layout--cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.js-panel-nav__layout--cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.js-panel-nav__layout--cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.js-panel-nav__layout--cols-5 {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.js-panel-nav__layout--row,
.js-panel-nav__layout--rows,
.js-panel-nav__layout--rows-right,
.js-panel-nav__layout--spaced,
.js-panel-nav__layout--centered,
.js-panel-nav__layout--space-first,
.js-panel-nav__layout--space-last {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.js-panel-nav__layout--rows-right {
  justify-content: flex-end;
}

.js-panel-nav__layout--spaced {
  justify-content: space-between;
}

.js-panel-nav__layout--centered {
  justify-content: center;
}

.js-panel-nav__layout--space-first > :first-child {
  margin-inline-end: auto;
}

.js-panel-nav__layout--space-last > :last-child {
  margin-inline-start: auto;
}

/* Empty & limit */
.js-panel-nav__empty {
  margin: var(--js-space-5) auto;
  padding: 0.45rem 1rem;
  border-radius: var(--js-radius-pill);
  background-color: var(--js-color-surface-alt);
  color: var(--js-color-text-muted);
  font-size: var(--js-font-size-sm);
  text-align: center;
}

.js-panel-nav__empty--sm {
  margin: var(--js-space-2) auto;
}

.js-panel-nav__empty--lg {
  margin: var(--js-space-6) auto;
}

.js-panel-nav__limited {
  display: flex;
  justify-content: center;
  padding-top: var(--js-space-2);
}

@media (max-width: 768px) {
  .js-panel-nav__layout--cols-4,
  .js-panel-nav__layout--cols-5 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .js-panel-nav__layout--cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .js-panel-nav__layout--cols-2,
  .js-panel-nav__layout--cols-3,
  .js-panel-nav__layout--cols-4,
  .js-panel-nav__layout--cols-5 {
    grid-template-columns: 1fr;
  }

  .js-panel-nav__group--labels-left {
    flex-direction: column;
    gap: var(--js-space-2);
  }
}
</style>
