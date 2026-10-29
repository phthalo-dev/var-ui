import type { ComponentPropsWithRef, JSX } from 'react';
import { buttonGroup } from '@var-ui/core/components/buttonGroup';
import { mergeProps } from 'typestyles';

export type ButtonGroupProps = ComponentPropsWithRef<'div'>;

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
    <div role="group" {...props} {...mergeProps(g.root, className)} ref={ref}>
      {children}
    </div>
  );
}
