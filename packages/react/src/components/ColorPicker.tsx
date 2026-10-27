import type { JSX, KeyboardEvent, Ref } from 'react';
import { useRef } from 'react';
import { colorPicker, type ColorPickerVariantProps } from '@var-ui/core';
import { hsvToHex, hueToPureHex, normalizeHex } from '../color/convert';
import {
  alphaFromPointer,
  bindPointerDrag,
  hueFromPointer,
  saturationValueFromPointer,
  useColorValue,
} from '../color';
import { mergeProps } from 'typestyles';

/** Mantine-compatible preset swatches shown below the sliders by default. */
const DEFAULT_COLOR_SWATCHES = [
  '#25262b',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
] as const;

export type ColorPickerProps = {
  /** Controlled hex color (e.g. `#228be6` or `#228be680` with alpha). */
  value?: string;
  /** Uncontrolled initial color. @default #228be6 */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Preset swatches below the sliders. @default Mantine-compatible preset palette */
  swatches?: string[];
  /** Swatches per row. @default 7 */
  swatchesPerRow?: 7 | 10;
  /** Show an alpha slider and emit 8-digit hex. @default false */
  withAlpha?: boolean;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function swatchColumnsVariant(
  perRow: NonNullable<ColorPickerProps['swatchesPerRow']>,
): NonNullable<ColorPickerVariantProps['swatchColumns']> {
  return perRow === 10 ? 'ten' : 'seven';
}

/**
 * Full HSV color picker with saturation panel, hue slider, optional alpha
 * slider, and preset swatches. Mantine `ColorPicker` equivalent.
 */
export function ColorPicker({
  value,
  defaultValue,
  onChange,
  swatches = [...DEFAULT_COLOR_SWATCHES],
  swatchesPerRow = 7,
  withAlpha = false,
  className,
  ref,
}: ColorPickerProps): JSX.Element {
  const cp = colorPicker({ swatchColumns: swatchColumnsVariant(swatchesPerRow) });
  const { hsv, setHsv, setColor } = useColorValue({ value, defaultValue, onChange, withAlpha });

  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const pureHue = hueToPureHex(hsv.h);
  const opaqueHex = hsvToHex({ ...hsv, a: 1 }, false);
  const currentHex = hsvToHex(hsv, withAlpha);

  const updateSaturation = (event: { clientX: number; clientY: number }) => {
    const rect = saturationRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = saturationValueFromPointer(rect, event.clientX, event.clientY);
    setHsv({ ...hsv, ...next });
  };

  const updateHue = (event: { clientX: number; clientY: number }) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHsv({ ...hsv, h: hueFromPointer(rect, event.clientX) });
  };

  const updateAlpha = (event: { clientX: number; clientY: number }) => {
    const rect = alphaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHsv({ ...hsv, a: alphaFromPointer(rect, event.clientX) });
  };

  const onSaturationKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setHsv({ ...hsv, s: Math.max(0, hsv.s - step) });
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setHsv({ ...hsv, s: Math.min(100, hsv.s + step) });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHsv({ ...hsv, v: Math.min(100, hsv.v + step) });
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHsv({ ...hsv, v: Math.max(0, hsv.v - step) });
    }
  };

  return (
    <div {...mergeProps(cp.root, className)} ref={ref} data-var-ui-color-picker>
      <div
        ref={saturationRef}
        {...mergeProps(cp.saturation)}
        role="application"
        aria-label="Saturation and brightness"
        tabIndex={0}
        style={{
          backgroundColor: pureHue,
          backgroundImage:
            'linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)',
        }}
        onPointerDown={bindPointerDrag(saturationRef, updateSaturation)}
        onKeyDown={onSaturationKeyDown}
      >
        <div
          {...mergeProps(cp.saturationThumb)}
          style={{
            left: `${hsv.s}%`,
            top: `${100 - hsv.v}%`,
            backgroundColor: currentHex,
          }}
        />
      </div>

      <div
        ref={hueRef}
        {...mergeProps(cp.hue)}
        role="slider"
        aria-label="Hue"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(hsv.h)}
        tabIndex={0}
        onPointerDown={bindPointerDrag(hueRef, updateHue)}
      >
        <div {...mergeProps(cp.hueThumb)} style={{ left: `${(hsv.h / 360) * 100}%` }} />
      </div>

      {withAlpha ? (
        <div
          ref={alphaRef}
          {...mergeProps(cp.alpha)}
          role="slider"
          aria-label="Alpha"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((hsv.a ?? 1) * 100)}
          tabIndex={0}
          onPointerDown={bindPointerDrag(alphaRef, updateAlpha)}
        >
          <div
            {...mergeProps(cp.alphaGradient)}
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${opaqueHex})`,
            }}
          />
          <div {...mergeProps(cp.alphaThumb)} style={{ left: `${(hsv.a ?? 1) * 100}%` }} />
        </div>
      ) : null}

      {swatches.length > 0 ? (
        <div {...mergeProps(cp.swatches)} role="listbox" aria-label="Color swatches">
          {swatches.map((swatch) => {
            const selected =
              normalizeHex(swatch).toLowerCase() === normalizeHex(currentHex).toLowerCase();
            return (
              <button
                key={swatch}
                type="button"
                role="option"
                aria-selected={selected}
                {...mergeProps(cp.swatch)}
                data-selected={selected || undefined}
                style={{ backgroundColor: swatch }}
                aria-label={swatch}
                onClick={() => setColor(swatch)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
