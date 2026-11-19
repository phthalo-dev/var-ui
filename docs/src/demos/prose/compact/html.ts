import { prose } from '@var-ui/core';
import { mergeProps } from '../../../lib/mergeProps';
import { serializeHtmlTag } from '../../serializeHtml';

const BODY =
  '<h3>Build fixed</h3>' +
  '<p>The failure came from a stale <code>dist</code> folder. I rebuilt core and the tests pass again:</p>' +
  '<pre><code class="language-sh">vp run build\nvp test run</code></pre>' +
  '<ul><li>2,642 tests passed</li><li>See the <a href="#">CI run</a> for details</li></ul>';

export function render(): string {
  return serializeHtmlTag('div', { ...mergeProps(prose({ density: 'compact' })) }, BODY);
}
