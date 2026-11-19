<template>
  <form :class="['js-form']">
    <div ref="body" class="body">
      <ul v-if="errors.length">
        <li v-for="(e, i) in errors" :key="i">{{ e.label }}: {{ e.error }}</li>
      </ul>
      <div v-if="model.steps[currentStep].label">
        <div class="step-header">
          <h3 class="step-title">{{ model.steps[currentStep].label }}</h3>
          <ol class="step-dots">
            <li
              v-for="s in model.steps.length"
              :class="{ sel: s === currentStep + 1 }"
              :title="s"
            ></li>
          </ol>
        </div>
        <div class="step-details">
          <i
            v-if="model.steps[currentStep].subLabel"
            :class="['fa-solid', 'icn', 'fa-' + model.steps[currentStep].icon]"
          ></i>
          <p v-if="model.steps[currentStep].subLabel">
            {{ model.steps[currentStep].subLabel }}
          </p>
        </div>
      </div>
      <div
        class="carousel"
        :style="{ left: -currentStep * carouselWidth + 'px' }"
      >
        <div
          class="field-group"
          v-for="(step, j) in steps"
          :key="j"
          :class="{ active: currentStep == j }"
        >
          <div
            class="field"
            v-for="(item, i) in step"
            :key="i"
            :style="span(model.items[item].span)"
          >
            <JsMarkdown
              v-if="model.items[item].header"
              :val="model.items[item].label"
              :parse="model.items[item].parseMarkdown.match(/\*/)"
            />
            <component
              v-else-if="model.items[item].type === 'custom'"
              :is="model.items[item].component"
              :uid="i"
              v-model="model.items[item].value"
              v-bind="model.items[item].props || {}"
              @onChange="inputChange"
            />
            <JsInputCheckbox
              :uid="i"
              v-else-if="model.items[item].type === 'checkbox'"
              v-model="model.items[item].value"
              v-bind="model.items[item]"
            />
            <JsInputRadio
              :uid="i"
              v-else-if="model.items[item].type === 'radio'"
              v-model="model.items[item].value"
              v-bind="model.items[item]"
            />
            <JsInput
              v-else-if="!model.items[item].hide"
              :uid="i"
              :size="size"
              v-model="model.items[item].value"
              v-bind="model.items[item]"
              @onChange="inputChange"
            />
          </div>
        </div>
      </div>
    </div>
    <div :class="['buttons', { 'buttons-sticky': buttonsSticky }]">
      <JsPanelNav class="custom" layout="row" v-bind="model.buttons" />
      <span class="buttons-spacer"></span>
      <JsPanelNav
        class="auto"
        :layout="resetButton ? 'space-first' : 'rows-right'"
        :items="buttons"
      />
    </div>
    <!-- {{ model }} -->
    <br />
    <label
      >Skip Validation <input v-model="noValidation" type="checkbox"
    /></label>
  </form>
</template>

<script>
import JsMarkdown from "./Markdown.vue";
import JsPanelNav from "./PanelNav.vue";
import JsPanelNavItem from "./PanelNavItem.vue";
import JsInput from "./Input.vue";
import JsInputRadio from "./InputRadio.vue";
import JsInputCheckbox from "./InputCheckbox.vue";

export default {
  name: "JsForm",
  components: {
    JsMarkdown,
    JsPanelNav,
    JsPanelNavItem,
    JsInput,
    JsInputRadio,
    JsInputCheckbox,
  },
  mounted() {
    //   this.value = ;
  },
  data() {
    return {
      errors: [],
      currentStep: 0,
      noValidation: true,
      carouselWidth: 0,
    };
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    buttonsSticky: Boolean,
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl", "xxl"].includes(value);
      },
    },
    submitButtonLabel: {
      type: String,
      default: "Submit",
    },
    nextButtonLabel: {
      type: String,
      default: "Next",
    },
    resetButton: {
      type: Boolean,
      default: true,
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
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    totalSteps() {
      return this.model.steps.length;
    },
    submitBtn() {
      return {
        label: this.submitButtonLabel,
        button: "button",
        theme: "blue",
        onClick: this.submit,
      };
    },
    nextBtn() {
      return {
        label: this.nextButtonLabel,
        theme: "blue",
        button: "button",
        onClick: this.next,
      };
    },
    buttons() {
      const buttons = [];
      if (this.resetButton)
        buttons.push({ label: "Reset", button: "button", onClick: this.reset });
      if (this.currentStep > 0)
        buttons.push({ label: "Back", button: "button", onClick: this.back });

      buttons.push(
        this.currentStep == this.totalSteps - 1 ? this.submitBtn : this.nextBtn
      );
      return buttons;
    },
    steps() {
      const steps = [];
      let prevStep = null;
      for (const step of this.model.steps) {
        const stepItems = [];
        for (const [index, item] of this.model.items.entries()) {
          const start = prevStep ? prevStep.end : 0;
          const end = step.end ? step.end - 1 : this.model.items.length - 1;
          if (index >= start && index <= end) {
            stepItems.push(index);
          }
        }
        steps.push(stepItems);
        prevStep = step;
      }
      return steps;
    },
    page() {
      const currentStep = this.model.steps[this.currentStep];
      const prevStep = this.model.steps[this.step - 1];
      const start = prevStep ? prevStep.end : 0;
      const end = currentStep.end
        ? currentStep.end - 1
        : this.model.items.length - 1;
      return { start, end };
    },
  },
  mounted() {
    for (const item of this.model.items) {
      if (!item.header) {
        this.$set(item, "defaultValue", item.value);
      }
    }
  },
  created() {
    window.addEventListener("resize", this.setCarouselWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.setCarouselWidth);
  },
  methods: {
    submit(e) {
      this.$set(this.submitBtn, "disabled", true);
      if (!this.noValidation) this.validate();
      if (this.errors.length && !this.noValidation) {
        this.$set(this.submitBtn, "disabled", false);
      } else {
        const clean = this.value.items.map((a) => ({
          name: a.name,
          value: a.value,
        }));
        console.log(clean[4]);
        this.$emit("on-submit", clean);

        this.reset();
      }
    },
    setCarouselWidth(e) {
      this.carouselWidth = this.$refs.body.offsetWidth;
    },
    next(e, item) {
      if (!this.noValidation) this.validate();
      if (!this.errors.length || this.noValidation) {
        this.setCarouselWidth();
        this.currentStep++;
      }
    },
    back() {
      // this.$set(this.nextBtn, "disabled", false);
      // this.$set(this.submitBtn, "disabled", false);
      this.currentStep--;
    },
    reset() {
      this.errors = [];
      for (const item of this.model.items) {
        if (!item.header) {
          this.$set(item, "invalid", false);
          this.$set(item, "value", item.defaultValue);
          this.$set(item, "actionIcon", false);
          this.$set(item, "error", "");
        }
      }
      this.currentStep = 0;
      this.$set(this.submitBtn, "disabled", false);
    },
    validate() {
      this.errors = [];
      const stepItems = this.steps[this.currentStep];
      for (const i of stepItems) {
        const item = this.model.items[i];
        const value =
          typeof item.value === "string" ? item.value.trim() : item.value;
        this.$set(item, "invalid", false);
        this.$set(item, "error", null);
        this.$set(item, "tip", null);
        if (!item.header && !item.hide) {
          //check validation rules, including optional
          //sample: [{ opt: true }, { min: 5 }, { max: 8 }, { pat: "W." }]
          console.log("validate val", JSON.parse(JSON.stringify(value)));
          console.log("xxx", Array.isArray(value), value.length);
          // arrays and objects
          if (Array.isArray(value)) {
            const firstValue = value[0];
            console.log("firstValue", firstValue);

            if (
              typeof firstValue === "object" &&
              !Array.isArray(firstValue) &&
              firstValue !== null
            ) {
              // object array
              console.log("object array");

              for (const val of item.defaultValue) {
                for (const [key, v] of Object.entries(val)) {
                  if (!v.toString().length) {
                    this.$set(item.props, "invalid", true);
                    this.$set(item.props, "error", "Required");
                    this.$set(item.props, "tip", "Required");
                    this.errors.push(item);
                  }
                }
                console.log(item);
              }
            } else {
              // simple array
              console.log("simple array", item);
              if (!value.length) {
                this.$set(item, "invalid", true);
                this.$set(item, "error", "Required");
                this.$set(item, "tip", "Required");
                this.errors.push(item);
              }
            }
            // strings and numbers
          } else if (!value.toString().length) {
            if (!item.optional) {
              //enforce implicit required validation
              this.$set(item, "invalid", true);
              this.$set(item, "error", "Required");
              this.$set(item, "tip", "Required");
              this.errors.push(item);
            }
          } else if (item.validation) {
            for (const v of item.validation) {
              const ruleKey = Object.keys(v)[0];
              const ruleVal = v[ruleKey];
              if (value === "") {
                this.$set(item, "invalid", true);
                this.$set(item, "error", "Required");
                this.$set(item, "tip", "Required");
                this.errors.push(item);
                break;
              }
              if (ruleKey === "min" && value.length < ruleVal) {
                this.$set(item, "invalid", true);
                this.$set(
                  item,
                  "error",
                  `At least ${ruleVal} characters required`
                );
                this.$set(
                  item,
                  "tip",
                  `At least ${ruleVal} characters required`
                );

                this.errors.push(item);
                break;
              }
              if (ruleKey === "max" && value.length > ruleVal) {
                this.$set(item, "invalid", true);
                this.$set(item, "error", `Only ${ruleVal} characters allowed`);
                this.$set(item, "tip", `Only ${ruleVal} characters allowed`);
                this.errors.push(item);
                break;
              }
            }
          }
        }
      }
    },
    inputChange(i) {
      const item = this.model.items[i];
      //clear item validation
      item.error = null;
      item.invalid = false;
      item.tip = "";
      //process any changes
      if (item.actions) {
        for (const c of item.actions) {
          const target = this.getItemByName(c.name);
          if (c.action === "show") {
            this.$set(target, "hide", c.value !== item.value);
          }
          if (c.action === "hide") {
            this.$set(target, "hide", c.value === item.value);
          }
        }
      }
    },
    getItemByName(name) {
      return this.model.items.find((item) => item.name === name);
    },
    span(cols) {
      return {
        gridColumn: cols ? cols : "1/13",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.js-form {
  position: relative;
  height: 65vh;
  overflow-y: auto;
  .body {
    overflow: hidden;
    .step-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .step-title {
        margin-bottom: 1em;
      }
      .step-dots {
        padding: 0;
        margin: 0;
        display: flex;
        gap: 0.35em;
        list-style: none;
        li {
          margin: 0;
          width: 0.65em;
          height: 0.65em;
          background: #d7d7d7;
          border-radius: 50%;
          filter: alpha(opacity = 25);
          transition: all 0.3s;
          &.sel {
            background: #2883a8;
          }
        }
      }
    }
    .step-details {
      display: flex;
      align-items: center;
      gap: 1.5em;
      margin-bottom: 1.5em;
      padding: 1em 1.75em;
      background: #e5f9ff;
      border-radius: 0.5em;
      .icn {
        font-size: 3.5em;
        color: rgba(0, 0, 0, 0.2);
        color: #2883a8;
      }
      p {
        flex: 1;
        margin: 0;
        font-size: 0.9em;
        font-weight: 500;
      }
    }
    .carousel {
      display: flex;
      align-items: start;
      position: relative;
      transition: all 0.3s;
      .field-group {
        transition: all 0.13s;
        display: grid;
        align-content: center;
        visibility: hidden;
        grid-template-columns: repeat(12, 1fr);
        gap: 1em;
        min-width: 100%;
        .field {
          // border: 1px solid #ccc;
        }
        &.active {
          visibility: visible;
        }
      }
    }
  }
  .buttons {
    position: sticky;
    bottom: 0;
    margin-top: 1em;
    display: flex;
    align-items: center;
    gap: 0.35em;
    .auto {
      flex: 1;
    }
    &.buttons-sticky {
      background: rgba(255, 255, 255, 0.7);
      padding: 0.25em;
      border-radius: 100px;
      backdrop-filter: blur(4px);
    }
  }
}
</style>
