import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { Splitter } from './Splitter';

afterEach(() => window.localStorage.clear());

const separators = () => screen.getAllByRole('separator');
const panelEls = (c: HTMLElement) => [...c.querySelectorAll<HTMLElement>('[data-splitter-panel]')];

describe('Splitter', () => {
  it('renders a separator between each pair of panels with APG attributes', () => {
    const { container } = render(
      <Splitter defaultSizes={[30, 70]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    const [sep] = separators();
    const [a] = panelEls(container);
    expect(separators()).toHaveLength(1);
    expect(sep!.getAttribute('aria-orientation')).toBe('vertical');
    expect(sep!.getAttribute('aria-valuenow')).toBe('30');
    expect(sep!.getAttribute('aria-valuemin')).toBe('0');
    expect(sep!.getAttribute('aria-valuemax')).toBe('100');
    expect(sep!.getAttribute('aria-controls')).toBe(a!.id);
    expect(sep!.getAttribute('aria-label')).toBe('Resize panels');
  });

  it('uses a horizontal separator for a vertical splitter and three panels give two', () => {
    render(
      <Splitter orientation="vertical">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
        <Splitter.Panel>C</Splitter.Panel>
      </Splitter>,
    );
    expect(separators()).toHaveLength(2);
    expect(separators()[0]!.getAttribute('aria-orientation')).toBe('horizontal');
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('33.33');
  });

  it('merges className, forwards rest and ref, keeps onChange native', () => {
    const ref = createRef<HTMLDivElement>();
    const onChange = vi.fn();
    const { container } = render(
      <Splitter ref={ref} className="mine" data-testid="root" onChange={onChange}>
        <Splitter.Panel className="pane">
          <input aria-label="field" />
        </Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current!.className).toContain('mine');
    expect(panelEls(container)[0]!.className).toContain('pane');
    fireEvent.change(screen.getByLabelText('field'), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0].nativeEvent).toBeInstanceOf(Event);
  });

  it('writes the size as a custom property on each panel', () => {
    const { container } = render(
      <Splitter defaultSizes={[25, 75]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(panelEls(container)[0]!.getAttribute('style')).toContain('25');
    expect(panelEls(container)[1]!.getAttribute('style')).toContain('75');
  });

  it('resizes uncontrolled with the arrow keys and reports onSizesChange', () => {
    const onSizesChange = vi.fn();
    render(
      <Splitter defaultSizes={[50, 50]} onSizesChange={onSizesChange}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    fireEvent.keyDown(separators()[0]!, { key: 'ArrowRight' });
    expect(onSizesChange).toHaveBeenLastCalledWith([55, 45]);
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('55');
    fireEvent.keyDown(separators()[0]!, { key: 'ArrowLeft', shiftKey: true });
    expect(onSizesChange).toHaveBeenLastCalledWith([35, 65]);
  });

  it('is controlled by sizes', () => {
    const onSizesChange = vi.fn();
    const { rerender } = render(
      <Splitter sizes={[40, 60]} onSizesChange={onSizesChange}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    fireEvent.keyDown(separators()[0]!, { key: 'ArrowRight' });
    expect(onSizesChange).toHaveBeenLastCalledWith([45, 55]);
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('40');
    rerender(
      <Splitter sizes={[45, 55]} onSizesChange={onSizesChange}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('45');
  });

  it('clamps to minSizes / maxSizes and Home/End jump to the limits', () => {
    render(
      <Splitter defaultSizes={[50, 50]} minSizes={[20, 30]} maxSizes={[80, 100]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    const sep = separators()[0]!;
    expect(sep.getAttribute('aria-valuemin')).toBe('20');
    expect(sep.getAttribute('aria-valuemax')).toBe('70');
    fireEvent.keyDown(sep, { key: 'End' });
    expect(sep.getAttribute('aria-valuenow')).toBe('70');
    fireEvent.keyDown(sep, { key: 'Home' });
    expect(sep.getAttribute('aria-valuenow')).toBe('20');
  });

  it('Panel minSize overrides minSizes', () => {
    render(
      <Splitter defaultSizes={[50, 50]} minSizes={[10, 10]}>
        <Splitter.Panel minSize={40}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(separators()[0]!.getAttribute('aria-valuemin')).toBe('40');
  });

  it('Enter collapses a collapsible panel and restores it', () => {
    const { container } = render(
      <Splitter defaultSizes={[30, 70]} collapsible={[true, false]} minSizes={[15, 0]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    const sep = separators()[0]!;
    fireEvent.keyDown(sep, { key: 'Enter' });
    expect(sep.getAttribute('aria-valuenow')).toBe('0');
    expect(panelEls(container)[0]!.hasAttribute('data-collapsed')).toBe(true);
    fireEvent.keyDown(sep, { key: 'Enter' });
    expect(sep.getAttribute('aria-valuenow')).toBe('30');
    expect(panelEls(container)[0]!.hasAttribute('data-collapsed')).toBe(false);
  });

  it('Enter does nothing without a collapsible panel', () => {
    render(
      <Splitter defaultSizes={[30, 70]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    fireEvent.keyDown(separators()[0]!, { key: 'Enter' });
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('30');
  });

  it('double-click resets the divider to the default sizes', () => {
    render(
      <Splitter defaultSizes={[30, 70]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    const sep = separators()[0]!;
    fireEvent.keyDown(sep, { key: 'End' });
    expect(sep.getAttribute('aria-valuenow')).toBe('100');
    fireEvent.doubleClick(sep);
    expect(sep.getAttribute('aria-valuenow')).toBe('30');
  });

  it('Splitter.Handle customises the divider', () => {
    render(
      <Splitter>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Handle aria-label="Resize sidebar" className="grip" />
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    const sep = screen.getByRole('separator', { name: 'Resize sidebar' });
    expect(sep.className).toContain('grip');
    expect(sep.className).toContain('var-ui-splitter__handle');
  });

  it('handleLabel renames the dividers', () => {
    render(
      <Splitter handleLabel="Redimensionar">
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(screen.getByRole('separator', { name: 'Redimensionar' })).toBeTruthy();
  });

  it('persists with autoSaveId and applies stored sizes after mount', () => {
    const tree = (
      <Splitter autoSaveId="t" defaultSizes={[50, 50]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    );
    const first = render(tree);
    fireEvent.keyDown(separators()[0]!, { key: 'ArrowRight' });
    expect(JSON.parse(window.localStorage.getItem('var-ui-resizable:t')!)).toEqual([55, 45]);
    first.unmount();
    render(tree);
    act(() => {});
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('55');
  });

  it('ignores corrupt stored sizes', () => {
    window.localStorage.setItem('var-ui-resizable:bad', '{nope');
    render(
      <Splitter autoSaveId="bad" defaultSizes={[40, 60]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('40');
  });

  it('falls back to an equal split when defaultSizes does not match the panels', () => {
    render(
      <Splitter defaultSizes={[10, 20, 70]}>
        <Splitter.Panel>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>,
    );
    expect(separators()[0]!.getAttribute('aria-valuenow')).toBe('50');
  });
});
