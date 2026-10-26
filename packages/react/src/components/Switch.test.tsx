import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('merges a caller className with the recipe class', () => {
    render(<Switch className="custom">Notifications</Switch>);
    const sw = screen.getByRole('switch', { name: 'Notifications' });
    const root = sw.closest('label');
    expect(root?.className).toContain('var-ui-switch');
    expect(root?.className).toContain('custom');
  });
});
