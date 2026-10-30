import type { ComponentPropsWithRef, JSX, ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type TabsProps as RACTabsProps,
} from 'react-aria-components';
import { tabs as tabsStyles } from '@var-ui/core/components/tabs';
import { positionTabsIndicator } from '@var-ui/core/components/indicators/tabs';
import { mergeProps } from 'typestyles';
import { keyToValue, toRacProps } from '../internal/racProps';

export type TabDefinition = {
  /** Unique value; matches `Tabs` `value`. */
  value: string;
  label: ReactNode;
  /** Panel content shown while this tab is selected. */
  content: ReactNode;
  /** Prevents selecting this tab. */
  disabled?: boolean;
};

/**
 * Props for the panel `Tabs` (the selection callback is `onValueChange`; a native `onChange` is not
 * supported because react-aria owns the tab selection).
 */
export type TabsProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'onChange' | 'defaultValue'
> & {
  /** Tab definitions with value, label, and panel content. */
  tabs: TabDefinition[];
  /** Controlled selected tab value. */
  value?: string;
  /** Uncontrolled initial selected tab value. @default the first tab */
  defaultValue?: string;
  /** Fires with the newly selected tab value. */
  onValueChange?: (value: string) => void;
  /** Disables every tab. @default false */
  disabled?: boolean;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** `automatic` selects a tab on focus; `manual` requires Enter/Space. @default 'automatic' */
  keyboardActivation?: RACTabsProps['keyboardActivation'];
};

export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ref,
  ...props
}: TabsProps): JSX.Element {
  const t = tabsStyles();
  const listRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? tabs[0]?.value);
  const activeValue = isControlled ? value : uncontrolledValue;
  const disabledKeys = tabs.filter((tab) => tab.disabled).map((tab) => tab.value);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeTab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    positionTabsIndicator(list, activeTab);
  }, [activeValue, tabs]);

  return (
    <AriaTabs
      {...(props as object)}
      {...toRacProps({ disabled })}
      ref={ref}
      disabledKeys={disabledKeys.length ? disabledKeys : undefined}
      selectedKey={value}
      defaultSelectedKey={defaultValue}
      onSelectionChange={(key) => {
        const next = keyToValue(key);
        if (!isControlled) setUncontrolledValue(next);
        onValueChange?.(next);
      }}
      {...mergeProps(t.root, className)}
    >
      <TabList ref={listRef} {...mergeProps(t.list)}>
        {tabs.map((tab) => (
          <Tab key={tab.value} id={tab.value} {...mergeProps(t.tab)}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.value} id={tab.value} {...mergeProps(t.panel)}>
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
