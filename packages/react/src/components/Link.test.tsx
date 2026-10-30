import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from './Link';

describe('Link', () => {
  it('forwards native attributes, onClick and ref to the anchor', async () => {
    const ref = createRef<HTMLAnchorElement>();
    const onClick = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
    render(
      <Link ref={ref} href="/docs" target="_blank" className="mine" onClick={onClick}>
        Docs
      </Link>,
    );
    const a = screen.getByRole('link', { name: 'Docs' });
    expect(ref.current).toBe(a);
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.className).toContain('mine');
    await userEvent.click(a);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Link href="/docs" disabled onClick={onClick}>
        Docs
      </Link>,
    );
    await userEvent.click(screen.getByText('Docs'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
