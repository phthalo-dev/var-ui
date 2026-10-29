import {
  type ComponentPropsWithRef,
  type CSSProperties,
  type JSX,
  type Ref,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  type Selection,
} from 'react-aria-components';
import { multiSelector } from '@var-ui/core/components/multiSelector';
import { Icon } from '../icons';
import type { FieldMeta } from './Field';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { mergeRefs } from '../internal/mergeRefs';
import { pickRacDroppedDomProps, racRenderWithExtras } from '../internal/racDomProps';
import { mergeProps } from 'typestyles';

export type MultiSelectorOption = {
  /** Unique option identifier passed to the selected value array. */
  id: string;
  /** Visible label in the trigger summary and listbox. */
  label: string;
};

export type MultiSelectorProps = Omit<
  ComponentPropsWithRef<'button'>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'className'
  | 'style'
  | 'children'
  | 'name'
  | 'placeholder'
  | 'disabled'
  | 'type'
  | 'ref'
> &
  FieldMeta & {
    /** Options shown in the dropdown listbox. */
    options: MultiSelectorOption[];
    /** Currently selected option ids. */
    value: string[];
    /** Called with the updated selected option ids whenever selection changes. */
    onChange: (value: string[]) => void;
    /** Placeholder text when no value is selected. @default Select… */
    placeholder?: string;
    isDisabled?: boolean;
    /** Marks the field invalid; defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** Name for form submission: one hidden input per selected id, like `<select multiple>`. */
    name?: string;
    /** Merged onto the root wrapper. */
    className?: string;
    /** Applied to the root wrapper. */
    style?: CSSProperties;
    /** Ref to the trigger `<button>` element. */
    ref?: Ref<HTMLButtonElement>;
  };

/**
 * Multi-select dropdown. `className`/`style` style the root; `ref`, `id` and every other native
 * attribute reach the trigger `<button>`.
 */
export function MultiSelector({
  label,
  description,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  isDisabled,
  invalid,
  name,
  className,
  style,
  id,
  ref,
  'aria-describedby': describedByProp,
  ...rest
}: MultiSelectorProps): JSX.Element {
  const ms = multiSelector();
  const triggerTextId = useId();
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: describedByProp,
  });
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const setTrigger = useMemo(() => mergeRefs(triggerRef, ref), [ref]);
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
    <FieldFrame
      slots={ms}
      frame={frame}
      label={label}
      description={description}
      errorMessage={errorMessage}
      errorRole="alert"
      className={className}
      style={style}
    >
      <AriaButton
        {...(rest as object)}
        {...frame.controlProps}
        ref={setTrigger}
        {...mergeProps(ms.trigger)}
        render={
          racRenderWithExtras(
            'button',
            pickRacDroppedDomProps({ ...rest, ...frame.controlProps }),
          ) as never
        }
        isDisabled={isDisabled}
        aria-labelledby={label ? `${frame.labelId} ${triggerTextId}` : undefined}
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
          aria-labelledby={label ? frame.labelId : undefined}
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
    </FieldFrame>
  );
}
