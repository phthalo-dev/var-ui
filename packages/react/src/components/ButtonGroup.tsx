import type { HTMLAttributes, JSX, ReactNode, Ref } from 'react';
import { buttonGroup } from '@var-ui/core/components/buttonGroup';
import { cx } from 'typestyles';

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
export function ButtonGroup({ className, children, ref, ...props }: ButtonGroupProps): JSX.Element {
  const g = buttonGroup();
  return (
    <div {...props} className={cx(g.root, className)} role="group" ref={ref}>
      {children}
    </div>
  );
}
