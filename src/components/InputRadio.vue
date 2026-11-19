<template>
  <div
    :class="[
      'js-input-radio',
      'js-input-radio-' + size,
      'js-input-radio-' + (disabled ? 'disabled' : theme),
      { 'js-input-radio-label-top': labelTop },
      { 'js-input-radio-label-invalid': invalid },
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
      ><JsMarkdown :parse="parseMarkdown.match(/label|\*/)" :val="label" />
    </label>
    <div
      :class="['item', { tip: tip }, 'tip-' + (tipPos || 'tr')]"
      :data-tip="tip"
    >
      <div :class="[{ dots: dots }]">
        <label v-for="(radio, i) in items" :key="i">
          <input
            :style="{
              backgroundColor: radio.color,
              backgroundImage: `url(${radio.img})`,
            }"
            :name="`radio${_uid}`"
            type="radio"
            :value="radio.value"
            v-model="inputVal"
            :title="radio.label"
          />{{ dots ? "" : radio.label }}</label
        >
      </div>
    </div>
  </div>
</template>

<script>
import JsMarkdown from "./Markdown.vue";

export default {
  name: "JsInputRadio",
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
    dots: Boolean,
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
    fieldID() {
      return this.id || `js-in-${this._uid}`;
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
.js-input-radio {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
  min-width: 0;
  &.js-input-radio-label-top {
    flex-direction: column;
    align-items: flex-start;
    align-items: stretch;
    gap: 0.25em;
    > .label {
      font-size: 0.85em;
    }
  }
  &.js-input-label-placeholder {
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
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 0.25em;
    border: none;
    font-family: inherit;
    text-align: left;
    padding: 0.15em 0;
    color: darken(#2783a8, 15%);
    font-weight: 600;
    font-size: 1em;
    min-width: 0;
    position: relative;
    outline: none;
    .input {
      flex: 1;
      .input-field {
        border: none;
        outline: none;
        font-size: 0.9em;
        padding: 0.15em 0;
        background: transparent;
        width: 100%;
      }
    }
    .dots {
      display: flex;
      gap: 0.1em;
      width: 100%;
      justify-content: space-evenly;
      label {
        font-family: system-ui, sans-serif;
        font-size: 2.3rem;
        font-weight: bold;
        line-height: 1.1;
        display: grid;
        grid-template-columns: 1em auto;
        width: 1em;
        height: 1em;
        border-radius: 50%;
        &:focus-within {
          color: red;
        }
        &:hover {
          box-shadow: 0px 0px 4px 0px #0000005c;
        }
        input {
          appearance: none;
          /* For iOS < 15 to remove gradient background */
          background-color: #fff;
          /* Not removed via appearance */
          margin: 0;
          font: inherit;
          color: currentColor;
          cursor: pointer;
          width: 1em;
          height: 1em;
          border-radius: 50%;
          // transform: translateY(-0.075em);
          display: grid;
          place-content: center;
          transition: 120ms transform ease-in-out;
          background-size: 90%;
          background-position: center;
        }
        input:checked {
          // transform: scale(1);
          box-shadow: inset 0 0 0 0.075em #333;
          &:before {
            content: "";
            width: 0.25em;
            height: 0.25em;
            border-radius: 50%;
            // box-shadow: inset 1em 1em #fff;
          }
        }
      }
    }
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
  }
  &.js-input-radio-label-invalid:not(:focus-within) {
    > .item {
      box-shadow: inset 0 0 0 1px red;
      .act {
        color: red;
      }
    }
  }
  &.js-input-radio-xs {
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
  &.js-input-radio-sm {
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
  &.js-input-radio-lg {
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
  &.js-input-radio-xl {
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
  &.js-input-radio-disabled {
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
