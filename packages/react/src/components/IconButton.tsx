import type { JSX, ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { Icon } from '../icons';
import { Button, type ButtonAsButtonProps } from './Button';
import { useResolvedControlSize } from '../internal/controlSizeContext';

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

/**
 * An icon-only button with no icon is always a bug: an empty, unlabelled-looking control. It is
 * reachable from JS or a cast (`icon` is required in TypeScript), so warn once in development.
 */
let warnedEmpty = false;
function warnEmpty(label: string | undefined) {
  if (warnedEmpty || process.env.NODE_ENV === 'production') return;
  warnedEmpty = true;
  console.warn(
    `[var-ui] <IconButton aria-label="${label ?? ''}"> has no \`icon\`, so it renders empty. ` +
      'Pass `icon` (a registry name or a node).',
  );
}

export function IconButton({
  icon,
  size,
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  const resolvedSize = useResolvedControlSize(size);
  if (icon == null) warnEmpty(props['aria-label']);
  return (
    <Button {...props} size={resolvedSize} layout="icon">
      {typeof icon === 'string' ? (
        <Icon name={icon as IconName} size={resolvedSize} data-mirror={dataMirror} />
      ) : (
        icon
      )}
    </Button>
  );
}
