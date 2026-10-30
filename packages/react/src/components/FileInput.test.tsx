import type { ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { FileInput } from './FileInput';

function createFile(name: string, size: number, type = 'text/plain'): File {
  const file = new File(['contents'], name, { type });
  Object.defineProperty(file, 'size', { value: size, configurable: true });
  return file;
}

function renderFileInput(props: Partial<ComponentProps<typeof FileInput>> = {}) {
  const onChange = vi.fn();
  const utils = render(
    <IconProvider icons={{}}>
      <FileInput label="Resume" value={null} onValueChange={onChange} {...props} />
    </IconProvider>,
  );
  const input = utils.container.querySelector('input[type="file"]') as HTMLInputElement;
  return { ...utils, onChange, input };
}

describe('FileInput', () => {
  it('renders the label', () => {
    renderFileInput();
    expect(screen.getByText('Resume')).toBeTruthy();
  });

  it('opens the file picker on dropzone click', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    renderFileInput();
    await userEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('opens the file picker on Enter', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    renderFileInput();
    const dropzone = screen.getByRole('button', { name: 'Resume' });
    dropzone.focus();
    await userEvent.keyboard('{Enter}');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    clickSpy.mockRestore();
  });

  it('calls onChange with a valid selected file', () => {
    const { onChange, input } = renderFileInput({ maxSize: 1024 });
    const file = createFile('resume.txt', 100);
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('rejects an oversized file without calling onChange', () => {
    const { onChange, input } = renderFileInput({ maxSize: 1024 });
    const file = createFile('huge.txt', 2048);
    fireEvent.change(input, { target: { files: [file] } });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/exceeds the maximum size/i);
  });

  it('accepts a dropped file via drag-and-drop', () => {
    const { onChange } = renderFileInput({ maxSize: 1024 });
    const file = createFile('resume.txt', 100);
    const dropzone = screen.getByRole('button', { name: 'Resume' });
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('clears the selection without reopening the picker', async () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});
    const file = createFile('resume.txt', 100);
    const { onChange } = renderFileInput({ value: file });
    await userEvent.click(screen.getByRole('button', { name: 'Clear Resume' }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(clickSpy).not.toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});

describe('FileInput form wiring and structure', () => {
  it('puts name on the native file input', () => {
    const { input } = renderFileInput({ name: 'resume' });
    expect(input.name).toBe('resume');
  });

  it('does not nest the clear button inside the role=button dropzone', () => {
    renderFileInput({ value: createFile('cv.pdf', 10) });
    const clear = screen.getByRole('button', { name: 'Clear Resume' });
    expect(clear.closest('[role="button"]:not(button)')).toBeNull();
  });
});
