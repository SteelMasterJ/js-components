import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { computeDropdownPlacement } from "../src/utils/position.js";
import JsMarkdown from "../src/components/Markdown.vue";
import JsModal from "../src/components/Modal.vue";
import JsTabs from "../src/components/Tabs.vue";
import JsNavItemActions from "../src/components/NavItem/NavItemActions.vue";
import JsNavItemIcon from "../src/components/NavItem/NavItemIcon.vue";
import JsNavItemLabels from "../src/components/NavItem/NavItemLabels.vue";
import JsNavItemNotify from "../src/components/NavItem/NavItemNotify.vue";
import JsNavItemTags from "../src/components/NavItem/NavItemTags.vue";
import JsNavItem from "../src/components/NavItem.vue";
import JsComponents from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";

describe("JsMarkdown", () => {
  it("renders plain text when parse is false", () => {
    const wrapper = mount(JsMarkdown, {
      props: { val: "*bold* _italic_", parse: false },
    });
    expect(wrapper.text()).toBe("*bold* _italic_");
    expect(wrapper.find("strong").exists()).toBe(false);
  });

  it("parses bold, semantic em, safe links, and colored tags while escaping XSS", () => {
    const wrapper = mount(JsMarkdown, {
      props: {
        val: '<script>alert(1)</script> *bold* _em_ bl[Blue] [Safe](https://vuejs.org) [Bad](javascript:alert(1))',
        parse: true,
      },
    });
    expect(wrapper.find("script").exists()).toBe(false);
    expect(wrapper.find("strong").text()).toBe("bold");
    expect(wrapper.find("em").text()).toBe("em");
    expect(wrapper.find(".js-tag--bl").text()).toBe("Blue");
    const links = wrapper.findAll("a");
    expect(links).toHaveLength(1);
    expect(links[0].attributes("href")).toBe("https://vuejs.org");
    expect(links[0].attributes("rel")).toBe("noopener noreferrer");
  });
});

describe("JsModal", () => {
  it("renders accessible dialog with v-model and closes on Escape or close button", async () => {
    const wrapper = mount(JsModal, {
      props: {
        modelValue: true,
        title: "Confirm Action",
        disableTeleport: true,
      },
      slots: {
        default: "<p>Dialog body</p>",
      },
    });

    const dialog = wrapper.find('[role="dialog"]');
    expect(dialog.exists()).toBe(true);
    expect(dialog.attributes("aria-modal")).toBe("true");
    expect(wrapper.find("h2").text()).toBe("Confirm Action");

    await dialog.trigger("keydown", { key: "Escape" });
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([false]);
    expect(wrapper.emitted("close")).toHaveLength(1);
  });

  it("respects closeOnBackdrop=false and closeOnEsc=false", async () => {
    const wrapper = mount(JsModal, {
      props: {
        modelValue: true,
        title: "Locked",
        closeOnBackdrop: false,
        closeOnEsc: false,
        disableTeleport: true,
      },
    });

    await wrapper.find(".js-modal-backdrop").trigger("click");
    await wrapper.find('[role="dialog"]').trigger("keydown", { key: "Escape" });
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });
});

describe("JsTabs", () => {
  const items = [
    { id: "a", label: "First" },
    { id: "b", label: "Second", disabled: true },
    { id: "c", label: "Third" },
  ];

  it("renders WAI-ARIA tablist, skips disabled tabs on ArrowRight, and emits v-model", async () => {
    const wrapper = mount(JsTabs, {
      props: { items, modelValue: "a" },
      slots: {
        "tab-a": "<p>Panel A</p>",
        "tab-c": "<p>Panel C</p>",
      },
    });

    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[1].attributes("disabled")).toBeDefined();

    await wrapper.find('[role="tablist"]').trigger("keydown", { key: "ArrowRight" });
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["c"]);
  });
});

describe("NavItem/* Subcomponents", () => {
  it("renders JsNavItemActions for shorthand flags and custom slot", () => {
    const spinner = mount(JsNavItemActions, { props: { item: { wait: true } } });
    expect(spinner.find(".js-icon--spin").exists()).toBe(true);

    const custom = mount(JsNavItemActions, {
      props: { item: {} },
      slots: { default: '<svg data-test="slot-svg"></svg>' },
    });
    expect(custom.find('[data-test="slot-svg"]').exists()).toBe(true);
  });

  it("renders JsNavItemIcon for built-in icon, thumbnail, number, and custom SVG slot", () => {
    const icon = mount(JsNavItemIcon, { props: { item: { icon: "bell" } } });
    expect(icon.find("svg").exists()).toBe(true);

    const num = mount(JsNavItemIcon, { props: { item: { number: 7 } } });
    expect(num.text()).toBe("7");

    const img = mount(JsNavItemIcon, {
      props: { item: { img: "/pic.png", label: "Profile" } },
    });
    expect(img.find("img").attributes("alt")).toBe("");
  });

  it("renders JsNavItemLabels with optional markdown parsing", () => {
    const wrapper = mount(JsNavItemLabels, {
      props: {
        item: { label: "*Title*", subLabel: "_Sub_" },
        parseMarkdown: true,
      },
    });
    expect(wrapper.find("strong").text()).toBe("Title");
    expect(wrapper.find("em").text()).toBe("Sub");
  });

  it("renders JsNavItemNotify without static role=alert spam and pluralizes aria-label", () => {
    const wrapper = mount(JsNavItemNotify, {
      props: { item: { notifyCount: 3, notifyUnits: "task" }, notifyColor: "blue" },
    });
    expect(wrapper.attributes("role")).toBeUndefined();
    expect(wrapper.attributes("aria-label")).toBe("3 tasks");
  });

  it("renders JsNavItemTags as semantic list for array tags and JsMarkdown for string tags", () => {
    const arr = mount(JsNavItemTags, {
      props: { item: { tags: ["A", "B"] } },
    });
    expect(arr.findAll("ul li .js-tag")).toHaveLength(2);

    const str = mount(JsNavItemTags, {
      props: { item: { tags: "gn[Active]" } },
    });
    expect(str.find(".js-tag--gn").text()).toBe("Active");
  });
});

describe("JsNavItem", () => {
  it("renders a semantic button, calls item.onClick, and emits click", async () => {
    let clicked = false;
    const wrapper = mount(JsNavItem, {
      props: {
        item: {
          label: "Save",
          icon: "check",
          button: "button",
          onClick: () => {
            clicked = true;
          },
        },
        theme: "blue",
      },
    });

    const btn = wrapper.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("type")).toBe("button");
    await btn.trigger("click");
    expect(clicked).toBe(true);
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("renders external links with rel=noopener noreferrer and handles disabled links", () => {
    const ext = mount(JsNavItem, {
      props: { item: { label: "Docs", linkExtNew: "https://vuejs.org" } },
    });
    const link = ext.find("a");
    expect(link.attributes("href")).toBe("https://vuejs.org");
    expect(link.attributes("target")).toBe("_blank");
    expect(link.attributes("rel")).toBe("noopener noreferrer");

    const dis = mount(JsNavItem, {
      props: { item: { label: "Disabled Link", linkExt: "https://vuejs.org", disabled: true } },
    });
    expect(dis.find("a").attributes("aria-disabled")).toBe("true");
    expect(dis.find("a").attributes("href")).toBeUndefined();
  });

  it("falls back gracefully from route to <a> when vue-router is not installed", () => {
    const wrapper = mount(JsNavItem, {
      props: { item: { label: "Home", route: "/home" } },
    });
    expect(wrapper.find("a").attributes("href")).toBe("/home");
  });

  it("toggles dropdown with ARIA attributes and closes on Escape", async () => {
    const wrapper = mount(JsNavItem, {
      props: {
        item: {
          label: "Menu",
          items: [
            { header: true, label: "Section" },
            { label: "Item 1" },
            { divider: true },
            { label: "Item 2" },
          ],
        },
      },
    });

    const trigger = wrapper.find("button");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);

    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    expect(wrapper.find("hr").exists()).toBe(true);

    await wrapper.trigger("keydown", { key: "Escape" });
    expect(trigger.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  });

  it("renders tabbed dropdowns using JsTabs and supports custom SVG slots", async () => {
    const wrapper = mount(JsNavItem, {
      props: {
        dropTabs: true,
        item: {
          label: "Tabbed",
          items: [
            { id: "t1", label: "Tab 1", items: [{ label: "A" }] },
            { id: "t2", label: "Tab 2", items: [{ label: "B" }] },
          ],
        },
      },
      slots: {
        icon: '<svg data-test="custom-icon"></svg>',
      },
    });

    expect(wrapper.find('[data-test="custom-icon"]').exists()).toBe(true);
    await wrapper.find("button").trigger("click");
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true);
  });

  it("flips dropdown above trigger when near bottom of viewport via getBoundingClientRect()", async () => {
    const origHeight = window.innerHeight;
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });

    const nearBottom = computeDropdownPlacement(
      { getBoundingClientRect: () => ({ top: 520, bottom: 560, left: 20, right: 180 }) },
      { getBoundingClientRect: () => ({ height: 220, width: 200 }) }
    );
    expect(nearBottom.openAbove).toBe(true);

    const plentyBelow = computeDropdownPlacement(
      { getBoundingClientRect: () => ({ top: 100, bottom: 140, left: 20, right: 180 }) },
      { getBoundingClientRect: () => ({ height: 220, width: 200 }) }
    );
    expect(plentyBelow.openAbove).toBe(false);

    const wrapper = mount(JsNavItem, {
      props: {
        item: {
          label: "Bottom Menu",
          items: [{ label: "One" }, { label: "Two" }],
        },
      },
    });

    const triggerEl = wrapper.find("button").element;
    vi.spyOn(triggerEl, "getBoundingClientRect").mockReturnValue({
      top: 520,
      bottom: 560,
      left: 20,
      right: 180,
      width: 160,
      height: 40,
    });

    await wrapper.find("button").trigger("click");
    const dropEl = wrapper.find('[role="menu"]').element;
    vi.spyOn(dropEl, "getBoundingClientRect").mockReturnValue({
      top: 565,
      bottom: 785,
      left: 20,
      right: 220,
      width: 200,
      height: 220,
    });

    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[role="menu"]').classes()).toContain("js-nav-item__drop--above");

    Object.defineProperty(window, "innerHeight", { value: origHeight, configurable: true });
  });
});

describe("PlaygroundApp Smoke Test", () => {
  it("mounts all Batch 2A configurations cleanly with JsComponents plugin", () => {
    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents],
      },
    });
    expect(wrapper.find("h1").text()).toContain("js-components");
    expect(wrapper.findAll('[role="tablist"]')).toHaveLength(3);
    expect(wrapper.findAll(".js-nav-item").length).toBeGreaterThan(20);
  });
});

