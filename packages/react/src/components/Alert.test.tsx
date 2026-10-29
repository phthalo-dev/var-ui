import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Alert } from './Alert';

describe('Alert', () => {
  it('has no live role by default', () => {
    const { container } = render(
      <IconProvider icons={{}}>
        <Alert variant="info">Heads up</Alert>
      </IconProvider>,
    );
    expect(container.querySelector('[data-alert]')?.getAttribute('role')).toBeNull();
  });

  it('passes through an explicit role', () => {
    render(
      <IconProvider icons={{}}>
        <Alert variant="danger" role="alert">
          Failed
        </Alert>
      </IconProvider>,
    );
    expect(screen.getByRole('alert').textContent).toContain('Failed');
  });
});
