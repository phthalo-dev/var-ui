import type { ComponentPropsWithRef, JSX } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { thumbnail } from '@var-ui/core/components/thumbnail';
import type { ThumbnailVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type ThumbnailProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** Image URL for the preview. */
  src: string;
  /** Accessible description of the image. */
  alt: string;
  /** Tile dimensions. @default md */
  size?: NonNullable<ThumbnailVariantProps['size']>;
  /** When provided, renders a remove button that calls this handler on press. */
  onDismiss?: () => void;
  /** Accessible label for the remove button. @default Remove */
  dismissLabel?: string;
};

/**
 * Attachment/media preview tile with an optional remove button.
 *
 * ```tsx
 * <Thumbnail src={file.previewUrl} alt={file.name} onDismiss={() => remove(file)} />
 * ```
 */
export function Thumbnail({
  src,
  alt,
  size = 'md',
  onDismiss,
  dismissLabel = 'Remove',
  className,
  ref,
  ...rest
}: ThumbnailProps): JSX.Element {
  const s = thumbnail({ size });
  return (
    <span {...rest} {...mergeProps(s.root, className)} ref={ref}>
      <img {...mergeProps(s.image)} src={src} alt={alt} />
      {onDismiss ? (
        <AriaButton {...mergeProps(s.dismiss)} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </span>
  );
}
