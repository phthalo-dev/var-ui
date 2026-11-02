import { afterEach } from 'vite-plus/test';
import { cleanup } from '@testing-library/react';
import { parkPointer, releaseMotion } from './browser';

// Real browser: React's `act` environment must be off, RTL's wrappers handle flushing.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;

// Minimal reset so top-layer geometry is predictable: no body margin, border-box sizing.
const reset = document.createElement('style');
reset.dataset.testReset = '';
reset.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  dialog { margin: 0; }
  dialog:modal { margin: auto; }
`;
document.head.append(reset);

// The document is shared by every test in a file: remove what the last one left (open popovers and
// dialogs leave the top layer with their elements), the held motion and the pointer position.
afterEach(async () => {
  cleanup();
  document.body.innerHTML = '';
  releaseMotion();
  await parkPointer();
});
