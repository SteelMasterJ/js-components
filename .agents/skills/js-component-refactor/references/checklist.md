# Per-Component Refactor Verification Checklist

Run through every item below before marking a component complete:

## 1. Vue 3 & Hygiene
- [ ] `name` starts with `Js` (e.g., `JsInput`, `JsModal`)
- [ ] Options API with explicit `emits: [...]`
- [ ] Vue 3 `v-model` (`modelValue` + `update:modelValue`) where applicable
- [ ] No `this._uid`, `this.$set`, `destroyed`, `beforeDestroy`, `::deep()`, or Vue 2 async syntax
- [ ] All array/object prop defaults use factory functions
- [ ] No prop mutations, no `console.log`, no leftover debug UI
- [ ] All DOM listeners / `ResizeObserver`s attached in `mounted()` and cleaned up in `unmounted()`
- [ ] Zero `vue-router` hard dependency (works when `$router` is absent)

## 2. Semantic HTML & Accessibility (WCAG 2.1 AA)
- [ ] Native semantic elements used (`<button>`, `<a>`, `<nav>`, `<ol>`/`<ul>`, `<fieldset>`/`<legend>`, `<hr>`, `<table>`/`<caption>`/`<th scope>`, `<header>`/`<footer>`/`<section>`)
- [ ] No `tabindex > 0` and no redundant `tabindex="0"` on native focusables
- [ ] Visible `:focus-visible` outline on every interactive element
- [ ] Keyboard navigation works (Escape closes modals/dropdowns; Arrows/Home/End navigate tabs)
- [ ] Form fields associate `<label :for>` with control `:id`, plus `aria-invalid` and `aria-describedby` for visible error/hint text
- [ ] External `target="_blank"` links include `rel="noopener noreferrer"`
- [ ] Decorative icons have `aria-hidden="true"`; no hardcoded `alt="thumb"`
- [ ] Color contrast >= 4.5:1 using `--js-*` tokens

## 3. Portability, Lightweight Footprint & Vanilla CSS
- [ ] Pure vanilla `<style scoped>` (no `lang="scss"`, no `!important`, no global resets)
- [ ] All custom classes prefixed with `.js-`
- [ ] Zero FontAwesome classes required; supports built-in `JsIcon` names + `#icon` slots for consumer SVGs
- [ ] Responsive down to 320px viewport without horizontal overflow
- [ ] `$attrs` forwarded on form input wrappers (`inheritAttrs: false`)
- [ ] Exported in `src/index.js`, showcased in `playground/App.vue`, and covered by `npm test`
