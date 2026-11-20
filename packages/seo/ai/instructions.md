# @puzzle-ui/seo

Use SEO for typed metadata, canonical URLs, Schema.org graphs and JSON-LD,
validation, sitemaps, robots rules, and framework adapter utilities. Keep
generation deterministic and separate from application-specific page content.

Install with `npm install @puzzle-ui/seo`. The manifest publishes a root API and
focused subpaths including `/core`, `/context`, `/schema`, `/metadata`, `/react`,
`/server`, `/sitemap`, `/robots`, `/testing`, `/validation`, `/urls`, `/next`,
`/tanstack`, and `/react-router`. Select a subpath appropriate to the runtime;
React is optional.

Validate schema and metadata input, serialize JSON-LD safely, and preserve
canonical URL normalization. Use generated Schema.org definitions through the
published API rather than copying internal generated files.

Do not assume framework adapters are part of the root API or import private
paths. See the [SEO documentation](https://puzzle-ui.com/docs/seo).
