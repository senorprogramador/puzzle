import { Stack } from "@puzzle-ui/ui/components/layout/stack";
import {
  Accordion,
  type AccordionItemData,
} from "@puzzle-ui/ui/components/navigation/accordion";

const items: AccordionItemData[] = [
  {
    title: "Actions",
    content: (
      <ul role="list" className="px-4">
        <Stack as="li" direction="col" gap="sm">
          <a href="/components/actions/button">Button</a>
          <a href="/components/actions/button-group">Button Group</a>
        </Stack>
      </ul>
    ),
  },
];

const ComponentsAccordion = () => {
  return <Accordion items={items} />;
};

export { ComponentsAccordion };
