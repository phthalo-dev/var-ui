import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import { OverlayTrigger } from './OverlayTrigger';

const root = (open: boolean) => ({ setTriggerEl: () => {}, popupId: 'pop-1', open });

describe('OverlayTrigger relation', () => {
  it('popovertarget: native invoker attributes on the child', () => {
    render(
      <OverlayTrigger root={root(false)} relation="popovertarget">
        <button type="button">go</button>
      </OverlayTrigger>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('popovertarget')).toBe('pop-1');
    expect(button.getAttribute('popovertargetaction')).toBe('toggle');
  });

  it('describedby / details: only while open, merged with the child ids', () => {
    const { rerender } = render(
      <OverlayTrigger root={root(false)} relation="describedby">
        <button type="button" aria-describedby="own">
          go
        </button>
      </OverlayTrigger>,
    );
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe('own');
    rerender(
      <OverlayTrigger root={root(true)} relation="describedby">
        <button type="button" aria-describedby="own">
          go
        </button>
      </OverlayTrigger>,
    );
    expect(screen.getByRole('button').getAttribute('aria-describedby')).toBe('own pop-1');
    rerender(
      <OverlayTrigger root={root(true)} relation="details">
        <button type="button">go</button>
      </OverlayTrigger>,
    );
    expect(screen.getByRole('button').getAttribute('aria-details')).toBe('pop-1');
  });

  it('without a relation nothing native is added (Dialog trigger behaviour is unchanged)', () => {
    render(
      <OverlayTrigger root={root(true)}>
        <button type="button">go</button>
      </OverlayTrigger>,
    );
    const button = screen.getByRole('button');
    expect(button.hasAttribute('popovertarget')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
  });
});
