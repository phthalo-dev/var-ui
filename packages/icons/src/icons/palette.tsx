import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/palette';

/** `palette` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const palette = glyphFromInnerHtml(innerHtml);
