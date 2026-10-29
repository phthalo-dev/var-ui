import type { JSX, ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { Button, type ButtonAsButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonAsButtonProps, 'children' | 'layout' | 'href'> & {
  'aria-label': string;
  /**
   * Icon to render. Note: this shadows the native `<button name>` attribute,
   * which is therefore not reachable through IconButton.
   */
  name: IconName;
  icon?: ReactNode;
  'data-mirror'?: boolean | '';
};

export function IconButton({
  name,
  icon,
  size = 'md',
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  return (
    <Button {...props} size={size} layout="icon">
      {icon ?? (
        <Icon
          name={name}
          size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          data-mirror={dataMirror}
        />
      )}
    </Button>
  );
}
