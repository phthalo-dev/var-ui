import { describe, expect, it, vi } from 'vite-plus/test';
import {
  disabledKeysOf,
  keyToValue,
  keyToValueOrNull,
  multiValueProps,
  optionFromRacItem,
  optionTextValue,
  racItemProps,
  selectedKeyProps,
  selectionProps,
  selectionToValues,
  singleValueProps,
  toRacProps,
  valuesToSelection,
} from './racProps';
import { splitRacFieldProps } from './racFieldProps';

describe('toRacProps', () => {
  it('renames booleans to RAC names', () => {
    expect(
      toRacProps({
        disabled: true,
        required: true,
        readOnly: true,
        invalid: true,
        open: true,
        expanded: false,
        selected: true,
        dismissable: false,
        pending: true,
        rowHeader: true,
        wheelDisabled: true,
      }),
    ).toEqual({
      isDisabled: true,
      isRequired: true,
      isReadOnly: true,
      isInvalid: true,
      isOpen: true,
      isExpanded: false,
      isSelected: true,
      isDismissable: false,
      isPending: true,
      isRowHeader: true,
      isWheelDisabled: true,
    });
  });

  it('maps the date predicate `unavailable` to isDateUnavailable', () => {
    const unavailable = () => true;
    expect(toRacProps({ unavailable })).toEqual({ isDateUnavailable: unavailable });
  });

  it('maps checked / defaultChecked / indeterminate', () => {
    expect(toRacProps({ checked: true, defaultChecked: false, indeterminate: true })).toEqual({
      isSelected: true,
      defaultSelected: false,
      isIndeterminate: true,
    });
  });

  it('maps change callbacks to onChange', () => {
    const fn = vi.fn();
    expect(toRacProps({ onValueChange: fn }).onChange).toBe(fn);
    expect(toRacProps({ onCheckedChange: fn }).onChange).toBe(fn);
    expect(toRacProps({ onSelectedChange: fn }).onChange).toBe(fn);
  });

  it('drops undefined values so RAC defaults and uncontrolled mode apply', () => {
    const out = toRacProps({ disabled: undefined, checked: undefined, label: undefined });
    expect(out).toEqual({});
    expect('isDisabled' in out).toBe(false);
    expect('isSelected' in out).toBe(false);
  });

  it('keeps `false` and passes through names RAC shares', () => {
    expect(toRacProps({ disabled: false, defaultOpen: true, name: 'x' })).toEqual({
      isDisabled: false,
      defaultOpen: true,
      name: 'x',
    });
  });
});

describe('values', () => {
  it('keyToValue stringifies RAC keys', () => {
    expect(keyToValue('a')).toBe('a');
    expect(keyToValue(3)).toBe('3');
    expect(keyToValueOrNull(null)).toBeNull();
    expect(keyToValueOrNull(undefined)).toBeNull();
    expect(keyToValueOrNull(7)).toBe('7');
  });

  it('singleValueProps leaves undefined undefined and keeps null', () => {
    expect(singleValueProps({})).toEqual({});
    expect(singleValueProps({ value: null })).toEqual({ value: null });
    expect(singleValueProps({ value: 'a', defaultValue: 'b' })).toEqual({
      value: 'a',
      defaultValue: 'b',
    });
  });

  it('singleValueProps converts the change callback', () => {
    const onValueChange = vi.fn();
    singleValueProps({ onValueChange }).onChange?.(5);
    singleValueProps({ onValueChange }).onChange?.(null);
    expect(onValueChange.mock.calls).toEqual([['5'], [null]]);
  });

  it('multiValueProps maps string[] <-> Key[]', () => {
    const onValueChange = vi.fn();
    const props = multiValueProps({ value: ['a'], defaultValue: ['b'], onValueChange });
    expect(props.value).toEqual(['a']);
    expect(props.defaultValue).toEqual(['b']);
    props.onChange?.(['a', 2]);
    expect(onValueChange).toHaveBeenCalledWith(['a', '2']);
    expect(multiValueProps({})).toEqual({});
  });

  it('selectedKeyProps targets selectedKey / onSelectionChange', () => {
    const onValueChange = vi.fn();
    const props = selectedKeyProps({ value: 'a', defaultValue: 'b', onValueChange });
    expect(props.selectedKey).toBe('a');
    expect(props.defaultSelectedKey).toBe('b');
    props.onSelectionChange?.('c');
    expect(onValueChange).toHaveBeenCalledWith('c');
    expect(selectedKeyProps({})).toEqual({});
  });

  it('selectionProps maps arrays <-> Sets and resolves "all"', () => {
    const onValueChange = vi.fn();
    const props = selectionProps({ value: ['a'], onValueChange }, ['a', 'b', 'c']);
    expect(props.selectedKeys).toEqual(new Set(['a']));
    props.onSelectionChange?.(new Set(['a', 'b']));
    props.onSelectionChange?.('all');
    expect(onValueChange.mock.calls).toEqual([[['a', 'b']], [['a', 'b', 'c']]]);
    expect(selectionToValues(new Set([1]))).toEqual(['1']);
    expect(valuesToSelection(['x'])).toEqual(new Set(['x']));
  });
});

describe('options', () => {
  it('racItemProps maps value/label/disabled to id/textValue/isDisabled', () => {
    expect(racItemProps({ value: 'a', label: 'Apple' })).toEqual({ id: 'a', textValue: 'Apple' });
    expect(racItemProps({ value: 'a', label: 'Apple', disabled: true })).toEqual({
      id: 'a',
      textValue: 'Apple',
      isDisabled: true,
    });
  });

  it('falls back to value for non-text labels', () => {
    expect(optionTextValue({ value: 'a', label: { type: 'span' } as never })).toBe('a');
  });

  it('disabledKeysOf collects disabled options', () => {
    expect(disabledKeysOf([{ value: 'a', label: 'A' }])).toBeUndefined();
    expect(
      disabledKeysOf([
        { value: 'a', label: 'A', disabled: true },
        { value: 'b', label: 'B' },
      ]),
    ).toEqual(new Set(['a']));
  });

  it('optionFromRacItem is the reverse mapping', () => {
    expect(optionFromRacItem({ id: 4, label: 'Four' })).toEqual({ value: '4', label: 'Four' });
    expect(optionFromRacItem({ id: 'a', label: 'A', isDisabled: true })).toEqual({
      value: 'a',
      label: 'A',
      disabled: true,
    });
  });
});

describe('splitRacFieldProps', () => {
  it('returns RAC-named root props and a native remainder', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    const [root, native] = splitRacFieldProps({
      value: 'x',
      onValueChange,
      disabled: true,
      invalid: undefined,
      required: true,
      readOnly: false,
      'aria-label': 'Name',
      name: 'n',
      autoComplete: 'name',
      onChange,
    });
    expect(root).toEqual({
      value: 'x',
      onChange: onValueChange,
      isDisabled: true,
      isRequired: true,
      isReadOnly: false,
      'aria-label': 'Name',
    });
    expect(native).toEqual({ name: 'n', autoComplete: 'name', onChange });
  });

  it('accepts extra root keys', () => {
    const [root, native] = splitRacFieldProps({ min: 1, step: 2, title: 't' }, ['min', 'step']);
    expect(root).toEqual({ min: 1, step: 2 });
    expect(native).toEqual({ title: 't' });
  });
});
