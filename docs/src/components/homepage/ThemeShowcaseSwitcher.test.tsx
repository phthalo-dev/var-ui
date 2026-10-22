import { designPaletteList, designStyleList } from '@/themes';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { docsThemePresets } from '@/themes/presets';
import { ThemeShowcaseSwitcher } from './ThemeShowcaseSwitcher';

describe('ThemeShowcaseSwitcher', () => {
  it('lists exactly the 8 showcase themes (see specs/theme-gallery.md)', () => {
    const knownIds = new Set([
      ...designPaletteList.map((entry) => entry.id),
      ...designStyleList.map((entry) => entry.id),
    ]);
    expect(knownIds.size).toBe(8);
    expect(new Set(docsThemePresets.map((theme) => theme.id))).toEqual(knownIds);
  });

  it('marks the selected theme pill as checked', () => {
    render(<ThemeShowcaseSwitcher onSelect={vi.fn()} selected="forest" />);
    expect(screen.getByRole('radio', { name: /Forest/ }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: /Default/ }).getAttribute('aria-checked')).toBe(
      'false',
    );
  });

  it('calls onSelect with the pressed theme id', async () => {
    const onSelect = vi.fn();
    render(<ThemeShowcaseSwitcher onSelect={onSelect} selected="default" />);
    await userEvent.click(screen.getByRole('radio', { name: /Windows 95/ }));
    expect(onSelect).toHaveBeenCalledWith('windows-95');
  });
});
