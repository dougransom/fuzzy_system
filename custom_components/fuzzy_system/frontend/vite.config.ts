import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2021",
    lib: {
      entry: "src/fuzzy-system-panel.ts",
      formats: ["es"],
      fileName: () => "fuzzy-system-panel.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: "esbuild",
  },
});
