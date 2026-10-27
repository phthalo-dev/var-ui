import type { JSX, ReactNode, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { banner, type BannerVariantProps, type IconName, type Tone } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

const toneIcon: Record<Tone, IconName> = {
  neutral: 'info',
  accent: 'info',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

export type BannerProps = BannerVariantProps & {
  /** Optional bold headline shown before the body text. */
  title?: string;
  /** Override the default tone glyph; pass null to hide the icon slot. */
  icon?: ReactNode | null;
  /** Inline action elements (links, small buttons). */
  actions?: ReactNode;
  /** When provided, renders a dismiss button that calls this handler on press. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default Dismiss */
  dismissLabel?: string;
  /** Announcement body text. */
  children: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Full-width page announcement with tone icon, actions, and optional dismiss.
 *
 * ```tsx
 * <Banner tone="warning" title="Scheduled maintenance" onDismiss={hide}>
 *   Sunday 02:00–04:00 UTC.
 * </Banner>
 * ```
 */
export function Banner({
  tone = 'info',
  appearance = 'subtle',
  title,
  icon,
  actions,
  onDismiss,
  dismissLabel = 'Dismiss',
  children,
  className,
  ref,
}: BannerProps): JSX.Element {
  const b = banner({ tone, appearance });
  const glyph = icon === undefined ? <Icon name={toneIcon[tone]} /> : icon;
  return (
    <div
      {...mergeProps(b.root, className)}
      ref={ref}
      role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
    >
      {glyph !== null ? <span {...mergeProps(b.icon)}>{glyph}</span> : null}
      <div {...mergeProps(b.content)}>
        {title ? <span {...mergeProps(b.title)}>{title}</span> : null}
        <span>{children}</span>
      </div>
      {actions ? <div {...mergeProps(b.actions)}>{actions}</div> : null}
      {onDismiss ? (
        <AriaButton {...mergeProps(b.dismiss)} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </div>
  );
}
