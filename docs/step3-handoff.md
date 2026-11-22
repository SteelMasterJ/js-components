# Step 3 Handoff Guide (for `agy` CLI)

This guide contains everything needed to pick up cleanly in **`agy` CLI** and execute **Step 3: Configure the npm Package, Exports & Documentation** for `js-components`.

---

## 1. Where We Are Right Now

- **Steps 1 and 2 (Batches 2A, 2B, 2C, 2D) are 100% complete** and verified.
- All **22 components** in `src/components/` have been refactored, exported in `src/index.js`, showcased in `playground/App.vue` (Sections 1–17), and verified with unit/integration tests and Axe Chrome accessibility checks.
- **Last verified state**:
  - `npm test` → **5 test files, 42/42 tests passing**, zero Vue warnings (`tests/foundation.test.js`, `tests/batch2a.test.js`, `tests/batch2b.test.js`, `tests/batch2c.test.js`, `tests/batch2d.test.js`).
  - `npm run build` → **654 ms**, zero Vite warnings:
    - `dist/js-components.js` (`169.27 kB` / `32.37 kB` gzip)
    - `dist/js-components.cjs` (`130.73 kB` / `27.86 kB` gzip)
    - `dist/style.css` (`76.06 kB` / `10.33 kB` gzip)
- **Git status note**: Changes from Steps 1 & 2 are currently in the working tree (uncommitted); do not commit or push unless the user asks.

### Key Files & Docs to Read First
- `docs/implementation-plan.md` — full 3-step plan, architectural decisions, and Step 3 scope.
- `docs/step2-component-blueprint.md` — summary of all 22 exported components.
- `package.json`, `vite.config.js`, `src/index.js`, `src/styles/tokens.css`, `src/utils/icons.js`.

---

## 2. Installed Workspace Skills

This repository defines a project-scoped skill that MUST be followed whenever creating, editing, or auditing any component in `src/components/`:

| Skill | Path | Purpose |
| :--- | :--- | :--- |
| **`js-component-refactor`** | `.agents/skills/js-component-refactor/SKILL.md` | Enforces Vue 3 Options API compliance, semantic HTML first, zero Sass/FontAwesome/Bootstrap/Tailwind/`!important`, pure vanilla scoped CSS with `--js-*` tokens, SVG-friendly slots, SSR safety, optional `vue-router`, and WCAG 2.1 AA responsiveness. |
| **Per-Component Checklist** | `.agents/skills/js-component-refactor/references/checklist.md` | 3-part verification checklist (Vue 3 hygiene, WCAG 2.1 AA & semantic HTML, portability & vanilla CSS) for any component changes. |

---

## 3. Environment & Hard Constraints

- **OS / Shell**: Windows, Node `v22.18.0`, npm `10.9.3`, PowerShell 5.1 (use `;` instead of `&&` when chaining commands in PowerShell).
- **Hard constraints**:
  - Keep **Vue 3 Options API** across all components; never introduce Composition API `<script setup>` in `src/components/`.
  - Keep **pure vanilla CSS** only (no Sass, Bootstrap, Tailwind, FontAwesome, or `!important`).
  - External links use the consolidated **`linkExt`** property (always opens in `_blank` with `rel="noopener noreferrer"` and renders `"external"` icon unless `actionIcon: false`).
  - Keep `package.json` `"files"` strict (`["dist", "README.md", "LICENSE"]`) so `playground/`, `tests/`, `.agents/`, and `docs/` are **excluded** from the published npm package.
  - Pause at the **Final Checkpoint** after Step 3 so the user can review `README.md`, `package.json`, `npm pack --dry-run`, and test results before tagging/publishing `v0.1.0`.

---

## 4. Exact Step 3 Task Checklist

Execute these tasks in order:

### Task 3.1 — Finalize `package.json` & Add `LICENSE`
- Inspect `package.json` and ensure:
  - `name`: `"js-components"`, `version`: `"0.1.0"`, `type`: `"module"`, `license`: `"MIT"`
  - `main`: `"./dist/js-components.cjs"`, `module`: `"./dist/js-components.js"`
  - `exports`:
    ```json
    {
      ".": {
        "import": "./dist/js-components.js",
        "require": "./dist/js-components.cjs"
      },
      "./style.css": "./dist/style.css"
    }
    ```
  - `files`: `["dist", "README.md", "LICENSE"]`
  - `sideEffects`: `["**/*.css"]`
  - `engines`: `{ "node": ">=18.0.0" }`
  - `scripts`: keep `dev`, `build`, `preview`, `test`, `test:watch`, and add `"prepublishOnly": "npm test && npm run build"` (and optionally `"pack:check": "npm pack --dry-run"`).
- Create root `LICENSE` (standard MIT License).

### Task 3.2 — Build & Consumer Import Smoke Tests
- Run `npm test` and `npm run build`.
- Add or run a consumer import verification verifying BOTH:
  - **ESM** named & default exports from `./dist/js-components.js` (confirming all 22 component names are exported and `default.install` is a function).
  - **CJS** `require("./dist/js-components.cjs")` exports match all 22 components and `default.install`.
  - Confirm `dist/style.css` exists, is non-empty, contains `--js-color-primary`, and contains zero `.el-` or `fa-` selectors.
- You can add a dedicated Vitest test file (e.g. `tests/package.test.js`) so `npm test` continuously guards the built/exported surface as well (note: if testing `dist/`, ensure `build` runs before or guard cleanly; testing `src/index.js` exports + running a Node smoke command against `dist/` keeps `npm test` independent of build order!).

### Task 3.3 — Repo-Wide Hygiene & Tarball Audit
- Audit `src/` for zero remaining legacy patterns:
  - `ExploreLearning`, `ELLogo`, `\bEL[A-Z]`, `\bel-`, `gizmos`, `reflex`, `frax`, `science4us`, `lang="scss"`, `!important`, `fa-solid`, `fa-regular`, `this._uid`, `this.$set`, `destroyed(`, `::deep`.
- Run `npm pack --dry-run` and verify:
  - Tarball includes **only** `package.json`, `README.md`, `LICENSE`, `dist/js-components.js`, `dist/js-components.cjs`, `dist/style.css`.
  - `playground/`, `tests/`, `.agents/`, `docs/`, and `src/` are **excluded**.
  - Record exact tarball size and unpacked size for the final summary.

### Task 3.4 — Write Comprehensive `README.md`
Create a clear, practical, scannable root `README.md` covering:
1. **Overview & Highlights** — Vue 3 Options API, 22 components, lightweight bundle sizes, WCAG 2.1 AA accessible, responsive down to 320px, pure vanilla CSS with `--js-*` tokens, zero FontAwesome/Sass/router lock-in, SSR-safe.
2. **Installation** — `npm install js-components` (noting Vue 3 `>=3.3` peer dependency and optional `vue-router >=4`).
3. **Quick Start** —
   - Tree-shakeable per-component imports (`import { JsNavItem, JsInput } from "js-components"` + `import "js-components/style.css"`).
   - Optional global plugin registration (`app.use(JsComponents)`).
4. **Theming with CSS Custom Properties** — Example `:root` override snippet showing key `--js-*` tokens from `src/styles/tokens.css` (colors, focus ring, radii, spacing, typography, dark surfaces, `prefers-reduced-motion`).
5. **Icons & Custom SVGs** — Listing built-in `JsIcon` names from `src/utils/icons.js` plus an example passing a raw `<svg>` via `#icon` slot.
6. **Component Reference (All 22 Components)** — Organized by category (Foundation, Navigation & Menus, Layout & Data, Forms & Inputs) documenting each component's export name, purpose, key props, emits, and slots (inspect the actual `.vue` files in `src/components/` so every prop/emit/slot name is 100% accurate — never guess).
7. **Local Development & Testing** — `npm run dev` (playground), `npm test`, `npm run build`, `npm pack --dry-run`.
8. **Versioning & Publishing** — Exact commands to version & publish (`npm version patch|minor|major`, `npm pack --dry-run`, `npm publish --access public`).

### Task 3.5 — Final Verification & Checkpoint
- Run `npm test`, `npm run build`, ESM/CJS `dist/` smoke test, and `npm pack --dry-run`.
- Present a concise **Final Checkpoint** summary with:
  - Test results, bundle sizes, `npm pack --dry-run` file list & tarball size
  - Legacy audit confirmation (0 leftovers)
  - Ready-to-run publish steps for `v0.1.0`.

---

## 5. Ready-to-Use `agy` CLI Prompt

Run this from the repository root (`c:\Users\josep\OneDrive\Documents\GitHub\js-components`):

```text
Read docs/step3-handoff.md, docs/implementation-plan.md, and docs/step2-component-blueprint.md, then execute Step 3 (Configure the npm Package, Exports & Documentation) end-to-end. Verify all 22 component APIs directly from src/components/ before writing README.md, finalize package.json and LICENSE, run ESM/CJS dist smoke tests + npm test + npm run build + npm pack --dry-run, and stop at the Final Checkpoint ready for v0.1.0 review (do not run npm publish or git commit).
```
