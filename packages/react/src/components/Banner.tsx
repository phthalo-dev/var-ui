import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { banner } from '@var-ui/core/components/banner';
import type { BannerVariantProps } from '@var-ui/core';
import { toneIcon } from '../internal/toneIcon';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type BannerProps = Omit<ComponentPropsWithRef<'div'>, 'title' | 'children'> &
  BannerVariantProps & {
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
  ...rest
}: BannerProps): JSX.Element {
  const b = banner({ tone, appearance });
  const glyph = icon === undefined ? <Icon name={toneIcon[tone]} /> : icon;
  return (
    <div
      role={tone === 'warning' || tone === 'danger' ? 'alert' : 'status'}
      {...rest}
      {...mergeProps(b.root, className)}
      ref={ref}
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
