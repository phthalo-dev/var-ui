'use client';

import { useEffect, useState, type RefObject } from 'react';
import { homeBento } from '@/styles/homeBento';
import { docsThemePresetMeta as docsThemePresets } from '@/themes/presetMeta';
import type { ShowcaseThemeId } from '@/themes/presets';

export type { ShowcaseThemeId };

export type ThemeShowcaseSwitcherProps = {
  selected: ShowcaseThemeId;
  onSelect: (id: ShowcaseThemeId) => void;
  /** Element whose computed custom properties the token readout reports. */
  previewRef?: RefObject<HTMLElement | null>;
  /** Bumped when lazily loaded theme stylesheets arrive, to re-read the token readout. */
  stylesVersion?: number;
};

/** The theme tokens the readout reports, as `[label, custom property]`. */
const READOUT = [
  ['--accent', '--var-ui-color-tone-accent-background'],
  ['--surface', '--var-ui-color-background-surface'],
  ['--radius', '--var-ui-radius-lg'],
  ['--font', '--var-ui-fontFamily-body'],
] as const;

/** Swatch strip colors, resolved under each theme's own class. */
const SWATCHES = [
  'var(--var-ui-color-tone-accent-background)',
  'var(--var-ui-color-tone-accent-foreground)',
  'var(--var-ui-color-tone-success-foreground)',
  'var(--var-ui-color-tone-warning-foreground)',
  'var(--var-ui-color-text-primary)',
] as const;

function readTokens(element: HTMLElement | null | undefined): string[] {
  if (!element) return READOUT.map(() => '…');
  const style = getComputedStyle(element);
  return READOUT.map(([, property]) => {
    const value = style.getPropertyValue(property).trim();
    return property.endsWith('fontFamily-body') ? (value.split(',')[0] ?? value) : value;
  });
}

export function ThemeShowcaseSwitcher({
  selected,
  onSelect,
  previewRef,
  stylesVersion = 0,
}: ThemeShowcaseSwitcherProps) {
  const b = homeBento();
  const [values, setValues] = useState<string[]>(() => READOUT.map(() => '…'));

  useEffect(() => {
    // Wait a frame so lazily loaded theme CSS and the new class have applied.
    const frame = requestAnimationFrame(() => setValues(readTokens(previewRef?.current)));
    const timer = window.setTimeout(() => setValues(readTokens(previewRef?.current)), 300);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [selected, previewRef, stylesVersion]);

  return (
    <div className={b.picker.className}>
      <div className={b.switcher.className} role="radiogroup" aria-label="Preview theme">
        {docsThemePresets.map((theme) => {
          const active = theme.id === selected;
          return (
            <button
              key={theme.id}
              aria-checked={active}
              // Each option wears its own theme: surface, type, radius and accent preview it.
              className={`${b.switcherOption.className} ${theme.className}`}
              onClick={() => onSelect(theme.id)}
              role="radio"
              tabIndex={active ? 0 : -1}
              type="button"
              onKeyDown={(event) => {
                const index = docsThemePresets.findIndex((entry) => entry.id === selected);
                const step =
                  event.key === 'ArrowRight' || event.key === 'ArrowDown'
                    ? 1
                    : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                      ? -1
                      : 0;
                if (step === 0) return;
                event.preventDefault();
                const next =
                  docsThemePresets[
                    (index + step + docsThemePresets.length) % docsThemePresets.length
                  ];
                onSelect(next.id);
                const group = event.currentTarget.parentElement;
                requestAnimationFrame(() => {
                  group?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
                });
              }}
            >
              <span aria-hidden="true" className={b.switcherSwatches.className}>
                {SWATCHES.map((color, index) => (
                  <span
                    key={index}
                    className={b.switcherSwatch.className}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              <span className={b.switcherLabel.className}>
                {theme.label}
                <span aria-hidden="true" className={b.switcherAa.className}>
                  Aa
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" className={b.tokens.className}>
        <span className={b.tokenLine.className}>
          <span className={b.tokenName.className}>
            .{docsThemePresets.find((entry) => entry.id === selected)?.className}
          </span>
          {' {'}
        </span>
        {READOUT.map(([label], index) => (
          <span key={label} className={b.tokenLine.className}>
            &nbsp;&nbsp;<span className={b.tokenName.className}>{label}:</span>
            <span className={b.tokenValue.className}>{values[index]}</span>
          </span>
        ))}
        <span>{'}'}</span>
      </div>
    </div>
  );
}
