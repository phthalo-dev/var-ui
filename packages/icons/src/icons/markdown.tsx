import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/markdown';

/** `markdown` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const markdown = glyphFromInnerHtml(innerHtml);
