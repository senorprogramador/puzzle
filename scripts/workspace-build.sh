#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
tag="${1:-}"
platform="${WORKSPACE_PLATFORM:-linux/amd64}"

if [[ ! "$tag" =~ ^[0-9a-f]{7,40}$ ]]; then
  echo "Usage: $0 <git-sha> (7-40 lowercase hexadecimal characters)" >&2
  exit 2
fi

docker build --pull --platform "$platform" -f apps/workspace-next/Dockerfile -t "puzzle-workspace-next:$tag" "$root"
docker build --pull --platform "$platform" -f apps/workspace-tanstack/Dockerfile -t "puzzle-workspace-tanstack:$tag" "$root"
