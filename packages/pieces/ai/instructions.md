# @puzzle-ui/pieces

Use Pieces for composable React page sections. Pieces are presentation
components; the application owns routing, data loading, validation,
authentication, payments, availability, and backend behavior.

Install with `npm install @puzzle-ui/pieces`. Components are named exports from
the package root (`@puzzle-ui/pieces`); family subpaths are not public. Find a
component in the published documentation and confirm its export, props, and
supported variants in the installed types before using it.

Compose a page from purpose-fit sections, UI primitives, and semantic Theme
tokens. Keep layouts fluid and mobile-first; supply meaningful alternative text
and consumer-owned actions, links, copy, and media.

Do not add fetches, navigation, persistence, or business rules to a Piece. Do
not assume a universal variant or item type, deep-import a family, or infer API
stability from a component name. See the [Pieces documentation](https://puzzle-ui.com/docs/pieces).
