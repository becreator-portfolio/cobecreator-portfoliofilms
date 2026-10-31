import { defineConfig } from 'vite';
import fs from 'node:fs';

const d = fs.readFileSync(new URL('./src/logo-path.txt', import.meta.url), 'utf8').trim();

export default defineConfig({
  plugins: [
    {
      name: 'inline-logo',
      transformIndexHtml(html) {
        return html
          .replace('<path id="logo-path"', `<path id="logo-path" d="${d}"`)
          .replace('<svg class="preloader__logo" viewBox="40 92 1956 506"><path />', `<svg class="preloader__logo" viewBox="40 92 1956 506"><path d="${d}" />`);
      },
    },
  ],
  build: { assetsInlineLimit: 0 },
});
