// @vitest-environment node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';

/**
 * Contract for people who write plain CSS: the `data-*` attributes the React and Astro sources
 * mention. Documented state hooks come from `audit/api-contract.md` section 1.8 and must keep
 * their names. Everything else is listed explicitly so a new or renamed attribute shows up in
 * review: add it to `UNDOCUMENTED_HOOKS` (and ideally document it) in the same PR.
 */

/** Section 1.8: state hooks both frameworks expose (some come from react-aria-components). */
const DOCUMENTED_HOOKS = [
  'data-disabled',
  'data-invalid',
  'data-required',
  'data-readonly',
  'data-selected',
  'data-checked',
  'data-indeterminate',
  'data-open',
  'data-expanded',
  'data-pressed',
  'data-orientation',
  'data-placement',
];

/** Present today, not part of the documented contract (recipe axes, layout flags, script hooks). */
const UNDOCUMENTED_HOOKS = [
  // LayoutPanel `responsive`: the CSS twin that hides the panel below its breakpoint (#190).
  'data-responsive',
  'data-responsive-below',
  // Pressable Card (`onClick`): the root flag and the stretched title button (#143).
  'data-pressable',
  'data-card-action',
  // SideNav section `selectionStyle="text"`: the recipe's hook for accent-text-only selection.
  'data-selection-style',
  'data-accordion-id',
  // react-aria's name for the trigger kind (`MenuTrigger`, `Select`, ...), mirrored on NativePopover's shell.
  'data-trigger',
  // jsdom stand-in for `:popover-open` (usePopoverElement reads it only when the selector is unsupported).
  'data-popover-open',
  'data-accordion-type',
  // Calendar `marked` dates: the marker dot inside a day cell.
  'data-calendar-mark',
  'data-active',
  'data-alert-action',
  'data-align',
  'data-appearance',
  'data-aside',
  'data-aside-collapsed',
  'data-auto',
  'data-banner',
  'data-carousel-item',
  'data-carousel-viewport',
  'data-closed',
  'data-code',
  'data-codeblock',
  // Code block root: the fence's language id (`ts`, `bash`), for language-specific styling.
  'data-language',
  'data-codeblock-body',
  'data-codeblock-copy-icon',
  'data-codeblock-feedback',
  'data-codeblock-header',
  'data-codeblock-pre',
  'data-line-tone',
  // codeBlock state hooks styled by the recipe's `&[data-…]` selectors.
  'data-wrap',
  'data-line-numbers',
  'data-highlighted',
  'data-collapsed',
  'data-collapsible',
  'data-collapsible-config',
  'data-color-mode',
  'data-command-palette',
  'data-command-palette-id',
  'data-content-selector',
  'data-context-menu-anchor',
  'data-copied',
  'data-copied-label',
  'data-copy-label',
  // CopyButton (Astro): icon/label spans the script swaps, plus the value and
  // reset-timeout inputs the script reads back from the markup.
  'data-copy-button-icon',
  'data-copy-button-text',
  'data-error-label',
  'data-timeout',
  'data-value',
  'data-current',
  'data-dirty',
  'data-divider',
  'data-divider-footer',
  'data-divider-header',
  'data-drag-over',
  'data-driven',
  'data-edge',
  'data-empty-state-icon',
  'data-error',
  'data-filled',
  'data-focused',
  'data-group',
  'data-has-children',
  'data-has-divider',
  'data-has-end',
  'data-has-footer',
  'data-has-header',
  'data-has-side-nav',
  'data-has-start',
  'data-has-top-nav',
  'data-header-hidden',
  'data-header-offset',
  'data-heading-selector',
  'data-hotkey',
  // Astro CommandPalette root: config the client script reads (React takes them as props).
  'data-empty-label',
  'data-empty-hint',
  // CommandPalette frame while the list is empty (hides the hints footer).
  'data-empty',
  'data-highlight-matches',
  'data-recent-key',
  'data-recent-label',
  'data-icon-fallback',
  'data-include-system',
  'data-index',
  'data-inset',
  'data-interactive',
  'data-item-id',
  'data-label',
  'data-layout',
  'data-loading-overlay-content',
  'data-max-visible',
  'data-min-headings',
  'data-mirror',
  'data-mobile',
  'data-mobile-breakpoint',
  'data-nested',
  'data-not-prose',
  'data-overlay',
  'data-pending',
  'data-placeholder',
  'data-removable',
  'data-resizable',
  'data-resizable-config',
  'data-row-header',
  'data-segment-id',
  'data-selection-mode',
  'data-side',
  'data-side-nav-collapsed',
  'data-storage-key',
  'data-table',
  'data-timeline',
  'data-timeline-item',
  // Menubar root / trigger markers (roving-focus queries) and the roving Tab stop marker.
  'data-menubar',
  'data-menubar-trigger',
  'data-roving-stop',
  // ToggleGroup root / item markers: roving-focus queries and CSS scoping.
  'data-toggle-group',
  'data-toggle-group-item',
  // Splitter panel marker: the splitter measures its direct panels to convert drag pixels to percent.
  'data-splitter-panel',
  'data-toast-id',
  'data-toc-link',
  'data-tone',
  'data-touched',
  'data-tree-item-id',
  'data-valid',
  'data-variant',
];

/** Astro client-script selectors and class-name payloads; internal wiring, not a styling API. */
const INTERNAL_PREFIXES = ['data-var-ui-', 'data-class-'];

const srcRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

function sourceFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    // `src/test/` holds test infrastructure (the jsdom popover stub's `data-popover-open`).
    if (statSync(path).isDirectory()) {
      if (entry !== 'test') files.push(...sourceFiles(path));
    } else if (/\.(tsx?|astro)$/.test(entry) && !/\.(test|type-test)\./.test(entry))
      files.push(path);
  }
  return files;
}

/** Core modules that build markup both bindings render (their attributes are part of the contract). */
const CORE_MARKUP = [join(srcRoot, 'core/src/components/codeBlockMarkup.ts')];

function mentionedHooks(): Set<string> {
  const found = new Set<string>();
  for (const files of [
    sourceFiles(join(srcRoot, 'react', 'src')),
    sourceFiles(join(srcRoot, 'astro', 'src')),
    CORE_MARKUP,
  ]) {
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/(?<![A-Za-z0-9_-])data-[a-z][a-z0-9-]*/g)) {
        // A trailing hyphen is a template-literal prefix (`data-var-ui-top-nav-${zone}`).
        if (!match[0].endsWith('-')) found.add(match[0]);
      }
    }
  }
  return found;
}

const isInternal = (name: string) => INTERNAL_PREFIXES.some((prefix) => name.startsWith(prefix));

describe('data-* attribute contract (React + Astro sources, shared core markup)', () => {
  const found = mentionedHooks();

  it('only mentions documented or explicitly listed hooks', () => {
    const allowed = new Set([...DOCUMENTED_HOOKS, ...UNDOCUMENTED_HOOKS]);
    const unlisted = [...found].filter((name) => !allowed.has(name) && !isInternal(name)).sort();
    expect(unlisted, 'new data-* attribute: add it to UNDOCUMENTED_HOOKS or document it').toEqual(
      [],
    );
  });

  it('keeps UNDOCUMENTED_HOOKS free of attributes that no longer exist', () => {
    const stale = UNDOCUMENTED_HOOKS.filter((name) => !found.has(name));
    expect(stale, 'removed data-* attribute: delete it from UNDOCUMENTED_HOOKS').toEqual([]);
  });

  it('does not emit retired alert hooks', () => {
    for (const name of [
      'data-alert',
      'data-alert-tone',
      'data-alert-appearance',
      'data-alert-icon',
      'data-alert-content',
    ]) {
      expect(found.has(name), name).toBe(false);
    }
  });
});
