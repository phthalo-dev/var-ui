import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '../DirectionProvider';
import { Tree, type TreeItemData } from './Tree';

const FILE_TREE_ITEMS: TreeItemData[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'app', label: 'App.tsx' },
      { id: 'utils', label: 'utils.ts', isDisabled: true },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

function ControlledTree({
  onExpandedChange,
  onSelectionChange,
  selectionMode = 'single' as const,
}: {
  onExpandedChange?: (keys: Set<string>) => void;
  onSelectionChange?: (keys: Set<string>) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src']));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  return (
    <Tree
      aria-label="Files"
      items={FILE_TREE_ITEMS}
      expandedKeys={expanded}
      onExpandedChange={(next) => {
        setExpanded(next);
        onExpandedChange?.(next);
      }}
      selectionMode={selectionMode}
      selectedKeys={selected}
      onSelectionChange={(next) => {
        setSelected(next);
        onSelectionChange?.(next);
      }}
    />
  );
}

function treeitem(name: string) {
  return screen.getByRole('treeitem', { name });
}

describe('Tree', () => {
  it('renders items-array mode with role="tree"/"treeitem" and aria-level', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    expect(screen.getByRole('tree', { name: 'Files' })).toBeTruthy();
    expect(treeitem('src').getAttribute('aria-level')).toBe('1');
    expect(treeitem('App.tsx').getAttribute('aria-level')).toBe('2');
  });

  it('renders compound Tree.Item children producing the same structure', () => {
    render(
      <Tree aria-label="Files">
        <Tree.Item id="src" label="src" defaultExpanded>
          <Tree.Item id="app" label="App.tsx" />
        </Tree.Item>
        <Tree.Item id="readme" label="README.md" />
      </Tree>,
    );
    expect(treeitem('src').getAttribute('aria-level')).toBe('1');
    expect(treeitem('App.tsx').getAttribute('aria-level')).toBe('2');
    expect(treeitem('README.md').getAttribute('aria-level')).toBe('1');
  });

  it('collapses children by default — hidden rows are not rendered', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} />);
    expect(screen.getByRole('treeitem', { name: 'src' })).toBeTruthy();
    expect(screen.queryByRole('treeitem', { name: 'App.tsx' })).toBeNull();
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('false');
  });

  it('expands on chevron click, toggling aria-expanded and revealing children', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} />);
    const toggle = treeitem('src').querySelector('button')!;
    await userEvent.click(toggle);
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('treeitem', { name: 'App.tsx' })).toBeTruthy();

    await userEvent.click(toggle);
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('treeitem', { name: 'App.tsx' })).toBeNull();
  });

  it('expands on row click when selectionMode is "none"', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} />);
    await userEvent.click(treeitem('src'));
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('true');
  });

  it('marks disabled items with aria-disabled and data-disabled', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    const disabled = treeitem('utils.ts');
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    expect(disabled.hasAttribute('data-disabled')).toBe(true);
  });

  it('does not expand/select a disabled item on click', async () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        aria-label="Files"
        items={FILE_TREE_ITEMS}
        defaultExpandedKeys={['src']}
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );
    await userEvent.click(treeitem('utils.ts'));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('selects a row on click when selectionMode !== "none", setting aria-selected', async () => {
    render(<ControlledTree />);
    const app = treeitem('App.tsx');
    await userEvent.click(app);
    expect(app.getAttribute('aria-selected')).toBe('true');
  });

  it('gives no row aria-selected when selectionMode is "none"', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    expect(treeitem('src').hasAttribute('aria-selected')).toBe(false);
  });

  it('roving tabindex: only one row is tabbable at a time', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    const rows = screen.getAllByRole('treeitem');
    const tabbable = rows.filter((row) => row.tabIndex === 0);
    expect(tabbable.length).toBe(1);
    expect(tabbable[0]).toBe(treeitem('src'));
  });

  it('ArrowDown moves the roving tabindex to the next visible row', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('src').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(treeitem('App.tsx'));
    expect(treeitem('App.tsx').tabIndex).toBe(0);
    expect(treeitem('src').tabIndex).toBe(-1);
  });

  it('ArrowDown skips a disabled row', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('App.tsx').focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(treeitem('README.md'));
  });

  it('ArrowRight expands a collapsed row with children without moving focus', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} />);
    treeitem('src').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(treeitem('src'));
  });

  it('ArrowRight moves focus to the first child when already expanded', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('src').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(treeitem('App.tsx'));
  });

  it('ArrowLeft collapses an expanded row without moving focus', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('src').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(treeitem('src').getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(treeitem('src'));
  });

  it('ArrowLeft on a leaf/collapsed row moves focus to its parent', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('App.tsx').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(treeitem('src'));
  });

  it('Home/End jump to the first/last visible row', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('App.tsx').focus();
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(treeitem('README.md'));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(treeitem('src'));
  });

  it('Enter selects the focused row when selectionMode !== "none"', async () => {
    render(<ControlledTree />);
    treeitem('App.tsx').focus();
    await userEvent.keyboard('{Enter}');
    expect(treeitem('App.tsx').getAttribute('aria-selected')).toBe('true');
  });

  it('does not select on Enter when selectionMode is "none"', async () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    treeitem('App.tsx').focus();
    await userEvent.keyboard('{Enter}');
    expect(treeitem('App.tsx').hasAttribute('aria-selected')).toBe(false);
  });

  it('supports multiple selection, accumulating selectedKeys', async () => {
    const onSelectionChange = vi.fn();
    render(<ControlledTree selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    await userEvent.click(treeitem('App.tsx'));
    await userEvent.click(treeitem('README.md'));
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['app', 'readme']));
  });

  it('is controlled when expandedKeys/selectedKeys are provided', async () => {
    function Wrapper() {
      const [expanded, setExpanded] = useState<Set<string>>(new Set());
      return (
        <Tree
          aria-label="Files"
          items={FILE_TREE_ITEMS}
          expandedKeys={expanded}
          onExpandedChange={setExpanded}
        />
      );
    }
    render(<Wrapper />);
    expect(screen.queryByRole('treeitem', { name: 'App.tsx' })).toBeNull();
    await userEvent.click(treeitem('src'));
    expect(screen.getByRole('treeitem', { name: 'App.tsx' })).toBeTruthy();
  });

  it('renders href items with an accessible link overlay', () => {
    render(<Tree aria-label="Files" items={[{ id: 'docs', label: 'Docs', href: '/docs' }]} />);
    expect(screen.getByRole('link')).toHaveProperty('href', expect.stringContaining('/docs'));
  });

  it('does not select a row on click when it has an href (link handles navigation, not selection)', async () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        aria-label="Nav"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
        items={[{ id: 'docs', label: 'Docs', href: '/docs' }]}
      />,
    );
    const row = screen.getByRole('treeitem', { name: 'Docs' });
    await userEvent.click(row);
    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(row.getAttribute('aria-selected')).toBe('false');
  });

  it('does not toggle expansion on row click when it has an href (chevron still expands)', async () => {
    render(
      <Tree
        aria-label="Nav"
        items={[
          { id: 'docs', label: 'Docs', href: '/docs', children: [{ id: 'guide', label: 'Guide' }] },
        ]}
      />,
    );
    const row = screen.getByRole('treeitem', { name: 'Docs' });
    await userEvent.click(row);
    expect(row.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('treeitem', { name: 'Guide' })).toBeNull();

    const toggle = row.querySelector('button')!;
    await userEvent.click(toggle);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('treeitem', { name: 'Guide' })).toBeTruthy();
  });

  it('nests the group DOM-inside its owning treeitem, not as a sibling under role="none"', () => {
    render(<Tree aria-label="Files" items={FILE_TREE_ITEMS} defaultExpandedKeys={['src']} />);
    const row = treeitem('src');
    const group = screen.getByRole('group');
    expect(row.contains(group)).toBe(true);
    expect(document.querySelector('[role="none"]')).toBeNull();
  });

  it('expands href branch on chevron click without selecting; link stays on label', async () => {
    const onSelectionChange = vi.fn();
    render(
      <Tree
        aria-label="Nav"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
        items={[
          {
            id: 'docs',
            label: 'Docs',
            href: '/docs',
            children: [{ id: 'guide', label: 'Guide' }],
          },
        ]}
      />,
    );
    const row = screen.getByRole('treeitem', { name: /Docs/ });
    const toggle = row.querySelector('button')!;
    const link = screen.getByRole('link', { name: 'Docs' });

    expect(toggle.getAttribute('style')).toBeNull();
    expect(link.getAttribute('style')).toBeNull();
    expect(link.getAttribute('data-inset')).toBe('after-toggle');

    await userEvent.click(toggle);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('treeitem', { name: 'Guide' })).toBeTruthy();
    expect(onSelectionChange).not.toHaveBeenCalled();

    expect(link).toHaveProperty('href', expect.stringContaining('/docs'));
  });

  it('renders renderStart/renderEnd output for items-array rows', () => {
    render(
      <Tree
        aria-label="Files"
        items={[{ id: 'a', label: 'A' }]}
        renderStart={() => <span data-testid="start" />}
        renderEnd={() => <span data-testid="end" />}
      />,
    );
    expect(screen.getByTestId('start')).toBeTruthy();
    expect(screen.getByTestId('end')).toBeTruthy();
  });

  it('mirrors the expand chevron when direction is rtl', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Tree items={FILE_TREE_ITEMS} aria-label="Files" />
      </DirectionProvider>,
    );
    const row = screen.getByRole('treeitem', { name: /src/i });
    const toggle = row.querySelector('button')!;
    expect(toggle.querySelector('[data-mirror]')).toBeTruthy();

    await userEvent.click(toggle);
    expect(row.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.getAttribute('data-expanded')).toBe('');
    // Collapsed→expanded must keep the mirrored icon; core CSS uses
    // rotate(-90deg) under [dir=rtl] so it points down, not up.
    expect(toggle.querySelector('[data-mirror]')).toBeTruthy();
  });
});
