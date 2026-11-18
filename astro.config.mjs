import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hash-slash.com',
  trailingSlash: 'ignore',
  // inlineStylesheets: CSS ships inside each page, so nothing blocks the first paint
  build: { format: 'directory', inlineStylesheets: 'always' }
});
