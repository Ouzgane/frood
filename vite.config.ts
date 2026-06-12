import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages sert depuis /<repo>/ ; Vercel/Netlify depuis la racine.
// Le workflow Pages définit BASE_PATH=/frood/ ; sinon on reste à la racine.
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "SyncUp — tes plans, en moments partagés",
        short_name: "SyncUp",
        description:
          "Pose tes dispos et tes intentions, tes amis se greffent — avec booking intégré.",
        lang: "fr",
        theme_color: "#ffffff",
        background_color: "#fafafa",
        display: "standalone",
        orientation: "portrait",
        start_url: base,
        scope: base,
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
    }),
  ],
});
