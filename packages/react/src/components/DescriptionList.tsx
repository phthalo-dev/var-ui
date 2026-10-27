import type { CSSProperties, JSX, ReactNode, Ref } from 'react';
import { Children, createContext, useContext, useMemo, useState } from 'react';
import {
  button,
  descriptionList as descriptionListStyles,
  iconNameList,
  type IconName,
  type DescriptionListVariantProps,
} from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type DescriptionListItemData = {
  id: string;
  label: string;
  value: ReactNode;
  icon?: IconName | Exclude<ReactNode, string>;
};

export type DescriptionListProps = {
  columns?: NonNullable<DescriptionListVariantProps['columns']> | number;
  labelPosition?: NonNullable<DescriptionListVariantProps['labelPosition']>;
  maxItems?: number;
  title?: ReactNode;
  items?: DescriptionListItemData[];
  children?: ReactNode;
  className?: string;
  /** Ref to the underlying `<dl>` element. */
  ref?: Ref<HTMLDListElement>;
};

export type DescriptionListItemProps = {
  label: string;
  children?: ReactNode;
  icon?: IconName | Exclude<ReactNode, string>;
  className?: string;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

type DescriptionListStyleSlots = ReturnType<typeof descriptionListStyles>;

type DescriptionListContextValue = {
  styles: DescriptionListStyleSlots;
};

const DescriptionListContext = createContext<DescriptionListContextValue | null>(null);

function isIconName(value: unknown): value is IconName {
  return typeof value === 'string' && (iconNameList as readonly string[]).includes(value);
}

function renderDescriptionListIcon(
  icon: IconName | Exclude<ReactNode, string> | undefined,
): ReactNode {
  if (icon == null || icon === false) return null;
  return isIconName(icon) ? <Icon name={icon} size="sm" /> : icon;
}

function useDescriptionListContext(): DescriptionListContextValue {
  const context = useContext(DescriptionListContext);
  if (context == null) {
    throw new Error('DescriptionList.Item must be used within DescriptionList');
  }
  return context;
}

function DescriptionListItemContent({
  label,
  children,
  icon,
  className,
  ref,
}: DescriptionListItemProps): JSX.Element {
  const { styles: s } = useDescriptionListContext();
  const iconNode = renderDescriptionListIcon(icon);

  return (
    <div {...mergeProps(s.item, className)} ref={ref}>
      <dt {...mergeProps(s.term)}>
        {iconNode}
        {iconNode != null ? ' ' : null}
        {label}
      </dt>
      <dd {...mergeProps(s.details)}>{children}</dd>
    </div>
  );
}

/**
 * Semantic key/value display using `<dl>` / `<dt>` / `<dd>`.
 * Supports compound `DescriptionList.Item` children or an `items` array.
 *
 * ```tsx
 * <DescriptionList columns="single" maxItems={4} title="Details">
 *   <DescriptionList.Item label="Owner">Ada</DescriptionList.Item>
 * </DescriptionList>
 * ```
 */
export function DescriptionList({
  columns = 'single',
  labelPosition,
  maxItems,
  title,
  items,
  children,
  className,
  ref,
}: DescriptionListProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const resolvedLabelPosition = labelPosition ?? (columns === 'single' ? 'start' : 'top');
  const recipeColumns = typeof columns === 'number' ? 'multi' : columns;
  const s = descriptionListStyles({
    columns: recipeColumns,
    labelPosition: resolvedLabelPosition,
  });
  const rootStyle: CSSProperties | undefined =
    typeof columns === 'number'
      ? ({ '--var-ui-description-list-columns': String(columns) } as CSSProperties)
      : undefined;

  const itemNodes =
    items?.map((item) => (
      <DescriptionListItemContent key={item.id} label={item.label} icon={item.icon}>
        {item.value}
      </DescriptionListItemContent>
    )) ?? null;

  const allContent = children ?? itemNodes;
  const contentArray = useMemo(() => Children.toArray(allContent), [allContent]);
  const isCollapsible = maxItems != null && contentArray.length > maxItems;
  const visibleContent =
    expanded || !isCollapsible ? contentArray : contentArray.slice(0, maxItems);

  return (
    <DescriptionListContext.Provider value={{ styles: s }}>
      <dl {...mergeProps(s.root, className)} style={rootStyle} ref={ref}>
        {title != null ? <div {...mergeProps(s.title)}>{title}</div> : null}
        {visibleContent}
        {isCollapsible ? (
          <button
            type="button"
            {...mergeProps(
              s.toggle,
              button({ tone: 'accent', appearance: 'ghost', size: 'sm' }).className,
            )}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        ) : null}
      </dl>
    </DescriptionListContext.Provider>
  );
}

/** Key/value row within a `DescriptionList`. */
export function DescriptionListItem({
  label,
  children,
  icon,
  className,
  ref,
}: DescriptionListItemProps): JSX.Element {
  return (
    <DescriptionListItemContent label={label} icon={icon} className={className} ref={ref}>
      {children}
    </DescriptionListItemContent>
  );
}

DescriptionList.Item = DescriptionListItem;
