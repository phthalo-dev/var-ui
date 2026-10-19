import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/error';

/** `error` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const error = glyphFromInnerHtml(innerHtml);
