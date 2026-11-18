/**
 * Lowercases `text` and records, for every UTF-16 unit of the result, the index of the original
 * character it came from. Lowercasing can change length (`İ` → `i̇`), so offsets found in the
 * lowercase string must be mapped back before slicing the original.
 */
function lowerWithOffsets(text: string): { lower: string; origin: number[] } {
  let lower = '';
  const origin: number[] = [];
  for (let i = 0; i < text.length;) {
    const char = String.fromCodePoint(text.codePointAt(i)!);
    const lowered = char.toLowerCase();
    lower += lowered;
    for (let j = 0; j < lowered.length; j++) origin.push(i);
    i += char.length;
  }
  return { lower, origin };
}

/**
 * First case-insensitive occurrence of `query` (trimmed) in `text`, as `[start, end)` offsets into
 * the original `text`, or `null`. Shared by the React and Astro command palettes to highlight
 * matched text.
 */
export function findTextMatch(text: string, query: string): [number, number] | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const { lower, origin } = lowerWithOffsets(text);
  const matchStart = lower.indexOf(q);
  if (matchStart < 0) return null;
  const start = origin[matchStart]!;
  const lastOrigin = origin[matchStart + q.length - 1]!;
  const end = lastOrigin + String.fromCodePoint(text.codePointAt(lastOrigin)!).length;
  return [start, end];
}
