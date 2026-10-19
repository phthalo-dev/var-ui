import type { Tone } from '@var-ui/core';
import { Icon } from '@var-ui/react';
import { configuratorStyles } from '@/styles/configurator';
import { TONE_OPTIONS } from './buttonCode';

export type ToneSwatchPickerProps = {
  value: Tone;
  onChange: (tone: Tone) => void;
};

export function ToneSwatchPicker({ value, onChange }: ToneSwatchPickerProps) {
  const c = configuratorStyles();

  return (
    <div className={c.toneGrid.className} role="radiogroup" aria-label="Tone">
      {TONE_OPTIONS.map((tone) => {
        const isActive = tone.id === value;
        return (
          <button
            key={tone.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={tone.label}
            title={tone.label}
            className={(isActive ? c.toneSwatchActive : c.toneSwatch).className}
            style={{ backgroundColor: tone.swatch }}
            onClick={() => onChange(tone.id)}
          >
            {isActive ? (
              <span className={c.toneCheck.className} aria-hidden="true">
                <Icon name="check" size="sm" />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
