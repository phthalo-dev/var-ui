// Direct module import: the `@var-ui/docs/utils` barrel pulls Node-only modules
// (`write-markdown-views` uses node:fs) into this client script (var-ui#169).
import { reattachTypestyles } from '../../../packages/docs/src/utils/reattachTypestyles';

export { reattachTypestyles };

function onPageLoad(): void {
  reattachTypestyles();
}

onPageLoad();
document.addEventListener('astro:page-load', onPageLoad);
