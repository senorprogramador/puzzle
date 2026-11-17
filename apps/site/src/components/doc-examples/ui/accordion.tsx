import { useState } from "react";
import { Accordion, type AccordionValue, Button, Stack } from "@puzzle-ui/ui";

export const shippingItems = [
  {
    id: "shipping",
    title: "Shipping",
    content: "Orders ship within two business days.",
  },
  {
    id: "returns",
    title: "Returns",
    content: "Return unused items within 30 days.",
  },
  {
    id: "support",
    title: "Support",
    content: "Contact our team for help with your order.",
    disabled: true,
  },
];

export const ControlledAccordionExample = () => {
  const [value, setValue] = useState<AccordionValue>("shipping");

  return (
    <Stack>
      <Button variant="outline" onClick={() => setValue("returns")}>
        Show returns
      </Button>
      <Accordion
        items={shippingItems}
        type="single"
        value={value}
        onValueChange={setValue}
      />
    </Stack>
  );
};
