import { nitro } from "nitro/vite";
import { createFontRouteRules } from "@puzzle-ui/theme/nitro";
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  ssr: {
    noExternal: [
      "@puzzle-ui/ui",
      "@puzzle-ui/theme",
      "@puzzle-ui/fullstack",
      "@puzzle-ui/pieces",
      "@puzzle-ui/workspace-ui",
    ],
  },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro({ routeRules: createFontRouteRules(), inlineDynamicImports: true }), viteReact()],
})

export default config
