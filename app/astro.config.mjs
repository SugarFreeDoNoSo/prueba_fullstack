// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import vercel from '@astrojs/vercel';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel({})
})