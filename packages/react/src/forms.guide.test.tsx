/**
 * Keeps `docs/content/docs/forms.mdx` honest: every `tsx` snippet of the guide must be one of the
 * examples in `test/formsGuide.tsx`, which the integration tests render and submit. The Astro
 * snippet is checked against the markup the React `TextField` renders.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vite-plus/test';
import { render } from '@testing-library/react';
import { textField } from '@var-ui/core/components/textField';
import { TextField } from './components/TextField';

const read = (relative: string) =>
  readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8');
const guide = read('../../../docs/content/docs/forms.mdx');
const examples = read('./test/formsGuide.tsx');

const regions = new Map<string, string>();
for (const match of examples.matchAll(
  /\/\/ #region guide:([\w-]+)\n([\s\S]*?)\/\/ #endregion guide:\1/g,
)) {
  regions.set(match[1]!, match[2]!.trim());
}

const fences = [...guide.matchAll(/```(\w+)\n([\s\S]*?)```/g)].map((m) => ({
  lang: m[1]!,
  code: m[2]!.trim(),
}));

/** The snippet without its leading `import` lines. */
function body(code: string): string {
  const lines = code.split('\n');
  let i = 0;
  while (i < lines.length && (lines[i]!.startsWith('import ') || lines[i]!.trim() === '')) i++;
  return lines.slice(i).join('\n').trim();
}

describe('forms guide', () => {
  it('has one region per example', () => {
    expect([...regions.keys()].sort()).toEqual(
      [
        'controller',
        'date-field',
        'focus-first',
        'native-field',
        'native-form',
        'register',
        'rhf-server',
        'server-errors',
      ].sort(),
    );
  });

  it('shows every example verbatim', () => {
    const shown = new Set(fences.filter((f) => f.lang === 'tsx').map((f) => body(f.code)));
    for (const [id, code] of regions) {
      expect(shown.has(code), `region "${id}" is missing or differs in forms.mdx`).toBe(true);
    }
  });

  it('shows no tsx snippet that the tests do not exercise', () => {
    const exercised = new Set(regions.values());
    for (const fence of fences.filter((f) => f.lang === 'tsx')) {
      expect(exercised.has(body(fence.code)), `unverified snippet:\n${fence.code}`).toBe(true);
    }
  });

  it('imports only what @var-ui/react exports', async () => {
    const exported = await import('./index');
    for (const fence of fences.filter((f) => f.lang === 'tsx')) {
      for (const match of fence.code.matchAll(/import \{([^}]*)\} from '@var-ui\/react'/g)) {
        for (const raw of match[1]!.split(',')) {
          const name = raw.trim();
          if (name) expect(name in exported, `${name} is not exported`).toBe(true);
        }
      }
    }
  });

  it('links the live demo, which the Form page embeds', () => {
    const formPage = read('../../../docs/content/components/form.mdx');
    expect(formPage).toContain('<Demo id="form.server-errors" />');
    expect(guide).toContain('/components/form#server-errors-and-pending');
  });

  it('astro snippet: uses the textField recipe slots that the React TextField renders', () => {
    const astro = fences.find((f) => f.lang === 'astro')!.code;
    const slots = [...astro.matchAll(/mergeProps\(t\.(\w+)\)/g)].map((m) => m[1]!);
    const recipe = textField({ size: 'md' }) as unknown as Record<string, string>;
    expect(slots.sort()).toEqual(['description', 'error', 'input', 'label', 'root']);
    const { container } = render(
      <TextField label="Email" description="Hint" errorMessage="Oops" />,
    );
    for (const slot of slots) {
      expect(recipe[slot], `recipe has no ${slot} slot`).toBeTruthy();
      const className = String(recipe[slot]).split(' ')[0]!;
      expect(
        container.querySelector(`.${className}`),
        `React renders no .${className}`,
      ).toBeTruthy();
    }
    // label[for] -> input[id], and the input points at the hint or the error by id.
    expect(astro).toContain('for="email"');
    expect(astro).toContain('id="email"');
    expect(astro).toContain("aria-describedby={error ? 'email-error' : 'email-hint'}");
  });
});
