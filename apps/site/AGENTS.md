# Documentation site – AI development instructions

## Purpose and architecture

This is Puzzle's documentation and component-catalog site, built with TanStack Start, TanStack Router, Vite, Nitro, React, and Fumadocs MDX. Routes live under [`src/routes/`](./src/routes/); the root route owns the application shell, theme, document head, outlet, and scripts. Treat this as a full-stack documentation app, not as the implementation home for package components.

## Content and MDX

- Documentation lives in [`content/docs/`](./content/docs/). Follow the existing section and slug structure; component pages use frontmatter with `title` and `description`.
- UI pages belong under `ui/<category>/<component>.mdx`; Pieces pages belong in the established `pieces/` catalog structure. For package overviews, follow an existing overview and the package-overview checks rather than inventing a second catalog format.
- Use Fumadocs `<Preview>` for runnable examples. Import components explicitly from their public package entry points and use nearby MDX pages as the source of truth for imports and prop examples.
- Keep stateful/reusable examples in the site's existing `doc-examples` modules and import them using the nearby page's relative-path pattern. Do not put application-only state or package internals in a published example.
- Add each new documentation route to [`src/components/layout/sidebar.tsx`](./src/components/layout/sidebar.tsx) in the appropriate section. Keep its `href` aligned with the route slug.

## Catalog, search, and SEO

The site includes a component catalog, package overviews, search, and SEO/technical endpoints. Search and route-level SEO behavior live in `src/routes/` and `src/lib/`; structured metadata is composed with `@puzzle-ui/seo`. For changes to catalog inputs, MDX imports, package overviews, or tutorial content, update the corresponding focused test/validator as well as the page.

The route tree also serves robots, sitemap, `llms.txt`, and `llms-full.txt` resources. Keep structured data, canonical metadata, and generated route responses consistent with the site's configured origin; do not duplicate SEO generation in MDX.

## Theme and fonts

The root layout configures `@puzzle-ui/theme` and framework-aware link/image components. Font configuration is [`src/puzzle-fonts.json`](./src/puzzle-fonts.json); development and production builds download configured local fonts before starting Vite. After changing font configuration, run `bun run fonts:download` and verify the resulting local-font behavior.

## Validation

Run commands from `apps/site/`:

- `bun run typecheck`
- `bun run test:seo`
- `bun run test:sitemap`
- `bun run test:seo:smoke`
- `bun run test:catalog`
- `bun run test:mdx`
- `bun run test:tutorials`
- `bun run test:hydration`
- `bun run test:preview-layout`
- `bun run validate:seo`
- `bun run build`
- `bun run start` to exercise the production server

`bun run dev` also downloads fonts before starting the development server. Use `test:preview-layout` for preview layout changes, `test:hydration` for SSR/hydration changes, and the MDX/catalog/tutorial validators for their corresponding content. Use the existing browser/Playwright checks when a change depends on rendered browser behavior; do not substitute a successful typecheck for visual or interaction validation.

## Context-efficient workflow

Inspect the matching MDX page, its example imports, sidebar entry, and the narrowest relevant test first. Read the root route or Vite configuration only when changing app-wide rendering, theme, SEO, or build behavior. See the [site package manifest](./package.json) for the authoritative scripts and the [site architecture guide](./content/docs/architecture.mdx) for application context.
