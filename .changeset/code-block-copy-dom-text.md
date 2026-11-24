---
'@var-ui/core': minor
'@var-ui/astro': minor
'@var-ui/docs': minor
---

Code block copy and install blocks (#336, #337):

- `initCodeBlockCopy` copies the text of the block's visible `pre code` when the button has no `data-var-ui-code`, and `codeBlockMarkup()` only writes that attribute with the new `embedCode: true`, so fences are no longer in the HTML twice. Astro `CodeBlock` still embeds it for line-numbered and diff blocks. `codeBlockMarkup`'s `code` is optional. New `codeBlockCopyText(button)` export from `@var-ui/astro`.
- New `@var-ui/docs/package-install` entry: `packageInstallMarkup({ commands })` (HTML string, the same markup as `PackageInstall`), `packageInstallCommands(packages, { dev })`, `initPackageInstall(container?)` and `PACKAGE_MANAGER_STORAGE_KEY`. `PackageInstall` accepts `commands` instead of `packages`, and its tab ids are numbered per page instead of random.
