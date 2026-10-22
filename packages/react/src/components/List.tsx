import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useId } from 'react';
import { list as listStyles, type ListVariantProps } from '@var-ui/core';
import { mergeProps } from 'typestyles';

export type ListItemData = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  href?: string;
  isDisabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
};

export type ListProps = {
  density?: NonNullable<ListVariantProps['density']>;
  listStyle?: NonNullable<ListVariantProps['listStyle']>;
  hasDividers?: NonNullable<ListVariantProps['hasDividers']>;
  header?: ReactNode;
  items?: ListItemData[];
  renderStart?: (item: ListItemData) => ReactNode;
  renderEnd?: (item: ListItemData) => ReactNode;
  children?: ReactNode;
  className?: string;
  /** Fired for interactive items without href (items mode / Item onPress). */
  onAction?: (id: string) => void;
};

/**
 * Props for a row within {@link List}.
 *
 * When `href` or `onPress` is set, the row uses an invisible overlay as the sole
 * hit target — `startContent` and `endContent` must be non-interactive (decorative
 * or static content only; no links, buttons, or other controls).
 */
export type ListItemProps = {
  id?: string;
  label: ReactNode;
  description?: ReactNode;
  /** Leading slot. Must not contain interactive elements when `href` / `onPress` is set. */
  startContent?: ReactNode;
  /** Trailing slot. Must not contain interactive elements when `href` / `onPress` is set. */
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
};

type ListStyleSlots = ReturnType<typeof listStyles>;

type ListContextValue = {
  styles: ListStyleSlots;
  listId: string;
};

const ListContext = createContext<ListContextValue | null>(null);

const interactiveOverlayStyle = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'inherit',
  textDecoration: 'none',
} as const;

function ariaLabelFromNode(node: ReactNode): string | undefined {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  return undefined;
}

function useListContext(): ListContextValue {
  const context = useContext(ListContext);
  if (context == null) {
    throw new Error('List.Item must be used within List');
  }
  return context;
}

type ListItemContentProps = {
  itemId?: string;
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
};

function ListItemContent({
  itemId,
  label,
  description,
  startContent,
  endContent,
  href,
  onPress,
  isDisabled = false,
  className,
}: ListItemContentProps): JSX.Element {
  const { styles: s, listId } = useListContext();
  const fallbackId = useId();
  const labelId = itemId != null ? `${listId}-${itemId}-label` : `${listId}-${fallbackId}-label`;
  const isInteractive = !isDisabled && (href != null || onPress != null);
  const stringLabel = ariaLabelFromNode(label);

  return (
    <li
      {...mergeProps(s.item, className)}
      data-interactive={isInteractive ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
    >
      {startContent != null ? <span {...mergeProps(s.start)}>{startContent}</span> : null}
      <span id={isInteractive ? labelId : undefined} {...mergeProps(s.label)}>
        {label}
      </span>
      {description != null ? <span {...mergeProps(s.description)}>{description}</span> : null}
      {endContent != null ? <span {...mergeProps(s.end)}>{endContent}</span> : null}
      {isInteractive && href != null ? (
        <a
          href={href}
          aria-label={stringLabel}
          aria-labelledby={stringLabel == null ? labelId : undefined}
          style={interactiveOverlayStyle}
        />
      ) : null}
      {isInteractive && href == null && onPress != null ? (
        <button
          type="button"
          aria-label={stringLabel}
          aria-labelledby={stringLabel == null ? labelId : undefined}
          style={interactiveOverlayStyle}
          onClick={onPress}
        />
      ) : null}
    </li>
  );
}

/**
 * Generic vertical list for settings rows, member lists, and static content.
 * Supports compound `List.Item` children or an `items` array with optional render props.
 *
 * Interactive rows (`href` / `onPress` / `onAction`) use an invisible overlay as the
 * sole hit target — `startContent`, `endContent`, and `renderStart` / `renderEnd` output
 * must be non-interactive on those rows (no nested links or buttons).
 *
 * ```tsx
 * <List density="compact" hasDividers header="Members">
 *   <List.Item label="Ada" description="Admin" href="/u/ada" />
 * </List>
 * ```
 */
export function List({
  density = 'balanced',
  listStyle = 'none',
  hasDividers = false,
  header,
  items,
  renderStart,
  renderEnd,
  children,
  className,
  onAction,
}: ListProps): JSX.Element {
  const s = listStyles({ density, listStyle, hasDividers: hasDividers ? true : false });
  const listId = useId();
  const RootTag = listStyle === 'decimal' ? 'ol' : 'ul';

  const itemNodes =
    items?.map((item) => (
      <ListItemContent
        key={item.id}
        itemId={item.id}
        label={item.label}
        description={item.description}
        startContent={renderStart?.(item) ?? item.startContent}
        endContent={renderEnd?.(item) ?? item.endContent}
        href={item.href}
        onPress={
          item.href == null && onAction != null && !item.isDisabled
            ? () => onAction(item.id)
            : undefined
        }
        isDisabled={item.isDisabled}
      />
    )) ?? null;

  return (
    <ListContext.Provider value={{ styles: s, listId }}>
      <RootTag {...mergeProps(s.root, className)}>
        {header != null ? <li {...mergeProps(s.header)}>{header}</li> : null}
        {children ?? itemNodes}
      </RootTag>
    </ListContext.Provider>
  );
}

/** Row within a `List` — link or button overlay when `href` / `onPress` is set. */
export function ListItem({
  id,
  label,
  description,
  startContent,
  endContent,
  href,
  onPress,
  isDisabled,
  className,
}: ListItemProps): JSX.Element {
  return (
    <ListItemContent
      itemId={id}
      label={label}
      description={description}
      startContent={startContent}
      endContent={endContent}
      href={href}
      onPress={onPress}
      isDisabled={isDisabled}
      className={className}
    />
  );
}

List.Item = ListItem;
