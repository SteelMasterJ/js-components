<template>
  <form
    :class="['js-form', 'js-form--' + theme]"
    :novalidate="novalidate"
    @submit.prevent="handleSubmit"
  >
    <div
      v-if="errors.length"
      ref="errorSummaryRef"
      class="js-form__errors"
      role="alert"
      aria-live="assertive"
      tabindex="-1"
    >
      <p class="js-form__errors-title">
        <JsIcon name="alert" />
        <span>Please fix the following {{ errors.length === 1 ? "issue" : "issues" }}:</span>
      </p>
      <ul class="js-form__errors-list">
        <li v-for="(err, idx) in errors" :key="err.fieldId || idx">
          <a
            :href="'#' + err.fieldId"
            class="js-form__error-link"
            @click.prevent="focusField(err.fieldId)"
          >
            {{ err.label || err.name }}: {{ err.error }}
          </a>
        </li>
      </ul>
    </div>

    <header v-if="activeStepMeta && (activeStepMeta.label || totalSteps > 1)" class="js-form__header">
      <div class="js-form__step-bar">
        <h3 v-if="activeStepMeta.label" class="js-form__step-title">
          {{ activeStepMeta.label }}
        </h3>
        <ol
          v-if="totalSteps > 1"
          class="js-form__steps"
          aria-label="Form steps"
        >
          <li
            v-for="(stepMeta, sIdx) in normalizedSteps"
            :key="sIdx"
            :class="[
              'js-form__step-dot',
              { 'js-form__step-dot--active': sIdx === currentStep },
              { 'js-form__step-dot--done': sIdx < currentStep },
            ]"
            :aria-current="sIdx === currentStep ? 'step' : undefined"
            :title="stepMeta.label || `Step ${sIdx + 1}`"
          >
            <span class="js-sr-only">
              Step {{ sIdx + 1 }}{{ stepMeta.label ? `: ${stepMeta.label}` : "" }}
              {{ sIdx === currentStep ? " (current)" : sIdx < currentStep ? " (completed)" : "" }}
            </span>
          </li>
        </ol>
      </div>

      <div v-if="activeStepMeta.subLabel" class="js-form__step-details">
        <JsIcon
          v-if="activeStepMeta.icon"
          :name="activeStepMeta.icon"
          class="js-form__step-icon"
        />
        <p class="js-form__step-sub">{{ activeStepMeta.subLabel }}</p>
      </div>
    </header>

    <fieldset
      v-if="activeStepItemIndices.length"
      class="js-form__fieldset"
    >
      <legend class="js-sr-only">
        {{ (activeStepMeta && activeStepMeta.label) || "Form fields" }}
      </legend>

      <div class="js-form__grid">
        <template v-for="idx in activeStepItemIndices" :key="items[idx].name || idx">
          <div
            v-if="!items[idx].hide"
            class="js-form__field"
            :style="fieldSpanStyle(items[idx].span)"
          >
            <div v-if="items[idx].header" class="js-form__section-header">
              <JsMarkdown
                :val="items[idx].label"
                :parse="Boolean(items[idx].parseMarkdown || parseMarkdown)"
              />
            </div>

            <component
              :is="items[idx].component"
              v-else-if="items[idx].type === 'custom' && items[idx].component"
              :id="fieldDomId(idx)"
              :uid="idx"
              :model-value="items[idx].value"
              v-bind="items[idx].props || {}"
              @update:model-value="(val) => onFieldUpdate(idx, val)"
              @change="() => onFieldChange(idx)"
            />

            <JsInputCheckbox
              v-else-if="items[idx].type === 'checkbox'"
              :id="fieldDomId(idx)"
              :uid="idx"
              :size="items[idx].size || size"
              :theme="items[idx].theme || theme"
              :model-value="items[idx].value"
              :label="items[idx].label"
              :items="items[idx].items || []"
              :layout="items[idx].layout || 'cols-auto'"
              :hint="items[idx].hint || items[idx].tip || ''"
              :invalid="Boolean(items[idx].invalid)"
              :error="items[idx].error || ''"
              :disabled="Boolean(items[idx].disabled)"
              :parse-markdown="items[idx].parseMarkdown || parseMarkdown"
              @update:model-value="(val) => onFieldUpdate(idx, val)"
              @change="() => onFieldChange(idx)"
            />

            <JsInputRadio
              v-else-if="items[idx].type === 'radio'"
              :id="fieldDomId(idx)"
              :uid="idx"
              :size="items[idx].size || size"
              :theme="items[idx].theme || theme"
              :model-value="items[idx].value"
              :label="items[idx].label"
              :items="items[idx].items || []"
              :dots="Boolean(items[idx].dots)"
              :hint="items[idx].hint || items[idx].tip || ''"
              :invalid="Boolean(items[idx].invalid)"
              :error="items[idx].error || ''"
              :disabled="Boolean(items[idx].disabled)"
              :parse-markdown="items[idx].parseMarkdown || parseMarkdown"
              @update:model-value="(val) => onFieldUpdate(idx, val)"
              @change="() => onFieldChange(idx)"
            />

            <JsInput
              v-else
              :id="fieldDomId(idx)"
              :uid="idx"
              :size="items[idx].size || size"
              :theme="items[idx].theme || theme"
              :type="items[idx].type || 'text'"
              :model-value="items[idx].value"
              :label="items[idx].label"
              :label-top="items[idx].labelTop !== undefined ? items[idx].labelTop : true"
              :label-placeholder="Boolean(items[idx].labelPlaceholder)"
              :placeholder="items[idx].placeholder || ''"
              :items="items[idx].items || []"
              :icon="items[idx].icon || ''"
              :step="items[idx].step || '1'"
              :rows="items[idx].rows || 3"
              :hint="items[idx].hint || items[idx].tip || ''"
              :invalid="Boolean(items[idx].invalid)"
              :error="items[idx].error || ''"
              :disabled="Boolean(items[idx].disabled)"
              :parse-markdown="items[idx].parseMarkdown || parseMarkdown"
              @update:model-value="(val) => onFieldUpdate(idx, val)"
              @change="() => onFieldChange(idx)"
            />
          </div>
        </template>
      </div>
    </fieldset>

    <div :class="['js-form__actions', { 'js-form__actions--sticky': buttonsSticky }]">
      <JsPanelNav
        v-if="modelValue && modelValue.buttons"
        class="js-form__custom-actions"
        aria-label="Custom form actions"
        layout="row"
        v-bind="modelValue.buttons"
      />

      <div class="js-form__nav-actions">
        <JsNavItem
          v-if="resetButton"
          theme="light"
          size="sm"
          :item="{ label: resetButtonLabel, button: 'button', onClick: reset }"
        />
        <span class="js-form__spacer" aria-hidden="true"></span>
        <JsNavItem
          v-if="currentStep > 0"
          theme="light"
          size="sm"
          :item="{ label: backButtonLabel, button: 'button', onClick: back }"
        />
        <JsNavItem
          v-if="currentStep < totalSteps - 1"
          theme="blue"
          size="sm"
          :item="{ label: nextButtonLabel, button: 'button', onClick: next }"
        />
        <JsNavItem
          v-else
          theme="blue"
          size="sm"
          :disabled="submitting"
          :item="{ label: submitButtonLabel, button: 'submit' }"
        />
      </div>
    </div>
  </form>
</template>

<script>
import JsIcon from "./Icon.vue";
import JsMarkdown from "./Markdown.vue";
import JsNavItem from "./NavItem.vue";
import JsPanelNav from "./PanelNav.vue";
import JsInput from "./Input.vue";
import JsInputRadio from "./InputRadio.vue";
import JsInputCheckbox from "./InputCheckbox.vue";
import { createUid } from "../utils/uid.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  name: "JsForm",
  components: {
    JsIcon,
    JsMarkdown,
    JsNavItem,
    JsPanelNav,
    JsInput,
    JsInputRadio,
    JsInputCheckbox,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({ steps: [], items: [] }),
    },
    buttonsSticky: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
      validator(value) {
        return ["xs", "sm", "md", "lg", "xl"].includes(value);
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
    backButtonLabel: {
      type: String,
      default: "Back",
    },
    resetButtonLabel: {
      type: String,
      default: "Reset",
    },
    resetButton: {
      type: Boolean,
      default: true,
    },
    resetOnSubmit: {
      type: Boolean,
      default: false,
    },
    novalidate: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      default: "light",
      validator(v) {
        return ["light", "dark"].includes(v);
      },
    },
    parseMarkdown: {
      type: [Boolean, String],
      default: "",
    },
  },
  emits: ["update:modelValue", "submit", "reset", "step-change", "change"],
  data() {
    return {
      formUid: createUid("js-form"),
      errors: [],
      currentStep: 0,
      submitting: false,
      defaultValues: [],
    };
  },
  computed: {
    items() {
      return Array.isArray(this.modelValue?.items) ? this.modelValue.items : [];
    },
    normalizedSteps() {
      if (
        Array.isArray(this.modelValue?.steps) &&
        this.modelValue.steps.length > 0
      ) {
        return this.modelValue.steps;
      }
      return [{ label: "" }];
    },
    totalSteps() {
      return this.normalizedSteps.length;
    },
    stepBuckets() {
      const buckets = [];
      let prevEnd = 0;
      for (const step of this.normalizedSteps) {
        const start = prevEnd;
        const end = step.end ? step.end - 1 : this.items.length - 1;
        const indices = [];
        for (let i = start; i <= end && i < this.items.length; i += 1) {
          indices.push(i);
        }
        buckets.push(indices);
        prevEnd = step.end || this.items.length;
      }
      return buckets;
    },
    activeStepMeta() {
      return this.normalizedSteps[this.currentStep] || null;
    },
    activeStepItemIndices() {
      return this.stepBuckets[this.currentStep] || [];
    },
  },
  mounted() {
    this.snapshotDefaults();
  },
  methods: {
    snapshotDefaults() {
      this.defaultValues = this.items.map((item) => {
        if (item.header) return undefined;
        return Array.isArray(item.value) ? [...item.value] : item.value;
      });
    },
    fieldDomId(idx) {
      const item = this.items[idx];
      if (item && item.id) return item.id;
      return `${this.formUid}-f-${idx}`;
    },
    fieldSpanStyle(span) {
      return {
        gridColumn: span || "1 / -1",
      };
    },
    focusField(domId) {
      if (typeof document === "undefined") return;
      const el = document.getElementById(domId);
      if (!el) return;
      if (typeof el.focus === "function" && ["INPUT", "SELECT", "TEXTAREA"].includes(el.tagName)) {
        el.focus();
      } else {
        const input = el.querySelector("input, select, textarea, button");
        if (input && typeof input.focus === "function") {
          input.focus();
        }
      }
    },
    onFieldUpdate(idx, val) {
      const item = this.items[idx];
      if (!item) return;
      item.value = val;
      item.invalid = false;
      item.error = "";
      this.applyActions(item);
      this.$emit("update:modelValue", this.modelValue);
      this.$emit("change", { index: idx, name: item.name, value: val, item });
    },
    onFieldChange(idx) {
      const item = this.items[idx];
      if (!item) return;
      item.invalid = false;
      item.error = "";
      this.applyActions(item);
    },
    applyActions(item) {
      if (!Array.isArray(item.actions)) return;
      for (const act of item.actions) {
        const target = this.items.find((it) => it.name === act.name);
        if (!target) continue;
        if (act.action === "show") {
          target.hide = act.value !== item.value;
        } else if (act.action === "hide") {
          target.hide = act.value === item.value;
        }
      }
    },
    validateStep(stepIndex = this.currentStep) {
      this.errors = [];
      const indices = this.stepBuckets[stepIndex] || [];

      for (const idx of indices) {
        const item = this.items[idx];
        if (!item || item.header || item.hide || item.disabled) continue;

        item.invalid = false;
        item.error = "";

        const raw = item.value;
        const val = typeof raw === "string" ? raw.trim() : raw;
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0) ||
          (item.type === "checkbox" && !Array.isArray(val) && val === false && !item.optional);

        if (isEmpty) {
          if (!item.optional) {
            this.recordError(idx, item, "Required");
          }
          continue;
        }

        if (item.type === "email" && typeof val === "string" && !EMAIL_RE.test(val)) {
          this.recordError(idx, item, "Enter a valid email address");
          continue;
        }

        if (Array.isArray(item.validation)) {
          for (const rule of item.validation) {
            const key = Object.keys(rule)[0];
            const ruleVal = rule[key];
            if (key === "min" && typeof val === "string" && val.length < ruleVal) {
              this.recordError(idx, item, `At least ${ruleVal} characters required`);
              break;
            }
            if (key === "max" && typeof val === "string" && val.length > ruleVal) {
              this.recordError(idx, item, `At most ${ruleVal} characters allowed`);
              break;
            }
            if (
              (key === "pat" || key === "pattern") &&
              typeof val === "string" &&
              !new RegExp(ruleVal).test(val)
            ) {
              this.recordError(idx, item, rule.message || "Invalid format");
              break;
            }
          }
        }

        if (!item.invalid && typeof item.validator === "function") {
          const msg = item.validator(val, item);
          if (typeof msg === "string" && msg.length > 0) {
            this.recordError(idx, item, msg);
          }
        }
      }

      if (this.errors.length) {
        this.$nextTick(() => {
          if (this.$refs.errorSummaryRef) {
            this.$refs.errorSummaryRef.focus();
          }
        });
      }

      return this.errors.length === 0;
    },
    recordError(idx, item, message) {
      item.invalid = true;
      item.error = message;
      this.errors.push({
        fieldId: this.fieldDomId(idx),
        name: item.name || `Field ${idx + 1}`,
        label: item.label || item.name || `Field ${idx + 1}`,
        error: message,
      });
    },
    next() {
      if (!this.novalidate && !this.validateStep(this.currentStep)) return;
      if (this.currentStep < this.totalSteps - 1) {
        this.currentStep += 1;
        this.errors = [];
        this.$emit("step-change", this.currentStep);
      }
    },
    back() {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
        this.errors = [];
        this.$emit("step-change", this.currentStep);
      }
    },
    reset() {
      this.errors = [];
      this.items.forEach((item, idx) => {
        if (item.header) return;
        item.invalid = false;
        item.error = "";
        const def = this.defaultValues[idx];
        item.value = Array.isArray(def) ? [...def] : def ?? "";
      });
      this.currentStep = 0;
      this.submitting = false;
      this.$emit("update:modelValue", this.modelValue);
      this.$emit("reset");
    },
    handleSubmit() {
      if (!this.novalidate && !this.validateStep(this.currentStep)) {
        return;
      }
      this.submitting = true;
      const payload = this.items
        .filter((item) => !item.header)
        .map((item) => ({
          name: item.name,
          value: item.value,
        }));
      this.$emit("submit", payload);
      if (this.resetOnSubmit) {
        this.reset();
      } else {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.js-form {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-4);
  width: 100%;
  font-family: var(--js-font-family);
  color: var(--js-color-text);
}

.js-form__errors {
  padding: var(--js-space-3) var(--js-space-4);
  border: 1px solid var(--js-color-danger);
  border-radius: var(--js-radius-md);
  background-color: #fdf2f2;
  color: var(--js-color-danger);
}

.js-form__errors:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: var(--js-focus-offset);
}

.js-form__errors-title {
  display: flex;
  align-items: center;
  gap: var(--js-space-2);
  margin: 0 0 var(--js-space-2);
  font-size: var(--js-font-size-sm);
  font-weight: 700;
}

.js-form__errors-list {
  margin: 0;
  padding-inline-start: 1.25rem;
  font-size: var(--js-font-size-sm);
}

.js-form__error-link {
  color: inherit;
  text-decoration: underline;
}

.js-form__error-link:focus-visible {
  outline: var(--js-focus-ring);
  outline-offset: 2px;
}

.js-form__header {
  display: flex;
  flex-direction: column;
  gap: var(--js-space-2);
}

.js-form__step-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--js-space-2);
}

.js-form__step-title {
  margin: 0;
  font-size: var(--js-font-size-lg);
  font-weight: 700;
}

.js-form__steps {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.js-form__step-dot {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  background-color: var(--js-color-border-strong);
  transition: background-color var(--js-transition-fast),
    transform var(--js-transition-fast);
}

.js-form__step-dot--active {
  background-color: var(--js-color-primary);
  transform: scale(1.2);
}

.js-form__step-dot--done {
  background-color: var(--js-color-success);
}

.js-form__step-details {
  display: flex;
  align-items: center;
  gap: var(--js-space-3);
  padding: var(--js-space-3) var(--js-space-4);
  border-radius: var(--js-radius-md);
  background-color: var(--js-color-primary-soft);
  color: var(--js-color-primary-hover);
}

.js-form__step-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.js-form__step-sub {
  margin: 0;
  font-size: var(--js-font-size-sm);
  font-weight: 500;
}

.js-form__fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}

.js-form__grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--js-space-4);
  align-items: start;
}

.js-form__field {
  min-width: 0;
}

.js-form__section-header {
  font-size: var(--js-font-size-md);
  font-weight: 700;
  padding-bottom: var(--js-space-1);
  border-bottom: 1px solid var(--js-color-divider);
}

.js-form__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
  padding-top: var(--js-space-2);
}

.js-form__actions--sticky {
  position: sticky;
  bottom: 0;
  z-index: var(--js-z-sticky);
  padding: var(--js-space-2) var(--js-space-3);
  border-radius: var(--js-radius-md);
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  border: 1px solid var(--js-color-border);
}

.js-form__nav-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--js-space-2);
  flex: 1 1 auto;
}

.js-form__spacer {
  flex: 1 1 auto;
}

/* Dark theme */
.js-form--dark {
  color: var(--js-color-text-inverse);
}

.js-form--dark .js-form__step-details {
  background-color: var(--js-color-surface-dark-hover);
  color: var(--js-color-text-inverse);
}

.js-form--dark .js-form__section-header {
  border-bottom-color: var(--js-color-divider-dark);
}

.js-form--dark .js-form__actions--sticky {
  background-color: rgba(37, 40, 44, 0.92);
  border-color: var(--js-color-divider-dark);
}

@media (max-width: 640px) {
  .js-form__grid {
    grid-template-columns: 1fr;
  }

  .js-form__field {
    grid-column: 1 / -1;
  }
}
</style>
