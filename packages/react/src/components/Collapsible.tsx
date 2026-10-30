import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type Key,
} from 'react-aria-components';
import { collapsible } from '@var-ui/core/components/collapsible';
import type { CollapsibleVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { toRacProps } from '../internal/racProps';

export type { CollapsibleVariant } from '@var-ui/core';

export type CollapsibleProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'title' | 'id'> &
  CollapsibleVariantProps & {
    /** Stable id when used inside `CollapsibleGroup` (maps to RAC `Disclosure` id / expanded keys). */
    id?: string;
    /** Default trigger label when `trigger` is omitted. */
    title?: ReactNode;
    /** Overrides the default title + chevron trigger contents. */
    trigger?: ReactNode;
    children: ReactNode;
    /** Controlled expanded state. */
    expanded?: boolean;
    /** Uncontrolled initial expanded state. */
    defaultExpanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** Semantic level of the heading wrapping the trigger. @default 3 */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  };

export type CollapsibleGroupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
  /**
   * When true, multiple panels may stay open.
   * When false (default), opening one panel collapses the others.
   */
  multiple?: boolean;
  /** Controlled ids of the expanded panels. */
  expanded?: string[];
  /** Ids of the panels expanded initially when uncontrolled. */
  defaultExpanded?: string[];
  /** Called with the ids of the expanded panels whenever they change. */
  onExpandedChange?: (expanded: string[]) => void;
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
  expanded,
  defaultExpanded,
  onExpandedChange,
  variant = 'flush',
  headingLevel = 3,
  className,
  ref,
  ...rest
}: CollapsibleProps): JSX.Element {
  const c = collapsible({ variant });
  return (
    <Disclosure
      {...(rest as object)}
      id={id}
      {...toRacProps({ expanded, defaultExpanded, onExpandedChange })}
      {...mergeProps(c.root, className)}
      ref={ref}
    >
      <Heading level={headingLevel} {...mergeProps(c.heading)}>
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
  multiple = false,
  expanded,
  defaultExpanded,
  onExpandedChange,
  className,
  ref,
  ...rest
}: CollapsibleGroupProps): JSX.Element {
  return (
    <DisclosureGroup
      {...(rest as object)}
      allowsMultipleExpanded={multiple}
      {...(expanded !== undefined ? { expandedKeys: new Set<Key>(expanded) } : {})}
      {...(defaultExpanded !== undefined ? { defaultExpandedKeys: defaultExpanded } : {})}
      {...(onExpandedChange
        ? { onExpandedChange: (keys: Set<Key>) => onExpandedChange([...keys].map(String)) }
        : {})}
      className={className}
      ref={ref}
    >
      {children}
    </DisclosureGroup>
  );
}
