import * as z from "zod/v4";

import type { SchemaValue } from "@puzzle-ui/seo";

export const FAQ_SECTION_ID = "faq";
export const FAQ_SECTION_TITLE = "Frequently asked questions";

const faqText = z.string().trim().min(1);

/**
 * Optional frontmatter for documentation FAQs. Answers are plain text so the
 * visible section and FAQPage JSON-LD contain exactly the same content.
 */
export const faqSchema = z
  .array(
    z
      .object({
        question: faqText,
        answer: faqText,
      })
      .strict(),
  )
  .min(1)
  .superRefine((items, context) => {
    const questions = new Set<string>();

    items.forEach(({ question }, index) => {
      const key = question.toLowerCase();

      if (questions.has(key)) {
        context.addIssue({
          code: "custom",
          message: `Duplicate FAQ question: ${question}`,
          path: [index, "question"],
        });
      }

      questions.add(key);
    });
  });

export type FaqItem = z.infer<typeof faqSchema>[number];

export const getFaqQuestionId = (canonical: string, index: number): string =>
  `${canonical}#${FAQ_SECTION_ID}-${index + 1}`;

/**
 * Builds page-scoped Question entities. Explicit IDs prevent identical
 * questions on different pages from merging into one site-wide entity.
 */
export const createFaqMainEntity = (
  canonical: string,
  faq: readonly FaqItem[],
): SchemaValue[] =>
  faq.map(({ question, answer }, index) => {
    const id = getFaqQuestionId(canonical, index);

    return {
      "@type": "Question",
      "@id": id,
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        "@id": `${id}-answer`,
        text: answer,
      },
    };
  });

export const formatFaqMarkdown = (faq: readonly FaqItem[]): string =>
  [
    `### ${FAQ_SECTION_TITLE}`,
    ...faq.flatMap(({ question, answer }) => [
      "",
      `#### ${question}`,
      "",
      answer,
    ]),
  ].join("\n");
