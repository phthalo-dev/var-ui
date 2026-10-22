'use client';

import { homeBento } from '@/styles/homeBento';
import { docsThemePresets, type ShowcaseThemeId } from '@/themes/presets';

export type { ShowcaseThemeId };

export type ThemeShowcaseSwitcherProps = {
  selected: ShowcaseThemeId;
  onSelect: (id: ShowcaseThemeId) => void;
};

export function ThemeShowcaseSwitcher({ selected, onSelect }: ThemeShowcaseSwitcherProps) {
  const b = homeBento();

  return (
    <div className={b.switcher.className} role="radiogroup" aria-label="Preview theme">
      {docsThemePresets.map((theme) => {
        const isActive = theme.id === selected;
        return (
          <button
            key={theme.id}
            aria-checked={isActive}
            className={(isActive ? b.switcherPillActive : b.switcherPill).className}
            onClick={() => onSelect(theme.id)}
            role="radio"
            type="button"
          >
            <span
              className={b.switcherSwatch.className}
              style={{ backgroundColor: theme.swatch }}
            />
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
