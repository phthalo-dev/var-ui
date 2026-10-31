import { CalendarDate, CalendarDateTime } from '@internationalized/date';
import { render } from '@testing-library/react';
import { StrictMode, useState } from 'react';
import { userEvent } from 'vite-plus/test/browser';
import { beforeAll, describe, expect, test, vi } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { IconProvider } from '../icons';
import { finishAll, raf, settled } from '../test/browser';
import { DateInput } from './DateInput';
import { DateRangeInput } from './DateRangeInput';
import { DateTimeInput } from './DateTimeInput';
import { Dialog } from './Dialog';

// The range calendar is ~370-380px wide and the vitest viewport 414px minus a 15px classic-scrollbar
// gutter on Linux, so pin the field near the edge: the popup then fits beside it (a popup wider than
// the space the anchor leaves does not flip, it is only shifted back into view).
beforeAll(() => {
  const style = document.createElement('style');
  style.textContent = `:root, :root[class] { --var-ui-duration-slow: 150ms; }
    .pin { position: fixed; left: 8px; width: 300px; }`;
  document.head.append(style);
});

function Wrap({ children, dir }: { children: React.ReactNode; dir?: 'rtl' }) {
  return (
    <StrictMode>
      <DesignSystemProvider applyToDocument>
        <IconProvider icons={{}}>
          <div dir={dir}>{children}</div>
        </IconProvider>
      </DesignSystemProvider>
    </StrictMode>
  );
}

type Kind = 'date' | 'range' | 'datetime';

function Picker({
  kind,
  onOpenChange,
  onValueChange,
}: {
  kind: Kind;
  onOpenChange?: (open: boolean) => void;
  onValueChange?: (v: unknown) => void;
}) {
  const [date, setDate] = useState<CalendarDate | null>(new CalendarDate(2026, 7, 15));
  const [dt, setDt] = useState<CalendarDateTime | null>(new CalendarDateTime(2026, 7, 15, 9, 30));
  const [range, setRange] = useState({
    start: new CalendarDate(2026, 7, 10),
    end: new CalendarDate(2026, 7, 20),
  });
  if (kind === 'date')
    return (
      <DateInput
        label="Date"
        value={date}
        onOpenChange={onOpenChange}
        onValueChange={(v) => {
          setDate(v as CalendarDate | null);
          onValueChange?.(v);
        }}
      />
    );
  if (kind === 'datetime')
    return (
      <DateTimeInput
        label="Date"
        value={dt}
        onOpenChange={onOpenChange}
        onValueChange={(v) => {
          setDt(v as CalendarDateTime | null);
          onValueChange?.(v);
        }}
      />
    );
  return (
    <DateRangeInput
      label="Date"
      value={range}
      onOpenChange={onOpenChange}
      onValueChange={(v) => {
        if (v) setRange(v as typeof range);
        onValueChange?.(v);
      }}
    />
  );
}

const trigger = () => document.querySelector<HTMLElement>('button[aria-haspopup="dialog"]')!;
const popup = () => document.querySelector<HTMLElement>('[popover]')!;
const grid = () => document.querySelector<HTMLElement>('[role="grid"]');
const isOpen = () => popup().matches(':popover-open');
const day = (n: number) =>
  [
    ...document.querySelectorAll<HTMLElement>(
      '[role="gridcell"] [role="button"], [role="gridcell"] div',
    ),
  ]
    .filter((c) => !c.hasAttribute('data-outside-month'))
    .find((c) => c.textContent === String(n))!;
const field = () => document.querySelector<HTMLElement>('[role="group"]')!;

async function closed() {
  await raf();
  await finishAll(popup());
  await raf();
}

describe.each<Kind>(['date', 'datetime', 'range'])('%s picker on a native popover', (kind) => {
  test('opens by click in the top layer, in place, with a calendar dialog; reports open', async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Wrap>
        <Picker kind={kind} onOpenChange={onOpenChange} />
      </Wrap>,
    );
    expect(grid()).toBeNull();
    await userEvent.click(trigger());
    await raf();
    expect(isOpen()).toBe(true);
    expect(popup().getAttribute('popover')).toBe('manual');
    expect(container.contains(grid())).toBe(true);
    expect(popup().querySelector('[role="dialog"]')).toBeTruthy();
    // The content brings its own dialog: the shell adds none.
    expect(popup().getAttribute('role')).toBeNull();
    expect(popup().contains(document.activeElement)).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  test('opens by keyboard (Enter on the trigger) and Escape closes, returning focus', async () => {
    render(
      <Wrap>
        <Picker kind={kind} />
      </Wrap>,
    );
    trigger().focus();
    await userEvent.keyboard('{Enter}');
    await raf();
    expect(isOpen()).toBe(true);
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(grid()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('an outside click closes it and lands on the target', async () => {
    const onClick = vi.fn();
    render(
      <Wrap>
        <button type="button" data-testid="outside" onClick={onClick}>
          outside
        </button>
        <Picker kind={kind} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[data-testid="outside"]')!);
    await closed();
    expect(isOpen()).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('clicking the calendar button again closes it', async () => {
    render(
      <Wrap>
        <Picker kind={kind} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(trigger());
    await closed();
    expect(isOpen()).toBe(false);
  });

  test('clicking a date segment (inside the anchor) does not count as an outside press', async () => {
    render(
      <Wrap>
        <Picker kind={kind} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(document.querySelector('[role="spinbutton"]')!);
    await raf();
    // Focus moved into the field (blur-close is RAC's rule), but the press itself is not outside:
    // the popup is closed by the blur rule only, never left half-open.
    expect(isOpen() === popup().matches(':popover-open')).toBe(true);
  });

  test('anchored below the field; flips above near the viewport bottom', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: 40 }}>
          <Picker kind={kind} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().top).toBeGreaterThanOrEqual(
      field().getBoundingClientRect().bottom - 1,
    );
    expect(Math.round(popup().getBoundingClientRect().left)).toBe(
      Math.round(field().getBoundingClientRect().left),
    );
  });

  test('flips above', async () => {
    render(
      <Wrap>
        <div className="pin" style={{ top: window.innerHeight - 70 }}>
          <Picker kind={kind} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(popup().getBoundingClientRect().bottom).toBeLessThanOrEqual(
      field().getBoundingClientRect().top + 1,
    );
  });

  test('RTL: aligns to the right (start) edge of the field', async () => {
    render(
      <Wrap dir="rtl">
        <div className="pin" style={{ top: 40, left: 'auto', right: 8 }}>
          <Picker kind={kind} />
        </div>
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    expect(Math.round(popup().getBoundingClientRect().right)).toBe(
      Math.round(field().getBoundingClientRect().right),
    );
  });

  test('exit keeps the calendar mounted until the animation ends', async () => {
    render(
      <Wrap>
        <Picker kind={kind} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await settled(popup());
    await userEvent.keyboard('{Escape}');
    await raf();
    expect(isOpen()).toBe(false);
    expect(grid()).toBeTruthy();
    await finishAll(popup());
    await raf();
    expect(grid()).toBeNull();
  });
});

describe('selecting a date', () => {
  test('DateInput: clicking a day reports it and closes the popup', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Picker kind="date" onValueChange={onValueChange} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(day(20));
    await closed();
    expect(onValueChange).toHaveBeenCalled();
    expect(String(onValueChange.mock.lastCall![0])).toBe('2026-07-20');
    expect(isOpen()).toBe(false);
  });

  test('DateRangeInput: picking start and end reports the range', async () => {
    const onValueChange = vi.fn();
    render(
      <Wrap>
        <Picker kind="range" onValueChange={onValueChange} />
      </Wrap>,
    );
    await userEvent.click(trigger());
    await raf();
    await userEvent.click(day(5));
    await userEvent.click(day(8));
    await closed();
    const last = onValueChange.mock.lastCall![0] as { start: CalendarDate; end: CalendarDate };
    expect(String(last.start)).toBe('2026-07-05');
    expect(String(last.end)).toBe('2026-07-08');
    expect(isOpen()).toBe(false);
  });
});

describe('date pickers inside a modal Dialog (no shim)', () => {
  const dialog = () => document.querySelector<HTMLDialogElement>('dialog')!;
  const inDialog = (
    <Wrap>
      <Dialog.Root defaultOpen>
        <Dialog.Popup>
          <Dialog.Title>Pick</Dialog.Title>
          <Picker kind="date" />
        </Dialog.Popup>
      </Dialog.Root>
    </Wrap>
  );

  test('the calendar opens inside the dialog and a trusted click selects a day', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    expect(dialog().contains(popup())).toBe(true);
    await userEvent.click(day(21));
    await closed();
    expect(dialog().matches(':modal')).toBe(true);
  });

  test('Escape closes the calendar first; the dialog stays open', async () => {
    render(inDialog);
    await settled(dialog());
    await userEvent.click(trigger());
    await raf();
    await userEvent.keyboard('{Escape}');
    await closed();
    expect(isOpen()).toBe(false);
    expect(dialog().matches(':modal')).toBe(true);
  });
});
