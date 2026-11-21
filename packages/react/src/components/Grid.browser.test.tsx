import { render } from '@testing-library/react';
import { page } from 'vite-plus/test/browser';
import { afterEach, describe, expect, test } from 'vite-plus/test';
import '../../../core/src/theme/base-styles';
import '../../../core/src/theme/register-default';
import { DesignSystemProvider } from '../DesignSystemProvider';
import { Grid } from './Grid';

/** Number of column tracks the browser actually laid out. */
const tracks = (el: Element) => getComputedStyle(el).gridTemplateColumns.split(' ').length;

afterEach(async () => {
  await page.viewport(1280, 800);
});

describe('Grid responsive columns (#196)', () => {
  function Cells({ columns }: { columns: React.ComponentProps<typeof Grid>['columns'] }) {
    return (
      <DesignSystemProvider>
        <Grid columns={columns} data-testid="grid" minColumnWidth="4rem">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>{i}</div>
          ))}
        </Grid>
      </DesignSystemProvider>
    );
  }
  const grid = () => document.querySelector('[data-testid="grid"]')!;

  test('a per-breakpoint map changes the track count at each breakpoint', async () => {
    render(<Cells columns={{ base: 2, md: 4, xl: 6 }} />);
    await page.viewport(500, 800);
    expect(tracks(grid())).toBe(2);
    await page.viewport(900, 800); // ≥ md (48rem), < lg: md applies
    expect(tracks(grid())).toBe(4);
    await page.viewport(1100, 800); // ≥ lg, < xl: still md
    expect(tracks(grid())).toBe(4);
    await page.viewport(1300, 800); // ≥ xl (80rem)
    expect(tracks(grid())).toBe(6);
  });

  test('without base, the auto template holds until the first set breakpoint', async () => {
    render(<Cells columns={{ lg: 3 }} />);
    await page.viewport(700, 800);
    // auto-fill with 4rem minimum: many tracks.
    expect(tracks(grid())).toBeGreaterThan(3);
    await page.viewport(1100, 800);
    expect(tracks(grid())).toBe(3);
  });

  test('a count past eight uses the same variables', async () => {
    render(<Cells columns={11} />);
    expect(tracks(grid())).toBe(11);
  });
});
