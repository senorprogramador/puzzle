FROM oven/bun:1.4.4 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

# Build all workspace packages first.
RUN bun run build

# Build the production website.
RUN bun run --filter '@puzzle-ui/site' build


FROM node:24-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /app

RUN groupadd --system app \
    && useradd --system --gid app app

COPY --from=builder --chown=app:app \
    /app/apps/site/.output \
    ./.output

USER app

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]