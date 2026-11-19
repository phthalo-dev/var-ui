# @var-ui/cli

CLI for discovering Var UI components, guides, and agent docs.

Install as a **dev dependency**. Invoke with `npx @var-ui/cli` or `pnpm dlx @var-ui/cli`.
Bare `npx var-ui` is unreliable (unscoped name). After install, add a
`"var-ui": "var-ui"` script so agents and humans can run `pnpm var-ui`.

## Install

```bash
pnpm add -D @var-ui/cli
```

```json
{
  "scripts": {
    "var-ui": "var-ui"
  }
}
```

## Commands

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `var-ui init`      | Write the AGENTS.md block                  |
| `var-ui component` | Look up a component or list all            |
| `var-ui search`    | Ranked search across components and guides |
| `var-ui docs`      | Look up a guide or list all                |
| `var-ui tokens`    | List design tokens and their CSS variables |

```bash
npx @var-ui/cli --help
pnpm dlx @var-ui/cli component --list
```

### Design tokens

`var-ui tokens [query] [--json]` lists every design token with its CSS variable and default value. The query matches the token path or the variable name, ignoring case and `-` / `.` separators, so `font-size`, `fontSize` and a pasted `--var-ui-font-size-md` all find `fontSize.*`.

```
$ var-ui tokens space
space.none   --var-ui-space-none   0rem
space.xxs    --var-ui-space-xxs    0.25rem
…
$ var-ui tokens text.primary
color.text.primary  --var-ui-color-text-primary  #14110D / oklch(0.955 0.004 70) (light / dark)
```
