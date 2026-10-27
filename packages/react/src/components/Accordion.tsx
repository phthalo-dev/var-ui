import type { JSX, ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import type { Key } from 'react-aria-components';
import {
  accordionGroup,
  collapsible,
  type AccordionGroupVariantProps,
  type CollapsibleVariant,
} from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type AccordionVariant = AccordionGroupVariantProps['variant'];

type AccordionContextValue = {
  itemVariant: CollapsibleVariant;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('Accordion compound components must be rendered inside <Accordion>.');
  }
  return ctx;
}

export type AccordionProps = AccordionGroupVariantProps & {
  /** When `single`, only one panel may be open at a time. @default single */
  type?: 'single' | 'multiple';
  /** When `type` is `single`, allow closing every panel. @default true */
  collapsible?: boolean;
  expandedKeys?: Iterable<Key>;
  defaultExpandedKeys?: Iterable<Key>;
  onExpandedChange?: (keys: Set<Key>) => void;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type AccordionItemProps = {
  /** Stable id used in `expandedKeys` / `defaultExpandedKeys`. */
  id: string;
  isDisabled?: boolean;
  className?: string;
  children: ReactNode;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

export type AccordionPanelProps = {
  children: ReactNode;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

function toKeySet(keys?: Iterable<Key>): Set<Key> {
  return keys ? new Set(keys) : new Set();
}

function focusSiblingTrigger(
  current: HTMLButtonElement,
  direction: 'first' | 'last' | 'prev' | 'next',
) {
  const group = current.closest('[data-var-ui-accordion]');
  if (!group) return;
  const triggers = [
    ...group.querySelectorAll<HTMLButtonElement>('[data-var-ui-accordion-trigger]'),
  ].filter((node) => !node.disabled);
  if (triggers.length === 0) return;

  const index = triggers.indexOf(current);
  let target: HTMLButtonElement | undefined;

  if (direction === 'first') target = triggers[0];
  else if (direction === 'last') target = triggers[triggers.length - 1];
  else if (direction === 'prev') target = triggers[Math.max(0, index - 1)];
  else target = triggers[Math.min(triggers.length - 1, index + 1)];

  target?.focus();
}

/**
 * Multi-panel disclosure (FAQ / settings). Built on RAC `DisclosureGroup`.
 *
 * ```tsx
 * <Accordion type="single" defaultExpandedKeys={['billing']}>
 *   <Accordion.Item id="billing">
 *     <Accordion.Trigger>Billing</Accordion.Trigger>
 *     <Accordion.Panel>…</Accordion.Panel>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */
export function Accordion({
  type = 'single',
  collapsible = true,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  variant = 'bordered',
  isDisabled,
  className,
  children,
  ref,
}: AccordionProps): JSX.Element {
  const group = accordionGroup({ variant: variant ?? 'bordered' });
  const itemVariant: CollapsibleVariant = variant === 'flush' ? 'flush' : 'accordion';
  const isControlled = expandedKeys !== undefined;
  const [uncontrolledKeys, setUncontrolledKeys] = useState(() => toKeySet(defaultExpandedKeys));
  const controlledKeys = useMemo(
    () => (expandedKeys !== undefined ? toKeySet(expandedKeys) : undefined),
    [expandedKeys],
  );
  const resolvedKeys = isControlled ? controlledKeys! : uncontrolledKeys;

  const handleExpandedChange = useCallback(
    (keys: Set<Key>) => {
      if (type === 'single' && !collapsible && keys.size === 0) {
        return;
      }
      if (!isControlled) {
        setUncontrolledKeys(keys);
      }
      onExpandedChange?.(keys);
    },
    [collapsible, isControlled, onExpandedChange, type],
  );

  return (
    <DisclosureGroup
      allowsMultipleExpanded={type === 'multiple'}
      expandedKeys={resolvedKeys}
      onExpandedChange={handleExpandedChange}
      isDisabled={isDisabled}
      {...mergeProps(group.root, className)}
      data-var-ui-accordion
      ref={ref}
    >
      <AccordionContext.Provider value={{ itemVariant }}>{children}</AccordionContext.Provider>
    </DisclosureGroup>
  );
}

function AccordionItem({
  id,
  isDisabled,
  className,
  children,
  ref,
}: AccordionItemProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });
  return (
    <Disclosure id={id} isDisabled={isDisabled} {...mergeProps(c.root, className)} ref={ref}>
      {children}
    </Disclosure>
  );
}

function AccordionTrigger({ children, className, ref }: AccordionTriggerProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });

  return (
    <Heading level={3} style={{ margin: 0 }}>
      <AriaButton
        slot="trigger"
        {...mergeProps(c.trigger, className)}
        data-var-ui-accordion-trigger
        ref={ref}
        onKeyDown={(event) => {
          if (event.key === 'Home') {
            event.preventDefault();
            focusSiblingTrigger(event.currentTarget, 'first');
          } else if (event.key === 'End') {
            event.preventDefault();
            focusSiblingTrigger(event.currentTarget, 'last');
          } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            focusSiblingTrigger(event.currentTarget, 'next');
          } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            focusSiblingTrigger(event.currentTarget, 'prev');
          }
        }}
      >
        <span {...mergeProps(c.triggerIcon)} aria-hidden>
          <Icon name="chevronDown" size="sm" />
        </span>
        {children}
      </AriaButton>
    </Heading>
  );
}

function AccordionPanel({ children, className, ref }: AccordionPanelProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });
  return (
    <DisclosurePanel {...mergeProps(c.panel, className)} ref={ref}>
      {children}
    </DisclosurePanel>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
