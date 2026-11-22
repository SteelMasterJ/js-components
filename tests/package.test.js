import { describe, it, expect } from "vitest";
import { createApp } from "vue";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import JsComponents, * as NamedExports from "../src/index.js";

const EXPECTED_COMPONENTS = [
  "JsIcon",
  "JsMarkdown",
  "JsModal",
  "JsTabs",
  "JsNavItem",
  "JsNavItemActions",
  "JsNavItemIcon",
  "JsNavItemLabels",
  "JsNavItemNotify",
  "JsNavItemTags",
  "JsPanelNavItem",
  "JsBtnSplit",
  "JsNavList",
  "JsDrop",
  "JsPanel",
  "JsPanelNav",
  "JsTitleBar",
  "JsTable",
  "JsInput",
  "JsInputCheckbox",
  "JsInputRadio",
  "JsForm",
];

describe("Package Exports & Plugin Registration", () => {
  it("exports all 22 named Vue 3 components with matching component names", () => {
    const exportedNames = Object.keys(NamedExports).filter(
      (key) => key !== "default"
    );
    expect(exportedNames.sort()).toEqual([...EXPECTED_COMPONENTS].sort());

    for (const name of EXPECTED_COMPONENTS) {
      const comp = NamedExports[name];
      expect(comp, `${name} should be exported`).toBeTruthy();
      expect(comp.name).toBe(name);
    }
  });

  it("registers all 22 components globally via app.use(JsComponents)", () => {
    expect(typeof JsComponents.install).toBe("function");

    const app = createApp({});
    app.use(JsComponents);

    for (const name of EXPECTED_COMPONENTS) {
      expect(
        app.component(name),
        `${name} should be registered by install()`
      ).toBeTruthy();
    }
  });

  it("defines valid npm package metadata and strict exports/files", () => {
    const pkgPath = resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

    expect(pkg.name).toBe("@steelmasterj/js-components");
    expect(pkg.type).toBe("module");
    expect(pkg.license).toBe("MIT");
    expect(pkg.publishConfig?.access).toBe("public");
    expect(pkg.main).toBe("./dist/js-components.cjs");
    expect(pkg.module).toBe("./dist/js-components.js");
    expect(pkg.exports["."]).toEqual({
      import: "./dist/js-components.js",
      require: "./dist/js-components.cjs",
    });
    expect(pkg.exports["./style.css"]).toBe("./dist/style.css");
    expect(pkg.files).toEqual(["dist", "README.md", "LICENSE"]);
    expect(pkg.sideEffects).toEqual(["**/*.css"]);
    expect(pkg.peerDependencies.vue).toBeTruthy();
    expect(pkg.peerDependenciesMeta?.["vue-router"]?.optional).toBe(true);
    expect(pkg.scripts.prepublishOnly).toBe("npm test && npm run build");
  });
});
