/**
 * Fallback descriptions for shared recipe-variant and DOM props. Recipe variants are typed from
 * `RecipeVariants<…>`, so they carry no JSDoc into the extracted props data.
 */
export const commonPropDescriptions: Record<string, string> = {
  tone: 'Color role: `neutral`, `accent`, or a status tone (`success`, `warning`, `danger`, `info`).',
  appearance: 'Surface treatment: `filled`, `outline`, `subtle`, or `ghost`.',
  size: 'Control density. Inherits the surrounding control size when omitted.',
  layout: '`icon` makes a square, icon-only control.',
  elevated: 'Adds a resting shadow.',
  variant: 'Visual variant of the component.',
  orientation: 'Layout direction: `horizontal` or `vertical`.',
  density: 'Spacing density of rows and padding.',
  children: 'Content rendered inside the component.',
  className: 'Additional CSS class names merged onto the root element.',
  style: 'Inline style for the root element.',
  id: 'DOM `id` of the root element.',
  items: 'Collection items to render.',
  gap: 'Space between children (a `space` token step).',
  'aria-label': 'Accessible name when there is no visible label.',
  'aria-labelledby': 'Id of the element that labels this one.',
  'aria-describedby': 'Id of the element that describes this one.',
  'aria-details': 'Id of an element with extended details.',
  autoFocus: 'Focus the element on mount.',
};
