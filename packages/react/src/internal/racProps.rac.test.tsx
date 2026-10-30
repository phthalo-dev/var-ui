/**
 * Feasibility record: what react-aria-components lets a native handler reach.
 * These tests document which public-vocabulary promises hold per RAC base component.
 */
import { describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as R from 'react-aria-components';

describe('onClick on RAC press components (no adapter needed)', () => {
  it('Button fires onClick once for mouse, Enter and Space', async () => {
    const onClick = vi.fn();
    render(<R.Button {...({ onClick } as object)}>b</R.Button>);
    const u = userEvent.setup();
    await u.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    await u.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(2);
    await u.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('a disabled Button does not fire onClick', async () => {
    const onClick = vi.fn();
    render(
      <R.Button isDisabled {...({ onClick } as object)}>
        b
      </R.Button>,
    );
    await userEvent.setup().click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('Link and ToggleButton forward onClick', async () => {
    const a = vi.fn();
    const b = vi.fn();
    render(
      <>
        <R.Link href="#x" {...({ onClick: a } as object)}>
          l
        </R.Link>
        <R.ToggleButton {...({ onClick: b } as object)}>t</R.ToggleButton>
      </>,
    );
    const u = userEvent.setup();
    await u.click(screen.getByRole('link'));
    await u.click(screen.getByRole('button'));
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });
});

describe('native onChange on the RAC <Input> (feasible)', () => {
  it('TextField: the input gets the DOM change event and RAC still gets the value', () => {
    const native = vi.fn();
    const value = vi.fn();
    render(
      <R.TextField onChange={value}>
        <R.Input onChange={native} aria-label="a" />
      </R.TextField>,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
    expect(native).toHaveBeenCalledTimes(1);
    expect(native.mock.calls[0][0].type).toBe('change');
    expect(value).toHaveBeenCalledWith('x');
  });

  it('NumberField, SearchField and ComboBox inputs accept native onChange too', () => {
    const n = vi.fn();
    const s = vi.fn();
    const c = vi.fn();
    render(
      <>
        <R.NumberField aria-label="n">
          <R.Input onChange={n} />
        </R.NumberField>
        <R.SearchField aria-label="s">
          <R.Input onChange={s} />
        </R.SearchField>
        <R.ComboBox aria-label="c">
          <R.Input onChange={c} />
          <R.Popover>
            <R.ListBox>
              <R.ListBoxItem id="a">a</R.ListBoxItem>
            </R.ListBox>
          </R.Popover>
        </R.ComboBox>
      </>,
    );
    fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: '5' } });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'x' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'y' } });
    expect(n).toHaveBeenCalledTimes(1);
    expect(s).toHaveBeenCalledTimes(1);
    expect(c).toHaveBeenCalledTimes(1);
  });
});

describe('native onChange on Checkbox/Switch (only via capture on the root label)', () => {
  it('bubble-phase onChange on the label never fires: react-aria stops propagation', async () => {
    const bubble = vi.fn();
    const capture = vi.fn();
    render(
      <R.Checkbox
        render={
          ((p: object) => <label {...p} onChange={bubble} onChangeCapture={capture} />) as never
        }
      >
        c
      </R.Checkbox>,
    );
    await userEvent.setup().click(screen.getByRole('checkbox'));
    expect(bubble).not.toHaveBeenCalled();
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls[0][0].target.tagName).toBe('INPUT');
  });
});
