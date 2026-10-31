import { describe, expect, it } from 'vite-plus/test';
import '../../src/styles';
import { popover } from '../../src/components/popover';

describe('popover', () => {
  it('preserves the public root class name', () => {
    const classes = popover();

    expect(classes.root.className).toBeTruthy();
    expect(classes.root.className).toContain('var-ui-popover');
  });

  it('has no arrow slot', () => {
    expect(Object.keys(popover())).not.toContain('arrow');
  });
});
