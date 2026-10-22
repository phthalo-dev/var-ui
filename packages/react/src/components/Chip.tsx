import type { JSX, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type Key,
  type ToggleButtonGroupProps,
} from 'react-aria-components';
import { chip, chipGroup, type ChipVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
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
  ChipVariantProps & {
    children?: ReactNode;
    /** Renders chips from data instead of compound children. */
    options?: ChipGroupOption[];
    className?: string;
    /** Accessible name for the group. */
    'aria-label'?: string;
  };

export type ChipProps = ChipVariantProps & {
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
};

function ChipLabel({ children }: { children: ReactNode }): JSX.Element {
  const c = chip();
  return <span {...mergeProps(c.label)}>{children}</span>;
}

function ChipRemoveButton({
  onRemove,
  removeLabel = 'Remove',
}: {
  onRemove: () => void;
  removeLabel?: string;
}): JSX.Element {
  const c = chip();
  return (
    <AriaButton
      {...mergeProps(c.removeButton)}
      aria-label={removeLabel}
      onPress={onRemove}
      excludeFromTabOrder
    >
      <Icon name="close" size="sm" />
    </AriaButton>
  );
}

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
  id,
  'aria-label': ariaLabel,
}: ChipProps & { id?: string }): JSX.Element {
  const c = chip({ tone, appearance });
  return (
    <AriaToggleButton
      id={id}
      isSelected={isSelected}
      onChange={onChange}
      isDisabled={isDisabled}
      aria-label={ariaLabel}
      {...mergeProps(c.root, className)}
      data-interactive
    >
      <ChipLabel>{children}</ChipLabel>
      {onRemove ? <ChipRemoveButton onRemove={onRemove} removeLabel={removeLabel} /> : null}
    </AriaToggleButton>
  );
}

/**
 * Pill-shaped label for filters, tags, and selections.
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
  'aria-label': ariaLabel,
}: ChipProps): JSX.Element {
  const group = useContext(ChipGroupContext);
  const tone = toneProp ?? group?.tone ?? 'neutral';
  const appearance = appearanceProp ?? group?.appearance ?? 'subtle';
  const isDisabled = isDisabledProp ?? group?.isDisabled;

  if (value !== undefined) {
    if (!group) {
      throw new Error('Chip with `value` must be rendered inside a ChipGroup.');
    }
    return (
      <ChipToggle
        tone={tone}
        appearance={appearance}
        className={className}
        id={value}
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        onRemove={onRemove}
        removeLabel={removeLabel}
      >
        {children}
      </ChipToggle>
    );
  }

  const isToggle = isSelected !== undefined || onChange !== undefined;

  if (isToggle) {
    return (
      <ChipToggle
        tone={tone}
        appearance={appearance}
        className={className}
        isSelected={isSelected}
        onChange={onChange}
        isDisabled={isDisabled}
        aria-label={ariaLabel}
        onRemove={onRemove}
        removeLabel={removeLabel}
      >
        {children}
      </ChipToggle>
    );
  }

  const c = chip({ tone, appearance });

  if (onRemove) {
    return (
      <span {...mergeProps(c.root, className)}>
        <ChipLabel>{children}</ChipLabel>
        <ChipRemoveButton onRemove={onRemove} removeLabel={removeLabel} />
      </span>
    );
  }

  return (
    <span {...mergeProps(c.root, className)}>
      <ChipLabel>{children}</ChipLabel>
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
