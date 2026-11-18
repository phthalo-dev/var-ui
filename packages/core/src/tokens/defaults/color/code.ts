import { tokens } from '../../declare';
import type { ColorTokenPatch, DesignTokens } from '../../types';

/** Per-mode syntax colors (scalar strings) for highlighter CSS that toggles with `atDarkMode`. */
export type SyntaxFaceValues = {
  [K in keyof DesignTokens['color']['code']]: string;
};

/**
 * Light-face syntax colors. A restrained, brand-derived theme: keywords and tags in the phthalo
 * accent, strings in a warm amber, everything else on the warm neutral (stone) ramp. Three hues,
 * shared by light and dark, so code reads as part of the system rather than a rainbow.
 */
export const lightSyntaxValues = {
  base: tokens.color.palette['stone-9'].var,
  keyword: tokens.color.palette['phthalo-7'].var,
  title: tokens.color.palette['stone-10'].var,
  attr: tokens.color.palette['stone-7'].var,
  string: tokens.color.palette['amber-7'].var,
  builtIn: tokens.color.palette['phthalo-8'].var,
  comment: tokens.color.palette['stone-5'].var,
  name: tokens.color.palette['phthalo-8'].var,
  section: tokens.color.palette['phthalo-7'].var,
  bullet: tokens.color.palette['amber-7'].var,
  addition: tokens.color.palette['green-7'].var,
  additionBackground: tokens.color.palette['emerald-1'].var,
  deletion: tokens.color.palette['red-7'].var,
  deletionBackground: tokens.color.palette['red-1'].var,
} satisfies SyntaxFaceValues;

/** Dark-face syntax colors: the same three hues, lifted for dark surfaces. */
export const darkSyntaxValues = {
  base: tokens.color.palette['stone-3'].var,
  keyword: 'oklch(0.8 0.1 175)',
  title: tokens.color.palette['stone-1'].var,
  attr: tokens.color.palette['stone-4'].var,
  string: 'oklch(0.83 0.09 72)',
  builtIn: tokens.color.palette['phthalo-3'].var,
  comment: tokens.color.palette['stone-6'].var,
  name: tokens.color.palette['phthalo-3'].var,
  section: 'oklch(0.8 0.1 175)',
  bullet: 'oklch(0.83 0.09 72)',
  addition: tokens.color.palette['green-4'].var,
  additionBackground: tokens.color.palette['emerald-10'].var,
  deletion: tokens.color.palette['red-4'].var,
  deletionBackground: tokens.color.palette['red-10'].var,
} satisfies SyntaxFaceValues;

export const code = {
  base: { light: lightSyntaxValues.base, dark: darkSyntaxValues.base },
  keyword: { light: lightSyntaxValues.keyword, dark: darkSyntaxValues.keyword },
  title: { light: lightSyntaxValues.title, dark: darkSyntaxValues.title },
  attr: { light: lightSyntaxValues.attr, dark: darkSyntaxValues.attr },
  string: { light: lightSyntaxValues.string, dark: darkSyntaxValues.string },
  builtIn: { light: lightSyntaxValues.builtIn, dark: darkSyntaxValues.builtIn },
  comment: { light: lightSyntaxValues.comment, dark: darkSyntaxValues.comment },
  name: { light: lightSyntaxValues.name, dark: darkSyntaxValues.name },
  section: { light: lightSyntaxValues.section, dark: darkSyntaxValues.section },
  bullet: { light: lightSyntaxValues.bullet, dark: darkSyntaxValues.bullet },
  addition: { light: lightSyntaxValues.addition, dark: darkSyntaxValues.addition },
  additionBackground: {
    light: lightSyntaxValues.additionBackground,
    dark: darkSyntaxValues.additionBackground,
  },
  deletion: { light: lightSyntaxValues.deletion, dark: darkSyntaxValues.deletion },
  deletionBackground: {
    light: lightSyntaxValues.deletionBackground,
    dark: darkSyntaxValues.deletionBackground,
  },
} satisfies ColorTokenPatch['code'];
