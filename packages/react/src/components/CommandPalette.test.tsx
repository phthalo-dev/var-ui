import { describe, expect, it, vi, beforeEach } from 'vite-plus/test';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactElement } from 'react';
import { LayerProvider } from '../layers/LayerProvider';
import { CommandPalette } from './CommandPalette';
import { createCommandPalette, useCommandPalette } from './commandPaletteController';

function wrap(children: ReactElement) {
  return render(<LayerProvider>{children}</LayerProvider>);
}

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
});

describe('CommandPalette', () => {
  it('marks the panel open while the palette is open', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );

    const panel = document.querySelector('.var-ui-command-palette__dialog');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute('data-open')).toBe('');
    expect(panel?.hasAttribute('data-starting-style')).toBe(true);
    expect(panel?.hasAttribute('data-ending-style')).toBe(false);
  });

  it('keeps the native dialog mounted and unmounts only the panel after closing', async () => {
    const { rerender } = wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );

    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen={false}
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );

    await waitFor(() => expect(screen.queryByPlaceholderText('Search…')).toBeNull());
    expect(document.querySelector('.var-ui-command-palette')).not.toBeNull();
    expect(document.querySelector('.var-ui-command-palette__dialog')).toBeNull();
  });

  it('closes the native dialog after the panel exits so focus can be restored', async () => {
    const { rerender } = wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );

    const dialog = document.querySelector<HTMLDialogElement>('.var-ui-command-palette');
    expect(dialog?.open).toBe(true);
    const close = vi.spyOn(dialog as HTMLDialogElement, 'close');

    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen={false}
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );

    await waitFor(() => expect(close).toHaveBeenCalledOnce());
    expect(dialog?.open).toBe(false);
  });

  it('filters items and invokes onAction on Enter', async () => {
    const onAction = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', keywords: ['prefs'] },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={onAction}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'sett');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
    await userEvent.keyboard('{Enter}');
    expect(onAction).toHaveBeenCalledWith('a');
  });

  it('renders group headings and keeps keyboard navigation in order', async () => {
    const onAction = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Alpha', group: 'Library' },
          { id: 'b', title: 'Beta', group: 'Library' },
          { id: 'c', title: 'Gamma', group: 'YouTube' },
        ]}
        onAction={onAction}
      />,
    );
    expect(screen.getByText('Library')).toBeTruthy();
    expect(screen.getByText('YouTube')).toBeTruthy();
    expect(screen.getAllByRole('group')).toHaveLength(2);
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'a');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenCalledWith('c');
  });

  it('hides the heading of a group with no matching items', async () => {
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Alpha', group: 'Library' },
          { id: 'c', title: 'Gamma', group: 'YouTube' },
        ]}
        onAction={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'gam');
    expect(screen.queryByText('Library')).toBeNull();
    expect(screen.getByText('YouTube')).toBeTruthy();
  });

  it('matches via keywords', async () => {
    const onAction = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', keywords: ['prefs'] },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={onAction}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'prefs');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('matches via meta', async () => {
    wrap(
      <CommandPalette
        isOpen
        onOpenChange={() => {}}
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings', meta: 'Preferences' },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'prefer');
    expect(screen.getByText('Open settings')).toBeTruthy();
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('renders empty state when nothing matches', async () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Only' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'zzz');
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('renders empty state without crashing when items is []', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    expect(screen.getByText('No results')).toBeTruthy();
  });

  it('supports a custom emptyLabel and placeholder', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[]}
        onAction={() => {}}
        onOpenChange={() => {}}
        placeholder="Type a command"
        emptyLabel="Nothing found"
      />,
    );
    expect(screen.getByPlaceholderText('Type a command')).toBeTruthy();
    expect(screen.getByText('Nothing found')).toBeTruthy();
  });

  it('resets the query when closed and reopened', async () => {
    const { rerender } = wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText('Search…'), 'sett');
    expect((screen.getByPlaceholderText('Search…') as HTMLInputElement).value).toBe('sett');

    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen={false}
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );
    rerender(
      <LayerProvider>
        <CommandPalette
          isOpen
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={() => {}}
        />
      </LayerProvider>,
    );
    expect((screen.getByPlaceholderText('Search…') as HTMLInputElement).value).toBe('');
  });

  it('toggles open via ⌘K / Ctrl+K when hotkey is enabled (default)', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle on ⌘K when hotkey is disabled', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen={false}
        onOpenChange={onOpenChange}
        hotkey={false}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Open settings' }]}
        onAction={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText('Search…')).toBeTruthy();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports a custom filter function', async () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[
          { id: 'a', title: 'Open settings' },
          { id: 'b', title: 'Sign out' },
        ]}
        onAction={() => {}}
        onOpenChange={() => {}}
        filter={(item) => item.id === 'b'}
      />,
    );
    expect(screen.getByText('Sign out')).toBeTruthy();
    expect(screen.queryByText('Open settings')).toBeNull();
  });

  it('reports query changes via onQueryChange and resets on close', async () => {
    const onQueryChange = vi.fn();
    const props = {
      hotkey: false,
      items: [{ id: 'a', title: 'Alpha' }],
      onAction: () => {},
      onOpenChange: () => {},
      onQueryChange,
    };
    const { rerender } = wrap(<CommandPalette isOpen {...props} />);
    await userEvent.type(screen.getByRole('textbox'), 'al');
    expect(onQueryChange).toHaveBeenLastCalledWith('al');
    rerender(
      <LayerProvider>
        <CommandPalette isOpen={false} {...props} />
      </LayerProvider>,
    );
    await waitFor(() => expect(onQueryChange).toHaveBeenLastCalledWith(''));
  });

  it('skips client-side filtering when filter is false', async () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[{ id: 'a', title: 'Remote hit' }]}
        onAction={() => {}}
        onOpenChange={() => {}}
        filter={false}
      />,
    );
    await userEvent.type(screen.getByRole('textbox'), 'zzz');
    expect(screen.getByText('Remote hit')).toBeTruthy();
  });

  it('shows a busy loading row instead of the empty label while loading', () => {
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        items={[]}
        onAction={() => {}}
        onOpenChange={() => {}}
        isLoading
        loadingLabel="Searching…"
      />,
    );
    expect(screen.getByText('Searching…')).toBeTruthy();
    expect(screen.queryByText('No results')).toBeNull();
    expect(document.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});

describe('CommandPalette item actions and chrome', () => {
  const base = { hotkey: false, onOpenChange: () => {} } as const;

  it('calls the item onSelect, then onAction, and closes by default', async () => {
    const calls: string[] = [];
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Alpha', onSelect: () => calls.push('select') }]}
        onAction={(id) => calls.push(`action:${id}`)}
      />,
    );
    await userEvent.click(screen.getByText('Alpha'));
    expect(calls).toEqual(['select', 'action:a']);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('works with onSelect alone (onAction is optional)', async () => {
    const onSelect = vi.fn();
    wrap(<CommandPalette isOpen {...base} items={[{ id: 'a', title: 'Alpha', onSelect }]} />);
    await userEvent.type(screen.getByRole('textbox'), 'al');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('stays open after an action when closeOnAction is false', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen
        hotkey={false}
        closeOnAction={false}
        onOpenChange={onOpenChange}
        items={[{ id: 'a', title: 'Alpha' }]}
      />,
    );
    await userEvent.click(screen.getByText('Alpha'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('renders an icon and shortcut key caps', () => {
    wrap(
      <CommandPalette
        isOpen
        {...base}
        items={[
          {
            id: 'a',
            title: 'Alpha',
            icon: <svg data-testid="item-icon" />,
            shortcut: ['⌘', 'K'],
          },
          { id: 'b', title: 'Beta', shortcut: 'G P' },
        ]}
      />,
    );
    expect(screen.getByTestId('item-icon')).toBeTruthy();
    const keys = Array.from(document.querySelectorAll('kbd')).map((k) => k.textContent);
    expect(keys).toEqual(['⌘', 'K', 'G P']);
  });

  it('highlights matches only when highlightMatches is set', async () => {
    const items = [{ id: 'a', title: 'Open settings', meta: 'Preferences' }];
    const { rerender } = wrap(<CommandPalette isOpen {...base} items={items} />);
    await userEvent.type(screen.getByRole('textbox'), 'sett');
    expect(document.querySelector('mark')).toBeNull();

    rerender(
      <LayerProvider>
        <CommandPalette isOpen {...base} items={items} highlightMatches />
      </LayerProvider>,
    );
    expect(document.querySelector('mark')?.textContent).toBe('sett');
  });

  it('highlights the right characters when lowercasing changes string length', async () => {
    wrap(
      <CommandPalette isOpen {...base} highlightMatches items={[{ id: 'a', title: 'İstanbul' }]} />,
    );
    await userEvent.type(screen.getByRole('textbox'), 'stan');
    expect(document.querySelector('mark')?.textContent).toBe('stan');
  });

  it('supports a custom hotkey string or array', async () => {
    const onOpenChange = vi.fn();
    wrap(
      <CommandPalette
        isOpen={false}
        onOpenChange={onOpenChange}
        hotkey={['ctrl+shift+p', 'alt+/']}
        items={[]}
      />,
    );
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(onOpenChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Control>}{Shift>}p{/Shift}{/Control}');
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Alt>}/{/Alt}');
    expect(onOpenChange).toHaveBeenCalledTimes(2);
  });

  it('opens and closes from a controller, including outside React', async () => {
    const controller = createCommandPalette();
    wrap(
      <CommandPalette controller={controller} {...base} items={[{ id: 'a', title: 'Alpha' }]} />,
    );
    expect(screen.queryByPlaceholderText('Search…')).toBeNull();

    act(() => controller.open());
    await waitFor(() => expect(screen.getByPlaceholderText('Search…')).toBeTruthy());

    await userEvent.click(screen.getByText('Alpha'));
    expect(controller.getSnapshot()).toBe(false);
  });

  it('useCommandPalette exposes reactive isOpen', () => {
    const { result } = renderHook(() => useCommandPalette());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });

  it('reports onOpenChange(false) once when closing with Escape', async () => {
    const onOpenChange = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <CommandPalette
          isOpen={open}
          hotkey={false}
          items={[{ id: 'a', title: 'Open settings' }]}
          onAction={() => {}}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }
    wrap(<Harness />);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(document.querySelector('dialog')?.open).toBe(false));
    expect(onOpenChange.mock.calls.filter(([n]) => n === false)).toHaveLength(1);
  });
});
