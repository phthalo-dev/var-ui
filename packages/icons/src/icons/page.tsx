import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/page';

/** `page` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const page = glyphFromInnerHtml(innerHtml);
