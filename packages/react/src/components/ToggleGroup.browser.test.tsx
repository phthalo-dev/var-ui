import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { ToggleGroup } from './ToggleGroup';
import { Toolbar } from './Toolbar';

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <div dir={dir}>{children}</div>
      </DesignSystemProvider>
    </StrictMode>
  );
}

function Group(props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) {
  return (
    <ToggleGroup aria-label="Style" {...(props as object)}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic" disabled>
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      <ToggleGroup.Item value="strike">Strike</ToggleGroup.Item>
    </ToggleGroup>
  );
}

const btn = (container: HTMLElement, name: string) =>
  [...container.querySelectorAll('button')].find((b) => b.textContent === name)!;

describe('ToggleGroup (real browser)', () => {
  test('Tab enters the group once; arrows rove and skip disabled items', async () => {
    const { container } = render(
      <Wrap>
        <button type="button">before</button>
        <Group />
        <button type="button">after</button>
      </Wrap>,
    );
    await userEvent.tab();
    await userEvent.tab();
    expect(document.activeElement).toBe(btn(container, 'Bold'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Underline'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Strike'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Strike'));
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(btn(container, 'Underline'));
    await userEvent.tab();
    expect(document.activeElement).toBe(btn(container, 'after'));
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(btn(container, 'Underline'));
  });

  test('Home and End jump to the first and last enabled item', async () => {
    const { container } = render(
      <Wrap>
        <Group />
      </Wrap>,
    );
    btn(container, 'Underline').focus();
    await userEvent.keyboard('{End}');
    expect(document.activeElement).toBe(btn(container, 'Strike'));
    await userEvent.keyboard('{Home}');
    expect(document.activeElement).toBe(btn(container, 'Bold'));
  });

  test('vertical groups use Up/Down and ignore Left/Right', async () => {
    const { container } = render(
      <Wrap>
        <Group orientation="vertical" />
      </Wrap>,
    );
    btn(container, 'Bold').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Bold'));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(btn(container, 'Underline'));
    await userEvent.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(btn(container, 'Bold'));
  });

  test('RTL mirrors the arrow keys', async () => {
    const { container } = render(
      <Wrap dir="rtl">
        <Group />
      </Wrap>,
    );
    btn(container, 'Bold').focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(btn(container, 'Underline'));
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Bold'));
    // Visually, the first item sits at the inline start (right edge in RTL).
    expect(btn(container, 'Bold').getBoundingClientRect().left).toBeGreaterThan(
      btn(container, 'Strike').getBoundingClientRect().left,
    );
  });

  test('Space and Enter toggle the focused item', async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Wrap>
        <Group multiple onValueChange={onValueChange} />
      </Wrap>,
    );
    btn(container, 'Bold').focus();
    await userEvent.keyboard(' ');
    expect(btn(container, 'Bold').getAttribute('aria-pressed')).toBe('true');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(btn(container, 'Underline').getAttribute('aria-pressed')).toBe('true');
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'underline']);
    await userEvent.keyboard(' ');
    expect(onValueChange).toHaveBeenLastCalledWith(['bold']);
  });

  test('single mode swaps the pressed item; the roving stop follows focus', async () => {
    function Controlled() {
      const [v, setV] = useState<string | null>(null);
      return <Group value={v} onValueChange={setV} />;
    }
    const { container } = render(
      <Wrap>
        <Controlled />
      </Wrap>,
    );
    await userEvent.click(btn(container, 'Underline'));
    await userEvent.click(btn(container, 'Strike'));
    expect(btn(container, 'Underline').getAttribute('aria-pressed')).toBe('false');
    expect(btn(container, 'Strike').getAttribute('aria-pressed')).toBe('true');
    expect(btn(container, 'Strike').tabIndex).toBe(0);
    expect(btn(container, 'Bold').tabIndex).toBe(-1);
  });

  test('pressed state is visible (distinct from unpressed)', () => {
    const { container } = render(
      <Wrap>
        <Group defaultValue="bold" />
      </Wrap>,
    );
    const on = getComputedStyle(btn(container, 'Bold'));
    const off = getComputedStyle(btn(container, 'Underline'));
    expect(on.backgroundColor).not.toBe(off.backgroundColor);
  });

  test('inside a Toolbar the group handles its own arrow keys', async () => {
    const { container } = render(
      <Wrap>
        <Toolbar label="Editor" startContent={<Group />} />
      </Wrap>,
    );
    btn(container, 'Bold').focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(btn(container, 'Underline'));
  });
});
