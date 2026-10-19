import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/close';

/** `close` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const close = glyphFromInnerHtml(innerHtml);
