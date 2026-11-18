import type {
  ChangeEvent,
  ComponentPropsWithRef,
  CSSProperties,
  FocusEvent,
  JSX,
  Ref,
} from 'react';
import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-aria-components';
import { NativePopover, NativePopoverTrigger } from '../internal/NativePopover';
import { colorField } from '@var-ui/core/components/colorField';
import { popover } from '@var-ui/core/components/popover';
import type { ColorFieldVariantProps, ControlSize } from '@var-ui/core';
import { isValidHex, normalizeHex, rgbToHex } from '../color/convert';
import { useColorValue } from '../color';
import { ColorPicker } from './ColorPicker';
import type { ColorPickerProps } from './ColorPicker';
import type { FieldMeta } from './Field';
import { mergeProps } from 'typestyles';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { useControlSize } from '../internal/controlSizeContext';

export type ColorInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'value'
  | 'defaultValue'
  | 'size'
  | 'type'
  | 'className'
  | 'style'
  | 'ref'
  | 'children'
  | 'disabled'
  | 'required'
  | 'readOnly'
> &
  FieldMeta &
  Pick<ColorPickerProps, 'swatches' | 'swatchesPerRow' | 'withAlpha'> & {
    /** Controlled color value (e.g. `#6366f1`; with `format="css"`, any CSS color). */
    value?: string;
    /**
     * Uncontrolled initial color. With `format="css"` it is also what the swatch shows while the
     * value is empty (e.g. the token default a theme editor overrides).
     */
    defaultValue?: string;
    /** Called with the color whenever it changes (typing a valid color or picking). The native `onChange` also reaches the text `<input>`. */
    onValueChange?: (value: string) => void;
    /**
     * `hex` accepts and normalizes hex colors only. `css` accepts any CSS color the browser
     * understands (`var(--brand)`, `oklch(…)`, `rebeccapurple`) and passes it through as typed;
     * an empty value is allowed. The swatch paints the color as given, and the picker starts from
     * its resolved value and writes hex.
     * @default 'hex'
     */
    format?: NonNullable<ColorFieldVariantProps['format']>;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: ControlSize;
    /**
     * `field` shows the hex input beside the swatch. `swatch` renders only the
     * swatch button and picker.
     * @default 'field'
     */
    appearance?: NonNullable<ColorFieldVariantProps['appearance']>;
    /**
     * Accessible name for the swatch button.
     * @default 'Open color picker'
     */
    swatchLabel?: string;
    /** Marks the field invalid; defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** Disables the field and the swatch button. */
    disabled?: boolean;
    /** Marks the hex input required. */
    required?: boolean;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /** Inline style for the root element. */
    style?: CSSProperties;
    /** Ref to the hex `<input>` (not rendered when `appearance="swatch"`). */
    ref?: Ref<HTMLInputElement>;
  };

/** Whether the browser parses `value` as a CSS color (`var()` always passes; checked at use). */
function isCssColor(value: string): boolean {
  if (isValidHex(value)) return true;
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return false;
  return CSS.supports('color', value);
}

/** Hex of the color an element paints (any CSS color syntax), via a 1×1 canvas. */
function resolveCssColor(element: HTMLElement | null): string | undefined {
  if (!element || typeof document === 'undefined') return undefined;
  try {
    const painted = getComputedStyle(element).backgroundColor;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx || !painted) return undefined;
    ctx.fillStyle = painted;
    ctx.fillRect(0, 0, 1, 1);
    const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
    return rgbToHex({ r, g, b, a: 1 });
  } catch {
    return undefined;
  }
}

/**
 * Color input with a swatch trigger opening a full HSV `ColorPicker` popover. Hex by default;
 * `format="css"` takes any CSS color (theme editors that hold `var()` / `oklch()` values).
 * Mantine `ColorInput` equivalent.
 */
export function ColorInput({
  label,
  description,
  errorMessage,
  value,
  defaultValue = '#6366f1',
  onValueChange,
  onChange,
  placeholder,
  swatches,
  swatchesPerRow,
  withAlpha,
  size,
  appearance = 'field',
  format = 'hex',
  swatchLabel = 'Open color picker',
  invalid,
  disabled,
  required,
  className,
  style,
  name,
  ref,
  id,
  'aria-describedby': userDescribedBy,
  onBlur,
  ...rest
}: ColorInputProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize ?? 'md';
  const cf = colorField({ size: resolvedSize, appearance, format });
  const isField = appearance === 'field';
  const isCss = format === 'css';
  const p = popover();
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: userDescribedBy,
  });
  // Hex state (unused in `css` format, which must not feed non-hex values to the HSV math).
  const hex = useColorValue({
    value: isCss ? undefined : value,
    defaultValue: isCss ? '#000000' : defaultValue,
    onChange: isCss ? undefined : onValueChange,
    withAlpha,
  });
  // `css` format keeps the value as typed (no hex normalization).
  const [cssUncontrolled, setCssUncontrolled] = useState(defaultValue);
  const color = isCss ? (value !== undefined ? value : cssUncontrolled) : hex.color;
  const setColor = (next: string) => {
    if (!isCss) {
      hex.setColor(next);
      return;
    }
    if (value === undefined) setCssUncontrolled(next);
    onValueChange?.(next);
  };
  const accepts = (next: string) =>
    isCss ? next.trim() === '' || isCssColor(next.trim()) : isValidHex(next);
  const [textValue, setTextValue] = useState(color);
  const swatchColor = isCss
    ? color.trim() && isCssColor(color.trim())
      ? color.trim()
      : defaultValue
    : isValidHex(color)
      ? normalizeHex(color)
      : normalizeHex(defaultValue);

  // The picker works in hex: a `css` value is resolved through the painted swatch.
  const swatchRef = useRef<HTMLSpanElement>(null);
  const [resolvedHex, setResolvedHex] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!isCss) return;
    setResolvedHex(
      isValidHex(swatchColor) ? normalizeHex(swatchColor) : resolveCssColor(swatchRef.current),
    );
  }, [isCss, swatchColor]);
  const pickerValue = isCss ? (resolvedHex ?? '#000000') : color;

  useEffect(() => {
    setTextValue(color);
  }, [color]);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    const next = event.target.value;
    setTextValue(next);
    if (accepts(next)) {
      setColor(isCss ? next.trim() : next);
    }
  };

  const handleTextBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    if (!accepts(textValue)) {
      setTextValue(color);
    } else {
      setTextValue(isCss ? textValue.trim() : normalizeHex(textValue));
    }
  };

  const handlePickerChange = (next: string) => {
    setColor(next);
    setTextValue(next);
  };

  return (
    <FieldFrame
      slots={cf}
      frame={frame}
      chrome={isField}
      label={label}
      description={description}
      errorMessage={errorMessage}
      errorRole="alert"
      className={className}
      style={style}
    >
      <div {...mergeProps(cf.inputWrapper)} data-disabled={disabled || undefined}>
        <NativePopoverTrigger>
          <Pressable>
            <button
              type="button"
              {...mergeProps(cf.swatchButton)}
              disabled={disabled}
              aria-label={swatchLabel}
            >
              <span
                ref={swatchRef}
                {...mergeProps(cf.swatchPreview)}
                style={{ backgroundColor: swatchColor }}
                aria-hidden
              />
            </button>
          </Pressable>
          <NativePopover {...mergeProps(p.root)}>
            <div {...mergeProps(p.content)}>
              <ColorPicker
                size={resolvedSize}
                value={pickerValue}
                onValueChange={handlePickerChange}
                swatches={swatches}
                swatchesPerRow={swatchesPerRow}
                withAlpha={withAlpha}
              />
            </div>
          </NativePopover>
        </NativePopoverTrigger>
        {isField ? (
          <input
            spellCheck={false}
            autoComplete="off"
            {...rest}
            {...mergeProps(cf.input)}
            {...frame.controlProps}
            ref={ref}
            type="text"
            name={name}
            value={textValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
          />
        ) : name ? (
          <input type="hidden" name={name} value={color} />
        ) : null}
      </div>
    </FieldFrame>
  );
}
