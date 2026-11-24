import { beforeEach, describe, expect, it } from 'vite-plus/test';
import {
  initPackageInstall,
  nextPackageInstallId,
  PACKAGE_MANAGER_STORAGE_KEY,
  packageInstallCommands,
  packageInstallMarkup,
} from './package-install';

describe('packageInstallCommands', () => {
  it('derives one command per manager', () => {
    expect(packageInstallCommands('a b', { dev: true })).toEqual([
      { id: 'pnpm', command: 'pnpm add -D a b' },
      { id: 'npm', command: 'npm install -D a b' },
      { id: 'yarn', command: 'yarn add -D a b' },
      { id: 'bun', command: 'bun add -d a b' },
    ]);
  });
});

describe('packageInstallMarkup (#337)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.localStorage.clear();
  });

  const commands = [
    { id: 'pnpm', command: 'pnpm dlx tsx "a<b>.ts"' },
    { id: 'npm', command: 'npx tsx "a<b>.ts"' },
  ];

  it('renders tabs and panels with the PackageInstall hooks, escaping commands', () => {
    document.body.innerHTML = packageInstallMarkup({ commands, id: 'x' });
    const root = document.querySelector('[data-package-install]')!;
    const tabs = root.querySelectorAll('[role="tab"]');
    expect(Array.from(tabs, (tab) => tab.getAttribute('data-package-manager'))).toEqual([
      'pnpm',
      'npm',
    ]);
    expect(tabs[0]!.getAttribute('aria-controls')).toBe('x-panel-pnpm');
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    const panels = root.querySelectorAll<HTMLElement>('[role="tabpanel"]');
    expect(panels[0]!.textContent).toBe('pnpm dlx tsx "a<b>.ts"');
    expect(panels[1]!.hidden).toBe(true);
    expect(root.querySelector('[data-var-ui-code-copy]')?.hasAttribute('data-var-ui-code')).toBe(
      false,
    );
    expect(root.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe(
      'Package manager',
    );
  });

  it('derives a stable id from the commands', () => {
    expect(packageInstallMarkup({ commands })).toBe(packageInstallMarkup({ commands }));
  });

  it('switches every block, remembers the choice, and only the chosen panel is visible', () => {
    document.body.innerHTML =
      packageInstallMarkup({ commands, id: 'a' }) + packageInstallMarkup({ commands, id: 'a' });
    initPackageInstall();
    const [first, second] = Array.from(
      document.querySelectorAll<HTMLElement>('[data-package-install]'),
    );
    first!.querySelector<HTMLButtonElement>('[data-package-manager="npm"]')!.click();
    expect(window.localStorage.getItem(PACKAGE_MANAGER_STORAGE_KEY)).toBe('npm');
    for (const block of [first!, second!]) {
      expect(block.querySelector<HTMLElement>('#a-panel-npm')!.hidden).toBe(false);
      expect(block.querySelector<HTMLElement>('#a-panel-pnpm')!.hidden).toBe(true);
      // `initCodeBlockCopy` copies the unhidden `pre` (see codeBlockCopy.test.ts).
      expect(block.querySelector('pre:not([hidden])')?.textContent).toBe('npx tsx "a<b>.ts"');
    }
  });
});

describe('nextPackageInstallId', () => {
  it('counts per render', () => {
    const render = {};
    expect([nextPackageInstallId(render), nextPackageInstallId(render)]).toEqual([
      'pkg-1',
      'pkg-2',
    ]);
    expect(nextPackageInstallId({})).toBe('pkg-1');
  });
});
