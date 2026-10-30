/** VarUI-vocabulary tests for the navigation / disclosure / data group (PR 2). */
import { useState } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { Accordion } from './Accordion';
import { Collapsible } from './Collapsible';
import { List } from './List';
import { Pagination } from './Pagination';
import { ResizeHandle } from './ResizeHandle';
import { SideNav } from './SideNav';
import { Table } from './Table';
import { TabList } from './TabList';
import { Tabs } from './Tabs';
import { Timeline } from './Timeline';
import { TopNav } from './TopNav';
import { TopNavMegaMenu } from './TopNavMegaMenu';
import { ChatComposerInput } from './chat/ChatComposerInput';
import { ChatMessageList } from './chat/ChatMessageList';
import { ChatSendButton } from './chat/ChatSendButton';

const wrap = (ui: React.ReactElement) =>
  render(
    <IconProvider icons={{}}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );

const hidden = (text: string) =>
  screen.getByText(text).closest('[role="group"]')?.getAttribute('aria-hidden') === 'true';

describe('SideNav / TopNav items', () => {
  it('SideNav.Item: onClick fires for mouse and keyboard, not when disabled; selected sets aria-current', async () => {
    const onClick = vi.fn();
    const u = userEvent.setup();
    const { rerender } = wrap(<SideNav.Item label="Home" onClick={onClick} selected />);
    const row = screen.getByRole('button', { name: 'Home' });
    expect(row.getAttribute('aria-current')).toBe('page');
    expect(row.hasAttribute('data-selected')).toBe(true);
    await u.click(row);
    await u.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
    rerender(
      <IconProvider icons={{}}>
        <SideNav.Item label="Home" onClick={onClick} disabled />
      </IconProvider>,
    );
    await u.click(screen.getByRole('button', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Home' }).hasAttribute('disabled')).toBe(true);
  });

  it('SideNav collapsible: collapsed (controlled) and defaultCollapsed (uncontrolled)', async () => {
    const onCollapsedChange = vi.fn();
    const { unmount } = wrap(
      <SideNav collapsible={{ defaultCollapsed: true }}>
        <SideNav.Item label="Home" />
      </SideNav>,
    );
    const nav = screen.getByRole('navigation');
    expect(nav.hasAttribute('data-collapsed')).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Expand navigation' }));
    expect(nav.hasAttribute('data-collapsed')).toBe(false);
    unmount();

    wrap(
      <SideNav collapsible={{ collapsed: false, onCollapsedChange }}>
        <SideNav.Item label="Home" />
      </SideNav>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('navigation').hasAttribute('data-collapsed')).toBe(false);
  });

  it('TopNav.Item: iconOnly hides the label visually but keeps the name; onClick + disabled work', async () => {
    const onClick = vi.fn();
    const u = userEvent.setup();
    wrap(<TopNav.Item label="Search" iconOnly onClick={onClick} />);
    const item = screen.getByRole('button', { name: 'Search' });
    expect(item.getAttribute('aria-label')).toBe('Search');
    expect(item.querySelector('span')).toBeNull();
    await u.click(item);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('TopNav.MegaMenu: open + onOpenChange and onClick on rich items', async () => {
    const onOpenChange = vi.fn();
    const onItem = vi.fn();
    const { rerender } = wrap(
      <TopNavMegaMenu
        label="Products"
        open={false}
        onOpenChange={onOpenChange}
        items={[
          { id: 'a', title: 'Alpha', onClick: onItem },
          { id: 'b', title: 'Beta', disabled: true },
        ]}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Alpha' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /Products/ }));
    expect(onOpenChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ reason: expect.any(String) }),
    );
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <TopNavMegaMenu
            label="Products"
            open
            onOpenChange={onOpenChange}
            items={[
              { id: 'a', title: 'Alpha', onClick: onItem },
              { id: 'b', title: 'Beta', disabled: true },
            ]}
          />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Alpha/ }));
    expect(onItem).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /Beta/ }).hasAttribute('disabled')).toBe(true);
  });
});

describe('List', () => {
  it('item onClick fires on the overlay button, not when disabled', async () => {
    const onClick = vi.fn();
    const { rerender } = wrap(
      <List>
        <List.Item label="Ada" onClick={onClick} />
      </List>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Ada' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <List>
            <List.Item label="Ada" onClick={onClick} disabled />
          </List>
        </LayerProvider>
      </IconProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Ada' })).toBeNull();
    expect(document.querySelector('li')?.hasAttribute('data-disabled')).toBe(true);
  });
});

describe('ResizeHandle', () => {
  it('onValueChange receives the next clamped size; collapsed/reversed reach the DOM and behavior', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ResizeHandle value={200} minValue={100} maxValue={300} onValueChange={onValueChange} />,
    );
    const handle = screen.getByRole('separator');
    handle.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(210);
    rerender(
      <ResizeHandle
        value={200}
        minValue={100}
        maxValue={300}
        onValueChange={onValueChange}
        reversed
      />,
    );
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(190);
    rerender(
      <ResizeHandle
        value={200}
        minValue={100}
        maxValue={300}
        onValueChange={onValueChange}
        collapsed
      />,
    );
    expect(screen.getByRole('separator').hasAttribute('data-collapsed')).toBe(true);
  });
});

describe('Accordion', () => {
  const items = (
    <>
      <Accordion.Item id="a">
        <Accordion.Trigger>Alpha</Accordion.Trigger>
        <Accordion.Panel>
          <p>Alpha body</p>
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item id="b" disabled>
        <Accordion.Trigger>Beta</Accordion.Trigger>
        <Accordion.Panel>
          <p>Beta body</p>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );

  it('value/onValueChange (controlled) and disabled items', async () => {
    const onValueChange = vi.fn();
    const { rerender } = wrap(
      <Accordion value={[]} onValueChange={onValueChange}>
        {items}
      </Accordion>,
    );
    await userEvent.click(screen.getByRole('button', { name: /Alpha/ }));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
    expect(hidden('Alpha body')).toBe(true);
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Accordion value={['a']} onValueChange={onValueChange}>
            {items}
          </Accordion>
        </LayerProvider>
      </IconProvider>,
    );
    expect(hidden('Alpha body')).toBe(false);
    expect((screen.getByRole('button', { name: /Beta/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('disabled on the root disables every trigger', () => {
    wrap(<Accordion disabled>{items}</Accordion>);
    for (const button of screen.getAllByRole('button')) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });
});

describe('Collapsible', () => {
  it('expanded is controlled, defaultExpanded uncontrolled; onExpandedChange fires', async () => {
    const onExpandedChange = vi.fn();
    const { rerender, unmount } = wrap(
      <Collapsible title="More" expanded={false} onExpandedChange={onExpandedChange}>
        <p>Body</p>
      </Collapsible>,
    );
    expect(hidden('Body')).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: /More/ }));
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(hidden('Body')).toBe(true);
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Collapsible title="More" expanded onExpandedChange={onExpandedChange}>
            <p>Body</p>
          </Collapsible>
        </LayerProvider>
      </IconProvider>,
    );
    expect(hidden('Body')).toBe(false);
    unmount();

    wrap(
      <Collapsible title="More" defaultExpanded>
        <p>Body</p>
      </Collapsible>,
    );
    expect(hidden('Body')).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: /More/ }));
    expect(hidden('Body')).toBe(true);
  });
});

describe('Table', () => {
  it('striped, rowHeader and selected reach the DOM', () => {
    const { container } = wrap(
      <Table striped>
        <Table.Header>
          <Table.Row>
            <Table.Column rowHeader>Name</Table.Column>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row selected>
            <Table.Cell rowHeader>Ada</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
    expect(container.querySelector('tbody th[scope="row"]')).toBeTruthy();
    const row = container.querySelector('tbody tr')!;
    expect(row.getAttribute('aria-selected')).toBe('true');
    expect(row.hasAttribute('data-selected')).toBe(true);
  });
});

describe('Timeline', () => {
  it('active/pending flags map to data attributes', () => {
    const { container } = wrap(
      <Timeline activeIndex={0}>
        <Timeline.Item title="Done" />
        <Timeline.Item title="Later" />
      </Timeline>,
    );
    const items = container.querySelectorAll('li');
    expect(items[0]!.hasAttribute('data-active')).toBe(true);
    expect(items[0]!.hasAttribute('data-pending')).toBe(false);
    expect(items[1]!.hasAttribute('data-active')).toBe(false);
    expect(items[1]!.hasAttribute('data-pending')).toBe(true);
  });
});

describe('Tabs', () => {
  const tabs = [
    { value: 'one', label: 'One', content: <p>Panel one</p> },
    { value: 'two', label: 'Two', content: <p>Panel two</p> },
    { value: 'three', label: 'Three', content: <p>Panel three</p>, disabled: true },
  ];

  it('uncontrolled: defaultValue selects, onValueChange gets the string', async () => {
    const onValueChange = vi.fn();
    wrap(<Tabs tabs={tabs} defaultValue="two" onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
    await userEvent.click(screen.getByRole('tab', { name: 'One' }));
    expect(onValueChange).toHaveBeenCalledWith('one');
    expect(screen.getByText('Panel one')).toBeTruthy();
  });

  it('controlled: value drives the selected tab', async () => {
    function Controlled() {
      const [value, setValue] = useState('one');
      return <Tabs tabs={tabs} value={value} onValueChange={setValue} />;
    }
    wrap(<Controlled />);
    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true');
  });

  it('per-tab disabled', () => {
    wrap(<Tabs tabs={tabs} />);
    expect(screen.getByRole('tab', { name: 'Three' }).getAttribute('aria-disabled')).toBe('true');
  });
});

describe('TabList', () => {
  it('uncontrolled defaultValue + onValueChange; labelHidden and disabled', async () => {
    const onValueChange = vi.fn();
    wrap(
      <TabList defaultValue="a" onValueChange={onValueChange} label="Sections">
        <TabList.Tab value="a" label="Alpha" />
        <TabList.Tab value="b" label="Beta" labelHidden />
        <TabList.Tab value="c" label="Gamma" disabled />
      </TabList>,
    );
    expect(screen.getByRole('button', { name: 'Alpha' }).hasAttribute('data-selected')).toBe(true);
    const beta = screen.getByRole('button', { name: 'Beta' });
    expect(beta.getAttribute('aria-label')).toBe('Beta');
    await userEvent.click(beta);
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(beta.hasAttribute('data-selected')).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'Gamma' }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
});

describe('Pagination', () => {
  it('onValueChange gets the page; disabled blocks it', async () => {
    const onValueChange = vi.fn();
    const { rerender } = wrap(<Pagination page={1} totalPages={5} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: /3/ }));
    expect(onValueChange).toHaveBeenCalledWith(3);
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <Pagination page={1} totalPages={5} onValueChange={onValueChange} disabled />
        </LayerProvider>
      </IconProvider>,
    );
    expect((screen.getByRole('button', { name: /3/ }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('Chat', () => {
  it('ChatSendButton: streaming swaps to stop, disabled is ignored while streaming, onClick on send', async () => {
    const onClick = vi.fn();
    const onStop = vi.fn();
    const { rerender } = wrap(<ChatSendButton onClick={onClick} onStop={onStop} />);
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <ChatSendButton streaming disabled onClick={onClick} onStop={onStop} />
        </LayerProvider>
      </IconProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ChatMessageList streaming sets aria-busy', () => {
    wrap(<ChatMessageList streaming>x</ChatMessageList>);
    expect(screen.getByRole('log').getAttribute('aria-busy')).toBe('true');
  });

  it('ChatComposerInput: onValueChange gets the text; disabled disables the textarea', async () => {
    const onValueChange = vi.fn();
    const { rerender } = wrap(
      <ChatComposerInput value="" onValueChange={onValueChange} onSubmit={() => {}} />,
    );
    await userEvent.type(screen.getByRole('textbox'), 'h');
    expect(onValueChange).toHaveBeenCalledWith('h');
    rerender(
      <IconProvider icons={{}}>
        <LayerProvider>
          <ChatComposerInput value="" onValueChange={onValueChange} onSubmit={() => {}} disabled />
        </LayerProvider>
      </IconProvider>,
    );
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true);
  });
});
