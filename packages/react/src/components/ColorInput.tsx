import type { ChangeEvent, JSX } from 'react';
import { useEffect, useId, useState } from 'react';
import { DialogTrigger, Label, Popover as AriaPopover } from 'react-aria-components';
import { colorField, popover, type ColorFieldVariantProps } from '@var-ui/core';
import { isValidHex, normalizeHex } from '../color/convert';
import { useLayer } from '../layers/LayerProvider';
import { useColorValue } from '../color';
import { ColorPicker } from './ColorPicker';
import type { ColorPickerProps } from './ColorPicker';
import type { FieldMeta } from './utils';
import { mergeProps } from './utils';

export type ColorInputProps = FieldMeta &
  Pick<ColorPickerProps, 'swatches' | 'swatchesPerRow' | 'withAlpha'> & {
    /** Controlled hex color value (e.g. `#6366f1`). */
    value?: string;
    /** Uncontrolled initial hex color. */
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    size?: NonNullable<ColorFieldVariantProps['size']>;
    isDisabled?: boolean;
    isRequired?: boolean;
    className?: string;
    name?: string;
    /**
     * Element the picker popover portals into instead of `document.body`.
     * Needed when a subtree renders under a different theme than the page ambient.
     */
    portalContainer?: Element;
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
  size = 'md',
  isDisabled,
  isRequired,
  className,
  name,
  portalContainer,
}: ColorInputProps): JSX.Element {
  const cf = colorField({ size });
  const p = popover();
  const { style: layerStyle } = useLayer();
  const inputId = useId();
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

  const handleTextBlur = () => {
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
    <div {...mergeProps(cf.root, className)}>
      {label ? (
        <Label {...mergeProps(cf.label)} htmlFor={inputId}>
          {label}
        </Label>
      ) : null}
      <div {...mergeProps(cf.inputWrapper)} data-disabled={isDisabled || undefined}>
        <DialogTrigger>
          <button
            type="button"
            {...mergeProps(cf.swatchButton)}
            disabled={isDisabled}
            aria-label="Open color picker"
          >
            <span
              {...mergeProps(cf.swatchPreview)}
              style={{ backgroundColor: swatchColor }}
              aria-hidden
            />
          </button>
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
        <input
          id={inputId}
          {...mergeProps(cf.input)}
          type="text"
          name={name}
          value={textValue}
          placeholder={placeholder}
          disabled={isDisabled}
          required={isRequired}
          aria-required={isRequired || undefined}
          aria-invalid={errorMessage ? true : undefined}
          spellCheck={false}
          autoComplete="off"
          onChange={handleTextChange}
          onBlur={handleTextBlur}
        />
      </div>
      {description ? <p {...mergeProps(cf.description)}>{description}</p> : null}
      {errorMessage ? (
        <p {...mergeProps(cf.error)} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
