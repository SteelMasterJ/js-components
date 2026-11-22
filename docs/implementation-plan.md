# `js-components` Modernization & Refactor Plan

This document tracks the full 3-step plan to modernize the forked Vue 2 ExploreLearning component library into **`js-components`** — a lightweight, WCAG 2.1 AA accessible, responsive, Vue 3–compliant component library (preserving Options API) ready to publish and import as an npm package.

---

## Overall Progress Snapshot

| Step | Scope | Status |
| :--- | :--- | :--- |
| **Step 1** | Audit & Standardize Architecture (tokens, utilities, `JsIcon`, Vite lib config, playground, cleanup of `ELLogo` / deprecated files) | **Complete** |
| **Step 2A** | Core Leaf Components + `JsNavItem` (`JsMarkdown`, `JsModal`, `JsTabs`, 5 `NavItem/*` primitives, `JsNavItem`) | **Complete** |
| **Step 2B** | Interactive Navigation & Dropdown System (`JsPanelNavItem`, `JsBtnSplit`, `JsNavList`, `JsDrop`) | **Complete** |
| **Step 2C** | Layout, Panels & Data Display (`JsPanel`, `JsPanelNav`, `JsTitleBar`, `JsTable`) | **Complete** |
| **Step 2D** | Form Controls & Multi-Step Form (`JsInput`, `JsInputCheckbox`, `JsInputRadio`, `JsForm`) | **Complete** |
| **Step 3** | Configure npm Package, Exports, Consumer Smoke Tests, `LICENSE`, `README.md`, & Publish Readiness | **Complete (Ready for `v0.1.0` Publish)** |

---

## Confirmed Architectural Decisions & Conventions

1. **Naming Convention**:
   - **Filenames**: `EL` prefix removed (e.g., `src/components/Input.vue`, `Form.vue`, `Table.vue`, `Panel.vue`, `Modal.vue`, `Tabs.vue`, `Markdown.vue`).
   - **Component `name` & Exports**: `Js` prefix on all 22 component names and exports (`JsInput`, `JsForm`, `JsTable`, `JsNavItem`, etc.) to avoid Vue 3 native HTML tag collisions.
   - **CSS Classes & Tokens**: `.js-*` class prefixes and `--js-*` CSS custom properties in `src/styles/tokens.css`.
2. **Removed Legacy / Domain-Specific Files**:
   - Deleted `src/components/ELLogo.vue`, `src/components/ELPanelThumbs.vue`, `src/components/ELInputTeam.vue`, and `public/favicon.ico`.
   - Zero remaining references to `ExploreLearning`, `ELLogo`, `el-*`, `gizmos`, `reflex`, `frax`, or `science4us`.
3. **Vue 3 Options API Only**:
   - All 22 components use Vue 3 Options API (`name`, `props`, `emits`, `data`, `computed`, `methods`, `mounted`, `unmounted`).
   - Vue 3 `v-model` (`modelValue` + `update:modelValue`) everywhere; no Vue 2 removed APIs (`_uid`, `$set`, `destroyed`, `::deep`, Vue 2 async component factories).
   - SSR-safe (`window` / `document` / `ResizeObserver` guarded and torn down in `unmounted()`).
   - `vue-router` is an optional `peerDependency` detected safely via `src/utils/router.js` (`vm.$?.appContext` without triggering Vue 3 render warnings).
4. **Zero Styling / Icon Lock-In**:
   - Pure vanilla scoped CSS only (no Sass, no Bootstrap, no Tailwind, no `!important`).
   - Built-in minimal inline SVG chrome icons via `JsIcon` (`src/components/Icon.vue` + `src/utils/icons.js`), plus SVG-friendly slots (`#icon`, `#action`, `#notify-icon`, etc.) so host apps can pass and style raw SVGs.
5. **User-Confirmed Feature & UX Refinements Applied During Step 2**:
   - **Unified `linkExt` prop**: Consolidated `linkExtNew` / `linkNew` / `linkExt` into a single `linkExt` property that always opens in `_blank` with `rel="noopener noreferrer"` and renders the `"external"` icon unless `actionIcon: false`.
   - **Viewport-aware dropdown placement**: Shared `computeDropdownPlacement()` in `src/utils/position.js` flips dropdowns above/right automatically in `JsNavItem`, `JsDrop`, and `JsInput`.
   - **`JsBtnSplit` dropdown pill radius**: Direct child selectors prevent split-button corner flattening from leaking into nested dropdown items.
   - **`JsNavItemNotify` badge optical centering**: `proportional-nums` + tuned count-only horizontal padding for crisp centering of single- and multi-digit counts.
   - **`JsPanel` hero image zoom**: Escaped/quoted `url("...")` background image CSS + smooth `scale(1.08)` hover zoom respecting `prefers-reduced-motion`.
   - **Axe Chrome WCAG 2.1 AA fixes**:
     - `aria-required-children` resolved by `itemRole` on `JsNavItem`, inner `<ul role="menu">` with `role="none"` `<li>` wrappers, and omitting `role="menu"` in `JsNavList` when mixed widgets (`split`/`component`) exist.
     - Darkened `--js-color-orange` to `#a64b00` (`--js-color-orange-hover: #823b00`) to exceed 4.5:1 contrast on `#f5f7f9`.
     - `scrollable-region-focusable` resolved on `.js-panel__content` via `:tabindex="isScrollableContainer ? 0 : undefined"`, `role="region"`, `aria-label`, and `:focus-visible` ring.
   - **`JsInput` floating label & custom select dropdown**:
     - Floating label padding lives on `.js-input__box` so `#icon`, text, notify badge, and action icon remain vertically centered together.
     - `type="select"` uses an accessible WAI-ARIA Select-Only Combobox (`<button role="combobox">` + `<div role="listbox">`) styled identically to autocomplete and `JsDrop`/`JsNavItem` dropdowns, anchored via `.js-input__anchor` directly to `.js-input__box`.

---

## Step 1: Audit & Standardize Architecture (Complete)

- Initialized `package.json`, `vite.config.js` (ESM + CJS + `dist/style.css` library mode; dev server rooted at `playground/`), and `.gitignore`.
- Created vanilla CSS foundation:
  - `src/styles/tokens.css`
  - `src/styles/base.css`
  - `src/styles/index.css`
- Created shared utilities:
  - `src/utils/uid.js` (`createUid`)
  - `src/utils/router.js` (`hasRouter`, `resolveLinkTag`)
  - `src/utils/sanitize.js` (`escapeHtml`, `isSafeUrl`)
  - `src/utils/search.js` (`findInObject`, `pluralize`)
  - `src/utils/icons.js` (`BUILTIN_ICONS`, `getBuiltinIconPath`)
  - `src/utils/position.js` (`computeDropdownPlacement`)
- Created `src/components/Icon.vue` (`JsIcon`), `src/index.js`, `playground/` showcase app, and `tests/foundation.test.js`.

---

## Step 2: Batch Refactor Component by Component (Complete)

All **22 components** are refactored, exported in `src/index.js`, showcased in `playground/App.vue` (Sections 1–17, with `JsNavItem` as Section 1), and covered by Vitest tests:

- **Batch 2A** (`tests/batch2a.test.js`): `JsMarkdown`, `JsModal`, `JsTabs`, `JsNavItemActions`, `JsNavItemIcon`, `JsNavItemLabels`, `JsNavItemNotify`, `JsNavItemTags`, `JsNavItem`.
- **Batch 2B** (`tests/batch2b.test.js`): `JsPanelNavItem`, `JsBtnSplit`, `JsNavList`, `JsDrop`.
- **Batch 2C** (`tests/batch2c.test.js`): `JsPanel`, `JsPanelNav`, `JsTitleBar`, `JsTable`.
- **Batch 2D** (`tests/batch2d.test.js`): `JsInput`, `JsInputCheckbox`, `JsInputRadio`, `JsForm`.

**Latest Verified Baseline**:
- `npm test`: **5 test files, 42/42 tests passed**, zero Vue warnings.
- `npm run build`: **654 ms**, zero Vite warnings (`dist/js-components.js` `169.27 kB` / `32.37 kB` gzip; `dist/js-components.cjs` `130.73 kB` / `27.86 kB` gzip; `dist/style.css` `76.06 kB` / `10.33 kB` gzip).

---

## Step 3: Configure the npm Package, Exports & Documentation (Next)

**Goal**: Finalize packaging, verify real consumer imports & tarball contents, document the entire library in `README.md`, and confirm publish readiness for `v0.1.0`.

1. **Package Metadata & License**:
   - Review/finalize `package.json`: verify `main`, `module`, `exports` (`.` and `./style.css`), `files: ["dist", "README.md", "LICENSE"]`, `sideEffects: ["**/*.css"]`, `peerDependencies`, `engines` (e.g. `node >= 18`), and add `"prepublishOnly": "npm test && npm run build"`.
   - Add a root `LICENSE` (MIT) file matching `"license": "MIT"` in `package.json`.
2. **Build, Tree-Shaking & Consumer Smoke Tests**:
   - Verify ESM (`import { JsNavItem, JsInput } from "./dist/js-components.js"`) and CJS (`require("./dist/js-components.cjs")`) consumer imports work cleanly in Node.
   - Run `npm pack --dry-run` and confirm ONLY `dist/`, `README.md`, `LICENSE`, and `package.json` are included (`playground/`, `tests/`, `.agents/`, and `docs/` must NOT appear in the tarball).
   - Run a final repo-wide audit verifying zero remaining references to `ExploreLearning`, `ELLogo`, `EL*`, `el-*`, `fa-`, `lang="scss"`, `!important`, `_uid`, `$set`, `destroyed`, `gizmos`, `reflex`, `frax`, or `science4us` in `src/`.
3. **Comprehensive `README.md`**:
   - Overview & key features (Vue 3 Options API, lightweight, WCAG 2.1 AA, responsive, pure vanilla CSS, zero Sass/FontAwesome/router lock-in).
   - Installation & usage: tree-shakeable named component imports, global plugin registration (`app.use(JsComponents)`), and CSS import (`import "js-components/style.css"`).
   - Theming guide (overriding `--js-*` CSS custom properties, light/dark themes, reduced motion).
   - Custom SVG icons guide (`JsIcon` built-in names + `#icon` / `#action` slots).
   - Complete component reference table covering all **22 components** (export name, key props, emits, slots, and concise code examples).
   - Local development & testing commands (`npm run dev`, `npm test`, `npm run build`).
   - Versioning & publishing guide (`npm version patch|minor|major`, `npm pack --dry-run`, `npm publish`).
4. **Final Verification Checkpoint**:
   - Run `npm test`, `npm run build`, consumer ESM/CJS smoke check, and `npm pack --dry-run`, then present the final publish-readiness summary for user review before tagging/publishing `v0.1.0`.
