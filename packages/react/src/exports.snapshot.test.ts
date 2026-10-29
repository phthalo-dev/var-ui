import { describe, expect, it } from 'vite-plus/test';
import * as components from './components';
import * as root from './index';

const runtimeNames = (mod: Record<string, unknown>) => Object.keys(mod).sort();

describe('@var-ui/react public exports', () => {
  it('root entry runtime exports match the snapshot', () => {
    expect(runtimeNames(root)).toMatchSnapshot();
  });

  it('components barrel runtime exports match the snapshot', () => {
    expect(runtimeNames(components)).toMatchSnapshot();
  });
});
