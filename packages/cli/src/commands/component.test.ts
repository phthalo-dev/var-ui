import { describe, expect, it } from 'vite-plus/test';
import type { ComponentRecord } from '../types';
import { formatComponent } from './component';

function button(markdown: string, props: ComponentRecord['props'] = []): ComponentRecord {
  return {
    slug: 'button',
    name: 'Button',
    category: 'action',
    description: 'Triggers an action',
    importLine: "import { Button } from '@var-ui/react';",
    packages: ['react', 'core'],
    docsPath: '/components/button',
    markdown,
    examples: [],
    props,
  };
}

const props = [
  {
    name: 'tone',
    type: '"neutral" | "accent" | undefined',
    required: false,
    source: 'var-ui' as const,
  },
  {
    name: 'isDisabled',
    type: 'boolean | undefined',
    required: false,
    source: 'react-aria' as const,
  },
  {
    name: 'onClick',
    type: 'MouseEventHandler<HTMLButtonElement> | undefined',
    required: false,
    source: 'dom' as const,
  },
  { name: 'about', type: 'string | undefined', required: false, source: 'dom' as const },
];

// What catalog generation bakes in: own props only, plus the note.
const bakedMarkdown = [
  '# Button',
  '',
  'Triggers an action.',
  '',
  '| Name | Type | Required | Default | Description |',
  '| --- | --- | --- | --- | --- |',
  '| tone | "neutral" \\| "accent" \\| undefined | no |  |  |',
  '| isDisabled | boolean \\| undefined | no |  |  |',
  '',
  '> Also accepts all standard HTML attributes (ARIA attributes, event handlers, styles, …). Run `var-ui component button --all-props` for the complete list.',
  '',
].join('\n');

describe('formatComponent', () => {
  it('prints heading then import then body when markdown already has an H1', () => {
    const out = formatComponent(button('\n\n# Button\n\nTriggers an action.\n'), { json: false });
    expect(out).toBe(
      "# Button\n\nimport { Button } from '@var-ui/react';\n\nTriggers an action.\n",
    );
  });

  it('prints heading then import when markdown has no H1', () => {
    const out = formatComponent(button('Triggers an action.\n'), { json: false });
    expect(out).toBe(
      "# Button\n\nimport { Button } from '@var-ui/react';\n\nTriggers an action.\n",
    );
  });

  it('keeps the baked own-props table and note by default', () => {
    const out = formatComponent(button(bakedMarkdown, props), { json: false });
    expect(out).toContain('| tone |');
    expect(out).toContain('| isDisabled |');
    expect(out).not.toContain('| onClick |');
    expect(out).not.toContain('| about |');
    expect(out).toContain('> Also accepts all standard HTML attributes');
  });

  it('swaps the baked table for every prop with allProps', () => {
    const out = formatComponent(button(bakedMarkdown, props), { json: false, allProps: true });
    expect(out).toContain('# Button');
    expect(out).toContain('| tone |');
    expect(out).toContain('| onClick |');
    expect(out).toContain('| about |');
    // The baked own-only table must be replaced, not duplicated, and the
    // --all-props pointer is redundant once the full list is printed.
    expect(out.match(/\| Name \| Type \|/g)).toHaveLength(1);
    expect(out).not.toContain('Also accepts all standard HTML attributes');
  });

  it('appends an All props section when the markdown has no baked table', () => {
    const out = formatComponent(button('Triggers an action.\n', props), {
      json: false,
      allProps: true,
    });
    expect(out).toContain('## All props');
    expect(out).toContain('| about |');
  });

  it('filters dom props out of JSON by default and keeps everything with allProps', () => {
    const json = formatComponent(button('body', props), { json: true });
    const parsed = JSON.parse(json) as ComponentRecord;
    expect(parsed.props.map((prop) => prop.name)).toEqual(['tone', 'isDisabled']);

    const full = formatComponent(button('body', props), { json: true, allProps: true });
    const parsedFull = JSON.parse(full) as ComponentRecord;
    expect(parsedFull.props).toHaveLength(4);
  });
});
