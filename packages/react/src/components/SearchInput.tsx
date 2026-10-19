import type { ChangeEvent, JSX } from 'react';
import { searchInput, type SearchInputVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from './utils';

export type SearchInputProps = {
  variant?: NonNullable<SearchInputVariantProps['variant']>;
  size?: NonNullable<SearchInputVariantProps['size']>;
  /** Controlled value for the default search field variant. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
};

/**
 * Compact search field for toolbars and data-table filters. Wraps the core
 * `searchInput` recipe (`variant="default"` only — command triggers belong
 * in `CommandPalette`).
 */
export function SearchInput({
  variant = 'default',
  size = 'md',
  value,
  defaultValue,
  onChange,
  placeholder = 'Search…',
  name,
  className,
  'aria-label': ariaLabel = placeholder,
}: SearchInputProps): JSX.Element {
  const s = searchInput({ variant, size });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <div {...mergeProps(s.root, className)} data-var-ui-search-input data-variant={variant}>
      <span {...mergeProps(s.icon)} aria-hidden="true">
        <Icon name="search" size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} />
      </span>
      <input
        {...mergeProps(s.input)}
        type="search"
        name={name}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        spellCheck={false}
        onChange={handleChange}
      />
    </div>
  );
}
