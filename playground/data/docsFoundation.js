import { markRaw } from "vue";
import {
  JsAlert,
  JsIcon,
  JsMarkdown,
  JsModal,
  JsTabs,
  JsToast,
} from "@steelmasterj/js-components";
import DemoJsIcon from "../components/demos/DemoJsIcon.vue";
import DemoJsMarkdown from "../components/demos/DemoJsMarkdown.vue";
import DemoJsAlert from "../components/demos/DemoJsAlert.vue";
import DemoJsToast from "../components/demos/DemoJsToast.vue";
import DemoJsModal from "../components/demos/DemoJsModal.vue";
import DemoJsTabs from "../components/demos/DemoJsTabs.vue";

export const foundationDocs = [
  {
    slug: "js-icon",
    name: "JsIcon",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "info-circle",
    summary: "Inline SVG icon primitive with built-in UI chrome and custom SVG slot support.",
    description:
      "JsIcon renders lightweight stroke-based inline SVGs from a 28-icon built-in registry or wraps any custom <svg> passed through its default slot. It automatically inherits currentColor, supports optional spin animation, and switches cleanly between decorative (aria-hidden='true') and meaningful (role='img') modes.",
    accessibilityNotes: [
      "Omit `label` for decorative icons so `aria-hidden='true'` prevents screen-reader noise.",
      "Provide `label` on standalone meaningful icons to expose `role='img'` and `aria-label`.",
      "Spin animation automatically disables when `prefers-reduced-motion: reduce` is active.",
    ],
    component: markRaw(JsIcon),
    demoComponent: markRaw(DemoJsIcon),
    importSnippet: `import { JsIcon } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsIcon name="check-circle" color="#1e7e34" label="Saved" />

<!-- Or pass any custom inline SVG -->
<JsIcon label="Starred" color="#a64b00">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
</JsIcon>`,
    propDocs: {
      name: {
        values: "chevron-*, angle-*, caret-*, close, times, search, check, alert, triangle-exclamation, warning-triangle, info-circle, check-circle, danger-circle, x-circle, bell, external, external-link-square-alt, ellipsis-vertical, spinner, list-ul, table-cells",
        description: "Built-in icon key from BUILTIN_ICONS. Ignored when default slot content is provided.",
      },
      iconClass: {
        values: "CSS class string",
        description: "Optional extra CSS class applied to the outer icon wrapper.",
      },
      color: {
        values: "Any valid CSS color",
        description: "Inline color applied to the icon (inherited by SVG stroke/fill via currentColor).",
      },
      label: {
        values: "Non-empty string",
        description: "Accessible label. Sets role='img' and aria-label; when empty, icon is aria-hidden='true'.",
      },
      spin: {
        values: "true | false",
        description: "Applies a continuous rotation animation (disabled under prefers-reduced-motion).",
      },
    },
    emitDocs: {},
    slots: [
      {
        name: "default",
        scope: "—",
        description: "Custom inline <svg> content to render instead of a built-in icon.",
      },
    ],
  },
  {
    slug: "js-markdown",
    name: "JsMarkdown",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "check",
    summary: "XSS-safe inline rich text formatter with bold, italic, links, and colored pills.",
    description:
      "JsMarkdown parses lightweight inline syntax (**bold**, *bold*, _italic_, markdown links, bare URLs, and color-coded tag pills like gn[Ready] or bl[v3]) into sanitized semantic DOM without innerHTML injection risks. Unsafe protocols such as javascript: are stripped automatically.",
    accessibilityNotes: [
      "Renders semantic <strong>, <em>, and <a rel='noopener noreferrer'> elements.",
      "All 12 built-in tag pill color presets meet WCAG 2.1 AA contrast ratios.",
      "Strips raw HTML tags and blocks javascript:/data: URLs before rendering.",
    ],
    component: markRaw(JsMarkdown),
    demoComponent: markRaw(DemoJsMarkdown),
    importSnippet: `import { JsMarkdown } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsMarkdown
  :parse="true"
  val="**Release v0.2** _is live_ — [Docs](https://vuejs.org) gn[Stable] bl[WCAG AA]"
/>`,
    propDocs: {
      val: {
        values: "String",
        description: "Raw text or inline markdown string to render.",
      },
      parse: {
        values: "true | false | Array<string> | String",
        description: "Enables all tokens (true) or selective token categories (e.g. ['tags'] or 'bold|tags').",
      },
      showTitle: {
        values: "true | false",
        description: "Sets the plain text string as the element's HTML title attribute for hover tooltips.",
      },
      textTestId: {
        values: "String",
        description: "Optional data-test-id attribute applied to the rendered wrapper.",
      },
    },
    emitDocs: {},
    slots: [],
  },
  {
    slug: "js-alert",
    name: "JsAlert",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "info-circle",
    summary: "Semantic inline feedback banner with soft/solid/outline variants and dismiss support.",
    description:
      "JsAlert presents contextual feedback across four semantic states (info, success, warning, danger) in soft, solid, or outline variants and light or dark themes. It supports v-model dismissal, markdown messages, custom icon/title/actions slots, and automatic ARIA live region defaults.",
    accessibilityNotes: [
      "Defaults to `role='alert'` (assertive) for warning/danger and `role='status'` (polite) for info/success.",
      "Distinct built-in SVG icons ensure status is never communicated by color alone.",
      "Dismiss button includes `aria-label` (default 'Dismiss alert') and a >= 44px/36px touch target.",
    ],
    component: markRaw(JsAlert),
    demoComponent: markRaw(DemoJsAlert),
    importSnippet: `import { JsAlert } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsAlert
  v-model="open"
  type="success"
  variant="soft"
  title="Changes Saved"
  message="Your workspace settings have been updated."
  :dismissible="true"
/>`,
    propDocs: {
      modelValue: { values: "true | false", description: "Controls visibility when used with v-model." },
      type: { values: "info | success | warning | danger", description: "Semantic status tone and default icon." },
      variant: { values: "soft | solid | outline", description: "Visual emphasis style." },
      theme: { values: "light | dark", description: "Surface theme for light or dark backgrounds." },
      size: { values: "sm | md", description: "Compact or standard padding and typography scale." },
      title: { values: "String", description: "Bold alert heading text." },
      message: { values: "String", description: "Body copy (supports markdown when parseMarkdown is enabled)." },
      icon: { values: "JsIcon name", description: "Overrides the default status icon." },
      hideIcon: { values: "true | false", description: "Hides the leading icon." },
      dismissible: { values: "true | false", description: "Renders an accessible close button and updates v-model." },
      closeLabel: { values: "String", description: "Accessible aria-label for the dismiss button." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown formatting inside title/message." },
      role: { values: "'' | alert | status | note | region", description: "Overrides the inferred ARIA role." },
      ariaLive: { values: "'' | assertive | polite | off", description: "Overrides the inferred aria-live politeness." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Boolean", description: "Emitted with false when the alert is dismissed." },
      dismiss: { payload: "—", description: "Emitted when the user clicks the dismiss button." },
    },
    slots: [
      { name: "icon", scope: "—", description: "Custom leading SVG/icon element." },
      { name: "title", scope: "—", description: "Custom alert title markup." },
      { name: "default", scope: "—", description: "Custom body content (replaces or extends message)." },
      { name: "actions", scope: "{ dismiss }", description: "Inline action buttons; receives a dismiss() helper." },
      { name: "close-icon", scope: "—", description: "Custom icon inside the dismiss button." },
    ],
  },
  {
    slug: "js-toast",
    name: "JsToast",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "bell",
    summary: "Teleported snackbar/toast notification queue composing JsAlert and the toast helper.",
    description:
      "JsToast renders transient or persistent notifications in six viewport positions. Mount <JsToast /> once in your root layout to drive a global queue via the programmatic `toast` helper, or bind `v-model` for a declarative standalone snackbar.",
    accessibilityNotes: [
      "Auto-dismiss timers pause automatically on hover and keyboard focus.",
      "Pressing Escape dismisses the newest active toast.",
      "Uses `role='region'` with `aria-label` and delegates item semantics to JsAlert.",
    ],
    component: markRaw(JsToast),
    demoComponent: markRaw(DemoJsToast),
    importSnippet: `import { JsToast, toast } from "@steelmasterj/js-components";`,
    usageSnippet: `<!-- Mount once in App.vue -->
<JsToast position="bottom-right" />

<!-- Trigger anywhere -->
toast.success("Saved changes!", { title: "Success" });`,
    propDocs: {
      modelValue: { values: "Boolean | undefined", description: "Enables declarative single-snackbar mode when bound with v-model." },
      items: { values: "Array<Object> | null", description: "Controlled array of toast objects (overrides the global store)." },
      type: { values: "info | success | warning | danger", description: "Default semantic type in declarative mode." },
      title: { values: "String", description: "Toast title in declarative mode." },
      message: { values: "String", description: "Toast message in declarative mode." },
      variant: { values: "soft | solid | outline", description: "Default JsAlert variant." },
      icon: { values: "JsIcon name", description: "Custom icon override in declarative mode." },
      hideIcon: { values: "true | false", description: "Hides the leading icon." },
      actionLabel: { values: "String", description: "Optional inline action button label (e.g. 'Undo')." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown in toast title/message." },
      position: { values: "top-right | top-center | top-left | bottom-right | bottom-center | bottom-left", description: "Viewport corner or edge anchor." },
      duration: { values: "Number (ms)", description: "Auto-dismiss delay in milliseconds; 0 disables auto-dismiss." },
      autoDismiss: { values: "true | false", description: "Enables/disables auto-dismiss countdown." },
      dismissible: { values: "true | false", description: "Shows dismiss button on each toast." },
      pauseOnHover: { values: "true | false", description: "Pauses timers while hovered or focused." },
      showProgress: { values: "true | false", description: "Displays remaining duration indicator bar." },
      maxVisible: { values: "Number", description: "Maximum concurrent visible toasts; excess items queue cleanly." },
      theme: { values: "light | dark", description: "Light or dark toast theme." },
      ariaLabel: { values: "String", description: "Accessible label on the toast region container." },
      closeLabel: { values: "String", description: "Accessible label on each dismiss button." },
      teleportTo: { values: "CSS selector | Element", description: "Teleport target container." },
      disableTeleport: { values: "true | false", description: "Renders inline without <Teleport> (useful in unit tests)." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Boolean", description: "Emitted when declarative snackbar closes." },
      "update:items": { payload: "Array", description: "Emitted when controlled items list changes." },
      dismiss: { payload: "id | item", description: "Emitted when a toast is dismissed." },
      action: { payload: "item", description: "Emitted when the actionLabel button is clicked." },
    },
    slots: [
      { name: "default", scope: "—", description: "Custom body content in declarative snackbar mode." },
      { name: "actions", scope: "{ dismiss }", description: "Custom action controls in declarative mode." },
    ],
    extraTables: [
      {
        id: "toast-helper",
        label: "toast Helper API",
        caption: "Programmatic toast helper methods exported from @steelmasterj/js-components",
        rows: [
          ["Method", "Arguments", "Description"],
          ["**toast.show(opts)**", "Object (message, title, type, duration, actionLabel, onAction, ...)", "Adds a toast to the global queue and returns its ID."],
          ["**toast.info(msg, opts)**", "message: String, options?: Object", "Queues an info toast."],
          ["**toast.success(msg, opts)**", "message: String, options?: Object", "Queues a success toast."],
          ["**toast.warning(msg, opts)**", "message: String, options?: Object", "Queues a warning toast."],
          ["**toast.danger(msg, opts)**", "message: String, options?: Object", "Queues a danger toast."],
          ["**toast.dismiss(id)**", "id: String", "Dismisses a specific toast by ID and promotes queued items."],
          ["**toast.clear()**", "—", "Clears all active and queued toasts."],
        ],
      },
    ],
  },
  {
    slug: "js-modal",
    name: "JsModal",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "table-cells",
    summary: "Teleported WAI-ARIA modal dialog with focus trap, scroll lock, and Escape dismissal.",
    description:
      "JsModal implements an accessible dialog overlay with four size presets (sm, md, lg, full), automatic focus trapping and focus restoration on close, body scroll locking, and support for either slot content or dynamic :component rendering.",
    accessibilityNotes: [
      "Traps Tab / Shift+Tab focus inside the dialog and restores focus to the trigger element on close.",
      "Sets `role='dialog'`, `aria-modal='true'`, and `aria-labelledby` (or `aria-label`).",
      "Supports Escape dismissal and backdrop click dismissal, both individually configurable.",
    ],
    component: markRaw(JsModal),
    demoComponent: markRaw(DemoJsModal),
    importSnippet: `import { JsModal } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsModal v-model="open" title="Confirm Action" size="md">
  <p>Are you sure you want to proceed?</p>
  <template #footer="{ close }">
    <JsNavItem :item="{ label: 'Cancel', button: 'button' }" @click="close" />
  </template>
</JsModal>`,
    propDocs: {
      modelValue: { values: "true | false", description: "Controls open/closed state via v-model." },
      title: { values: "String", description: "Dialog heading text rendered in the header." },
      ariaLabel: { values: "String", description: "Fallback accessible label when title and header slot are omitted." },
      headingLevel: { values: "1 – 6", description: "Semantic heading level (h1–h6) for the dialog title." },
      size: { values: "sm | md | lg | full", description: "Maximum dialog width (or full-viewport)." },
      closeOnBackdrop: { values: "true | false", description: "Closes the dialog when clicking outside the panel." },
      closeOnEsc: { values: "true | false", description: "Closes the dialog when pressing Escape." },
      hideClose: { values: "true | false", description: "Hides the top-right close button." },
      closeLabel: { values: "String", description: "Accessible aria-label for the close button." },
      component: { values: "Component | String | null", description: "Optional dynamic component rendered inside the modal body." },
      componentProps: { values: "Object", description: "Props bound to the dynamic :component." },
      teleportTo: { values: "CSS selector | Element", description: "Teleport target container." },
      disableTeleport: { values: "true | false", description: "Disables <Teleport> when inline mounting is needed." },
    },
    emitDocs: {
      "update:modelValue": { payload: "Boolean", description: "Emitted when open state changes." },
      open: { payload: "—", description: "Emitted after the dialog opens." },
      close: { payload: "—", description: "Emitted when the dialog closes." },
    },
    slots: [
      { name: "header", scope: "{ titleId, close }", description: "Custom header markup replacing the default title." },
      { name: "default", scope: "{ close }", description: "Main dialog body content." },
      { name: "footer", scope: "{ close }", description: "Footer action bar with close() helper." },
      { name: "close-icon", scope: "—", description: "Custom icon inside the close button." },
    ],
  },
  {
    slug: "js-tabs",
    name: "JsTabs",
    category: "foundation",
    categoryLabel: "Foundation & Feedback",
    icon: "table-cells",
    summary: "WAI-ARIA tablist/tab/tabpanel with roving tabindex and Arrow/Home/End keyboard nav.",
    description:
      "JsTabs provides a fully accessible tabbed interface supporting ID-based or index-based v-model, light and dark themes, start/center/stretch alignment, icons, notification badges, disabled tabs, and named or fallback panel slots.",
    accessibilityNotes: [
      "Implements WAI-ARIA `tablist`, `tab`, and `tabpanel` with `aria-selected`, `aria-controls`, and `aria-labelledby`.",
      "Roving `tabindex` with `ArrowLeft`, `ArrowRight`, `Home`, and `End` skips disabled tabs automatically.",
      "Horizontal overflow on narrow 320px viewports scrolls smoothly within the tab bar.",
    ],
    component: markRaw(JsTabs),
    demoComponent: markRaw(DemoJsTabs),
    importSnippet: `import { JsTabs } from "@steelmasterj/js-components";`,
    usageSnippet: `<JsTabs v-model="activeTab" :items="[
  { id: 'overview', label: 'Overview', icon: 'search' },
  { id: 'settings', label: 'Settings', badge: 2 },
]">
  <template #tab-overview>Overview content</template>
  <template #tab-settings>Settings content</template>
</JsTabs>`,
    propDocs: {
      items: { values: "Array<{ id?, label, icon?, badge?, disabled? }>", description: "Tab definitions array." },
      modelValue: { values: "Number | String | null", description: "Active tab id (when item.id exists) or zero-based index." },
      size: { values: "sm | md | lg", description: "Tab button padding and font scale." },
      theme: { values: "light | dark", description: "Light or dark surface palette." },
      align: { values: "start | center | stretch", description: "Tab header alignment across the tablist width." },
      parseMarkdown: { values: "Boolean | String", description: "Enables JsMarkdown formatting inside tab labels." },
      ariaLabel: { values: "String", description: "Accessible label on the role='tablist' container." },
    },
    emitDocs: {
      "update:modelValue": { payload: "String | Number", description: "Emitted with the newly activated tab id or index." },
      change: { payload: "{ value, index, item }", description: "Emitted alongside v-model update on tab selection." },
    },
    slots: [
      { name: "tab-icon", scope: "{ item, index, active }", description: "Custom icon per tab button." },
      { name: "tab-label", scope: "{ item, index, active }", description: "Custom label markup inside each tab button." },
      { name: "tab-<id> / tab<index>", scope: "{ item, index }", description: "Dedicated content slot for a specific tab panel." },
      { name: "panel", scope: "{ item, index }", description: "Fallback scoped slot for any tab without a dedicated slot." },
      { name: "default", scope: "{ item, index }", description: "Final fallback content slot inside the active tabpanel." },
    ],
  },
];
