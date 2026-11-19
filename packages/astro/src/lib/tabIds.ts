/** Ids linking a tab and its panel: `<tabs id>-tab-<value>` and `<tabs id>-panel-<value>`. */
export function tabIds(tabsId: string, value: string): { tab: string; panel: string } {
  return { tab: `${tabsId}-tab-${value}`, panel: `${tabsId}-panel-${value}` };
}
