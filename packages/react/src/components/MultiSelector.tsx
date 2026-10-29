import { type JSX, type Ref, useId, useRef, useState } from 'react';
import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  type Selection,
} from 'react-aria-components';
import { multiSelector } from '@var-ui/core';
import { Icon } from '../icons';
import type { FieldMeta } from './Field';
import { mergeProps } from 'typestyles';

export type MultiSelectorOption = {
  /** Unique option identifier passed to the selected value array. */
  id: string;
  /** Visible label in the trigger summary and listbox. */
  label: string;
};

export type MultiSelectorProps = FieldMeta & {
  /** Options shown in the dropdown listbox. */
  options: MultiSelectorOption[];
  /** Currently selected option ids. */
  value: string[];
  /** Called with the updated selected option ids whenever selection changes. */
  onChange: (value: string[]) => void;
  /** Placeholder text when no value is selected. @default Select… */
  placeholder?: string;
  isDisabled?: boolean;
  /** Name for form submission: one hidden input per selected id, like `<select multiple>`. */
  name?: string;
  className?: string;
  /** Ref to the root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
};

export function MultiSelector({
  label,
  description,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  isDisabled,
  name,
  className,
  ref,
}: MultiSelectorProps): JSX.Element {
  const ms = multiSelector();
  const labelId = useId();
  const triggerTextId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedBy =
    [description ? descriptionId : null, errorMessage ? errorId : null].filter(Boolean).join(' ') ||
    undefined;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectedLabels = options.filter((o) => value.includes(o.id)).map((o) => o.label);
  const isPlaceholder = selectedLabels.length === 0;
  const triggerText = isPlaceholder ? placeholder : selectedLabels.join(', ');

  function handleSelectionChange(keys: Selection) {
    if (keys === 'all') {
      onChange(options.map((o) => o.id));
    } else {
      onChange(Array.from(keys, String));
    }
  }

  return (
    <div {...mergeProps(ms.root, className)} ref={ref}>
      {label ? (
        <Label id={labelId} {...mergeProps(ms.label)}>
          {label}
        </Label>
      ) : null}
      <AriaButton
        ref={triggerRef}
        {...mergeProps(ms.trigger)}
        isDisabled={isDisabled}
        aria-labelledby={label ? `${labelId} ${triggerTextId}` : undefined}
        aria-describedby={describedBy}
        onPress={() => setIsOpen((open) => !open)}
      >
        <span
          id={triggerTextId}
          {...mergeProps(ms.triggerValue)}
          data-placeholder={isPlaceholder || undefined}
        >
          {triggerText}
        </span>
        <span {...mergeProps(ms.triggerIcon)} aria-hidden>
          <Icon name="arrowsUpDown" size="sm" />
        </span>
      </AriaButton>
      <Popover
        {...mergeProps(ms.popover)}
        triggerRef={triggerRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <ListBox
          {...mergeProps(ms.listbox)}
          items={options}
          selectionMode="multiple"
          selectedKeys={new Set(value)}
          onSelectionChange={handleSelectionChange}
          aria-labelledby={label ? labelId : undefined}
        >
          {(option) => (
            <ListBoxItem id={option.id} textValue={option.label} {...mergeProps(ms.item)}>
              {({ isSelected }) => (
                <>
                  <span {...mergeProps(ms.itemCheckbox)} data-selected={isSelected || undefined}>
                    {isSelected ? <Icon name="check" size="sm" /> : null}
                  </span>
                  <span {...mergeProps(ms.itemLabel)}>{option.label}</span>
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
      {name
        ? value.map((id) => (
            <input key={id} type="hidden" name={name} value={id} disabled={isDisabled} />
          ))
        : null}
      {description ? (
        <p {...mergeProps(ms.description)} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p {...mergeProps(ms.error)} id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
