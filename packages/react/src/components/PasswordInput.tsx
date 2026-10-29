import type { ComponentPropsWithRef, JSX } from 'react';
import { useState } from 'react';
import { Input, TextField as AriaTextField } from 'react-aria-components';
import { passwordField } from '@var-ui/core/components/passwordField';
import type { PasswordFieldVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { RacFieldFrame, racInvalid } from './FieldFrame';
import type { BaseTextFieldProps, RacTextFieldReplacedKeys } from './TextField';
import { mergeProps } from 'typestyles';
import { mergeRacClassName } from '../internal/racClassName';
import { useControlSize } from '../internal/controlSizeContext';
import { splitRacFieldProps } from '../internal/racFieldProps';

export type PasswordInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  RacTextFieldReplacedKeys | 'type'
> &
  BaseTextFieldProps & {
    /** Control density. Falls back to the surrounding control size, then `md`. */
    size?: NonNullable<PasswordFieldVariantProps['size']>;
    /**
     * Accessible name of the visibility toggle while the password is hidden.
     * @default 'Show password'
     */
    showPasswordLabel?: string;
    /**
     * Accessible name of the visibility toggle while the password is shown.
     * @default 'Hide password'
     */
    hidePasswordLabel?: string;
  };

/**
 * Password field with show/hide visibility toggle. Mantine `PasswordInput`
 * equivalent built on the `passwordField` recipe. `className`/`style` style
 * the root; `ref` and every other native attribute reach the `<input>`.
 */
export function PasswordInput({
  label,
  description,
  errorMessage,
  size,
  showPasswordLabel = 'Show password',
  hidePasswordLabel = 'Hide password',
  className,
  style,
  ...props
}: PasswordInputProps): JSX.Element {
  const contextSize = useControlSize();
  const pf = passwordField({ size: size ?? contextSize ?? 'md' });
  const [visible, setVisible] = useState(false);
  const [rootProps, inputProps] = splitRacFieldProps(props);
  const isDisabled = rootProps.isDisabled;

  return (
    <AriaTextField
      {...rootProps}
      isInvalid={racInvalid(rootProps.isInvalid, errorMessage)}
      className={mergeRacClassName(pf.root, className)}
      style={style}
    >
      <RacFieldFrame slots={pf} label={label} description={description} errorMessage={errorMessage}>
        <div {...mergeProps(pf.inputWrapper)} data-disabled={isDisabled || undefined}>
          <Input {...inputProps} {...mergeProps(pf.input)} type={visible ? 'text' : 'password'} />
          <button
            type="button"
            {...mergeProps(pf.visibilityToggle)}
            onClick={() => setVisible((v) => !v)}
            disabled={isDisabled}
            aria-label={visible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={visible}
          >
            <Icon name={visible ? 'eyeOff' : 'eye'} size="sm" />
          </button>
        </div>
      </RacFieldFrame>
    </AriaTextField>
  );
}
