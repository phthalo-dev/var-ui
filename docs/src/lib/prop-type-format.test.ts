import { describe, expect, it } from 'vite-plus/test';
import { canonicalizePropType } from './prop-type-format';

describe('canonicalizePropType', () => {
  it('sorts union members with a locale-independent comparator', () => {
    expect(
      canonicalizePropType('"danger" | "neutral" | "accent" | "success" | "warning" | "info"'),
    ).toBe('"accent" | "danger" | "info" | "neutral" | "success" | "warning"');

    expect(canonicalizePropType('"sm" | "md" | "lg" | undefined')).toBe(
      '"lg" | "md" | "sm" | undefined',
    );

    expect(
      canonicalizePropType('"done" | "next" | "search" | "enter" | "go" | "previous" | "send"'),
    ).toBe('"done" | "enter" | "go" | "next" | "previous" | "search" | "send"');
  });

  it('is stable for unions that are already canonical', () => {
    expect(canonicalizePropType('string | undefined')).toBe('string | undefined');
    expect(canonicalizePropType('boolean')).toBe('boolean');
    expect(canonicalizePropType('readonly string[] | undefined')).toBe(
      'readonly string[] | undefined',
    );
    expect(canonicalizePropType('RefObject<HTMLElement | null> | undefined')).toBe(
      'RefObject<HTMLElement | null> | undefined',
    );
  });

  it('expands NonNullable, dropping its null and undefined members', () => {
    expect(
      canonicalizePropType('NonNullable<"outline" | "subtle" | "solid" | null | undefined>'),
    ).toBe('"outline" | "solid" | "subtle"');

    expect(
      canonicalizePropType(
        'NonNullable<"outline" | "subtle" | "solid" | null | undefined> | undefined',
      ),
    ).toBe('"outline" | "solid" | "subtle" | undefined');

    expect(
      canonicalizePropType(
        'NonNullable<"danger" | "neutral" | "accent" | "success" | "warning" | "info" | null | undefined> | undefined',
      ),
    ).toBe('"accent" | "danger" | "info" | "neutral" | "success" | "warning" | undefined');
  });

  it('reduces a NonNullable that only wraps nullish members to never', () => {
    expect(canonicalizePropType('NonNullable<null | undefined>')).toBe('never');
  });

  it('canonicalises nested unions inside generic arguments', () => {
    expect(canonicalizePropType('RefObject<"b" | "a" | null> | undefined')).toBe(
      'RefObject<"a" | "b" | null> | undefined',
    );

    expect(canonicalizePropType('Record<"z" | "a", string | number>')).toBe(
      'Record<"a" | "z", number | string>',
    );
  });

  it('canonicalises unions inside parenthesised types and arrow return types', () => {
    expect(canonicalizePropType('(A | B) | undefined')).toBe('(A | B) | undefined');
    expect(canonicalizePropType('(B | A) | undefined')).toBe('(A | B) | undefined');

    expect(
      canonicalizePropType(
        '((value: string[]) => true | ValidationError | null | undefined) | undefined',
      ),
    ).toBe('((value: string[]) => ValidationError | true | null | undefined) | undefined');
  });

  it('canonicalises unions inside function parameter lists', () => {
    expect(canonicalizePropType('((value: Avatar | Key) => void) | undefined')).toBe(
      '((value: Avatar | Key) => void) | undefined',
    );

    expect(canonicalizePropType('((value: Key | Avatar) => void) | undefined')).toBe(
      '((value: Avatar | Key) => void) | undefined',
    );
  });

  it('canonicalises unions inside object type members', () => {
    expect(canonicalizePropType('{ __html: string | TrustedHTML; } | undefined')).toBe(
      '{ __html: TrustedHTML | string; } | undefined',
    );

    expect(canonicalizePropType('{ a: "b" | "a"; b?: number | string }')).toBe(
      '{ a: "a" | "b"; b?: number | string; }',
    );
  });

  it('keeps property names out of the sort when they contain a union separator', () => {
    expect(canonicalizePropType('{ "a | b": "z" | "a" }')).toBe('{ "a | b": "a" | "z"; }');
  });

  it('dedupes repeated members', () => {
    expect(canonicalizePropType('"a" | "a" | "b"')).toBe('"a" | "b"');
    expect(canonicalizePropType('string | string | undefined')).toBe('string | undefined');
  });

  it('is idempotent', () => {
    const samples = [
      '"danger" | "neutral" | "accent" | undefined',
      'NonNullable<"outline" | "subtle" | "solid" | null | undefined> | undefined',
      'RefObject<"b" | "a" | null> | undefined',
      '((value: Avatar | Key) => void) | undefined',
      '{ __html: string | TrustedHTML; } | undefined',
      '((value: string[]) => true | ValidationError | null | undefined) | undefined',
      '"additions removals" | "additions text" | undefined',
    ];

    for (const sample of samples) {
      const once = canonicalizePropType(sample);
      expect(canonicalizePropType(once)).toBe(once);
    }
  });

  it('does not treat union separators inside string literals as separators', () => {
    expect(canonicalizePropType('"a | b" | "c"')).toBe('"a | b" | "c"');
    expect(canonicalizePropType('"additions removals" | "additions"')).toBe(
      '"additions" | "additions removals"',
    );
  });
});
