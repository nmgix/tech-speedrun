import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { terser } from "rollup-plugin-terser";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === "production" ? "/tech-speedrun/" : "/",
    plugins: [
      react(),
      VitePWA({
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          cacheId: "tech-speedrun",
          mode: "production",
          runtimeCaching: [
            {
              urlPattern: "https://fonts.googleapis.com/.*",
              handler: "CacheFirst",
              method: "GET"
            },
            {
              urlPattern: "https://fonts.gstatic.com/.*",
              handler: "CacheFirst",
              method: "GET"
            }
          ]
        },
        registerType: "autoUpdate",
        includeAssets: ["**/*"],
        devOptions: {
          enabled: true
          // type: "module"
        },
        manifest: {
          name: "TECH SPREEDRUN",
          short_name: "TECH SPEEDRUN",
          description: "Small app for making list of your tech stack for CV",
          theme_color: "#FFFFFF",
          background_color: "#FFFFFF",
          display: "standalone",
          start_url: mode === "production" ? "/tech-speedrun/" : "/",
          icons: [
            {
              src: "page-icons/icon-256.png",
              sizes: "256x256",
              type: "image/png",
              purpose: "any"
            },
            {
              src: "page-icons/icon-256.svg",
              sizes: "256x256",
              type: "image/svg",
              purpose: "maskable"
            },
            {
              src: "page-icons/icon-144.svg",
              sizes: "144x144",
              type: "image/svg",
              purpose: "any"
            },
            {
              src: "page-icons/icon-128.svg",
              sizes: "128x128",
              type: "image/svg"
            },
            {
              src: "page-icons/icon-64.svg",
              sizes: "64x64",
              type: "image/svg"
            },
            {
              src: "page-icons/icon-32.svg",
              sizes: "32x32",
              type: "image/svg"
            }
          ],
          screenshots: [
            {
              src: "screenshots/default.png",
              sizes: "1280x832",
              type: "image/png",
              form_factor: "wide",
              label: "Desktop layout"
            },
            {
              src: "screenshots/mobile.png",
              sizes: "360x800",
              type: "image/png",
              form_factor: "narrow",
              label: "Mobile layout"
            }
          ]
        }
      })
    ],
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

    ...(mode === "production" && {
      esbuild: {
        drop: ["console", "debugger"]
      }
    })
  };
});
