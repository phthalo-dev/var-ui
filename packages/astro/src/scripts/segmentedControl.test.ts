import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
  getSegmentedControlValue,
  initSegmentedControl,
  initSegmentedControls,
  segmentedControlName,
  SEGMENTED_CONTROL_CHANGE_EVENT,
  setSegmentedControlValue,
} from './segmentedControl';

class ResizeObserverMock {
  observe() {}
  disconnect() {}
}

/** Mirrors `SegmentedControl.astro`: a radiogroup of labels wrapping native radios. */
const testRender = {};

function mountSegments(name = segmentedControlName(testRender, '/test/')): HTMLElement {
  const host = document.createElement('div');
  host.innerHTML = `
    <div role="radiogroup" aria-label="View" data-var-ui-segmented-control>
      <label data-var-ui-segment-id="list" data-selected><input type="radio" name="${name}" value="list" checked>List</label>
      <label data-var-ui-segment-id="grid"><input type="radio" name="${name}" value="grid">Grid</label>
      <label data-var-ui-segment-id="table"><input type="radio" name="${name}" value="table">Table</label>
    </div>
  `;
  document.body.appendChild(host);
  return host.querySelector('[data-var-ui-segmented-control]') as HTMLElement;
}

function segment(root: HTMLElement, id: string): HTMLLabelElement {
  return root.querySelector(`[data-var-ui-segment-id="${id}"]`) as HTMLLabelElement;
}

function radio(root: HTMLElement, id: string): HTMLInputElement {
  return segment(root, id).querySelector('input') as HTMLInputElement;
}

describe('initSegmentedControl', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  it('checks the clicked segment and moves data-selected to it', () => {
    const root = mountSegments();
    initSegmentedControl(root);

    segment(root, 'grid').click();

    expect(radio(root, 'grid').checked).toBe(true);
    expect(segment(root, 'grid').hasAttribute('data-selected')).toBe(true);
    expect(radio(root, 'list').checked).toBe(false);
    expect(segment(root, 'list').hasAttribute('data-selected')).toBe(false);
    expect(getSegmentedControlValue(root)).toBe('grid');
  });

  it('dispatches a change event with the selected id', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const onChange = vi.fn();
    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, onChange);

    segment(root, 'table').click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect((onChange.mock.calls[0][0] as CustomEvent).detail).toEqual({ id: 'table' });
  });

  it('is one radio group: only the checked radio is in the tab order', () => {
    const root = mountSegments();
    initSegmentedControl(root);

    expect(root.getAttribute('role')).toBe('radiogroup');
    const radios = Array.from(root.querySelectorAll('input'));
    expect(new Set(radios.map((input) => input.name)).size).toBe(1);
    expect(radios.filter((input) => input.checked)).toHaveLength(1);
  });

  it('setSegmentedControlValue reflects external state without dispatching', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    const onChange = vi.fn();
    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, onChange);

    setSegmentedControlValue(root, 'table');

    expect(radio(root, 'table').checked).toBe(true);
    expect(segment(root, 'table').hasAttribute('data-selected')).toBe(true);
    expect(segment(root, 'list').hasAttribute('data-selected')).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not double-bind handlers', () => {
    const root = mountSegments();
    initSegmentedControl(root);
    initSegmentedControl(root);
    const onChange = vi.fn();
    root.addEventListener(SEGMENTED_CONTROL_CHANGE_EVENT, onChange);

    segment(root, 'grid').click();

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('generates distinct group names within a render, stable across renders', () => {
    const first = {};
    const second = {};
    const a = [segmentedControlName(first, '/docs/'), segmentedControlName(first, '/docs/')];
    const b = [segmentedControlName(second, '/docs/'), segmentedControlName(second, '/docs/')];
    expect(a[0]).not.toBe(a[1]);
    expect(b).toEqual(a);
    expect(segmentedControlName({}, '/other/')).not.toBe(a[0]);
  });

  it('initSegmentedControls initializes every root on the page', () => {
    mountSegments();
    mountSegments();
    initSegmentedControls();
    expect(document.querySelectorAll('[data-var-ui-segmented-control-initialized]')).toHaveLength(
      2,
    );
  });
});
