import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    plugins: [vue()],
    root: isBuild ? __dirname : resolve(__dirname, "playground"),
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: resolve(__dirname, "dist"),
      emptyOutDir: true,
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, "src/index.js"),
        name: "JsComponents",
        formats: ["es", "cjs"],
        fileName: (format) =>
          format === "es" ? "js-components.js" : "js-components.cjs",
      },
      rollupOptions: {
        external: ["vue", "vue-router"],
        output: {
          exports: "named",
          globals: {
            vue: "Vue",
            "vue-router": "VueRouter",
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith(".css")) {
              return "style.css";
            }
            return "[name][extname]";
          },
        },
      },
    },
    test: {
      root: __dirname,
      environment: "jsdom",
    },
  };
});
