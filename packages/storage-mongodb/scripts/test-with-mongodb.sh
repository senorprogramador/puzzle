#!/usr/bin/env bash

set -Eeuo pipefail

PACKAGE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$PACKAGE_ROOT/docker-compose.yml"

compose() {
  docker compose \
    --project-directory "$PACKAGE_ROOT" \
    -f "$COMPOSE_FILE" \
    "$@"
}

cleanup() {
  local exit_code=$?

  trap - EXIT

  if [[ "$exit_code" -ne 0 ]]; then
    echo ""
    echo "MongoDB test setup or conformance tests failed (exit $exit_code)."
    echo "Container status:"
    compose ps -a || true
    echo "MongoDB container logs:"
    compose logs --no-color --timestamps mongodb || true
  fi

  echo ""
  echo "Stopping MongoDB test container..."

  compose down -v || true

  exit "$exit_code"
}

trap cleanup EXIT

echo "Starting MongoDB..."

compose up -d --wait --wait-timeout 60 mongodb

echo "Initializing replica set..."

compose exec -T mongodb mongosh --quiet --eval '
  try {
    rs.status();
  } catch (error) {
    rs.initiate({
      _id: "rs0",
      members: [
        {
          _id: 0,
          host: "localhost:27017"
        }
      ]
    });
  }
'

echo "Waiting for MongoDB primary..."

ready=0

for attempt in {1..30}; do
  if compose exec -T mongodb mongosh --quiet \
    --eval 'rs.status().myState === 1' 2>/dev/null | grep -q true; then
    ready=1
    break
  fi

  sleep 1
done

if [[ "$ready" != "1" ]]; then
  echo "MongoDB did not become primary in time."
  exit 1
fi

echo "MongoDB is ready."

export MONGODB_TEST_URI="mongodb://127.0.0.1:27017/?replicaSet=rs0"
export MONGODB_TEST_DATABASE="puzzle_storage_test"
export MONGODB_TEST_TRANSACTIONS="true"

cd "$PACKAGE_ROOT"

echo ""
echo "Running MongoDB conformance tests..."

bun test tests/conformance.test.ts

echo ""
echo "MongoDB conformance tests completed."
