import type { JSX } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { thumbnail, type ThumbnailVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type ThumbnailProps = {
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
  /** Additional CSS class names merged onto the root element. */
  className?: string;
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
}: ThumbnailProps): JSX.Element {
  const s = thumbnail({ size });
  return (
    <span {...mergeProps(s.root, className)}>
      <img {...mergeProps(s.image)} src={src} alt={alt} />
      {onDismiss ? (
        <AriaButton {...mergeProps(s.dismiss)} aria-label={dismissLabel} onPress={onDismiss}>
          <Icon name="close" size="sm" />
        </AriaButton>
      ) : null}
    </span>
  );
}
