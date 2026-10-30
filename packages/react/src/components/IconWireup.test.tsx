import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { IconProvider } from '../icons';
import { Alert } from './Alert';
import { Select } from './Select';

const glyph = <svg data-testid="tone-glyph" viewBox="0 0 24 24" />;
const chevron = <svg data-testid="chevron-glyph" viewBox="0 0 24 24" />;

describe('icon wire-up', () => {
  it('Alert renders the registry glyph for its tone by default', () => {
    render(
      <IconProvider icons={{ success: glyph }}>
        <Alert tone="success">Saved</Alert>
      </IconProvider>,
    );
    expect(screen.getByTestId('tone-glyph')).toBeTruthy();
  });

  it('Alert icon={null} suppresses the default glyph', () => {
    const { container } = render(
      <IconProvider icons={{ success: glyph }}>
        <Alert tone="success" icon={null}>
          Saved
        </Alert>
      </IconProvider>,
    );
    expect(container.querySelector('.var-ui-alert__icon')).toBeNull();
  });

  it('Select trigger renders the chevronDown glyph', () => {
    render(
      <IconProvider icons={{ chevronDown: chevron }}>
        <Select label="Fruit" options={[{ value: 'a', label: 'Apple' }]} />
      </IconProvider>,
    );
    expect(screen.getByTestId('chevron-glyph')).toBeTruthy();
  });
});
