import type {
  ChangeEvent,
  ComponentPropsWithRef,
  CSSProperties,
  FocusEvent,
  JSX,
  Ref,
} from 'react';
import { useEffect, useState } from 'react';
import { DialogTrigger, Popover as AriaPopover, Pressable } from 'react-aria-components';
import { colorField } from '@var-ui/core/components/colorField';
import { popover } from '@var-ui/core/components/popover';
import type { ColorFieldVariantProps } from '@var-ui/core';
import { isValidHex, normalizeHex } from '../color/convert';
import { useLayer } from '../layers/LayerProvider';
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
  | 'onChange'
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
    onChange?: (value: string) => void;
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
    isDisabled?: boolean;
    isRequired?: boolean;
    /** Additional CSS class names merged onto the root element. */
    className?: string;
    /** Inline style for the root element. */
    style?: CSSProperties;
    /**
     * Element the picker popover portals into instead of `document.body`.
     * Needed when a subtree renders under a different theme than the page ambient.
     */
    portalContainer?: Element;
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
  onChange,
  placeholder,
  swatches,
  swatchesPerRow,
  withAlpha,
  size,
  appearance = 'field',
  swatchLabel = 'Open color picker',
  invalid,
  isDisabled,
  isRequired,
  className,
  style,
  name,
  portalContainer,
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
  const { style: layerStyle } = useLayer();
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: userDescribedBy,
  });
  const { color, setColor } = useColorValue({ value, defaultValue, onChange, withAlpha });
  const [textValue, setTextValue] = useState(color);
  const swatchColor = isValidHex(color) ? normalizeHex(color) : normalizeHex(defaultValue);

  useEffect(() => {
    setTextValue(color);
  }, [color]);

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
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
      <div {...mergeProps(cf.inputWrapper)} data-disabled={isDisabled || undefined}>
        <DialogTrigger>
          <Pressable>
            <button
              type="button"
              {...mergeProps(cf.swatchButton)}
              disabled={isDisabled}
              aria-label={swatchLabel}
            >
              <span
                {...mergeProps(cf.swatchPreview)}
                style={{ backgroundColor: swatchColor }}
                aria-hidden
              />
            </button>
          </Pressable>
          <AriaPopover
            {...mergeProps(p.root)}
            style={layerStyle}
            UNSTABLE_portalContainer={portalContainer}
          >
            <div {...mergeProps(p.content)}>
              <ColorPicker
                value={color}
                onChange={handlePickerChange}
                swatches={swatches}
                swatchesPerRow={swatchesPerRow}
                withAlpha={withAlpha}
              />
            </div>
          </AriaPopover>
        </DialogTrigger>
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
            disabled={isDisabled}
            required={isRequired}
            aria-required={isRequired || undefined}
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
