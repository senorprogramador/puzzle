FROM oven/bun:1.4.4 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
# Root scripts invoke Bun from node_modules/.bin; install its npm launcher.
RUN node node_modules/bun/install.js
RUN bun run build
RUN bun run --filter workspace-next build

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

RUN groupadd --system app \
    && useradd --system --gid app --home-dir /app app

COPY --from=builder --chown=app:app \
    /app/apps/workspace-next/.next/standalone ./
COPY --from=builder --chown=app:app \
    /app/apps/workspace-next/.next/static ./apps/workspace-next/.next/static
COPY --from=builder --chown=app:app \
    /app/apps/workspace-next/public ./apps/workspace-next/public

WORKDIR /app/apps/workspace-next

USER app

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=5 \
    CMD node -e "const net=require('node:net');const s=net.connect(3000,'127.0.0.1');s.setTimeout(2500);s.on('connect',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1));s.on('timeout',()=>process.exit(1))"

CMD ["node", "server.js"]
