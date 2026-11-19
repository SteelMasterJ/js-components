---
name: js-component-refactor
description: >-
  Guides refactoring Vue components in the js-components library to be Vue 3 Options API compliant,
  maximally lightweight and portable, semantic-HTML-first, WCAG 2.1 AA accessible, responsive,
  and styled with pure vanilla CSS. Use whenever refactoring, creating, or auditing any component
  in src/components/.
---

# `js-components` Refactoring Skill

Use this runbook whenever refactoring or creating a component in `src/components/`. Every component must be lightweight, portable across any Vue 3 app (SPA or SSR/Nuxt), semantic-HTML-first, WCAG 2.1 AA accessible, responsive, and dependency-free.

## Core Standards

1. **Vue 3 Options API Compliance**
   - Keep Options API (`export default { name: "Js...", props, emits, data, computed, methods }`).
   - Always declare explicit `emits: [...]`.
   - Use Vue 3 `v-model` (`modelValue` + `update:modelValue`) instead of Vue 2 `value` + `input`.
   - Never use removed Vue 2 APIs (`this._uid`, `this.$set`, `destroyed`, `beforeDestroy`, `$listeners`, `$children`, Vue 2 async `() => import(...)`). Use `createUid()` from `src/utils/uid.js`, direct reactive assignment, `unmounted()`, and `defineAsyncComponent()`.
   - Never mutate props directly. Use factory functions `() => [...]` / `() => ({})` for array/object prop defaults.
   - Guard all `window` / `document` access inside `mounted()` / `unmounted()` (SSR/Nuxt-safe) and always tear down listeners/observers in `unmounted()`.

2. **Semantic HTML First (Zero Div-Soup)**
   - Prefer native HTML elements over ARIA emulation:
     - Actions use `<button type="button">` (never `<a href="#">` or `<div @click>`).
     - Navigation uses `<nav>` + `<ol>`/`<ul>` + `<a>` or `<RouterLink>` (via `src/utils/router.js` fallback so `vue-router` stays optional).
     - Checkbox/radio groups use `<fieldset>` + `<legend>`.
     - Tables use `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th scope="col|row">`.
     - Dividers use `<hr>` (never empty `<div>`).
     - Live status/search counts use `<output>` / `aria-live="polite"`; real errors use `role="alert"`.
     - Allow configurable heading levels (`headingLevel` prop) on landmarks (`Panel`, `TitleBar`) so components fit any host app's heading outline.

3. **Maximum Portability & Zero External Dependencies**
   - Zero FontAwesome, zero Bootstrap/Tailwind, zero Sass.
   - Use `JsIcon` (`src/components/Icon.vue`) for built-in UI chrome SVGs, and provide `#icon` / `#action-icon` slots so host apps can pass raw `<svg>` elements and style them directly.
   - Forward native HTML attributes (`$attrs`) to primary form controls (`inheritAttrs: false` on wrappers) so consumers can use native `required`, `pattern`, `inputmode`, `autocomplete`, `data-*`, etc.
   - Never leak global CSS resets or use `!important`. Style strictly with pure vanilla scoped CSS consuming `--js-*` tokens from `src/styles/tokens.css`, prefixed with `.js-*`.

4. **WCAG 2.1 AA & Responsive Baseline**
   - Visible `:focus-visible` indicator (`outline: var(--js-focus-ring); outline-offset: var(--js-focus-offset)`).
   - Full keyboard support (Tab, Enter/Space, Escape for overlays/menus, Arrow keys + Home/End for tabs).
   - Never rely on hover-only tooltips (`data-tip`) for validation errors or essential info — render visible, screen-reader-linked (`aria-describedby`) error text.
   - Decorative icons/SVGs always carry `aria-hidden="true"`; meaningful images require proper `alt` text (never hardcoded `alt="thumb"`).
   - Respect `prefers-reduced-motion: reduce`, use fluid widths (`min(100%, ...)`, `auto-fit`), avoid fixed `min-width` locks that cause mobile horizontal overflow, and ensure touch-friendly target sizes (`--js-touch-min`).

## Component Refactor Workflow

1. **Inspect & Plan**: Read the target component and its children/dependents. Check [references/checklist.md](./references/checklist.md) for the exact per-component verification items.
2. **Refactor Component**:
   - Rewrite `<template>` with semantic HTML, accessible attributes, and SVG-friendly slots.
   - Update `<script>` to clean Vue 3 Options API with `emits`, `createUid()`, optional router fallback, and SSR-safe lifecycle hooks.
   - Rewrite `<style scoped>` in pure vanilla CSS using `--js-*` tokens (remove `lang="scss"`, `darken()`, `!important`, rigid breakpoints).
3. **Export & Demo**:
   - Register and export the component in `src/index.js`.
   - Add an interactive example to `playground/App.vue`.
4. **Verify**:
   - Write/update Vitest + `@vue/test-utils` tests covering rendering, Vue 3 `v-model`/events, keyboard/ARIA semantics, and zero Vue warnings.
   - Run `npm test` and `npm run build` and confirm clean output with minimal bundle delta.
   - Confirm zero remaining `EL*`, `el-*`, `fa-`, or `<style lang="scss">` leftovers in refactored files.
