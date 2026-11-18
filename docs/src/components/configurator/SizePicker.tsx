import { SegmentedControl } from '@var-ui/react';
import { SIZE_OPTIONS } from './buttonCode';

type Size = (typeof SIZE_OPTIONS)[number];

export type SizePickerProps = {
  value: Size;
  onChange: (size: Size) => void;
};

const SIZE_LABELS: Record<Size, string> = {
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
};

export function SizePicker({ value, onChange }: SizePickerProps) {
  return (
    <SegmentedControl
      aria-label="Size"
      size="sm"
      options={SIZE_OPTIONS.map((size) => ({ value: size, label: SIZE_LABELS[size] }))}
      value={value}
      onValueChange={(next) => {
        if (next) onChange(next as Size);
      }}
    />
  );
}
