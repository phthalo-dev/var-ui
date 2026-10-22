import { describe, expect, it } from 'vite-plus/test';
import * as pkg from '../src/index';
import { buildPackageExportsAudit, entryPathFor } from './lib/package-exports-audit';

describe('@var-ui/core public exports', () => {
  it('matches the export inventory snapshot', () => {
    const audit = buildPackageExportsAudit(pkg as Record<string, unknown>, entryPathFor());
    expect(audit).toMatchSnapshot();
  });
});
