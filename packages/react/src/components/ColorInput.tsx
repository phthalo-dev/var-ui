import type {
  ChangeEvent,
  ComponentPropsWithRef,
  CSSProperties,
  FocusEvent,
  JSX,
  Ref,
} from 'react';
import { useEffect, useState } from 'react';
import { Pressable } from 'react-aria-components';
import { NativePopover, NativePopoverTrigger } from '../internal/NativePopover';
import { colorField } from '@var-ui/core/components/colorField';
import { popover } from '@var-ui/core/components/popover';
import type { ColorFieldVariantProps } from '@var-ui/core';
import { isValidHex, normalizeHex } from '../color/convert';
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
    /** Controlled hex color value (e.g. `#6366f1`). */
    value?: string;
    /** Uncontrolled initial hex color. */
    defaultValue?: string;
    /** Called with the hex color whenever it changes (typing a valid hex or picking). The native `onChange` also reaches the hex `<input>`. */
    onValueChange?: (value: string) => void;
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<ColorFieldVariantProps['size']>;
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

/**
 * Hex color input with swatch trigger opening a full HSV `ColorPicker` popover.
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
  const cf = colorField({ size: size ?? contextSize ?? 'md', appearance });
  const isField = appearance === 'field';
  const p = popover();
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: userDescribedBy,
  });
  const { color, setColor } = useColorValue({
    value,
    defaultValue,
    onChange: onValueChange,
    withAlpha,
  });
  const [textValue, setTextValue] = useState(color);
  const swatchColor = isValidHex(color) ? normalizeHex(color) : normalizeHex(defaultValue);

  useEffect(() => {
    setTextValue(color);
  }, [color]);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    const next = event.target.value;
    setTextValue(next);
    if (isValidHex(next)) {
      setColor(next);
    }
  };

  const handleTextBlur = (event: FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    if (isValidHex(textValue)) {
      setTextValue(normalizeHex(textValue));
    } else {
      setTextValue(color);
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
                {...mergeProps(cf.swatchPreview)}
                style={{ backgroundColor: swatchColor }}
                aria-hidden
              />
            </button>
          </Pressable>
          <NativePopover {...mergeProps(p.root)}>
            <div {...mergeProps(p.content)}>
              <ColorPicker
                value={color}
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
