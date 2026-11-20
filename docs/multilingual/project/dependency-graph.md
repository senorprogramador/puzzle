# Multilingual dependency graph

The current package is intentionally standalone in the workspace graph. Its
ICU dependency is external, and React is an optional peer available only to the
`/react` subpath.

```mermaid
flowchart LR
  app["Consumer application"] --> i18n["@puzzle-ui/i18n"]
  reactApp["React 19 application"] --> i18nReact["@puzzle-ui/i18n/react"]
  i18nReact --> i18n
  diagnostics["@puzzle-ui/i18n/devtools"] --> i18n
  diagnostics --> reactApp
  i18n --> intl["intl-messageformat"]
  i18nCli["@puzzle-ui/i18n/cli"] --> compiler["@puzzle-ui/i18n/compiler"]
  i18nCli --> i18nSources["@puzzle-ui/i18n/sources"]
  i18nCli --> node["Node.js APIs"]
  i18nFile["@puzzle-ui/i18n/sources/node"] --> node
  i18nContent["@puzzle-ui/i18n/content"] --> cms["Consumer CMS adapter"]
  i18nCompiler["@puzzle-ui/i18n/compiler/typescript"] --> typescript["Optional TypeScript 5 peer"]
  i18nVite["@puzzle-ui/i18n/vite"] --> vite["Optional Vite peer"]
  i18nVite --> i18nCompiler
  i18nNext["@puzzle-ui/i18n/next"] --> request["Native Request/Headers"]
  i18nTanStack["@puzzle-ui/i18n/tanstack"] --> request
  i18nRouter["@puzzle-ui/i18n/react-router"] --> request
  i18nSeo["@puzzle-ui/i18n/seo"] -. metadata .-> seo["@puzzle-ui/seo"]
  i18nSitemap["@puzzle-ui/i18n/seo/sitemap"] --> seoSitemap["@puzzle-ui/seo/sitemap"]
  i18nAi["@puzzle-ui/i18n/ai"] --> provider["Consumer-injected AI provider"]
  i18nAi --> reviewStore["Consumer review store"]
```

`@puzzle-ui/i18n/seo` does not import or replace the SEO engine. Framework
helpers stay framework-package independent, and the content/AI flows depend on
consumer-provided CMS and review-store adapters. Node APIs are isolated to the
CLI and `/sources/node` subpaths; HTTP uses platform `fetch`. Compiler scanning
and Vite integration stay behind optional peers. See the repository
[dependency map](../../../ai/architecture/dependency-map.md) for workspace
relationships.
