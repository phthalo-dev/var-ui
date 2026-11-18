import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/message';

/** `message` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const message = glyphFromInnerHtml(innerHtml);
