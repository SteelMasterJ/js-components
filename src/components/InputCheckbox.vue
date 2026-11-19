<template>
  <div
    :class="[
      'js-input-checkbox',
      'js-input-checkbox-' + size,
      'js-input-checkbox-' + (disabled ? 'disabled' : theme),
      { 'js-input-checkbox-label-top': labelTop },
      { 'js-input-checkbox-label-invalid': invalid },
    ]"
  >
    <label
      v-if="label"
      :for="fieldID"
      :class="[
        'label',
        { 'label-wrap': labelWrap },
        { 'label-show': inputVal.length },
      ]"
      ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="displayLabel" />
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
      <div :class="['layout', 'layout-' + layout]">
        <div class="input">
          <label v-for="(cb, i) in items" :key="i">
            <input
              @change="onChange"
              :style="{
                backgroundColor: cb.color,
                backgroundImage: `url(${cb.img})`,
              }"
              type="checkbox"
              :value="cb.value"
              v-model="inputVal"
              :title="cb.label"
            />{{ dots ? "" : cb.label }}</label
          >
        </div>
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
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";

export default {
  name: "JsInputCheckbox",
  components: {
    JsMarkdown,
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
    disabled: Boolean,
    labelWrap: Boolean,
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
          "rows",
          "spaced",
          "centered",
        ].includes(v);
      },
    },
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
    displayLabel() {
      const count = this.inputVal.length > 1 ? `(${this.inputVal.length})` : "";
      return `${this.label} ${count}`;
    },
    fieldID() {
      return this.id || `js-in-${this._uid}`;
    },
    action() {
      if (this.error) return this.errorIcon;

      let act = this.actionIcon;

      if (act === false) return false;
      if (typeof act === "string") return act;
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
  },
  methods: {
    onChange() {
      this.$emit("onChange", this.uid);
    },
  },
};
</script>
<style lang="scss">
.js-input-checkbox {
  position: relative;
  display: flex;
  align-items: start;
  gap: 0.5em;
  min-width: 0;
  &:focus-within {
    > .item {
      box-shadow: inset 0 0 0 1px blue;
    }
  }
  &.js-input-checkbox-label-top {
    flex-direction: column;
    align-items: flex-start;
    align-items: stretch;
    gap: 0.25em;
    > .label {
      font-size: 0.85em;
    }
  }
  &.js-input-checkbox-label-placeholder {
    margin-top: 1.5em;
    > .label {
      position: absolute;
      top: 0;
      left: 0.5em;
      opacity: 0;
      &.label-show {
        opacity: 1;
        top: -1.6em;
        left: 0;
        font-size: 0.85em;
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
    justify-content: center;
    text-decoration: none;
    border-radius: 0.25em;
    border: none;
    font-family: inherit;
    background: #fff;
    text-align: left;
    padding: 0.35em;
    color: darken(#2783a8, 15%);
    font-weight: 500;
    font-size: 1em;
    min-width: 0;
    position: relative;
    outline: none;
    box-shadow: inset 0 0 0 1px #ddd;
    .label {
      font-size: 0.9em;
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
    .input {
      label {
        white-space: nowrap;
      }
    }
    .layout {
      flex: 1;
      padding: 0.25em;
      gap: 0.75em;

      &.layout-cols-auto,
      &.layout-cols-1,
      &.layout-cols-2,
      &.layout-cols-3,
      &.layout-cols-4,
      &.layout-cols-5 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));
        grid-auto-columns: 1fr;
        align-items: start;
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
      &.layout-rows,
      &.layout-spaced,
      &.layout-centered {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
      }
      &.layout-spaced {
        justify-content: space-between;
      }
      &.layout-centered {
        justify-content: space-evenly;
      }
    }
  }
  &.js-input-checkbox-label-invalid:not(:focus-within) {
    > .item {
      box-shadow: inset 0 0 0 1px red;
      .act {
        color: red;
      }
    }
  }
  &.js-input-checkbox-xs {
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
  &.js-input-checkbox-sm {
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
  &.js-input-checkbox-lg {
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
  &.js-input-checkbox-xl {
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
  &.js-input-checkbox-disabled {
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
</style>
