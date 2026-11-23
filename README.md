# `@steelmasterj/js-components`

A lightweight, WCAG 2.1 AA accessible, responsive **Vue 3** component library built with the **Options API** and pure vanilla CSS.

## Highlights

- **24 production-ready Vue 3 components** covering buttons/navigation, dropdowns, modals, tabs, panels, data tables, feedback alerts/toasts, and multi-step forms.
- **Zero lock-in**: pure vanilla scoped CSS with `--js-*` custom properties (no Sass, Bootstrap, Tailwind, or `!important`), built-in minimal inline SVG chrome icons (no FontAwesome), and optional `vue-router` support.
- **Accessible by default (WCAG 2.1 AA)**: semantic HTML landmarks, keyboard navigation (`Escape`, `Tab` focus traps, roving `tabindex`, arrow keys), ARIA combobox/listbox/dialog/tablist patterns, accessible touch targets, and `prefers-reduced-motion` support.
- **Responsive & SSR-safe**: fluid layouts down to 320px viewports with viewport-aware dropdown flipping and guarded browser listeners (`window`, `document`, `ResizeObserver`).
- **Tree-shakeable ESM + CJS builds**: import only the components you use, or register the full library globally as a Vue plugin.

---

## Installation

```bash
npm install @steelmasterj/js-components
```

### Peer Dependencies

- `vue` `>=3.3.0` (required)
- `vue-router` `>=4.0.0` (optional — link components automatically render `<router-link>` when `vue-router` is installed and fall back cleanly to `<a>` when it is not)

> **Tip — Testing locally in another project:** While developing locally before publishing, you can install directly from a sibling directory:
> ```bash
> npm install ../js-components
> ```

---

## Quick Start

Import the library stylesheet once in your app entry file (`main.js`), then import components as needed.

### Tree-Shakeable Named Imports (Recommended)

```js
// src/main.js
import { createApp } from "vue";
import "@steelmasterj/js-components/style.css";
import App from "./App.vue";

createApp(App).mount("#app");
```

```vue
<template>
  <JsPanel title="Quick Actions" :heading-level="2">
    <JsNavItem
      theme="blue"
      :item="{ label: 'Create Project', icon: 'check', button: 'button' }"
      @click="onCreate"
    />
    <JsInput
      v-model="projectName"
      label="Project Name"
      placeholder="Enter a name"
      hint="Visible to team members."
    />
  </JsPanel>
</template>

<script>
import { JsPanel, JsNavItem, JsInput } from "@steelmasterj/js-components";

export default {
  components: { JsPanel, JsNavItem, JsInput },
  data() {
    return { projectName: "" };
  },
  methods: {
    onCreate() {
      console.log("Creating:", this.projectName);
    },
  },
};
</script>
```

### Global Plugin Registration

If you prefer having all 24 components globally available without per-file imports:

```js
import { createApp } from "vue";
import JsComponents from "@steelmasterj/js-components";
import "@steelmasterj/js-components/style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(JsComponents);
app.mount("#app");
```

---

## Theming with CSS Custom Properties

All components consume `--js-*` design tokens defined in `@steelmasterj/js-components/style.css` (`src/styles/tokens.css`). Override any subset in your own stylesheet after importing the library CSS:

```css
:root {
  /* Brand & surface palette (maintain >= 4.5:1 text contrast for WCAG AA) */
  --js-color-primary: #1d6f90;
  --js-color-primary-hover: #14526b;
  --js-color-primary-soft: #e6f3f8;
  --js-color-primary-text: #ffffff;

  --js-color-surface: #ffffff;
  --js-color-surface-alt: #f5f7f9;
  --js-color-surface-hover: #e9eff4;
  --js-color-surface-dark: #25282c;
  --js-color-surface-dark-hover: #363b42;

  --js-color-text: #1f2933;
  --js-color-text-muted: #52606d;
  --js-color-text-inverse: #ffffff;
  --js-color-text-inverse-muted: #d1d9e0;

  --js-color-border: #d0d7de;
  --js-color-border-strong: #8c959f;

  /* Semantic accents */
  --js-color-info: #1d6f90;
  --js-color-success: #1e7e34;
  --js-color-warning: #f5c518;
  --js-color-orange: #a64b00;
  --js-color-danger: #c5221f;
  --js-color-purple: #7b3896;

  /* Z-index layers */
  --js-z-modal: 1000;
  --js-z-toast: 1100;

  /* Focus ring */
  --js-color-focus: #005fcc;
  --js-focus-ring: 2px solid var(--js-color-focus);
  --js-focus-offset: 2px;

  /* Typography, spacing, radii & motion */
  --js-font-family: inherit;
  --js-radius-sm: 0.25rem;
  --js-radius-md: 0.5rem;
  --js-radius-lg: 0.875rem;
  --js-radius-pill: 9999px;
  --js-transition-fast: 150ms ease;
  --js-transition-base: 220ms ease;
  --js-touch-min: 2.25rem;
}
```

Touch targets automatically expand (`--js-touch-min: 2.75rem`) on `@media (pointer: coarse)`, and transitions disable automatically under `@media (prefers-reduced-motion: reduce)`. Components that support dark surfaces expose a `theme="dark"` or `dark` prop.

---

## Icons & Custom SVGs

`JsIcon` includes a minimal set of stroke-based inline SVG icons for component chrome so the library requires zero external icon packages.

### Built-In `JsIcon` Names

| Category | Names |
| :--- | :--- |
| **Directional** | `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `angle-down`, `angle-up`, `angle-left`, `angle-right`, `caret-down`, `caret-right` |
| **Actions & UI** | `close`, `times`, `search`, `check`, `external`, `external-link-square-alt`, `ellipsis-vertical`, `spinner` |
| **Status & Views** | `alert`, `triangle-exclamation`, `warning-triangle`, `info-circle`, `check-circle`, `danger-circle`, `x-circle`, `bell`, `list-ul`, `table-cells` |

### Passing Custom Raw SVGs

Pass any inline `<svg>` into `JsIcon`'s default slot or into component icon slots (`#icon`, `#action`, `#notify-icon`, `#close-icon`, `#banner-icon`) and style it with standard CSS (`currentColor` is inherited automatically):

```vue
<JsNavItem :item="{ label: 'Starred', button: 'button' }">
  <template #icon>
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  </template>
</JsNavItem>
```

---

## Component Reference (24 Components)

### Foundation & Feedback

| Component | Purpose | Key Props | Emits | Slots |
| :--- | :--- | :--- | :--- | :--- |
| **`JsIcon`** | Inline SVG icon primitive with optional accessible `role="img"` label and spin animation. | `name`, `iconClass`, `color`, `label`, `spin` | — | `default` |
| **`JsMarkdown`** | XSS-safe inline rich text (`**bold**`, `_italic_`, safe `[links](url)`, and WCAG AA tags like `bl[Info]`, `gn[Active]`, `rd[Alert]`, `[Tag]`). | `val`, `parse`, `showTitle`, `textTestId` | — | — |
| **`JsAlert`** | Inline semantic feedback banner (`info`/`success`/`warning`/`danger`) with distinct built-in SVG icons, `soft`/`solid`/`outline` variants, light/dark themes, and optional dismiss button. | `modelValue`, `type`, `variant`, `theme`, `size`, `title`, `message`, `icon`, `hideIcon`, `dismissible`, `closeLabel`, `parseMarkdown`, `role`, `ariaLive` | `update:modelValue`, `dismiss` | `default`, `title`, `icon`, `actions`, `close-icon` |
| **`JsToast`** | Teleported snackbar/toast notification queue composing `JsAlert` with auto-dismiss (pauses on hover/focus), manual dismiss (`duration: 0` or `autoDismiss: false`), Escape key dismissal, and declarative `v-model` or programmatic `toast` helper support. | `modelValue`, `items`, `type`, `title`, `message`, `variant`, `icon`, `hideIcon`, `actionLabel`, `parseMarkdown`, `position`, `duration`, `autoDismiss`, `dismissible`, `pauseOnHover`, `showProgress`, `maxVisible`, `theme`, `ariaLabel`, `closeLabel`, `teleportTo`, `disableTeleport` | `update:modelValue`, `update:items`, `dismiss`, `action` | `default`, `actions` |
| **`JsModal`** | Teleported WAI-ARIA dialog with focus trap, focus restoration, Escape/backdrop dismissal, and body scroll lock. | `modelValue`, `title`, `ariaLabel`, `headingLevel`, `size` (`sm`/`md`/`lg`/`full`), `closeOnBackdrop`, `closeOnEsc`, `hideClose`, `closeLabel`, `component`, `componentProps`, `teleportTo`, `disableTeleport` | `update:modelValue`, `open`, `close` | `default`, `header`, `footer`, `close-icon` |
| **`JsTabs`** | WAI-ARIA `tablist`/`tab`/`tabpanel` with `v-model`, roving `tabindex`, and `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard navigation. | `items`, `modelValue`, `size` (`sm`/`md`/`lg`), `theme` (`light`/`dark`), `align` (`start`/`center`/`stretch`), `parseMarkdown`, `ariaLabel` | `update:modelValue`, `change` | `tab-icon`, `tab-label`, `tab-<id>`, `tab<index>`, `panel` |

> **Programmatic Toasts:** Mount `<JsToast />` once in your root layout, then call `toast.success("Saved!")`, `toast.info(...)`, `toast.warning(...)`, `toast.danger(...)`, `toast.dismiss(id)`, or `toast.clear()` anywhere in your app (imported from `@steelmasterj/js-components`). Pass `duration: 0` for a persistent manual-dismiss snackbar.

### Navigation & Menus

| Component | Purpose | Key Props | Emits | Slots |
| :--- | :--- | :--- | :--- | :--- |
| **`JsNavItem`** | Primary button, internal/external link (`link`, `linkExt`), or viewport-aware dropdown/flyout/tabbed menu trigger. | `item` *(required)*, `size` (`xs`–`xxl`), `active`, `child`, `itemRole`, `disabled`, `block`, `wrap`, `wrapLabel`, `wrapSubLabel`, `inset`, `circle`, `thumb`, `theme`, `parseMarkdown`, `dropRight`, `dropTabs`, `dropTabSelected`, `dropSize`, `dropTheme`, `notifyColor` | `click`, `toggle` | `default`, `tags`, `icon`, `notify-icon`, `action`, `dropdown` |
| **`JsNavItemActions`** | Trailing action icon renderer for `JsNavItem` (external link, spinner, check, chevron, caret, kebab). | `item` *(required)* | — | `default` |
| **`JsNavItemIcon`** | Leading icon, lazy-loaded thumbnail, or numeric badge primitive for `JsNavItem`. | `item` *(required)*, `circle`, `thumb` | — | `default` |
| **`JsNavItemLabels`** | Primary `label` and `subLabel` stack with optional wrapping and guarded `JsMarkdown` parsing. | `item` *(required)*, `parseMarkdown`, `wrap`, `wrapLabel`, `wrapSubLabel` | — | — |
| **`JsNavItemNotify`** | Optically centered count/status pill badge with automatic pluralized tooltips and optional `aria-live="polite"`. | `item` *(required)*, `notifyColor`, `live` | — | `icon` |
| **`JsNavItemTags`** | Renders tag pills from a markdown tag string or an array of tag labels. | `item` *(required)* | — | — |
| **`JsPanelNavItem`** | Panel-friendly `JsNavItem` wrapper adding `dropPos` (`bl`, `br`, `tl`, `tr`, `l`, `r`) convenience mapping. | All `JsNavItem` props + `dropPos` | `click`, `toggle` | `default`, `tags`, `icon`, `notify-icon`, `action`, `dropdown` |
| **`JsBtnSplit`** | Accessible split/segmented button group (`role="group"`) composing `JsNavItem` triggers with connected pill radii. | `items`, `ariaLabel`, `size` (`xs`–`lg`), `grow` (`none`/`first`/`first-hover`/`first-hover-1`/`last`/`all`), `parseMarkdown`, `circle`, `thumb`, `spaced`, `theme`, `dropSize`, `dropTheme`, `dropRight` | `click`, `toggle` | — |
| **`JsNavList`** | Structured menu/list renderer supporting section headers, `<hr>` dividers, nested submenus, split buttons, and dynamic components. | `items`, `size` (`xs`–`xl`), `dropSize`, `parseMarkdown`, `theme` (`light`/`dark`), `menu`, `scrollable`, `ariaLabel` | `select`, `click` | `item` |
| **`JsDrop`** | Standalone panel or triggered popover dropdown with `v-model`, optional tabbed menus, dynamic components, and viewport flip. | `items`, `component`, `componentProps`, `triggerLabel`, `triggerIcon`, `modelValue`, `right`, `tabs`, `tabSelected`, `size` (`auto`/`sm`/`md`/`lg`), `theme` (`light`/`dark`), `parseMarkdown`, `closeOnSelect`, `ariaLabel` | `update:modelValue`, `open`, `close`, `select`, `tab-change` | `default`, `trigger` |

> **External Links Convention:** Pass `linkExt: "https://..."` on any navigation/table/breadcrumb/panel item to automatically open in `_blank` with `rel="noopener noreferrer"` and render the `"external"` icon (set `actionIcon: false` to hide the icon).

### Layout & Data Display

| Component | Purpose | Key Props | Emits | Slots |
| :--- | :--- | :--- | :--- | :--- |
| **`JsPanel`** | Semantic container card (`section`/`article`/`div`/`aside`) with hero background image zoom, keyboard-accessible scroll region with scroll-nudge buttons, primary overlay action, caption, and footer. | `as`, `headingLevel`, `title`, `titleTestId`, `titleDark`, `titleSize`, `aboveNote`, `banner`, `bannerDark`, `notify`, `notifyDark`, `footer`, `icon`, `img`, `imgAlt`, `titleBackgroundTransparent`, `parseMarkdown`, `height` (`sm`/`md`/`lg`/`xl`/`auto`), `scroll`, `compact`, `scrollbars`, `scrollHint`, `backgroundImage`, `backgroundImagePadded`, `backgroundImageCentered`, `backgroundImageShadeTop`, `backgroundImageZoom`, `backgroundColor`, `backgroundImageSize`, `backgroundPositionLeft`, `backgroundPositionRight`, `primaryAction`, `primaryActionHover`, `primaryActionCoverLink`, `caption`, `span` | `action-click` | `default`, `above`, `header`, `icon`, `headerLeft`, `headerRight`, `subActions`, `footer` |
| **`JsPanelNav`** | Searchable, groupable navigation grid/list with live match count (`<output aria-live="polite">`), list/thumb view switcher, and `itemsLimit` Load All toggle. | `ariaLabel`, `menu`, `menuConfig`, `grouped`, `search`, `searchMinCount`, `searchableProperties`, `columns`, `itemUnits`, `items`, `itemsLimit`, `loadAllLabel`, `parseMarkdown`, `groupBy`, `groupLabelsHidden`, `groupLabelsLeft`, `groupLabelShowCount`, `grid`, `layout`, `layoutGap`, `emptySize`, `layoutRight`, `layoutCompact`, `size`, `theme`, `circle`, `thumb`, `splitGrow`, `dropRight`, `dropTabs`, `dropSize`, `dropTheme` | `click`, `select`, `search`, `config-change` | `empty` |
| **`JsTitleBar`** | Semantic page `<header>` with `<nav aria-label="Breadcrumb"><ol>`, configurable heading level, dropdown switcher title, page actions, and optional status banner. | `headingLevel`, `title`, `subTitle`, `label`, `subLabel`, `icon`, `description`, `img`, `imgAlt`, `background`, `buttons`, `bannerLabel`, `bannerButtons`, `bannerBackground`, `bannerBackgroundDark`, `bannerIcon`, `buttonSize`, `parseMarkdown`, `crumbs`, `drop`, `dropTabs`, `dropTabSelected`, `dropSize`, `dropTheme`, `dark` | — | `default`, `icon`, `actions`, `banner-icon` |
| **`JsTable`** | Semantic `<table>` with `<caption>`, `<th scope="col|row">`, keyboard-focusable horizontal scroll region, sticky left/right columns, interactive cells, and dark/striped/hover styles. | `caption`, `ariaLabel`, `rows`, `parseMarkdown`, `padding` (`sm`/`md`/`lg`), `headerRowCount`, `headerColCount`, `colWidths`, `leftColSticky`, `rightColSticky`, `scroll`, `striped`, `hover`, `hLines`, `vLines`, `dark`, `wrapHeaders` | `cell-click` | `header-cell`, `cell` |

### Forms & Inputs

| Component | Purpose | Key Props | Emits | Slots |
| :--- | :--- | :--- | :--- | :--- |
| **`JsInput`** | Unified text, email, number, textarea, autocomplete combobox, and custom WAI-ARIA Select-Only Combobox (`type="select"`) with `$attrs` forwarding, floating labels, adornments, and `role="alert"` errors. | `uid`, `modelValue`, `type`, `step`, `rows`, `items`, `id`, `label`, `labelTop`, `labelPlaceholder`, `placeholder`, `icon`, `iconColor`, `actionIcon`, `img`, `imgAlt`, `imgSize`, `hint`, `tip`, `invalid`, `error`, `errorIcon`, `size` (`xs`–`xl`), `disabled`, `autoFocus`, `labelWrap`, `theme` (`light`/`dark`), `parseMarkdown`, `dropRight`, `dropSize`, `dropTheme`, `notifyCount`, `notifyTip`, `notifyLabel`, `notifyIcon`, `notifyUnits`, `notifyColor`, `searchableProperties` | `update:modelValue`, `change`, `select`, `focus`, `blur` | `icon`, `prefix`, `suffix`, `action` |
| **`JsInputCheckbox`** | Semantic `<fieldset>`/`<legend>` multi-checkbox group with responsive column layouts, or single boolean checkbox when `items` is empty. | `uid`, `modelValue`, `items`, `id`, `label`, `icon`, `iconColor`, `hint`, `tip`, `invalid`, `error`, `errorIcon`, `size` (`xs`–`xl`), `notifyCount`, `notifyTip`, `notifyLabel`, `notifyIcon`, `notifyUnits`, `notifyColor`, `disabled`, `labelWrap`, `layout`, `theme` (`light`/`dark`), `parseMarkdown` | `update:modelValue`, `change` | `icon` |
| **`JsInputRadio`** | Semantic `<fieldset>`/`<legend>` radio group plus accessible color/image swatch `dots` mode with screen-reader labels. | `uid`, `modelValue`, `name`, `dots`, `items`, `id`, `label`, `hint`, `tip`, `invalid`, `error`, `errorIcon`, `size` (`xs`–`xl`), `disabled`, `labelWrap`, `theme` (`light`/`dark`), `parseMarkdown` | `update:modelValue`, `change` | — |
| **`JsForm`** | Single- or multi-step schema-driven wizard with step indicator (`aria-current="step"`), `JsAlert`-powered clickable validation error summary, inline `type: "alert"` notices, `status` banner, conditional `show`/`hide` field actions, 12-column responsive grid, and reset. | `modelValue` (`{ steps, items, buttons }`), `status`, `buttonsSticky`, `size` (`xs`–`xl`), `submitButtonLabel`, `nextButtonLabel`, `backButtonLabel`, `resetButtonLabel`, `resetButton`, `resetOnSubmit`, `novalidate`, `theme` (`light`/`dark`), `parseMarkdown` | `update:modelValue`, `submit`, `reset`, `step-change`, `change`, `dismiss-status` | — |

---

## Local Development & Testing

```bash
# Start interactive component playground (playground/)
npm run dev

# Run full Vitest test suite
npm test

# Build ESM, CJS, and single CSS bundle into dist/
npm run build

# Inspect exact files included in the published npm tarball
npm run pack:check
```

---

## Versioning & Publishing to npm

Publishing public packages to **npmjs.com** is completely free. Because `"publishConfig": { "access": "public" }` and `"prepublishOnly": "npm test && npm run build"` are configured in `package.json`, tests and builds always run automatically before publishing.

### Option A — Manual Publish from Your Terminal

1. Create a free account on [npmjs.com](https://www.npmjs.com/) (if you don't already have one) with username matching the package scope (`steelmasterj`), then log in once:
   ```bash
   npm login
   ```
2. Verify the tarball contents before publishing:
   ```bash
   npm run pack:check
   ```
3. Publish `v0.1.0` (or bump future versions with `npm version patch|minor|major`):
   ```bash
   npm publish --access public
   ```

### Option B — Automated Publish via GitHub Actions (Free for Public Repos)

This repository includes `.github/workflows/publish.yml`, which automatically runs `npm test`, `npm run build`, and `npm publish --provenance --access public` whenever you publish a **GitHub Release** (or trigger the workflow manually from the Actions tab):

1. On [npmjs.com](https://www.npmjs.com/), create a **Granular Access Token** with **Read and write** permission for `@steelmasterj/js-components`.
2. In your GitHub repo go to **Settings → Secrets and variables → Actions → New repository secret**, name it `NPM_TOKEN`, and paste the token.
3. Bump the version (`npm version patch|minor|major`), push commits and tags (`git push --follow-tags`), and create a **GitHub Release** for that tag.

---

## License

[MIT](./LICENSE) © 2026 Joseph Steel
