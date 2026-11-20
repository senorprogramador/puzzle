# @puzzle-ui/i18n

Framework-agnostic locale, translation, formatting, routing, catalog validation,
and multilingual SEO primitives, with an optional React integration.

This workspace package is pre-release and has not been published to npm.

## Install

After publication, install with `bun add @puzzle-ui/i18n`. In this repository,
the package is available through the Bun workspace.

Install React 19 when using the `@puzzle-ui/i18n/react` entry point.

## Quick start

```ts
import { createI18n } from "@puzzle-ui/i18n";

const i18n = createI18n({
  locales: [{ locale: "en" }, { locale: "nl" }],
  defaultLocale: "en",
  catalogs: {
    en: { greeting: "Hello {name}", files: "{count, plural, one {# file} other {# files}}" },
    nl: { greeting: "Hallo {name}", files: "{count, plural, one {# bestand} other {# bestanden}}" },
  },
});

const t = i18n.createTranslator("nl").t;
t("greeting", { name: "Ada" });
t("files", { count: 2 });
```

Catalogs and locale bindings are immutable per runtime instance. Create a
translator for each request or render tree; do not keep a mutable global
current locale. The runtime uses ICU message syntax through
[`intl-messageformat`](https://formatjs.io/docs/intl-messageformat/).

## Public entry points

- `@puzzle-ui/i18n`: locale registry, resolution, typed translation runtime,
  Intl formatting, and catalog utilities.
- `@puzzle-ui/i18n/routing`: safe locale-prefixed path matching and generation.
- `@puzzle-ui/i18n/react`: a provider factory, translation/locale hooks, an
  accessible locale select control, rich-text and lazy namespace hooks, locale
  document attributes, and locale-bound Intl formatter hooks.
- `@puzzle-ui/i18n/devtools`: an opt-in diagnostics store and React panel for
  runtime and route events; request adapters can report configured route-map
  outcomes using parameter-free route templates. Dynamically import it only in
  development builds.
- `@puzzle-ui/i18n/next`, `/tanstack`, and `/react-router`: request-locale
  resolution helpers compatible with their native route/server-loader APIs.
- `@puzzle-ui/i18n/compiler`: catalog consistency checks and type declaration
  generation, locale-aware declarations, and optional TypeScript AST
  extraction/transforms at `/compiler/typescript`.
- `@puzzle-ui/i18n/vite`: a Vite plugin for catalog and source diagnostics.
- `Translator.rich`: framework-neutral ICU rich-tag formatting; the React
  integration provides `useRichTranslation` for React nodes and
  `useNamespace` for lazy namespace loading.
- `@puzzle-ui/i18n/sources`: immutable in-memory/HTTP JSON catalog sources;
  `/sources/node` adds filesystem loading.
- `@puzzle-ui/i18n/content`: versioned content resolution with locale fallback,
  draft preview gating, an adapter-owned validation hook, and an injected-client
  Sanity content source.
- `@puzzle-ui/i18n/cli`: command implementation behind the `puzzle-i18n`
  binary for initialization, catalog validation, source scanning, and
  declaration generation, with project-config support.
- `@puzzle-ui/i18n/seo`: canonical and hreflang data compatible with
  `@puzzle-ui/seo`'s `SeoPageMetadata`, route-map validation, and Schema.org
  language helpers; `/seo/sitemap` delegates localized sitemap generation to
  `@puzzle-ui/seo`.
- `@puzzle-ui/i18n/ai`: an injected suggestion-provider contract that validates
  ICU syntax and placeholders, supports authorization and quality checks,
  rate-limits requests, and provides an optimistic human-review workflow with
  in-memory and transactional persistence adapters.

See the [multilingual documentation](https://puzzle-ui.com/docs/multilingual)
for API details and current limitations.

## Current scope

This pre-release provides the framework-independent runtime, React bindings,
localized routing utilities, JSON/HTTP/filesystem/TypeScript catalog sources,
catalog validation, AST transforms and type generation, a Vite validation
plugin, localized SEO metadata and sitemaps, versioned content resolution with
an injected-client Sanity adapter, and an authorized, quality-scored human
translation-review workflow. Next.js, TanStack Start/Router, and React Router
fixture applications exercise request resolution and framework-native
rendering APIs; the helpers do not register application routes or middleware.
Provider credentials, database implementations, CMS clients, identity, and
reviewer authorization remain owned by the consuming application. TypeScript 5
and Vite are optional peers for compiler scanning and the Vite plugin.
