# @puzzle-ui/storage-mongodb

Foundation package for Puzzle Auth.

This package establishes public entry points and dependency boundaries. Feature implementations are intentionally added in subsequent Puzzle Auth features.

## Build

```sh
bun run build
bun run typecheck
bun run test
```

Tests require Docker with Docker Compose. The test script starts MongoDB as a
replica set and removes the test container and volume afterward. On failure, it
prints container status and MongoDB logs before cleanup so startup failures are
visible in CI.
