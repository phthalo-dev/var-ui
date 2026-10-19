import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/search';

/** `search` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const search = glyphFromInnerHtml(innerHtml);
