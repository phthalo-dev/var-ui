import { glyphFromInnerHtml } from './glyph';
import { varUiMarkInnerHtml, varUiMarkSmallInnerHtml } from './brand';

/** Var UI brand glyph `(-)` as a React element (24×24, `currentColor`). Set it on a tile. */
export const varUiMark = glyphFromInnerHtml(varUiMarkInnerHtml);

/** 16px optical size of {@link varUiMark} (16×16 grid, heavier stroke); use it at 20px and below. */
export const varUiMarkSmall = glyphFromInnerHtml(varUiMarkSmallInnerHtml, 16);
