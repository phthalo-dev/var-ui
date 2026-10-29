import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorInput } from './ColorInput';

describe('ColorInput', () => {
  it('renders label and hex value', () => {
    render(<ColorInput label="Brand" value="#ff00aa" onChange={() => {}} />);
    expect(screen.getByText('Brand')).toBeTruthy();
    expect((screen.getByLabelText('Brand') as HTMLInputElement).value).toBe('#ff00aa');
  });

  it('shows a textbox and a swatch button named Open color picker by default', () => {
    render(<ColorInput value="#ff00aa" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Open color picker' })).toBeTruthy();
  });

  it('omits the hex field, label, description, and error in swatch appearance', () => {
    render(
      <ColorInput
        appearance="swatch"
        label="Brand"
        description="Pick one"
        errorMessage="Required"
        value="#ff00aa"
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByText('Brand')).toBeNull();
    expect(screen.queryByText('Pick one')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: 'Open color picker' })).toBeTruthy();
  });

  it('names the swatch button with swatchLabel', () => {
    render(
      <ColorInput
        appearance="swatch"
        swatchLabel="Color for Alex"
        value="#ff00aa"
        onChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Color for Alex' })).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('submits the color from a hidden input when swatch mode has a name', () => {
    const { container } = render(
      <ColorInput appearance="swatch" name="memberColor" value="#ff00aa" onChange={() => {}} />,
    );
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement | null;
    expect(hidden?.name).toBe('memberColor');
    expect(hidden?.value).toBe('#ff00aa');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('opens the picker from the swatch button', async () => {
    const user = userEvent.setup();
    render(
      <ColorInput
        appearance="swatch"
        swatchLabel="Color for Alex"
        value="#ff00aa"
        onChange={() => {}}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Color for Alex' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Hue' })).toBeTruthy();
  });
});

describe('ColorInput accessibility wiring', () => {
  it('describes the hex input by description and error', () => {
    render(
      <ColorInput
        label="Brand"
        description="Pick one"
        errorMessage="Bad color"
        value="#ff00aa"
        onChange={() => {}}
      />,
    );
    const input = screen.getByRole('textbox');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(
      `${screen.getByText('Pick one').id} ${screen.getByText('Bad color').id}`,
    );
  });
});
