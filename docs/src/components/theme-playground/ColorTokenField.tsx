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
 * placeholder names its default.
 */
export function ColorTokenField({ field, value, onChange }: ColorTokenFieldProps) {
  return (
    <ColorInput
      format="css"
      size="sm"
      label={field.label}
      value={value ?? ''}
      defaultValue={field.cssVar}
      placeholder={field.defaultValue}
      title={value || field.defaultValue}
      swatchLabel={`Pick ${field.label.toLowerCase()} color`}
      onValueChange={(next) => onChange(field.path, next)}
    />
  );
}
