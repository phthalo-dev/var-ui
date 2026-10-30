import type { ChangeEvent, ComponentPropsWithRef, CSSProperties, JSX } from 'react';
import { searchInput } from '@var-ui/core/components/searchInput';
import type { SearchInputVariantProps } from '@var-ui/core';
import { Icon } from '../icons';
import { mergeProps } from 'typestyles';
import { useControlSize } from '../internal/controlSizeContext';

export type SearchInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'type' | 'className' | 'style'
> & {
  /** Control density. Falls back to the surrounding control size, then `md`. */
  size?: NonNullable<SearchInputVariantProps['size']>;
  /** Called with the new text on every change. The native `onChange` event also reaches the `<input>`. */
  onValueChange?: (value: string) => void;
  /** Placeholder, also the default accessible name. @default 'Search…' */
  placeholder?: string;
  /** Classes merged onto the root wrapper. */
  className?: string;
  /** Inline style for the root wrapper. */
  style?: CSSProperties;
};

/**
 * Compact search field for toolbars and data-table filters. Wraps the core
 * `searchInput` recipe's `default` variant (the `command` trigger variant is
 * Astro-only; use `CommandPalette` in React). `className`/`style` style the
 * root; `ref` and every other native attribute reach the `<input>`.
 */
export function SearchInput({
  size,
  onValueChange,
  onChange,
  placeholder = 'Search…',
  className,
  style,
  'aria-label': ariaLabel = placeholder,
  ...rest
}: SearchInputProps): JSX.Element {
  const contextSize = useControlSize();
  const resolvedSize = size ?? contextSize ?? 'md';
  const s = searchInput({ variant: 'default', size: resolvedSize });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  return (
    <div
      {...mergeProps(s.root, className)}
      style={style}
      data-var-ui-search-input
      data-variant="default"
    >
      <span {...mergeProps(s.icon)} aria-hidden="true">
        <Icon
          name="search"
          size={resolvedSize === 'lg' ? 'lg' : resolvedSize === 'sm' ? 'sm' : 'md'}
        />
      </span>
      <input
        autoComplete="off"
        spellCheck={false}
        {...rest}
        {...mergeProps(s.input)}
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={handleChange}
      />
    </div>
  );
}
