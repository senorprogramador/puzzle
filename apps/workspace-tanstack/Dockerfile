FROM oven/bun:1.4.4 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
# Root scripts invoke Bun from node_modules/.bin; install its npm launcher.
RUN node node_modules/bun/install.js
RUN bun run build
RUN bun run --filter workspace-tanstack build

FROM oven/bun:1.4.4-slim AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN groupadd --system app \
    && useradd --system --gid app --home-dir /app app

COPY --from=builder --chown=app:app \
    /app/apps/workspace-tanstack/.output ./.output

USER app

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
    CMD bun -e "await fetch('http://127.0.0.1:3000/')"

CMD ["bun", ".output/server/index.mjs"]
