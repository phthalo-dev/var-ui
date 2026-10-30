import type { AriaRole, ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { alert } from '@var-ui/core/components/alert';
import type { AlertVariantProps } from '@var-ui/core';
import { toneIcon } from '../internal/toneIcon';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as AlertAppearance } from '@var-ui/core';

export type AlertProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children' | 'role'> & {
  /** Semantic tone that drives color and the default icon. */
  tone: NonNullable<AlertVariantProps['tone']>;
  /** Surface treatment. @default subtle */
  appearance?: NonNullable<AlertVariantProps['appearance']>;
  /** Optional bold headline above the body content. */
  title?: string;
  /** Optional text link rendered below the message body. */
  action?: { href: string; label: string };
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode | null;
  /** Message body. */
  children: ReactNode;
  /**
   * Optional ARIA role for the root (e.g. `status` or `alert` for alerts that appear dynamically).
   * Omitted by default so static alerts are not announced.
   */
  role?: AriaRole;
};

export function Alert({
  tone,
  appearance = alert.defaults.appearance,
  title,
  action,
  icon,
  children,
  role,
  className,
  ref,
  ...rest
}: AlertProps): JSX.Element {
  const a = alert({
    tone,
    appearance,
    contentGap: title ? 'spaced' : 'flush',
  });

  const resolvedIcon = icon === undefined ? <Icon name={toneIcon[tone]} /> : icon;

  return (
    <div {...rest} {...mergeProps(a.root, className)} role={role} ref={ref}>
      {resolvedIcon !== null ? <div {...mergeProps(a.icon)}>{resolvedIcon}</div> : null}
      <div {...mergeProps(a.body)}>
        {title ? <p {...mergeProps(a.title)}>{title}</p> : null}
        <div {...mergeProps(a.content)}>{children}</div>
        {action ? (
          <div {...mergeProps(a.action)}>
            <a {...mergeProps(a.actionLink)} href={action.href} data-alert-action>
              {action.label}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
