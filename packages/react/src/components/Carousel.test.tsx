import { describe, expect, it, vi } from 'vite-plus/test';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProvider } from '../icons';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('renders a labelled region with snap items and controls', () => {
    render(
      <IconProvider icons={{}}>
        <Carousel label="Featured">
          <div>one</div>
          <div>two</div>
        </Carousel>
      </IconProvider>,
    );
    expect(screen.getByRole('region', { name: 'Featured' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
  });

  it('scrolls the viewport on next', async () => {
    render(
      <IconProvider icons={{}}>
        <Carousel label="Featured">
          <div>one</div>
        </Carousel>
      </IconProvider>,
    );
    const viewport = screen
      .getByRole('region', { name: 'Featured' })
      .querySelector('[data-carousel-viewport]') as HTMLElement;
    const scrollBy = vi.fn();
    viewport.scrollBy = scrollBy;
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(scrollBy).toHaveBeenCalled();
  });

  it('exposes carousel and slide semantics', () => {
    render(
      <IconProvider icons={{}}>
        <Carousel label="Featured">
          <div>one</div>
          <div>two</div>
        </Carousel>
      </IconProvider>,
    );
    const region = screen.getByRole('region', { name: 'Featured' });
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    expect(screen.getByRole('group', { name: 'Featured' })).toBeTruthy();
    const slide = screen.getByRole('group', { name: '2 of 2' });
    expect(slide.getAttribute('aria-roledescription')).toBe('slide');
  });

  it('allows overriding slide and viewport labels', () => {
    render(
      <IconProvider icons={{}}>
        <Carousel
          label="Featured"
          viewportLabel="Slides"
          getSlideLabel={(i, n) => `Diapositiva ${i} de ${n}`}
        >
          <div>one</div>
        </Carousel>
      </IconProvider>,
    );
    expect(screen.getByRole('group', { name: 'Slides' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Diapositiva 1 de 1' })).toBeTruthy();
  });
});
