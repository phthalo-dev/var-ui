import { describe, expect, it } from 'vite-plus/test';
import {
  commandMatchTier,
  commandMetaSnippet,
  rankCommandItems,
  scoreCommandItem,
} from './commandSearch';

describe('scoreCommandItem', () => {
  it('ranks exact > prefix > word-start > substring > keyword > description', () => {
    expect(scoreCommandItem({ title: 'Button' }, 'button')).toBe(commandMatchTier.exactTitle);
    expect(scoreCommandItem({ title: 'Button group' }, 'but')).toBe(commandMatchTier.titlePrefix);
    expect(scoreCommandItem({ title: 'Icon button' }, 'but')).toBe(commandMatchTier.titleWordStart);
    expect(scoreCommandItem({ title: 'IconButton' }, 'but')).toBe(commandMatchTier.titleWordStart);
    expect(scoreCommandItem({ title: 'Rebuttal' }, 'but')).toBe(commandMatchTier.titleSubstring);
    expect(scoreCommandItem({ title: 'Toolbar', keywords: ['buttons'] }, 'but')).toBe(
      commandMatchTier.keyword,
    );
    expect(scoreCommandItem({ title: 'Overlay', meta: 'Open on a button' }, 'but')).toBe(
      commandMatchTier.meta,
    );
    expect(scoreCommandItem({ title: 'Overlay' }, 'but')).toBeNull();
    expect(scoreCommandItem({ title: 'Overlay' }, '  ')).toBe(0);
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
