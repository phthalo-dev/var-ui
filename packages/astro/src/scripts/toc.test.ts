import { describe, expect, it } from 'vite-plus/test';
import {
  collectArticleHeadings,
  pickActiveHeadingByPosition,
  resolveActiveHeading,
} from '@var-ui/core/components/toc/spy';
import { setActive } from './toc';

describe('collectArticleHeadings', () => {
  it('collects h2 and h3 headings with ids in document order', () => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h1>Title</h1>
      <h2 id="examples">Examples</h2>
      <h3 id="default">Default</h3>
      <h2 id="props">Props</h2>
      <h3>Ignored without id</h3>
    `;

    expect(collectArticleHeadings(article)).toEqual([
      { id: 'examples', text: 'Examples', level: 2 },
      { id: 'default', text: 'Default', level: 3 },
      { id: 'props', text: 'Props', level: 2 },
    ]);
  });
});

describe('resolveActiveHeading', () => {
  it('falls back to scroll position when nothing is intersecting', () => {
    const container = document.createElement('div');
    document.body.append(container);

    const first = document.createElement('h2');
    first.id = 'examples';
    first.getBoundingClientRect = () => ({ top: 40 }) as DOMRect;

    const second = document.createElement('h2');
    second.id = 'props';
    second.getBoundingClientRect = () => ({ top: 200 }) as DOMRect;

    container.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;
    document.body.append(first, second);

    const intersecting = new Map([
      ['examples', false],
      ['props', false],
    ]);

    expect(resolveActiveHeading(['examples', 'props'], intersecting, container)).toBe('examples');

    first.remove();
    second.remove();
    container.remove();
  });
});

describe('pickActiveHeadingByPosition', () => {
  it('returns the last heading above the active line', () => {
    const container = document.createElement('div');
    document.body.append(container);

    const first = document.createElement('h2');
    first.id = 'one';
    first.getBoundingClientRect = () => ({ top: 20 }) as DOMRect;

    const second = document.createElement('h2');
    second.id = 'two';
    second.getBoundingClientRect = () => ({ top: 60 }) as DOMRect;

    const third = document.createElement('h2');
    third.id = 'three';
    third.getBoundingClientRect = () => ({ top: 140 }) as DOMRect;

    document.body.append(first, second, third);
    container.getBoundingClientRect = () => ({ top: 0 }) as DOMRect;

    expect(pickActiveHeadingByPosition(['one', 'two', 'three'], container, 80)).toBe('two');

    first.remove();
    second.remove();
    third.remove();
    container.remove();
  });
});

describe('setActive', () => {
  it('marks only the matching link with data-selected', () => {
    const list = document.createElement('ol');
    list.innerHTML = `
      <li><a href="#one" data-toc-link="one">One</a></li>
      <li><a href="#two" data-toc-link="two">Two</a></li>
    `;

    setActive(list, 'two');

    const links = [...list.querySelectorAll<HTMLAnchorElement>('a')];
    expect(links[0].hasAttribute('data-selected')).toBe(false);
    expect(links[0].getAttribute('data-selected')).toBeNull();
    expect(links[1].hasAttribute('data-selected')).toBe(true);
    expect(links[1].getAttribute('data-selected')).toBe('');
  });

  it('clears data-selected when no id is active', () => {
    const list = document.createElement('ol');
    list.innerHTML = `
      <li><a href="#one" data-toc-link="one" data-selected="">One</a></li>
    `;

    setActive(list, null);

    const link = list.querySelector<HTMLAnchorElement>('a')!;
    expect(link.hasAttribute('data-selected')).toBe(false);
    expect(link.getAttribute('data-selected')).not.toBe('undefined');
  });
});
