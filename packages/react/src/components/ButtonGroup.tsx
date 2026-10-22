import type { HTMLAttributes, JSX, ReactNode } from 'react';
import { buttonGroup } from '@var-ui/core';
import { cx } from 'typestyles';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Visually connects adjacent buttons with shared borders.
 *
 * ```tsx
 * <ButtonGroup>
 *   <Button>Left</Button>
 *   <Button>Middle</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export function ButtonGroup({ className, children, ...props }: ButtonGroupProps): JSX.Element {
  const g = buttonGroup();
  return (
    <div {...props} className={cx(g.root, className)} role="group">
      {children}
    </div>
  );
}
