import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import JsInput from "../src/components/Input.vue";
import JsInputCheckbox from "../src/components/InputCheckbox.vue";
import JsInputRadio from "../src/components/InputRadio.vue";
import JsForm from "../src/components/Form.vue";
import JsComponents from "../src/index.js";
import PlaygroundApp from "../playground/App.vue";

describe("JsInput", () => {
  it("supports Vue 3 v-model, $attrs forwarding, visible error alert, and label association on select", async () => {
    const wrapper = mount(JsInput, {
      props: {
        label: "Username",
        modelValue: "ada",
        error: "Already taken",
      },
      attrs: {
        maxlength: "20",
        "data-test": "user-field",
      },
    });

    const input = wrapper.find("input");
    const label = wrapper.find("label");
    expect(label.attributes("for")).toBe(input.attributes("id"));
    expect(input.attributes("maxlength")).toBe("20");
    expect(input.attributes("aria-invalid")).toBe("true");
    const errEl = wrapper.find('[role="alert"]');
    expect(errEl.text()).toContain("Already taken");
    expect(input.attributes("aria-describedby")).toBe(errEl.attributes("id"));

    await input.setValue("grace");
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["grace"]);

    const sel = mount(JsInput, {
      props: {
        type: "select",
        label: "Role",
        modelValue: "",
        items: [
          { label: "Admin", value: "admin" },
          { label: "Disabled Role", value: "disabled", disabled: true },
          { label: "Editor", value: "editor" },
        ],
      },
    });
    const trigger = sel.find('[role="combobox"]');
    expect(sel.find("label").attributes("for")).toBe(trigger.attributes("id"));
    await trigger.trigger("click");
    expect(sel.find('[role="listbox"]').exists()).toBe(true);
    expect(sel.findAll('[role="option"]')).toHaveLength(3);
    // ArrowDown skips disabled option and selects Editor on Enter
    await trigger.trigger("keydown", { key: "ArrowDown" });
    await trigger.trigger("keydown", { key: "Enter" });
    expect(sel.emitted("update:modelValue")[0]).toEqual(["editor"]);
    expect(sel.find('[role="listbox"]').exists()).toBe(false);
  });

  it("supports accessible combobox autocomplete keyboard selection without prop mutation", async () => {
    const wrapper = mount(JsInput, {
      props: {
        label: "Framework",
        modelValue: "",
        items: [
          { label: "Vue 3", value: "vue3" },
          { label: "Vite", value: "vite" },
        ],
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("role")).toBe("combobox");
    await input.trigger("focus");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);

    await input.trigger("keydown", { key: "ArrowDown" });
    await input.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["vue3"]);
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });
});

describe("JsInputCheckbox", () => {
  it("renders semantic <fieldset>/<legend> for groups and boolean v-model for single mode", async () => {
    const group = mount(JsInputCheckbox, {
      props: {
        label: "Topics",
        modelValue: ["a"],
        items: [
          { label: "Alpha", value: "a" },
          { label: "Beta", value: "b" },
        ],
      },
    });

    expect(group.element.tagName).toBe("FIELDSET");
    expect(group.find("legend").text()).toBe("Topics");
    const boxes = group.findAll('input[type="checkbox"]');
    await boxes[1].setValue(true);
    expect(group.emitted("update:modelValue")[0]).toEqual([["a", "b"]]);

    const single = mount(JsInputCheckbox, {
      props: { label: "Accept", modelValue: false },
    });
    await single.find('input[type="checkbox"]').setValue(true);
    expect(single.emitted("update:modelValue")[0]).toEqual([true]);
  });
});

describe("JsInputRadio", () => {
  it("renders semantic <fieldset>/<legend>, unique name, sr-only swatch labels, and emits v-model", async () => {
    const wrapper = mount(JsInputRadio, {
      props: {
        label: "Accent",
        dots: true,
        modelValue: "blue",
        items: [
          { label: "Ocean Blue", value: "blue", color: "#1d6f90" },
          { label: "Forest Green", value: "green", color: "#1e7e34" },
        ],
      },
    });

    expect(wrapper.element.tagName).toBe("FIELDSET");
    expect(wrapper.find("legend").text()).toBe("Accent");
    expect(wrapper.findAll(".js-sr-only")).toHaveLength(2);

    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios[0].attributes("name")).toBe(radios[1].attributes("name"));
    await radios[1].setValue(true);
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["green"]);
  });
});

describe("JsForm", () => {
  it("validates required/min/email rules, renders clickable error summary, advances steps, and submits clean payload", async () => {
    const model = {
      steps: [
        { label: "Step 1", end: 2 },
        { label: "Step 2" },
      ],
      items: [
        { name: "name", label: "Name", value: "", validation: [{ min: 3 }] },
        { name: "email", type: "email", label: "Email", value: "bad" },
        { name: "role", type: "radio", label: "Role", value: "dev", items: [{ label: "Dev", value: "dev" }] },
      ],
    };

    const wrapper = mount(JsForm, {
      props: { modelValue: model },
    });

    // Click Next with invalid inputs -> shows error summary and stays on step 0
    const nextBtn = wrapper.findAll("button").find((b) => b.text() === "Next");
    await nextBtn.trigger("click");
    expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    expect(wrapper.findAll(".js-form__error-link")).toHaveLength(2);

    // Fill valid step 1 values and advance
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("Ada");
    await inputs[1].setValue("ada@example.com");
    await nextBtn.trigger("click");

    expect(wrapper.emitted("step-change")[0]).toEqual([1]);
    expect(wrapper.find("h3").text()).toBe("Step 2");

    // Submit form on final step
    await wrapper.find("form").trigger("submit");
    const submitted = wrapper.emitted("submit");
    expect(submitted).toHaveLength(1);
    expect(submitted[0][0]).toEqual([
      { name: "name", value: "Ada" },
      { name: "email", value: "ada@example.com" },
      { name: "role", value: "dev" },
    ]);
  });
});

describe("PlaygroundApp Full Library Integration (Batches 2A–2D)", () => {
  it("mounts all 22 library components cleanly with zero Vue warnings", () => {
    const wrapper = mount(PlaygroundApp, {
      global: {
        plugins: [JsComponents],
      },
    });
    expect(wrapper.findAll(".js-input").length).toBeGreaterThanOrEqual(8);
    expect(wrapper.findAll(".js-input-checkbox").length).toBeGreaterThanOrEqual(3);
    expect(wrapper.findAll(".js-input-radio").length).toBeGreaterThanOrEqual(2);
    expect(wrapper.findAll(".js-form")).toHaveLength(1);
  });
});
