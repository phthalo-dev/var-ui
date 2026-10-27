import type { JSX, ReactNode, Ref } from 'react';
import { alert, type AlertVariantProps, type IconName, type Tone } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as AlertAppearance } from '@var-ui/core';

/** Tone → registry glyph. Danger uses the `error` glyph; neutral and accent use `info`. */
const variantIconName: Record<Tone, IconName> = {
  neutral: 'info',
  accent: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export type AlertProps = {
  /** Semantic tone that drives color and the default icon. */
  variant: NonNullable<AlertVariantProps['tone']>;
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
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export function Alert({
  variant,
  appearance = alert.defaults.appearance,
  title,
  action,
  icon,
  children,
  className,
  ref,
}: AlertProps): JSX.Element {
  const a = alert({
    tone: variant,
    appearance,
    contentGap: title ? 'spaced' : 'flush',
  });

  const resolvedIcon = icon === undefined ? <Icon name={variantIconName[variant]} /> : icon;

  return (
    <div
      {...mergeProps(a.root, className)}
      data-alert
      data-alert-variant={variant}
      data-alert-appearance={appearance}
      ref={ref}
    >
      {resolvedIcon !== null ? (
        <div {...mergeProps(a.icon)} data-alert-icon>
          {resolvedIcon}
        </div>
      ) : null}
      <div {...mergeProps(a.body)}>
        {title ? <p {...mergeProps(a.title)}>{title}</p> : null}
        <div {...mergeProps(a.content)} data-alert-content>
          {children}
        </div>
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
