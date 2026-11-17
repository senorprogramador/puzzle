#!/usr/bin/env bash
set -euo pipefail

root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
app="${1:-}"
tag="${2:-}"
env_file="${WORKSPACE_ENV_FILE:-$root/.env.workspace}"

case "$app" in
  next|workspace-next) service=workspace-next ;;
  tanstack|workspace-tanstack) service=workspace-tanstack ;;
  *)
    echo "Usage: $0 <next|tanstack> <git-sha>" >&2
    exit 2
    ;;
esac

if [[ ! "$tag" =~ ^[0-9a-f]{7,40}$ ]]; then
  echo "Usage: $0 <next|tanstack> <git-sha> (7-40 lowercase hexadecimal characters)" >&2
  exit 2
fi

if [[ ! -f "$env_file" ]]; then
  echo "Workspace environment file not found: $env_file" >&2
  echo "Copy deploy/workspace/.env.example to .env.workspace and set required values." >&2
  exit 1
fi

cd "$root"
export WORKSPACE_IMAGE_TAG="$tag"
compose=(docker compose --env-file "$env_file" -f docker-compose.workspace.yml)

current_container="$("${compose[@]}" ps -q "$service")"
if [[ -n "$current_container" ]]; then
  current_image="$(docker inspect --format '{{.Config.Image}}' "$current_container")"
  echo "Replacing $current_image with puzzle-$service:$tag"
fi

"${compose[@]}" up -d --wait --wait-timeout 180 mongodb
"${compose[@]}" up -d --no-deps --force-recreate --wait --wait-timeout 180 "$service"
echo "Deployed $service at image tag $tag."
