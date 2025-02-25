// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
// import node from '@astrojs/node';
import bun from 'astro-bun-adapter';


export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: bun(),
})