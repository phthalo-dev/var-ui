---
'@var-ui/core': minor
'@var-ui/react': patch
'@var-ui/astro': patch
'@var-ui/docs': patch
---

New `codeBlockMarkup({ code, language, filename, copyable, … })` in core: the structure of a code block (header, language label, copy button, body, `pre`, `code`) as plain attribute maps. The React and Astro `CodeBlock`s and the docs Shiki transformer all render from it, so they can't drift. They had: markdown fences put the language in the filename slot, showed a visible "Copy" label, and used `data-copy-error-label`, which the copy script never read. The root also carries `data-language`.

**Fix (react):** a `CodeBlock` without highlighted HTML double-escaped its code, so `<div>` showed as `&lt;div&gt;`.
