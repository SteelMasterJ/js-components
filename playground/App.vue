<template>
  <main class="pg-shell">
    <header class="pg-header">
      <h1>js-components</h1>
      <p>Lightweight, WCAG 2.1 AA accessible, responsive Vue 3 component library.</p>
    </header>

    <section class="pg-section" aria-labelledby="icons-heading">
      <h2 id="icons-heading">Step 1 Foundation — Built-in &amp; Slotted SVG Icons</h2>
      <div class="pg-row">
        <span class="pg-chip"><JsIcon name="search" /> search</span>
        <span class="pg-chip"><JsIcon name="chevron-down" /> chevron-down</span>
        <span class="pg-chip"><JsIcon name="check" /> check</span>
        <span class="pg-chip"><JsIcon name="alert" /> alert</span>
        <span class="pg-chip"><JsIcon name="close" /> close</span>
        <span class="pg-chip"><JsIcon name="spinner" spin /> spinner</span>
        <span class="pg-chip">
          <JsIcon label="Custom star">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </JsIcon>
          Custom SVG slot
        </span>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "PlaygroundApp",
};
</script>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  color: var(--js-color-text);
  background: var(--js-color-surface-alt);
  line-height: var(--js-line-height);
}

.pg-shell {
  max-width: 68rem;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}

.pg-header {
  margin-bottom: 2rem;
}

.pg-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.75rem;
}

.pg-header p {
  margin: 0;
  color: var(--js-color-text-muted);
}

.pg-section {
  background: var(--js-color-surface);
  border: 1px solid var(--js-color-border);
  border-radius: var(--js-radius-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.pg-section h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.pg-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.pg-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: var(--js-radius-pill);
  background: var(--js-color-surface-alt);
  border: 1px solid var(--js-color-border);
  font-size: var(--js-font-size-sm);
}
</style>
