import { describe, expectTypeOf, it } from 'vite-plus/test';
import { codeBlock, type CodeBlockVariant } from '../src/components/codeBlock';

describe('codeBlock variant', () => {
  it('exposes the recipe variant union', () => {
    expectTypeOf<CodeBlockVariant>().toEqualTypeOf<'default' | 'inline' | 'diff' | 'terminal'>();
    codeBlock({ variant: 'terminal' });
    // @ts-expect-error unknown variant
    codeBlock({ variant: 'boxed' });
  });
});
