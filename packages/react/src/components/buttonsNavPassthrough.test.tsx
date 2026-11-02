import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { AppShell } from './AppShell';
import { ButtonGroup } from './ButtonGroup';
import { ColorModeToggle } from './ColorModeToggle';
import { CopyButton } from './CopyButton';
import { IconButton } from './IconButton';
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutPanel } from './Layout';
import { ResizeHandle } from './ResizeHandle';
import { ToggleButton } from './SegmentedControl';
import {
  SideNav,
  SideNavCollapseButton,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from './SideNav';
import { Toolbar } from './Toolbar';
import { TopNav, TopNavHeading, TopNavItem } from './TopNav';
import { TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from './TopNavMegaMenu';

function wrap(ui: ReactNode) {
  return render(
    <DesignSystemProvider defaultColorMode="light">
      <IconProvider icons={{}}>
        <>{ui}</>
      </IconProvider>
    </DesignSystemProvider>,
  );
}

function stubMatchMedia(matches = false) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === 'not all' ? false : matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

describe('IconButton', () => {
  it('passes attributes, merges className and points ref at the button', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <IconButton
        icon="close"
        aria-label="Close"
        data-testid="ib"
        title="Close it"
        className="custom"
        onClick={onClick}
        ref={ref}
      />,
    );
    const button = screen.getByTestId('ib');
    expect(ref.current).toBe(button);
    expect(button.getAttribute('title')).toBe('Close it');
    expect(button.className).toContain('var-ui-button');
    expect(button.className).toContain('custom');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('ButtonGroup', () => {
  it('passes attributes, merges className and points ref at the div', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ButtonGroup data-testid="bg" id="g" aria-label="Group" className="custom" ref={ref}>
        <button type="button">A</button>
      </ButtonGroup>,
    );
    const group = screen.getByTestId('bg');
    expect(ref.current).toBe(group);
    expect(group.id).toBe('g');
    expect(group.getAttribute('role')).toBe('group');
    expect(group.getAttribute('aria-label')).toBe('Group');
    expect(group.className).toContain('custom');
  });
});

describe('CopyButton', () => {
  it('passes attributes to the default button and still copies on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <CopyButton
        value="secret"
        data-testid="cb"
        id="copy"
        className="custom"
        onClick={onClick}
        ref={ref}
      />,
    );
    const button = screen.getByTestId('cb');
    expect(ref.current).toBe(button);
    expect(button.className).toContain('custom');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('secret');
    vi.unstubAllGlobals();
  });
});

describe('ToggleButton', () => {
  it('passes attributes (including ones RAC filters), merges className and points ref at the button', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(
      <ToggleButton data-testid="tb" title="Bold" className="custom" onClick={onClick} ref={ref}>
        B
      </ToggleButton>,
    );
    const button = screen.getByTestId('tb');
    expect(ref.current).toBe(button);
    expect(button.getAttribute('title')).toBe('Bold');
    expect(button.className).toContain('custom');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Toolbar', () => {
  it('passes attributes, merges className and points ref at the root', async () => {
    const ref = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    render(
      <Toolbar
        label="Actions"
        data-testid="tbar"
        id="bar"
        className="custom"
        onClick={onClick}
        ref={ref}
        startContent={<span>x</span>}
      />,
    );
    const root = screen.getByRole('toolbar', { name: 'Actions' });
    expect(ref.current).toBe(root);
    expect(root.getAttribute('data-testid')).toBe('tbar');
    expect(root.id).toBe('bar');
    expect(root.className).toContain('custom');
    await userEvent.click(root);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Layout', () => {
  it('passes attributes through root and zones, merging className, style and ref', async () => {
    stubMatchMedia();
    const rootRef = createRef<HTMLDivElement>();
    const headerRef = createRef<HTMLDivElement>();
    const contentRef = createRef<HTMLDivElement>();
    const onClick = vi.fn();
    wrap(
      <Layout
        data-testid="layout"
        className="custom"
        style={{ color: 'red' }}
        padding={2}
        onClick={onClick}
        ref={rootRef}
        header={
          <LayoutHeader
            data-testid="header"
            className="h"
            style={{ color: 'blue' }}
            ref={headerRef}
          />
        }
        start={
          <LayoutPanel data-testid="panel" className="p" width={120} style={{ color: 'green' }} />
        }
        footer={<LayoutFooter data-testid="footer" id="ft" />}
        defaultHasDividers
      >
        <LayoutContent data-testid="content" id="main" className="c" ref={contentRef}>
          body
        </LayoutContent>
      </Layout>,
    );
    const root = screen.getByTestId('layout');
    expect(rootRef.current).toBe(root);
    expect(root.className).toContain('custom');
    expect(root.style.color).toBe('red');
    expect(root.getAttribute('data-divider-header')).toBe('');
    await userEvent.click(root);
    expect(onClick).toHaveBeenCalled();

    expect(headerRef.current).toBe(screen.getByTestId('header'));
    expect(screen.getByTestId('header').className).toContain('h');
    expect(screen.getByTestId('header').style.color).toBe('blue');
    expect(contentRef.current).toBe(screen.getByTestId('content'));
    expect(screen.getByTestId('content').id).toBe('main');
    expect(screen.getByTestId('footer').id).toBe('ft');
    const panel = screen.getByTestId('panel');
    expect(panel.className).toContain('p');
    expect(panel.style.width).toBe('120px');
    expect(panel.style.color).toBe('green');
    vi.unstubAllGlobals();
  });
});

describe('AppShell', () => {
  it('passes attributes to the root, customises the skip link and points ref at it', () => {
    stubMatchMedia();
    const ref = createRef<HTMLElement>();
    wrap(
      <AppShell data-testid="shell" id="app" className="custom" skipLinkLabel="Jump" ref={ref}>
        body
      </AppShell>,
    );
    const root = screen.getByTestId('shell');
    expect(ref.current).toBe(root);
    expect(root.id).toBe('app');
    expect(root.className).toContain('custom');
    expect(screen.getByRole('link', { name: 'Jump' })).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('passes attributes to the main landmark when disabled', () => {
    stubMatchMedia();
    wrap(
      <AppShell disabled data-testid="shell">
        body
      </AppShell>,
    );
    expect(screen.getByTestId('shell').tagName).toBe('MAIN');
    vi.unstubAllGlobals();
  });
});

describe('SideNav', () => {
  it('passes attributes to the nav, points ref at it, and renders a bare leaf item', async () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLElement>();
    const onClick = vi.fn();
    wrap(
      <SideNav
        data-testid="nav"
        className="custom"
        style={{ color: 'red' }}
        ref={navRef}
        resizeHandleLabel="Drag"
        resizable
        header={<SideNavHeading heading="Acme" data-testid="heading" className="hd" />}
      >
        <SideNavSection title="Main" data-testid="section" className="sec">
          <SideNavItem
            label="Home"
            href="/"
            data-testid="item"
            title="Go home"
            className="it"
            onClick={onClick}
            ref={itemRef}
          />
        </SideNavSection>
      </SideNav>,
    );
    const nav = screen.getByTestId('nav');
    expect(navRef.current).toBe(nav);
    expect(nav.className).toContain('custom');
    expect(nav.style.color).toBe('red');
    expect(nav.hasAttribute('data-resizable')).toBe(true);
    expect(screen.getByRole('separator', { name: 'Drag' })).toBeTruthy();
    expect(screen.getByTestId('heading').className).toContain('hd');
    expect(screen.getByTestId('section').className).toContain('sec');

    const item = screen.getByTestId('item');
    expect(itemRef.current).toBe(item);
    expect(item.tagName).toBe('A');
    expect(item.getAttribute('title')).toBe('Go home');
    expect(item.className).toContain('it');
    // Leaf item: no wrapper divs between the section and the row.
    expect(item.parentElement).toBe(screen.getByTestId('section'));
    item.addEventListener('click', (event) => event.preventDefault());
    await userEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('wraps an item that has children and keeps the label overridable', () => {
    wrap(
      <SideNav>
        <SideNavItem
          label="Projects"
          href="/p"
          collapsible
          collapseLabel="Hide projects"
          submenuLabel="Projects list"
        >
          <SideNavItem label="Alpha" href="/a" />
        </SideNavItem>
      </SideNav>,
    );
    expect(screen.getByRole('button', { name: 'Hide projects' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Projects list' })).toBeTruthy();
  });

  it('passes attributes to the collapse button', async () => {
    const ref = createRef<HTMLButtonElement>();
    wrap(
      <SideNav collapsible={{ hasButton: false }}>
        <SideNavCollapseButton
          data-testid="collapse"
          collapseLabel="Shrink"
          className="x"
          ref={ref}
        />
      </SideNav>,
    );
    const button = screen.getByTestId('collapse');
    expect(ref.current).toBe(button);
    expect(button.getAttribute('aria-label')).toBe('Shrink');
    expect(button.className).toContain('x');
  });
});

describe('TopNav', () => {
  it('passes attributes through nav, heading and item', async () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLElement>();
    const headingRef = createRef<HTMLElement>();
    const onClick = vi.fn();
    wrap(
      <TopNav
        data-testid="nav"
        className="custom"
        ref={navRef}
        heading={
          <TopNavHeading heading="Acme" data-testid="brand" className="b" ref={headingRef} />
        }
      >
        <TopNavItem
          label="Docs"
          data-testid="item"
          title="Read the docs"
          className="it"
          onClick={onClick}
          ref={itemRef}
        />
      </TopNav>,
    );
    expect(navRef.current).toBe(screen.getByTestId('nav'));
    expect(screen.getByTestId('nav').className).toContain('custom');
    const brand = screen.getByTestId('brand');
    expect(headingRef.current).toBe(brand);
    expect(brand.className).toContain('var-ui-top-nav');
    expect(brand.className).toContain('b');
    expect(brand.getAttribute('style')).toBeNull();
    const item = screen.getByTestId('item');
    expect(itemRef.current).toBe(item);
    expect(item.getAttribute('title')).toBe('Read the docs');
    await userEvent.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes attributes through the mega menu trigger, item and featured card', async () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    wrap(
      <TopNavMegaMenu
        label="Solutions"
        data-testid="mm"
        title="Open solutions"
        className="custom"
        onClick={onClick}
        ref={ref}
        featured={<TopNavMegaMenuFeaturedCard data-testid="feat" title="New" />}
      >
        <TopNavMegaMenuItem title="One" data-testid="mmi" className="mi" />
      </TopNavMegaMenu>,
    );
    const trigger = screen.getByTestId('mm');
    expect(ref.current).toBe(trigger);
    expect(trigger.getAttribute('title')).toBe('Open solutions');
    expect(trigger.className).toContain('custom');
    await userEvent.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('mmi').className).toContain('mi');
    expect(screen.getByTestId('feat')).toBeTruthy();
  });
});

describe('ColorModeToggle', () => {
  it('passes attributes to the group and lets segment text be overridden', () => {
    const ref = createRef<HTMLDivElement>();
    wrap(
      <ColorModeToggle
        data-testid="cm"
        className="custom"
        labels={{ light: 'Clair', dark: 'Sombre' }}
        ref={ref}
      />,
    );
    const group = screen.getByTestId('cm');
    expect(ref.current).toBe(group);
    expect(group.className).toContain('custom');
    expect(screen.getByRole('radio', { name: 'Clair' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Sombre' })).toBeTruthy();
  });
});

describe('ResizeHandle', () => {
  it('passes attributes, merges className, composes handlers and points ref at the separator', async () => {
    const ref = createRef<HTMLDivElement>();
    const onKeyDown = vi.fn();
    const onValueChange = vi.fn();
    render(
      <ResizeHandle
        value={100}
        minValue={50}
        maxValue={300}
        onValueChange={onValueChange}
        aria-label="Resize"
        data-testid="rh"
        id="handle"
        className="custom"
        onKeyDown={onKeyDown}
        ref={ref}
      />,
    );
    const handle = screen.getByTestId('rh');
    expect(ref.current).toBe(handle);
    expect(handle.id).toBe('handle');
    expect(handle.className).toContain('custom');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(110);
  });
});
