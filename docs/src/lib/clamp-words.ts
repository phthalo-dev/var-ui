/**
 * Shorten `text` to at most `max` characters on a word boundary, adding an ellipsis. CSS
 * line-clamp cuts mid-word; doing it here keeps card descriptions ending on whole words.
 */
export function clampWords(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const lastSpace = cut.lastIndexOf(' ');
  const head = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : clean.slice(0, max)).replace(
    /[\s,;:—–-]+$/,
    '',
  );
  return `${head}…`;
}
