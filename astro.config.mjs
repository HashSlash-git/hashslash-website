import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hashslash.example', // TODO: set production domain
  trailingSlash: 'ignore',
  build: { format: 'directory' }
});
