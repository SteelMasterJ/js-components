import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import JsAccordion from "../src/components/Accordion.vue";

const sampleItems = [
  {
    id: "first",
    label: "First Section",
    subLabel: "Intro details",
    icon: "info-circle",
    badge: 3,
    content: "First body copy",
  },
  {
    id: "second",
    label: "Second Section",
    content: "Second body copy",
  },
  {
    id: "disabled",
    label: "Disabled Section",
    disabled: true,
    content: "Should never open",
  },
  {
    id: "fourth",
    label: "Fourth Section",
    content: "Fourth body copy",
  },
];

describe("JsAccordion", () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("renders semantic headings, native buttons, and linked ARIA regions", () => {
    const wrapper = mount(JsAccordion, {
      props: {
        items: sampleItems,
        headingLevel: 2,
        ariaLabel: "FAQ Accordion",
      },
    });

    expect(wrapper.attributes("aria-label")).toBe("FAQ Accordion");
    expect(wrapper.findAll("h2.js-accordion__heading")).toHaveLength(4);

    const buttons = wrapper.findAll("button.js-accordion__trigger");
    const panels = wrapper.findAll('[role="region"].js-accordion__panel');
    expect(buttons).toHaveLength(4);
    expect(panels).toHaveLength(4);

    buttons.forEach((btn, i) => {
      expect(btn.attributes("type")).toBe("button");
      expect(btn.attributes("aria-expanded")).toBe("false");
      expect(btn.attributes("aria-controls")).toBe(panels[i].attributes("id"));
      expect(panels[i].attributes("aria-labelledby")).toBe(btn.attributes("id"));
      expect(panels[i].attributes("hidden")).toBeDefined();
    });

    expect(buttons[2].attributes("disabled")).toBeDefined();
    expect(wrapper.find(".js-accordion__badge").text()).toBe("3");
    expect(wrapper.find(".js-accordion__sub-label").text()).toBe("Intro details");
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("supports uncontrolled single-open toggle, item.open default, and collapsible=false", async () => {
    const itemsWithDefault = [
      { id: "a", label: "A", open: true, content: "Panel A" },
      { id: "b", label: "B", content: "Panel B" },
    ];
    const wrapper = mount(JsAccordion, {
      props: { items: itemsWithDefault },
    });

    const buttons = wrapper.findAll("button.js-accordion__trigger");
    const panels = wrapper.findAll(".js-accordion__panel");

    expect(buttons[0].attributes("aria-expanded")).toBe("true");
    expect(panels[0].attributes("hidden")).toBeUndefined();
    expect(buttons[1].attributes("aria-expanded")).toBe("false");

    // Clicking second closes first and opens second
    await buttons[1].trigger("click");
    expect(buttons[0].attributes("aria-expanded")).toBe("false");
    expect(buttons[1].attributes("aria-expanded")).toBe("true");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["b"]);
    expect(wrapper.emitted("open")[0][0].item.id).toBe("b");

    // Clicking second again collapses it (collapsible=true by default)
    await buttons[1].trigger("click");
    expect(buttons[1].attributes("aria-expanded")).toBe("false");
    expect(wrapper.emitted("update:modelValue")[1]).toEqual([null]);
    expect(wrapper.emitted("close")[0][0].item.id).toBe("b");

    // With collapsible=false, first enabled item opens and cannot be collapsed
    const locked = mount(JsAccordion, {
      props: {
        items: [
          { id: "x", label: "X", content: "X body" },
          { id: "y", label: "Y", content: "Y body" },
        ],
        collapsible: false,
      },
    });
    const lockedBtns = locked.findAll("button.js-accordion__trigger");
    expect(lockedBtns[0].attributes("aria-expanded")).toBe("true");
    await lockedBtns[0].trigger("click");
    expect(lockedBtns[0].attributes("aria-expanded")).toBe("true");
    expect(locked.emitted("update:modelValue")).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
    locked.unmount();
  });

  it("supports controlled v-model in single and multiple modes and ignores disabled items", async () => {
    const wrapper = mount(JsAccordion, {
      props: {
        items: sampleItems,
        modelValue: "first",
      },
    });

    const buttons = wrapper.findAll("button.js-accordion__trigger");
    expect(buttons[0].attributes("aria-expanded")).toBe("true");
    expect(buttons[1].attributes("aria-expanded")).toBe("false");

    // Disabled click emits nothing
    await buttons[2].trigger("click");
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();

    // Multiple mode with array v-model
    await wrapper.setProps({ multiple: true, modelValue: ["first", "fourth"] });
    expect(buttons[0].attributes("aria-expanded")).toBe("true");
    expect(buttons[1].attributes("aria-expanded")).toBe("false");
    expect(buttons[3].attributes("aria-expanded")).toBe("true");

    await buttons[1].trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([
      ["first", "fourth", "second"],
    ]);

    await buttons[0].trigger("click");
    expect(wrapper.emitted("update:modelValue")[1]).toEqual([["fourth"]]);
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("handles WAI-ARIA keyboard navigation (ArrowDown, ArrowUp, Home, End) skipping disabled items", async () => {
    const wrapper = mount(JsAccordion, {
      attachTo: document.body,
      props: { items: sampleItems },
    });

    const buttons = wrapper.findAll("button.js-accordion__trigger");
    buttons[0].element.focus();
    expect(document.activeElement).toBe(buttons[0].element);

    await buttons[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[1].element);

    // ArrowDown from index 1 skips disabled index 2 -> lands on index 3
    await buttons[1].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[3].element);

    // ArrowDown wraps back to index 0
    await buttons[3].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(buttons[0].element);

    // ArrowUp wraps to last enabled (index 3)
    await buttons[0].trigger("keydown", { key: "ArrowUp" });
    expect(document.activeElement).toBe(buttons[3].element);

    // Home jumps to first enabled, End jumps to last enabled
    await buttons[3].trigger("keydown", { key: "Home" });
    expect(document.activeElement).toBe(buttons[0].element);
    await buttons[0].trigger("keydown", { key: "End" });
    expect(document.activeElement).toBe(buttons[3].element);

    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("renders variants, themes, sizes, chevronPosition, markdown, and named/scoped slots", () => {
    const wrapper = mount(JsAccordion, {
      props: {
        items: [
          { id: "custom", label: "**Bold** gn[Live]", content: "fallback" },
          { label: "Indexed Item", content: "indexed fallback" },
          { label: "Fallback Item", content: "_Italic_ body" },
        ],
        modelValue: ["custom", 1, 2],
        multiple: true,
        variant: "separated",
        size: "lg",
        theme: "dark",
        chevronPosition: "left",
        parseMarkdown: true,
      },
      slots: {
        "item-custom": '<div data-test="named-id">Named ID slot</div>',
        item1: '<div data-test="named-idx">Named Index slot</div>',
        "item-icon": '<svg data-test="custom-svg"></svg>',
      },
    });

    expect(wrapper.classes()).toContain("js-accordion--separated");
    expect(wrapper.classes()).toContain("js-accordion--lg");
    expect(wrapper.classes()).toContain("js-accordion--dark");
    expect(wrapper.classes()).toContain("js-accordion--chevron-left");
    expect(wrapper.find('[data-test="named-id"]').text()).toBe("Named ID slot");
    expect(wrapper.find('[data-test="named-idx"]').text()).toBe("Named Index slot");
    expect(wrapper.findAll('[data-test="custom-svg"]')).toHaveLength(3);
    expect(wrapper.find("strong").text()).toBe("Bold");
    expect(wrapper.find(".js-tag--gn").text()).toBe("Live");
    expect(wrapper.find("em").text()).toBe("Italic");
    expect(warnSpy).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});
