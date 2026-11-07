import type { DemoSnippets } from '../../types';

export const snippets = {
  react: `import { Card, Carousel } from '@var-ui/react';

<Carousel label="Featured themes" itemWidth="13.75rem">
  <Card title="Default">Scroll-snap slide.</Card>
  <Card title="Forest">Scroll-snap slide.</Card>
  <Card title="Rose">Scroll-snap slide.</Card>
</Carousel>`,
  astro: `---
// No @var-ui/astro Carousel — use core recipe markup (scroll-snap; controls are decorative).
import { card, carousel } from '@var-ui/core';

const s = carousel();
const c = card();
const slides = [
  { title: 'Default', body: 'Scroll-snap slide.' },
  { title: 'Forest', body: 'Scroll-snap slide.' },
  { title: 'Rose', body: 'Scroll-snap slide.' },
];
---

<section class:list={[s.root]} role="region" aria-label="Featured themes">
  <div class:list={[s.viewport]} data-carousel-viewport tabindex="0" style="grid-auto-columns: 13.75rem">
    {slides.map((slide) => (
      <div class:list={[s.item]} data-carousel-item>
        <div class:list={[c.root]}>
          <h3 class:list={[c.title]}>{slide.title}</h3>
          <div class:list={[c.body]}>{slide.body}</div>
        </div>
      </div>
    ))}
  </div>
  <div class:list={[s.controls]}>
    <button type="button" class:list={[s.control]} aria-label="Previous" disabled>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
        <path d="M15 6l-6 6 6 6"></path>
      </svg>
    </button>
    <button type="button" class:list={[s.control]} aria-label="Next" disabled>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
        <path d="M9 6l6 6-6 6"></path>
      </svg>
    </button>
  </div>
</section>`,
  html: `<section class="var-ui-carousel" role="region" aria-label="Featured themes"><div class="var-ui-carousel__viewport" data-carousel-viewport tabindex="0" style="grid-auto-columns: 13.75rem"><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Default</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Forest</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div><div class="var-ui-carousel__item" data-carousel-item><div class="var-ui-card"><h3 class="var-ui-card__title">Rose</h3><div class="var-ui-card__body">Scroll-snap slide.</div></div></div></div><div class="var-ui-carousel__controls"><button type="button" class="var-ui-carousel__control" aria-label="Previous" disabled><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M15 6l-6 6 6 6"></path></svg></button><button type="button" class="var-ui-carousel__control" aria-label="Next" disabled><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor"><path d="M9 6l6 6-6 6"></path></svg></button></div></section>`,
} satisfies DemoSnippets;
