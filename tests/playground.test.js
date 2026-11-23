import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createMemoryHistory } from "vue-router";
import JsComponents, * as NamedExports from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";
import { createPlaygroundRouter } from "../playground/router/index.js";
import {
  COMPONENT_CATEGORIES,
  COMPONENT_DOCS,
} from "../playground/data/componentRegistry.js";
import { buildPropRows } from "../playground/utils/inspectProps.js";

const EXPORTED_COMPONENTS = Object.keys(NamedExports).filter(
  (k) => k !== "default" && k !== "toast"
);

describe("Living Documentation Registry & Prop Introspection", () => {
  it("documents every exported library component with unique slugs, categories, and descriptions", () => {
    expect(COMPONENT_DOCS).toHaveLength(EXPORTED_COMPONENTS.length);

    const validCategories = new Set(COMPONENT_CATEGORIES.map((c) => c.id));
    const slugs = new Set();
    const names = new Set();

    for (const doc of COMPONENT_DOCS) {
      expect(doc.slug).toBeTruthy();
      expect(slugs.has(doc.slug)).toBe(false);
      slugs.add(doc.slug);

      expect(EXPORTED_COMPONENTS).toContain(doc.name);
      names.add(doc.name);

      expect(validCategories.has(doc.category)).toBe(true);
      expect(doc.summary.trim().length).toBeGreaterThan(10);
      expect(doc.description.trim().length).toBeGreaterThan(20);
      expect(doc.component).toBeTruthy();
      expect(doc.demoComponent).toBeTruthy();
    }

    expect(names.size).toBe(EXPORTED_COMPONENTS.length);
  });

  it("documents 100% of live Vue Options API props on all 24 components", () => {
    for (const doc of COMPONENT_DOCS) {
      const declaredProps = Object.keys(doc.component.props || {});
      const rows = buildPropRows(doc.component, doc.propDocs);
      // 1 header row + 1 row per declared prop
      expect(rows).toHaveLength(declaredProps.length + 1);

      for (const propName of declaredProps) {
        expect(
          doc.propDocs?.[propName]?.description,
          `${doc.name} prop "${propName}" must have a curated description`
        ).toBeTruthy();
      }
    }
  });
});

describe("Playground Living Docs App, Navbar & Routing", () => {
  let warnSpy;
  let origScrollTo;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    origScrollTo = window.scrollTo;
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    warnSpy.mockRestore();
    window.scrollTo = origScrollTo;
  });

  it("renders landmarks, skip link, desktop category navbar, and mobile component menu", async () => {
    const router = createPlaygroundRouter(createMemoryHistory());
    await router.push("/");
    await router.isReady();

    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents, router],
      },
    });
    await flushPromises();

    expect(wrapper.find('a.skip-link[href="#main-content"]').exists()).toBe(true);
    expect(wrapper.find("header.site-header").exists()).toBe(true);
    expect(wrapper.find('nav[aria-label="Component documentation navigation"]').exists()).toBe(true);
    expect(wrapper.find("main#main-content").exists()).toBe(true);
    expect(wrapper.find("footer.site-footer").exists()).toBe(true);
    expect(wrapper.findAll("h1")).toHaveLength(1);
    expect(wrapper.find("h1").text()).toContain("js-components Playground");

    // Desktop category dropdown opens, renders router-link items, navigates, and closes
    const firstCatBtn = wrapper.find(
      '.site-nav-desktop button[aria-haspopup="menu"]'
    );
    expect(firstCatBtn.exists()).toBe(true);
    await firstCatBtn.trigger("click");
    await flushPromises();

    const modalLink = wrapper.find('.site-nav-desktop a[href="/components/js-modal"]');
    expect(modalLink.exists()).toBe(true);
    await modalLink.trigger("click");
    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe("/components/js-modal");
    });
    await flushPromises();

    expect(firstCatBtn.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find("h1").text()).toContain("JsModal");
    expect(document.title).toContain("JsModal");
    expect(wrapper.find('nav[aria-label="Breadcrumb"] a[href="/"]').exists()).toBe(true);

    // Mobile JsDrop menu opens and displays category tabs
    const mobileTrigger = wrapper.find(
      '.site-nav-mobile button.js-drop__trigger'
    );
    expect(mobileTrigger.exists()).toBe(true);
    await mobileTrigger.trigger("click");
    await flushPromises();

    expect(wrapper.find('.site-nav-mobile [role="tablist"]').exists()).toBe(true);
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("navigates to and renders every one of the 24 component pages with zero Vue warnings", async () => {
    const router = createPlaygroundRouter(createMemoryHistory());
    await router.push("/");
    await router.isReady();

    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents, router],
      },
    });

    for (const doc of COMPONENT_DOCS) {
      await router.push(`/components/${doc.slug}`);
      await flushPromises();

      const h1s = wrapper.findAll("h1");
      expect(h1s, `${doc.name} route should have exactly 1 <h1>`).toHaveLength(1);
      expect(h1s[0].text()).toContain(doc.name);
      expect(document.title).toContain(doc.name);
      expect(wrapper.find('nav[aria-label="Breadcrumb"]').exists()).toBe(true);

      const propsTable = wrapper.find(".js-table");
      expect(propsTable.exists(), `${doc.name} should render props JsTable`).toBe(true);
      const declaredProps = Object.keys(doc.component.props || {});
      if (declaredProps.length > 0) {
        expect(propsTable.text()).toContain(declaredProps[0]);
      }
    }

    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("renders NotFoundView for unknown component slugs", async () => {
    const router = createPlaygroundRouter(createMemoryHistory());
    await router.push("/components/does-not-exist");
    await router.isReady();

    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents, router],
      },
    });
    await flushPromises();

    expect(wrapper.findAll("h1")).toHaveLength(1);
    expect(wrapper.find("h1").text()).toContain("Component Not Found");
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
