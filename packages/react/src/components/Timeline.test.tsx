import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Timeline } from './Timeline';

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('Timeline', () => {
  it('renders compound items', () => {
    wrap(
      <Timeline activeIndex={0}>
        <Timeline.Item title="Created" timestamp="2 hours ago">
          Issue opened
        </Timeline.Item>
        <Timeline.Item title="In review" timestamp="1 hour ago">
          Waiting on approval
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByText('Created')).toBeTruthy();
    expect(screen.getByText('Issue opened')).toBeTruthy();
    expect(screen.getByText('In review')).toBeTruthy();
  });

  it('marks later items as pending when activeIndex is set', () => {
    const { container } = wrap(
      <Timeline activeIndex={0}>
        <Timeline.Item title="Created">Done</Timeline.Item>
        <Timeline.Item title="Shipped">Pending</Timeline.Item>
      </Timeline>,
    );
    const items = container.querySelectorAll('.var-ui-timeline__item');
    expect(items[0]?.getAttribute('data-active')).toBe('');
    expect(items[1]?.getAttribute('data-pending')).toBe('');
  });

  it('renders from items data', () => {
    wrap(
      <Timeline
        items={[
          { id: 'a', title: 'Created', description: 'Issue opened' },
          { id: 'b', title: 'Merged', description: 'PR #42' },
        ]}
      />,
    );
    expect(screen.getByText('Merged')).toBeTruthy();
  });

  it('throws when Timeline.Item is used outside Timeline', () => {
    expect(() => wrap(<Timeline.Item title="Solo">Alone</Timeline.Item>)).toThrow(/Timeline/);
  });
});
