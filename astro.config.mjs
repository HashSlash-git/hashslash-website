import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hash-slash.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' }
});
