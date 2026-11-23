import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode }) => {
  const isLibBuild = command === "build" && mode !== "playground";
  const isPlaygroundBuild = command === "build" && mode === "playground";

  return {
    plugins: [vue()],
    root: isLibBuild ? __dirname : resolve(__dirname, "playground"),
    resolve: {
      alias: isLibBuild
        ? {
            "@": resolve(__dirname, "src"),
          }
        : {
            "@": resolve(__dirname, "src"),
            "@steelmasterj/js-components": resolve(__dirname, "src/index.js"),
          },
    },
    build: isPlaygroundBuild
      ? {
          outDir: resolve(__dirname, "dist-playground"),
          emptyOutDir: true,
        }
      : {
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
