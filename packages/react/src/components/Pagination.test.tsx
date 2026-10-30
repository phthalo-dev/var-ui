import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectionProvider } from '../DirectionProvider';
import { generatePageRange, Pagination } from './Pagination';

describe('generatePageRange', () => {
  it('shows all pages when total fits within slots', () => {
    expect(generatePageRange(1, 5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses near the start', () => {
    expect(generatePageRange(1, 10, 1)).toEqual([1, 2, 3, '...', 10]);
  });

  it('collapses near the end', () => {
    expect(generatePageRange(10, 10, 1)).toEqual([1, '...', 8, 9, 10]);
  });

  it('collapses on both sides in the middle', () => {
    expect(generatePageRange(5, 10, 1)).toEqual([1, '...', 4, 5, 6, '...', 10]);
  });
});

describe('Pagination', () => {
  it('renders page-number buttons and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Pagination page={1} onValueChange={onValueChange} totalPages={5} />);
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it('disables previous on the first page and next on the last page', () => {
    const { rerender } = render(<Pagination page={1} onValueChange={() => {}} totalPages={3} />);
    expect(
      (screen.getByRole('button', { name: 'Go to previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    rerender(<Pagination page={3} onValueChange={() => {}} totalPages={3} />);
    expect(
      (screen.getByRole('button', { name: 'Go to next page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('marks the active page with aria-current', () => {
    render(<Pagination page={2} onValueChange={() => {}} totalPages={3} />);
    expect(screen.getByRole('button', { name: 'Go to page 2' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('renders count variant text', () => {
    render(
      <Pagination
        page={2}
        onValueChange={() => {}}
        totalItems={45}
        pageSize={10}
        variant="count"
      />,
    );
    expect(screen.getByText('11–20 of 45')).toBeTruthy();
  });

  it('renders compact variant text', () => {
    render(<Pagination page={2} onValueChange={() => {}} totalPages={5} variant="compact" />);
    expect(screen.getByText('Page 2 of 5')).toBeTruthy();
  });

  it('renders dots variant with one dot per page', () => {
    render(<Pagination page={1} onValueChange={() => {}} totalPages={4} variant="dots" />);
    expect(screen.getByRole('group', { name: 'Page indicators' })).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /Go to page/ })).toHaveLength(4);
  });

  it('renders no page indicator for the none variant', () => {
    render(<Pagination page={1} onValueChange={() => {}} totalPages={4} variant="none" />);
    expect(screen.queryByRole('button', { name: /Go to page/ })).toBeNull();
  });

  it('changes page size and resets to page 1', async () => {
    const onValueChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        page={3}
        onValueChange={onValueChange}
        totalItems={100}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    // RAC's Select trigger always folds the currently-selected value into its computed
    // accessible name (e.g. "10 Items per page"), regardless of whether the label comes
    // from `aria-label`, a rendered `<Label>`, or an external `aria-labelledby` reference —
    // verified empirically against all three. A regex match is used here (same technique
    // the "dots" test below uses for its variable page numbers) since an exact string match
    // against "Items per page" alone can never succeed while a value is selected.
    await userEvent.click(screen.getByRole('button', { name: /Items per page/ }));
    await userEvent.click(screen.getByRole('option', { name: '25' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it('renders nothing when totalItems is zero', () => {
    const { container } = render(<Pagination page={1} onValueChange={() => {}} totalItems={0} />);
    expect(container.innerHTML).toBe('');
  });

  it('mirrors prev/next icons when direction is rtl', () => {
    render(
      <DirectionProvider direction="rtl">
        <Pagination page={2} onValueChange={() => {}} totalPages={5} />
      </DirectionProvider>,
    );
    const prev = screen.getByRole('button', { name: 'Go to previous page' });
    const next = screen.getByRole('button', { name: 'Go to next page' });
    expect(prev.querySelector('[data-mirror]')).toBeTruthy();
    expect(next.querySelector('[data-mirror]')).toBeTruthy();
  });
});
