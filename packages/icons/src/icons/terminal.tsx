import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/terminal';

/** `terminal` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const terminal = glyphFromInnerHtml(innerHtml);
