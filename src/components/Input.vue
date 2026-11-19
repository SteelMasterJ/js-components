<template>
  <div
    :class="[
      'js-input',
      'js-input-' + size,
      'js-input-' + (disabled ? 'disabled' : theme),
      { 'js-input-label-top': labelTop },
      { 'js-input-label-invalid': invalid },
      { 'js-input-label-placeholder': labelPlaceholder },
      { 'js-input-label-placeholder-active': inputVal.toString().length },
    ]"
  >
    <label
      :for="fieldID"
      v-if="label"
      :class="[
        'label',
        { 'label-wrap': labelWrap },
        { 'label-show': inputVal.toString().length },
      ]"
      ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="label" />
    </label>
    <div
      :class="['item', { tip: tip }, 'tip-' + (tipPos || 'tr')]"
      :data-tip="tip"
    >
      <span class="icon" :title="icon" v-if="icon"
        >&#x200b;
        <i
          :style="{ color: iconColor }"
          :class="['icn', 'fa-' + icon, 'fa-' + (iconVariant || 'solid')]"
        ></i
      ></span>
      <span
        v-else-if="img"
        :title="label"
        :class="['thumb', { 'thumb-x2': imgSize == 'lg' }]"
        ><img :src="img" alt="thumb"
      /></span>
      <div class="input">
        <div class="select" v-if="type == 'select'">
          <select class="input-field" v-model="inputVal" @change="onChange">
            <option v-if="labelPlaceholder" disabled value="">
              Choose {{ label }}...
            </option>
            <option v-for="(item, i) in items" :value="item.value" :key="i">
              {{ item.label }}
            </option>
          </select>
          <i class="caret fa-caret-down fa-solid"></i>
        </div>
        <input
          v-else
          class="input-field"
          ref="inputElement"
          @change="onChange"
          :id="fieldID"
          :disabled="disabled"
          :placeholder="placeholder || (label && labelPlaceholder ? label : '')"
          :type="type"
          :step="type === 'number' && step"
          v-model="inputVal"
          tabindex="0"
          autocomplete="off"
          :autofocus="autoFocus"
        />
      </div>
      <span
        v-if="notifyCount > 0 || notifyLabel || notifyIcon"
        :data-tip="notifyTipText"
        :data-count="notifyCount"
        role="alert"
        :class="[
          'notify',
          { 'notify-tip': notifyTipText },
          'notify-' + notifyColor,
        ]"
      >
        <span v-if="notifyCount > 0">{{ notifyCount }}</span>
        <span v-if="notifyLabel">{{ notifyLabel }}</span
        ><i
          v-if="notifyIcon"
          :class="[
            'icn icn-sm fa-' + notifyIcon,
            'fa-' + (notifyIconVariant || 'solid'),
          ]"
        ></i
      ></span>
      <i
        v-if="action"
        :class="[
          'icn act fa-' + action,
          'fa-' + (actionFX || 'nofx'),
          'fa-' + (iconVariant || 'solid'),
        ]"
      ></i>
    </div>
    <div
      v-if="type === 'text' && listItems.length"
      :class="[
        'drop',
        'drop-' + (dropSize || 'auto'),
        'drop-' + (dropTheme || 'dark'),
        { 'drop-right': dropRight },
      ]"
    >
      <div v-if="dropTabs" class="tabs">
        <template v-for="(tab, i) in listItems">
          <input
            class="tab-input"
            :name="_uid + 'tabs'"
            type="radio"
            :checked="dropTabSelected == i"
            :id="_uid + 'tab' + i"
            :key="'ti' + (tab.id || i)"
          />
          <label
            :style="{ width: 96 / listItems.length + '%' }"
            class="tab-label"
            :for="_uid + 'tab' + i"
            :key="'tl' + (tab.id || i)"
            :title="tab.label"
            tabindex="0"
            ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="tab.label"
          /></label>
          <div class="tab-content" :key="'tc' + (tab.id || i)">
            <JsNavList
              :parseMarkdown="parseMarkdown"
              :theme="dropTheme"
              :dropSize="dropSize"
              :items="tab.items"
            />
          </div>
        </template>
      </div>
      <JsNavList
        v-else
        :parseMarkdown="parseMarkdown"
        :theme="dropTheme"
        :dropSize="dropSize"
        :items="listItems"
      />
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsPanelNavItem from "./NavItem.vue/index.js";
import JsNavList from "./NavList.vue";

export default {
  name: "JsInput",
  components: {
    JsMarkdown,
    JsPanelNavItem,
    JsNavList,
  },
  data() {
    return {
      xvalue: "",
    };
  },
  props: {
    uid: Number,
    value: {
      type: [String, Number, Object, Array],
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    step: {
      type: String,
      default: "1",
    },
    items: { type: Array, default: () => [] },
    submit: Object,
    id: String,
    label: String,
    labelTop: Boolean,
    labelPlaceholder: Boolean,
    placeholder: String,
    icon: String,
    iconColor: String,
    iconVariant: String,
    actionIcon: [String, Boolean],
    actionFX: String,
    img: String,
    imgSize: String,
    tip: String,
    tipPos: String,
    invalid: Boolean,
    error: String,
    errorIcon: { type: String, default: "triangle-exclamation" },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl", "xxl"].includes(value);
      },
    },
    disabled: Boolean,
    autoFocus: Boolean,
    labelWrap: Boolean,
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    parseMarkdown: {
      type: String,
      default: "",
    },
    dropRight: {
      type: Boolean,
      default: true,
    },
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
    dropTheme: {
      type: String,
      default: "light",
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
    notifyIconVariant: String,
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
    searchableProperties: {
      type: Array,
      default: () => ["label", "subLabel"],
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    listItems() {
      let list = [...this.items];
      if (this.value.toString().trim().length) {
        list = list.filter((i) => this.findInObject(i, this.value));
      }
      // list.map((i) => (i.onClick = this.select));
      list.map((i) => {
        i.onClick = this.select;
        if (i.items) {
          i.items.map((i) => (i.onClick = this.select));
          if (i.items.items) {
            i.items.items.map((i) => (i.onClick = this.select));
          }
        }
      });
      // list.reduce(this.reducer, []);
      return list;
    },
    action() {
      if (this.error) return this.errorIcon;

      let act = this.actionIcon;

      if (act === false) return false;
      if (typeof act === "string") return act;
      if (this.items.length && this.type != "select") act = "caret-down";
      return act;
    },
    notifyTipText() {
      return "123";
      let tip = false;
      if (this.notifyTip) tip = this.notifyTip;
      else if (this.notifyCount > 0)
        tip = this.pluralize(this.notifyCount, this.notifyUnits);
      return tip;
    },
    fieldID() {
      return this.id || `js-in-${this._uid}`;
    },
  },
  methods: {
    select(e, item) {
      console.log(e, item);
      e.target.blur();
      if (this.value === item.label) return false;
      this.value = item.label;
      this.$refs.inputElement.focus();
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
              o[a].toLowerCase().includes(q.toLowerCase())
          : false;
      });
    },
    onChange() {
      this.$emit("onChange", this.uid);
    },
    reducer(acc, item, idx, arr) {
      item.onClick = this.select;
      item.items = this.reducer(item.items);
      return acc;
    },
    back(e) {
      const el = e.target;
      el.closest(".panel-nav-item-root").querySelector(".item").focus();
    },

    pluralize(count, noun, suffix = "s") {
      if (!noun) noun = "item";
      return `${count} ${noun}${count !== 1 ? suffix : ""}`;
    },
  },
};
</script>
<style lang="scss">
.js-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
  &:focus-within {
    > .item {
      box-shadow: inset 0 0 0 1px blue;
    }
  }
  &.js-input-label-top {
    flex-direction: column;
    align-items: flex-start;
    align-items: stretch;
    gap: 0.25em;
    > .label {
      font-size: 0.85em;
    }
  }
  &.js-input-label-placeholder {
    // margin-top: 1.5em;
    > .item {
      padding: 0.375em 0.5em 0.375em 0.5em;
    }
    > .label {
      position: absolute;
      top: 0;
      left: 0.5em;
      opacity: 0;
      z-index: 1;
      &.label-show {
        opacity: 1;
        top: 0.2em;
        left: 0.4em;
        font-size: 0.7em;
      }
    }
    &.js-input-label-placeholder-active {
      > .item {
        padding: 0.75em 0.5em 0 0.5em;
      }
    }
  }

  > .label {
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    transition: all 0.35s;
    strong {
      font-weight: bolder;
    }
    .tag {
      color: #fff;
      background: #2783a8;
    }
    &.label-wrap {
      white-space: wrap;
    }
  }
  > .item {
    flex: 1;
    display: flex;
    transition: all 0.35s;
    gap: 0.35em;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 0.25em;
    border: none;
    font-family: inherit;
    background: #fff;
    text-align: left;
    padding: 0 0.5em;
    color: darken(#2783a8, 15%);
    font-weight: 600;
    font-size: 1em;
    min-width: 0;
    position: relative;
    outline: none;
    box-shadow: inset 0 0 0 1px #ddd;
    .input {
      flex: 1;
      .input-field {
        border: none;
        outline: none;
        font-size: 0.9em;
        padding: 0.5em 0;
        background: transparent;
        width: 100%;
      }
      .select {
        position: relative;
        .input-field {
          appearance: none;
          padding-right: 2em;
        }
        .caret {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.85em;
          pointer-events: none;
        }
      }
    }
    .icon,
    .act,
    .label,
    .notify {
      font-size: 0.9em;
    }
    .icon {
      display: flex;
      align-items: center;
      .icn {
        font-size: 0.85em;
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
    &:focus {
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
    /* box-shadow: 0px 5px 12px 3px rgba(0, 0, 0, 0.3); */
    box-shadow: 0px 3px 5px 2px rgba(0, 0, 0, 0.1);
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
        transition: background 0.2s;
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
        &:only-of-type {
          border-radius: 1em;
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
  &:focus-within > .drop,
  .drop:hover {
    display: block;
  }
  &.js-input-label-invalid:not(:focus-within) {
    > .item {
      box-shadow: inset 0 0 0 1px red;
      .act {
        color: red;
      }
    }
  }
  &.js-input-xs {
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
  &.js-input-sm {
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
  &.js-input-lg {
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
  &.js-input-xl {
    > .item {
      font-size: 1.35em;
      /* border-radius: 100px; */
      .sub-label {
        font-size: 0.75em;
      }
      .thumb {
        width: 4.8em;
        &.thumb-x2 {
          width: 5.8em;
        }
      }
    }
  }
  &.js-input-disabled {
    > .item {
      cursor: not-allowed;
      color: #fff;
      background: #bbb;
      &:hover,
      &:active,
      &:focus,
      &.item-active {
        background: #aaa;
      }
      .tag {
        background: #bbb;
        color: #ccc;
      }
      .icn {
        color: #fff;
      }
    }
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
@keyframes folddown2 {
  0% {
    transform-origin: top center;
    transform: translate(-50%, -2em);
  }
  100% {
  }
}
</style>
