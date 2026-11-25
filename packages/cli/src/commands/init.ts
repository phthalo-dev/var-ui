import fs from 'node:fs';
import path from 'node:path';
import type { Catalog } from '../types';

export const AGENTS_START = '<!-- var-ui-agents:start -->';
export const AGENTS_END = '<!-- var-ui-agents:end -->';

export function renderAgentsBlock(catalog: Catalog): string {
  const bullets = catalog.components
    .map((record) => `- ${record.name} (\`${record.slug}\`) — ${record.description}`)
    .join('\n');
  return [
    AGENTS_START,
    '# Var UI',
    '',
    'Prefer `@var-ui/react` components and `@var-ui/core` tokens. Do not invent raw `<div>` chrome or magic hex colors.',
    '',
    'Install `@var-ui/react`, `@var-ui/core`, and optionally `@var-ui/icons`. Peers: `typestyles`, `react`, `react-dom`, `react-aria-components`. Import `@var-ui/core/styles.css` once in the app. `typestyles` is a peer: install it too. Do not add `@typestyles/vite` unless extracting custom CSS.',
    '',
    'CLI: `npx @var-ui/cli component <Name>`, `npx @var-ui/cli search <query>`, `npx @var-ui/cli tokens <query>` (CSS variable names), `npx @var-ui/cli docs getting-started`. Bare `npx var-ui` is unreliable.',
    '',
    bullets,
    AGENTS_END,
  ].join('\n');
}

export function applyAgentsBlock(existing: string | null, block: string): string {
  if (existing === null || existing === '') {
    return block;
  }
  const start = existing.indexOf(AGENTS_START);
  const end = existing.indexOf(AGENTS_END);
  if ((start === -1) !== (end === -1) || (start !== -1 && end < start)) {
    throw new Error('Incomplete var-ui agents block: both start and end markers are required.');
  }
  if (start !== -1 && end !== -1 && end >= start) {
    return existing.slice(0, start) + block + existing.slice(end + AGENTS_END.length);
  }
  return `${existing}\n\n${block}`;
}

export function initAgentsDocs(cwd: string, catalog: Catalog): void {
  const block = renderAgentsBlock(catalog);
  const agentsPath = path.join(cwd, 'AGENTS.md');
  const agentsExisting = fs.existsSync(agentsPath) ? fs.readFileSync(agentsPath, 'utf8') : null;
  fs.writeFileSync(agentsPath, applyAgentsBlock(agentsExisting, block), 'utf8');

  const claudePath = path.join(cwd, 'CLAUDE.md');
  if (!fs.existsSync(claudePath)) {
    return;
  }
  const claudeExisting = fs.readFileSync(claudePath, 'utf8');
  fs.writeFileSync(claudePath, applyAgentsBlock(claudeExisting, block), 'utf8');
}
