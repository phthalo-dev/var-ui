import { createRef } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Rating } from './Rating';

const radios = () => screen.getAllByRole('radio') as HTMLInputElement[];

describe('Rating (input)', () => {
  it('renders max radios in a radiogroup named by the label', () => {
    render(<Rating label="Quality" max={4} />);
    const group = screen.getByRole('radiogroup', { name: 'Quality' });
    expect(group).toBeTruthy();
    expect(radios()).toHaveLength(4);
    expect(radios()[1]?.getAttribute('aria-label')).toBe('2 of 4');
    expect(new Set(radios().map((r) => r.name)).size).toBe(1);
  });

  it('merges className/style onto the root and forwards native props to the radios', () => {
    const { container } = render(
      <Rating className="custom" style={{ color: 'red' }} name="q" form="f" data-x="1" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('var-ui-rating');
    expect(root.className).toContain('custom');
    expect(root.style.color).toBe('red');
    for (const r of radios()) {
      expect(r.name).toBe('q');
      expect(r.getAttribute('form')).toBe('f');
      expect(r.getAttribute('data-x')).toBe('1');
    }
  });

  it('points ref at the first radio', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Rating ref={ref} />);
    expect(ref.current).toBe(radios()[0]);
  });

  it('does not post a generated field name without name', () => {
    render(<Rating />);
    expect(radios()[0]?.getAttribute('form')).toBe('');
  });

  it('is uncontrolled with defaultValue and reports onValueChange and native onChange', async () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(<Rating defaultValue={2} onValueChange={onValueChange} onChange={onChange} />);
    expect(radios()[1]?.checked).toBe(true);
    await userEvent.click(radios()[3]!);
    expect(radios()[3]?.checked).toBe(true);
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0].target).toBe(radios()[3]);
  });

  it('is controlled: the value prop wins until the parent updates it', async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Rating value={1} onValueChange={onValueChange} />);
    await userEvent.click(radios()[2]!);
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(radios()[0]?.checked).toBe(true);
    rerender(<Rating value={3} onValueChange={onValueChange} />);
    expect(radios()[2]?.checked).toBe(true);
  });

  it('marks filled items up to the value and checks none for 0', () => {
    const { rerender } = render(<Rating value={3} />);
    const items = () => radios().map((r) => r.closest('label')!);
    expect(items().map((i) => i.hasAttribute('data-filled'))).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
    rerender(<Rating value={0} />);
    expect(radios().some((r) => r.checked)).toBe(false);
  });

  it('rounds fractions when interactive', () => {
    render(<Rating value={2.6} />);
    expect(radios()[2]?.checked).toBe(true);
  });

  it('clears to 0 when clearable and the current value is clicked', async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={3} clearable onValueChange={onValueChange} />);
    await userEvent.click(radios()[2]!);
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(radios().some((r) => r.checked)).toBe(false);
  });

  it('does not clear without clearable', async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={3} onValueChange={onValueChange} />);
    await userEvent.click(radios()[2]!);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(radios()[2]?.checked).toBe(true);
  });

  it('disables every radio', async () => {
    const onValueChange = vi.fn();
    const { container } = render(<Rating disabled onValueChange={onValueChange} />);
    expect(radios().every((r) => r.disabled)).toBe(true);
    expect((container.firstElementChild as HTMLElement).hasAttribute('data-disabled')).toBe(true);
    await userEvent.click(radios()[1]!);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('forwards required to the radios and aria-required to the group', () => {
    render(<Rating required label="Q" />);
    expect(radios().every((r) => r.required)).toBe(true);
    expect(screen.getByRole('radiogroup').getAttribute('aria-required')).toBe('true');
  });

  it('wires description and error ids into aria-describedby and sets invalid', () => {
    render(<Rating label="Q" description="Pick one" errorMessage="Required" />);
    const group = screen.getByRole('radiogroup');
    const ids = group.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0]!)?.textContent).toBe('Pick one');
    expect(document.getElementById(ids[1]!)?.textContent).toBe('Required');
    expect(group.getAttribute('aria-invalid')).toBe('true');
  });

  it('lets getItemLabel replace the default English names', () => {
    render(<Rating max={2} getItemLabel={(n) => `Étoile ${n}`} />);
    expect(screen.getByRole('radio', { name: 'Étoile 2' })).toBeTruthy();
  });

  it('renders a built-in star, a registry glyph, or a custom node', () => {
    const { container, rerender } = render(<Rating max={1} />);
    expect(container.querySelector('svg path')).not.toBeNull();
    rerender(
      <IconProvider icons={{ star: <i data-testid="reg" /> }}>
        <Rating max={1} />
      </IconProvider>,
    );
    expect(screen.getAllByTestId('reg').length).toBeGreaterThan(0);
    rerender(
      <Rating max={1} icon={<b data-testid="custom" />} emptyIcon={<u data-testid="e" />} />,
    );
    expect(screen.getByTestId('custom')).toBeTruthy();
    expect(screen.getByTestId('e')).toBeTruthy();
  });

  it('applies the size and tone axes as recipe data hooks', () => {
    const { container } = render(<Rating size="lg" tone="success" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.size).toBe('lg');
    expect(root.dataset.tone).toBe('success');
  });
});

describe('Rating (readOnly)', () => {
  it('renders a non-interactive img with an aria-label and no radios', () => {
    render(<Rating readOnly value={3} />);
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByRole('img', { name: '3 out of 5' })).toBeTruthy();
  });

  it('overrides the accessible name and keeps the visible label', () => {
    render(<Rating readOnly value={4} label="Reviews" getValueLabel={(v, m) => `${v}/${m}`} />);
    expect(screen.getByRole('img', { name: 'Reviews 4/5' })).toBeTruthy();
  });

  it('shows a fractional value as a partly filled item through the fill var', () => {
    const { container } = render(<Rating readOnly value={3.5} />);
    const items = [...container.querySelectorAll<HTMLElement>('[data-readonly][aria-hidden]')];
    expect(items.map((i) => i.hasAttribute('data-filled'))).toEqual([
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(items[3]?.getAttribute('style')).toMatch(/50%/);
    expect(items[4]?.getAttribute('style')).toBeNull();
  });

  it('still submits its value through a hidden input when named', () => {
    const { container } = render(<Rating readOnly value={2} name="stars" />);
    const hidden = container.querySelector<HTMLInputElement>('input[type="hidden"]');
    expect(hidden?.name).toBe('stars');
    expect(hidden?.value).toBe('2');
  });
});
