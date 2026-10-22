export type AstroPropDoc = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
};

export type AstroSlotDoc = {
  name: string;
  description?: string;
};

export type AstroComponentDoc = {
  componentName: string;
  props: AstroPropDoc[];
  slots: AstroSlotDoc[];
};

import { getComponentMeta, type RecipeSchemaAxis } from 'typestyles';
import {
  accordionGroup,
  avatar,
  badge,
  banner,
  button,
  chip,
  codeBlock,
  collapsible,
  progressBar,
  spinner,
  statusDot,
  timeline,
} from '@var-ui/core';

const astroSources = import.meta.glob('../../../packages/astro/src/components/*.astro', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Recipes behind `interface Props extends …VariantProps`. */
const VARIANT_RECIPES = {
  AccordionGroupVariantProps: accordionGroup,
  AvatarVariantProps: avatar,
  BadgeVariantProps: badge,
  BannerVariantProps: banner,
  ButtonVariantProps: button,
  ChipVariantProps: chip,
  CodeBlockVariantProps: codeBlock,
  CollapsibleVariantProps: collapsible,
  ProgressBarVariantProps: progressBar,
  SpinnerVariantProps: spinner,
  StatusDotVariantProps: statusDot,
  TimelineVariantProps: timeline,
} as const;

function axisType(axis: RecipeSchemaAxis): string {
  if (axis.kind === 'boolean') return 'boolean';
  return axis.options.map((option) => `'${option}'`).join(' | ');
}

function schemaPropDocs(recipe: object): AstroPropDoc[] {
  const variants = getComponentMeta(recipe)?.schema?.variants;
  if (!variants) return [];
  return Object.entries(variants).map(([name, axis]) => ({
    name,
    type: axisType(axis),
    required: false,
  }));
}

/** Prop names read from `Astro.props`. Schema axes the component does not read stay out of the table. */
function destructuredPropNames(source: string): Set<string> {
  const match = source.match(/const\s*\{([\s\S]*?)\}\s*=\s*Astro\.props/);
  if (!match?.[1]) return new Set();

  const names = new Set<string>();
  for (const part of match[1].split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const renamed = trimmed.match(/^(?:(["'])([^"']+)\1|([A-Za-z_][\w]*))\s*:/);
    if (renamed) {
      names.add((renamed[2] ?? renamed[3])!);
      continue;
    }
    const ident = trimmed.match(/^([A-Za-z_][\w]*)/);
    if (ident?.[1]) names.add(ident[1]);
  }
  return names;
}

function slugToComponentName(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function findSource(componentName: string): string | undefined {
  const suffix = `/${componentName}.astro`;
  const key = Object.keys(astroSources).find((path) => path.endsWith(suffix));
  return key ? astroSources[key] : undefined;
}

function extractBraceBlock(source: string, openIndex: number): string | undefined {
  if (openIndex === -1) return undefined;

  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        return source.slice(openIndex + 1, i);
      }
    }
  }

  return undefined;
}

type ExtractedProps = {
  block?: string;
  extendsType?: string;
};

function extractProps(source: string): ExtractedProps | undefined {
  const interfaceMatch = source.match(/interface\s+Props\s+extends\s+(\w+)\s*\{/);
  if (interfaceMatch) {
    const open = source.indexOf('{', interfaceMatch.index!);
    return {
      extendsType: interfaceMatch[1],
      block: extractBraceBlock(source, open),
    };
  }

  const intersectionMatch = source.match(/type\s+Props\s*=\s*(\w+)\s*&\s*\{/);
  if (intersectionMatch) {
    const open = source.indexOf('{', intersectionMatch.index!);
    return {
      extendsType: intersectionMatch[1],
      block: extractBraceBlock(source, open),
    };
  }

  const start = source.search(/type\s+Props\s*=\s*\{/);
  if (start === -1) return undefined;

  const open = source.indexOf('{', start);
  return { block: extractBraceBlock(source, open) };
}

function parseProps(block: string): AstroPropDoc[] {
  const props: AstroPropDoc[] = [];
  let i = 0;

  while (i < block.length) {
    while (i < block.length && /[\s/,]/.test(block[i]!)) i++;
    if (i >= block.length) break;

    const nameMatch = block.slice(i).match(/^([A-Za-z_][\w]*)(\?)?\s*:/);
    if (!nameMatch) {
      i++;
      continue;
    }

    const name = nameMatch[1]!;
    const optional = Boolean(nameMatch[2]);
    i += nameMatch[0].length;

    while (i < block.length && /\s/.test(block[i]!)) i++;

    let depth = 0;
    let typeStart = i;
    while (i < block.length) {
      const ch = block[i]!;
      if (ch === '{' || ch === '(' || ch === '[') depth++;
      if (ch === '}' || ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
      if (ch === ';' && depth === 0) break;
      if (ch === '\n' && depth === 0 && block.slice(typeStart, i).trim().length > 0) {
        // allow newline-terminated props without semicolon
        const peek = block.slice(i).match(/^\n\s*[A-Za-z_]/);
        if (peek) break;
      }
      i++;
    }

    const type = block.slice(typeStart, i).trim().replace(/;$/, '').trim();
    if (name && type) {
      props.push({ name, type, required: !optional });
    }

    if (block[i] === ';') i++;
  }

  return props;
}

function parseDefaults(source: string): Record<string, string> {
  const defaults: Record<string, string> = {};
  const destructure = source.match(/const\s*\{([\s\S]*?)\}\s*=\s*Astro\.props/);
  if (!destructure) return defaults;

  for (const part of destructure[1]!.split(',')) {
    const match = part.trim().match(/^([A-Za-z_][\w]*)\s*=\s*(.+)$/);
    if (!match) continue;
    defaults[match[1]!] = match[2]!.trim();
  }

  return defaults;
}

function parseSlots(source: string): AstroSlotDoc[] {
  const slots = new Map<string, AstroSlotDoc>();

  for (const match of source.matchAll(/<slot\b([^>]*)\/?>/g)) {
    const attrs = match[1] ?? '';
    const named = attrs.match(/\bname\s*=\s*["']([^"']+)["']/);
    const name = named?.[1] ?? 'default';
    if (!slots.has(name)) {
      slots.set(name, {
        name,
        description: name === 'default' ? 'Default content' : undefined,
      });
    }
  }

  for (const match of source.matchAll(/Astro\.slots\.has\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    const name = match[1]!;
    if (!slots.has(name)) {
      slots.set(name, { name });
    }
  }

  return [...slots.values()].sort((a, b) => {
    if (a.name === 'default') return -1;
    if (b.name === 'default') return 1;
    return a.name.localeCompare(b.name);
  });
}

/** Whether `@var-ui/astro` ships a component for this docs slug. */
export function hasAstroBinding(slug: string): boolean {
  return Boolean(findSource(slugToComponentName(slug)));
}

/** Parse Props + slots from the matching `@var-ui/astro` component source. */
export function getAstroComponentDoc(slug: string): AstroComponentDoc | null {
  const componentName = slugToComponentName(slug);
  const source = findSource(componentName);
  if (!source) return null;

  const extracted = extractProps(source);
  const defaults = parseDefaults(source);
  const recipe = extracted?.extendsType
    ? VARIANT_RECIPES[extracted.extendsType as keyof typeof VARIANT_RECIPES]
    : undefined;
  const bound = destructuredPropNames(source);
  const extended = recipe ? schemaPropDocs(recipe).filter((prop) => bound.has(prop.name)) : [];
  const local = extracted?.block ? parseProps(extracted.block) : [];
  const props = [...extended, ...local].map((prop) => ({
    ...prop,
    default: defaults[prop.name],
  }));

  return {
    componentName,
    props,
    slots: parseSlots(source),
  };
}
