# Workspace deployment

The production Compose stack runs both Workspace apps with one private,
persistent MongoDB replica set. MongoDB has no published host port and is only
reachable on the Compose-internal database network. The app containers join
that network and the existing external `webproxy` network; they do not publish
host ports. The `VIRTUAL_HOST`, `VIRTUAL_PORT`, `LETSENCRYPT_HOST`, and
`LETSENCRYPT_EMAIL` environment variables follow the repository's existing
nginx-proxy/Let's Encrypt convention. Confirm the proxy and certificate
companion use the same external network.

## Configure the host

From the repository root, create a private environment file and fill in the
required values:

```sh
cp deploy/workspace/.env.example .env.workspace
```

Set both app domains and exact HTTPS `APP_ORIGIN` values (no trailing slash),
the certificate email, and unique secrets. Generate each MongoDB password and
each `AUTH_ENCRYPTION_KEY_HEX` with:

```sh
openssl rand -hex 32
```

Use the generated 64-character hex values for `MONGODB_ROOT_PASSWORD`,
`MONGODB_NEXT_APP_PASSWORD`, `MONGODB_TANSTACK_APP_PASSWORD`, and each
`WORKSPACE_*_AUTH_ENCRYPTION_KEY_HEX`. Set each
`WORKSPACE_*_AUTH_RATE_LIMIT_SECRET` to a separate random value of at least
32 characters. Keep `.env.workspace` private and backed up securely; do not
commit it or paste secrets into command arguments.

The app database names and usernames should use stable alphanumeric values.
Changing credentials in this file alone does not change users in an already
initialized MongoDB volume. Use your database administrator's credential
rotation process instead.

Ensure the proxy's external Docker network exists. The default name is
`webproxy`; set `WEBPROXY_NETWORK` if your proxy uses a different name:

```sh
docker network inspect webproxy >/dev/null 2>&1 || docker network create webproxy
```

Validate Compose interpolation before starting services:

```sh
docker compose --env-file .env.workspace -f docker-compose.workspace.yml config --quiet
```

## Build and deploy

Build both production images from a Git commit SHA (7–40 lowercase hex
characters):

```sh
SHA="$(git rev-parse --short=12 HEAD)"
./scripts/workspace-build.sh "$SHA"
```

The build script targets `linux/amd64` by default. Set
`WORKSPACE_PLATFORM=linux/arm64` when deploying to an ARM64 host.

The images are `puzzle-workspace-next:$SHA` and
`puzzle-workspace-tanstack:$SHA`. Make the selected image available on the
deployment host, either through your image registry or by transferring an
archive created with `docker save` and loading it there with `docker load`.
The deploy script starts MongoDB and waits for its replica-set health check,
then recreates the selected app and waits for its health check:

```sh
./scripts/workspace-deploy.sh next "$SHA"
./scripts/workspace-deploy.sh tanstack "$SHA"
```

The script uses `.env.workspace` by default. To use another private file, set
`WORKSPACE_ENV_FILE=/path/to/file` for the command. Compose keeps the
MongoDB data in the named `puzzle-workspace-mongodb-data` volume and its
replica-set keyfile in `puzzle-workspace-mongodb-config`. Ordinary `compose
down` leaves those volumes intact; do not use `down --volumes` unless you
intend to permanently delete the database.

## Roll back

Retain the prior image SHA when deploying. To restore that version, ensure its
image is available on the host and run:

```sh
./scripts/workspace-rollback.sh next <previous-sha>
./scripts/workspace-rollback.sh tanstack <previous-sha>
```

Rollback uses the same health-checked deployment path. It rolls back the app
image, not MongoDB data; no automatic database migrations or seed commands are
currently configured. Avoid deploying application changes that require
irreversible data changes without a separate backup and recovery plan.

## Troubleshooting

- Check `docker compose --env-file .env.workspace -f
  docker-compose.workspace.yml ps` and inspect the health state.
- For startup and replica-set issues, read
  `docker compose --env-file .env.workspace -f docker-compose.workspace.yml
  logs mongodb`. The replica set advertises the internal host
  `mongodb:27017`; app containers must remain attached to the `database`
  network.
- If an app is unhealthy, check its logs and confirm `APP_ORIGIN`,
  authentication secrets, and the URI's database/user values agree with the
  initialized volume. Do not delete the volume to fix an authentication
  mismatch.
- If the app is healthy but unreachable, confirm DNS points to the host, the
  proxy and app share the configured external network, and the proxy sees the
  app's `VIRTUAL_HOST` and `VIRTUAL_PORT=3000` settings.
- If Compose reports a missing variable, set it in `.env.workspace`. Shell
  variables override values from `--env-file`.
