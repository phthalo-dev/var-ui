import type { ComponentPropsWithRef, CSSProperties, JSX, ReactNode, Ref } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components';
import { segmentedControl } from '@var-ui/core/components/segmentedControl';
import { toggleButton } from '@var-ui/core/components/toggleButton';
import type { SegmentedControlVariantProps, ToggleButtonVariantProps } from '@var-ui/core';
import { observeSegmentedControlIndicator } from '@var-ui/core/components/indicators/segmented-control';
import { mergeProps } from 'typestyles';
import { mergeRefs } from '../internal/mergeRefs';
import { useControlSize } from '../internal/controlSizeContext';
import { selectionProps, toRacProps, type Option } from '../internal/racProps';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';

export type SegmentedControlOption = Omit<Option, 'label'> & {
  label: ReactNode;
  /** Accessible name when `label` is not plain text (e.g. icon-only segments). */
  'aria-label'?: string;
};

export type SegmentedControlProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'className' | 'style' | 'onChange' | 'defaultValue' | 'ref'
> & {
  /** Segment definitions rendered as toggle buttons. */
  options: SegmentedControlOption[];
  /** Controlled selected value (`null` = controlled, nothing selected). */
  value?: string | null;
  /** Initially selected value when uncontrolled. Defaults to the first option. */
  defaultValue?: string | null;
  /**
   * Called with the selected value. There is no native `onChange`: the segments are toggle
   * buttons, not form inputs, so use `onValueChange`.
   */
  onValueChange?: (value: string | null) => void;
  /** Disables every segment. */
  disabled?: boolean;
  /** Layout direction of the segments. */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
  /** Control density. Falls back to the surrounding control size, then `md`. */
  size?: NonNullable<SegmentedControlVariantProps['size']>;
  /**
   * Ref to the `role="group"` element. A segmented control has no single native control, so
   * this is the nearest real element; each segment is a toggle button.
   */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Single-select segmented control built on `ToggleButtonGroup`.
 *
 * ```tsx
 * <SegmentedControl options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />
 * ```
 */
export function SegmentedControl({
  options,
  className,
  size,
  value,
  defaultValue,
  onValueChange,
  disabled,
  ref,
  ...props
}: SegmentedControlProps): JSX.Element {
  const contextSize = useControlSize();
  const s = segmentedControl({ size: size ?? contextSize ?? 'md' });
  const t = toggleButton({ segmented: true });
  const rootRef = useRef<HTMLDivElement>(null);
  const setRoot = useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    defaultValue !== undefined ? defaultValue : (options[0]?.value ?? null),
  );
  const activeValue = isControlled ? value : uncontrolledValue;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeSegmentedControlIndicator(root);
  }, [activeValue, options]);

  const toArray = (v: string | null | undefined) => (v == null ? [] : [v]);
  const selection = selectionProps({
    value: isControlled ? toArray(value) : undefined,
    defaultValue: isControlled || defaultValue === undefined ? undefined : toArray(defaultValue),
    onValueChange: (values) => {
      const next = values[0] ?? null;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
  });

  return (
    <AriaToggleButtonGroup
      {...(props as RACToggleButtonGroupProps)}
      {...toRacProps({ disabled })}
      {...(selection as object)}
      ref={setRoot}
      selectionMode="single"
      {...mergeProps(s.root, className)}
    >
      {options.map((option) => (
        <AriaToggleButton
          key={option.value}
          id={option.value}
          aria-label={option['aria-label']}
          isDisabled={option.disabled}
          {...mergeProps(t)}
        >
          {option.label}
        </AriaToggleButton>
      ))}
    </AriaToggleButtonGroup>
  );
}

export type ToggleButtonProps = Omit<
  ComponentPropsWithRef<'button'>,
  'children' | 'className' | 'style' | 'onChange' | 'ref'
> & {
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state when uncontrolled. */
  defaultSelected?: boolean;
  /** Called with the new selected state. A button has no native `change` event, so there is no `onChange`. */
  onSelectedChange?: (selected: boolean) => void;
  /** Disables the button. */
  disabled?: boolean;
  children?: ReactNode;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  style?: CSSProperties;
  size?: NonNullable<ToggleButtonVariantProps['size']>;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/** Standalone toggle button for toolbars and filters. */
export function ToggleButton({
  className,
  size = 'md',
  children,
  selected,
  defaultSelected,
  onSelectedChange,
  disabled,
  ref,
  ...props
}: ToggleButtonProps): JSX.Element {
  const t = toggleButton({ size });
  const extras = pickRacDroppedDomProps(props);
  return (
    <AriaToggleButton
      {...(props as RACToggleButtonProps)}
      {...toRacProps({ selected, defaultSelected, onSelectedChange, disabled })}
      {...mergeProps(t, className)}
      render={racRenderWithExtras('button', extras) as never}
      ref={ref}
    >
      {children}
    </AriaToggleButton>
  );
}
