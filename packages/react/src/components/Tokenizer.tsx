import type { JSX, KeyboardEvent } from 'react';
import { useState } from 'react';
import {
  Button,
  ComboBox as AriaComboBox,
  Group,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Tag,
  TagGroup,
  TagList,
} from 'react-aria-components';
import { tokenizer } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

export type TokenizerOption = {
  /** Unique option identifier — also used as the token's key once selected. */
  id: string;
  /** Visible label in the input's dropdown and the selected chip. */
  label: string;
};

export type TokenizerProps = {
  /** Field label rendered above the group. */
  label?: string;
  /** Helper text shown below the group when there is no error. */
  description?: string;
  /** Validation message; when set, the field is shown in an error state. */
  errorMessage?: string;
  /** Full candidate list; options already present in `value` are excluded from the dropdown. */
  options: TokenizerOption[];
  /** Selected tokens (controlled). */
  value: TokenizerOption[];
  /** Called with the next token array when a token is added or removed. */
  onChange: (value: TokenizerOption[]) => void;
  /** Placeholder text shown in the search input when no tokens are selected. @default Add… */
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
};

export function Tokenizer({
  label,
  description,
  errorMessage,
  options,
  value,
  onChange,
  placeholder = 'Add…',
  isDisabled,
  className,
}: TokenizerProps): JSX.Element {
  const tk = tokenizer();
  const [inputValue, setInputValue] = useState('');
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
    if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeToken(value[value.length - 1].id);
    }
  }

  return (
    <div {...mergeProps(tk.root, className)}>
      {label ? <Label {...mergeProps(tk.label)}>{label}</Label> : null}
      <Group {...mergeProps(tk.group)} isDisabled={isDisabled}>
        <TagGroup
          aria-label={label ?? 'Selected'}
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
                  aria-label={`Remove ${item.label}`}
                >
                  <Icon name="close" size="sm" />
                </Button>
              </Tag>
            )}
          </TagList>
        </TagGroup>
        <AriaComboBox
          aria-label={label ?? 'Search'}
          inputValue={inputValue}
          onInputChange={setInputValue}
          isDisabled={isDisabled}
          onSelectionChange={(key) => {
            if (key != null) addToken(String(key));
          }}
        >
          <Input
            {...mergeProps(tk.input)}
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
      {description ? <p {...mergeProps(tk.description)}>{description}</p> : null}
      {errorMessage ? <p {...mergeProps(tk.error)}>{errorMessage}</p> : null}
    </div>
  );
}
