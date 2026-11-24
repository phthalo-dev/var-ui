import { codeBlock, codeBlockMarkup, type CodeBlockAttributes } from '@var-ui/core';
import { svg as copySvg } from '@var-ui/icons/glyphs/copy';

/** One tab of a package install block: the tab label (`pnpm`) and the command it shows. */
export type PackageInstallCommand = { id: string; command: string };

export type PackageInstallMarkupOptions = {
  /** Tabs in order; the first is selected until the reader picks another manager. */
  commands: readonly PackageInstallCommand[];
  /**
   * Prefix for the tab and panel ids (`<id>-tab-pnpm`, `<id>-panel-pnpm`). Give each block on a
   * page its own. @default a tag derived from the commands
   */
  id?: string;
  /** Accessible name of the tab list. @default 'Package manager' */
  label?: string;
  copyLabel?: string;
  copiedLabel?: string;
  errorLabel?: string;
};

/**
 * The pnpm / npm / yarn / bun commands that install `packages` (a space-separated list), as
 * `PackageInstall` shows them. `dev` adds them as dev dependencies.
 */
export function packageInstallCommands(
  packages: string,
  { dev = false }: { dev?: boolean } = {},
): PackageInstallCommand[] {
  return [
    { id: 'pnpm', command: `pnpm add${dev ? ' -D' : ''} ${packages}` },
    { id: 'npm', command: `npm install${dev ? ' -D' : ''} ${packages}` },
    { id: 'yarn', command: `yarn add${dev ? ' -D' : ''} ${packages}` },
    { id: 'bun', command: `bun add${dev ? ' -d' : ''} ${packages}` },
  ];
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function attrs(attributes: Record<string, string | number | boolean | undefined>): string {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([name, value]) => (value === true ? name : `${name}="${escapeHtml(String(value))}"`))
    .join(' ');
}

/** FNV-1a, base 36. */
function tag(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

const part = (attributes: CodeBlockAttributes | { class: string }) =>
  attributes as Record<string, string | undefined>;

/**
 * HTML for a code block with a tab per package manager: the same markup as `PackageInstall`
 * (`codeBlock` recipe slots, `data-package-install` / `data-package-manager` hooks), for sites
 * that build HTML strings (a markdown pipeline) or show commands that come from content.
 * Call {@link initPackageInstall} (and `initCodeBlockCopy` from `@var-ui/astro`) on the page.
 *
 * ```ts
 * packageInstallMarkup({ commands: packageInstallCommands('@var-ui/core typestyles') });
 * packageInstallMarkup({ commands: [{ id: 'pnpm', command: 'pnpm dlx tsx build.ts' }] });
 * ```
 */
export function packageInstallMarkup({
  commands,
  id = `pkg-${tag(commands.map((entry) => `${entry.id}\n${entry.command}`).join('\n'))}`,
  label = 'Package manager',
  copyLabel = 'Copy command',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
}: PackageInstallMarkupOptions): string {
  const m = codeBlockMarkup({ copyLabel, copiedLabel, errorLabel });
  const cb = codeBlock({ variant: 'default' });
  const tabs = commands
    .map(
      (entry, index) =>
        `<button ${attrs({
          type: 'button',
          role: 'tab',
          id: `${id}-tab-${entry.id}`,
          'aria-controls': `${id}-panel-${entry.id}`,
          'aria-selected': index === 0 ? 'true' : 'false',
          tabindex: index === 0 ? 0 : -1,
          'data-package-manager': entry.id,
          class: cb.tab.className,
          ...cb.tab.attrs,
        })}>${escapeHtml(entry.id)}</button>`,
    )
    .join('');
  const panels = commands
    .map(
      (entry, index) =>
        `<pre ${attrs({
          ...part(m.pre),
          role: 'tabpanel',
          id: `${id}-panel-${entry.id}`,
          'aria-labelledby': `${id}-tab-${entry.id}`,
          hidden: index !== 0,
        })}><code ${attrs(part(m.code))}>${escapeHtml(entry.command)}</code></pre>`,
    )
    .join('');
  const actions =
    m.actions && m.copyButton && m.feedback
      ? `<div ${attrs(part(m.actions))}><button ${attrs(part(m.copyButton))}><span ${attrs(
          m.copyIcon,
        )}>${copySvg}</span></button><span ${attrs(part(m.feedback))}></span></div>`
      : '';
  return (
    `<div ${attrs({ ...part(m.root), 'data-package-install': '' })}>` +
    `<div ${attrs(part(m.header))}>` +
    `<div ${attrs({ class: cb.tabs.className, ...cb.tabs.attrs, role: 'tablist', 'aria-label': label })}>${tabs}</div>` +
    actions +
    `</div>` +
    `<div ${attrs(part(m.body))}>${panels}</div>` +
    `</div>`
  );
}

const blocksPerRender = new WeakMap<object, number>();

/** `pkg-1`, `pkg-2`, … per page render (`render` is any per-render object, e.g. `Astro.request`). */
export function nextPackageInstallId(render: object): string {
  const index = (blocksPerRender.get(render) ?? 0) + 1;
  blocksPerRender.set(render, index);
  return `pkg-${index}`;
}

export { initPackageInstall, PACKAGE_MANAGER_STORAGE_KEY } from '../scripts/packageInstall';
