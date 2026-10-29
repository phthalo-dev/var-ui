import type { JSX, ReactNode, Ref } from 'react';
import { Children, useState } from 'react';
import { avatar, avatarGroup } from '@var-ui/core/components/avatar';
import { statusDot } from '@var-ui/core/components/statusDot';
import type { AvatarVariantProps, Tone } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type AvatarProps = AvatarVariantProps & {
  /** Image URL. When missing or on load error, initials are shown instead. */
  src?: string;
  /** Accessible description of the image. */
  alt?: string;
  /** Display name — initials fallback uses the first letter of the first two words. */
  name?: string;
  /** Optional presence indicator shown on the avatar rim. */
  status?: Tone;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<span>` element. */
  ref?: Ref<HTMLSpanElement>;
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('');
}

/**
 * Image avatar with initials fallback and optional presence dot.
 *
 * ```tsx
 * <Avatar src={user.photo} name={user.name} status="success" />
 * ```
 */
export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
  ref,
}: AvatarProps): JSX.Element {
  const [errored, setErrored] = useState(false);
  const a = avatar({ size });
  const showImage = Boolean(src) && !errored;
  return (
    <span {...mergeProps(a.root, className)} ref={ref}>
      {showImage ? (
        <img
          {...mergeProps(a.image)}
          src={src}
          alt={alt ?? name ?? ''}
          onError={() => setErrored(true)}
        />
      ) : (
        <span
          {...mergeProps(a.initials)}
          aria-hidden={alt || name ? undefined : true}
          role={alt || name ? 'img' : undefined}
          aria-label={alt ?? name}
        >
          {name ? initialsOf(name) : '?'}
        </span>
      )}
      {status ? (
        <span {...mergeProps(a.status)} data-avatar-status>
          <span {...mergeProps(statusDot({ tone: status }))} />
        </span>
      ) : null}
    </span>
  );
}

export type AvatarGroupProps = {
  /** Avatar elements to stack with overlap. */
  children: ReactNode;
  /** Maximum avatars before collapsing into a "+N" chip. @default 4 */
  max?: number;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Ref to the underlying `<span>` element. */
  ref?: Ref<HTMLSpanElement>;
};

/**
 * Overlapping stack of avatars with overflow count.
 *
 * ```tsx
 * <AvatarGroup max={3}>{users.map(u => <Avatar key={u.id} name={u.name} />)}</AvatarGroup>
 * ```
 */
export function AvatarGroup({ children, max = 4, className, ref }: AvatarGroupProps): JSX.Element {
  const g = avatarGroup();
  const items = Children.toArray(children);
  const visible = items.slice(0, max);
  const hidden = items.length - visible.length;
  return (
    <span {...mergeProps(g.root, className)} ref={ref}>
      {visible.map((child, index) => (
        <span {...mergeProps(g.item)} key={index}>
          {child}
        </span>
      ))}
      {hidden > 0 ? <span {...mergeProps(g.overflow)}>+{hidden}</span> : null}
    </span>
  );
}
