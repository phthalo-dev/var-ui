/**
 * One-line note appended under the inlined props table when a component also
 * accepts inherited HTML/ARIA/DOM attributes that the default table hides
 * (#130). Shared by catalog generation (which bakes it into the markdown) and
 * the CLI's `--all-props` rendering (which strips it before printing the full
 * table).
 */
export const DOM_PROPS_NOTE_PREFIX = '> Also accepts all standard HTML attributes';

export function domPropsNote(slug: string): string {
  return `${DOM_PROPS_NOTE_PREFIX} (ARIA attributes, event handlers, styles, …). Run \`var-ui component ${slug} --all-props\` for the complete list.`;
}
