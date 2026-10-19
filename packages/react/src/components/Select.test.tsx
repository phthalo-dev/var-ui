import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Select } from './Select';

const OPTIONS = [
  { id: 'apple', label: 'Apple' },
  { id: 'plum', label: 'Plum' },
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

  it('portals the listbox into document.body by default', async () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));

    const option = await screen.findByRole('option', { name: 'Apple' });
    expect(document.body.contains(option)).toBe(true);
    expect(container.contains(option)).toBe(false);
  });

  it('portals the listbox into a custom portalContainer when provided', async () => {
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'custom-portal');
    document.body.appendChild(container);

    render(
      <IconProvider icons={{}}>
        <Select label="Fruit" options={OPTIONS} portalContainer={container} />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Fruit/ }));

    const option = await screen.findByRole('option', { name: 'Apple' });
    expect(container.contains(option)).toBe(true);

    document.body.removeChild(container);
  });

  it('renders custom item rows from compound parts and updates the trigger on select', async () => {
    render(
      <IconProvider icons={{}}>
        <Select.Root aria-label="Assignee">
          <Select.Trigger placeholder="Select…" />
          <Select.Popover>
            <Select.ListBox>
              <Select.Item id="ada" textValue="Ada Lovelace">
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
              <Select.Item id="ada" textValue="Ada Lovelace">
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
