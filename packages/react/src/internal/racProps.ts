/**
 * The ONE adapter between VarUI's public prop vocabulary and
 * react-aria-components (RAC). RAC is an implementation detail: public prop
 * types are written out in VarUI names (`disabled`, `value`, `onValueChange`,
 * `open`, ...) and every component converts at the RAC boundary through this
 * module. Components must not hand-map names.
 *
 * Contents
 * - `toRacProps` / `RacProps`: boolean + change-callback renames (`disabled` -> `isDisabled`, ...).
 * - `singleValueProps` / `multiValueProps`: `value` (string / string[]) <-> RAC `Key` / `Key[]`.
 * - `selectedKeyProps` / `selectionProps`: the same for RAC collections that use `selectedKey`
 *   or a `Selection` set (Tabs, ComboBox, ListBox, GridList, Tree, TagGroup, ...).
 * - Option helpers: `{ value, label, disabled }` <-> RAC `id` / `textValue` / `isDisabled`.
 */
import type { ReactNode } from 'react';
import type { Key } from 'react-aria-components';

/** VarUI public name -> RAC name. Names that are identical in both (`defaultOpen`, `name`) are not listed. */
export const RAC_RENAMES = {
  disabled: 'isDisabled',
  required: 'isRequired',
  readOnly: 'isReadOnly',
  invalid: 'isInvalid',
  open: 'isOpen',
  expanded: 'isExpanded',
  selected: 'isSelected',
  /** Checkbox/Switch: `checked` is the HTML name for RAC's `isSelected`. */
  checked: 'isSelected',
  defaultChecked: 'defaultSelected',
  indeterminate: 'isIndeterminate',
  dismissable: 'isDismissable',
  pending: 'isPending',
  loading: 'isPending',
  rowHeader: 'isRowHeader',
  /** Date predicate `(date) => boolean`: RAC's `isDateUnavailable`. */
  unavailable: 'isDateUnavailable',
  wheelDisabled: 'isWheelDisabled',
  /** `onValueChange(value)` is RAC's `onChange(value)` (RAC's `onChange` is a value callback). */
  onValueChange: 'onChange',
  /** Checkbox/Switch/Toggle: `onCheckedChange(checked)` is RAC's `onChange(isSelected)`. */
  onCheckedChange: 'onChange',
  onSelectedChange: 'onChange',
} as const;

type RenameMap = typeof RAC_RENAMES;

/** `P` with every key in {@link RAC_RENAMES} renamed to its RAC name. */
export type RacProps<P> = {
  [K in keyof P as K extends keyof RenameMap ? RenameMap[K] : K]: P[K];
};

/**
 * Renames VarUI public props to RAC names and drops `undefined` values, so
 * RAC's own defaults (and its controlled/uncontrolled detection, which treats
 * a present-but-undefined key as controlled in places) still apply.
 *
 * ```ts
 * toRacProps({ disabled: true, required: undefined, onValueChange: fn })
 * // -> { isDisabled: true, onChange: fn }
 * ```
 * Only one of `onValueChange` / `onCheckedChange` / `onSelectedChange` may be set;
 * they all land on RAC's `onChange`.
 */
export function toRacProps<P extends object>(props: P): RacProps<P> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;
    const racKey = (RAC_RENAMES as Record<string, string>)[key] ?? key;
    out[racKey] = value;
  }
  return out as RacProps<P>;
}

// --- values ----------------------------------------------------------------

/** RAC `Key` is `string | number`; VarUI values are always strings. */
export function keyToValue(key: Key): string {
  return String(key);
}

/** RAC emits `null` for "nothing selected" on single selects. */
export function keyToValueOrNull(key: Key | null | undefined): string | null {
  return key == null ? null : String(key);
}

type SingleValueInput = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: ((value: string | null) => void) | undefined;
};

/**
 * Single-value collection (`Select`, `RadioGroup`, ...) in RAC's `value` /
 * `defaultValue` / `onChange` shape. Keys are the option `value`s.
 * `undefined` stays `undefined` (uncontrolled); `null` means "controlled, nothing selected".
 */
export function singleValueProps({ value, defaultValue, onValueChange }: SingleValueInput) {
  return toRacValueProps<Key | null>({
    value,
    defaultValue,
    onChange: onValueChange ? (key: Key | null) => onValueChange(keyToValueOrNull(key)) : undefined,
  });
}

type MultiValueInput = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: ((value: string[]) => void) | undefined;
};

/** Multi-value collection (`Select multiple`, `CheckboxGroup`, ...): `string[]` <-> RAC `Key[]`. */
export function multiValueProps({ value, defaultValue, onValueChange }: MultiValueInput) {
  return toRacValueProps<Key[]>({
    value,
    defaultValue,
    onChange: onValueChange ? (keys: Key[]) => onValueChange(keys.map(keyToValue)) : undefined,
  });
}

function toRacValueProps<T>(props: {
  value?: unknown;
  defaultValue?: unknown;
  onChange?: (value: never) => void;
}) {
  const out: { value?: T; defaultValue?: T; onChange?: (value: T) => void } = {};
  if (props.value !== undefined) out.value = props.value as T;
  if (props.defaultValue !== undefined) out.defaultValue = props.defaultValue as T;
  if (props.onChange) out.onChange = props.onChange as (value: T) => void;
  return out;
}

/**
 * Single selection for RAC collections that use `selectedKey` (Tabs, ComboBox,
 * Tree/ListBox in single mode, Pagination-like lists).
 */
export function selectedKeyProps({ value, defaultValue, onValueChange }: SingleValueInput) {
  const out: {
    selectedKey?: Key | null;
    defaultSelectedKey?: Key | null;
    onSelectionChange?: (key: Key | null) => void;
  } = {};
  if (value !== undefined) out.selectedKey = value;
  if (defaultValue !== undefined) out.defaultSelectedKey = defaultValue;
  if (onValueChange) out.onSelectionChange = (key) => onValueChange(keyToValueOrNull(key));
  return out;
}

/** RAC's `Selection` is `'all' | Set<Key>`. */
export type RacSelection = 'all' | Set<Key>;

/** Values of a RAC selection. `'all'` expands to `allValues` (pass the collection's values). */
export function selectionToValues(selection: RacSelection, allValues: readonly string[] = []) {
  return selection === 'all' ? [...allValues] : [...selection].map(keyToValue);
}

export function valuesToSelection(values: readonly string[]): Set<Key> {
  return new Set<Key>(values);
}

/**
 * Multiple selection for RAC collections that use `selectedKeys` /
 * `defaultSelectedKeys` / `onSelectionChange(Selection)` (ListBox, GridList,
 * Tree, TagGroup, ToggleButtonGroup). `allValues` resolves RAC's `'all'`.
 */
export function selectionProps(
  { value, defaultValue, onValueChange }: MultiValueInput,
  allValues: readonly string[] = [],
) {
  const out: {
    selectedKeys?: Set<Key>;
    defaultSelectedKeys?: Set<Key>;
    onSelectionChange?: (selection: RacSelection) => void;
  } = {};
  if (value !== undefined) out.selectedKeys = valuesToSelection(value);
  if (defaultValue !== undefined) out.defaultSelectedKeys = valuesToSelection(defaultValue);
  if (onValueChange) {
    out.onSelectionChange = (selection) => onValueChange(selectionToValues(selection, allValues));
  }
  return out;
}

// --- options ---------------------------------------------------------------

/** The option shape used by every VarUI collection. Matches `<option value>`. */
export type Option = {
  /** Unique value; becomes the RAC item `id`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Prevents selecting this option. */
  disabled?: boolean;
};

/** Plain-text form of a label for typeahead / accessible names; `undefined` for non-text labels. */
export function optionTextValue(option: Pick<Option, 'label' | 'value'>): string {
  const { label, value } = option;
  return typeof label === 'string' || typeof label === 'number' ? String(label) : value;
}

/**
 * RAC item props for an option (`ListBoxItem`, `TabItem`, `Radio`, ...).
 * Spread onto the RAC item; `key` must be set by the caller (`key={option.value}`).
 */
export function racItemProps(option: Option) {
  const props: { id: string; textValue: string; isDisabled?: true } = {
    id: option.value,
    textValue: optionTextValue(option),
  };
  if (option.disabled) props.isDisabled = true;
  return props;
}

/** `disabledKeys` for a RAC collection root. `undefined` when nothing is disabled. */
export function disabledKeysOf(options: readonly Option[]): Set<Key> | undefined {
  const keys = options.filter((o) => o.disabled).map((o) => o.value);
  return keys.length ? new Set(keys) : undefined;
}

/** Reverse of {@link racItemProps} for data coming from RAC (`{ id, isDisabled }` -> `{ value, disabled }`). */
export function optionFromRacItem(item: {
  id: Key;
  label: ReactNode;
  isDisabled?: boolean;
}): Option {
  const option: Option = { value: String(item.id), label: item.label };
  if (item.isDisabled) option.disabled = true;
  return option;
}

// --- press / click -----------------------------------------------------------
//
// `onClick` needs NO adapter on RAC `Button`, `Link`, `ToggleButton` and `MenuItem`: react-aria
// forwards a native React `onClick` to the DOM element once per mouse, touch or keyboard
// activation and does not call it while disabled (verified in `racProps.test.tsx`). Leave it in
// `...rest`; never map it to `onPress`. Public press events other than `onClick` are not exposed.
