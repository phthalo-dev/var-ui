import type { codeBlockMarkup } from '@var-ui/core';

/** The slice of Vite's dev server this uses (typed structurally: two Vite copies are installed). */
type ModuleNode = { url: string; file: string | null; ssrImportedModules: Set<ModuleNode> };
type DevServer = {
  ssrLoadModule: (url: string) => Promise<Record<string, unknown>>;
  pluginContainer: {
    resolveId: (
      id: string,
      importer?: string,
      options?: { ssr?: boolean },
    ) => Promise<{ id: string } | null>;
  };
  moduleGraph: {
    getModuleById: (id: string) => ModuleNode | undefined;
    idToModuleMap: Map<string, ModuleNode>;
    invalidateModule: (mod: ModuleNode) => void;
  };
  watcher: { on: (event: 'change', listener: (file: string) => void) => unknown };
  ws: { send: (payload: { type: 'full-reload' }) => void };
};

type Markup = typeof codeBlockMarkup;
type Logger = { info: (message: string) => void; warn: (message: string) => void };

const MARKUP_MODULE = '@var-ui/core/components/codeBlockMarkup';
const MARKDOWN = /\.(md|mdx|markdoc)$/;

/** Files (absolute paths) the module and everything it imports come from. */
function moduleFiles(server: DevServer, id: string): Set<string> {
  const files = new Set<string>();
  const seen = new Set<string>();
  const visit = (mod: ModuleNode | undefined) => {
    if (!mod || seen.has(mod.url)) return;
    seen.add(mod.url);
    if (mod.file) files.add(mod.file);
    for (const dep of mod.ssrImportedModules) visit(dep);
  };
  visit(server.moduleGraph.getModuleById(id));
  return files;
}

/**
 * Dev only: load `codeBlockMarkup` through Vite, so it resolves like the rest of the site (source
 * in this monorepo) instead of the `dist` the config context imported. When one of its files
 * changes, reload it, drop the compiled markdown so fences re-render, and reload the page.
 */
export async function followCodeBlockMarkup(
  server: DevServer,
  target: { current: Markup },
  logger: Logger,
): Promise<void> {
  let files = new Set<string>();
  const load = async () => {
    const mod = (await server.ssrLoadModule(MARKUP_MODULE)) as { codeBlockMarkup?: Markup };
    if (!mod.codeBlockMarkup) return false;
    target.current = mod.codeBlockMarkup;
    const resolved = await server.pluginContainer.resolveId(MARKUP_MODULE, undefined, {
      ssr: true,
    });
    files = resolved ? moduleFiles(server, resolved.id) : new Set();
    return true;
  };
  try {
    await load();
  } catch (error) {
    logger.warn(`Code block markup stays on the built @var-ui/core: ${String(error)}`);
    return;
  }
  server.watcher.on('change', async (file) => {
    if (!files.has(file)) return;
    if (!(await load().catch(() => false))) return;
    for (const mod of server.moduleGraph.idToModuleMap.values()) {
      if (mod.file && MARKDOWN.test(mod.file)) server.moduleGraph.invalidateModule(mod);
    }
    server.ws.send({ type: 'full-reload' });
    logger.info('Code block markup changed: re-rendering markdown code blocks');
  });
}
