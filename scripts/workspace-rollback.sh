#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$#" -ne 2 ]]; then
  echo "Usage: $0 <next|tanstack> <previous-git-sha>" >&2
  exit 2
fi

exec "$script_dir/workspace-deploy.sh" "$1" "$2"
