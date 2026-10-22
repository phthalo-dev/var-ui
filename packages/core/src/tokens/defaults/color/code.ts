import { tokens } from '../../declare';
import type { ColorTokenPatch, DesignTokens } from '../../types';

/** Per-mode syntax colors (scalar strings) for highlighter CSS that toggles with `atDarkMode`. */
export type SyntaxFaceValues = {
  [K in keyof DesignTokens['color']['code']]: string;
};

/** Light-face syntax colors — used by docs highlighter CSS that toggles with `atDarkMode`. */
export const lightSyntaxValues = {
  base: tokens.color.palette['gray-10'].var,
  keyword: tokens.color.palette['purple-6'].var,
  title: tokens.color.palette['blue-6'].var,
  attr: tokens.color.palette['amber-6'].var,
  string: tokens.color.palette['teal-6'].var,
  builtIn: tokens.color.palette['orange-6'].var,
  comment: tokens.color.palette['gray-5'].var,
  name: tokens.color.palette['red-6'].var,
  section: tokens.color.palette['indigo-6'].var,
  bullet: tokens.color.palette['amber-6'].var,
  addition: tokens.color.palette['teal-6'].var,
  additionBackground: tokens.color.palette['emerald-1'].var,
  deletion: tokens.color.palette['red-6'].var,
  deletionBackground: tokens.color.palette['red-1'].var,
} satisfies SyntaxFaceValues;

/** Dark-face syntax colors — used by docs highlighter CSS that toggles with `atDarkMode`. */
export const darkSyntaxValues = {
  base: tokens.color.palette['gray-3'].var,
  keyword: tokens.color.palette['violet-4'].var,
  title: tokens.color.palette['blue-4'].var,
  attr: tokens.color.palette['amber-4'].var,
  string: tokens.color.palette['teal-4'].var,
  builtIn: tokens.color.palette['orange-4'].var,
  comment: tokens.color.palette['gray-4'].var,
  name: tokens.color.palette['red-4'].var,
  section: tokens.color.palette['indigo-4'].var,
  bullet: tokens.color.palette['amber-5'].var,
  addition: tokens.color.palette['teal-4'].var,
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
