import react from '@vitejs/plugin-react';
import typestyles from '@typestyles/vite';
import { defineConfig, type UserConfig } from 'vite-plus';
// An app imports these from `@var-ui/core/vite` and `@var-ui/core`. The config itself runs in Node
// before any condition applies, so the repo example points at source directly.
import { varUiColorMode } from '../../packages/core/src/vite';
import { defaultThemeClassName } from '../../packages/core/src/theme/constants';
import { sourceConditions } from '../../source-conditions';
import { COLOR_MODE } from './src/colorModeConfig';

export default defineConfig({
  plugins: [
    ...react(),
    typestyles({ extract: { modules: ['typestyles-entry.ts'] }, compile: true }),
    // Paints the stored colour mode before React loads (no flash on reload).
    varUiColorMode({ ...COLOR_MODE, themeClassName: defaultThemeClassName }),
  ],
  // The repo example loads Var UI from source (`@var-ui/source` in the packages' exports).
  ...sourceConditions,
} as UserConfig);
