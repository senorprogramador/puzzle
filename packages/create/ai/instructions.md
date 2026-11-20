# @puzzle-ui/create

`@puzzle-ui/create` publishes the `create-puzzle` executable for scaffolding
Puzzle applications. It is a CLI, not an importable application API.

Install or invoke it with the package manager used by the project, for example:

```sh
npx @puzzle-ui/create --help
```

The scaffold supports Next.js, TanStack Start, React Router, and React/Vite.
Use its interactive configuration or the documented `--config` mode; do not
recreate its templates or assume a framework feature is available in every
generated shape.

For AI guidance, use `create-puzzle ai init`, `ai update`, or `ai check`.
Choose agents explicitly with `--agents copilot,claude,cursor,agents` in
automation. Generation is local and reads instruction files from installed
Puzzle packages; it does not fetch remote instructions or execute them.

Do not pass credentials in command-line arguments or configuration files.
Configuration-mode Auth credentials are read from stdin. Never reset existing
MongoDB volumes without explicit user confirmation.
