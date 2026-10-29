import type { ChangeEvent, JSX, Ref } from 'react';
import { searchInput } from '@var-ui/core/components/searchInput';
import type { SearchInputVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';

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
  /** Ref to the root `<div>` element. */
  ref?: Ref<HTMLDivElement>;
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
  ref,
  'aria-label': ariaLabel = placeholder,
}: SearchInputProps): JSX.Element {
  const s = searchInput({ variant, size });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event.target.value);
  };

  return (
    <div
      {...mergeProps(s.root, className)}
      ref={ref}
      data-var-ui-search-input
      data-variant={variant}
    >
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
