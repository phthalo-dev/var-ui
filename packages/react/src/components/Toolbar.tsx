import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { toolbar } from '@var-ui/core/components/toolbar';
import type { ToolbarVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ToolbarProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'role'> & {
  /** Content aligned to the start (leading) edge. */
  startContent?: ReactNode;
  /** Content centered between the start and end slots; forces a grid layout. */
  centerContent?: ReactNode;
  /** Content aligned to the end (trailing) edge. */
  endContent?: ReactNode;
  /** Accessible label for the toolbar (required — applied as aria-label). */
  label: string;
  /** Control density. @default md */
  size?: NonNullable<ToolbarVariantProps['size']>;
  /** Layout axis. @default horizontal */
  orientation?: NonNullable<ToolbarVariantProps['orientation']>;
};

/**
 * A row (or column) of grouped actions with optional start/center/end
 * regions. Renders a native `role="toolbar"` container; children keep their
 * natural tab order — there is no roving-tabindex / arrow-key navigation
 * here yet. Revisit once a shared focus-management hook exists elsewhere in
 * the design system.
 *
 * ```tsx
 * <Toolbar
 *   label="Document actions"
 *   startContent={<Button>Bold</Button>}
 *   endContent={<Button>Share</Button>}
 * />
 * ```
 */
export function Toolbar({
  startContent,
  centerContent,
  endContent,
  label,
  size = 'md',
  orientation = 'horizontal',
  className,
  ref,
  ...rest
}: ToolbarProps): JSX.Element {
  const layout = centerContent != null ? 'grid' : 'flex';
  const s = toolbar({ size, orientation, layout });

  return (
    <div
      {...rest}
      ref={ref}
      role="toolbar"
      aria-label={label}
      aria-orientation={orientation}
      {...mergeProps(s.root, className)}
    >
      {startContent != null ? <div {...mergeProps(s.startSlot)}>{startContent}</div> : null}
      {centerContent != null ? <div {...mergeProps(s.centerSlot)}>{centerContent}</div> : null}
      {endContent != null ? <div {...mergeProps(s.endSlot)}>{endContent}</div> : null}
    </div>
  );
}
