import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      minify: "terser",
      rollupOptions: {
        plugins: [
          terser({
            format: {
              comments: false
            },
            mangle: {
              keep_classnames: false,
              reserved: []
            }
          })
        ]
      }
    },
    plugins: [react()],
    ...(mode === "production" && {
      esbuild: {
        drop: ["console", "debugger"]
      }
    })
  };
});
