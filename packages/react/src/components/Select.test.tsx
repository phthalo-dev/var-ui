import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { Select } from './Select';

stubNativePopover();

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
];

describe('Select', () => {
  it('renders the label and placeholder', () => {
    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );
    expect(screen.getByText('Fruit')).toBeTruthy();
    expect(screen.getByRole('button', { name: /Fruit/ })).toBeTruthy();
  });

  it('passes its size down to the trigger', () => {
    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} size="lg" />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: /Fruit/ }).getAttribute('data-size')).toBe('lg');
  });

  it('uses the recipe default size when none is given', () => {
    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );
    expect(screen.getByRole('button', { name: /Fruit/ }).getAttribute('data-size')).toBe('md');
  });

  it('renders the listbox in place, inside a native popover (no portal)', async () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));

    const option = await screen.findByRole('option', { name: 'Apple' });
    expect(container.contains(option)).toBe(true);
    expect(option.closest('[popover]')?.getAttribute('popover')).toBe('manual');
  });

  it('renders custom item rows from compound parts and updates the trigger on select', async () => {
    render(
      <IconProvider icons={{}}>
        <Select.Root aria-label="Assignee">
          <Select.Trigger placeholder="Select…" />
          <Select.Popover>
            <Select.ListBox>
              <Select.Item value="ada" textValue="Ada Lovelace">
                <span data-testid="row-avatar">A</span>
                Ada Lovelace
              </Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Assignee/ }));

    expect(screen.getByTestId('row-avatar')).toBeTruthy();
    const option = screen.getByRole('option', { name: /Ada Lovelace/ });
    expect(option).toBeTruthy();

    await userEvent.click(option);

    expect(screen.getByRole('button', { name: /Ada Lovelace/ })).toBeTruthy();
    expect(screen.queryByText('Select…')).toBeNull();
  });

  it('renders a custom closed value from Select.Value', async () => {
    render(
      <IconProvider icons={{}}>
        <Select.Root aria-label="Assignee">
          <Select.Trigger>
            <Select.Value>
              {({ selectedText, isPlaceholder }) =>
                isPlaceholder ? (
                  'Select…'
                ) : (
                  <span>
                    <span data-testid="trigger-avatar">{selectedText[0]}</span>
                    {selectedText}
                  </span>
                )
              }
            </Select.Value>
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              <Select.Item value="ada" textValue="Ada Lovelace">
                Ada Lovelace
              </Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Assignee/ }));
    await userEvent.click(await screen.findByRole('option', { name: /Ada Lovelace/ }));

    expect(screen.getByTestId('trigger-avatar').textContent).toBe('A');
    expect(screen.getByRole('button', { name: /Ada Lovelace/ })).toBeTruthy();
  });
});
