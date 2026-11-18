import type { ToneAppearance } from '@var-ui/core';
import { SegmentedControl } from '@var-ui/react';
import { APPEARANCE_OPTIONS } from './buttonCode';

export type AppearancePickerProps = {
  value: ToneAppearance;
  onChange: (appearance: ToneAppearance) => void;
};

export function AppearancePicker({ value, onChange }: AppearancePickerProps) {
  return (
    <SegmentedControl
      aria-label="Appearance"
      size="sm"
      options={APPEARANCE_OPTIONS.map((option) => ({ value: option.id, label: option.label }))}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as ToneAppearance);
      }}
    />
  );
}
