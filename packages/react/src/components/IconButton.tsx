import type { JSX, ReactNode } from 'react';
import type { IconName } from '@var-ui/core';
import { iconNameList } from '@var-ui/core/icons/iconNames';
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
 * Before 0.7 `name` picked the glyph. It is now the native `<button name>`, so `name="close"` with
 * no `icon` renders an empty button and still type-checks in JS: warn once in development.
 */
let warnedLegacyName = false;
function warnLegacyName(name: unknown, icon: unknown) {
  if (warnedLegacyName || process.env.NODE_ENV === 'production') return;
  if (icon != null || typeof name !== 'string') return;
  if (!(iconNameList as readonly string[]).includes(name)) return;
  warnedLegacyName = true;
  console.warn(
    `[var-ui] <IconButton name="${name}"> has no icon. \`name\` is the native button attribute; ` +
      `use icon="${name}" to render the glyph.`,
  );
}

export function IconButton({
  icon,
  size,
  'data-mirror': dataMirror,
  ...props
}: IconButtonProps): JSX.Element {
  const resolvedSize = useResolvedControlSize(size);
  warnLegacyName(props.name, icon);
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
