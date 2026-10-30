import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Collapsible, CollapsibleGroup } from './Collapsible';

function panelFor(text: string): HTMLElement {
  const el = screen.getByText(text).closest('[role="group"]');
  if (!(el instanceof HTMLElement)) {
    throw new Error(`No disclosure panel found for "${text}"`);
  }
  return el;
}

describe('Collapsible', () => {
  it('expands and collapses on trigger press', async () => {
    render(
      <IconProvider icons={{}}>
        <Collapsible title="Show code" defaultExpanded={false}>
          <pre>const x = 1</pre>
        </Collapsible>
      </IconProvider>,
    );
    expect(panelFor('const x = 1').getAttribute('aria-hidden')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /Show code/i }));
    expect(panelFor('const x = 1').getAttribute('aria-hidden')).not.toBe('true');
  });

  it('renders a custom trigger when provided', () => {
    render(
      <IconProvider icons={{}}>
        <Collapsible trigger={<span>Custom trigger</span>} defaultExpanded>
          <p>Panel body</p>
        </Collapsible>
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: /Custom trigger/i })).toBeTruthy();
    expect(panelFor('Panel body').getAttribute('aria-hidden')).not.toBe('true');
  });

  it('allows only one open panel in a CollapsibleGroup by default', async () => {
    render(
      <IconProvider icons={{}}>
        <CollapsibleGroup>
          <Collapsible id="a" title="Alpha">
            <p>Alpha panel</p>
          </Collapsible>
          <Collapsible id="b" title="Beta">
            <p>Beta panel</p>
          </Collapsible>
        </CollapsibleGroup>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Alpha/i }));
    expect(panelFor('Alpha panel').getAttribute('aria-hidden')).not.toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /Beta/i }));
    expect(panelFor('Beta panel').getAttribute('aria-hidden')).not.toBe('true');
    expect(panelFor('Alpha panel').getAttribute('aria-hidden')).toBe('true');
  });

  it('supports multiple, defaultExpanded and onExpandedChange(string[]) on CollapsibleGroup', async () => {
    const onExpandedChange = vi.fn();
    render(
      <IconProvider icons={{}}>
        <CollapsibleGroup multiple defaultExpanded={['a']} onExpandedChange={onExpandedChange}>
          <Collapsible id="a" title="Alpha">
            <p>Alpha panel</p>
          </Collapsible>
          <Collapsible id="b" title="Beta">
            <p>Beta panel</p>
          </Collapsible>
        </CollapsibleGroup>
      </IconProvider>,
    );
    expect(panelFor('Alpha panel').getAttribute('aria-hidden')).not.toBe('true');
    await userEvent.click(screen.getByRole('button', { name: /Beta/i }));
    expect(onExpandedChange).toHaveBeenLastCalledWith(['a', 'b']);
    expect(panelFor('Alpha panel').getAttribute('aria-hidden')).not.toBe('true');
  });
});
