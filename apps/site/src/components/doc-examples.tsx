import { useState } from "react";
import {
  Accordion,
  type AccordionValue,
  Button,
  Card,
  Carousel,
  CarouselController,
  FormField,
  Popover,
  Select,
  Slider,
  Stack,
  Stepper,
  Tabs,
  Tooltip,
} from "@puzzle/ui";

export const shippingItems = [
  { id: "shipping", title: "Shipping", content: "Orders ship within two business days." },
  { id: "returns", title: "Returns", content: "Return unused items within 30 days." },
  { id: "support", title: "Support", content: "Contact our team for help with your order.", disabled: true },
];

export const carouselItems = [
  { id: "design", title: "Design", description: "Start with a clear visual language." },
  { id: "build", title: "Build", description: "Compose reusable components." },
  { id: "test", title: "Test", description: "Check behavior across devices." },
  { id: "ship", title: "Ship", description: "Share your work with the world." },
];

export const fruitOptions = [
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" },
  { value: "orange", label: "Orange" },
  { value: "mango", label: "Mango", disabled: true },
];

export const ControlledTooltipExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack alignH="center">
      <Tooltip open={open} onOpenChange={setOpen} trigger={<Button variant="outline">Focus or hover me</Button>}>
        Your changes are saved automatically.
      </Tooltip>
      <span role="status">{open ? "Tooltip open" : "Tooltip closed"}</span>
    </Stack>
  );
};

export const ControlledPopoverExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} title="Ready to continue?" trigger={<Button>Review changes</Button>}>
      <Stack>
        <p>Your changes are ready to save.</p>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Stack>
    </Popover>
  );
};

export const ControlledTabsExample = () => {
  const [activeId, setActiveId] = useState("overview");

  return (
    <Tabs activeId={activeId} onActivate={setActiveId}>
      <Tabs.Tab id="overview" tab="Overview">Selected tab: {activeId}</Tabs.Tab>
      <Tabs.Tab id="details" tab="Details">Selected tab: {activeId}</Tabs.Tab>
    </Tabs>
  );
};

export const ControlledAccordionExample = () => {
  const [value, setValue] = useState<AccordionValue>("shipping");

  return (
    <Stack>
      <Button variant="outline" onClick={() => setValue("returns")}>Show returns</Button>
      <Accordion items={shippingItems} type="single" value={value} onValueChange={setValue} />
    </Stack>
  );
};

export const ControlledCarouselExample = () => {
  const [panel, setPanel] = useState(0);

  return (
    <Stack>
      <Button variant="outline" onClick={() => setPanel(0)}>Back to first item</Button>
      <CarouselController items={carouselItems} currentPanel={panel} onPanelChange={setPanel}>
        <Carousel<(typeof carouselItems)[number]>
          getItemKey={(item) => item.id}
          renderItem={(item) => <Card><strong>{item.title}</strong><p>{item.description}</p></Card>}
          backButton={<Button variant="outline">Previous</Button>}
          nextButton={<Button variant="outline">Next</Button>}
          buttonAlignment="aside"
          renderPager={(current, total) => <span role="status">Page {current + 1} of {total}</span>}
        />
      </CarouselController>
    </Stack>
  );
};

export const ControlledStepperExample = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Stack>
      <Stepper activeStep={activeStep} onStepChange={setActiveStep} clickable>
        <Stepper.Step label="Details" />
        <Stepper.Step label="Shipping" />
        <Stepper.Step label="Payment" />
      </Stepper>
      <Stack direction="row">
        <Button variant="outline" disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
        <Button disabled={activeStep === 2} onClick={() => setActiveStep(activeStep + 1)}>Continue</Button>
      </Stack>
      <span role="status">Step {activeStep + 1} of 3</span>
    </Stack>
  );
};

export const ControlledSliderExample = () => {
  const [volume, setVolume] = useState(40);

  return (
    <Stack>
      <FormField label="Volume">
        <Slider value={volume} onChange={setVolume} showValue formatValue={(value) => value + "%"} />
      </FormField>
      <span role="status">Selected volume: {volume}%</span>
    </Stack>
  );
};

export const ControlledSelectExample = () => {
  const [fruit, setFruit] = useState<string | undefined>("apple");

  return (
    <Stack>
      <Select label="Favorite fruit" options={fruitOptions} value={fruit} onChange={setFruit} />
      <span role="status">Selected: {fruit ?? "none"}</span>
    </Stack>
  );
};
