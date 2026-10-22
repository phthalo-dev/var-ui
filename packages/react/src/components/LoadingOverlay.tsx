import type { JSX, ReactNode } from 'react';
import { loadingOverlay } from '@var-ui/core';
import { Spinner } from './Spinner';
import { mergeProps } from 'typestyles';

export type LoadingOverlayProps = {
  /** When true, the overlay blocks pointer events and shows a spinner. */
  visible?: boolean;
  /** Accessible label for the loading spinner. @default Loading */
  label?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Blocks interaction over its children while async work runs. Mantine
 * `LoadingOverlay` equivalent — parent must be relatively positioned by
 * the recipe's `root` slot.
 */
export function LoadingOverlay({
  visible = false,
  label = 'Loading',
  className,
  children,
}: LoadingOverlayProps): JSX.Element {
  const lo = loadingOverlay();

  return (
    <div {...mergeProps(lo.root, className)}>
      {children}
      {visible ? (
        <div {...mergeProps(lo.overlay)} aria-busy="true">
          <span {...mergeProps(lo.loader)}>
            <Spinner label={label} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
