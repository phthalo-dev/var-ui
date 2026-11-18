import { describe, expect, it } from 'vite-plus/test';
import { codeLanguageLabel } from '../src/components/codeBlock';

describe('codeLanguageLabel', () => {
  it('maps language ids to one display convention', () => {
    expect(codeLanguageLabel('tsx')).toBe('TSX');
    expect(codeLanguageLabel('bash')).toBe('Shell');
    expect(codeLanguageLabel('typescript')).toBe('TS');
    expect(codeLanguageLabel('yaml')).toBe('YAML');
  });
});
