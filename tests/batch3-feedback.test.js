import { describe, it, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import JsAlert from "../src/components/Alert.vue";
import JsToast from "../src/components/Toast.vue";
import JsForm from "../src/components/Form.vue";
import JsComponents, { toast } from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";

afterEach(() => {
  toast.clear();
  vi.useRealTimers();
});

describe("JsAlert", () => {
  it("renders info, success, warning, and danger states with distinct SVG icons and ARIA roles", () => {
    const types = [
      { type: "info", role: "status", live: "polite" },
      { type: "success", role: "status", live: "polite" },
      { type: "warning", role: "alert", live: "assertive" },
      { type: "danger", role: "alert", live: "assertive" },
    ];

    const iconPaths = new Set();

    for (const cfg of types) {
      const wrapper = mount(JsAlert, {
        props: {
          type: cfg.type,
          title: `${cfg.type} title`,
          message: `${cfg.type} message`,
        },
      });

      expect(wrapper.classes()).toContain(`js-alert--${cfg.type}`);
      expect(wrapper.attributes("role")).toBe(cfg.role);
      expect(wrapper.attributes("aria-live")).toBe(cfg.live);
      expect(wrapper.find(".js-alert__title").text()).toBe(`${cfg.type} title`);
      expect(wrapper.find(".js-alert__content").text()).toBe(`${cfg.type} message`);

      const pathD = wrapper.find(".js-alert__icon svg path").attributes("d");
      expect(pathD).toBeTruthy();
      iconPaths.add(pathD);
    }

    expect(iconPaths.size).toBe(4);
  });

  it("supports dismissible v-model, role override, variants, dark theme, custom slots, and focus()", async () => {
    const wrapper = mount(JsAlert, {
      props: {
        modelValue: true,
        type: "warning",
        variant: "outline",
        theme: "dark",
        role: "note",
        dismissible: true,
        title: "Heads up",
      },
      attrs: {
        tabindex: "-1",
      },
      slots: {
        default: "<p>Custom body</p>",
        icon: '<svg data-test="custom-alert-icon"><circle cx="12" cy="12" r="8"/></svg>',
        actions: '<button type="button" data-test="alert-action">Fix</button>',
      },
    });

    expect(wrapper.classes()).toContain("js-alert--outline");
    expect(wrapper.classes()).toContain("js-alert--dark");
    expect(wrapper.attributes("role")).toBe("note");
    expect(wrapper.find('[data-test="custom-alert-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="alert-action"]').exists()).toBe(true);
    expect(typeof wrapper.vm.focus).toBe("function");
    wrapper.vm.focus();

    await wrapper.find(".js-alert__close").trigger("click");
    expect(wrapper.emitted("dismiss")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([false]);
  });
});

describe("JsForm + JsAlert integration", () => {
  it("renders validation errors with JsAlert, supports inline type='alert' items, and renders status banner", async () => {
    const model = {
      items: [
        {
          type: "alert",
          alertType: "info",
          title: "Step Info",
          message: "Inline notice",
        },
        { name: "fullName", label: "Full Name", value: "" },
      ],
    };

    const wrapper = mount(JsForm, {
      props: {
        modelValue: model,
        status: {
          type: "warning",
          title: "Server Notice",
          message: "Maintenance tonight",
          dismissible: true,
        },
      },
    });

    // Status alert renders and emits dismiss-status
    const statusAlert = wrapper.find(".js-form__status");
    expect(statusAlert.exists()).toBe(true);
    expect(statusAlert.classes()).toContain("js-alert--warning");
    await statusAlert.find(".js-alert__close").trigger("click");
    expect(wrapper.emitted("dismiss-status")).toHaveLength(1);

    // Inline schema alert renders inside grid
    const inlineAlert = wrapper.find(".js-form__grid .js-alert--info");
    expect(inlineAlert.exists()).toBe(true);
    expect(inlineAlert.text()).toContain("Inline notice");

    // Invalid submit renders JsAlert danger summary with clickable field link
    await wrapper.find("form").trigger("submit");
    const errSummary = wrapper.find(".js-form__errors");
    expect(errSummary.exists()).toBe(true);
    expect(errSummary.classes()).toContain("js-alert--danger");
    expect(wrapper.findAll(".js-form__error-link")).toHaveLength(1);

    // Valid submit excludes inline type="alert" items from payload
    await wrapper.find("input").setValue("Grace Hopper");
    await wrapper.find("form").trigger("submit");
    const submitted = wrapper.emitted("submit");
    expect(submitted).toHaveLength(1);
    expect(submitted[0][0]).toEqual([{ name: "fullName", value: "Grace Hopper" }]);
  });
});

describe("JsToast & programmatic toast helper", () => {
  it("supports declarative v-model auto-dismiss, hover/focus pause, and Escape dismissal", async () => {
    vi.useFakeTimers();

    const wrapper = mount(JsToast, {
      props: {
        modelValue: true,
        type: "success",
        title: "Saved",
        message: "Changes stored.",
        duration: 3000,
        disableTeleport: true,
      },
    });

    expect(wrapper.find(".js-toast-region").classes()).toContain(
      "js-toast-region--bottom-center"
    );
    expect(wrapper.find(".js-toast-item .js-alert--success").exists()).toBe(true);

    // Pause on hover after 1.5s, advance another 3s -> still open
    vi.advanceTimersByTime(1500);
    await wrapper.find(".js-toast-item").trigger("mouseenter");
    vi.advanceTimersByTime(3000);
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();

    // Resume on mouseleave and finish remaining 1.5s -> auto-dismisses
    await wrapper.find(".js-toast-item").trigger("mouseleave");
    vi.advanceTimersByTime(1500);
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([false]);
    expect(wrapper.emitted("dismiss")).toHaveLength(1);

    // Escape dismissal when focused
    const escToast = mount(JsToast, {
      props: {
        modelValue: true,
        type: "info",
        message: "Press Esc",
        autoDismiss: false,
        disableTeleport: true,
      },
    });
    await escToast.find(".js-toast-item").trigger("keydown", { key: "Escape" });
    expect(escToast.emitted("update:modelValue")[0]).toEqual([false]);
  });

  it("supports manual-dismiss-only mode when duration=0 or autoDismiss=false", async () => {
    vi.useFakeTimers();

    const wrapper = mount(JsToast, {
      props: {
        modelValue: true,
        type: "warning",
        message: "Persistent snackbar",
        duration: 0,
        disableTeleport: true,
      },
    });

    vi.advanceTimersByTime(20000);
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();

    await wrapper.find(".js-alert__close").trigger("click");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([false]);
  });

  it("renders programmatic toast queue, enforces maxVisible, and invokes action callbacks", async () => {
    vi.useFakeTimers();
    const onUndo = vi.fn();

    const wrapper = mount(JsToast, {
      props: {
        maxVisible: 2,
        disableTeleport: true,
      },
    });

    toast.info("First", { duration: 0 });
    const secondId = toast.danger("Second", {
      duration: 0,
      actionLabel: "Undo",
      onAction: onUndo,
    });
    toast.success("Third (queued)", { duration: 0 });

    await wrapper.vm.$nextTick();

    const items = wrapper.findAll(".js-toast-item");
    expect(items).toHaveLength(2);
    expect(items[0].text()).toContain("First");
    expect(items[1].text()).toContain("Second");

    // Click action button on second toast
    await items[1].find(".js-alert__actions button").trigger("click");
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted("action")).toHaveLength(1);

    // Dismissing second reveals queued third
    toast.dismiss(secondId);
    await wrapper.vm.$nextTick();
    const afterDismiss = wrapper.findAll(".js-toast-item");
    expect(afterDismiss).toHaveLength(2);
    expect(afterDismiss[1].text()).toContain("Third (queued)");
  });
});

describe("PlaygroundApp Feedback Components Integration", () => {
  it("mounts JsAlert and JsToast sections cleanly with zero Vue warnings", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents],
      },
    });

    expect(wrapper.findAll(".js-alert").length).toBeGreaterThanOrEqual(8);
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
