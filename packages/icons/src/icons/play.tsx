import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/play';

/** `play` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const play = glyphFromInnerHtml(innerHtml);
