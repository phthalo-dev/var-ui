import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { fireEvent, render, screen } from '@testing-library/react';
import { DateInput } from './DateInput';
import { DateRangeInput } from './DateRangeInput';
import { DateTimeInput } from './DateTimeInput';
import { TimeInput } from './TimeInput';
import { Calendar } from './Calendar';
import { ColorPicker } from './ColorPicker';
import { ColorSwatch } from './ColorSwatch';
import { FileInput } from './FileInput';
import { FileTrigger } from './FileTrigger';
import { Field } from './Field';
import { Form } from './Form';

describe('Date / time fields passthrough', () => {
  it.each([
    ['DateInput', (p: object) => <DateInput label="When" {...p} />],
    ['DateRangeInput', (p: object) => <DateRangeInput label="When" {...p} />],
    ['DateTimeInput', (p: object) => <DateTimeInput label="When" {...p} />],
    ['TimeInput', (p: object) => <TimeInput label="When" {...p} />],
  ])('%s: data-* and ref reach the segmented input, className the root', (_n, make) => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(make({ 'data-testid': 't', className: 'mine', ref }));
    const el = screen.getByTestId('t');
    expect(ref.current).toBe(el);
    expect(el.querySelector('[role="spinbutton"]')).toBeTruthy();
    expect(container.firstElementChild?.className).toContain('mine');
    expect(container.firstElementChild?.contains(el)).toBe(true);
    expect(container.firstElementChild).not.toBe(el);
  });

  it.each([
    ['DateInput', (p: object) => <DateInput label="When" {...p} />],
    ['DateRangeInput', (p: object) => <DateRangeInput label="When" {...p} />],
    ['DateTimeInput', (p: object) => <DateTimeInput label="When" {...p} />],
    ['TimeInput', (p: object) => <TimeInput label="When" {...p} />],
  ])('%s: errorMessage implies invalid and is described', (_n, make) => {
    render(make({ description: 'Hint', errorMessage: 'Bad' }));
    expect(screen.getByText('Bad')).toBeTruthy();
    expect(screen.getByText('Hint')).toBeTruthy();
    expect(document.querySelector('[data-invalid]')).toBeTruthy();
  });

  it('DateInput opens the shared popover calendar', async () => {
    render(<DateInput label="When" />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('grid')).toBeTruthy();
  });

  it('DateRangeInput opens a range calendar', async () => {
    render(<DateRangeInput label="When" />);
    fireEvent.click(screen.getByRole('button'));
    expect(await screen.findByRole('grid')).toBeTruthy();
  });
});

describe('Calendar passthrough', () => {
  it('merges className, forwards data-*, ref on root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Calendar aria-label="Day" data-testid="t" className="mine" ref={ref} />);
    const el = screen.getByTestId('t');
    expect(ref.current).toBe(el);
    expect(el.className).toContain('mine');
    expect(screen.getByRole('grid')).toBeTruthy();
  });
});

describe('ColorPicker / ColorSwatch passthrough', () => {
  it('ColorPicker spreads rest on the root, overridable labels, no dead attribute', () => {
    const ref = createRef<HTMLDivElement>();
    const onKeyDown = vi.fn();
    render(
      <ColorPicker
        data-testid="t"
        id="cp"
        className="mine"
        ref={ref}
        onKeyDown={onKeyDown}
        hueLabel="Tono"
        saturationLabel="Saturacion"
        swatchesLabel="Muestras"
        hueValueText={(d) => `${d} grados`}
      />,
    );
    const el = screen.getByTestId('t');
    expect(ref.current).toBe(el);
    expect(el.id).toBe('cp');
    expect(el.className).toContain('mine');
    expect(el.hasAttribute('data-var-ui-color-picker')).toBe(false);
    expect(screen.getByRole('slider', { name: 'Tono' }).getAttribute('aria-valuetext')).toMatch(
      /grados$/,
    );
    expect(screen.getByLabelText('Saturacion')).toBeTruthy();
    expect(screen.getByLabelText('Muestras')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Tono' }), { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('ColorSwatch passes attrs and ref to the button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ColorSwatch color="#f00" data-testid="t" className="mine" ref={ref} aria-label="red" />,
    );
    const el = screen.getByTestId('t');
    expect(ref.current).toBe(el);
    expect(el.className).toContain('mine');
  });
});

describe('FileInput passthrough', () => {
  it('sends attrs and ref to the native input, className/style to the root', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <FileInput
        label="Resume"
        value={null}
        onValueChange={() => {}}
        data-testid="t"
        name="resume"
        form="f"
        className="mine"
        style={{ color: 'red' }}
        ref={ref}
        chooseLabel="Elegir"
      />,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(ref.current).toBe(input);
    expect(input.name).toBe('resume');
    expect(input.getAttribute('form')).toBe('f');
    expect((container.firstElementChild as HTMLElement).className).toContain('mine');
    expect((container.firstElementChild as HTMLElement).style.color).toBe('red');
    expect(screen.getByText('Elegir')).toBeTruthy();
  });

  it('wires description and error into the dropzone and overridable strings', () => {
    render(
      <FileInput
        label="Resume"
        value={null}
        onValueChange={() => {}}
        description="Hint"
        errorMessage="Bad"
      />,
    );
    const zone = screen.getByRole('button');
    const ids = (zone.getAttribute('aria-describedby') ?? '').split(' ');
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual(['Hint', 'Bad']);
    expect(zone.getAttribute('aria-invalid')).toBe('true');
  });

  it('uses overridable validation messages', () => {
    const file = new File(['x'], 'a.txt', { type: 'text/plain' });
    render(
      <FileInput
        label="Img"
        value={null}
        onValueChange={() => {}}
        accept="image/*"
        invalidTypeMessage={(n) => `${n} no`}
        data-testid="t"
      />,
    );
    fireEvent.change(screen.getByTestId('t'), { target: { files: [file] } });
    expect(screen.getByText('a.txt no')).toBeTruthy();
  });

  describe('dropped files', () => {
    const original = (globalThis as { DataTransfer?: unknown }).DataTransfer;
    afterEach(() => {
      (globalThis as { DataTransfer?: unknown }).DataTransfer = original;
    });

    it('end up in the native input so FormData sees them', () => {
      // jsdom has no DataTransfer; a minimal stand-in whose `files` jsdom accepts.
      class FakeDataTransfer {
        private list: File[] = [];
        items = { add: (f: File) => this.list.push(f) };
        get files() {
          const list = this.list;
          return Object.assign([...list], {
            item: (i: number) => list[i] ?? null,
          }) as unknown as FileList;
        }
      }
      (globalThis as { DataTransfer?: unknown }).DataTransfer = FakeDataTransfer;
      const onChange = vi.fn();
      const file = new File(['hello'], 'dropped.txt', { type: 'text/plain' });
      const { container } = render(
        <FileInput label="Doc" name="doc" value={null} onValueChange={onChange} data-testid="t" />,
      );
      const input = screen.getByTestId('t') as HTMLInputElement;
      const assigned = vi.fn();
      Object.defineProperty(input, 'files', {
        configurable: true,
        get: () => undefined,
        set: assigned,
      });
      fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } });
      expect(onChange).toHaveBeenCalledWith(file);
      expect(assigned).toHaveBeenCalledTimes(1);
      expect(Array.from(assigned.mock.calls[0][0] as ArrayLike<File>)).toEqual([file]);
      expect(container.querySelector('input[type="file"]')).toBe(input);
    });

    it('does not throw when DataTransfer is unavailable', () => {
      (globalThis as { DataTransfer?: unknown }).DataTransfer = undefined;
      const onChange = vi.fn();
      const file = new File(['hello'], 'dropped.txt');
      render(<FileInput label="Doc" value={null} onValueChange={onChange} />);
      fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } });
      expect(onChange).toHaveBeenCalledWith(file);
    });
  });
});

describe('FileTrigger passthrough', () => {
  it('spreads rest and ref onto the hidden input', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <FileTrigger onSelect={() => {}} data-testid="t" name="up" ref={ref}>
        <button type="button">Pick</button>
      </FileTrigger>,
    );
    const input = screen.getByTestId('t') as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.name).toBe('up');
    expect(ref.current).toBe(input);
  });
});

describe('Field / Form passthrough', () => {
  it('Field spreads rest on the root and forwards name so Form errors reach it', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Form errors={{ email: 'Taken' }}>
        <Field label="Email" name="email" data-testid="t" className="mine" ref={ref}>
          <input />
        </Field>
      </Form>,
    );
    const root = screen.getByTestId('t');
    expect(ref.current).toBe(root);
    expect(root.className).toContain('mine');
    expect(root.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByRole('alert').textContent).toBe('Taken');
    expect((screen.getByLabelText('Email') as HTMLInputElement).name).toBe('email');
  });

  it('Field.Label / Description / Error accept native attributes', () => {
    render(
      <Field.Root>
        <Field.Label data-testid="l">L</Field.Label>
        <Field.Control>
          <input />
        </Field.Control>
        <Field.Description data-testid="d">D</Field.Description>
        <Field.Error data-testid="e" forceMount>
          E
        </Field.Error>
      </Field.Root>,
    );
    expect(screen.getByTestId('l').tagName).toBe('LABEL');
    expect(screen.getByTestId('d').tagName).toBe('P');
    expect(screen.getByTestId('e').tagName).toBe('P');
  });

  it('Form passes <form> attributes and ref', () => {
    const ref = createRef<HTMLFormElement>();
    const onReset = vi.fn();
    render(
      <Form data-testid="t" id="f" method="post" className="mine" ref={ref} onReset={onReset}>
        <button type="reset">r</button>
      </Form>,
    );
    const form = screen.getByTestId('t') as HTMLFormElement;
    expect(ref.current).toBe(form);
    expect(form.id).toBe('f');
    expect(form.className).toContain('mine');
    fireEvent.click(screen.getByText('r'));
    expect(onReset).toHaveBeenCalled();
  });

  it('Form routes a rejected async onSubmit to onError', async () => {
    const onError = vi.fn();
    const boom = new Error('x');
    render(
      <Form data-testid="t" onSubmit={() => Promise.reject(boom)} onError={onError}>
        <input name="a" />
      </Form>,
    );
    fireEvent.submit(screen.getByTestId('t'));
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(boom));
  });
});
