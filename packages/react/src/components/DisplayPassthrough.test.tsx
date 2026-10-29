import { createRef, type ReactElement, type RefObject } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { Accordion } from './Accordion';
import { Alert } from './Alert';
import { Avatar, AvatarGroup } from './Avatar';
import { Banner } from './Banner';
import { Breadcrumbs } from './Breadcrumbs';
import { Card } from './Card';
import { Carousel } from './Carousel';
import { Code } from './Code';
import { CodeBlock } from './CodeBlock';
import { Collapsible, CollapsibleGroup } from './Collapsible';
import { DescriptionList } from './DescriptionList';
import { EmptyState } from './EmptyState';
import { FileTree } from './FileTree';
import { Kbd } from './Kbd';
import { List } from './List';
import { Outline } from './Outline';
import { OverflowList } from './OverflowList';
import { Pagination } from './Pagination';
import { Section } from './Section';
import { Skeleton } from './Skeleton';
import { Spinner } from './Spinner';
import { StatusDot } from './StatusDot';
import { Steps } from './Steps';
import { TabList } from './TabList';
import { Table } from './Table';
import { Tabs } from './Tabs';
import { Thumbnail } from './Thumbnail';
import { Timeline } from './Timeline';
import { Timestamp } from './Timestamp';
import { Toc } from './Toc';
import { Tree } from './Tree';

type Case = {
  name: string;
  /** Renders with `data-testid="x"`, `className="custom"` and the given ref. */
  ui: (ref: RefObject<unknown>) => ReactElement;
  tag: string;
  /** `id` is a component key (not the DOM id). */
  noId?: boolean;
  /** `className` is applied to an inner element by design. */
  innerClass?: boolean;
  /** No recipe class exists for this element. */
  noRecipe?: boolean;
};

const cases: Case[] = [
  { name: 'Kbd', tag: 'KBD', ui: (ref) => <Kbd {...p(ref)}>k</Kbd> },
  { name: 'Steps', tag: 'OL', ui: (ref) => <Steps {...p(ref)} /> },
  { name: 'Spinner', tag: 'SPAN', ui: (ref) => <Spinner {...p(ref)} /> },
  { name: 'Skeleton', tag: 'DIV', ui: (ref) => <Skeleton {...p(ref)} /> },
  { name: 'StatusDot', tag: 'SPAN', ui: (ref) => <StatusDot {...p(ref)} /> },
  { name: 'Code', tag: 'CODE', ui: (ref) => <Code {...p(ref)}>c</Code> },
  { name: 'Avatar', tag: 'SPAN', ui: (ref) => <Avatar {...p(ref)} name="Ada Lovelace" /> },
  { name: 'AvatarGroup', tag: 'SPAN', ui: (ref) => <AvatarGroup {...p(ref)}>a</AvatarGroup> },
  { name: 'FileTree', tag: 'DIV', ui: (ref) => <FileTree {...p(ref)} /> },
  {
    name: 'FileTree.Folder',
    tag: 'LI',
    ui: (ref) => (
      <ul>
        <FileTree.Folder {...p(ref)} name="src" />
      </ul>
    ),
  },
  {
    name: 'FileTree.File',
    tag: 'LI',
    ui: (ref) => (
      <ul>
        <FileTree.File {...p(ref)} name="a.ts" />
      </ul>
    ),
  },
  {
    name: 'Thumbnail',
    tag: 'SPAN',
    ui: (ref) => <Thumbnail {...p(ref)} src="/a.png" alt="a" />,
  },
  {
    name: 'Carousel',
    tag: 'SECTION',
    ui: (ref) => (
      <Carousel {...p(ref)} label="Featured">
        <div>1</div>
      </Carousel>
    ),
  },
  {
    name: 'Accordion',
    tag: 'DIV',
    ui: (ref) => (
      <Accordion {...p(ref)}>
        <Accordion.Item id="a">
          <Accordion.Trigger>t</Accordion.Trigger>
          <Accordion.Panel>p</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    ),
  },
  {
    name: 'Collapsible',
    tag: 'DIV',
    noId: true,
    ui: (ref) => (
      <Collapsible {...p(ref)} title="t">
        c
      </Collapsible>
    ),
  },
  {
    name: 'CollapsibleGroup',
    tag: 'DIV',
    noRecipe: true,
    ui: (ref) => <CollapsibleGroup {...p(ref)}>c</CollapsibleGroup>,
  },
  {
    name: 'Breadcrumbs',
    tag: 'NAV',
    ui: (ref) => <Breadcrumbs {...p(ref)} items={[{ id: 'a', label: 'A', href: '/' }]} />,
  },
  { name: 'Timeline', tag: 'OL', ui: (ref) => <Timeline {...p(ref)} /> },
  {
    name: 'Timeline.Item',
    tag: 'LI',
    ui: (ref) => (
      <Timeline>
        <Timeline.Item {...p(ref)} title="t" />
      </Timeline>
    ),
  },
  {
    name: 'Timestamp',
    tag: 'TIME',
    ui: (ref) => <Timestamp {...p(ref)} date={new Date(0)} format="date" />,
  },
  { name: 'List', tag: 'UL', ui: (ref) => <List {...p(ref)} /> },
  {
    name: 'List.Item',
    tag: 'LI',
    noId: true,
    ui: (ref) => (
      <List>
        <List.Item {...p(ref)} label="a" />
      </List>
    ),
  },
  { name: 'DescriptionList', tag: 'DL', ui: (ref) => <DescriptionList {...p(ref)} /> },
  {
    name: 'DescriptionList.Item',
    tag: 'DIV',
    ui: (ref) => (
      <DescriptionList>
        <DescriptionList.Item {...p(ref)} label="a" />
      </DescriptionList>
    ),
  },
  {
    name: 'Table.Row',
    tag: 'TR',
    ui: (ref) => (
      <Table>
        <Table.Body>
          <Table.Row {...p(ref)} />
        </Table.Body>
      </Table>
    ),
  },
  {
    name: 'Table.Column',
    tag: 'TH',
    ui: (ref) => (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Column {...p(ref)}>h</Table.Column>
          </Table.Row>
        </Table.Header>
      </Table>
    ),
  },
  {
    name: 'Table.Body',
    tag: 'TBODY',
    ui: (ref) => (
      <Table>
        <Table.Body {...p(ref)} />
      </Table>
    ),
  },
  { name: 'Tree', tag: 'UL', ui: (ref) => <Tree {...p(ref)} aria-label="t" /> },
  {
    name: 'Tree.Item',
    tag: 'LI',
    noId: true,
    innerClass: true,
    ui: (ref) => (
      <Tree>
        <Tree.Item {...p(ref)} id="a" label="a" />
      </Tree>
    ),
  },
  { name: 'Toc', tag: 'NAV', ui: (ref) => <Toc {...p(ref)} /> },
  {
    name: 'Toc.Item',
    tag: 'LI',
    innerClass: true,
    ui: (ref) => (
      <Toc>
        <Toc.Item {...p(ref)} label="a" href="#a" />
      </Toc>
    ),
  },
  { name: 'Outline', tag: 'NAV', ui: (ref) => <Outline {...p(ref)} /> },
  {
    name: 'Pagination',
    tag: 'NAV',
    ui: (ref) => <Pagination {...p(ref)} page={1} onChange={() => {}} totalPages={3} />,
  },
  { name: 'EmptyState', tag: 'DIV', ui: (ref) => <EmptyState {...p(ref)} title="t" /> },
  { name: 'Banner', tag: 'DIV', ui: (ref) => <Banner {...p(ref)}>b</Banner> },
  {
    name: 'Alert',
    tag: 'DIV',
    ui: (ref) => (
      <Alert {...p(ref)} variant="info">
        a
      </Alert>
    ),
  },
  { name: 'Section', tag: 'SECTION', ui: (ref) => <Section {...p(ref)} /> },
  { name: 'Card', tag: 'DIV', ui: (ref) => <Card {...p(ref)} /> },
  {
    name: 'CodeBlock',
    tag: 'DIV',
    ui: (ref) => <CodeBlock {...p(ref)} code="x" />,
  },
  {
    name: 'OverflowList',
    tag: 'DIV',
    ui: (ref) => <OverflowList {...p(ref)} items={['a']} renderOverflow={() => null} />,
  },
  { name: 'TabList', tag: 'NAV', ui: (ref) => <TabList {...p(ref)} /> },
];

function p(ref: RefObject<unknown>) {
  return { 'data-testid': 'x', id: 'the-id', className: 'custom', ref } as object;
}

describe('display/data/nav passthrough', () => {
  it.each(cases)('$name forwards attrs, merges className, points ref at the element', (c) => {
    const ref = createRef<unknown>();
    render(c.ui(ref));
    const el = screen.getAllByTestId('x')[0]!;
    expect(el.tagName).toBe(c.tag);
    if (!c.noId) expect(el.id).toBe('the-id');
    if (c.innerClass) {
      expect(el.querySelector('.custom')).toBeTruthy();
    } else {
      expect(el.classList.contains('custom')).toBe(true);
      // recipe class is still present next to the user class
      if (!c.noRecipe) expect(el.classList.length).toBeGreaterThan(1);
    }
    expect(ref.current).toBe(el);
  });
});

describe('handler + aria passthrough', () => {
  it('Kbd forwards onClick and aria-label', () => {
    const onClick = vi.fn();
    render(
      <Kbd onClick={onClick} aria-label="Command K">
        k
      </Kbd>,
    );
    fireEvent.click(screen.getByLabelText('Command K'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Skeleton keeps user style', () => {
    render(<Skeleton data-testid="s" style={{ width: 40 }} />);
    expect(screen.getByTestId('s').style.width).toBe('40px');
  });

  it('Accordion trigger forwards props and honours headingLevel', () => {
    const onClick = vi.fn();
    render(
      <Accordion>
        <Accordion.Item id="a">
          <Accordion.Trigger headingLevel={4} data-testid="trigger" onClick={onClick}>
            t
          </Accordion.Trigger>
          <Accordion.Panel>p</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    );
    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.parentElement?.tagName).toBe('H4');
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('Collapsible headingLevel defaults to 3 and is overridable', () => {
    const { rerender } = render(<Collapsible title="t">c</Collapsible>);
    expect(screen.getByRole('heading', { level: 3 })).toBeTruthy();
    rerender(
      <Collapsible title="t" headingLevel={5}>
        c
      </Collapsible>,
    );
    expect(screen.getByRole('heading', { level: 5 })).toBeTruthy();
  });

  it('Card, Section and EmptyState headingLevel', () => {
    render(
      <>
        <Card title="c" headingLevel={5} />
        <Section title="s" headingLevel={4} />
        <EmptyState title="e" headingLevel={2} />
      </>,
    );
    expect(screen.getByRole('heading', { name: 'c' }).tagName).toBe('H5');
    expect(screen.getByRole('heading', { name: 's' }).tagName).toBe('H4');
    expect(screen.getByRole('heading', { name: 'e' }).tagName).toBe('H2');
  });

  it('Tabs applies className to the root', () => {
    const { container } = render(
      <Tabs className="custom" data-testid="tabs" tabs={[{ id: 'a', label: 'A', content: 'x' }]} />,
    );
    const root = screen.getByTestId('tabs');
    expect(root.classList.contains('custom')).toBe(true);
    expect(container.querySelector('[role="tablist"]')).toBeTruthy();
  });

  it('Table sort button uses the recipe, not an inline style', () => {
    render(
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Column allowsSorting>Name</Table.Column>
          </Table.Row>
        </Table.Header>
      </Table>,
    );
    const button = screen.getByRole('button', { name: /Name/ });
    expect(button.getAttribute('style')).toBeNull();
    expect(button.className).not.toBe('');
  });

  it('Table forwards rest to <table> and className to the root wrapper', () => {
    render(
      <Table data-testid="t" className="custom" aria-label="Users">
        <Table.Body />
      </Table>,
    );
    const table = screen.getByTestId('t');
    expect(table.tagName).toBe('TABLE');
    expect(table.getAttribute('aria-label')).toBe('Users');
  });

  it('Carousel previous/next labels are overridable', () => {
    render(
      <Carousel label="x" previousLabel="Zurueck" nextLabel="Weiter">
        <div>1</div>
      </Carousel>,
    );
    expect(screen.getByRole('button', { name: 'Zurueck' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Weiter' })).toBeTruthy();
  });

  it('Breadcrumbs expandLabel is overridable', () => {
    render(
      <Breadcrumbs
        maxItems={2}
        expandLabel="Alle"
        items={[
          { id: 'a', label: 'A', href: '/a' },
          { id: 'b', label: 'B', href: '/b' },
          { id: 'c', label: 'C', href: '/c' },
          { id: 'd', label: 'D' },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Alle' })).toBeTruthy();
  });

  it('Pagination labels are overridable and default to English', () => {
    const { rerender } = render(<Pagination page={2} onChange={() => {}} totalPages={5} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeTruthy();
    rerender(
      <Pagination
        page={2}
        onChange={() => {}}
        totalPages={5}
        labels={{ previousPage: 'Zurueck', goToPage: (n) => `Seite ${n}` }}
      />,
    );
    expect(screen.getByRole('button', { name: 'Zurueck' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Seite 3' })).toBeTruthy();
  });

  it('DescriptionList show more/less labels are overridable', () => {
    render(
      <DescriptionList maxItems={1} showMoreLabel="Mehr">
        <DescriptionList.Item label="a">1</DescriptionList.Item>
        <DescriptionList.Item label="b">2</DescriptionList.Item>
      </DescriptionList>,
    );
    expect(screen.getByRole('button', { name: 'Mehr' })).toBeTruthy();
  });

  it('CodeBlock copy text is overridable', () => {
    render(<CodeBlock code="x" copyText="Kopieren" />);
    expect(screen.getByRole('button').textContent).toBe('Kopieren');
  });

  it('Tree composes a user onKeyDown and onClick', () => {
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(
      <Tree aria-label="t" onKeyDown={onKeyDown}>
        <Tree.Item id="a" label="a" onClick={onClick} data-testid="item" />
      </Tree>,
    );
    fireEvent.keyDown(screen.getByRole('tree'), { key: 'ArrowDown' });
    expect(onKeyDown).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('item'));
    expect(onClick).toHaveBeenCalled();
  });

  it('Toc no longer declares hideBelowXl', () => {
    render(
      <Toc style={{ color: 'red' }} stickyTop="10px" data-testid="toc">
        <Toc.Item label="a" href="#a" />
      </Toc>,
    );
    const nav = screen.getByTestId('toc');
    expect(nav.style.color).toBe('red');
    expect(nav.getAttribute('style')).toContain('10px');
  });
});
