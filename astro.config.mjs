import { defineConfig, squooshImageService } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  image: {
    service: squooshImageService(),
  },
  output: "server",
  integrations: [solidJs(), tailwind()],
  adapter: vercel()
});