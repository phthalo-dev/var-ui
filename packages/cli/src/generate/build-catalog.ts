import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import type {
  Catalog,
  CatalogMeta,
  ComponentExample,
  ComponentRecord,
  GuideRecord,
  PropRow,
} from '../types';

export type RepoPaths = {
  repoRoot: string;
  docsContent: string;
  docsDemos: string;
  astroComponents: string;
  propsDir: string;
  publicDir: string;
};

type RegistryEntry = {
  slug: string;
  name: string;
  category: string;
  description: string;
  importLine: string;
};

type Snippet = { react: string; astro?: string; html?: string };

const DEMO_RE = /<Demo\s+id=["']([^"']+)["']\s*\/>/g;

export function findRepoRoot(startDir: string): string {
  let dir = resolve(startDir);
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(`Could not find repo root from ${startDir}`);
    }
    dir = parent;
  }
}

export function defaultRepoPaths(repoRoot: string): RepoPaths {
  return {
    repoRoot,
    docsContent: join(repoRoot, 'docs/content'),
    docsDemos: join(repoRoot, 'docs/src/demos'),
    astroComponents: join(repoRoot, 'packages/astro/src/components'),
    propsDir: join(repoRoot, 'docs/src/generated/props'),
    publicDir: join(repoRoot, 'docs/public'),
  };
}

type TransformMdx = typeof import('@var-ui/docs/utils').transformMdx;

export async function buildCatalog(paths: RepoPaths, version: string): Promise<Catalog> {
  const { transformMdx } = (await import(
    pathToFileURL(join(paths.repoRoot, 'packages/docs/src/utils/transform-mdx.ts')).href
  )) as { transformMdx: TransformMdx };
  const registryMod = (await import(
    pathToFileURL(join(paths.repoRoot, 'docs/src/data/components.ts')).href
  )) as { componentRegistry: RegistryEntry[] };
  await extractComponentProps(paths);
  const snippetIndex = await indexSnippets(paths.docsDemos);
  const components: ComponentRecord[] = [];

  for (const entry of registryMod.componentRegistry) {
    const filePath = join(paths.docsContent, 'components', `${entry.slug}.mdx`);
    if (!existsSync(filePath)) {
      throw new Error(`Missing MDX for component "${entry.slug}"`);
    }

    const source = readFileSync(filePath, 'utf8');
    const props = loadProps(paths.propsDir, entry.slug);
    const transformed = transformMdx({
      source,
      snippets: snippetIndex,
      props,
      filePath,
    });

    components.push({
      slug: entry.slug,
      name: entry.name,
      category: entry.category,
      description: entry.description,
      importLine: entry.importLine,
      packages: componentPackages(paths.astroComponents, entry.slug),
      docsPath: `/components/${entry.slug}`,
      markdown: transformed.markdown,
      examples: demoIdsInPage(source).map((id) => toExample(id, snippetIndex[id]!)),
      props,
    });
  }

  return {
    version,
    meta: buildCatalogMeta(paths.repoRoot),
    components,
    guides: await loadGuides(paths, transformMdx),
  };
}

/**
 * Stamp the catalog with what it was generated from, so the CLI can warn when
 * the installed @var-ui/react is newer than the docs it ships (#129).
 */
export function buildCatalogMeta(repoRoot: string): CatalogMeta {
  return {
    generatedAt: new Date().toISOString(),
    commit: currentCommit(repoRoot),
    packages: {
      react: readWorkspaceVersion(repoRoot, 'react'),
      core: readWorkspaceVersion(repoRoot, 'core'),
      icons: readWorkspaceVersion(repoRoot, 'icons'),
      astro: readWorkspaceVersion(repoRoot, 'astro'),
    },
  };
}

function readWorkspaceVersion(repoRoot: string, name: string): string {
  const filePath = join(repoRoot, 'packages', name, 'package.json');
  return (JSON.parse(readFileSync(filePath, 'utf8')) as { version: string }).version;
}

function currentCommit(repoRoot: string): string | undefined {
  if (!existsSync(join(repoRoot, '.git'))) {
    return undefined;
  }
  try {
    const output = execSync('git rev-parse HEAD', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output.toString().trim() || undefined;
  } catch {
    return undefined;
  }
}

async function extractComponentProps(paths: RepoPaths): Promise<void> {
  const { writeComponentProps } = (await import(
    pathToFileURL(join(paths.repoRoot, 'docs/src/lib/extract-component-props.ts')).href
  )) as { writeComponentProps: (outputDir: string) => void };
  writeComponentProps(paths.propsDir);
}

async function indexSnippets(docsDemos: string): Promise<Record<string, Snippet>> {
  const files = listFiles(docsDemos, true).filter((file) => basename(file) === 'snippets.ts');
  const entries = await Promise.all(
    files.map(async (filePath) => {
      const id = posixRelative(docsDemos, filePath)
        .replace(/\/snippets\.ts$/, '')
        .replace(/\//g, '.');
      const mod = (await import(pathToFileURL(filePath).href)) as { snippets: Snippet };
      return [id, mod.snippets] as const;
    }),
  );
  return Object.fromEntries(entries);
}

async function loadGuides(paths: RepoPaths, transformMdx: TransformMdx): Promise<GuideRecord[]> {
  const docsDir = join(paths.docsContent, 'docs');
  const themingDir = join(paths.docsContent, 'theming');
  const docs = await loadGuideCollection(docsDir, '/docs', false, transformMdx);
  const theming = await loadGuideCollection(themingDir, '/theming', true, transformMdx);
  return [...docs, ...theming];
}

async function loadGuideCollection(
  collectionDir: string,
  prefix: string,
  recursive: boolean,
  transformMdx: TransformMdx,
): Promise<GuideRecord[]> {
  const files = listFiles(collectionDir, recursive)
    .filter((file) => file.endsWith('.mdx'))
    .sort();
  const collection = prefix.replace(/^\//, '');
  return Promise.all(
    files.map(async (filePath) => {
      const relativeId = posixRelative(collectionDir, filePath).replace(/\.mdx$/, '');
      const id = relativeId === 'index' ? `${collection}/index` : relativeId;
      const source = readFileSync(filePath, 'utf8');
      const transformed = transformMdx({
        source,
        snippets: {},
        props: [],
        filePath,
      });
      return {
        id,
        title: transformed.title,
        description: transformed.description,
        docsPath: relativeId === 'index' ? prefix : `${prefix}/${relativeId}`,
        markdown: transformed.markdown,
      };
    }),
  );
}

function loadProps(propsDir: string, slug: string): PropRow[] {
  const filePath = join(propsDir, `${slug}.json`);
  if (!existsSync(filePath)) {
    return [];
  }
  const data = JSON.parse(readFileSync(filePath, 'utf8')) as {
    props?: Array<{
      name: string;
      type: string;
      required: boolean;
      default?: string;
      description?: string;
    }>;
  };
  return (data.props ?? []).map((prop) => {
    const row: PropRow = {
      name: prop.name,
      type: prop.type,
      required: prop.required,
    };
    if (prop.default !== undefined) {
      row.default = prop.default;
    }
    if (prop.description !== undefined) {
      row.description = prop.description;
    }
    return row;
  });
}

function componentPackages(astroComponents: string, slug: string): ComponentRecord['packages'] {
  const packages: ComponentRecord['packages'] = ['react', 'core'];
  if (existsSync(join(astroComponents, `${pascal(slug)}.astro`))) {
    packages.push('astro');
  }
  return packages;
}

function pascal(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function demoIdsInPage(source: string): string[] {
  return [...source.matchAll(DEMO_RE)].map((match) => match[1]!);
}

function toExample(id: string, snippet: Snippet): ComponentExample {
  const example: ComponentExample = { id, react: snippet.react };
  if (snippet.astro !== undefined) {
    example.astro = snippet.astro;
  }
  if (snippet.html !== undefined) {
    example.html = snippet.html;
  }
  return example;
}

function listFiles(dir: string, recursive: boolean): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive })) {
    if (!entry.isFile()) {
      continue;
    }
    files.push(join(entry.parentPath, entry.name));
  }
  return files;
}

function posixRelative(from: string, to: string): string {
  return relative(from, to).split(sep).join('/');
}
