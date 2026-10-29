import type { ComponentPropsWithRef, JSX, ReactNode, Ref } from 'react';
import { createContext, useContext, useId } from 'react';
import { list as listStyles } from '@var-ui/core/components/list';
import type { ListVariantProps } from '@var-ui/core';
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

export type ListProps = Omit<ComponentPropsWithRef<'ul'>, 'children' | 'ref'> & {
  density?: NonNullable<ListVariantProps['density']>;
  listStyle?: NonNullable<ListVariantProps['listStyle']>;
  hasDividers?: NonNullable<ListVariantProps['hasDividers']>;
  header?: ReactNode;
  items?: ListItemData[];
  renderStart?: (item: ListItemData) => ReactNode;
  renderEnd?: (item: ListItemData) => ReactNode;
  children?: ReactNode;
  /** Ref to the underlying `<ul>` (or `<ol>` when `listStyle` is `decimal`) element. */
  ref?: Ref<HTMLUListElement & HTMLOListElement>;
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
export type ListItemProps = Omit<ComponentPropsWithRef<'li'>, 'id' | 'children'> & {
  /** Stable id used to label the row's hit target (not set on the `<li>`). */
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
};

type ListStyleSlots = ReturnType<typeof listStyles>;

type ListContextValue = {
  styles: ListStyleSlots;
  listId: string;
};

const ListContext = createContext<ListContextValue | null>(null);

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

type ListItemContentProps = Omit<ComponentPropsWithRef<'li'>, 'children'> & {
  itemId?: string;
  label: ReactNode;
  description?: ReactNode;
  startContent?: ReactNode;
  endContent?: ReactNode;
  href?: string;
  onPress?: () => void;
  isDisabled?: boolean;
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
  ref,
  ...rest
}: ListItemContentProps): JSX.Element {
  const { styles: s, listId } = useListContext();
  const fallbackId = useId();
  const labelId = itemId != null ? `${listId}-${itemId}-label` : `${listId}-${fallbackId}-label`;
  const isInteractive = !isDisabled && (href != null || onPress != null);
  const stringLabel = ariaLabelFromNode(label);

  return (
    <li
      {...rest}
      {...mergeProps(s.item, className)}
      ref={ref}
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
          {...mergeProps(s.overlayLink)}
        />
      ) : null}
      {isInteractive && href == null && onPress != null ? (
        <button
          type="button"
          aria-label={stringLabel}
          aria-labelledby={stringLabel == null ? labelId : undefined}
          {...mergeProps(s.overlayLink)}
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
  ref,
  onAction,
  ...rest
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
      <RootTag {...rest} {...mergeProps(s.root, className)} ref={ref}>
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
  ref,
  ...rest
}: ListItemProps): JSX.Element {
  return (
    <ListItemContent
      {...rest}
      itemId={id}
      label={label}
      description={description}
      startContent={startContent}
      endContent={endContent}
      href={href}
      onPress={onPress}
      isDisabled={isDisabled}
      className={className}
      ref={ref}
    />
  );
}

List.Item = ListItem;
