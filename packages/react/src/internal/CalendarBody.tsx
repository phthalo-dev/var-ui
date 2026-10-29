import type { JSX } from 'react';
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Dialog,
  Heading,
  Popover,
  RangeCalendar,
} from 'react-aria-components';
import { mergeProps } from 'typestyles';
import { Icon } from '../icons';

type RecipeSlot = Parameters<typeof mergeProps>[0];

/** Recipe class slots for the month grid; each date recipe names them differently. */
export type CalendarBodySlots = {
  header: RecipeSlot;
  navButton: RecipeSlot;
  heading: RecipeSlot;
  grid: RecipeSlot;
  headerCell: RecipeSlot;
  cell: RecipeSlot;
};

/**
 * Header (previous / heading / next) and month grid shared by the standalone
 * `Calendar` and the popover calendars of the date fields. Must be rendered
 * inside a RAC `Calendar` or `RangeCalendar`.
 */
export function CalendarBody({ slots }: { slots: CalendarBodySlots }): JSX.Element {
  return (
    <>
      <header {...mergeProps(slots.header)}>
        <Button slot="previous" {...mergeProps(slots.navButton)}>
          <Icon name="chevronLeft" size="sm" />
        </Button>
        <Heading {...mergeProps(slots.heading)} />
        <Button slot="next" {...mergeProps(slots.navButton)}>
          <Icon name="chevronRight" size="sm" />
        </Button>
      </header>
      <CalendarGrid {...mergeProps(slots.grid)}>
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell {...mergeProps(slots.headerCell)}>{day}</CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} {...mergeProps(slots.cell)} />}
        </CalendarGridBody>
      </CalendarGrid>
    </>
  );
}

/** Popover > dialog > calendar used by the date picker fields (`range` renders a `RangeCalendar`). */
export function CalendarPopover({
  popover,
  slots,
  range = false,
}: {
  popover: RecipeSlot;
  slots: CalendarBodySlots;
  range?: boolean;
}): JSX.Element {
  return (
    <Popover {...mergeProps(popover)}>
      <Dialog>
        {range ? (
          <RangeCalendar>
            <CalendarBody slots={slots} />
          </RangeCalendar>
        ) : (
          <AriaCalendar>
            <CalendarBody slots={slots} />
          </AriaCalendar>
        )}
      </Dialog>
    </Popover>
  );
}
