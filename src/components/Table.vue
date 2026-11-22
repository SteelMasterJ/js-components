<template>
  <div
    :class="[
      'js-table',
      'js-table--padding-' + padding,
      { 'js-table--striped': striped },
      { 'js-table--hover': hover },
      { 'js-table--scroll': scroll },
      { 'js-table--h-lines': hLines },
      { 'js-table--v-lines': vLines },
      { 'js-table--dark': dark },
      { 'js-table--wrap-headers': wrapHeaders },
    ]"
    :role="scroll ? 'region' : undefined"
    :aria-label="scroll ? caption || ariaLabel : undefined"
    :tabindex="scroll ? 0 : undefined"
  >
    <table class="js-table__el">
      <caption v-if="caption" class="js-table__caption">
        {{ caption }}
      </caption>

      <thead v-if="headerRows.length">
        <tr v-for="(row, i) in headerRows" :key="i">
          <th
            v-for="(cell, j) in row"
            :key="j"
            scope="col"
            :style="colWidths[j] ? { width: colWidths[j] } : undefined"
            :class="[
              { 'js-table__sticky-left': leftColSticky && j === 0 },
              {
                'js-table__sticky-right':
                  rightColSticky && j === row.length - 1,
              },
            ]"
            :colspan="norm(cell).span || undefined"
            :rowspan="norm(cell).rowspan || undefined"
          >
            <div v-if="norm(cell).component" :class="cellClasses(norm(cell))">
              <component
                :is="norm(cell).component"
                v-bind="norm(cell).props || {}"
              />
            </div>

            <slot
              v-else
              name="header-cell"
              :cell="norm(cell)"
              :row-index="i"
              :col-index="j"
            >
              <component
                :is="cellTag(norm(cell))"
                :class="cellClasses(norm(cell))"
                :title="norm(cell).tip || undefined"
                :to="
                  cellTag(norm(cell)) === 'router-link'
                    ? norm(cell).route
                    : undefined
                "
                :href="cellHref(norm(cell))"
                :target="norm(cell).linkExt ? '_blank' : undefined"
                :rel="norm(cell).linkExt ? 'noopener noreferrer' : undefined"
                :type="cellTag(norm(cell)) === 'button' ? 'button' : undefined"
                @click="onCellClick($event, norm(cell), i, j)"
              >
                <JsMarkdown
                  v-if="norm(cell).label != null && norm(cell).label !== ''"
                  :parse="shouldParseLabel"
                  :val="String(norm(cell).label)"
                />
                <JsIcon
                  v-if="norm(cell).icon"
                  :name="norm(cell).icon"
                  :color="norm(cell).iconColor || ''"
                />
                <span v-if="norm(cell).auxText" class="js-table__aux">
                  {{ norm(cell).auxText }}
                </span>
              </component>
            </slot>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(row, i) in bodyRows"
          :key="i"
          :class="{ 'js-table__row--active': rowActive(row) }"
        >
          <component
            :is="j < headerColCount ? 'th' : 'td'"
            v-for="(cell, j) in row"
            :key="j"
            :scope="j < headerColCount ? 'row' : undefined"
            :class="[
              { 'js-table__sticky-left': leftColSticky && j === 0 },
              {
                'js-table__sticky-right':
                  rightColSticky && j === row.length - 1,
              },
            ]"
            :colspan="norm(cell).span || undefined"
            :rowspan="norm(cell).rowspan || undefined"
          >
            <div v-if="norm(cell).component" :class="cellClasses(norm(cell))">
              <component
                :is="norm(cell).component"
                v-bind="norm(cell).props || {}"
              />
            </div>

            <slot
              v-else
              name="cell"
              :cell="norm(cell)"
              :row-index="i"
              :col-index="j"
            >
              <component
                :is="cellTag(norm(cell))"
                :class="cellClasses(norm(cell))"
                :title="norm(cell).tip || undefined"
                :to="
                  cellTag(norm(cell)) === 'router-link'
                    ? norm(cell).route
                    : undefined
                "
                :href="cellHref(norm(cell))"
                :target="norm(cell).linkExt ? '_blank' : undefined"
                :rel="norm(cell).linkExt ? 'noopener noreferrer' : undefined"
                :type="cellTag(norm(cell)) === 'button' ? 'button' : undefined"
                @click="onCellClick($event, norm(cell), i, j)"
              >
                <span
                  v-if="norm(cell).icon"
                  :class="[
                    'js-table__icon',
                    { 'js-table__icon--bg': Boolean(norm(cell).iconBG) },
                  ]"
                >
                  <JsIcon
                    :name="norm(cell).icon"
                    :color="norm(cell).iconColor || ''"
                  />
                </span>
                <JsMarkdown
                  v-if="norm(cell).label != null && norm(cell).label !== ''"
                  :parse="shouldParseLabel"
                  :val="String(norm(cell).label)"
                />
                <span v-if="norm(cell).auxText" class="js-table__aux">
                  {{ norm(cell).auxText }}
                </span>
              </component>
            </slot>
          </component>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import { resolveLinkTag } from "../utils/router.js";

export default {
  name: "JsTable",
  components: {
    JsIcon,
    JsMarkdown,
  },
  props: {
    caption: {
      type: String,
      default: "",
    },
    ariaLabel: {
      type: String,
      default: "Data table",
    },
    rows: {
      type: Array,
      default: () => [],
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
    padding: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    headerRowCount: {
      type: Number,
      default: 1,
    },
    headerColCount: {
      type: Number,
      default: 0,
    },
    colWidths: {
      type: Array,
      default: () => [],
    },
    leftColSticky: {
      type: Boolean,
      default: false,
    },
    rightColSticky: {
      type: Boolean,
      default: false,
    },
    scroll: {
      type: Boolean,
      default: true,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: false,
    },
    hLines: {
      type: Boolean,
      default: true,
    },
    vLines: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    wrapHeaders: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cell-click"],
  computed: {
    headerRows() {
      return this.rows.slice(0, this.headerRowCount);
    },
    bodyRows() {
      return this.rows.slice(this.headerRowCount);
    },
    shouldParseLabel() {
      if (typeof this.parseMarkdown === "boolean") return this.parseMarkdown;
      const pm = String(this.parseMarkdown || "");
      return pm === "*" || pm.includes("label");
    },
  },
  methods: {
    norm(cell) {
      if (cell !== null && typeof cell === "object") {
        return cell;
      }
      return { label: cell };
    },
    rowActive(row) {
      return Boolean(
        Array.isArray(row) && row.some((c) => c && typeof c === "object" && c.rowActive)
      );
    },
    cellTag(cell) {
      if (cell.button || cell.onClick) return "button";
      if (cell.linkExt || cell.link) return "a";
      if (cell.route) {
        return resolveLinkTag(this, { to: cell.route });
      }
      return "span";
    },
    cellHref(cell) {
      const tag = this.cellTag(cell);
      if (tag !== "a") return undefined;
      return cell.linkExt || cell.link || cell.route || undefined;
    },
    cellClasses(cell) {
      return [
        "js-table__cell",
        "js-table__cell--size-" + (cell.size || "md"),
        "js-table__cell--align-" + (cell.align || "l"),
        cell.theme ? "js-table__cell--theme-" + cell.theme : "",
        { "js-table__cell--wrap": Boolean(cell.wrap) },
        {
          "js-table__cell--interactive": Boolean(
            cell.button || cell.onClick || cell.route || cell.link || cell.linkExt
          ),
        },
      ];
    },
    onCellClick(event, cell, rowIndex, colIndex) {
      if (typeof cell.onClick === "function") {
        cell.onClick(event, cell, rowIndex, colIndex);
      }
      if (cell.button || cell.onClick) {
        this.$emit("cell-click", { event, cell, rowIndex, colIndex });
      }
    },
  },
};
</script>

<style scoped>
.js-table {
  width: 100%;
  max-width: 100%;
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-surface);
  color: var(--js-color-text);
  font-family: var(--js-font-family);
}

.js-table:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-table--scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.js-table__el {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  text-align: left;
}

.js-table__caption {
  padding: var(--js-space-3) var(--js-space-4);
  font-size: var(--js-font-size-sm);
  font-weight: 700;
  text-align: left;
  color: var(--js-color-text-muted);
  border-bottom: 1px solid var(--js-color-divider);
}

.js-table__el th,
.js-table__el td {
  position: relative;
  padding: 0;
  vertical-align: top;
}

.js-table__el thead th {
  font-size: var(--js-font-size-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--js-color-text-muted);
  background-color: var(--js-color-surface-alt);
  border-bottom: 2px solid var(--js-color-border);
  white-space: nowrap;
}

.js-table--wrap-headers .js-table__el thead th {
  white-space: normal;
}

.js-table__el tbody th {
  font-weight: 600;
}

.js-table--h-lines .js-table__el tbody th,
.js-table--h-lines .js-table__el tbody td {
  border-bottom: 1px solid var(--js-color-divider);
}

.js-table--h-lines .js-table__el tbody tr:last-child th,
.js-table--h-lines .js-table__el tbody tr:last-child td {
  border-bottom: 0;
}

.js-table--v-lines .js-table__el th,
.js-table--v-lines .js-table__el td {
  border-right: 1px solid var(--js-color-divider);
}

.js-table--v-lines .js-table__el th:last-child,
.js-table--v-lines .js-table__el td:last-child {
  border-right: 0;
}

.js-table--striped .js-table__el tbody tr:nth-of-type(odd) {
  background-color: var(--js-color-surface-alt);
}

.js-table--hover .js-table__el tbody tr:hover,
.js-table__row--active {
  background-color: var(--js-color-surface-hover);
}

/* Sticky columns */
.js-table__sticky-left,
.js-table__sticky-right {
  position: sticky;
  z-index: 1;
  background-color: var(--js-color-surface);
}

.js-table__sticky-left {
  left: 0;
  box-shadow: 2px 0 4px -2px rgba(0, 0, 0, 0.12);
}

.js-table__sticky-right {
  right: 0;
  box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.12);
}

/* Cells */
.js-table__cell {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  font-size: var(--js-font-size-sm);
  line-height: 1.4;
}

.js-table--padding-sm .js-table__cell {
  padding: 0.35rem 0.55rem;
}

.js-table--padding-lg .js-table__cell {
  padding: 0.9rem 1.15rem;
}

.js-table__cell--wrap {
  white-space: normal;
}

.js-table__cell--size-sm {
  font-size: var(--js-font-size-xs);
}

.js-table__cell--size-lg {
  font-size: var(--js-font-size-md);
}

.js-table__cell--align-c,
.js-table__cell--align-cc {
  justify-content: center;
  text-align: center;
}

.js-table__cell--align-r,
.js-table__cell--align-rc,
.js-table__cell--align-rb {
  justify-content: flex-end;
  text-align: right;
}

.js-table__cell--interactive {
  border: 0;
  background: transparent;
  font-family: inherit;
  color: var(--js-color-primary);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--js-transition-fast),
    color var(--js-transition-fast);
}

.js-table__cell--interactive:hover {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-table__cell--interactive:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: -2px;
}

.js-table__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.js-table__icon--bg {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--js-radius-pill);
  background-color: var(--js-color-surface-dark);
  color: var(--js-color-text-inverse);
  font-size: 0.75rem;
}

.js-table__aux {
  margin-inline-start: auto;
  font-size: var(--js-font-size-xs);
  color: var(--js-color-text-muted);
}

/* Cell themes (WCAG AA contrast) */
.js-table__cell--theme-muted {
  color: var(--js-color-text-muted);
}

.js-table__cell--theme-grey,
.js-table__cell--theme-gray {
  background-color: var(--js-color-disabled-bg);
  color: var(--js-color-text);
}

.js-table__cell--theme-blue {
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-table__cell--theme-green {
  background-color: var(--js-color-success);
  color: var(--js-color-text-inverse);
}

.js-table__cell--theme-yellow {
  background-color: var(--js-color-warning);
  color: var(--js-color-warning-text);
}

.js-table__cell--theme-red {
  background-color: var(--js-color-danger);
  color: var(--js-color-text-inverse);
}

/* Dark theme */
.js-table--dark {
  background-color: var(--js-color-surface-dark);
  border-color: var(--js-color-divider-dark);
  color: var(--js-color-text-inverse);
}

.js-table--dark .js-table__caption {
  color: var(--js-color-text-inverse-muted);
  border-bottom-color: var(--js-color-divider-dark);
}

.js-table--dark .js-table__el thead th {
  background-color: #1c1f23;
  color: var(--js-color-text-inverse-muted);
  border-bottom-color: var(--js-color-divider-dark);
}

.js-table--dark .js-table__sticky-left,
.js-table--dark .js-table__sticky-right {
  background-color: var(--js-color-surface-dark);
}

.js-table--dark.js-table--striped .js-table__el tbody tr:nth-of-type(odd) {
  background-color: rgba(255, 255, 255, 0.04);
}

.js-table--dark.js-table--hover .js-table__el tbody tr:hover {
  background-color: var(--js-color-surface-dark-hover);
}

.js-table--dark.js-table--h-lines .js-table__el tbody th,
.js-table--dark.js-table--h-lines .js-table__el tbody td,
.js-table--dark.js-table--v-lines .js-table__el th,
.js-table--dark.js-table--v-lines .js-table__el td {
  border-color: var(--js-color-divider-dark);
}

.js-table--dark .js-table__cell--interactive {
  color: var(--js-color-primary-soft);
}

.js-table--dark .js-table__cell--interactive:hover {
  background-color: var(--js-color-surface-dark-hover);
  color: var(--js-color-text-inverse);
}
</style>
