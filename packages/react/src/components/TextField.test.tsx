import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';
import { TextAreaField } from './TextAreaField';

describe('TextField className', () => {
  it('reaches the root for TextField (string and function)', () => {
    const { rerender } = render(<TextField label="Name" className="custom" />);
    const root = () => screen.getByLabelText('Name').parentElement;
    expect(root()?.className).toContain('custom');
    expect(root()?.className).toContain('var-ui-');
    rerender(<TextField label="Name" className={() => 'fn-custom'} />);
    expect(root()?.className).toContain('fn-custom');
  });

  it('reaches the root for TextAreaField', () => {
    render(<TextAreaField label="Bio" className="custom" />);
    expect(screen.getByLabelText('Bio').parentElement?.className).toContain('custom');
  });
});
