# @puzzle-ui/seo

Framework-independent SEO toolkit for Puzzle.

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
node.

Self-references and cyclic references are supported through @id.

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
such as `name` or `address.addressLocality`.

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

### API

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
