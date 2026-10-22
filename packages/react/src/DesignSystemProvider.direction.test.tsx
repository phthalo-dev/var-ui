import { describe, expect, it } from 'vite-plus/test';
import { render, renderHook } from '@testing-library/react';
import { DesignSystemProvider } from './DesignSystemProvider';
import { useDirection } from './DirectionProvider';

describe('DesignSystemProvider direction', () => {
  it('provides useDirection from direction prop', () => {
    const { result } = renderHook(() => useDirection(), {
      wrapper: ({ children }) => (
        <DesignSystemProvider direction="rtl">{children}</DesignSystemProvider>
      ),
    });
    expect(result.current.isRtl).toBe(true);
  });

  it('puts dir and lang on the theme wrapper', () => {
    const { container } = render(
      <DesignSystemProvider direction="rtl" locale="he-IL">
        <span>app</span>
      </DesignSystemProvider>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute('dir')).toBe('rtl');
    expect(wrapper.getAttribute('lang')).toBe('he-IL');
    expect(wrapper.style.display).toBe('contents');
    expect(wrapper.querySelector('[dir]')).toBeNull();
  });

  it('sets html dir when applyToDocument is set', () => {
    render(
      <DesignSystemProvider direction="rtl" applyToDocument>
        <span>app</span>
      </DesignSystemProvider>,
    );
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeAttribute('data-color-mode');
    document.documentElement.className = '';
  });
});
