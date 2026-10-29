import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { layerStack } from '@var-ui/core';
import { LayerProvider, useLayer } from './LayerProvider';

function Probe({ testId }: { testId: string }) {
  const { zIndex } = useLayer();
  return <div data-testid={testId} data-z={zIndex} />;
}

describe('LayerProvider', () => {
  it('allocates nothing without a provider', () => {
    const { getByTestId } = render(<Probe testId="a" />);
    expect(getByTestId('a').dataset.z).toBeUndefined();
  });

  it('stacks sibling layers in mount order', () => {
    const { getByTestId } = render(
      <LayerProvider baseZIndex={200}>
        <Probe testId="first" />
        <Probe testId="second" />
      </LayerProvider>,
    );
    const first = Number(getByTestId('first').dataset.z);
    const second = Number(getByTestId('second').dataset.z);
    expect(first).toBeGreaterThanOrEqual(200);
    expect(second).toBeGreaterThan(first);
  });

  it('applies no inline z-index without a provider and a layer variable with one', () => {
    function Styled({ testId }: { testId: string }) {
      const { style } = useLayer();
      return <div data-testid={testId} style={style} />;
    }
    const { getByTestId, unmount } = render(<Styled testId="none" />);
    expect(getByTestId('none').getAttribute('style') ?? '').toBe('');
    expect(getByTestId('none').style.zIndex).toBe('');
    unmount();

    const view = render(
      <LayerProvider baseZIndex={300}>
        <Styled testId="a" />
        <Styled testId="b" />
      </LayerProvider>,
    );
    const read = (id: string) =>
      Number(view.getByTestId(id).style.getPropertyValue(layerStack.vars.zIndex.name));
    expect(view.getByTestId('a').style.zIndex).toBe('');
    expect(read('a')).toBeGreaterThanOrEqual(300);
    expect(read('b')).toBeGreaterThan(read('a'));
  });
});
