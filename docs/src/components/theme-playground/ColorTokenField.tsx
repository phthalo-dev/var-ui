'use client';

import { TextField } from '@var-ui/react';
import { themePlaygroundStyles } from '@/styles/themePlayground';
import type { PlaygroundColorField } from './themePlaygroundTokens';

type ColorTokenFieldProps = {
  field: PlaygroundColorField;
  value?: string;
  onChange: (path: string, value: string) => void;
};

function swatchColor(value: string | undefined, fallback: string): string {
  if (value && value.trim()) return value.trim();
  const resolved = typeof fallback === 'string' ? fallback : '';
  if (resolved.startsWith('var(')) return 'transparent';
  return resolved;
}

export function ColorTokenField({ field, value, onChange }: ColorTokenFieldProps) {
  const s = themePlaygroundStyles();

  return (
    <div className={s.colorRow.className}>
      <span
        className={s.colorSwatch.className}
        style={{ backgroundColor: swatchColor(value, field.defaultValue) }}
        aria-hidden
      />
      <TextField
        aria-label={field.label}
        size="sm"
        value={value ?? ''}
        placeholder={field.defaultValue}
        onValueChange={(next) => onChange(field.path, next)}
      />
    </div>
  );
}
