import { describe, expect, it, vi } from 'vite-plus/test';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Chip, ChipGroup, Pill } from './Chip';

function wrap(ui: React.ReactNode) {
  return render(<IconProvider icons={{}}>{ui}</IconProvider>);
}

describe('Chip', () => {
  it('renders static label text', () => {
    wrap(<Chip tone="accent">Beta</Chip>);
    expect(screen.getByText('Beta')).toBeTruthy();
  });

  it('toggles selection state', async () => {
    const onChange = vi.fn();
    wrap(
      <Chip selected={false} onSelectedChange={onChange}>
        React
      </Chip>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onRemove from a removable chip', async () => {
    const onRemove = vi.fn();
    wrap(<Chip onRemove={onRemove}>TypeScript</Chip>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe('Pill', () => {
  it('requires and wires onRemove', async () => {
    const onRemove = vi.fn();
    wrap(<Pill onRemove={onRemove}>Documentation</Pill>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalled();
  });
});

describe('ChipGroup', () => {
  it('selects multiple chips in multiple mode', async () => {
    function Demo() {
      const [values, setValues] = useState<string[]>(['react']);
      return (
        <ChipGroup multiple value={values} onValueChange={setValues} aria-label="Frameworks">
          <Chip value="react">React</Chip>
          <Chip value="vue">Vue</Chip>
        </ChipGroup>
      );
    }
    wrap(<Demo />);
    expect(screen.getByRole('button', { name: 'React' }).getAttribute('aria-pressed')).toBe('true');
    await userEvent.click(screen.getByRole('button', { name: 'Vue' }));
    expect(screen.getByRole('button', { name: 'Vue' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'React' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('allows only one selection in single mode', async () => {
    function Demo() {
      const [value, setValue] = useState<string | null>('react');
      return (
        <ChipGroup value={value} onValueChange={setValue} aria-label="Frameworks">
          <Chip value="react">React</Chip>
          <Chip value="vue">Vue</Chip>
        </ChipGroup>
      );
    }
    wrap(<Demo />);
    await userEvent.click(screen.getByRole('radio', { name: 'Vue' }));
    expect(screen.getByRole('radio', { name: 'Vue' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'React' }).getAttribute('aria-checked')).toBe('false');
  });

  it('renders from options', () => {
    wrap(
      <ChipGroup
        multiple
        options={[
          { value: 'docs', label: 'Docs' },
          { value: 'api', label: 'API' },
        ]}
        aria-label="Sections"
      />,
    );
    expect(screen.getByRole('button', { name: 'Docs' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'API' })).toBeTruthy();
  });

  it('throws when Chip has value outside ChipGroup', () => {
    expect(() => wrap(<Chip value="solo">Solo</Chip>)).toThrow(/ChipGroup/);
  });
});

describe('Chip nesting', () => {
  it('renders the remove control as a sibling of a toggle chip button', async () => {
    const onRemove = vi.fn();
    const { container } = wrap(
      <Chip selected={false} onSelectedChange={() => {}} onRemove={onRemove}>
        React
      </Chip>,
    );
    for (const button of container.querySelectorAll('button')) {
      expect(button.querySelector('button')).toBeNull();
    }
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('removes a toggle chip with Delete', async () => {
    const onRemove = vi.fn();
    wrap(
      <Chip selected={false} onSelectedChange={() => {}} onRemove={onRemove}>
        React
      </Chip>,
    );
    screen.getByRole('button', { name: 'React' }).focus();
    await userEvent.keyboard('{Delete}');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
