import type { JSX, ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { Button, type ButtonAsButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonAsButtonProps, 'children' | 'layout' | 'href'> & {
  /** Accessible name. Required: the button has no visible text. */
  'aria-label': string;
  /**
   * Icon to render: a registry icon name (`'close'`), or any node (an `<svg>`, a custom icon).
   * `name` stays the native `<button name>` attribute.
   */
  icon: IconName | Exclude<ReactNode, string>;
  'data-mirror'?: boolean | '';
};

export function IconButton({
  icon,
  size = 'md',
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  return (
    <Button {...props} size={size} layout="icon">
      {typeof icon === 'string' ? (
        <Icon
          name={icon as IconName}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          data-mirror={dataMirror}
        />
      ) : (
        icon
      )}
    </Button>
  );
}
