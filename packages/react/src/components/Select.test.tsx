import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { stubNativePopover } from '../test/nativeOverlayStubs';
import { Select, type SelectOption } from './Select';

stubNativePopover();

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'plum', label: 'Plum' },
];

const MODEL_OPTIONS: SelectOption[] = [
  { value: 'gpt-5', label: 'gpt-5', textValue: 'gpt-5' },
  { value: 'claude-opus', label: 'claude-opus', textValue: 'claude-opus' },
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

  it('renders option groups with headings from sections', async () => {
    render(
      <IconProvider icons={{}}>
        <Select
          label="Model"
          sections={[
            {
              title: 'OpenAI',
              options: [{ value: 'gpt-5', label: 'GPT-5' }],
            },
            {
              title: 'Anthropic',
              options: [
                { value: 'claude-opus', label: 'Claude Opus' },
                { value: 'claude-haiku', label: 'Claude Haiku' },
              ],
            },
          ]}
        />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Model/ }));

    expect(screen.getByRole('option', { name: 'GPT-5' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'Claude Opus' })).toBeTruthy();
    const section = screen.getByRole('option', { name: 'GPT-5' }).closest('section');
    expect(section).toBeTruthy();
    expect(section?.querySelector('header')?.textContent).toBe('OpenAI');

    await userEvent.click(screen.getByRole('option', { name: 'Claude Haiku' }));

    expect(screen.getByRole('button', { name: /Claude Haiku/ })).toBeTruthy();
  });

  it('rejects options and sections together', () => {
    expect(() =>
      render(
        <IconProvider icons={{}}>
          <Select label="Fruit" options={OPTIONS} sections={[{ title: 'All', options: OPTIONS }]} />
        </IconProvider>,
      ),
    ).toThrow(/either `options` or `sections`/);
  });

  it('customizes rows with renderOption and keeps typeahead on textValue', async () => {
    render(
      <IconProvider icons={{}}>
        <Select
          label="Model"
          options={MODEL_OPTIONS}
          renderOption={(option) => (
            <span>
              <span data-testid={`price-${option.value}`}>$2</span>
              {option.label}
            </span>
          )}
        />
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Model/ }));

    expect(screen.getByTestId('price-gpt-5')).toBeTruthy();
    const option = screen.getByRole('option', { name: /gpt-5/ });
    await userEvent.click(option);

    expect(screen.getByRole('button', { name: /gpt-5/ })).toBeTruthy();
  });

  it('customizes the closed trigger with renderValue', () => {
    render(
      <IconProvider icons={{}}>
        <Select
          label="Model"
          placeholder="Choose a model…"
          defaultValue="claude-opus"
          options={MODEL_OPTIONS}
          renderValue={(option) =>
            option ? <span data-testid="trigger-id">{option.value}</span> : 'Choose a model…'
          }
        />
      </IconProvider>,
    );

    expect(screen.getByTestId('trigger-id').textContent).toBe('claude-opus');
  });

  it('gives renderValue null when nothing is selected', () => {
    render(
      <IconProvider icons={{}}>
        <Select
          label="Model"
          placeholder="Choose a model…"
          options={MODEL_OPTIONS}
          renderValue={(option) => (option ? option.label : 'empty-render')}
        />
      </IconProvider>,
    );

    expect(screen.getByRole('button', { name: /empty-render/ })).toBeTruthy();
  });

  it('renders compound Section and Header parts', async () => {
    render(
      <IconProvider icons={{}}>
        <Select.Root aria-label="Assignee">
          <Select.Trigger placeholder="Select…" />
          <Select.Popover>
            <Select.ListBox>
              <Select.Section>
                <Select.Header>Design</Select.Header>
                <Select.Item value="ada" textValue="Ada Lovelace">
                  Ada Lovelace
                </Select.Item>
              </Select.Section>
              <Select.Item value="grace" textValue="Grace Hopper">
                Grace Hopper
              </Select.Item>
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </IconProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: /Assignee/ }));

    const option = screen.getByRole('option', { name: 'Ada Lovelace' });
    expect(option.closest('section')?.querySelector('header')?.textContent).toBe('Design');

    await userEvent.click(option);

    expect(screen.getByRole('button', { name: /Ada Lovelace/ })).toBeTruthy();
  });
});
