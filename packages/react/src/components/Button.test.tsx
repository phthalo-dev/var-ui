import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and applies the tone recipe attrs', () => {
    render(
      <Button tone="accent" appearance="filled">
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.className).toContain('var-ui-button');
    expect(button.getAttribute('data-tone')).toBe('accent');
    expect(button.getAttribute('data-appearance')).toBe('filled');
  });

  it('applies explicit tone and appearance', () => {
    render(
      <Button tone="danger" appearance="outline">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.getAttribute('data-tone')).toBe('danger');
    expect(button.getAttribute('data-appearance')).toBe('outline');
  });
});
