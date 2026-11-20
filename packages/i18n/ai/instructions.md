# Using Puzzle Multilingual

These instructions are for developers and AI coding agents working in an
application that installs `@puzzle-ui/i18n`.

## Install and supported scope

This workspace package is pre-release and has not been published to npm.
Confirm its availability before installing it from a registry.

Install `@puzzle-ui/i18n`. React 19 is an optional peer and is needed only for
`@puzzle-ui/i18n/react`. The current release exposes:

- The framework-independent runtime and formatting APIs from the package root.
- Locale-prefixed path utilities from `@puzzle-ui/i18n/routing`.
- React provider bindings from `@puzzle-ui/i18n/react`.
- Catalog validation and type generation from `@puzzle-ui/i18n/compiler`.
- TypeScript source transforms and source-map generation from
  `@puzzle-ui/i18n/compiler/typescript`.
- Canonical/hreflang metadata values from `@puzzle-ui/i18n/seo`.
- Request-locale helpers from `@puzzle-ui/i18n/next`, `/tanstack`, and
  `/react-router`.
- The optional diagnostics collector and panel from `@puzzle-ui/i18n/devtools`;
  dynamically import this entry only in development builds.
- An injected suggestion and review-workflow API from `@puzzle-ui/i18n/ai`.
- In-memory/HTTP JSON sources from `@puzzle-ui/i18n/sources` and Node
  filesystem sources from `@puzzle-ui/i18n/sources/node`.
- Versioned locale-fallback content resolution and an injected-client Sanity
  source from `@puzzle-ui/i18n/content`.
- The `puzzle-i18n` binary for non-destructive initialization, validation,
  declaration generation, and source scanning.
- TypeScript AST scanning from `@puzzle-ui/i18n/compiler/typescript` and
  build-time validation from `@puzzle-ui/i18n/vite`; both require optional
  TypeScript 5 and Vite peers as applicable.

The framework adapters resolve locale from native request/header/route-loader
values; they do not register routes or implement middleware. The Sanity source
accepts an application-owned client and does not add a vendor SDK or credentials.
The CLI loads project configuration for validation, type generation, and
scanning. No built-in AI provider or application identity system is included.
Do not invent imports or claim support for other CMS integrations.

## Configure locales and catalogs

Create one runtime from BCP 47 locale definitions and catalogs, then create a
translator for each request or render tree:

```ts
import { createI18n } from "@puzzle-ui/i18n";

const i18n = createI18n({
  locales: [{ locale: "en" }, { locale: "nl" }],
  defaultLocale: "en",
  catalogs: {
    en: { greeting: "Hello {name}" },
    nl: { greeting: "Hallo {name}" },
  },
});

const t = i18n.createTranslator("nl").t;
t("greeting", { name: "Ada" });
```

Translation keys and required interpolation values are inferred from the
catalogs.

## Messages and formatting

The root runtime uses `IntlMessageFormat` for ICU messages and platform `Intl`
for number, currency, date, relative-time, and list formatting. `t()` returns
plain text. In React, use `useRichTranslation` for ICU tag syntax and supply
explicit React components; never pass translation strings to
`dangerouslySetInnerHTML`. Use `useLocaleAttributes` for document `lang` and
`dir`, and the corresponding formatter hooks when formatting within a render
tree.

Never store a current locale in a module global. Resolve a locale from request
data with `resolveLocale`, then create a translator for that request. A
translator closes over one locale and does not mutate the runtime. In React,
create bindings once from the configured runtime and provide the request/render
locale through the provider.

## Routing and SEO

Use `@puzzle-ui/i18n/routing` only for safe same-origin locale-prefixed paths.
It does not implement framework routes, localized slugs, domains, or redirects.
Use `@puzzle-ui/i18n/seo` to create canonical/hreflang values for the existing
`@puzzle-ui/seo` metadata APIs rather than creating a competing SEO provider.
Use `validateLocalizedSeo` to check route-map coverage and canonical collisions,
`withStructuredDataLocale` for Schema.org `inLanguage`, and
`@puzzle-ui/i18n/seo/sitemap` to generate reciprocal localized alternates via
the existing SEO sitemap engine.

## Catalog sources and CLI

Use `@puzzle-ui/i18n/sources` for memory, TypeScript, or HTTP JSON catalogs and
`@puzzle-ui/i18n/sources/node` for filesystem JSON catalogs. The CLI supports
`validate`, `generate-types`, and `scan` from a validated project config or
with explicit paths; `init` creates non-overwriting config and catalog files.
Review the CLI help for config overrides and command-specific options.

Filesystem sources use `<root>/<locale>.json` for a complete catalog and
`<root>/<locale>/<namespace path>.json` for a namespace. HTTP sources support
per-locale/namespace caching, explicit invalidation, retries, timeouts, and
abort signals. Keep credentials server-side and never cache across locales.
Pass a source as `namespaceLoader` to `createI18n`; `loadNamespace` and
`useNamespace` load it for the requested locale and its fallback chain. Handle
the hook's explicit `loading`, `ready`, and `error` states.

## Catalog checks and AI suggestions

Use `@puzzle-ui/i18n/compiler` for ICU syntax, locale key, and placeholder
validation and declaration generation, including locale-difference output.
Use `@puzzle-ui/i18n/compiler/typescript` for static key extraction and safe
literal-key transforms with source maps. Use `@puzzle-ui/i18n/vite` for
build-time catalog and source validation.

Use `@puzzle-ui/i18n/ai` only from a trusted server environment with an injected
provider; never expose provider credentials or source content to clients. The
returned suggestion always has `approved: false`; provider calls are blocked in
browser runtimes. Use
`createAuthorizedSuggestionProvider` to gate provider requests, and configure
terminology/context quality checks as advisory signals. Use
`createTranslationReviewWorkflow` and
`createTransactionalTranslationReviewStore` with an application persistence
implementation for durable suggestions, atomic revision checks, and audit
history. The in-memory store is only for tests and demos. The host application
must still authenticate and authorize reviewers; no API key or provider package
is included.

## Agent workflow

1. Read the actual public exports from `@puzzle-ui/i18n` and the entry point
   matching the application framework.
2. Reuse the app's existing locale and route configuration.
3. Do not import package internals or invent hooks, middleware, loaders, or
   configuration fields.
4. Keep server secrets and request-specific state on the server/request.
5. Add tests for configuration, fallback, SSR isolation, route behavior, and
   locale switching.
6. Run the application's typecheck, tests, and production build after changes.
