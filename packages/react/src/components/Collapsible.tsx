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
    /**
     * Trigger icon: `undefined` keeps the default chevron (title triggers only — a custom
     * `trigger` renders without an icon), `null` hides it, a node replaces the chevron
     * (rotating, alongside a custom `trigger`).
     */
    icon?: ReactNode;
    children: ReactNode;
    /** Controlled expanded state. */
    expanded?: boolean;
    /** Uncontrolled initial expanded state. */
    defaultExpanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    /** Semantic level of the heading wrapping the trigger, or `false` to render the trigger button without a heading. @default 3 */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | false;
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
  icon,
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
  const triggerButton = (
    <AriaButton slot="trigger" {...mergeProps(c.trigger)}>
      <TriggerIcon icon={icon} hasCustomTrigger={trigger !== undefined} c={c} />
      {trigger ?? title}
    </AriaButton>
  );
  if (headingLevel === false) {
    // The RAC trigger picks up its behaviour via slot context; the heading
    // wrapper is presentational and can be skipped (long collapsible lists
    // should not pollute the document outline).
    return (
      <Disclosure
        {...(rest as object)}
        id={id}
        {...toRacProps({ expanded, defaultExpanded, onExpandedChange })}
        {...mergeProps(c.root, className)}
        ref={ref}
      >
        {triggerButton}
        <DisclosurePanel {...mergeProps(c.panel)}>{children}</DisclosurePanel>
      </Disclosure>
    );
  }
  return (
    <Disclosure
      {...(rest as object)}
      id={id}
      {...toRacProps({ expanded, defaultExpanded, onExpandedChange })}
      {...mergeProps(c.root, className)}
      ref={ref}
    >
      <Heading level={headingLevel} {...mergeProps(c.heading)}>
        {triggerButton}
      </Heading>
      <DisclosurePanel {...mergeProps(c.panel)}>{children}</DisclosurePanel>
    </Disclosure>
  );
}

/** Trigger icon resolution: explicit node, default chevron, or nothing. */
function TriggerIcon({
  icon,
  hasCustomTrigger,
  c,
}: {
  icon?: ReactNode;
  hasCustomTrigger: boolean;
  c: ReturnType<typeof collapsible>;
}): JSX.Element | null {
  const content =
    icon !== undefined ? icon : hasCustomTrigger ? null : <Icon name="chevronDown" size="sm" />;
  if (content === null || content === undefined || content === false) {
    return null;
  }
  return <span {...mergeProps(c.triggerIcon)}>{content}</span>;
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
