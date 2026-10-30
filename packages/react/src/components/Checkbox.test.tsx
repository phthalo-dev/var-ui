import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('merges a caller className with the recipe class', () => {
    render(<Checkbox className="custom">Accept terms</Checkbox>);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    const root = box.closest('label');
    expect(root?.className).toContain('var-ui-checkbox');
    expect(root?.className).toContain('custom');
  });

  it('renders an indeterminate state distinct from checked', () => {
    render(<Checkbox indeterminate>Some</Checkbox>);
    const box = document.querySelector('span[data-indeterminate]');
    expect(box).not.toBeNull();
    expect(box?.textContent).toBe('−');
    expect(box?.hasAttribute('data-selected')).toBe(false);
  });
});
