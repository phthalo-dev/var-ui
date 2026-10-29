import type { ComponentPropsWithRef, CSSProperties, JSX, KeyboardEvent, Ref } from 'react';
import { useState } from 'react';
import {
  Button,
  ComboBox as AriaComboBox,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Tag,
  TagGroup,
  TagList,
} from 'react-aria-components';
import { tokenizer } from '@var-ui/core/components/tokenizer';
import { Icon } from '../icons';
import type { FieldMeta } from './Field';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { mergeProps } from 'typestyles';

export type TokenizerOption = {
  /** Unique option identifier — also used as the token's key once selected. */
  id: string;
  /** Visible label in the input's dropdown and the selected chip. */
  label: string;
};

export type TokenizerProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'className'
  | 'style'
  | 'children'
  | 'name'
  | 'placeholder'
  | 'disabled'
  | 'size'
  | 'type'
  | 'ref'
> &
  FieldMeta & {
    /** Full candidate list; options already present in `value` are excluded from the dropdown. */
    options: TokenizerOption[];
    /** Selected tokens (controlled). */
    value: TokenizerOption[];
    /** Called with the next token array when a token is added or removed. */
    onChange: (value: TokenizerOption[]) => void;
    /** Placeholder text shown in the search input when no tokens are selected. @default Add… */
    placeholder?: string;
    isDisabled?: boolean;
    /** Marks the field invalid; defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** Name for form submission: one hidden input per token id, like `<select multiple>`. */
    name?: string;
    /** Accessible name for the token list when there is no `label`. @default Selected */
    tokensLabel?: string;
    /** Accessible name for the search input when there is no `label`. @default Search */
    searchLabel?: string;
    /** Prefix of each token's remove button name (followed by the token label). @default Remove */
    removeLabel?: string;
    /** Merged onto the root wrapper. */
    className?: string;
    /** Applied to the root wrapper. */
    style?: CSSProperties;
    /** Ref to the search `<input>` element. */
    ref?: Ref<HTMLInputElement>;
  };

/**
 * Token (tag) input with a filtered dropdown. `className`/`style` style the root; `ref`, `id`
 * and every other native attribute reach the search `<input>`.
 */
export function Tokenizer({
  label,
  description,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = 'Add…',
  isDisabled,
  invalid,
  name,
  tokensLabel = 'Selected',
  searchLabel = 'Search',
  removeLabel = 'Remove',
  className,
  style,
  id,
  ref,
  onKeyDown,
  'aria-describedby': describedByProp,
  ...rest
}: TokenizerProps): JSX.Element {
  const tk = tokenizer();
  const [inputValue, setInputValue] = useState('');
  const frame = useFieldFrame({
    description,
    errorMessage,
    invalid,
    id,
    describedBy: describedByProp,
  });
  const selectedIds = new Set(value.map((option) => option.id));
  const available = options.filter((option) => !selectedIds.has(option.id));

  function addToken(id: string) {
    const option = options.find((o) => o.id === id);
    if (option) onChange([...value, option]);
    setInputValue('');
  }

  function removeToken(id: string) {
    onChange(value.filter((option) => option.id !== id));
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeToken(value[value.length - 1].id);
    }
  }

  return (
    <FieldFrame
      slots={tk}
      frame={frame}
      label={label}
      description={description}
      errorMessage={errorMessage}
      className={className}
      style={style}
    >
      <Group {...mergeProps(tk.group)} isDisabled={isDisabled}>
        <TagGroup
          aria-label={label ?? tokensLabel}
          {...mergeProps(tk.tokenList)}
          onRemove={(keys) => {
            for (const key of keys) removeToken(String(key));
          }}
        >
          <TagList items={value} {...mergeProps(tk.tokenList)}>
            {(item) => (
              <Tag id={item.id} {...mergeProps(tk.token)} textValue={item.label}>
                <span {...mergeProps(tk.tokenLabel)}>{item.label}</span>
                <Button
                  slot="remove"
                  {...mergeProps(tk.tokenRemoveButton)}
                  aria-label={`${removeLabel} ${item.label}`}
                >
                  <Icon name="close" size="sm" />
                </Button>
              </Tag>
            )}
          </TagList>
        </TagGroup>
        <AriaComboBox
          aria-label={label ?? searchLabel}
          id={frame.controlId}
          inputValue={inputValue}
          onInputChange={setInputValue}
          isDisabled={isDisabled}
          isInvalid={frame.invalid || undefined}
          aria-describedby={frame.controlProps['aria-describedby']}
          onSelectionChange={(key) => {
            if (key != null) addToken(String(key));
          }}
        >
          <Input
            {...rest}
            {...mergeProps(tk.input)}
            ref={ref}
            placeholder={value.length === 0 ? placeholder : ''}
            onKeyDown={handleInputKeyDown}
          />
          <Popover {...mergeProps(tk.popover)}>
            <ListBox items={available}>
              {(option) => (
                <ListBoxItem id={option.id} textValue={option.label} {...mergeProps(tk.item)}>
                  {option.label}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </AriaComboBox>
      </Group>
      {name
        ? value.map((option) => (
            <input
              key={option.id}
              type="hidden"
              name={name}
              value={option.id}
              disabled={isDisabled}
            />
          ))
        : null}
    </FieldFrame>
  );
}
