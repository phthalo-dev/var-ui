import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { LayerProvider } from '../layers/LayerProvider';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { SegmentedControl } from './SegmentedControl';
import { Menu } from './Menu';
import { NumberInput } from './NumberInput';
import { Slider } from './Slider';

const icons = {
  close: <span data-testid="close-icon" />,
  moreHorizontal: <span data-testid="more-icon" />,
  check: <span data-testid="check-icon" />,
};

function wrap(ui: ReactNode) {
  return render(
    <IconProvider icons={icons}>
      <LayerProvider>{ui}</LayerProvider>
    </IconProvider>,
  );
}

describe('IconButton', () => {
  it('renders an icon-only button with layout attrs', () => {
    wrap(<IconButton icon="close" aria-label="Close" />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button.className).toContain('var-ui-button');
    expect(button.getAttribute('data-layout')).toBe('icon');
    expect(screen.getByTestId('close-icon')).toBeTruthy();
  });

  it('forwards data-mirror to the inner icon, not the button', () => {
    wrap(<IconButton icon="close" aria-label="Close" data-mirror />);
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button.hasAttribute('data-mirror')).toBe(false);
    expect(button.querySelector('[data-mirror]')).toBeTruthy();
  });
});

describe('ButtonGroup', () => {
  it('groups adjacent buttons', () => {
    wrap(
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group').className).toContain('var-ui-button-group');
  });
});

describe('SegmentedControl', () => {
  it('renders toggle segments', () => {
    wrap(
      <SegmentedControl
        defaultValue="list"
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ]}
      />,
    );
    expect(screen.getByRole('radiogroup')).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'List' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeTruthy();
  });
});

describe('Menu.FromSections', () => {
  it('opens menu items from the trigger', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    wrap(
      <Menu.FromSections
        trigger={<Button>Actions</Button>}
        sections={[{ items: [{ id: 'edit', label: 'Edit', onAction }] }]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('menuitem', { name: 'Edit' })).toBeTruthy();
  });
});

describe('Slider', () => {
  it('renders a slider with label and output', () => {
    wrap(<Slider label="Volume" defaultValue={40} />);
    expect(screen.getByText('Volume')).toBeTruthy();
    expect(screen.getByRole('slider')).toBeTruthy();
  });
});

describe('NumberInput', () => {
  it('renders stepper buttons', () => {
    wrap(<NumberInput label="Count" defaultValue={3} />);
    expect(screen.getByRole('textbox', { name: 'Count' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Increase Count' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Decrease Count' })).toBeTruthy();
  });
});
