import { defineConfig } from "vite"

export default defineConfig({
  root: "src",
  publicDir: "../public",
  base: "/gh-top-languages-builder/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    minify: "oxc",
    rollupOptions: {
      input: {
        main: "src/index.html",
      }
    },
  },
});
