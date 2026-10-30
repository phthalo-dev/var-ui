---
'@var-ui/react': minor
'@var-ui/astro': minor
'@var-ui/core': minor
---

Remove the duplicate `SimpleGrid` and `VStack` components.

- `SimpleGrid` is gone (React component, `simpleGrid` core recipe and `simple-grid` class). Use `<Grid columns={n} gap="...">`; `Grid` `columns` now also accepts `5`, `6` and `8`, and `cols`/`spacing` become `columns`/`gap`.
- `VStack` is gone (React and Astro). Use `<Stack>`, which is vertical by default. `HStack` stays.

`Grid` columns now use `minmax(0, 1fr)` for every fixed track (previously plain `1fr` for 1-4), so wide content no longer stretches a column.
