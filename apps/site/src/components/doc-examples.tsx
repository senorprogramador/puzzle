import { useRef, useState } from "react";
import {
  Accordion,
  Autocomplete,
  Backdrop,
  type AccordionValue,
  Button,
  Card,
  Carousel,
  CarouselController,
  Command,
  CommandDialog,
  DatePicker,
  Dialog,
  Drawer,
  FileUpload,
  FormField,
  NotificationProvider,
  Portal,
  PortalTarget,
  Popover,
  Select,
  Section,
  Slider,
  ScrollLock,
  Stack,
  Stepper,
  Tabs,
  Tooltip,
  Transition,
  useNotification,
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

const commandItems = [
  {
    id: "new-file",
    label: "New file",
    description: "Create a file in the current project",
    group: "File",
    keywords: ["create"],
    shortcut: "⌘N",
  },
  {
    id: "open-file",
    label: "Open file",
    description: "Browse files in the current project",
    group: "File",
    keywords: ["browse"],
    shortcut: "⌘O",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Configure your workspace",
    group: "Preferences",
    keywords: ["preferences"],
  },
  {
    id: "publish",
    label: "Publish project",
    group: "Project",
    disabled: true,
  },
];

export const CommandExample = () => {
  const [selected, setSelected] = useState("");

  return (
    <Stack>
      <Command
        commands={commandItems}
        autoFocus={false}
        onSelect={(command) => setSelected(command.label)}
      />
      <span role="status">
        {selected ? `Selected: ${selected}` : "Choose a command"}
      </span>
    </Stack>
  );
};

export const CommandDialogExample = () => {
  const [selected, setSelected] = useState("");

  return (
    <Stack>
      <Button variant="outline" onClick={() => setSelected("")}>
        Open the palette with ⌘K / Ctrl+K
      </Button>
      <CommandDialog
        title="Project commands"
        description="Search and choose an action."
        commands={commandItems}
        onSelect={(command) => setSelected(command.label)}
      />
      <span role="status">
        {selected ? `Selected: ${selected}` : "No command selected"}
      </span>
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

export const ControlledDatePickerExample = () => {
  const [date, setDate] = useState<Date | null>(new Date(2025, 2, 15));

  return (
    <Stack>
      <DatePicker
        label="Appointment"
        locale="en-GB"
        value={date}
        onChange={setDate}
        clearable
      />
      <span role="status">
        {date
          ? `Selected: ${date.toLocaleDateString("en-GB")}`
          : "No date selected"}
      </span>
    </Stack>
  );
};

export const DatePickerFormExample = () => {
  const [submittedDate, setSubmittedDate] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmittedDate(String(data.get("appointment")));
      }}
    >
      <Stack>
        <DatePicker
          label="Appointment date"
          name="appointment"
          locale="en-GB"
          defaultValue={new Date(2025, 2, 15)}
          required
        />
        <Button type="submit">Submit appointment</Button>
        <span role="status">
          {submittedDate ? `Submitted: ${submittedDate}` : "Not submitted"}
        </span>
      </Stack>
    </form>
  );
};

export const FileUploadSelectionExample = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack>
      <FileUpload multiple onChange={setFiles} />
      <span role="status">
        {files.length ? `Selected: ${files.map((file) => file.name).join(", ")}` : "No files selected"}
      </span>
    </Stack>
  );
};

export const FileUploadProgressExample = () => {
  const attemptedFiles = useRef(new WeakSet<File>());

  return (
    <FileUpload
      multiple
      description="Local simulation: each file fails once. Retry to complete it. No files are sent."
      onUpload={async (file, { signal, onProgress }) => {
        const firstAttempt = !attemptedFiles.current.has(file);
        attemptedFiles.current.add(file);

        for (const progress of [25, 50, 75, 100]) {
          await new Promise<void>((resolve) => setTimeout(resolve, 250));
          signal.throwIfAborted();
          onProgress(progress);

          if (firstAttempt && progress === 50) {
            throw new Error("Simulated failure. Retry this upload.");
          }
        }
      }}
    />
  );
};

export const AutocompleteExample = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <Stack>
      <Autocomplete label="Fruit" options={fruitOptions} value={value} onChange={setValue} />
      <span role="status">Selected: {value ?? "none"}</span>
    </Stack>
  );
};

export const DialogExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Review changes"
        description="Check your changes before continuing."
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <p>Your changes are ready.</p>
      </Dialog>
    </>
  );
};

export const DrawerExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer open={open} onOpenChange={setOpen} position="right" aria-label="Filters">
        <Section>
          <Stack>
            <p>Filter your results.</p>
            <Button onClick={() => setOpen(false)}>Close filters</Button>
          </Stack>
        </Section>
      </Drawer>
    </>
  );
};

export const BackdropExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Show backdrop</Button>
      <Backdrop open={open} onClose={() => setOpen(false)}>
        <Button onClick={() => setOpen(false)}>Close backdrop</Button>
      </Backdrop>
    </>
  );
};

const NotificationExampleControls = () => {
  const notification = useNotification();

  return (
    <Stack direction="row" wrap="wrap">
      <Button onClick={() => notification.success("Changes saved")}>Show success</Button>
      <Button variant="outline" onClick={() => notification.error("Could not save", { duration: 0 })}>Show error</Button>
      <Button variant="ghost" onClick={notification.dismissAll}>Dismiss all</Button>
    </Stack>
  );
};

export const NotificationExample = () => (
  <NotificationProvider label="Example notifications">
    <NotificationExampleControls />
  </NotificationProvider>
);

export const TransitionExample = () => {
  const [visible, setVisible] = useState(true);

  return (
    <Stack>
      <Button onClick={() => setVisible((current) => !current)}>Toggle content</Button>
      <Transition visible={visible} template="slide-in-up">
        <Card>Animated content</Card>
      </Transition>
    </Stack>
  );
};

export const ScrollLockExample = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Stack>
      <ScrollLock enabled={enabled} />
      <Button onClick={() => setEnabled((current) => !current)}>
        {enabled ? "Unlock preview scrolling" : "Lock preview scrolling"}
      </Button>
      <p>Scroll the preview, enable the lock, then try scrolling again.</p>
      {Array.from({ length: 10 }, (_, index) => <p key={index}>Example paragraph {index + 1}</p>)}
    </Stack>
  );
};

export const PortalExample = () => (
  <>
    <PortalTarget id="documentation-portal-target" aria-label="Portal destination" />
    <Portal targetId="documentation-portal-target">
      <Card>This content is rendered inside the target.</Card>
    </Portal>
  </>
);
