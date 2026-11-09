import react from '@vitejs/plugin-react';
import typestyles from '@typestyles/vite';
import { defineConfig, type UserConfig } from 'vite-plus';

export default defineConfig({
  plugins: [
    ...react(),
    typestyles({ extract: { modules: ['typestyles-entry.ts'] }, compile: true }),
  ],
} as UserConfig);
