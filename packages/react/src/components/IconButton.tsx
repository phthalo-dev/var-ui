import type { JSX, ReactNode, Ref } from 'react';
import { Button as AriaButton, type ButtonProps as RACButtonProps } from 'react-aria-components';
import { button, type ButtonVariantProps, type IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type IconButtonProps = Omit<RACButtonProps, 'className' | 'children'> & {
  'aria-label': string;
  name: IconName;
  className?: string;
  icon?: ReactNode;
  'data-mirror'?: boolean | '';
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonVariantProps, 'layout'>;

export function IconButton({
  name,
  icon,
  tone,
  appearance,
  size = 'md',
  elevated,
  className,
  'data-mirror': dataMirror,
  ref,
  ...props
}: IconButtonProps): JSX.Element {
  const styles = button({ tone, appearance, size, layout: 'icon', elevated });
  return (
    <AriaButton {...props} {...mergeProps(styles, className)} ref={ref}>
      {icon ?? (
        <Icon
          name={name}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          data-mirror={dataMirror}
        />
      )}
    </AriaButton>
  );
}
