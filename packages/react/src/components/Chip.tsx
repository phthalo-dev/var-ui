import type { ComponentPropsWithRef, JSX, KeyboardEvent, ReactNode, Ref } from 'react';
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
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import { mergeProps } from 'typestyles';

export type { SurfaceAppearance as ChipAppearance } from '@var-ui/core';

type ChipGroupContextValue = ChipVariantProps & {
  isDisabled?: boolean;
};

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

export type ChipGroupOption = {
  /** Selection key for the chip. */
  value: string;
  label: ReactNode;
  /** Accessible name when `label` is not plain text. */
  'aria-label'?: string;
  isDisabled?: boolean;
};

export type ChipGroupProps = Omit<ToggleButtonGroupProps, 'children' | 'className'> &
  Omit<
    ComponentPropsWithRef<'div'>,
    keyof ToggleButtonGroupProps | 'className' | 'children' | 'style'
  > &
  ChipVariantProps & {
    children?: ReactNode;
    /** Renders chips from data instead of compound children. */
    options?: ChipGroupOption[];
    className?: string;
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
    /** Selection key when rendered inside `ChipGroup`. */
    value?: string;
    /** Selected state for standalone filter/toggle chips. */
    isSelected?: boolean;
    /** Called when a standalone toggle chip is pressed. */
    onChange?: (selected: boolean) => void;
    /** Shows a dismiss control and calls this handler on press. */
    onRemove?: () => void;
    /** Accessible label for the remove button. @default Remove */
    removeLabel?: string;
    isDisabled?: boolean;
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
  isDisabled,
  overlay,
}: {
  onRemove: () => void;
  removeLabel?: string;
  isDisabled?: boolean;
  /** Positioned over the trailing edge of a sibling toggle button. */
  overlay?: boolean;
}): JSX.Element {
  const c = chip();
  return (
    <AriaButton
      {...mergeProps(c.removeButton)}
      aria-label={removeLabel}
      onPress={onRemove}
      isDisabled={isDisabled}
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
  isSelected,
  onChange,
  onRemove,
  removeLabel,
  isDisabled,
  onKeyDown,
  ref,
  ...rest
}: ChipToggleProps): JSX.Element {
  const c = chip({ tone, appearance });
  const button = (
    <AriaToggleButton
      {...(rest as object)}
      isSelected={isSelected}
      onChange={onChange}
      isDisabled={isDisabled}
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
      <ChipRemoveButton
        onRemove={onRemove}
        removeLabel={removeLabel}
        isDisabled={isDisabled}
        overlay
      />
    </span>
  );
}

/**
 * Pill-shaped label for filters, tags, and selections. Renders a `<button>` when it is a
 * toggle (`isSelected`/`onChange` or inside a `ChipGroup` via `value`), otherwise a `<span>`.
 *
 * ```tsx
 * <Chip isSelected={active} onChange={setActive}>React</Chip>
 * <Chip onRemove={() => remove('ts')}>TypeScript</Chip>
 * ```
 */
export function Chip({
  tone: toneProp,
  appearance: appearanceProp,
  children,
  className,
  value,
  isSelected,
  onChange,
  onRemove,
  removeLabel,
  isDisabled: isDisabledProp,
  ref,
  ...rest
}: ChipProps): JSX.Element {
  const group = useContext(ChipGroupContext);
  const tone = toneProp ?? group?.tone ?? 'neutral';
  const appearance = appearanceProp ?? group?.appearance ?? 'subtle';
  const isDisabled = isDisabledProp ?? group?.isDisabled;

  if (value !== undefined && !group) {
    throw new Error('Chip with `value` must be rendered inside a ChipGroup.');
  }

  if (value !== undefined || isSelected !== undefined || onChange !== undefined) {
    // In a group the selection state lives on the group, keyed by `id`.
    const standalone = value === undefined;
    return (
      <ChipToggle
        {...rest}
        tone={tone}
        appearance={appearance}
        className={className}
        id={standalone ? rest.id : value}
        isSelected={standalone ? isSelected : undefined}
        onChange={standalone ? onChange : undefined}
        ref={ref}
        isDisabled={isDisabled}
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
 * Groups filter chips with single- or multi-select semantics.
 *
 * ```tsx
 * <ChipGroup selectionMode="multiple" selectedKeys={keys} onSelectionChange={setKeys}>
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
  selectionMode = 'multiple',
  isDisabled,
  ref,
  ...props
}: ChipGroupProps): JSX.Element {
  const g = chipGroup();
  const contextValue: ChipGroupContextValue = { tone, appearance, isDisabled };

  return (
    <AriaToggleButtonGroup
      selectionMode={selectionMode}
      isDisabled={isDisabled}
      {...props}
      {...mergeProps(g.root, className)}
      ref={ref}
    >
      <ChipGroupContext.Provider value={contextValue}>
        {children ??
          options?.map((option) => (
            <Chip
              key={option.value}
              value={option.value}
              isDisabled={option.isDisabled}
              aria-label={option['aria-label']}
            >
              {option.label}
            </Chip>
          ))}
      </ChipGroupContext.Provider>
    </AriaToggleButtonGroup>
  );
}

export type PillProps = Omit<ChipProps, 'onRemove' | 'isSelected' | 'onChange' | 'value'> & {
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
