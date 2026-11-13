import { parseArgs } from 'node:util';

export type ParsedCli =
  | { command: 'help' }
  | { command: 'component'; list: boolean; query?: string; json: boolean; allProps: boolean }
  | { command: 'docs'; list: boolean; query?: string; json: boolean }
  | { command: 'search'; query: string; json: boolean }
  | { command: 'init' }
  | { command: 'unknown'; argv: string[] };

export function parseCliArgs(argv: string[]): ParsedCli {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    strict: false,
    options: {
      list: { type: 'boolean', short: 'l' },
      json: { type: 'boolean' },
      'all-props': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  if (values.help || positionals.length === 0) {
    return { command: 'help' };
  }

  const [command, ...rest] = positionals;
  const json = Boolean(values.json);
  const list = Boolean(values.list);

  if (command === 'component') {
    const query = rest[0];
    const allProps = Boolean(values['all-props']);
    return query === undefined
      ? { command: 'component', list, json, allProps }
      : { command: 'component', list, query, json, allProps };
  }

  if (command === 'docs') {
    const query = rest[0];
    return query === undefined
      ? { command: 'docs', list, json }
      : { command: 'docs', list, query, json };
  }

  if (command === 'search') {
    return { command: 'search', query: rest.join(' '), json };
  }

  if (command === 'init') {
    return { command: 'init' };
  }

  return { command: 'unknown', argv };
}
