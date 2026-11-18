import { describe, expect, it } from 'vite-plus/test';
import {
  commandMatchTier,
  commandMetaSnippet,
  rankCommandItems,
  scoreCommandItem,
} from './commandSearch';

describe('scoreCommandItem', () => {
  it('ranks exact > prefix > word-start > hump > substring > keyword > description', () => {
    expect(scoreCommandItem({ title: 'Button' }, 'button')).toBe(commandMatchTier.exactTitle);
    expect(scoreCommandItem({ title: 'Button group' }, 'but')).toBe(commandMatchTier.titlePrefix);
    expect(scoreCommandItem({ title: 'Icon button' }, 'but')).toBe(commandMatchTier.titleWordStart);
    expect(scoreCommandItem({ title: 'IconButton' }, 'but')).toBe(commandMatchTier.titleHump);
    expect(scoreCommandItem({ title: 'Rebuttal' }, 'but')).toBe(commandMatchTier.titleSubstring);
    expect(scoreCommandItem({ title: 'Toolbar', keywords: ['buttons'] }, 'but')).toBe(
      commandMatchTier.keyword,
    );
    expect(scoreCommandItem({ title: 'Overlay', meta: 'Buttons open it' }, 'but')).toBe(
      commandMatchTier.metaPrefix,
    );
    expect(scoreCommandItem({ title: 'Overlay', meta: 'Open on a button' }, 'but')).toBe(
      commandMatchTier.metaWordStart,
    );
    expect(scoreCommandItem({ title: 'Overlay', meta: 'Open on rebuttal' }, 'but')).toBe(
      commandMatchTier.meta,
    );
    expect(scoreCommandItem({ title: 'Overlay' }, 'but')).toBeNull();
    expect(scoreCommandItem({ title: 'Overlay' }, '  ')).toBe(0);
  });
});

describe('scoreCommandItem typo tolerance', () => {
  it('accepts one edit at the start of a title word for queries of 4+ characters', () => {
    expect(scoreCommandItem({ title: 'Button' }, 'buton')).toBe(commandMatchTier.titleTypoPrefix);
    expect(scoreCommandItem({ title: 'AlertDialog' }, 'dialgo')).toBe(commandMatchTier.titleTypo);
    expect(scoreCommandItem({ title: 'Color picker' }, 'colr')).toBe(
      commandMatchTier.titleTypoPrefix,
    );
    expect(scoreCommandItem({ title: 'Checkbox' }, 'chekc')).toBe(commandMatchTier.titleTypoPrefix);
    expect(scoreCommandItem({ title: 'Checkbox' }, 'cxekx')).toBeNull();
    // Too short to guess: three letters need an exact hit.
    expect(scoreCommandItem({ title: 'Tabs' }, 'tbs')).toBeNull();
  });
});

describe('rankCommandItems on docs-like data', () => {
  const docs = [
    { title: 'Button', meta: 'Triggers an action or event.', group: 'Components' },
    {
      title: 'ChatComposer',
      meta: 'Composer chrome around the message field.',
      group: 'Components',
    },
    { title: 'Combobox', meta: 'Text input primitive for autocompletes.', group: 'Components' },
    { title: 'Field', meta: 'Composable label, description and error.', group: 'Components' },
    { title: 'IconButton', meta: 'Icon-only button for compact toolbars.', group: 'Components' },
    { title: 'SearchInput', meta: 'Compact search field for toolbars.', group: 'Components' },
    { title: 'Tokenizer', meta: 'Token field for selecting multiple values.', group: 'Components' },
    { title: 'Overview', meta: 'Style var-ui with typed themes and tokens.', group: 'Theming' },
    {
      title: 'Design tokens',
      meta: 'Semantic tokens that power every component.',
      group: 'Theming',
    },
    { title: 'Themes', meta: 'Create and apply custom themes.', group: 'Theming' },
    { title: 'Theme editor', meta: 'Explore themes live.', group: 'Playground' },
  ];
  const titles = (query: string) => rankCommandItems(docs, query).map((item) => item.title);

  it('"comp": the title hit, then descriptions that start with it, mid-word matches last', () => {
    expect(titles('comp')).toEqual([
      'ChatComposer',
      'Field',
      'SearchInput',
      'IconButton',
      'Combobox',
      // Another group's description match comes after every hit in the leading group.
      'Design tokens',
    ]);
  });

  it('"tok": the title prefix first, then the word-start title, then descriptions', () => {
    expect(titles('tok')).toEqual(['Tokenizer', 'Design tokens', 'Overview']);
  });

  it('"theme": the title hits lead their groups', () => {
    const ranked = titles('theme');
    expect(ranked[0]).toBe('Themes');
    expect(ranked).toContain('Theme editor');
    expect(ranked.indexOf('Theme editor')).toBeGreaterThan(0);
  });

  it('falls back to one-typo title matches only when nothing matched as typed', () => {
    // The title-start typo (Button) before the later-word one (IconButton), whatever the order.
    expect(titles('buton')).toEqual(['Button', 'IconButton']);
    expect(rankCommandItems([...docs].reverse(), 'buton').map((item) => item.title)).toEqual([
      'Button',
      'IconButton',
    ]);
    expect(titles('butto')).toEqual(['Button', 'IconButton']);
  });
});

describe('section headings', () => {
  const page = {
    title: 'CSS variables',
    meta: 'Theme and style var-ui with custom properties.',
    headings: ['Naming', 'Light and dark mode'],
  };

  it('matches a heading word-start below the title and description prefix', () => {
    expect(scoreCommandItem(page, 'dark')).toBe(commandMatchTier.heading);
    expect(scoreCommandItem(page, 'light and')).toBe(commandMatchTier.heading);
    expect(scoreCommandItem(page, 'ark')).toBeNull();
    expect(commandMatchTier.heading).toBeLessThan(commandMatchTier.metaPrefix);
    expect(commandMatchTier.heading).toBeGreaterThan(commandMatchTier.metaWordStart);
  });

  it('shows the matched heading as the subtitle', () => {
    expect(commandMetaSnippet(page, 'dark')).toBe('Light and dark mode');
    // A title or description match keeps the description.
    expect(commandMetaSnippet(page, 'css')).toBe(page.meta);
  });
});

describe('rankCommandItems tie-breaks', () => {
  const items = [
    { title: 'Installation', meta: 'Package setup for React apps.', group: 'Docs' },
    {
      title: 'Carousel',
      meta: 'Horizontally scrollable content.',
      keywords: ['carousel'],
      group: 'Components',
    },
    { title: 'InputGroup', meta: 'Composes inputs with addons.', group: 'Components' },
    { title: 'PinInput', meta: 'One-time code entry.', group: 'Components' },
    { title: 'RadioGroup', meta: 'Single selection from a list.', group: 'Components' },
    { title: 'Select', meta: 'Dropdown single-select.', group: 'Components' },
    { title: 'MultiSelector', meta: 'Multi-select combobox.', group: 'Components' },
  ];
  const titles = (query: string) => rankCommandItems(items, query).map((item) => item.title);

  it('"inpt": one-typo ties prefer the longer correctly typed prefix (Input over Install)', () => {
    expect(titles('inpt')).toEqual(['InputGroup', 'PinInput', 'Installation']);
  });

  it('"sel": title word-starts, then description word-starts, then mid-word title hits', () => {
    expect(titles('sel')).toEqual(['Select', 'MultiSelector', 'RadioGroup', 'Carousel']);
  });

  it('ranks a mid-word title or keyword hit below a description word-start', () => {
    expect(scoreCommandItem({ title: 'Carousel' }, 'sel')).toBe(commandMatchTier.titleSubstring);
    expect(scoreCommandItem({ title: 'Slides', keywords: ['carousel'] }, 'sel')).toBe(
      commandMatchTier.titleSubstring,
    );
    expect(scoreCommandItem({ title: 'Slides', keywords: ['image carousel'] }, 'car')).toBe(
      commandMatchTier.keyword,
    );
    expect(commandMatchTier.titleSubstring).toBeLessThan(commandMatchTier.metaWordStart);
    expect(commandMatchTier.titleSubstring).toBeGreaterThan(commandMatchTier.meta);
  });
});

describe('rankCommandItems', () => {
  const items = [
    { title: 'Overlay lifecycle', meta: 'Open and close with a trigger button', group: 'Docs' },
    { title: 'Plain CSS', meta: 'Style a button without JS', group: 'Docs' },
    { title: 'Icon button', group: 'Components' },
    { title: 'Button', group: 'Components' },
    { title: 'Tabs', group: 'Components' },
  ];

  it('orders items within a group and groups by their best hit', () => {
    expect(rankCommandItems(items, 'but').map((item) => item.title)).toEqual([
      'Button',
      'Icon button',
      'Overlay lifecycle',
      'Plain CSS',
    ]);
  });

  it('keeps the original order for an empty query', () => {
    expect(rankCommandItems(items, '')).toEqual(items);
  });

  it('honors a custom match test, ranking unscored matches last', () => {
    const ranked = rankCommandItems(items, 'but', (item) => item.title !== 'Button');
    expect(ranked.map((item) => item.title)).toEqual([
      'Icon button',
      'Tabs',
      'Overlay lifecycle',
      'Plain CSS',
    ]);
  });
});

describe('commandMetaSnippet', () => {
  const meta = 'Opens, closes and restores focus for every dialog, popover and trigger button';

  it('cuts a description-only match to a snippet starting at a word', () => {
    const snippet = commandMetaSnippet({ title: 'Overlay lifecycle', meta }, 'butt');
    expect(snippet?.startsWith('…')).toBe(true);
    expect(snippet).toContain('trigger button');
    expect(meta.endsWith(snippet!.slice(1))).toBe(true);
    expect(snippet!.slice(1, 2)).toMatch(/\S/);
  });

  it('leaves the description alone when the title matched or the match is near the start', () => {
    expect(commandMetaSnippet({ title: 'Button', meta }, 'butt')).toBe(meta);
    expect(commandMetaSnippet({ title: 'Overlay', meta }, 'closes')).toBe(meta);
    expect(commandMetaSnippet({ title: 'Overlay' }, 'butt')).toBeUndefined();
  });
});
