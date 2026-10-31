import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Combobox } from './Combobox';
import { stubNativePopover } from '../test/nativeOverlayStubs';

stubNativePopover();

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

describe('Combobox', () => {
  it('renders compound parts with combobox recipe class', () => {
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search">
          <Combobox.Input placeholder="Search…" clearable />
          <Combobox.Popover>
            <Combobox.ListBox items={OPTIONS}>
              {(item) => <Combobox.Item value={item.value}>{item.label}</Combobox.Item>}
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      </IconProvider>,
    );

    const input = screen.getByRole('combobox', { name: 'Search' });
    expect(input.className).toContain('var-ui-combobox');
  });

  it('passes its size down to the input shell', () => {
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search" size="lg">
          <Combobox.Input placeholder="Search…" />
          <Combobox.Popover>
            <Combobox.ListBox items={OPTIONS}>
              {(item) => <Combobox.Item value={item.value}>{item.label}</Combobox.Item>}
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      </IconProvider>,
    );

    const wrapper = document.querySelector('.var-ui-combobox__inputWrapper');
    expect(wrapper?.getAttribute('data-size')).toBe('lg');
  });

  it('uses the recipe default size when none is given', () => {
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search">
          <Combobox.Input placeholder="Search…" />
        </Combobox.Root>
      </IconProvider>,
    );

    const wrapper = document.querySelector('.var-ui-combobox__inputWrapper');
    expect(wrapper?.getAttribute('data-size')).toBe('md');
  });

  it('calls validate with { inputValue, value } (no selectedKey)', () => {
    const validate = vi.fn(() => null);
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search" defaultValue="b" validate={validate}>
          <Combobox.Input />
          <Combobox.Popover>
            <Combobox.ListBox items={OPTIONS}>
              {(item) => <Combobox.Item value={item.value}>{item.label}</Combobox.Item>}
            </Combobox.ListBox>
          </Combobox.Popover>
        </Combobox.Root>
      </IconProvider>,
    );
    expect(validate).toHaveBeenCalled();
    const arg = (
      validate.mock.calls[validate.mock.calls.length - 1] as unknown as [Record<string, unknown>]
    )[0];
    expect(Object.keys(arg).sort()).toEqual(['inputValue', 'value']);
    expect(arg.value).toBe('b');
  });
});
