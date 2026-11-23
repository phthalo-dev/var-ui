import { glyphFromInnerHtml } from '../glyph';
import { innerHtml } from '../glyph-data/externalLink';

/** `externalLink` glyph. Render it directly, or pass it through `IconProvider` via `defaultIcons`. */
export const externalLink = glyphFromInnerHtml(innerHtml);
