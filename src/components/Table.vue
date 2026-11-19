<template>
  <div
    :class="[
      'table',
      'table-padding-' + padding,
      { 'table-striped': striped },
      { 'table-hover': hover },
      { 'table-scroll': scroll },
      { 'table-h-lines': hLines },
      { 'table-v-lines': vLines },
      { 'table-dark': dark },
      { 'table-wrap-headers': wrapHeaders },
    ]"
  >
    <table>
      <caption v-if="caption">
        {{
          caption
        }}
      </caption>
      <thead v-if="headerRows">
        <tr v-for="(row, i) in headerRows" :key="i">
          <th
            v-for="(cell, j) in row"
            :key="j"
            :style="{ width: colWidths[j] }"
            :class="[
              {
                stickyLeft: leftColSticky && j === 0,
              },
              { stickyRight: rightColSticky && j === row.length - 1 },
            ]"
            :colspan="v(cell).span"
          >
            <div
              v-if="v(cell).component"
              :data-tip="v(cell).tip"
              :class="[
                'cell',
                'cell-align-' + (v(cell).align || 'l'),
                'cell-theme-' + (v(cell).theme || 't'),
                { tip: v(cell).tip },
                'tip-' + (v(cell).tipPos || 'tr'),
              ]"
            >
              <component
                :is="v(cell).component"
                v-bind="v(cell).props"
              ></component>
            </div>
            <component
              v-else
              :data-tip="v(cell).tip"
              :is="v(cell).route ? 'router-link' : 'span'"
              :to="v(cell).route ? v(cell).route : ''"
              :class="[
                'cell',
                'cell-size-' + (v(cell).size || 'md'),
                'cell-align-' + (v(cell).align || 'l'),
                'cell-theme-' + (v(cell).theme || 't'),
                { tip: v(cell).tip },
                'tip-' + (v(cell).tipPos || 'tr'),

                { 'cell-wrap': v(cell).wrap },
              ]"
            >
              <JsMarkdown
                v-if="v(cell).label"
                :parse="parseMarkdown.match(/label|\*/)"
                :val="v(cell).label"
              />
              <i
                v-if="v(cell).icon"
                :style="{ color: v(cell).iconColor }"
                :class="'icon fa-solid fa-' + v(cell).icon"
              ></i>
              <span class="aux-text" v-if="v(cell).auxText">{{
                v(cell).auxText
              }}</span>
            </component>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in bodyRows" :key="i">
          <component
            :is="j < headerColCount ? 'th' : 'td'"
            v-for="(cell, j) in row"
            :class="[
              {
                stickyLeft: leftColSticky && j === 0,
              },
              { stickyRight: rightColSticky && j === row.length - 1 },
            ]"
            :key="j"
            :colspan="v(cell).span"
            :rowspan="v(cell).rowspan"
          >
            <div
              v-if="v(cell).component"
              :data-tip="v(cell).tip"
              :class="[
                'cell',
                'cell-align-' + (v(cell).align || 'l'),
                'cell-theme-' + (v(cell).theme || 't'),
                { tip: v(cell).tip },
                'tip-' + (v(cell).tipPos || 'tr'),
              ]"
            >
              <component
                :is="v(cell).component"
                v-bind="v(cell).props || {}"
              ></component>
            </div>
            <component
              v-else
              :data-tip="v(cell).tip"
              :is="
                v(cell).route
                  ? 'router-link'
                  : v(cell).button
                  ? 'button'
                  : 'span'
              "
              :to="v(cell).route ? v(cell).route : ''"
              :class="[
                'cell',
                'cell-size-' + (v(cell).size || 'md'),
                'cell-align-' + (v(cell).align || 'l'),
                'cell-theme-' + (v(cell).theme || ''),
                { tip: v(cell).tip },
                'tip-' + (v(cell).tipPos || 'tr'),
                { 'cell-wrap': v(cell).wrap },
              ]"
            >
              <span class="icon-wrap" v-if="v(cell).icon"
                >&#x200b;
                <i
                  :class="[
                    'icon',
                    { 'icon-bg': v(cell).iconBG },
                    'fa-' + v(cell).icon,
                    'fa-' + (v(cell).iconVariant || 'solid'),
                  ]"
                ></i>
              </span>
              <JsMarkdown
                v-if="v(cell).label"
                :parse="parseMarkdown.match(/label|\*/)"
                :val="v(cell).label"
              />
              <span class="aux-text" v-if="v(cell).auxText">{{
                v(cell).auxText
              }}</span>
            </component>
          </component>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";

export default {
  name: "JsTable",
  components: {
    JsMarkdown,
  },
  props: {
    caption: String,
    rows: {
      type: Array,
      default: [
        ["Column A", "Column B", "Column C", { align: "r" }],
        ["Cell A", "Cell B", "Cell C", { align: "r" }],
      ],
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    padding: {
      type: String,
      default: "md",
      validator(v) {
        return ["sm", "md", "lg"].includes(v);
      },
    },
    headerRowCount: { type: Number, default: 1 },
    headerColCount: { type: Number, default: 0 },
    colWidths: {
      type: Array,
      default: () => [],
    },
    leftColSticky: Boolean,
    rightColSticky: Boolean,
    scroll: Boolean,
    striped: Boolean,
    hover: Boolean,
    hLines: Boolean,
    vLines: Boolean,
    dark: Boolean,
    wrapHeaders: Boolean,
  },
  computed: {
    headerRows() {
      return this.rows.slice(0, this.headerRowCount);
    },
    bodyRows() {
      return this.rows.slice(this.headerRowCount);
    },
  },
  methods: {
    v(v) {
      return typeof v === "object" ? v : { label: v };
    },
  },
};
</script>
<style lang="scss">
.table {
  border: 1px solid #dadee4;
  border-radius: 0.5em;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    text-align: left;
    width: 100%;
    position: relative;
    td,
    th {
      border-bottom: 0.05rem solid #dadee4;
      position: relative;
      padding: 0;
      vertical-align: top;
      &.stickyLeft,
      &.stickyRight {
        position: sticky;
        // z-index: 2;
        backdrop-filter: blur(1px);
        background-color: rgba(255, 255, 255, 0.9);
      }
      &.stickyLeft {
        left: 0;
        z-index: 1;
      }
      &.stickyRight {
        right: 0;
      }
      &[rowspan] {
        .cell {
          position: sticky;
          top: 0;
          left: 0;
          z-index: 999;
        }
      }
    }
    th {
      font-weight: 500;
    }
    td:has(.cell-align-cc) {
      vertical-align: middle;
    }
    thead th {
      text-transform: uppercase;
      font-size: 0.85em;
      border-bottom-width: 0.1rem;
      min-width: 2.3em;
      white-space: nowrap;
      // position: sticky;
      // top: 0;
      // z-index: 1;
      // background: white;
    }
  }
  &.table-striped tbody tr:nth-of-type(odd) {
    background: #f4f4f4;
  }

  tbody tr.active,
  &.table-striped tbody tr.active {
    background: #eef0f3;
  }

  &.table-hover tbody tr:hover {
    background: #eef0f3;
  }

  &.table-scroll {
    display: block;
    overflow-x: auto;
    position: relative;
    padding-bottom: 0.75rem;
    white-space: nowrap;
  }
  &.table-wrap-headers thead th .cell {
    white-space: normal;
  }
  &.table-v-lines {
    th,
    td {
      border-left: 0.05rem solid #dadee4;
      border-right: 0.05rem solid #dadee4;
    }
    th:first-child,
    td:first-child {
      border-left-width: 0;
    }
    th:last-child,
    td:last-child {
      border-right-width: 0;
    }
  }
  &.table-h-lines {
    th,
    td {
      border-top: 0.05rem solid #dadee4;
      border-bottom: 0.05rem solid #dadee4;
    }
    tr:first-child th {
      border-top-width: 0;
    }
    tr:last-child td {
      border-bottom-width: 0;
    }
  }
  .cell,
  .cell-align-l,
  .cell-align-t,
  .cell-align-lt {
    padding: 0.6rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    position: relative;
    align-items: flex-start;
    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        font-size: 0.85em;
        flex: 0;
        &.icon-bg {
          font-size: 0.55em;
          background: #333;
          color: #fff;
          width: 1.35em;
          min-width: 1.35em;
          height: 1.35em;
          line-height: 1.35em;
          text-align: center;
          border-radius: 100px;
        }
      }
    }
    .aux-text {
      position: absolute;
      font-size: 0.8em;
      top: 0.6em;
      right: 0.6em;
      background: rgba(255, 255, 255, 0.8);
    }
    .tag {
      background: #444;
      color: #fff;
    }
    &.cell-wrap {
      white-space: normal;
    }
    &.cell-size-sm {
      font-size: 0.8em;
    }
    &.cell-size-lg {
      font-size: 1.2em;
    }
    &.cell-align-cc {
      justify-content: center;
      align-items: center;
    }
    &.cell-align-c {
      justify-content: center;
    }
    &.cell-align-rc {
      justify-content: flex-end;
      align-items: center;
    }
    &.cell-align-rb {
      justify-content: flex-end;
      align-items: flex-end;
    }
    &.cell-align-lc {
      align-items: center;
    }
    &.cell-align-lb {
      align-items: flex-end;
    }
    &.cell-align-r {
      justify-content: flex-end;
    }
    &.cell-theme-muted {
      color: #777;
    }
    &.cell-theme-grey,
    &.cell-theme-gray {
      $bg: #e1e1e1;
      background: $bg;
      color: rgb(102, 102, 102);
      &:hover {
        background: darken($bg, 10);
      }
    }
    &.cell-theme-red {
      $bg: #ff3f3f;
      background: $bg;
      color: #fff;
      &:hover {
        background: darken($bg, 10);
        color: #fff;
      }
    }
    &.cell-theme-yellow {
      $bg: #ffe555;
      background: $bg;
      color: #444;
      &:hover {
        background: darken($bg, 10);
        color: #444;
      }
    }
    &.cell-theme-green {
      $bg: #41b445;
      background: $bg;
      color: #fff;
      &:hover {
        background: darken($bg, 10);
        color: #fff;
      }
    }
    &.cell-theme-blue {
      $bg: #b0f1ff;
      background: $bg;
      &:hover {
        background: darken($bg, 10);
        .icon {
          color: darken(#2783a8, 10);
        }
      }
      .icon {
        color: #2783a8;
      }
    }
    &.cell-theme-red,
    &.cell-theme-grey,
    &.cell-theme-blue,
    &.cell-theme-yellow,
    &.cell-theme-green {
      border-radius: 0.75em;
      box-shadow: inset 0 0 0px 3px #ffffffcc;
      &:hover {
        transform: scale(1.1);
        z-index: 1;
        box-shadow: inset 0 0 0px 3px #fff, 0 2px 3px rgba(0, 0, 0, 0.3);
      }
    }
    &.tip {
      &:after {
        content: attr(data-tip);
        text-transform: initial;
        position: absolute;
        z-index: 999;
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
  a.cell,
  button.cell {
    text-decoration: none;
    color: #2783a8;
    /* position: absolute; */
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    border: none;
    cursor: pointer;
    margin: 0;
    transition: 0.1s all ease-out;
    &:hover {
      color: darken(#2783a8, 10%);
      background: #f3f3f3;
    }
    /* box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.281); */
    &:before {
      /* content: ""; */
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      left: 3px;
      border-radius: 0.75em;
      background: rgba(0, 0, 0, 0.03);
    }
  }
  button.cell {
    width: 100%;
  }
  &.table-padding-sm .cell {
    padding: 0.3em;
  }
  &.table-padding-lg .cell {
    padding: 1em 1.2em;
  }
}
</style>
