import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { loadingOverlay } from '@var-ui/core/components/loadingOverlay';
import { Spinner } from './Spinner';
import { mergeProps } from 'typestyles';

export type LoadingOverlayProps = ComponentPropsWithRef<'div'> & {
  /** When true, the overlay blocks pointer events and shows a spinner. */
  visible?: boolean;
  /** Accessible label for the loading spinner. @default Loading */
  label?: string;
  children: ReactNode;
};

/**
 * Blocks interaction over its children while async work runs: the root is `aria-busy` and the
 * children are `inert` while `visible`. Mantine
 * `LoadingOverlay` equivalent — parent must be relatively positioned by
 * the recipe's `root` slot.
 */
export function LoadingOverlay({
  visible = false,
  label = 'Loading',
  className,
  children,
  ...rest
}: LoadingOverlayProps): JSX.Element {
  const lo = loadingOverlay();

  return (
    <div {...rest} {...mergeProps(lo.root, className)} aria-busy={visible || undefined}>
      {/* `inert` blocks focus and clicks under the overlay. */}
      <div data-loading-overlay-content {...mergeProps(lo.content)} inert={visible}>
        {children}
      </div>
      {visible ? (
        <div {...mergeProps(lo.overlay)}>
          <span {...mergeProps(lo.loader)}>
            <Spinner label={label} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
