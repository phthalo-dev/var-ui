import type {
  ComponentPropsWithRef,
  FocusEvent,
  JSX,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { tree as treeStyles } from '@var-ui/core/components/tree';
import type { TreeVariantProps } from '@var-ui/core';
import { useDirection } from '../DirectionProvider';
import { Icon } from '../icons';
import { useTreeFocus, type TreeFocusItem } from '../hooks/useTreeFocus';
import { mergeProps } from 'typestyles';

export type TreeItemData = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  children?: TreeItemData[];
  isDisabled?: boolean;
  href?: string;
};

export type TreeSelectionMode = 'none' | 'single' | 'multiple';

export type TreeProps = Omit<ComponentPropsWithRef<'ul'>, 'children' | 'ref' | 'role'> & {
  items?: TreeItemData[];
  children?: ReactNode;
  density?: NonNullable<TreeVariantProps['density']>;
  expandedKeys?: Iterable<string>;
  defaultExpandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Set<string>) => void;
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  selectionMode?: TreeSelectionMode;
  renderStart?: (item: TreeItemData) => ReactNode;
  renderEnd?: (item: TreeItemData) => ReactNode;
  /** Ref to the underlying root `<ul>` element. */
  ref?: Ref<HTMLUListElement>;
};

export type TreeItemProps = Omit<ComponentPropsWithRef<'li'>, 'id' | 'children' | 'role'> & {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  isDisabled?: boolean;
  href?: string;
  /** Seeds the initial (uncontrolled) expanded set — ignored once `expandedKeys` is controlled. */
  defaultExpanded?: boolean;
  children?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

const DATA_ID_ATTR = 'data-tree-item-id';

type TreeStyleSlots = ReturnType<typeof treeStyles>;

type TreeContextValue = {
  styles: TreeStyleSlots;
  selectionMode: TreeSelectionMode;
  isExpanded: (id: string) => boolean;
  toggleExpand: (id: string) => void;
  isSelected: (id: string) => boolean;
  toggleSelect: (id: string) => void;
  focusedId: string | null;
  renderStart?: (item: TreeItemData) => ReactNode;
  renderEnd?: (item: TreeItemData) => ReactNode;
};

const TreeContext = createContext<TreeContextValue | null>(null);

function useTreeContext(): TreeContextValue {
  const context = useContext(TreeContext);
  if (context == null) {
    throw new Error('Tree.Item must be used within Tree');
  }
  return context;
}

/** Nesting depth (1-indexed, per `aria-level`) — incremented by each `Tree.Item` for its own children. */
const TreeLevelContext = createContext(1);

function useControlledKeySet(options: {
  value?: Iterable<string>;
  defaultValue?: Iterable<string>;
  onChange?: (keys: Set<string>) => void;
}): [Set<string>, (next: Set<string>) => void] {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Set<string>>(() => new Set(defaultValue ?? []));
  const resolved = isControlled ? new Set(value) : internal;

  const commit = useCallback(
    (next: Set<string>) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [resolved, commit];
}

/** Recursively collects `Tree.Item` ids with `defaultExpanded` set — used once to seed uncontrolled expand state. */
function collectDefaultExpandedIds(node: ReactNode, acc: Set<string>): void {
  Children.forEach(node, (child) => {
    if (!isValidElement(child) || child.type !== TreeItem) return;
    const props = child.props as TreeItemProps;
    if (props.defaultExpanded) acc.add(props.id);
    if (props.children != null) collectDefaultExpandedIds(props.children, acc);
  });
}

type TreeRowContentProps = Omit<ComponentPropsWithRef<'li'>, 'id' | 'children' | 'role'> & {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  isDisabled?: boolean;
  href?: string;
  hasChildren: boolean;
  isExpanded: boolean;
  level: number;
  startContent?: ReactNode;
  endContent?: ReactNode;
  className?: string;
  /** `role="group"` subtree (or `null`) — rendered as a DOM child of this `treeitem`, not a sibling. */
  groupContent?: ReactNode;
};

function TreeRowContent({
  id,
  label,
  description,
  isDisabled = false,
  href,
  hasChildren,
  isExpanded,
  level,
  startContent,
  endContent,
  className,
  groupContent,
  ref,
  onClick,
  ...rest
}: TreeRowContentProps): JSX.Element {
  const ctx = useTreeContext();
  const { isRtl } = useDirection();
  const s = ctx.styles;
  const isSelected = ctx.selectionMode !== 'none' && ctx.isSelected(id);
  const isRovingTarget = ctx.focusedId === id;
  const labelId = useId();
  const isLinkLabelString = typeof label === 'string';

  const handleToggleClick = () => {
    if (isDisabled) return;
    ctx.toggleExpand(id);
  };

  const handleRowClick = (event: MouseEvent<HTMLLIElement>) => {
    // Stop first: the group subtree now lives inside this `<li>`, so without
    // this a click on a nested row would bubble up and also fire every
    // ancestor row's click handler.
    event.stopPropagation();
    onClick?.(event);
    if (event.defaultPrevented) return;
    // `href` wins: the overlay `<a>` already handles navigation, and calling
    // toggleSelect/toggleExpand here too would double up on every click
    // (expand still works via the chevron button, which stops propagation).
    if (isDisabled || href != null) return;
    if (ctx.selectionMode !== 'none') {
      ctx.toggleSelect(id);
    } else if (hasChildren) {
      ctx.toggleExpand(id);
    }
  };

  return (
    <li
      {...rest}
      ref={ref}
      {...{ [DATA_ID_ATTR]: id }}
      role="treeitem"
      aria-level={level}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={ctx.selectionMode !== 'none' ? isSelected : undefined}
      aria-disabled={isDisabled ? true : undefined}
      // Explicit name, not "from contents" — the nested `group` (a DOM child of
      // this `<li>` per APG) would otherwise fold its descendants' labels in too.
      aria-label={isLinkLabelString ? (label as string) : undefined}
      aria-labelledby={isLinkLabelString ? undefined : labelId}
      data-disabled={isDisabled ? '' : undefined}
      data-has-children={hasChildren ? '' : undefined}
      data-selected={isSelected ? '' : undefined}
      tabIndex={isRovingTarget ? 0 : -1}
      {...mergeProps(s.item)}
      onClick={handleRowClick}
    >
      <div
        data-disabled={isDisabled ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        {...mergeProps(s.row, className)}
      >
        {hasChildren ? (
          <button
            type="button"
            {...mergeProps(s.toggle)}
            data-expanded={isExpanded ? '' : undefined}
            tabIndex={-1}
            aria-hidden="true"
            onClick={(event) => {
              event.stopPropagation();
              handleToggleClick();
            }}
          >
            <Icon name="chevronRight" size="sm" data-mirror={isRtl || undefined} />
          </button>
        ) : (
          <span {...mergeProps(s.toggle)} data-placeholder="" aria-hidden="true">
            <Icon name="chevronRight" size="sm" data-mirror={isRtl || undefined} />
          </span>
        )}
        {startContent != null ? <span {...mergeProps(s.start)}>{startContent}</span> : null}
        <span id={isLinkLabelString ? undefined : labelId} {...mergeProps(s.label)}>
          {label}
        </span>
        {description != null ? <span {...mergeProps(s.description)}>{description}</span> : null}
        {endContent != null ? <span {...mergeProps(s.end)}>{endContent}</span> : null}
        {href != null && !isDisabled ? (
          <a
            href={href}
            tabIndex={-1}
            aria-label={isLinkLabelString ? (label as string) : undefined}
            aria-labelledby={isLinkLabelString ? undefined : labelId}
            {...mergeProps(s.overlayLink)}
            data-inset={hasChildren ? 'after-toggle' : undefined}
          />
        ) : null}
      </div>
      {groupContent}
    </li>
  );
}

function TreeItemsGroup({ items, level }: { items: TreeItemData[]; level: number }): JSX.Element {
  const ctx = useTreeContext();
  return (
    <>
      {items.map((item) => {
        const hasChildren = item.children != null && item.children.length > 0;
        const isExpanded = hasChildren && ctx.isExpanded(item.id);
        return (
          <TreeRowContent
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            isDisabled={item.isDisabled}
            href={item.href}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            level={level}
            startContent={ctx.renderStart?.(item)}
            endContent={ctx.renderEnd?.(item)}
            groupContent={
              hasChildren && isExpanded ? (
                <ul role="group" {...mergeProps(ctx.styles.group)}>
                  <TreeItemsGroup items={item.children ?? []} level={level + 1} />
                </ul>
              ) : null
            }
          />
        );
      })}
    </>
  );
}

/** Row within a `Tree` — nest `Tree.Item` children to build a subtree. */
export function TreeItem({
  id,
  label,
  description,
  isDisabled,
  href,
  children,
  startContent,
  endContent,
  className,
  ref,
  ...rest
}: TreeItemProps): JSX.Element {
  const level = useContext(TreeLevelContext);
  const ctx = useTreeContext();
  const hasChildren = children != null;
  const isExpanded = hasChildren && ctx.isExpanded(id);

  return (
    <TreeRowContent
      {...rest}
      ref={ref}
      id={id}
      label={label}
      description={description}
      isDisabled={isDisabled}
      href={href}
      hasChildren={hasChildren}
      isExpanded={isExpanded}
      level={level}
      startContent={startContent}
      endContent={endContent}
      className={className}
      groupContent={
        hasChildren && isExpanded ? (
          <TreeLevelContext.Provider value={level + 1}>
            <ul role="group" {...mergeProps(ctx.styles.group)}>
              {children}
            </ul>
          </TreeLevelContext.Provider>
        ) : null
      }
    />
  );
}

/**
 * Hierarchical expandable list with APG tree keyboard behavior (`useTreeFocus`
 * internally). Supports compound `Tree.Item` children (nest freely) or an
 * `items` array with recursive `children`. Controlled/uncontrolled
 * `expandedKeys` and `selectedKeys`; `selectionMode` defaults to `'none'`.
 *
 * Clicking a row selects it when `selectionMode !== 'none'`; otherwise a
 * click toggles expansion (as does the chevron button, always).
 *
 * ```tsx
 * <Tree selectionMode="single" selectedKeys={selected} onSelectionChange={setSelected}>
 *   <Tree.Item id="src" label="src" defaultExpanded>
 *     <Tree.Item id="app" label="App.tsx" />
 *   </Tree.Item>
 * </Tree>
 * ```
 */
export function Tree({
  items,
  children,
  density = 'balanced',
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  selectionMode = 'none',
  renderStart,
  renderEnd,
  className,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  ref,
  ...rest
}: TreeProps): JSX.Element {
  const s = treeStyles({ density });
  const rootRef = useRef<HTMLUListElement>(null);
  const setRoot = useCallback(
    (node: HTMLUListElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [ref],
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Computed once, at mount, for uncontrolled default expand state only.
  const initialExpandedIds = useMemo(() => {
    const ids = new Set(defaultExpandedKeys ?? []);
    if (children != null) collectDefaultExpandedIds(children, ids);
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [expandedSet, commitExpanded] = useControlledKeySet({
    value: expandedKeys,
    defaultValue: initialExpandedIds,
    onChange: onExpandedChange,
  });
  const [selectedSet, commitSelected] = useControlledKeySet({
    value: selectedKeys,
    defaultValue: defaultSelectedKeys,
    onChange: onSelectionChange,
  });

  const isExpanded = useCallback((id: string) => expandedSet.has(id), [expandedSet]);
  const toggleExpand = useCallback(
    (id: string) => {
      const next = new Set(expandedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commitExpanded(next);
    },
    [expandedSet, commitExpanded],
  );
  const expand = useCallback(
    (id: string) => {
      if (expandedSet.has(id)) return;
      commitExpanded(new Set(expandedSet).add(id));
    },
    [expandedSet, commitExpanded],
  );
  const collapse = useCallback(
    (id: string) => {
      if (!expandedSet.has(id)) return;
      const next = new Set(expandedSet);
      next.delete(id);
      commitExpanded(next);
    },
    [expandedSet, commitExpanded],
  );

  const isSelected = useCallback((id: string) => selectedSet.has(id), [selectedSet]);
  const toggleSelect = useCallback(
    (id: string) => {
      if (selectionMode === 'none') return;
      if (selectionMode === 'single') {
        commitSelected(selectedSet.has(id) ? new Set<string>() : new Set([id]));
        return;
      }
      const next = new Set(selectedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commitSelected(next);
    },
    [selectionMode, selectedSet, commitSelected],
  );

  const getItems = useCallback((): TreeFocusItem[] => {
    const root = rootRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]')).map((element) => ({
      id: element.getAttribute(DATA_ID_ATTR) ?? '',
      element,
      isDisabled: element.hasAttribute('data-disabled'),
      hasChildren: element.hasAttribute('data-has-children'),
      isExpanded: element.getAttribute('aria-expanded') === 'true',
    }));
  }, []);

  const { onKeyDown, tabIndex: rootTabIndex } = useTreeFocus({
    getItems,
    onExpand: expand,
    onCollapse: collapse,
    onSelect: selectionMode !== 'none' ? toggleSelect : undefined,
  });

  // Keeps the roving tabindex pointed at a real, enabled row after expand/collapse
  // or data changes make the previous target disappear (or on first mount).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'));
    const stillValid =
      focusedId != null &&
      rows.some(
        (row) => row.getAttribute(DATA_ID_ATTR) === focusedId && !row.hasAttribute('data-disabled'),
      );
    if (stillValid) return;
    const first = rows.find((row) => !row.hasAttribute('data-disabled'));
    const nextId = first?.getAttribute(DATA_ID_ATTR);
    if (nextId != null && nextId !== focusedId) setFocusedId(nextId);
  });

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLUListElement>) => {
      onFocusProp?.(event);
      const id = (event.target as HTMLElement).getAttribute(DATA_ID_ATTR);
      if (id != null) setFocusedId(id);
    },
    [onFocusProp],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      onKeyDownProp?.(event);
      if (event.defaultPrevented) return;
      onKeyDown(event.nativeEvent);
    },
    [onKeyDown, onKeyDownProp],
  );

  const contextValue = useMemo<TreeContextValue>(
    () => ({
      styles: s,
      selectionMode,
      isExpanded,
      toggleExpand,
      isSelected,
      toggleSelect,
      focusedId,
      renderStart,
      renderEnd,
    }),
    [
      s,
      selectionMode,
      isExpanded,
      toggleExpand,
      isSelected,
      toggleSelect,
      focusedId,
      renderStart,
      renderEnd,
    ],
  );

  const content = children ?? (items != null ? <TreeItemsGroup items={items} level={1} /> : null);

  return (
    <TreeContext.Provider value={contextValue}>
      <TreeLevelContext.Provider value={1}>
        <ul
          {...rest}
          ref={setRoot}
          role="tree"
          tabIndex={rootTabIndex}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          {...mergeProps(s.root, className)}
        >
          {content}
        </ul>
      </TreeLevelContext.Provider>
    </TreeContext.Provider>
  );
}

Tree.Item = TreeItem;
