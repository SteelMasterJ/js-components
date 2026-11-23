# `js-components` Future Component Roadmap (Phases 2 & 3)

This document captures candidate components and architectural improvements identified during the post-`v0.1.0` component audit, after completing **Phase 1** (`JsAlert`, `JsForm` alert integration, and `JsToast` + `toast` helper).

## Confirmed Design Principles

- **`JsNavItem` remains the sole button/link primitive**: Do not add a separate `JsButton` component that duplicates `JsNavItem` button behavior.
- **Options API + Pure Vanilla Scoped CSS**: All future components must use Vue 3 Options API, explicit `emits`, `--js-*` tokens from `src/styles/tokens.css`, WCAG 2.1 AA compliance, and zero external CSS/icon dependencies.

---

## Phase 2: High-Priority Core Components

| Component | Target File | Purpose & Scope |
| :--- | :--- | :--- |
| **`JsAccordion`** | `src/components/Accordion.vue` | Vertical collapsible disclosure panels (`v-model`, single or `multiple` open, `<button aria-expanded aria-controls>`, configurable `headingLevel`, `ArrowUp`/`ArrowDown`/`Home`/`End` keyboard navigation, light/dark themes). |
| **`JsSwitch`** | `src/components/Switch.vue` | Dedicated binary toggle (`role="switch"`, `aria-checked`, `v-model`, label/hint/error, sizes `xs`–`xl`, light/dark) + `type: "switch"` integration in `JsForm`. |
| **`JsPagination`** | `src/components/Pagination.vue` | Companion for `JsTable` and `JsPanelNav`. Semantic `<nav aria-label="Pagination">`, Previous/Next, smart ellipsis page list, `aria-current="page"`, optional page-size selector, and range summary. |
| **`JsProgress`** | `src/components/Progress.vue` | Determinate (`0–100`) and indeterminate progress bar (`role="progressbar"`, `aria-valuenow`/`min`/`max`/`valuetext`), semantic variants (`primary`/`info`/`success`/`warning`/`danger`), sizes, and optional label/percentage. |
| **`JsSkeleton`** | `src/components/Skeleton.vue` | Lightweight loading placeholders (`text`, multi-line `lines`, `circle`, `rect`, `card`) respecting `prefers-reduced-motion` and `aria-hidden="true"` / `aria-busy` containers. |
| **`JsBadge`** | `src/components/Badge.vue` | Standalone status pill and removable filter chip (`neutral`/`info`/`success`/`warning`/`danger`/`purple`/`orange`, `soft`/`solid`/`outline`, optional status dot and `removable` close button), decoupling `.js-tag` styles from `JsMarkdown` and `JsNavItemNotify`. |

---

## Phase 3: Secondary Overlays & App Polish

| Component | Target File | Purpose & Scope |
| :--- | :--- | :--- |
| **`JsDrawer`** | `src/components/Drawer.vue` | Slide-over panel (`left`/`right`/`top`/`bottom`, sizes `sm`/`md`/`lg`/`full`) for mobile navigation, detail views, and filter sidebars. Extract a shared `src/utils/focusTrap.js` from `Modal.vue` so `JsModal` and `JsDrawer` share focus trapping, scroll locking, and Escape handling. |
| **`JsTooltip`** | `src/components/Tooltip.vue` | WCAG 1.4.13–compliant tooltip (`role="tooltip"`, `aria-describedby`, triggers on both hover and keyboard focus, dismissible via `Escape`, viewport-aware placement reusing `src/utils/position.js`). |
| **`JsEmptyState`** | `src/components/EmptyState.vue` | Standardized empty/zero-results/error state (icon/illustration slot, configurable `headingLevel`, description, action slot) designed for `JsPanelNav`'s `#empty` slot, `JsTable`, and `JsPanel`. |
| **`JsFileUpload`** | `src/components/FileUpload.vue` | Accessible drag-and-drop + native file picker zone with `accept`, `multiple`, `maxSize` validation, selected file list with remove controls, and `JsAlert` error feedback (also wireable as `type: "file"` in `JsForm`). |
