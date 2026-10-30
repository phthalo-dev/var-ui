import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableText } from './EditableText';
import { Heading } from './Typography';

function setup(props: Partial<Parameters<typeof EditableText>[0]> = {}) {
  const onCommit = vi.fn();
  const onCancel = vi.fn();
  const onChange = vi.fn();
  render(
    <EditableText
      value="Road trip"
      onCommit={onCommit}
      onCancel={onCancel}
      onValueChange={onChange}
      aria-label="Playlist name"
      {...props}
    >
      <Heading level={1}>Road trip</Heading>
    </EditableText>,
  );
  return { onCommit, onCancel, onChange };
}

describe('EditableText', () => {
  it('renders the display child and no input initially', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Road trip' })).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('starts editing on double click and selects the text', async () => {
    setup();
    await userEvent.dblClick(screen.getByRole('heading'));
    const input = screen.getByRole<HTMLInputElement>('textbox', { name: 'Playlist name' });
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('Road trip');
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe('Road trip'.length);
  });

  it('does not start editing on a single click by default', async () => {
    setup();
    await userEvent.click(screen.getByRole('heading'));
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('starts editing on a single click when activation is "click"', async () => {
    setup({ activation: 'click' });
    await userEvent.click(screen.getByRole('heading'));
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('starts editing on focus when activation is "focus"', async () => {
    setup({ activation: 'focus' });
    await userEvent.tab();
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it.each(['{Enter}', '{F2}'])('starts editing with %s from the keyboard', async (key) => {
    setup();
    await userEvent.tab();
    await userEvent.keyboard(key);
    expect(screen.getByRole('textbox')).toBeTruthy();
  });

  it('commits the new value on Enter and returns focus to the display', async () => {
    const { onCommit, onChange } = setup();
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.keyboard('Summer{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('Summer');
    expect(onCommit).toHaveBeenCalledExactlyOnceWith('Summer');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(document.activeElement?.contains(screen.getByRole('heading'))).toBe(true);
  });

  it('commits on blur without stealing focus back', async () => {
    const { onCommit } = setup();
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.keyboard('Summer');
    await userEvent.click(document.body);
    expect(onCommit).toHaveBeenCalledExactlyOnceWith('Summer');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(document.activeElement).toBe(document.body);
  });

  it('discards the draft on Escape', async () => {
    const { onCommit, onCancel } = setup();
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.keyboard('Summer{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Road trip' })).toBeTruthy();
  });

  it('skips onCommit when the value did not change', async () => {
    const { onCommit } = setup();
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.keyboard('{Enter}');
    expect(onCommit).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it.each([{ disabled: true }, { readOnly: true }])('does not edit when %o', async (props) => {
    setup(props);
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('does not let Escape reach ancestors while cancelling an edit', async () => {
    const onKeyDown = vi.fn();
    render(
      <div onKeyDown={onKeyDown}>
        <EditableText value="Road trip" onCommit={() => {}}>
          <Heading level={1}>Road trip</Heading>
        </EditableText>
      </div>,
    );
    await userEvent.dblClick(screen.getByRole('heading'));
    onKeyDown.mockClear();
    await userEvent.keyboard('{Escape}');
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  it('gives the input a non-empty accessible name when the value is empty', async () => {
    render(
      <EditableText value="" onCommit={() => {}} activation="click">
        <Heading level={1}>Untitled</Heading>
      </EditableText>,
    );
    await userEvent.click(screen.getByRole('heading'));
    expect(screen.getByRole('textbox', { name: 'Edit text' })).toBeTruthy();
  });

  it('ends the edit without committing when it becomes disabled', async () => {
    const onCommit = vi.fn();
    const { rerender } = render(
      <EditableText value="Road trip" onCommit={onCommit}>
        <Heading level={1}>Road trip</Heading>
      </EditableText>,
    );
    await userEvent.dblClick(screen.getByRole('heading'));
    await userEvent.keyboard('Summer');
    rerender(
      <EditableText value="Road trip" onCommit={onCommit} disabled>
        <Heading level={1}>Road trip</Heading>
      </EditableText>,
    );
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(onCommit).not.toHaveBeenCalled();
    rerender(
      <EditableText value="Road trip" onCommit={onCommit}>
        <Heading level={1}>Road trip</Heading>
      </EditableText>,
    );
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <EditableText value="x" onCommit={() => {}} ref={ref}>
        <Heading level={2}>x</Heading>
      </EditableText>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
