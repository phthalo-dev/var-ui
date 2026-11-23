import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/github';

/** `github` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const github = glyphFromInnerHtml(innerHtml);
