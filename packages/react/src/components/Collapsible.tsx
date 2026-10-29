import type { JSX, ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import { collapsible } from '@var-ui/core/components/collapsible';
import type { CollapsibleVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type { CollapsibleVariant } from '@var-ui/core';

export type CollapsibleProps = CollapsibleVariantProps & {
  /** Stable id when used inside `CollapsibleGroup` (maps to RAC `Disclosure` id / expanded keys). */
  id?: string;
  /** Default trigger label when `trigger` is omitted. */
  title?: ReactNode;
  /** Overrides the default title + chevron trigger contents. */
  trigger?: ReactNode;
  children: ReactNode;
  /** Controlled expanded state. */
  isExpanded?: boolean;
  /** Uncontrolled initial expanded state. */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type CollapsibleGroupProps = {
  children: ReactNode;
  /**
   * When true, multiple panels may stay open.
   * When false (default), opening one panel collapses the others.
   */
  allowsMultipleExpanded?: boolean;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Expand/collapse panel built on RAC `Disclosure` / `DisclosurePanel`.
 *
 * ```tsx
 * <Collapsible title="Show code" defaultExpanded={false}>
 *   <pre>{code}</pre>
 * </Collapsible>
 * ```
 */
export function Collapsible({
  id,
  title,
  trigger,
  children,
  isExpanded,
  defaultExpanded,
  onExpandedChange,
  variant = 'flush',
  className,
  ref,
}: CollapsibleProps): JSX.Element {
  const c = collapsible({ variant });
  return (
    <Disclosure
      id={id}
      isExpanded={isExpanded}
      defaultExpanded={defaultExpanded}
      onExpandedChange={onExpandedChange}
      {...mergeProps(c.root, className)}
      ref={ref}
    >
      <Heading level={3} style={{ margin: 0 }}>
        <AriaButton slot="trigger" {...mergeProps(c.trigger)}>
          {trigger ?? (
            <>
              <span {...mergeProps(c.triggerIcon)}>
                <Icon name="chevronDown" size="sm" />
              </span>
              {title}
            </>
          )}
        </AriaButton>
      </Heading>
      <DisclosurePanel {...mergeProps(c.panel)}>{children}</DisclosurePanel>
    </Disclosure>
  );
}

/**
 * Groups related `Collapsible` panels (accordion). Pass matching `id` on each child.
 *
 * ```tsx
 * <CollapsibleGroup>
 *   <Collapsible id="a" title="Alpha">…</Collapsible>
 *   <Collapsible id="b" title="Beta">…</Collapsible>
 * </CollapsibleGroup>
 * ```
 */
export function CollapsibleGroup({
  children,
  allowsMultipleExpanded = false,
  className,
  ref,
}: CollapsibleGroupProps): JSX.Element {
  return (
    <DisclosureGroup
      allowsMultipleExpanded={allowsMultipleExpanded}
      className={className}
      ref={ref}
    >
      {children}
    </DisclosureGroup>
  );
}
