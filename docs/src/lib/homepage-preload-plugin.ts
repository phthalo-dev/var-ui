import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const virtualModuleId = 'virtual:homepage-preloads';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

const PRELOAD_CHUNK_PATTERNS = [
  'HomepageIsland',
  'BentoShowcase',
  'var-ui-components',
  'HighlightedCodeBlock',
  'rolldown-runtime',
  'default-icons',
  'homeBento',
  'client.',
];

const cachePath = path.join(
  fileURLToPath(new URL('.', import.meta.url)),
  '.cache',
  'homepage-preloads.json',
);

function readCachedPreloads(): string[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clientManualChunks(id: string): string | undefined {
  if (
    id.includes('/packages/core/src/components/indicators/tabs') ||
    id.includes('/packages/core/src/components/indicators/segmented-control')
  ) {
    return 'var-ui-components';
  }

  if (id.includes('/packages/react/src/components/')) {
    return 'var-ui-components';
  }

  return undefined;
}

/**
 * Client-only chunk grouping for homepage islands and `modulepreload` hints.
 */
export function homepagePreloadPlugin(): Plugin {
  return {
    name: 'var-ui:homepage-preloads',
    configEnvironment(name, config) {
      if (name !== 'client') return;

      config.build ??= {};
      config.build.rollupOptions ??= {};
      const output = config.build.rollupOptions.output;
      if (output && typeof output === 'object' && !Array.isArray(output)) {
        output.manualChunks = clientManualChunks;
      } else {
        config.build.rollupOptions.output = { manualChunks: clientManualChunks };
      }
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(readCachedPreloads())};`;
      }
    },
    generateBundle(_options, bundle) {
      const urls = new Set<string>();

      for (const [fileName, output] of Object.entries(bundle)) {
        if (output.type !== 'chunk') continue;
        if (!PRELOAD_CHUNK_PATTERNS.some((pattern) => fileName.includes(pattern))) continue;
        urls.add(toPublicAssetPath(fileName));
      }

      if (urls.size === 0) return;

      fs.mkdirSync(path.dirname(cachePath), { recursive: true });
      fs.writeFileSync(cachePath, JSON.stringify([...urls].sort()));
    },
  };
}

function toPublicAssetPath(fileName: string): string {
  if (fileName.startsWith('/')) return fileName;
  if (fileName.startsWith('_astro/')) return `/${fileName}`;
  return `/_astro/${fileName}`;
}
