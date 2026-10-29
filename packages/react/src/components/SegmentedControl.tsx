import type { JSX, ReactNode, Ref } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
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

export type SegmentedControlOption = {
  id: string;
  label: ReactNode;
  /** Accessible name when `label` is not plain text (e.g. icon-only segments). */
  'aria-label'?: string;
};

export type SegmentedControlProps = Omit<RACToggleButtonGroupProps, 'children' | 'className'> & {
  /** Segment definitions rendered as toggle buttons. */
  options: SegmentedControlOption[];
  className?: string;
  size?: NonNullable<SegmentedControlVariantProps['size']>;
  /** Ref to the underlying `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

/**
 * Single-select segmented control built on `ToggleButtonGroup`.
 *
 * ```tsx
 * <SegmentedControl options={[{ id: 'list', label: 'List' }, { id: 'grid', label: 'Grid' }]} />
 * ```
 */
export function SegmentedControl({
  options,
  className,
  size = 'md',
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ref,
  ...props
}: SegmentedControlProps): JSX.Element {
  const s = segmentedControl({ size });
  const t = toggleButton({ segmented: true });
  const rootRef = useRef<HTMLDivElement>(null);
  const setRoot = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );
  const isControlled = selectedKeys !== undefined;
  const [uncontrolledKeys, setUncontrolledKeys] = useState(
    defaultSelectedKeys ?? (options[0] ? [options[0].id] : []),
  );
  const activeKeys = isControlled ? selectedKeys : uncontrolledKeys;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return observeSegmentedControlIndicator(root);
  }, [activeKeys, options]);

  return (
    <AriaToggleButtonGroup
      {...props}
      ref={setRoot}
      selectionMode={selectionMode}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={(keys) => {
        if (!isControlled) {
          setUncontrolledKeys([...keys]);
        }
        onSelectionChange?.(keys);
      }}
      {...mergeProps(s.root, className)}
    >
      {options.map((option) => (
        <AriaToggleButton
          key={option.id}
          id={option.id}
          aria-label={option['aria-label']}
          {...mergeProps(t)}
        >
          {option.label}
        </AriaToggleButton>
      ))}
    </AriaToggleButtonGroup>
  );
}

export type ToggleButtonProps = Omit<RACToggleButtonProps, 'className'> & {
  className?: string;
  size?: NonNullable<ToggleButtonVariantProps['size']>;
  /** Ref to the underlying `<button>` element. */
  ref?: Ref<HTMLButtonElement>;
};

/** Standalone toggle button for toolbars and filters. */
export function ToggleButton({
  className,
  size = 'md',
  children,
  ref,
  ...props
}: ToggleButtonProps): JSX.Element {
  const t = toggleButton({ size });
  return (
    <AriaToggleButton {...props} {...mergeProps(t, className)} ref={ref}>
      {children}
    </AriaToggleButton>
  );
}
