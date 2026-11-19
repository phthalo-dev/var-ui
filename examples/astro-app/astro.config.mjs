import { defineConfig } from 'astro/config';
import typestylesVite from '@typestyles/vite';
import { sourceConditions } from '../../source-conditions.ts';

export default defineConfig(({ command }) => ({
  vite: {
    plugins: [typestylesVite({ extract: { modules: ['typestyles-entry.ts'] } })],
    // `astro dev` loads Var UI from source; `astro build` uses the packages' built `dist`.
    ...(command === 'serve' ? sourceConditions : {}),
  },
}));
