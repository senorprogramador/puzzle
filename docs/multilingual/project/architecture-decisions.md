# Multilingual architecture decisions

## D-001 — Begin with one package and explicit subpaths

The initial implementation uses `@puzzle-ui/i18n` rather than creating a
package for every logical module. Locale/runtime/compiler code has no framework
workspace dependency; React stays behind optional `/react` and `/devtools`
subpaths. TypeScript scanning and Vite integrations are isolated subpaths with
optional peers; filesystem and process APIs remain isolated to the Node-only
sources and CLI entries. Framework-specific packages are deferred until native,
fixture-tested integrations justify their boundaries.

**Status:** Accepted for the current pre-release foundation.

## D-002 — Use ICU MessageFormat through FormatJS

Messages use `intl-messageformat` rather than a Puzzle-specific syntax. This
avoids maintaining an incompatible parser and supplies locale-aware plural,
select, number, date, and time behavior. The public `t()` API returns plain
strings; rich ICU tags are rendered through a separate typed React hook that
accepts explicit components and does not inject HTML.

**Status:** Accepted.

## D-003 — Keep locale state per translator/render tree

The runtime has no process-global active locale. A translator captures its
resolved locale, immutable catalogs, and per-translator formatter cache. React
bindings select a translator from the provider's locale prop. This is the base
invariant for future SSR and concurrent request integrations; framework-level
hydration and cancellation still require fixtures.

**Status:** Accepted.

## D-004 — Integrate with Puzzle SEO by producing compatible values

The `/seo` subpath only creates canonical and `hreflang` metadata values for
the existing `@puzzle-ui/seo` contracts. SEO graph, metadata rendering, and
sitemap behavior stay owned by `@puzzle-ui/seo`.

**Status:** Accepted; localized sitemap and Schema.org language helpers are
implemented. Open Graph and framework metadata integration remain open.

## D-005 — Suggestions require explicit approval

AI is an injected provider contract with no model or secret dependency.
Suggestions are syntax/placeholder validated and returned as `approved: false`.
Applying a suggestion requires an explicit reviewer and optimistic version
check through a review store, which also records audit history.

**Status:** Accepted; the in-memory store is for tests/demos. Production
persistence and reviewer authorization remain application-owned.

## D-006 — Keep CMS content and catalog loading separate

JSON catalog sources only load translation messages. Localized CMS content uses
a separate source contract and resolver for locale fallback, versions, draft
preview, and validation, avoiding coupling runtime translation to a vendor SDK.

**Status:** Accepted; vendor adapters and preview authorization remain
application-owned.
