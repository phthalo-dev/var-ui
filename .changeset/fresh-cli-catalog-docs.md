---
'@var-ui/cli': patch
---

Keep the shipped docs catalog from going stale against @var-ui/react. The generated catalog now records the @var-ui/* versions and git commit it was built from, `var-ui` warns on stderr when the installed @var-ui/react does not match the catalog, and a CI check fails when core/react/icons/astro have a pending changeset but the CLI does not, so the CLI is republished whenever the catalog changes.
