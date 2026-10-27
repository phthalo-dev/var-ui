import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '../DirectionProvider';
import { layoutContentWidthAssignment, layoutShellPaddingAssignments } from '@var-ui/core';
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutPanel,
  useLayoutSlots,
} from './Layout';
import type { UseResizableResult } from '../hooks';

/** Stubs `window.matchMedia` so `useMediaQuery` reports a fixed `matches` value for every query. */
function mockMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

function fakeResizable(width: number): UseResizableResult {
  return {
    width,
    isCollapsed: false,
    setCollapsed: () => {},
    collapse: () => {},
    expand: () => {},
    resize: () => {},
    handleProps: {
      direction: 'horizontal',
      value: width,
      minValue: 0,
      maxValue: 999,
      onChange: () => {},
      isCollapsed: false,
    },
  };
}

describe('Layout', () => {
  it('renders header, content, and end panel landmarks', () => {
    render(
      <Layout
        header={<LayoutHeader>Header content</LayoutHeader>}
        content={<LayoutContent label="Main">Main content</LayoutContent>}
        end={<LayoutPanel label="Inspector">Panel content</LayoutPanel>}
        footer={<LayoutFooter>Footer content</LayoutFooter>}
      />,
    );

    expect(screen.getByText('Header content')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Main' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Inspector' })).toBeTruthy();
    expect(screen.getByText('Footer content')).toBeTruthy();
  });

  it('sets data-has-* attributes on the root only for provided slots', () => {
    const { container } = render(
      <Layout header={<LayoutHeader>Header</LayoutHeader>} content={<div>Content</div>} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.hasAttribute('data-has-header')).toBe(true);
    expect(root.hasAttribute('data-has-footer')).toBe(false);
    expect(root.hasAttribute('data-has-start')).toBe(false);
    expect(root.hasAttribute('data-has-end')).toBe(false);
  });

  it('prefers content over children when both are provided', () => {
    render(
      <Layout content={<div>From content</div>}>
        <div>From children</div>
      </Layout>,
    );
    expect(screen.getByText('From content')).toBeTruthy();
    expect(screen.queryByText('From children')).toBeNull();
  });

  it('falls back to children when content is omitted', () => {
    render(<Layout>{<div>From children</div>}</Layout>);
    expect(screen.getByText('From children')).toBeTruthy();
  });

  it('binds a resizable result width to LayoutPanel as an inline style', () => {
    const resizable = fakeResizable(380);
    render(
      <Layout
        content={<div>Main</div>}
        end={<LayoutPanel resizable={resizable}>Panel</LayoutPanel>}
      />,
    );
    const panel = screen.getByText('Panel').closest('[data-side="end"]') as HTMLElement;
    expect(panel.style.width).toBe('380px');
  });

  it('prefers the resizable width over an explicit width prop', () => {
    const resizable = fakeResizable(420);
    render(
      <Layout content={<div>Main</div>} end={<LayoutPanel width={200} resizable={resizable} />} />,
    );
    const panel = document.querySelector('[data-side="end"]') as HTMLElement;
    expect(panel.style.width).toBe('420px');
  });

  it('unmounts LayoutPanel when resizable.isCollapsed is true', () => {
    const resizable = { ...fakeResizable(320), isCollapsed: true };
    render(
      <Layout
        content={<div>Main</div>}
        end={<LayoutPanel resizable={resizable}>Panel</LayoutPanel>}
      />,
    );
    expect(screen.queryByText('Panel')).toBeNull();
  });

  it('exposes slot presence via useLayoutSlots', () => {
    function Probe() {
      const slots = useLayoutSlots();
      return (
        <span>
          {slots.hasHeader ? 'h' : ''}
          {slots.hasStart ? 's' : ''}
          {slots.hasEnd ? 'e' : ''}
        </span>
      );
    }
    render(
      <Layout
        header={<LayoutHeader>Header</LayoutHeader>}
        start={<LayoutPanel>Start</LayoutPanel>}
        end={<LayoutPanel>End</LayoutPanel>}
        content={
          <LayoutContent>
            <Probe />
          </LayoutContent>
        }
      />,
    );
    expect(screen.getByText('hse')).toBeTruthy();
  });

  it('sets data-side="start" or "end" on LayoutPanel based on its slot', () => {
    render(
      <Layout
        content={<div>Main</div>}
        start={<LayoutPanel>Start panel</LayoutPanel>}
        end={<LayoutPanel>End panel</LayoutPanel>}
      />,
    );
    expect(screen.getByText('Start panel').closest('[data-side]')?.getAttribute('data-side')).toBe(
      'start',
    );
    expect(screen.getByText('End panel').closest('[data-side]')?.getAttribute('data-side')).toBe(
      'end',
    );
  });

  it('sets shell padding CSS vars when padding prop is provided', () => {
    const { container } = render(<Layout padding={2} content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    const expected = layoutShellPaddingAssignments(2);
    for (const [name, value] of Object.entries(expected)) {
      expect(root.style.getPropertyValue(name)).toBe(value);
    }
  });

  it('does not set shell padding inline when padding is omitted', () => {
    const { container } = render(<Layout content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    for (const name of Object.keys(layoutShellPaddingAssignments(2))) {
      expect(root.style.getPropertyValue(name)).toBe('');
    }
  });

  it('sets the content-width CSS variable when contentWidth is provided', () => {
    const { container } = render(<Layout contentWidth={720} content={<div>Main</div>} />);
    const root = container.firstElementChild as HTMLElement;
    const [widthVar] = Object.keys(layoutContentWidthAssignment(720));
    expect(root.style.getPropertyValue(widthVar!)).toBe('720px');
  });

  it('sets data-divider on LayoutHeader/LayoutFooter when hasDivider is explicit', () => {
    render(
      <Layout
        header={<LayoutHeader hasDivider>Header</LayoutHeader>}
        content={<div>Main</div>}
        footer={<LayoutFooter hasDivider={false}>Footer</LayoutFooter>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeTruthy();
    expect(screen.getByText('Footer').closest('[data-divider]')).toBeNull();
  });

  it('defaults LayoutHeader/LayoutFooter dividers from Layout.defaultHasDividers', () => {
    render(
      <Layout
        defaultHasDividers
        header={<LayoutHeader>Header</LayoutHeader>}
        content={<div>Main</div>}
        footer={<LayoutFooter>Footer</LayoutFooter>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeTruthy();
    expect(screen.getByText('Footer').closest('[data-divider]')).toBeTruthy();
  });

  it('lets an explicit hasDivider prop override Layout.defaultHasDividers', () => {
    render(
      <Layout
        defaultHasDividers
        header={<LayoutHeader hasDivider={false}>Header</LayoutHeader>}
        content={<div>Main</div>}
      />,
    );
    expect(screen.getByText('Header').closest('[data-divider]')).toBeNull();
  });
});

describe('LayoutContent', () => {
  it('renders its children and stays labeled after toggling isScrollable', () => {
    const { rerender } = render(<LayoutContent label="Main">Body</LayoutContent>);
    expect(screen.getByRole('region', { name: 'Main' }).textContent).toBe('Body');

    rerender(
      <LayoutContent label="Main" isScrollable={false}>
        Body
      </LayoutContent>,
    );
    expect(screen.getByRole('region', { name: 'Main' }).textContent).toBe('Body');
  });
});

describe('LayoutPanel', () => {
  it('renders children with an accessible label when provided', () => {
    render(<LayoutPanel label="Details">Panel body</LayoutPanel>);
    const panel = screen.getByRole('region', { name: 'Details' });
    expect(panel.textContent).toBe('Panel body');
  });

  describe('responsive', () => {
    it('hidden mode: panel not in DOM when closed below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} defaultOpen={false}>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.queryByText('Inspector')).toBeNull();
      vi.unstubAllGlobals();
    });

    it('hidden mode: panel visible when isOpen below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} isOpen>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.getByText('Inspector')).toBeTruthy();
      vi.unstubAllGlobals();
    });

    it('overlay mode: dialog landmark when isOpen below breakpoint', () => {
      mockMatchMedia(true);
      render(
        <LayoutPanel
          responsive={{ below: 'lg', mode: 'overlay' }}
          isOpen
          label="Details"
          role="complementary"
        >
          Inspector
        </LayoutPanel>,
      );
      expect(screen.getByRole('dialog', { name: 'Details' })).toBeTruthy();
      expect(screen.queryByRole('complementary')).toBeNull();
      expect(screen.getByText('Inspector')).toBeTruthy();
      vi.unstubAllGlobals();
    });

    it('above breakpoint: responsive is inert and the panel always renders inline', () => {
      mockMatchMedia(false);
      render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'hidden' }} defaultOpen={false}>
          Inspector
        </LayoutPanel>,
      );
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('Inspector')).toBeTruthy();

      const { unmount } = render(
        <LayoutPanel responsive={{ below: 'lg', mode: 'overlay' }} isOpen={false}>
          Overlay panel
        </LayoutPanel>,
      );
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByText('Overlay panel')).toBeTruthy();
      unmount();
      vi.unstubAllGlobals();
    });
  });

  describe('hasResizeHandle', () => {
    it('renders no handle unless hasResizeHandle is set', () => {
      render(
        <Layout
          content={<div>Main</div>}
          end={<LayoutPanel resizable={fakeResizable(300)}>Panel</LayoutPanel>}
        />,
      );
      expect(screen.queryByRole('separator')).toBeNull();
    });

    it('places the handle after a start panel and before an end panel', () => {
      render(
        <Layout
          start={
            <LayoutPanel
              label="List"
              resizable={fakeResizable(300)}
              hasResizeHandle
              resizeHandleLabel="Resize list"
            />
          }
          end={
            <LayoutPanel
              label="Inspector"
              resizable={fakeResizable(280)}
              hasResizeHandle
              resizeHandleLabel="Resize inspector"
            />
          }
        >
          <div>Main</div>
        </Layout>,
      );
      const list = screen.getByRole('region', { name: 'List' });
      const listHandle = screen.getByRole('separator', { name: 'Resize list' });
      const inspector = screen.getByRole('region', { name: 'Inspector' });
      const inspectorHandle = screen.getByRole('separator', { name: 'Resize inspector' });
      expect(list.nextElementSibling).toBe(listHandle);
      expect(inspector.previousElementSibling).toBe(inspectorHandle);
    });

    it('resizes with the pointer direction under RTL', async () => {
      const onChange = vi.fn();
      const resizable = fakeResizable(300);
      resizable.handleProps.onChange = onChange;
      render(
        <DirectionProvider direction="rtl">
          <Layout
            start={<LayoutPanel resizable={resizable} hasResizeHandle resizeHandleLabel="Resize" />}
          >
            <div>Main</div>
          </Layout>
        </DirectionProvider>,
      );
      screen.getByRole('separator', { name: 'Resize' }).focus();
      // A start panel sits on the right in RTL, so moving the handle right shrinks it.
      await userEvent.keyboard('{ArrowRight}');
      expect(onChange).toHaveBeenLastCalledWith(290);
    });

    it('renders no handle below a responsive breakpoint', () => {
      mockMatchMedia(true);
      render(
        <Layout
          content={<div>Main</div>}
          end={
            <LayoutPanel
              hasDivider
              hasResizeHandle
              responsive={{ below: 'lg', mode: 'hidden' }}
              isOpen
              resizable={fakeResizable(300)}
            >
              Panel
            </LayoutPanel>
          }
        />,
      );
      expect(screen.getByText('Panel')).toBeTruthy();
      expect(screen.queryByRole('separator')).toBeNull();
      vi.unstubAllGlobals();
    });

    it('renders no handle when the panel is collapsed', () => {
      render(
        <Layout
          content={<div>Main</div>}
          end={
            <LayoutPanel hasResizeHandle resizable={{ ...fakeResizable(300), isCollapsed: true }}>
              Panel
            </LayoutPanel>
          }
        />,
      );
      expect(screen.queryByRole('separator')).toBeNull();
    });
  });
});
