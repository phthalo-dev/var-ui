import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';
import { accordionGroup } from '@var-ui/core/components/accordionGroup';
import { collapsible } from '@var-ui/core/components/collapsible';
import type { AccordionGroupVariantProps, CollapsibleVariant } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { createContext, useCallback, useContext, useState } from 'react';
import { toRacProps } from '../internal/racProps';

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

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type AccordionProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'defaultValue'> &
  AccordionGroupVariantProps & {
    /** When `single`, only one panel may be open at a time. @default single */
    type?: 'single' | 'multiple';
    /** When `type` is `single`, allow closing every panel. @default true */
    collapsible?: boolean;
    /** Controlled ids of the open items. With `type="single"` this holds at most one id. */
    value?: string[];
    /** Uncontrolled initial open item ids. */
    defaultValue?: string[];
    /** Fires with the ids of the open items after every toggle. */
    onValueChange?: (value: string[]) => void;
    /** Disables every item. @default false */
    disabled?: boolean;
    children: ReactNode;
  };

export type AccordionItemProps = Omit<ComponentPropsWithRef<'div'>, 'children' | 'id'> & {
  /** Stable id used in `value` / `defaultValue`. */
  id: string;
  /** @default false */
  disabled?: boolean;
  children: ReactNode;
};

export type AccordionTriggerProps = Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  children: ReactNode;
  /** Semantic level of the heading wrapping the trigger. @default 3 */
  headingLevel?: HeadingLevel;
};

export type AccordionPanelProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  children: ReactNode;
};

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
 * <Accordion type="single" defaultValue={['billing']}>
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
  value,
  defaultValue,
  onValueChange,
  variant = 'bordered',
  disabled,
  className,
  children,
  ref,
  ...rest
}: AccordionProps): JSX.Element {
  const group = accordionGroup({ variant: variant ?? 'bordered' });
  const itemVariant: CollapsibleVariant = variant === 'flush' ? 'flush' : 'accordion';
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => defaultValue ?? []);
  const resolvedKeys = new Set<string>(isControlled ? value : uncontrolledValue);

  const handleExpandedChange = useCallback(
    (keys: Set<unknown>) => {
      if (type === 'single' && !collapsible && keys.size === 0) {
        return;
      }
      const next = [...keys].map(String);
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [collapsible, isControlled, onValueChange, type],
  );

  return (
    <DisclosureGroup
      {...(rest as object)}
      allowsMultipleExpanded={type === 'multiple'}
      expandedKeys={resolvedKeys}
      onExpandedChange={handleExpandedChange}
      {...toRacProps({ disabled })}
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
  disabled,
  className,
  children,
  ref,
  ...rest
}: AccordionItemProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });
  return (
    <Disclosure
      {...(rest as object)}
      id={id}
      {...toRacProps({ disabled })}
      {...mergeProps(c.root, className)}
      ref={ref}
    >
      {children}
    </Disclosure>
  );
}

function AccordionTrigger({
  children,
  headingLevel = 3,
  className,
  ref,
  onKeyDown,
  ...rest
}: AccordionTriggerProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });

  return (
    <Heading level={headingLevel} {...mergeProps(c.heading)}>
      <AriaButton
        {...(rest as object)}
        slot="trigger"
        {...mergeProps(c.trigger, className)}
        data-var-ui-accordion-trigger
        ref={ref}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
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

function AccordionPanel({ children, className, ref, ...rest }: AccordionPanelProps): JSX.Element {
  const { itemVariant } = useAccordionContext();
  const c = collapsible({ variant: itemVariant });
  return (
    <DisclosurePanel {...(rest as object)} {...mergeProps(c.panel, className)} ref={ref}>
      {children}
    </DisclosurePanel>
  );
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Panel = AccordionPanel;
