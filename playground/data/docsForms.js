import { markRaw } from "vue";
import {
  JsForm,
  JsInput,
  JsInputCheckbox,
  JsInputRadio,
} from "@steelmasterj/js-components";
import DemoJsInput from "../components/demos/DemoJsInput.vue";
import DemoJsInputCheckbox from "../components/demos/DemoJsInputCheckbox.vue";
import DemoJsInputRadio from "../components/demos/DemoJsInputRadio.vue";
import DemoJsForm from "../components/demos/DemoJsForm.vue";

export const formsDocs = [
  {
    slug: "js-input",
    name: "JsInput",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    icon: "search",
    summary: "Unified text, textarea, autocomplete combobox, and WAI-ARIA select with $attrs forwarding.",
    description:
      "JsInput handles text/email/number/password/search inputs, multi-line textareas, filterable autocomplete comboboxes, and custom WAI-ARIA select-only comboboxes (type='select'). Native attributes like maxlength, autocomplete, and name forward directly onto the inner control via inheritAttrs: false.",
    accessibilityNotes: [
      "Links <label>, hint, and role='alert' error messages via unique `aria-describedby` IDs and `aria-invalid`.",
      "Autocomplete and `type='select'` implement ARIA `combobox` / `listbox` with ArrowUp, ArrowDown, Enter, and Escape.",
      "Respects `--js-touch-min` for coarse pointers and provides clear `:focus-visible` outlines.",
    ],
    component: markRaw(JsInput),
    demoComponent: markRaw(DemoJsInput),
    importSnippet: `import { JsInput } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsInput
  v-model="email"
  type="email"
  label="Work Email"
  placeholder="you@example.com"
  hint="We never share your email."
  :invalid="Boolean(emailError)"
  :error="emailError"
/>`,
    propDocs: {
      uid: { values: "Number | String", description: "Optional seed used to construct stable deterministic field IDs." },
      modelValue: { values: "String | Number", description: "Bound input value via v-model." },
      type: { values: "text | email | password | number | tel | url | search | textarea | select | ...", description: "Control mode or HTML input type." },
      step: { values: "String | Number", description: "Numeric step attribute for type='number'." },
      rows: { values: "Number", description: "Initial visible row count for type='textarea'." },
      items: { values: "Array<Object>", description: "Options for autocomplete combobox or type='select'." },
      id: { values: "String", description: "Explicit DOM id on the underlying control." },
      label: { values: "String", description: "Accessible label text." },
      labelTop: { values: "true | false", description: "Positions the label above the control." },
      labelPlaceholder: { values: "true | false", description: "Uses floating placeholder-style label animation." },
      placeholder: { values: "String", description: "Placeholder text shown when empty." },
      icon: { values: "JsIcon name", description: "Leading icon inside the input shell." },
      iconColor: { values: "CSS color", description: "Color applied to the leading icon." },
      actionIcon: { values: "String | Boolean", description: "Trailing action icon override (or false to hide)." },
      img: { values: "URL string", description: "Leading avatar/thumbnail image inside the input." },
      imgAlt: { values: "String", description: "Alt text for the leading image." },
      imgSize: { values: "sm | md | lg", description: "Size preset for the leading image." },
      hint: { values: "String", description: "Helper text linked via aria-describedby." },
      tip: { values: "String", description: "Tooltip text on the field." },
      invalid: { values: "true | false", description: "Marks the control invalid (aria-invalid='true')." },
      error: { values: "String", description: "Validation error message rendered in role='alert'." },
      errorIcon: { values: "JsIcon name", description: "Icon displayed alongside the error message." },
      size: { values: "xs | sm | md | lg | xl", description: "Control height and font scale." },
      disabled: { values: "true | false", description: "Disables interaction and applies disabled styling." },
      autoFocus: { values: "true | false", description: "Focuses the input automatically on mount." },
      labelWrap: { values: "true | false", description: "Allows long labels to wrap cleanly." },
      theme: { values: "light | dark", description: "Light or dark control surface." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in label, hint, and error." },
      dropRight: { values: "true | false", description: "Right-aligns the combobox/select listbox." },
      dropSize: { values: "auto | sm | md | lg", description: "Width preset for the dropdown listbox." },
      dropTheme: { values: "'' | light | dark", description: "Overrides dropdown listbox theme." },
      notifyCount: { values: "Number", description: "Numeric badge count inside the input header/adornment." },
      notifyTip: { values: "String", description: "Tooltip for the notify badge." },
      notifyLabel: { values: "String", description: "Text label inside the notify badge." },
      notifyIcon: { values: "JsIcon name", description: "Icon inside the notify badge." },
      notifyUnits: { values: "String", description: "Unit noun used for pluralized badge tooltips." },
      notifyColor: { values: "orange | red | green | blue | grey | light", description: "Badge color preset." },
      searchableProperties: { values: "Array<String>", description: "Item properties searched when typing in autocomplete mode." },
    },
    emitDocs: {
      "update:modelValue": { payload: "String | Number", description: "Emitted on input or option selection." },
      change: { payload: "Event | value", description: "Emitted when control value commits." },
      select: { payload: "item", description: "Emitted when an autocomplete or select option is chosen." },
      focus: { payload: "FocusEvent", description: "Forwarded native focus event." },
      blur: { payload: "FocusEvent", description: "Forwarded native blur event." },
    },
    slots: [
      { name: "icon", scope: "—", description: "Custom leading SVG/icon inside the input." },
      { name: "prefix", scope: "—", description: "Inline prefix text or adornment before the input." },
      { name: "suffix", scope: "—", description: "Inline suffix text or unit after the input." },
      { name: "action", scope: "—", description: "Trailing interactive button or icon slot." },
    ],
  },
  {
    slug: "js-input-checkbox",
    name: "JsInputCheckbox",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    icon: "check-circle",
    summary: "Semantic fieldset/legend checkbox group or single boolean toggle with responsive layouts.",
    description:
      "JsInputCheckbox supports both multi-select array groups (wrapped in semantic <fieldset> + <legend> with responsive column layouts) and single boolean checkboxes when `items` is empty. Includes markdown labels, hints, role='alert' validation errors, and dark theme.",
    accessibilityNotes: [
      "Multi-option mode wraps checkboxes in semantic `<fieldset>` and `<legend>`.",
      "Single boolean mode renders a properly labeled `<input type='checkbox'>` with `aria-invalid` and `aria-describedby`.",
      "Multi-column layouts collapse gracefully to 1 column on narrow screens.",
    ],
    component: markRaw(JsInputCheckbox),
    demoComponent: markRaw(DemoJsInputCheckbox),
    importSnippet: `import { JsInputCheckbox } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsInputCheckbox
  v-model="selected"
  label="Capabilities"
  layout="cols-2"
  :items="[
    { label: 'WCAG AA', value: 'a11y' },
    { label: 'Vanilla CSS', value: 'css' },
  ]"
/>`,
    propDocs: {
      uid: { values: "Number | String", description: "Optional seed for deterministic DOM IDs." },
      modelValue: { values: "Array | Boolean", description: "Selected values array (group mode) or boolean (single checkbox mode)." },
      items: { values: "Array<{ label, value, disabled? }>", description: "Checkbox options. Leave empty for single boolean checkbox mode." },
      id: { values: "String", description: "Explicit base ID for the control." },
      label: { values: "String", description: "Group legend or single checkbox label." },
      icon: { values: "JsIcon name", description: "Leading icon next to the legend/label." },
      iconColor: { values: "CSS color", description: "Color of the leading icon." },
      hint: { values: "String", description: "Helper text linked via aria-describedby." },
      tip: { values: "String", description: "Tooltip text on the legend/label." },
      invalid: { values: "true | false", description: "Marks the control invalid (aria-invalid='true')." },
      error: { values: "String", description: "Validation error message rendered in role='alert'." },
      errorIcon: { values: "JsIcon name", description: "Icon shown next to the error message." },
      size: { values: "xs | sm | md | lg | xl", description: "Typography and checkbox sizing scale." },
      notifyCount: { values: "Number", description: "Badge count next to the group label." },
      notifyTip: { values: "String", description: "Badge tooltip text." },
      notifyLabel: { values: "String", description: "Badge text label." },
      notifyIcon: { values: "JsIcon name", description: "Badge icon." },
      notifyUnits: { values: "String", description: "Unit noun for pluralized badge tooltips." },
      notifyColor: { values: "orange | red | green | blue | grey | light", description: "Badge color preset." },
      disabled: { values: "true | false", description: "Disables all checkboxes in the group." },
      labelWrap: { values: "true | false", description: "Allows option labels to wrap across lines." },
      layout: { values: "cols-auto | cols-1..cols-5 | rows | spaced | centered", description: "Responsive grid or row arrangement for options." },
      theme: { values: "light | dark", description: "Light or dark theme styling." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in labels and hints." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Array | Boolean", description: "Emitted whenever a checkbox state changes." },
      change: { payload: "Array | Boolean", description: "Emitted alongside v-model updates." },
    },
    slots: [
      { name: "icon", scope: "—", description: "Custom leading SVG/icon beside the group legend." },
    ],
  },
  {
    slug: "js-input-radio",
    name: "JsInputRadio",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    icon: "check",
    summary: "Semantic fieldset/legend radio group and accessible color swatch dot picker.",
    description:
      "JsInputRadio renders mutually exclusive options inside a semantic <fieldset>/<legend>, supporting both standard radio lists and visual color/image swatch `dots` mode with screen-reader-only labels.",
    accessibilityNotes: [
      "Uses native `<input type='radio'>` inside `<fieldset>`/`<legend>` for full ArrowUp/ArrowDown/Left/Right keyboard support.",
      "Color swatch `dots` mode preserves accessible text labels via `.js-sr-only`.",
      "Displays validation errors in `role='alert'` and links hints via `aria-describedby`.",
    ],
    component: markRaw(JsInputRadio),
    demoComponent: markRaw(DemoJsInputRadio),
    importSnippet: `import { JsInputRadio } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsInputRadio
  v-model="color"
  label="Accent Color"
  :dots="true"
  :items="[
    { label: 'Ocean Blue', value: '#1d6f90', color: '#1d6f90' },
    { label: 'Forest Green', value: '#1e7e34', color: '#1e7e34' },
  ]"
/>`,
    propDocs: {
      uid: { values: "Number | String", description: "Optional seed for deterministic radio group IDs and names." },
      modelValue: { values: "String | Number | Boolean", description: "Currently selected option value." },
      name: { values: "String", description: "Explicit HTML name attribute shared by radio inputs." },
      dots: { values: "true | false", description: "Enables circular color/swatch picker mode with .js-sr-only labels." },
      items: { values: "Array<{ label, value, color?, disabled? }>", description: "Radio option definitions." },
      id: { values: "String", description: "Explicit base ID for the fieldset/group." },
      label: { values: "String", description: "Accessible <legend> label text." },
      hint: { values: "String", description: "Helper text linked via aria-describedby." },
      tip: { values: "String", description: "Tooltip text on the group legend." },
      invalid: { values: "true | false", description: "Marks the radio group invalid." },
      error: { values: "String", description: "Validation error message rendered in role='alert'." },
      errorIcon: { values: "JsIcon name", description: "Icon shown beside the error message." },
      size: { values: "xs | sm | md | lg | xl", description: "Typography and swatch dot sizing scale." },
      disabled: { values: "true | false", description: "Disables all radio options in the group." },
      labelWrap: { values: "true | false", description: "Allows radio labels to wrap across lines." },
      theme: { values: "light | dark", description: "Light or dark surface theme." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in labels and hints." },
    },
    emitDocs: {
      "update:modelValue": { payload: "String | Number | Boolean", description: "Emitted when a radio option is selected." },
      change: { payload: "String | Number | Boolean", description: "Emitted alongside v-model updates." },
    },
    slots: [],
  },
  {
    slug: "js-form",
    name: "JsForm",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    icon: "list-ul",
    summary: "Schema-driven single or multi-step wizard with validation summary, conditional fields, and alerts.",
    description:
      "JsForm builds complete single- or multi-step forms from a reactive schema object (`{ steps, items, buttons }`). It integrates JsInput, JsInputCheckbox, JsInputRadio, JsAlert status/inline notices, clickable error summary links, 12-column responsive CSS grid spans, conditional show/hide rules, and reset/step navigation.",
    accessibilityNotes: [
      "Step indicators expose `aria-current='step'` and screen-reader step status.",
      "Validation errors focus an accessible JsAlert summary with clickable links that jump straight to each invalid field.",
      "12-column field spans collapse gracefully to full-width stacks on mobile viewports.",
    ],
    component: markRaw(JsForm),
    demoComponent: markRaw(DemoJsForm),
    importSnippet: `import { JsForm } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsForm
  v-model="formSchema"
  submit-button-label="Create Project"
  @submit="handleSubmit"
/>`,
    propDocs: {
      modelValue: { values: "{ steps?: Array, items: Array, buttons?: Object }", description: "Form schema and reactive field values bound via v-model." },
      buttonsSticky: { values: "true | false", description: "Pins the form action bar to the bottom of the viewport while scrolling." },
      size: { values: "xs | sm | md | lg | xl", description: "Default control size passed to child form fields." },
      submitButtonLabel: { values: "String", description: "Label for the final submit button." },
      nextButtonLabel: { values: "String", description: "Label for the multi-step Next button." },
      backButtonLabel: { values: "String", description: "Label for the multi-step Back button." },
      resetButtonLabel: { values: "String", description: "Label for the Reset button." },
      resetButton: { values: "true | false", description: "Shows or hides the Reset button." },
      resetOnSubmit: { values: "true | false", description: "Automatically resets fields back to initial values after submit." },
      novalidate: { values: "true | false", description: "Sets HTML novalidate on the <form> element." },
      theme: { values: "light | dark", description: "Light or dark theme forwarded to fields and alerts." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in labels, hints, section headers, and alerts." },
      status: { values: "{ type, title, message, dismissible?, variant?, icon? } | null", description: "Optional top-level JsAlert status banner." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Object", description: "Emitted when field values change." },
      submit: { payload: "Array<{ name, value }>", description: "Emitted with visible named field values when validation passes." },
      reset: { payload: "—", description: "Emitted when the form is reset." },
      "step-change": { payload: "stepIndex: Number", description: "Emitted when moving between wizard steps." },
      change: { payload: "{ item, index, value }", description: "Emitted when any individual field updates." },
      "dismiss-status": { payload: "—", description: "Emitted when the top status JsAlert banner is dismissed." },
    },
    slots: [],
    extraTables: [
      {
        id: "form-schema",
        label: "Schema Item Keys",
        caption: "Supported properties on items[] entries inside JsForm modelValue",
        rows: [
          ["Key", "Type", "Description"],
          ["**name / type / label / value**", "String / Any", "Field key, input type ('text', 'email', 'select', 'textarea', 'checkbox', 'radio', 'alert', 'custom'), label, and value."],
          ["**span**", "String (e.g. '1 / 7')", "CSS grid column span on a 12-column track (collapses cleanly on mobile)."],
          ["**optional / validation**", "Boolean / Array", "Marks field optional or supplies validation rules (e.g. [{ min: 3 }])."],
          ["**actions**", "Array<{ name, action: 'show'|'hide', value }>", "Conditionally shows or hides another field when value matches."],
          ["**hide / header / component**", "Boolean / Object", "Hides fields, renders a section header, or mounts a custom Vue component."],
        ],
      },
    ],
  },
];
