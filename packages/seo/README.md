# @puzzle-ui/seo

Framework-independent SEO toolkit for Puzzle.

The package provides:

- Deterministic Schema.org graph generation.
- A generated Schema.org registry.
- Schema validation.
- JSON-LD serialization.
- React components for structured data.
- Server-compatible rendering.
- Sitemap and robots.txt utilities.

## Graph Engine

The Graph Engine provides a deterministic JSON-LD graph builder with
node normalization, ID generation, reference resolution, merging,
validation and safe serialization.

### Creating nodes

```ts
import { createSeoNode } from "@puzzle-ui/seo";

const organization = createSeoNode(
  {
    "@type": "Organization",
    name: "Example",
    url: "https://example.com",
  },
  {
    baseUrl: "https://example.com",
  },
);
```

Node IDs are generated deterministically using the node type and
available identity properties.

An explicit ID overrides the generated ID.

### Building a graph

```ts
import { createSeoGraphBuilder } from "@puzzle-ui/seo";

const builder = createSeoGraphBuilder({
  baseUrl: "https://example.com",
});

builder.add({
  "@type": "Organization",
  name: "Example",
});

builder.add({
  "@type": "WebSite",
  name: "Example Website",
});

const graph = builder.build();
```

Every builder instance maintains its own state.

### Inline nodes

Nested nodes are extracted into independent graph nodes.

```ts
const graph = createSeoGraphBuilder({
  baseUrl: "https://example.com",
})
  .add({
    "@type": "WebPage",
    name: "Home",
    author: {
      "@type": "Person",
      name: "John Doe",
    },
  })
  .build();
```

The author is represented by an @id reference in the WebPage
and registered as an independent graph node.

### References

References can point to nodes added before or after the referencing
node. Self-references and cyclic references are supported through @id.

```ts
const graph = buildSeoGraph(
  [
    {
      "@type": "WebPage",
      "@id": "https://example.com/#page",
      publisher: {
        "@id": "https://example.com/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      name: "Example",
    },
  ],
  {
    baseUrl: "https://example.com",
  },
);
```

### Merging

Nodes sharing the same @id are deduplicated and merged.

Complementary properties are combined, arrays are deduplicated
and conflicting scalar values are reported.

IDs and Schema.org types are normalized before merging. Distinct types
are combined without conflicts. Conflict properties use dotted paths,
such as name or address.addressLocality.

The default conflict strategy is deterministic.

Available strategies:

- deterministic: resolve conflicts consistently, independent of
  insertion order.
- first: retain the first conflicting value.
- last: retain the last conflicting value.
- error: report conflicting values as validation errors.

```ts
const builder = createSeoGraphBuilder({
  baseUrl: "https://example.com",
  conflictStrategy: "error",
});
```

### Validation

```ts
import { validateSeoGraph } from "@puzzle-ui/seo";

const result = validateSeoGraph(graph, {
  baseUrl: "https://example.com",
  strictReferences: true,
});

if (!result.valid) {
  console.error(result.issues);
}
```

Validation covers graph structure, node IDs, duplicate IDs,
node types and unresolved local references.

External references are allowed by default.

### Serialization

```ts
import { serializeSeoGraph } from "@puzzle-ui/seo";

const result = serializeSeoGraph(graph, {
  pretty: true,
  scriptSafe: true,
});

if (result.errors.length > 0) {
  console.error(result.errors);
}

const jsonLd = result.value;
```

Serialization is deterministic and escapes HTML-sensitive
characters by default.

Unicode is preserved.

## React Schema Components

The React integration provides a central provider and a collection
of Schema.org components.

All components register their data in one graph. The provider renders
one JSON-LD script after its children have registered their nodes.

This avoids multiple independent JSON-LD scripts and allows nodes
registered in different components to reference and merge with each other.

### Provider setup

```tsx
import {
  SeoProvider,
  LDOrganization,
  LDWebSite,
  LDWebPage,
} from "@puzzle-ui/seo";

const config = {
  siteUrl: "https://example.com",
  identity: {
    name: "Example",
    url: "https://example.com",
  },
};

export const Root = () => (
  <SeoProvider config={config}>
    <LDOrganization
      id="#organization"
      name="Example"
      url="https://example.com"
    />

    <LDWebSite
      id="#website"
      name="Example Website"
      url="https://example.com"
      publisher={{
        "@id": "https://example.com/#organization",
      }}
    />

    <LDWebPage
      id="#webpage"
      name="Home"
      url="https://example.com"
      isPartOf={{
        "@id": "https://example.com/#website",
      }}
    />
  </SeoProvider>
);
```

The provider creates an isolated graph builder for every render.

It accepts the following properties:

| Property       | Description                        |
| -------------- | ---------------------------------- |
| config         | Required SEO configuration         |
| children       | Descendant components              |
| scriptId       | ID of the central JSON-LD script   |
| nonce          | CSP nonce applied to the script    |
| graphOptions   | Graph builder options              |
| schemaRegistry | Custom Schema.org registry         |
| validation     | Schema validation options or false |

The graph builder's base URL defaults to config.siteUrl.

### Automatic and explicit IDs

Every registered node receives a deterministic ID from the Graph Engine.

You can override the generated ID with the id property:

```tsx
<LDOrganization id="#organization" name="Example" />
```

The resulting ID is:

```text
https://example.com/#organization
```

Use stable identifiers for entities that should be referenced by
other nodes, such as organizations, websites, authors and pages.

### Available Schema.org components

The React integration provides the following components:

| Component                        | Schema.org type     |
| -------------------------------- | ------------------- |
| LDOrganization                   | Organization        |
| LDPerson                         | Person              |
| LDWebSite / LDWebsite            | WebSite             |
| LDWebPage                        | WebPage             |
| LDArticle                        | Article             |
| LDBlogPosting                    | BlogPosting         |
| LDBreadcrumbList / LDBreadcrumbs | BreadcrumbList      |
| LDProduct                        | Product             |
| LDOffer                          | Offer               |
| LDAggregateRating                | AggregateRating     |
| LDReview                         | Review              |
| LDLocalBusiness                  | LocalBusiness       |
| LDService                        | Service             |
| LDImageObject                    | ImageObject         |
| LDVideoObject                    | VideoObject         |
| LDEvent                          | Event               |
| LDRecipe                         | Recipe              |
| LDCourse                         | Course              |
| LDJobPosting                     | JobPosting          |
| LDPlace                          | Place               |
| LDPostalAddress                  | PostalAddress       |
| LDContactPoint                   | ContactPoint        |
| LDSearchAction                   | SearchAction        |
| LDItemList                       | ItemList            |
| LDSoftwareApplication            | SoftwareApplication |
| LDHowTo                          | HowTo               |
| LDFaqPage / LDFAQPage            | FAQPage             |
| LDCollectionPage                 | CollectionPage      |
| LDProfilePage                    | ProfilePage         |

### Type-specific properties

Component properties are derived from the generated Schema.org
definitions.

The property names include inherited properties from parent types.
For example, Organization receives the common properties inherited
from Thing.

```tsx
import {
  LDOrganization,
  LDSearchAction,
  LDPostalAddress,
} from "@puzzle-ui/seo";

const StructuredData = () => (
  <>
    <LDOrganization
      name="Example"
      legalName="Example Ltd"
      url="https://example.com"
    />

    <LDSearchAction
      query="required name"
      target={{
        "@type": "EntryPoint",
        urlTemplate: "https://example.com/search?q={search_term_string}",
      }}
    />

    <LDPostalAddress
      streetAddress="Main Street 1"
      addressLocality="Madrid"
      postalCode="28001"
      addressCountry="ES"
    />
  </>
);
```

Properties that do not belong to a component's Schema.org type
are rejected by TypeScript.

`schema:generate` also generates the type-specific property map, including
inherited properties, so runtime definitions and TypeScript stay in sync.

For properties not represented in the generated definitions,
use the data property:

```tsx
<LDOrganization
  name="Example"
  data={{
    customProperty: "custom-value",
  }}
/>
```

### Generic Schema component

Use Schema when you need a type that does not have a dedicated
React component.

```tsx
import { Schema } from "@puzzle-ui/seo";

<Schema
  type="CustomType"
  id="#custom"
  data={{
    name: "Example",
    customProperty: "custom-value",
  }}
/>;
```

The generic component accepts arbitrary Schema.org type names.
The registry still controls validation.

### SchemaGraph

SchemaGraph registers an existing collection of nodes or a complete
graph into the provider's central graph.

```tsx
import { SchemaGraph, LDOrganization } from "@puzzle-ui/seo";

const nodes = [
  {
    "@type": "Organization",
    "@id": "#organization",
    name: "Example",
  },
  {
    "@type": "WebSite",
    "@id": "#website",
    name: "Example Website",
  },
] as const;

const StructuredData = () => (
  <>
    <SchemaGraph nodes={nodes} />

    <LDOrganization id="#organization" description="Example organization" />
  </>
);
```

You can also supply an existing graph:

```tsx
<SchemaGraph graph={existingGraph} />
```

All nodes are registered through the provider's existing graph builder.
Duplicate IDs are handled by the Graph Engine.

### SchemaReference

SchemaReference registers a reference entity using its ID.

```tsx
import { SchemaReference, LDWebPage } from "@puzzle-ui/seo";

const StructuredData = () => (
  <>
    <SchemaReference id="#organization" type="Organization" />

    <LDWebPage
      name="About"
      publisher={{
        "@id": "https://example.com/#organization",
      }}
    />
  </>
);
```

The type is optional and defaults to Thing.

When a complete node with the same ID is registered elsewhere,
the Graph Engine merges the reference with that node.

For references to entities that are already defined in the graph,
you can also use an ordinary @id object directly in a property.

### SchemaScript and SeoJsonLd

SchemaScript and SeoJsonLd are aliases for registering existing
JSON-LD data into the central graph.

```tsx
import { SchemaScript, SeoJsonLd } from "@puzzle-ui/seo";

const StructuredData = () => (
  <>
    <SchemaScript
      data={{
        "@type": "Organization",
        name: "Example",
      }}
    />

    <SeoJsonLd
      data={[
        {
          "@type": "WebSite",
          name: "Example Website",
        },
        {
          "@type": "WebPage",
          name: "Home",
        },
      ]}
    />
  </>
);
```

Both components support:

- A single Schema.org node.
- An array of Schema.org nodes.
- A complete graph.

Neither component renders an independent script element.
The provider remains responsible for rendering the central JSON-LD script.

### useSeo

Use useSeo to access the active SEO configuration and register
additional nodes from custom components.

```tsx
import { useSeo } from "@puzzle-ui/seo";

const CustomStructuredData = () => {
  const seo = useSeo();

  seo.registerNode({
    "@type": "Organization",
    "@id": "#organization",
    name: seo.config.identity.name,
  });

  return null;
};
```

The hook must be used inside SeoProvider.

### Validation

Schema validation is enabled by default.

Strict validation rejects unknown Schema.org types and properties.

````tsx
<SeoProvider
config={config}
validation={{
    strict: true,
  }}

>   <LDOrganization name="Example" />
> </SeoProvider>
> ```

Disable validation when integrating custom or non-standard
Schema.org definitions:

```tsx
<SeoProvider
config={config}
validation={false}

> <Schema

    type="CustomType"
    data={{
      name: "Example",
    }}

/>
</SeoProvider>
````

A custom registry can be supplied through schemaRegistry.

### CSP nonce

The central JSON-LD script supports a Content Security Policy nonce.

````tsx
<SeoProvider
config={config}
nonce={requestNonce}

>   <LDOrganization name="Example" />
> </SeoProvider>
> ```

The nonce is applied to the single central script element.

## API

### Graph Engine

| Function              | Description                                    |
| --------------------- | ---------------------------------------------- |
| createSeoNode         | Normalize and create a node                    |
| normalizeSeoId        | Normalize an absolute, relative or fragment ID |
| createSeoGraphBuilder | Create an isolated graph builder               |
| buildSeoGraph         | Build a graph from multiple nodes              |
| mergeSeoNodes         | Merge two nodes sharing an ID                  |
| resolveSeoReferences  | Normalize an existing graph and its references |
| validateSeoGraph      | Validate graph structure and references        |
| serializeSeoGraph     | Serialize JSON-LD and return validation issues |
| stringifySeoGraph     | Serialize JSON-LD directly to a string         |

### React integration

| Export          | Description                                         |
| --------------- | --------------------------------------------------- |
| SeoProvider     | Central graph provider and JSON-LD renderer         |
| Schema          | Generic Schema.org node component                   |
| SchemaGraph     | Register an existing graph or node collection       |
| SchemaReference | Register an entity reference                        |
| SchemaScript    | Register existing JSON-LD data                      |
| SeoJsonLd       | Backwards-compatible JSON-LD registration component |
| useSeo          | Access the active SEO configuration and graph       |

The package also exports all dedicated LD components listed above.

## Schema.org source

The generated registry is based on Schema.org version 30.1.

The generated definitions are maintained separately from the
hand-written registry extensions.

Run the following commands from the package directory:

```sh
bun run schema:generate
bun run schema:check
````

The check command verifies that the committed generated definitions
match the pinned Schema.org source data.

## Package scripts

| Script           | Description                                       |
| ---------------- | ------------------------------------------------- |
| schema:generate  | Generate Schema.org definitions                   |
| schema:check     | Verify generated Schema.org definitions           |
| build            | Check generated definitions and build the package |
| typecheck        | TypeScript source typecheck                       |
| typecheck:test   | TypeScript test typecheck                         |
| test:unit        | Run unit tests                                    |
| test:integration | Build and run integration tests                   |
| test:boundaries  | Run package boundary tests                        |
| test:package     | Run package integration tests                     |
| test:schema      | Run schema-related typechecks                     |
| vitest           | Run the package test suites                       |
