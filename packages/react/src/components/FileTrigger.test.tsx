import type { ComponentProps, MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { FileTrigger } from './FileTrigger';

function renderFileTrigger(props: Partial<ComponentProps<typeof FileTrigger>> = {}) {
  const onSelect = vi.fn();
  const utils = render(
    <FileTrigger onSelect={onSelect} {...props}>
      <button type="button">Choose images</button>
    </FileTrigger>,
  );
  const input = utils.container.querySelector('input[type="file"]') as HTMLInputElement;
  return { ...utils, onSelect, input };
}

describe('FileTrigger', () => {
  it('renders the child button and its label', () => {
    const { input } = renderFileTrigger();
    expect(screen.getByRole('button', { name: 'Choose images' })).toBeTruthy();
    expect(input.tabIndex).toBe(-1);
    expect(input.getAttribute('aria-hidden')).toBe('true');
    expect(input.className).toContain('visually-hidden');
  });

  it('opens the file picker when the button is activated', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    renderFileTrigger();
    await userEvent.click(screen.getByRole('button', { name: 'Choose images' }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('calls onSelect with the chosen files', () => {
    const { onSelect, input } = renderFileTrigger();
    const file = new File(['pixels'], 'photo.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith([file]);
  });

  it('calls onSelect again when the same file is chosen twice', () => {
    const { onSelect, input } = renderFileTrigger();
    const file = new File(['pixels'], 'photo.png', { type: 'image/png' });
    let stored = 'C:\\fakepath\\photo.png';
    const assignments: string[] = [];
    Object.defineProperty(input, 'value', {
      configurable: true,
      get: () => stored,
      set: (value: string) => {
        assignments.push(value);
        stored = String(value);
      },
    });

    fireEvent.change(input, { target: { files: [file] } });
    expect(onSelect).toHaveBeenNthCalledWith(1, [file]);
    expect(assignments).toContain('');
    expect(stored).toBe('');

    fireEvent.change(input, { target: { files: [file] } });
    expect(onSelect).toHaveBeenNthCalledWith(2, [file]);
    expect(onSelect).toHaveBeenCalledTimes(2);
  });

  it('opens the picker from a Button', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    render(
      <FileTrigger onSelect={vi.fn()}>
        <Button>Choose images</Button>
      </FileTrigger>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Choose images' }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('does not open the picker when the child click is cancelled', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });
    render(
      <FileTrigger onSelect={vi.fn()}>
        <button type="button" onClick={onClick}>
          Choose images
        </button>
      </FileTrigger>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Choose images' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('disables a Button and does not open the picker', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    render(
      <FileTrigger onSelect={vi.fn()} disabled>
        <Button>Choose images</Button>
      </FileTrigger>,
    );
    const button = screen.getByRole('button', { name: 'Choose images' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('does not open the picker when disabled', () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    renderFileTrigger({ disabled: true });
    const button = screen.getByRole('button', { name: 'Choose images' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
