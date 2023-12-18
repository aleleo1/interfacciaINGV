import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://aleleo1.github.io',
  output: "server",
  integrations: [solidJs(), tailwind()],
  adapter: node({
    mode: "standalone"
  })
});