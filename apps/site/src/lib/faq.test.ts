import { describe, expect, it } from "bun:test";

import { createFaqMainEntity, faqSchema, formatFaqMarkdown } from "./faq";

const canonical = "https://puzzle-ui.com/docs/ui/data-display/paper";

const faq = [
  { question: "Does Paper add padding?", answer: "No." },
  { question: "Which elevations exist?", answer: "1 through 24." },
];

describe("faqSchema", () => {
  it("accepts and trims question and answer pairs", () => {
    expect(
      faqSchema.parse([{ question: "  Question?  ", answer: " Answer. " }]),
    ).toEqual([{ question: "Question?", answer: "Answer." }]);
  });

  it("rejects empty lists, blank text, unknown keys, and duplicates", () => {
    expect(faqSchema.safeParse([]).success).toBe(false);
    expect(faqSchema.safeParse([{ question: " ", answer: "A" }]).success).toBe(
      false,
    );
    expect(
      faqSchema.safeParse([{ question: "Q", answer: "A", html: "<b>A</b>" }])
        .success,
    ).toBe(false);
    expect(
      faqSchema.safeParse([
        { question: "Same?", answer: "A" },
        { question: "same?", answer: "B" },
      ]).success,
    ).toBe(false);
  });
});

describe("createFaqMainEntity", () => {
  it("creates page-scoped Question and Answer entities", () => {
    expect(createFaqMainEntity(canonical, faq)).toEqual([
      {
        "@type": "Question",
        "@id": `${canonical}#faq-1`,
        name: "Does Paper add padding?",
        acceptedAnswer: {
          "@type": "Answer",
          "@id": `${canonical}#faq-1-answer`,
          text: "No.",
        },
      },
      {
        "@type": "Question",
        "@id": `${canonical}#faq-2`,
        name: "Which elevations exist?",
        acceptedAnswer: {
          "@type": "Answer",
          "@id": `${canonical}#faq-2-answer`,
          text: "1 through 24.",
        },
      },
    ]);
  });
});

describe("formatFaqMarkdown", () => {
  it("formats FAQs for llms-full.txt", () => {
    expect(formatFaqMarkdown(faq)).toBe(
      [
        "### Frequently asked questions",
        "",
        "#### Does Paper add padding?",
        "",
        "No.",
        "",
        "#### Which elevations exist?",
        "",
        "1 through 24.",
      ].join("\n"),
    );
  });
});
