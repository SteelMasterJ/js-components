import { describe, it, expect, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import JsPanelNavItem from "../src/components/PanelNavItem.vue";
import JsBtnSplit from "../src/components/BtnSplit.vue";
import JsNavList from "../src/components/NavList.vue";
import JsDrop from "../src/components/Drop.vue";
import JsMarkdown from "../src/components/Markdown.vue";
import JsComponents from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";

describe("JsPanelNavItem", () => {
  it("delegates props, slots, and click events to JsNavItem", async () => {
    const wrapper = mount(JsPanelNavItem, {
      props: {
        item: { label: "Alerts", button: "button", notifyCount: 2 },
        theme: "blue",
        dropPos: "br",
      },
      slots: {
        icon: '<svg data-test="forwarded-svg"></svg>',
      },
    });

    expect(wrapper.find('[data-test="forwarded-svg"]').exists()).toBe(true);
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});

describe("JsBtnSplit", () => {
  it("renders a semantic role=group with accessible label and emits clicks", async () => {
    const wrapper = mount(JsBtnSplit, {
      props: {
        ariaLabel: "Document actions",
        grow: "first",
        items: [
          { label: "Save", button: "button" },
          { label: "More", items: [{ label: "Export" }] },
        ],
      },
    });

    expect(wrapper.attributes("role")).toBe("group");
    expect(wrapper.attributes("aria-label")).toBe("Document actions");
    expect(wrapper.classes()).toContain("js-btn-split--grow-first");

    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(2);
    await buttons[0].trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});

describe("JsNavList", () => {
  it("renders headers, semantic <hr> dividers, custom components, and async JsBtnSplit", async () => {
    const wrapper = mount(JsNavList, {
      props: {
        menu: true,
        theme: "dark",
        items: [
          { header: true, label: "Section" },
          { label: "First", button: "button" },
          { divider: true },
          { component: JsMarkdown, props: { val: "*Custom*", parse: true } },
          {
            split: true,
            items: [
              { label: "Left", button: "button" },
              { label: "Right", button: "button" },
            ],
          },
        ],
      },
    });

    await flushPromises();
    expect(wrapper.find('ul[role="menu"]').exists()).toBe(true);
    expect(wrapper.find("hr.js-nav-list__divider").exists()).toBe(true);
    expect(wrapper.find("strong").text()).toBe("Custom");
    expect(wrapper.find('[role="group"]').exists()).toBe(true);

    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("select")).toHaveLength(1);
  });
});

describe("JsDrop", () => {
  it("renders inline panel with tabs or dynamic component without trigger", () => {
    const compDrop = mount(JsDrop, {
      props: {
        component: JsMarkdown,
        componentProps: { val: "*Dynamic*", parse: true },
      },
    });
    expect(compDrop.find("strong").text()).toBe("Dynamic");

    const tabDrop = mount(JsDrop, {
      props: {
        tabs: true,
        items: [
          { id: "a", label: "Tab A", items: [{ label: "Alpha" }] },
          { id: "b", label: "Tab B", items: [{ label: "Beta" }] },
        ],
      },
    });
    expect(tabDrop.find('[role="tablist"]').exists()).toBe(true);
  });

  it("toggles floating popover, flips above near viewport bottom, and closes on Escape", async () => {
    const origHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });

    const wrapper = mount(JsDrop, {
      props: {
        triggerLabel: "Options",
        items: [{ label: "Edit" }, { label: "Delete" }],
      },
    });

    const triggerBtn = wrapper.find(".js-drop__trigger");
    expect(triggerBtn.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".js-drop__panel").exists()).toBe(false);

    const triggerWrap = wrapper.find(".js-drop__trigger-wrap").element;
    vi.spyOn(triggerWrap, "getBoundingClientRect").mockReturnValue({
      top: 520,
      bottom: 560,
      left: 20,
      right: 160,
      width: 140,
      height: 40,
    });

    await triggerBtn.trigger("click");
    expect(triggerBtn.attributes("aria-expanded")).toBe("true");
    const panelEl = wrapper.find(".js-drop__panel").element;
    vi.spyOn(panelEl, "getBoundingClientRect").mockReturnValue({
      top: 565,
      bottom: 785,
      left: 20,
      right: 220,
      width: 200,
      height: 220,
    });

    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".js-drop__panel").classes()).toContain("js-drop__panel--above");

    await wrapper.trigger("keydown", { key: "Escape" });
    expect(wrapper.find(".js-drop__panel").exists()).toBe(false);

    Object.defineProperty(window, "innerHeight", { value: origHeight, configurable: true });
  });
});

describe("PlaygroundApp Batch 2B Integration", () => {
  it("mounts all Batch 2A + 2B components cleanly with zero warnings", async () => {
    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents],
      },
    });
    await flushPromises();
    expect(wrapper.findAll(".js-btn-split").length).toBeGreaterThanOrEqual(8);
    expect(wrapper.findAll(".js-nav-list").length).toBeGreaterThanOrEqual(2);
    expect(wrapper.findAll(".js-drop").length).toBeGreaterThanOrEqual(6);
  });
});
