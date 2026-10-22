import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Combobox } from './Combobox';

const OPTIONS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
];

describe('Combobox', () => {
  it('renders compound parts with combobox recipe class', () => {
    render(
      <IconProvider icons={{}}>
        <Combobox.Root aria-label="Search">
          <Combobox.Input placeholder="Search…" clearable />
          <Combobox.Popover>
            <Combobox.ListBox items={OPTIONS}>
              {(item) => <Combobox.Item id={item.id}>{item.label}</Combobox.Item>}
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
              {(item) => <Combobox.Item id={item.id}>{item.label}</Combobox.Item>}
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
});
