import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/repeatOne';

/** `repeatOne` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const repeatOne = glyphFromInnerHtml(innerHtml);
