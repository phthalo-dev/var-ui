import type {
  ComponentPropsWithRef,
  CSSProperties,
  JSX,
  KeyboardEvent,
  ReactNode,
  Ref,
} from 'react';
import { createContext, useContext } from 'react';
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps,
} from 'react-aria-components';
import { chip } from '@var-ui/core/components/chip';
import { chipGroup } from '@var-ui/core/components/chipGroup';
import type { ChipVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { selectionProps, toRacProps, type Option } from '../internal/racProps';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as ChipAppearance } from '@var-ui/core';

type ChipGroupContextValue = ChipVariantProps & {
  disabled?: boolean;
};

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

export type ChipGroupOption = Omit<Option, 'label'> & {
  label: ReactNode;
  /** Accessible name when `label` is not plain text. */
  'aria-label'?: string;
};

type ChipGroupSelectionProps =
  | {
      /** Single selection (a `radiogroup` of chips). This is the default. */
      multiple?: false;
      /** Controlled selected value (`null` = controlled, nothing selected). */
      value?: string | null;
      /** Initially selected value when uncontrolled. */
      defaultValue?: string | null;
      /** Called with the selected value. */
      onValueChange?: (value: string | null) => void;
    }
  | {
      /** Allow several chips to be selected at once. */
      multiple: true;
      /** Controlled selected values. */
      value?: string[];
      /** Initially selected values when uncontrolled. */
      defaultValue?: string[];
      /** Called with the selected values. */
      onValueChange?: (value: string[]) => void;
    };

export type ChipGroupProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'onChange' | 'defaultValue' | 'ref'
> &
  ChipVariantProps &
  ChipGroupSelectionProps & {
    children?: ReactNode;
    /** Renders chips from data instead of compound children. */
    options?: ChipGroupOption[];
    /** Disables every chip. */
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    /** Accessible name for the group. */
    'aria-label'?: string;
    /** Ref to the `role="group"` `<div>` element (a group has no single native control). */
    ref?: Ref<HTMLDivElement>;
  };

export type ChipProps = Omit<
  ComponentPropsWithRef<'span'>,
  'children' | 'className' | 'onChange' | 'ref'
> &
  ChipVariantProps & {
    children: ReactNode;
    className?: string;
    /** Selection value when rendered inside `ChipGroup`. */
    value?: string;
    /** Controlled selected state for standalone filter/toggle chips. */
    selected?: boolean;
    /** Initial selected state for standalone toggle chips when uncontrolled. */
    defaultSelected?: boolean;
    /** Called with the new selected state when a standalone toggle chip is toggled. */
    onSelectedChange?: (selected: boolean) => void;
    /** Shows a dismiss control and calls this handler on press. */
    onRemove?: () => void;
    /** Accessible label for the remove button. @default Remove */
    removeLabel?: string;
    /** Disables a toggle chip and its remove control. */
    disabled?: boolean;
    /** Accessible name when children are not plain text. */
    'aria-label'?: string;
    /**
     * Ref to the root element: a `<button>` for toggle chips, otherwise a `<span>`. Native
     * attributes (`data-*`, `title`, handlers, ...) land on that same element. Inside a
     * `ChipGroup`, `id` is the selection key, so it is set from `value`.
     */
    ref?: Ref<HTMLElement>;
  };

function ChipLabel({ children }: { children: ReactNode }): JSX.Element {
  const c = chip();
  return <span {...mergeProps(c.label)}>{children}</span>;
}

function ChipRemoveButton({
  onRemove,
  removeLabel = 'Remove',
  disabled,
  overlay,
}: {
  onRemove: () => void;
  removeLabel?: string;
  disabled?: boolean;
  /** Positioned over the trailing edge of a sibling toggle button. */
  overlay?: boolean;
}): JSX.Element {
  const c = chip();
  return (
    <AriaButton
      {...mergeProps(c.removeButton)}
      aria-label={removeLabel}
      onPress={onRemove}
      isDisabled={disabled}
      data-overlay={overlay || undefined}
      excludeFromTabOrder
    >
      <Icon name="close" size="sm" />
    </AriaButton>
  );
}

type ChipToggleProps = Omit<ChipProps, 'value'> & { id?: string };

function ChipToggle({
  tone,
  appearance,
  children,
  className,
  selected,
  defaultSelected,
  onSelectedChange,
  onRemove,
  removeLabel,
  disabled,
  onKeyDown,
  ref,
  ...rest
}: ChipToggleProps): JSX.Element {
  const c = chip({ tone, appearance });
  const button = (
    <AriaToggleButton
      {...(rest as object)}
      {...toRacProps({ selected, defaultSelected, onSelectedChange, disabled })}
      {...mergeProps(c.root, className)}
      render={racRenderWithExtras('button', pickRacDroppedDomProps(rest)) as never}
      // The root is a <button> for toggles; the public ref type covers the static <span> too.
      ref={ref as Ref<HTMLButtonElement>}
      data-interactive
      data-removable={onRemove ? true : undefined}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event as unknown as KeyboardEvent<HTMLSpanElement>);
        if (onRemove && (event.key === 'Backspace' || event.key === 'Delete')) {
          event.preventDefault();
          onRemove();
        }
      }}
    >
      <ChipLabel>{children}</ChipLabel>
    </AriaToggleButton>
  );
  if (!onRemove) return button;
  // The remove control is a sibling of the toggle button (a button inside a
  // button is invalid HTML), overlaid on the pill's trailing edge.
  return (
    <span {...mergeProps(c.wrapper)}>
      {button}
      <ChipRemoveButton onRemove={onRemove} removeLabel={removeLabel} disabled={disabled} overlay />
    </span>
  );
}

/**
 * Pill-shaped label for filters, tags, and selections. Renders a `<button>` when it is a
 * toggle (`selected`/`onSelectedChange` or inside a `ChipGroup` via `value`), otherwise a `<span>`.
 *
 * ```tsx
 * <Chip selected={active} onSelectedChange={setActive}>React</Chip>
 * <Chip onRemove={() => remove('ts')}>TypeScript</Chip>
 * ```
 */
export function Chip({
  tone: toneProp,
  appearance: appearanceProp,
  children,
  className,
  value,
  selected,
  defaultSelected,
  onSelectedChange,
  onRemove,
  removeLabel,
  disabled: disabledProp,
  ref,
  ...rest
}: ChipProps): JSX.Element {
  const group = useContext(ChipGroupContext);
  const tone = toneProp ?? group?.tone ?? 'neutral';
  const appearance = appearanceProp ?? group?.appearance ?? 'subtle';
  const disabled = disabledProp ?? group?.disabled;

  if (value !== undefined && !group) {
    throw new Error('Chip with `value` must be rendered inside a ChipGroup.');
  }

  if (
    value !== undefined ||
    selected !== undefined ||
    defaultSelected !== undefined ||
    onSelectedChange !== undefined
  ) {
    // In a group the selection state lives on the group, keyed by `id`.
    const standalone = value === undefined;
    return (
      <ChipToggle
        {...rest}
        tone={tone}
        appearance={appearance}
        className={className}
        id={standalone ? rest.id : value}
        selected={standalone ? selected : undefined}
        defaultSelected={standalone ? defaultSelected : undefined}
        onSelectedChange={standalone ? onSelectedChange : undefined}
        ref={ref}
        disabled={disabled}
        onRemove={onRemove}
        removeLabel={removeLabel}
      >
        {children}
      </ChipToggle>
    );
  }

  const c = chip({ tone, appearance });
  return (
    <span {...rest} {...mergeProps(c.root, className)} ref={ref}>
      <ChipLabel>{children}</ChipLabel>
      {onRemove ? <ChipRemoveButton onRemove={onRemove} removeLabel={removeLabel} /> : null}
    </span>
  );
}

/**
 * Groups filter chips with single- (default) or multi-select (`multiple`) semantics.
 *
 * ```tsx
 * <ChipGroup multiple value={values} onValueChange={setValues}>
 *   <Chip value="react">React</Chip>
 *   <Chip value="vue">Vue</Chip>
 * </ChipGroup>
 * ```
 */
export function ChipGroup({
  tone = 'neutral',
  appearance = 'subtle',
  children,
  options,
  className,
  multiple = false,
  value,
  defaultValue,
  onValueChange,
  disabled,
  ref,
  ...props
}: ChipGroupProps): JSX.Element {
  const g = chipGroup();
  const contextValue: ChipGroupContextValue = { tone, appearance, disabled };
  const toArray = (v: string | string[] | null | undefined) =>
    v === undefined ? undefined : v === null ? [] : Array.isArray(v) ? v : [v];
  const selection = selectionProps({
    value: toArray(value),
    defaultValue: toArray(defaultValue),
    onValueChange: onValueChange
      ? (values) =>
          multiple
            ? (onValueChange as (v: string[]) => void)(values)
            : (onValueChange as (v: string | null) => void)(values[0] ?? null)
      : undefined,
  });

  return (
    <AriaToggleButtonGroup
      {...(props as ToggleButtonGroupProps)}
      {...toRacProps({ disabled })}
      {...(selection as object)}
      selectionMode={multiple ? 'multiple' : 'single'}
      {...mergeProps(g.root, className)}
      ref={ref}
    >
      <ChipGroupContext.Provider value={contextValue}>
        {children ??
          options?.map((option) => (
            <Chip
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              aria-label={option['aria-label']}
            >
              {option.label}
            </Chip>
          ))}
      </ChipGroupContext.Provider>
    </AriaToggleButtonGroup>
  );
}

export type PillProps = Omit<
  ChipProps,
  'onRemove' | 'selected' | 'defaultSelected' | 'onSelectedChange' | 'value'
> & {
  onRemove: () => void;
};

/**
 * Removable tag chip — shorthand for `<Chip onRemove={…}>`.
 *
 * ```tsx
 * <Pill onRemove={() => removeTag('docs')}>Documentation</Pill>
 * ```
 */
export function Pill({ onRemove, ...props }: PillProps): JSX.Element {
  return <Chip {...props} onRemove={onRemove} />;
}

export type { Key as ChipGroupKey };
