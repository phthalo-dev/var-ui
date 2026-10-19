import type { ReactNode } from 'react';
import { iconNameList, type IconName } from '@var-ui/core';
import { glyphFromInnerHtml } from './glyph';
import { defaultGlyphInnerHtml } from './glyphs';

/** Default React glyphs — pass to `IconProvider`. */
export const defaultIcons: Partial<Record<IconName, ReactNode>> = Object.fromEntries(
  iconNameList.map((name) => [name, glyphFromInnerHtml(defaultGlyphInnerHtml[name])]),
);
