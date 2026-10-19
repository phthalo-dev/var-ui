import { describe, expect, it } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import { InputGroup, InputGroupInput } from './InputGroup';
import { InputGroupText } from './InputGroupText';

describe('InputGroup', () => {
  it('renders the label, description, and error message', () => {
    render(
      <InputGroup label="Price" description="In USD" errorMessage="Required">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByText('Price')).toBeTruthy();
    expect(screen.getByText('In USD')).toBeTruthy();
    expect(screen.getByText('Required')).toBeTruthy();
  });

  it('omits the description and error message when not provided', () => {
    render(
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.queryByText('In USD')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders InputGroupText and InputGroupInput children inside the group', () => {
    render(
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" defaultValue="10" />
      </InputGroup>,
    );
    expect(screen.getByText('$')).toBeTruthy();
    const input = screen.getByRole('textbox', { name: 'Price' });
    expect(input).toBeTruthy();
    expect(screen.getByRole('group').contains(input)).toBe(true);
  });

  it('associates the group with its label via aria-labelledby', () => {
    render(
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    const labelledBy = group.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    const labelEl = document.getElementById(labelledBy ?? '');
    expect(labelEl?.textContent).toBe('Price');
  });

  it('is not disabled by default', () => {
    render(
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    expect(group.hasAttribute('aria-disabled')).toBe(false);
    expect(group.hasAttribute('data-disabled')).toBe(false);
  });

  it('passes its size down to the group, input, and addon parts', () => {
    render(
      <InputGroup label="Price" size="lg">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByRole('group').getAttribute('data-size')).toBe('lg');
    expect(screen.getByRole('textbox', { name: 'Price' }).getAttribute('data-size')).toBe('lg');
    expect(screen.getByText('$').getAttribute('data-size')).toBe('lg');
  });

  it('uses the recipe default size when none is given', () => {
    render(
      <InputGroup label="Price">
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    expect(screen.getByRole('group').getAttribute('data-size')).toBe('md');
  });

  it('sets aria-disabled and data-disabled when isDisabled is true', () => {
    render(
      <InputGroup label="Price" isDisabled>
        <InputGroupText>$</InputGroupText>
        <InputGroupInput aria-label="Price" />
      </InputGroup>,
    );
    const group = screen.getByRole('group');
    expect(group.getAttribute('aria-disabled')).toBe('true');
    expect(group.getAttribute('data-disabled')).toBe('true');
  });
});

describe('InputGroupText', () => {
  it('renders its children as static (non-focusable) text', () => {
    render(<InputGroupText>%</InputGroupText>);
    const el = screen.getByText('%');
    expect(el.tagName).toBe('DIV');
  });

  it('merges an additional className', () => {
    render(<InputGroupText className="custom">%</InputGroupText>);
    expect(screen.getByText('%').className).toContain('custom');
  });
});

describe('InputGroupInput', () => {
  it('renders a plain input and forwards props', () => {
    render(<InputGroupInput aria-label="Amount" placeholder="0.00" />);
    const input = screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement;
    expect(input.placeholder).toBe('0.00');
  });

  it('merges an additional className', () => {
    render(<InputGroupInput aria-label="Amount" className="custom" />);
    const input = screen.getByRole('textbox', { name: 'Amount' });
    expect(input.className).toContain('custom');
  });
});
