import { defineDocs } from "fumadocs-mdx/macro";
import { loader } from "fumadocs-core/source";
import { pageSchema } from "fumadocs-core/source/schema";

import { faqSchema } from "./faq";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    async: true,
    schema: pageSchema.extend({
      faq: faqSchema.optional(),
    }),
  },
});
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
