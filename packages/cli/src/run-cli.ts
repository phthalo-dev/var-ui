import { formatComponent, listComponents, unknownComponentMessage } from './commands/component';
import { formatGuide, listGuides, unknownGuideMessage } from './commands/docs';
import { initAgentsDocs } from './commands/init';
import { formatSearchHits } from './commands/search';
import { findInstalledReactVersion, staleCatalogWarning } from './catalog-freshness';
import { loadCatalog } from './load-catalog';
import { findComponent, findGuide } from './lookup';
import { parseCliArgs } from './parse-args';
import { searchCatalog } from './search';
import type { Catalog } from './types';

export type CliIo = {
  stdout: { write(chunk: string): void };
  stderr: { write(chunk: string): void };
  exit(code: number): void;
};

export type RunCliOptions = {
  cwd?: string;
  catalog?: Catalog;
};

export const HELP_TEXT = `Usage: var-ui <command>

Commands:
  init                 Write the AGENTS.md block
  component [name]     Look up a component or list all
  search <query>       Ranked search across components and guides
  docs [id]            Look up a guide or list all

Options:
  --json               Print JSON
  --list, -l           List all components or guides
  --all-props          Include inherited HTML/ARIA/DOM props in the table
`;

export function runCli(argv: string[], io: CliIo, options?: RunCliOptions): void {
  try {
    const parsed = parseCliArgs(argv);

    if (parsed.command === 'help') {
      io.stdout.write(HELP_TEXT);
      io.exit(0);
      return;
    }

    if (parsed.command === 'unknown') {
      io.stderr.write('Unknown command.\n');
      io.stderr.write(HELP_TEXT);
      io.exit(1);
      return;
    }

    const catalog = options?.catalog ?? loadCatalog();

    // The bundled docs catalog can lag the installed @var-ui/react (#129); say
    // so on stderr rather than serving stale docs silently. stdout stays clean
    // for --json consumers.
    const warning = staleCatalogWarning(
      catalog,
      findInstalledReactVersion(options?.cwd ?? process.cwd()),
    );
    if (warning) {
      io.stderr.write(`${warning}\n`);
    }

    if (parsed.command === 'component') {
      if (parsed.list) {
        io.stdout.write(listComponents(catalog));
        io.exit(0);
        return;
      }
      const query = parsed.query?.trim() ?? '';
      const record = query.length > 0 ? findComponent(catalog, query) : undefined;
      if (!record) {
        io.stderr.write(unknownComponentMessage(query));
        io.exit(1);
        return;
      }
      io.stdout.write(formatComponent(record, { json: parsed.json, allProps: parsed.allProps }));
      io.exit(0);
      return;
    }

    if (parsed.command === 'docs') {
      if (parsed.list) {
        io.stdout.write(listGuides(catalog));
        io.exit(0);
        return;
      }
      const query = parsed.query?.trim() ?? '';
      const record = query.length > 0 ? findGuide(catalog, query) : undefined;
      if (!record) {
        io.stderr.write(unknownGuideMessage(query));
        io.exit(1);
        return;
      }
      io.stdout.write(formatGuide(record, parsed.json));
      io.exit(0);
      return;
    }

    if (parsed.command === 'search') {
      const query = parsed.query.trim();
      if (query.length === 0) {
        io.stderr.write('search requires a query\n');
        io.exit(1);
        return;
      }
      io.stdout.write(formatSearchHits(searchCatalog(catalog, query), parsed.json));
      io.exit(0);
      return;
    }

    initAgentsDocs(options?.cwd ?? process.cwd(), catalog);
    io.stdout.write('Wrote Var UI agent docs.\n');
    io.exit(0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    io.stderr.write(`${message}\n`);
    io.exit(1);
  }
}
