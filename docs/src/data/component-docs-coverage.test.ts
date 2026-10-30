import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';
import { componentRegistry } from './components';

/** Frozen inventory from docs/superpowers/specs/2026-08-12-component-docs-coverage-design.md */
const REQUIRED_FAMILY_SLUGS = [
  // Action
  'icon-button',
  'button-group',
  'copy-button',
  'toggle-button',
  'segmented-control',
  'color-mode-toggle',
  'menu',
  'toolbar',
  // Data input
  'number-input',
  'password-input',
  'search-input',
  'file-input',
  'input-group',
  'checkbox-group',
  'calendar',
  'date-input',
  'date-range-input',
  'date-time-input',
  'time-input',
  'tokenizer',
  'multi-selector',
  'color-input',
  'color-picker',
  // Feedback
  'skeleton',
  'status-dot',
  'loading-overlay',
  'steps',
  // Overlay
  'alert-dialog',
  'drawer',
  'tooltip',
  'popover',
  'hover-card',
  'command-palette',
  // Layout / nav
  'app-shell',
  'scroll-area',
  'overflow-list',
  'resize-handle',
  'breadcrumbs',
  'pagination',
  'toc',
  'side-nav',
  'top-nav',
  'top-nav-mega-menu',
  'mobile-nav',
  'tab-list',
  'hidden',
  // Content / data
  'kbd',
  'list',
  'description-list',
  'outline',
  'table',
  'tree',
  'file-tree',
] as const;

const contentDir = join(dirname(fileURLToPath(import.meta.url)), '../../content/components');

describe('component docs coverage', () => {
  it('registers every design-inventory family slug', () => {
    const registrySlugs = new Set(componentRegistry.map((entry) => entry.slug));
    for (const slug of REQUIRED_FAMILY_SLUGS) {
      expect(registrySlugs.has(slug), `missing componentRegistry entry: ${slug}`).toBe(true);
    }
  });

  it('has an MDX page for every design-inventory family slug', () => {
    for (const slug of REQUIRED_FAMILY_SLUGS) {
      const mdxPath = join(contentDir, `${slug}.mdx`);
      expect(existsSync(mdxPath), `missing MDX page: ${slug}.mdx`).toBe(true);
    }
  });
});
