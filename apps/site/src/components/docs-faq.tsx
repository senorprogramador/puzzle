import { Accordion, Text } from "@puzzle-ui/ui";

import { DocsHeading2 } from "@/components/mdx";
import {
  FAQ_SECTION_ID,
  FAQ_SECTION_TITLE,
  type FaqItem,
} from "@/lib/faq";

interface DocsFaqProps {
  faq: readonly FaqItem[];
}

export const DocsFaq = ({ faq }: DocsFaqProps) => (
  <section aria-labelledby={FAQ_SECTION_ID}>
    <DocsHeading2 id={FAQ_SECTION_ID}>{FAQ_SECTION_TITLE}</DocsHeading2>
    <Accordion
      headingLevel={3}
      items={faq.map(({ question, answer }, index) => ({
        id: index,
        title: question,
        content: <Text as="p">{answer}</Text>,
      }))}
    />
  </section>
);
