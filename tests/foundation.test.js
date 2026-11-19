import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createUid } from "../src/utils/uid.js";
import { escapeHtml, isSafeUrl } from "../src/utils/sanitize.js";
import { findInObject, pluralize } from "../src/utils/search.js";
import { resolveLinkTag } from "../src/utils/router.js";
import JsIcon from "../src/components/Icon.vue";

describe("Step 1 Foundation Utilities", () => {
  it("generates unique deterministic IDs", () => {
    const a = createUid("js-in");
    const b = createUid("js-in");
    expect(a).not.toBe(b);
    expect(a.startsWith("js-in-")).toBe(true);
  });

  it("escapes HTML and rejects unsafe URLs", () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    );
    expect(isSafeUrl("https://example.com")).toBe(true);
    expect(isSafeUrl("/relative/path")).toBe(true);
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>")).toBe(false);
  });

  it("searches nested objects and pluralizes counts", () => {
    const item = { label: "Dashboard", subLabel: "Overview" };
    expect(findInObject(item, "over", ["label", "subLabel"])).toBe(true);
    expect(findInObject(item, "missing", ["label", "subLabel"])).toBe(false);
    expect(pluralize(1, "result")).toBe("1 result");
    expect(pluralize(3, "result")).toBe("3 results");
  });

  it("resolves link tags safely with or without vue-router", () => {
    expect(resolveLinkTag({}, { to: "/home" })).toBe("a");
    expect(resolveLinkTag({ $router: {} }, { to: "/home" })).toBe("router-link");
    expect(resolveLinkTag({}, { href: "https://example.com" })).toBe("a");
    expect(resolveLinkTag({}, { isButton: true })).toBe("button");
  });
});

describe("JsIcon", () => {
  it("renders built-in SVG icons without FontAwesome", () => {
    const wrapper = mount(JsIcon, { props: { name: "search" } });
    expect(wrapper.find("svg path").exists()).toBe(true);
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("renders slotted custom SVGs with accessible label when provided", () => {
    const wrapper = mount(JsIcon, {
      props: { label: "Custom star" },
      slots: { default: '<svg data-test="custom"><circle cx="12" cy="12" r="10"/></svg>' },
    });
    expect(wrapper.find('[data-test="custom"]').exists()).toBe(true);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("Custom star");
  });
});
