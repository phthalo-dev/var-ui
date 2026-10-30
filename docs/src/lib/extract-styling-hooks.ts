import fs from 'node:fs';
import path from 'node:path';
import { componentRegistry } from '../data/components.ts';

/**
 * Plain-CSS styling hooks per documented component, derived from the real core recipes at docs
 * build time: slot class names, variant-axis data attributes, state data attributes the library's
 * own CSS selects on, and component CSS variables. Nothing here is hand-written per component.
 */

export type StylingSlot = { recipe: string; slot: string; className: string };

export type StylingAxis = {
  recipe: string;
  name: string;
  /** Attribute written on the slot, e.g. `data-tone`. */
  attribute: string;
  kind: 'enum' | 'boolean';
  /** Enum options; empty for boolean axes (the attribute is present or absent). */
  options: string[];
  default?: string;
  slots: string[];
};

export type StylingState = {
  recipe: string;
  attribute: string;
  /** Values the library's CSS selects on; empty when it only tests presence. */
  values: string[];
  /** Slots whose rules reference the attribute. */
  slots: string[];
};

export type StylingVar = {
  recipe: string;
  name: string;
  slot: string;
  syntax?: string;
  defaultValue?: string;
  /** CSS properties (or other component variables) the recipe feeds this variable into. */
  controls: string[];
};

export type StylingHooksDoc = {
  slug: string;
  recipes: string[];
  rootClass: string;
  slots: StylingSlot[];
  axes: StylingAxis[];
  states: StylingState[];
  vars: StylingVar[];
  /** Starter rule built from the first real axis option and variable. */
  starter: string;
};

type MetaLike = {
  namespace: string;
  kind: 'dimensioned' | 'flat' | 'slot' | 'multi-slot';
  base: string | Record<string, string>;
  slots?: readonly string[];
  variants?: Record<string, unknown>;
  schema?: {
    variants: Record<
      string,
      | { kind: 'enum'; options: readonly string[]; default: string }
      | { kind: 'boolean'; default: boolean }
    >;
  };
  varRegistry?: {
    hostSlot: string;
    vars: { path: string; name: string; syntax?: string; defaultValue?: string }[];
  };
};

type CoreLike = {
  typestyles: { getThemeableComponents(): Iterable<[string, unknown]> };
};

const REACT_COMPONENTS = path.resolve(
  import.meta.dirname,
  '../../../packages/react/src/components',
);

/** Slugs whose core recipe export does not match the slug. */
const RECIPE_ALIASES: Record<string, string[]> = {
  text: ['textBlock'],
  'clickable-card': ['card'],
};

function camel(value: string): string {
  return value.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.tsx$/.test(entry.name) && !/\.test\./.test(entry.name)) out.push(full);
  }
  return out;
}

let reactFiles: string[] | null = null;

/** Identifiers a React component imports from `@var-ui/core` (and its subpaths). */
function coreImportsOf(componentName: string): Set<string> {
  reactFiles ??= walk(REACT_COMPONENTS);
  const names = new Set<string>();
  for (const file of reactFiles) {
    if (path.basename(file, '.tsx') !== componentName) continue;
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(
      /import\s+(?!type\b)\{([^}]*)\}\s+from\s+'@var-ui\/core[^']*'/g,
    )) {
      for (const part of match[1]!.split(',')) {
        const imported = part
          .trim()
          .split(/\s+as\s+/)[0]!
          .trim();
        if (imported && !imported.startsWith('type ')) names.add(imported);
      }
    }
  }
  return names;
}

function classesOf(meta: MetaLike): Array<{ slot: string; className: string }> {
  if (typeof meta.base === 'string') return [{ slot: 'base', className: meta.base }];
  return Object.entries(meta.base).map(([slot, className]) => ({ slot, className }));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ATTR_RE = /\[(data-[\w-]+)(?:\s*=\s*["']?([^"'\]]*)["']?)?\]/g;

/** `data-*` attribute selectors written directly on a slot class in the registered CSS. */
function stateAttrsFor(cssLines: string[], className: string) {
  const found = new Map<string, Set<string>>();
  const classRe = new RegExp(
    `\\.${escapeRegExp(className)}(?![\\w-])((?:\\[[^\\]]*\\]|:[\\w-]+(?:\\([^)]*\\))?)*)`,
    'g',
  );
  for (const line of cssLines) {
    if (!line.includes(className)) continue;
    for (const match of line.matchAll(classRe)) {
      for (const attr of (match[1] ?? '').matchAll(ATTR_RE)) {
        const values = found.get(attr[1]!) ?? new Set<string>();
        if (attr[2] !== undefined) values.add(attr[2]);
        found.set(attr[1]!, values);
      }
    }
  }
  return found;
}

/** One pass over the CSS: component variable name -> properties that read it via `var()`. */
function indexControls(css: string): Map<string, Set<string>> {
  const index = new Map<string, Set<string>>();
  for (const decl of css.matchAll(/(?<![\w-])(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]*)/g)) {
    for (const ref of decl[2]!.matchAll(/var\((--var-ui-[\w-]+)/g)) {
      if (ref[1] === decl[1]) continue;
      const set = index.get(ref[1]!) ?? new Set<string>();
      set.add(decl[1]!);
      index.set(ref[1]!, set);
    }
  }
  return index;
}

function recipesForSlug(slug: string, byCamel: Map<string, string>): string[] {
  const entry = componentRegistry.find((c) => c.slug === slug);
  const wanted = new Set<string>([camel(slug), ...(RECIPE_ALIASES[slug] ?? [])]);
  if (entry) for (const name of coreImportsOf(entry.name)) wanted.add(name);
  return [...wanted].map((name) => byCamel.get(name)).filter((n): n is string => Boolean(n));
}

function buildStarter(doc: Omit<StylingHooksDoc, 'starter'>): string {
  const axis = doc.axes.find((a) => a.options.length > 0 || a.kind === 'boolean');
  const slotName = axis?.slots[0] ?? doc.vars[0]?.slot ?? doc.slots[0]?.slot;
  const slot = doc.slots.find((s) => s.slot === slotName && (!axis || s.recipe === axis.recipe));
  if (!slot) return '';
  let selector = `.${slot.className}`;
  if (axis) {
    if (axis.kind === 'boolean') selector += `[${axis.attribute}]`;
    else {
      const option = axis.options.find((o) => o !== axis.default) ?? axis.options[0]!;
      selector += `[${axis.attribute}='${option}']`;
    }
  }
  // Prefer a variable that feeds a real CSS property (the resolved paint) over an input variable.
  const candidates = doc.vars.filter((v) => v.recipe === slot.recipe);
  const variable =
    candidates.find((v) => v.controls.some((c) => !c.startsWith('--'))) ??
    candidates[0] ??
    doc.vars[0];
  const body = variable
    ? `  ${variable.name}: ${variable.defaultValue ?? 'initial'};`
    : `  /* your declarations */`;
  return `${selector} {\n${body}\n}`;
}

/** Extract styling hooks for every documented slug that has at least one recipe slot. */
export async function extractAllStylingHooks(): Promise<Record<string, StylingHooksDoc>> {
  const [core, typestyles] = (await Promise.all([
    import('@var-ui/core'),
    import('typestyles'),
  ])) as unknown as [CoreLike, typeof import('typestyles')];

  const recipes = new Map<string, unknown>();
  for (const [name, recipe] of core.typestyles.getThemeableComponents()) {
    recipes.set(name, recipe);
    // Invoking a recipe registers its rules and component variables.
    try {
      (recipe as (props?: object) => unknown)({});
    } catch {
      /* ignore recipes that need props */
    }
  }
  const byCamel = new Map([...recipes.keys()].map((name) => [camel(name), name]));
  const css = typestyles.getRegisteredCss();
  const cssLines = css.split('\n');
  const controls = indexControls(css);

  const docs: Record<string, StylingHooksDoc> = {};
  for (const { slug } of componentRegistry) {
    const recipeNames = recipesForSlug(slug, byCamel);
    const slots: StylingSlot[] = [];
    const axes: StylingAxis[] = [];
    const states: StylingState[] = [];
    const vars: StylingVar[] = [];

    for (const name of recipeNames) {
      const meta = typestyles.getComponentMeta(recipes.get(name) as object) as MetaLike | undefined;
      if (!meta) continue;
      const classes = classesOf(meta);
      for (const { slot, className } of classes) slots.push({ recipe: name, slot, className });

      // Axes: per-slot variant selector maps (slot recipes) or one map (dimensioned recipes).
      const perSlot: Array<[string, Record<string, Record<string, string>>]> =
        meta.kind === 'slot'
          ? Object.entries(
              (meta.variants ?? {}) as Record<string, Record<string, Record<string, string>>>,
            )
          : meta.kind === 'dimensioned'
            ? [['base', (meta.variants ?? {}) as Record<string, Record<string, string>>]]
            : [];
      const axisByName = new Map<string, StylingAxis>();
      for (const [slot, variants] of perSlot) {
        for (const [axisName, options] of Object.entries(variants)) {
          let attribute = `data-${axisName}`;
          for (const selector of Object.values(options)) {
            const m = /\[(data-[\w-]+)/.exec(selector);
            if (m) attribute = m[1]!;
          }
          const schema = meta.schema?.variants[axisName];
          const existing = axisByName.get(axisName);
          if (existing) {
            existing.slots.push(slot);
            continue;
          }
          const isBoolean = schema?.kind === 'boolean' || (!schema && 'true' in options);
          axisByName.set(axisName, {
            recipe: name,
            name: axisName,
            attribute,
            kind: isBoolean ? 'boolean' : 'enum',
            options: isBoolean
              ? []
              : schema?.kind === 'enum'
                ? [...schema.options]
                : Object.keys(options),
            default: schema ? String(schema.default) : undefined,
            slots: [slot],
          });
        }
      }
      axes.push(...axisByName.values());
      const axisAttrs = new Set([...axisByName.values()].map((a) => a.attribute));

      // State attributes: every data-* the library's own CSS selects on that is not an axis.
      const stateByAttr = new Map<string, StylingState>();
      for (const { slot, className } of classes) {
        for (const [attribute, values] of stateAttrsFor(cssLines, className)) {
          if (axisAttrs.has(attribute)) continue;
          const state = stateByAttr.get(attribute) ?? {
            recipe: name,
            attribute,
            values: [],
            slots: [],
          };
          for (const value of values) if (!state.values.includes(value)) state.values.push(value);
          if (!state.slots.includes(slot)) state.slots.push(slot);
          stateByAttr.set(attribute, state);
        }
      }
      states.push(
        ...[...stateByAttr.values()].sort((a, b) => a.attribute.localeCompare(b.attribute)),
      );

      const registry = meta.varRegistry;
      for (const v of registry?.vars ?? []) {
        vars.push({
          recipe: name,
          name: v.name,
          slot: registry!.hostSlot,
          syntax: v.syntax,
          defaultValue: v.defaultValue,
          controls: [...(controls.get(v.name) ?? [])].sort(),
        });
      }
    }

    if (slots.length === 0) continue;
    const base = {
      slug,
      recipes: recipeNames,
      rootClass: slots[0]!.className,
      slots,
      axes,
      states,
      vars,
    };
    docs[slug] = { ...base, starter: buildStarter(base) };
  }
  return docs;
}

function writeJsonAtomic(filePath: string, data: unknown): void {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`);
  fs.renameSync(tempPath, filePath);
}

/**
 * Write `<slug>.json` styling docs. Needs the core package to be importable (built `dist`, or the
 * source alias under vitest); when it is not, warn and leave the pages without a hooks section.
 */
export async function writeStylingHooks(outputDir: string): Promise<void> {
  fs.mkdirSync(outputDir, { recursive: true });
  let docs: Record<string, StylingHooksDoc>;
  try {
    docs = await extractAllStylingHooks();
  } catch (error) {
    console.warn(
      `[styling-hooks] skipped: ${error instanceof Error ? error.message : String(error)}`,
    );
    return;
  }
  for (const [slug, doc] of Object.entries(docs)) {
    writeJsonAtomic(path.join(outputDir, `${slug}.json`), doc);
  }
}
