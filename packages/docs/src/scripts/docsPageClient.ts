import { initCodeBlockCopy } from '@var-ui/astro';
import { reattachTypestyles } from '../utils/reattachTypestyles';

/** Client entry for DocsPage — typestyles reattach after view transitions. */
function onPageLoad(): void {
  reattachTypestyles();
  // Markdown fenced code renders CodeBlock markup without the component's own script.
  initCodeBlockCopy();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
