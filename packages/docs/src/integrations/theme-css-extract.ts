import fs from 'node:fs';
import path from 'node:path';
import { runTypestylesBuild } from '@typestyles/build-runner';
import type { Plugin } from 'vite';
import { extractFontFaces, extractThemeOnlyCss } from '../utils/theme/extract-theme-css';
import {
  getLazyThemePresets,
  type DocsThemePreset,
  type ResolvedDocsThemePreset,
} from '../utils/theme/presets';

const THEME_ID_PATTERN = /^\/themes\/([a-z0-9-]+)\.css$/;

export type ThemeCssExtractOptions = {
  root: string;
  presets: readonly DocsThemePreset[];
  /**
   * Main TypeStyles entry (relative to root). Its `@font-face` rules are always
   * on the page via `typestyles.css`, so lazy themes must not repeat them.
   */
  typestylesEntry?: string;
  /** Output directory for production CSS (absolute or relative to root). */
  outDir?: string;
};

function resolveOutDir(root: string, outDir?: string): string {
  const target = outDir ?? 'public/themes';
  return path.isAbsolute(target) ? target : path.resolve(root, target);
}

/** Build lazy theme CSS, sharing the base font-face set across all themes. */
function createThemeCssBuilder(options: ThemeCssExtractOptions) {
  let baseFontFacesPromise: Promise<string[]> | undefined;

  const getBaseFontFaces = (): Promise<string[]> => {
    baseFontFacesPromise ??= options.typestylesEntry
      ? runTypestylesBuild({
          root: options.root,
          modules: [options.typestylesEntry],
        }).then(extractFontFaces)
      : Promise.resolve([]);
    return baseFontFacesPromise;
  };

  const build = async (preset: ResolvedDocsThemePreset): Promise<string> => {
    if (!preset.entry) {
      throw new Error(`[var-docs] lazy theme "${preset.id}" is missing an extract entry`);
    }
    const [css, baseFontFaces] = await Promise.all([
      runTypestylesBuild({ root: options.root, modules: [preset.entry] }),
      getBaseFontFaces(),
    ]);
    return extractThemeOnlyCss(css, preset.id, { baseFontFaces });
  };

  return {
    build,
    invalidate: () => {
      baseFontFacesPromise = undefined;
    },
  };
}

/** Write `public/themes/{id}.css` for every lazy preset. */
export async function buildDocsThemeStyles(options: ThemeCssExtractOptions): Promise<void> {
  const lazy = getLazyThemePresets(options.presets);
  if (lazy.length === 0) return;

  const outDir = resolveOutDir(options.root, options.outDir);
  fs.mkdirSync(outDir, { recursive: true });
  const { build } = createThemeCssBuilder(options);

  for (const preset of lazy) {
    const css = await build(preset);
    const outPath = path.join(outDir, `${preset.id}.css`);
    fs.writeFileSync(outPath, css);
    const kb = (Buffer.byteLength(css, 'utf8') / 1024).toFixed(1);
    process.stdout.write(`[var-docs] Wrote ${outPath} (${kb} KB)\n`);
  }
}

/**
 * Serves per-theme TypeStyles CSS in dev (production files from `buildDocsThemeStyles`).
 */
export function docsThemeStylesDevPlugin(options: ThemeCssExtractOptions): Plugin {
  const lazy = getLazyThemePresets(options.presets);
  const byId = new Map(lazy.map((preset) => [preset.id, preset]));
  const cache = new Map<string, string>();
  const inflight = new Map<string, Promise<string>>();
  const { build, invalidate: invalidateBaseFontFaces } = createThemeCssBuilder(options);

  return {
    name: 'var-docs-theme-styles-dev',
    configureServer(server) {
      if (lazy.length === 0) return;

      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next();
          return;
        }

        const url = req.url?.split('?')[0] ?? '';
        const match = url.match(THEME_ID_PATTERN);
        if (!match) {
          next();
          return;
        }

        const themeId = match[1]!;
        const preset = byId.get(themeId);
        if (!preset) {
          next();
          return;
        }

        try {
          let css = cache.get(themeId);
          if (!css) {
            if (!inflight.has(themeId)) {
              inflight.set(
                themeId,
                build(preset)
                  .then((built) => {
                    cache.set(themeId, built);
                    return built;
                  })
                  .finally(() => {
                    inflight.delete(themeId);
                  }),
              );
            }
            css = await inflight.get(themeId)!;
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          res.end(css);
        } catch (err) {
          next(err);
        }
      });

      const invalidate = () => {
        cache.clear();
        inflight.clear();
        invalidateBaseFontFaces();
      };
      server.watcher.on('change', invalidate);
      server.watcher.on('add', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}
