import type {
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { toggleGroup } from '@var-ui/core/components/toggleGroup';
import type { ControlSize, Orientation, ToggleGroupVariantProps, Tone } from '@var-ui/core';
import { mergeProps } from 'typestyles';
import { useControlSize } from '../internal/controlSizeContext';
import { mergeRefs } from '../internal/mergeRefs';
import { useRovingFocus } from '../internal/useRovingFocus';

type ToggleGroupBaseProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'onChange' | 'defaultValue' | 'ref' | 'role'
> & {
  /** The `ToggleGroup.Item`s. */
  children?: ReactNode;
  /** Disables every item. */
  disabled?: boolean;
  /**
   * Keeps one item pressed: the pressed item cannot be turned off by pressing it again (in
   * `multiple` mode, the last pressed item cannot). The HTML `required` of a group that must
   * have a value.
   */
  required?: boolean;
  /** Layout axis. Vertical groups move focus with Up/Down instead of Left/Right. @default horizontal */
  orientation?: Orientation;
  /** Control density. Falls back to the surrounding control size, then `md`. */
  size?: ControlSize;
  /** Color of the pressed items. @default accent */
  tone?: Tone;
  /** Resting look: `outline` and `subtle` connect the items, `ghost` spaces them. @default outline */
  appearance?: NonNullable<ToggleGroupVariantProps['appearance']>;
  className?: string;
  style?: CSSProperties;
  /** Ref to the `role="group"` element. */
  ref?: Ref<HTMLDivElement>;
};

export type ToggleGroupProps = ToggleGroupBaseProps &
  (
    | {
        /** Allow several pressed items at once. Without it at most one item is pressed. */
        multiple?: false;
        /** Controlled pressed item (`null` = controlled, nothing pressed). */
        value?: string | null;
        /** Initially pressed item when uncontrolled. */
        defaultValue?: string | null;
        /** Called with the pressed item (`null` when it was turned off). There is no native `onChange`: items are buttons. */
        onValueChange?: (value: string | null) => void;
      }
    | {
        multiple: true;
        /** Controlled pressed items. */
        value?: string[];
        /** Initially pressed items when uncontrolled. */
        defaultValue?: string[];
        /** Called with every pressed item, in the order they were turned on. */
        onValueChange?: (value: string[]) => void;
      }
  );

export type ToggleGroupItemProps = Omit<
  ComponentPropsWithRef<'button'>,
  'value' | 'className' | 'style' | 'ref' | 'type' | 'onChange'
> & {
  /** Identifies the item in the group's `value`. */
  value: string;
  /** Disables this item only. */
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Ref to the `<button>`. */
  ref?: Ref<HTMLButtonElement>;
};

type ToggleGroupContextValue = {
  isPressed: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
  item: ReturnType<typeof toggleGroup>['item'];
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

const ITEM_ATTR = 'data-toggle-group-item';
const ITEM_SELECTOR = `button[${ITEM_ATTR}]`;
const SCOPE_SELECTOR = '[role="group"][data-toggle-group]';

/**
 * Grouped toggle buttons where one or several can be pressed: text formatting, alignment, view
 * switches.
 *
 * ```tsx
 * <ToggleGroup aria-label="Text style" multiple>
 *   <ToggleGroup.Item value="bold" aria-label="Bold"><Icon name="bold" /></ToggleGroup.Item>
 *   <ToggleGroup.Item value="italic" aria-label="Italic"><Icon name="italic" /></ToggleGroup.Item>
 * </ToggleGroup>
 * ```
 *
 * Accessibility: `role="group"` of native buttons with `aria-pressed` (the APG toggle button
 * pattern) with roving focus: one Tab stop, arrow keys, Home and End move between items. Use
 * `SegmentedControl` or `RadioGroup` when exactly one option must always be chosen.
 */
export function ToggleGroup(props: ToggleGroupProps): JSX.Element {
  const {
    multiple,
    value,
    defaultValue,
    onValueChange,
    disabled = false,
    required = false,
    orientation = 'horizontal',
    size,
    tone,
    appearance,
    className,
    children,
    ref,
    onKeyDown,
    onFocus,
    ...rest
  } = props as ToggleGroupBaseProps & {
    multiple?: boolean;
    value?: string | string[] | null;
    defaultValue?: string | string[] | null;
    onValueChange?: (value: never) => void;
  };

  const contextSize = useControlSize();
  const g = toggleGroup({ size: size ?? contextSize ?? 'md', tone, appearance, orientation });
  const rootRef = useRef<HTMLDivElement>(null);
  const setRoot = useMemo(() => mergeRefs(rootRef, ref), [ref]);

  const toList = (v: string | string[] | null | undefined): string[] =>
    v == null ? [] : Array.isArray(v) ? v : [v];
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<string[]>(() => toList(defaultValue));
  const pressed = isControlled ? toList(value) : inner;

  const toggle = useCallback(
    (item: string) => {
      const on = pressed.includes(item);
      let next: string[];
      if (multiple) {
        if (on && required && pressed.length === 1) return;
        next = on ? pressed.filter((v) => v !== item) : [...pressed, item];
      } else {
        if (on && required) return;
        next = on ? [] : [item];
      }
      if (!isControlled) setInner(next);
      const emit = onValueChange as ((v: string[] | string | null) => void) | undefined;
      emit?.(multiple ? next : (next[0] ?? null));
    },
    [pressed, multiple, required, isControlled, onValueChange],
  );

  const context = useMemo<ToggleGroupContextValue>(
    () => ({ isPressed: (v) => pressed.includes(v), toggle, disabled, item: g.item }),
    [pressed, toggle, disabled, g.item],
  );

  // Roving tabindex lives in the DOM (not in React) so server markup stays plain buttons that
  // are all tabbable until hydration; after that one item is the Tab stop.
  const roving = useRovingFocus(rootRef, {
    itemSelector: ITEM_SELECTOR,
    scopeSelector: SCOPE_SELECTOR,
    orientation,
    initialStop: (items) => items.find((el) => el.getAttribute('aria-pressed') === 'true'),
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    roving.onKeyDown(event);
  };

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    roving.onFocus(event);
  };

  return (
    <ToggleGroupContext.Provider value={context}>
      <div
        {...rest}
        role="group"
        data-toggle-group=""
        data-required={required ? '' : undefined}
        {...mergeProps(g.root, className)}
        ref={setRoot}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  value,
  disabled,
  className,
  onClick,
  children,
  ref,
  ...rest
}: ToggleGroupItemProps): JSX.Element {
  const group = useContext(ToggleGroupContext);
  if (!group) throw new Error('ToggleGroup.Item must be rendered inside a ToggleGroup');
  const pressed = group.isPressed(value);
  const isDisabled = group.disabled || !!disabled;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) group.toggle(value);
  };

  return (
    <button
      {...rest}
      type="button"
      {...{ [ITEM_ATTR]: '' }}
      aria-pressed={pressed}
      data-selected={pressed ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      disabled={isDisabled}
      {...mergeProps(group.item, className)}
      onClick={handleClick}
      ref={ref}
    >
      {children}
    </button>
  );
}

ToggleGroup.Item = ToggleGroupItem;
