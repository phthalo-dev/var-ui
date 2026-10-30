import { describe, expect, it } from 'vite-plus/test';
import { splitDataAttributes, toRacDateProps } from './dateFieldProps';

describe('toRacDateProps', () => {
  it('maps min/max to minValue/maxValue and the VarUI flags to RAC names', () => {
    const unavailable = () => false;
    expect(
      toRacDateProps({ min: 1, max: 2, disabled: true, unavailable, readOnly: undefined }),
    ).toEqual({
      minValue: 1,
      maxValue: 2,
      isDisabled: true,
      isDateUnavailable: unavailable,
    });
  });

  it('splitDataAttributes keeps data-* aside', () => {
    const [root, data] = splitDataAttributes({ invalid: true, 'data-x': '1' });
    expect(root).toEqual({ isInvalid: true });
    expect(data).toEqual({ 'data-x': '1' });
  });
});
