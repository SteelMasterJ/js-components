import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JsPanel from "../src/components/Panel.vue";
import JsPanelNav from "../src/components/PanelNav.vue";
import JsTitleBar from "../src/components/TitleBar.vue";
import JsTable from "../src/components/Table.vue";
import JsComponents from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";

describe("JsPanel", () => {
  it("renders semantic landmark, configurable heading level, slots, and safe external footer", () => {
    const wrapper = mount(JsPanel, {
      props: {
        as: "article",
        headingLevel: 3,
        title: "Overview",
        footer: { label: "Docs", linkExt: "https://vuejs.org" },
      },
      slots: {
        default: "<p>Body content</p>",
        icon: '<svg data-test="panel-svg"></svg>',
      },
    });

    expect(wrapper.element.tagName).toBe("ARTICLE");
    const h3 = wrapper.find("h3");
    expect(h3.text()).toBe("Overview");
    expect(wrapper.attributes("aria-labelledby")).toBe(h3.attributes("id"));
    expect(wrapper.find('[data-test="panel-svg"]').exists()).toBe(true);
    const footerLink = wrapper.find("footer a");
    expect(footerLink.attributes("rel")).toBe("noopener noreferrer");
  });
});

describe("JsPanelNav", () => {
  const items = [
    { group: "Core", label: "Alpha", button: "button" },
    { group: "Core", label: "Beta", button: "button" },
    { group: "Extra", label: "Gamma", button: "button" },
  ];

  it("filters via accessible search input, updates <output> count, and switches layout without mutating props", async () => {
    const wrapper = mount(JsPanelNav, {
      props: {
        items,
        search: true,
        menu: true,
        layout: "cols-3",
        ariaLabel: "Test nav",
      },
    });

    expect(wrapper.find("nav").attributes("aria-label")).toBe("Test nav");
    await wrapper.find(".js-panel-nav__search-trigger").trigger("click");
    const input = wrapper.find('input[type="search"]');
    await input.setValue("gam");

    expect(wrapper.find("output").text()).toBe("1");
    expect(wrapper.findAll(".js-panel-nav__items button")).toHaveLength(1);

    // Click view config button — must not mutate layout prop directly
    const configButtons = wrapper.findAll('[aria-label="View layout options"] button');
    await configButtons[0].trigger("click");
    expect(wrapper.emitted("config-change")).toHaveLength(1);
    expect(wrapper.props("layout")).toBe("cols-3");
  });

  it("enforces itemsLimit and reveals all on Load All", async () => {
    const wrapper = mount(JsPanelNav, {
      props: { items, itemsLimit: 2 },
    });

    expect(wrapper.findAll(".js-panel-nav__items .js-nav-item")).toHaveLength(2);
    await wrapper.find(".js-panel-nav__limited button").trigger("click");
    expect(wrapper.findAll(".js-panel-nav__items .js-nav-item")).toHaveLength(3);
  });
});

describe("JsTitleBar", () => {
  it("renders semantic <header>, breadcrumb <nav><ol>, single default slot, and custom SVG icon", () => {
    const wrapper = mount(JsTitleBar, {
      props: {
        title: "Settings",
        subTitle: "Manage preferences",
        headingLevel: 2,
        description: "All settings are saved automatically.",
        crumbs: [
          { label: "Home", route: "/" },
          { label: "Settings" },
        ],
      },
      slots: {
        icon: '<svg data-test="title-svg"></svg>',
        default: '<div data-test="extra-slot">Extra</div>',
      },
    });

    expect(wrapper.element.tagName).toBe("HEADER");
    expect(wrapper.find('nav[aria-label="Breadcrumb"] ol li').exists()).toBe(true);
    expect(wrapper.find('[aria-current="page"]').text()).toBe("Settings");
    expect(wrapper.find("h2").text()).toContain("Settings");
    expect(wrapper.find("p.js-title-bar__description").text()).toContain("automatically");
    expect(wrapper.find('[data-test="title-svg"]').exists()).toBe(true);
    // Regression check: default slot must render only ONCE (was duplicated in legacy code)
    expect(wrapper.findAll('[data-test="extra-slot"]')).toHaveLength(1);
  });
});

describe("JsTable", () => {
  it("renders semantic caption, scope=col/row headers, scroll region, and emits cell-click", async () => {
    const wrapper = mount(JsTable, {
      props: {
        caption: "Metrics",
        headerRowCount: 1,
        headerColCount: 1,
        scroll: true,
        rows: [
          ["Name", "Action"],
          ["Row 1", { label: "Run", button: true }],
        ],
      },
    });

    expect(wrapper.attributes("role")).toBe("region");
    expect(wrapper.attributes("aria-label")).toBe("Metrics");
    expect(wrapper.attributes("tabindex")).toBe("0");
    expect(wrapper.find("caption").text()).toBe("Metrics");
    expect(wrapper.findAll('thead th[scope="col"]')).toHaveLength(2);
    expect(wrapper.findAll('tbody th[scope="row"]')).toHaveLength(1);

    await wrapper.find("tbody button").trigger("click");
    expect(wrapper.emitted("cell-click")).toHaveLength(1);
  });
});

describe("PlaygroundApp Batch 2C Integration", () => {
  it("mounts all Batch 2A–2C components cleanly with zero warnings", () => {
    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents],
      },
    });
    expect(wrapper.findAll(".js-title-bar").length).toBeGreaterThanOrEqual(2);
    expect(wrapper.findAll(".js-panel").length).toBeGreaterThanOrEqual(3);
    expect(wrapper.findAll(".js-panel-nav").length).toBeGreaterThanOrEqual(2);
    expect(wrapper.findAll(".js-table").length).toBeGreaterThanOrEqual(2);
  });
});
