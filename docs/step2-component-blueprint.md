# Component Architecture & Reference Blueprint (22 Components)

This blueprint documents all 22 refactored Vue 3 Options API components in `src/components/`, useful both as an architectural record and as the source of truth when authoring the `README.md` component API reference in Step 3.

---

## Cross-Cutting Library Principles

1. **Semantic HTML First**: Native `<button>`, `<a>`, `<nav>`, `<ol>`/`<ul>`, `<fieldset>`/`<legend>`, `<hr>`, `<output>`, `<header>`, `<footer>`, `<section>`, `<table>`/`<caption>`/`<th scope>`.
2. **Configurable Heading Levels (`headingLevel`)**: Landmarks (`JsPanel`, `JsTitleBar`) accept `headingLevel` (`1`–`6`) to fit any host app heading hierarchy.
3. **Zero Icon Lock-In**: Built-in chrome SVGs live in `JsIcon` (`src/components/Icon.vue` + `src/utils/icons.js`), while icon slots (`#icon`, `#action`, `#notify-icon`, etc.) let host apps drop in and style raw `<svg>` elements directly.
4. **Native Attribute Forwarding (`$attrs`)**: `JsInput` uses `inheritAttrs: false` and forwards `$attrs` directly onto the underlying control (`maxlength`, `autocomplete`, `required`, `pattern`, `data-*`, etc.).
5. **SSR & Optional Router Safe**: All DOM listeners / `ResizeObserver`s are SSR-guarded and cleaned up in `unmounted()`; `vue-router` is optional via `src/utils/router.js`.
6. **Pure Vanilla Scoped CSS**: Zero Sass, zero `!important`, zero global resets; all styles consume `--js-*` custom properties from `src/styles/tokens.css`.

---

## Component Catalog (Exported from `src/index.js`)

### Foundation
| Export | File | Summary |
| :--- | :--- | :--- |
| `JsIcon` | `src/components/Icon.vue` | Inline SVG icon primitive supporting built-in chrome icons (`name`, `size`, `color`, `spin`, `label`) plus default slot for consumer raw SVGs. |

### Batch 2A — Core Leaf Components & `JsNavItem`
| Export | File | Summary |
| :--- | :--- | :--- |
| `JsMarkdown` | `src/components/Markdown.vue` | XSS-safe inline rich text (`escapeHtml`, `isSafeUrl`), `<strong>`/`<em>`, `_blank` links with `rel="noopener noreferrer"`, and WCAG AA colored tags (`bl[...]`, `gn[...]`, `rd[...]`, etc.). |
| `JsModal` | `src/components/Modal.vue` | `<Teleport to="body">` accessible dialog (`role="dialog"`, `aria-modal="true"`, focus trap, focus restoration, Escape/backdrop options, scroll lock, sizes `sm`/`md`/`lg`/`full`, `#header`/`#default`/`#footer` slots + dynamic `:component`). |
| `JsTabs` | `src/components/Tabs.vue` | WAI-ARIA `tablist`/`tab`/`tabpanel` with `v-model`, roving `tabindex`, `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard nav, unlimited tabs, light/dark themes, and `#tab-*` / `#panel` slots. |
| `JsNavItemActions` | `src/components/NavItem/NavItemActions.vue` | Trailing action icons (`caret-down`, `caret-right`, `check`, `external`, `spinner`, `ellipsis-vertical`) + `#action` slot. |
| `JsNavItemIcon` | `src/components/NavItem/NavItemIcon.vue` | Leading icon/thumbnail renderer using `JsIcon`, accessible image `alt`, and `#icon` slot. |
| `JsNavItemLabels` | `src/components/NavItem/NavItemLabels.vue` | Main label + optional `subLabel` with guarded `JsMarkdown` parsing. |
| `JsNavItemNotify` | `src/components/NavItem/NavItemNotify.vue` | Accessible count/status pill badge (`pluralize`, optical centering with `proportional-nums`, `#notify-icon` slot). |
| `JsNavItemTags` | `src/components/NavItem/NavItemTags.vue` | Floating/inline tag pills powered by `JsMarkdown`. |
| `JsNavItem` | `src/components/NavItem.vue` | Primary interactive button/link/dropdown orchestrator composing all 5 `NavItem/*` primitives. Supports `link` (RouterLink fallback), `linkExt` (external `_blank` + `noopener noreferrer` + external icon), `items` dropdowns with viewport flip (`computeDropdownPlacement`), nested flyouts, `tabs` dropdowns, `itemRole` for Axe-clean menus, sizes (`xs`–`xxl`), shapes (`circle`, `thumb`, `inset`, `block`), and light/dark/semantic themes. |

### Batch 2B — Interactive Navigation & Dropdown System
| Export | File | Summary |
| :--- | :--- | :--- |
| `JsPanelNavItem` | `src/components/PanelNavItem.vue` | Slim wrapper delegating to `JsNavItem` with panel-friendly defaults and `dropRight` / slot pass-through. |
| `JsBtnSplit` | `src/components/BtnSplit.vue` | Accessible split/segmented button group (`role="group"`) composing `JsNavItem` with scoped direct-child corner flattening so dropdown items retain full pill radii. |
| `JsNavList` | `src/components/NavList.vue` | Vertical/horizontal/grid navigation list supporting headers, `<hr>` dividers, nested dropdowns, split buttons, dynamic components, scrolling, and conditional `role="menu"` (omitted when mixed widgets are present for Axe compliance). |
| `JsDrop` | `src/components/Drop.vue` | Standalone panel or triggered popover dropdown (`v-model`, `#trigger` / `#default` slots, `JsTabs` tabbed menus, dynamic `:component`, Escape/outside-click close, viewport-aware flip). |

### Batch 2C — Layout, Panels & Data Display
| Export | File | Summary |
| :--- | :--- | :--- |
| `JsPanel` | `src/components/Panel.vue` | Semantic container (`as`, configurable `headingLevel`), hero background image with hover zoom (`scale(1.08)`), scrollable region accessibility (`tabindex="0"`, `role="region"`, `aria-label`), scroll-nudge buttons, `ResizeObserver` + `provide('refreshScrollHints')`, footer/caption links, and `#icon` / `#header` / `#footer` slots. |
| `JsPanelNav` | `src/components/PanelNav.vue` | Searchable, groupable navigation panel with `<input type="search">`, `<output aria-live="polite">` match count, list/thumb view switcher, item limit / Load All toggle, and responsive multi-column grids. |
| `JsTitleBar` | `src/components/TitleBar.vue` | Semantic `<header>` with `<nav aria-label="Breadcrumb"><ol>`, configurable `headingLevel`, subtitle/description, action buttons, optional status banner, and `#icon` / `#banner-icon` slots. |
| `JsTable` | `src/components/Table.vue` | Semantic `<table>` with `<caption>`, `<th scope="col|row">`, keyboard-focusable scrollable region wrapper, sticky left column, striped/hover/v-lines/compact/dark themes, interactive cell buttons/links, and `#cell` scoped slot. |

### Batch 2D — Form Controls & Multi-Step Form
| Export | File | Summary |
| :--- | :--- | :--- |
| `JsInput` | `src/components/Input.vue` | Text, email, number, textarea, autocomplete combobox, and custom-styled WAI-ARIA Select-Only Combobox (`type="select"`) sharing the `.js-input__drop` surface, viewport-aware placement, and dark theme inheritance. Includes `$attrs` forwarding, floating label mode (`labelPlaceholder`) keeping icons/adornments vertically centered on the text line, `#icon`/`#prefix`/`#suffix`/`#action` slots, notify badge, and visible `role="alert"` errors via `aria-describedby`. |
| `JsInputCheckbox` | `src/components/InputCheckbox.vue` | Semantic `<fieldset>`/`<legend>` multi-checkbox group with responsive column grids plus single boolean checkbox mode, markdown labels, disabled options, `role="alert"` errors, and dark theme. |
| `JsInputRadio` | `src/components/InputRadio.vue` | Semantic `<fieldset>`/`<legend>` radio group plus accessible color/image swatch `dots` mode with `.js-sr-only` labels and `:focus-visible` rings. |
| `JsForm` | `src/components/Form.vue` | Multi-step and single-step wizard with `<ol aria-label="Form steps">` (`aria-current="step"`), clickable `role="alert"` validation error summary links focusing invalid fields, conditional `show`/`hide` field actions, responsive 12-column grid, reset, and clean payload submission. |
