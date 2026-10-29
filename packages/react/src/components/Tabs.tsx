import type { JSX, ReactNode, Ref } from 'react';
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

type TabDefinition = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = Omit<RACTabsProps, 'children'> & {
  /** Tab definitions with id, label, and panel content. */
  tabs: TabDefinition[];
  /** Ref to the underlying root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export function Tabs({
  tabs,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  ref,
  ...props
}: TabsProps): JSX.Element {
  const t = tabsStyles();
  const listRef = useRef<HTMLDivElement>(null);
  const isControlled = selectedKey !== undefined;
  const [uncontrolledKey, setUncontrolledKey] = useState(defaultSelectedKey ?? tabs[0]?.id);
  const activeKey = isControlled ? selectedKey : uncontrolledKey;

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeTab = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    positionTabsIndicator(list, activeTab);
  }, [activeKey, tabs]);

  return (
    <AriaTabs
      {...props}
      ref={ref}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(key) => {
        if (!isControlled) {
          setUncontrolledKey(key);
        }
        onSelectionChange?.(key);
      }}
      {...mergeProps(t.root)}
    >
      <TabList ref={listRef} {...mergeProps(t.list)}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} {...mergeProps(t.tab)}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} {...mergeProps(t.panel)}>
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
