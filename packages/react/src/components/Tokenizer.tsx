import type { ComponentPropsWithRef, CSSProperties, JSX, KeyboardEvent, Ref } from 'react';
import { useState } from 'react';
import {
  Button,
  ComboBox as AriaComboBox,
  Group,
  Input,
  ListBox,
  ListBoxItem,
  Tag,
  TagGroup,
  TagList,
} from 'react-aria-components';
import { NativePopover } from '../internal/NativePopover';
import { tokenizer } from '@var-ui/core/components/tokenizer';
import { Icon } from '../icons';
import type { FieldMeta } from './Field';
import { FieldFrame, useFieldFrame } from './FieldFrame';
import { disabledKeysOf } from '../internal/racProps';
import { mergeProps } from 'typestyles';

export type TokenizerOption = {
  /** Unique option value, also used as the token's key once selected. */
  value: string;
  /** Visible label in the input's dropdown and the selected chip. */
  label: string;
  /** Prevents adding this option. */
  disabled?: boolean;
};

export type TokenizerProps = Omit<
  ComponentPropsWithRef<'input'>,
  | 'value'
  | 'defaultValue'
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
    /** Values of the selected tokens (controlled). Matches `Select multiple`. */
    value: string[];
    /** Called with the next array of token values when a token is added or removed. */
    onValueChange: (value: string[]) => void;
    /** Placeholder text shown in the search input when no tokens are selected. @default Add… */
    placeholder?: string;
    /** Disables the field and the hidden form inputs. */
    disabled?: boolean;
    /** Marks the field invalid; defaults to whether `errorMessage` is set. */
    invalid?: boolean;
    /** Name for form submission: one hidden input per token value, like `<select multiple>`. */
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
  onValueChange,
  placeholder = 'Add…',
  disabled,
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
  const selectedValues = new Set(value);
  const available = options.filter((option) => !selectedValues.has(option.value));
  const tokens = value
    .map((v) => options.find((o) => o.value === v))
    .filter((option): option is TokenizerOption => option !== undefined);

  function addToken(tokenValue: string) {
    const option = options.find((o) => o.value === tokenValue);
    if (option) onValueChange([...value, option.value]);
    setInputValue('');
  }

  function removeToken(tokenValue: string) {
    onValueChange(value.filter((v) => v !== tokenValue));
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeToken(value[value.length - 1]);
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
      <Group {...mergeProps(tk.group)} isDisabled={disabled}>
        <TagGroup
          aria-label={label ?? tokensLabel}
          {...mergeProps(tk.tokenList)}
          onRemove={(keys) => {
            for (const key of keys) removeToken(String(key));
          }}
        >
          <TagList
            items={tokens.map((token) => ({ ...token, id: token.value }))}
            {...mergeProps(tk.tokenList)}
          >
            {(item) => (
              <Tag id={item.value} {...mergeProps(tk.token)} textValue={item.label}>
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
          isDisabled={disabled}
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
          <NativePopover {...mergeProps(tk.popover)}>
            <ListBox items={available} disabledKeys={disabledKeysOf(available)}>
              {(option) => (
                <ListBoxItem id={option.value} textValue={option.label} {...mergeProps(tk.item)}>
                  {option.label}
                </ListBoxItem>
              )}
            </ListBox>
          </NativePopover>
        </AriaComboBox>
      </Group>
      {name
        ? value.map((v) => (
            <input key={v} type="hidden" name={name} value={v} disabled={disabled} />
          ))
        : null}
    </FieldFrame>
  );
}
