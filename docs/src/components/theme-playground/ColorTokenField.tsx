'use client';

import { ColorInput } from '@var-ui/react';
import type { PlaygroundColorField } from './themePlaygroundTokens';

type ColorTokenFieldProps = {
  field: PlaygroundColorField;
  value?: string;
  onChange: (path: string, value: string) => void;
};

/**
 * One theme color override: a `css`-format `ColorInput`, so token references (`var(--…)`) and
 * `oklch()` values are accepted as typed. Unset, the swatch paints the live token and the
 * placeholder names its default (as a token name; the full value is in the tooltip and on focus).
 */
export function ColorTokenField({ field, value, onChange }: ColorTokenFieldProps) {
  return (
    <ColorInput
      format="css"
      size="sm"
      label={field.label}
      value={value ?? ''}
      defaultValue={field.cssVar}
      // Light value as the placeholder (`phthalo-7`); the light / dark pair is in the tooltip.
      placeholder={field.defaultValue.split(' / ')[0]}
      title={value || field.defaultValue}
      swatchLabel={`Pick ${field.label.toLowerCase()} color`}
      onValueChange={(next) => onChange(field.path, next)}
    />
  );
}
