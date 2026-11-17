import { useRef, useState, type ReactNode } from "react";
import {
  AnnouncementSection,
  BenefitsSection,
  ComparisonSection,
  CTASection,
  FAQSection,
  FeaturesSection,
  HowItWorksSection,
  LogoCloudSection,
  StatsSection,
  TestimonialsSection,
} from "@puzzle-ui/pieces";
import type {
  AnnouncementVariant,
  BenefitItem,
  BenefitsVariant,
  ComparisonFeature,
  ComparisonOption,
  ComparisonVariant,
  CTAVariant,
  FAQItem,
  FAQVariant,
  FeatureItem,
  FeaturesVariant,
  HowItWorksItem,
  HowItWorksVariant,
  LogoCloudItem,
  LogoCloudVariant,
  StatItem,
  StatsVariant,
  TestimonialItem,
  TestimonialsVariant,
} from "@puzzle-ui/pieces";
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
  DropdownMenu,
  FileUpload,
  FormField,
  Image,
  ImageBox,
  type ImageBoxImage,
  Preview,
  NotificationProvider,
  Portal,
  PortalTarget,
  ResizablePanels,
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
} from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";

const sectionPreviewImages = {
  workspace:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
  team:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
  dashboard:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  product:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
  mobile:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85",
  landscape:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
  portraitOne:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
  portraitTwo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  portraitThree:
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85",
  portraitFour:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=85",
} as const;

const SectionPreviewImage = ({
  src,
  alt,
  aspectRatio = "16 / 9",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) => (
  <img
    src={src}
    alt={alt}
    loading="eager"
    decoding="async"
    style={{
      display: "block",
      width: "100%",
      aspectRatio,
      borderRadius: "var(--puzzle-radius-md, 0.5rem)",
      objectFit: "cover",
    }}
  />
);

const SectionPreviewVideo = () => (
  <video
    aria-label="Short video preview"
    controls
    muted
    playsInline
    preload="none"
    poster={sectionPreviewImages.team}
    style={{
      display: "block",
      width: "100%",
      aspectRatio: "16 / 9",
      borderRadius: "var(--puzzle-radius-md, 0.5rem)",
      objectFit: "cover",
    }}
  >
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      type="video/mp4"
    />
    Your browser does not support embedded video.
  </video>
);

const TestimonialInitials = ({ initials }: { initials: string }) => (
  <span
    style={{
      display: "grid",
      width: "100%",
      height: "100%",
      placeItems: "center",
      background: "var(--puzzle-color-surface-sunken)",
      color: "var(--puzzle-color-text-muted)",
      fontSize: "var(--puzzle-font-size-sm, 0.875rem)",
      fontWeight: 700,
    }}
  >
    {initials}
  </span>
);

const BrandWordmark = ({
  name,
  mark,
  color,
}: {
  name: string;
  mark: string;
  color: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--puzzle-space-2, 0.5rem)",
      color,
      fontWeight: 700,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display: "grid",
        width: "1.5rem",
        aspectRatio: "1",
        placeItems: "center",
        borderRadius: "var(--puzzle-radius-sm, 0.25rem)",
        background: "currentColor",
        color: "var(--puzzle-color-background)",
        fontSize: "var(--puzzle-font-size-xs, 0.75rem)",
      }}
    >
      {mark}
    </span>
    {name}
  </span>
);

const imageBoxPhotos: ImageBoxImage[] = [
  {
    src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    alt: "Warm contemporary living room with timber details",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    alt: "Bright living space opening onto a garden",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    alt: "Minimal bedroom with soft natural light",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern kitchen with a stone island",
  },
  {
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
    alt: "Outdoor terrace beside a modern home",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
    alt: "Dining area with a view of the surrounding landscape",
  },
  {
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    alt: "Quiet reading corner with a comfortable chair",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    alt: "Sunlit interior with large windows",
  },
];

type ImageBoxGalleryExampleProps = {
  count?: number;
  offset?: number;
  aspectRatio?: number;
  gap?: number | string;
  radius?: number | string;
};

export const ImageBoxGalleryExample = ({
  count = 5,
  offset = 0,
  aspectRatio,
  gap,
  radius,
}: ImageBoxGalleryExampleProps) => {
  const images = Array.from(
    { length: count },
    (_, index) => imageBoxPhotos[(index + offset) % imageBoxPhotos.length]!,
  );

  return (
    <ImageBox
      images={images}
      aspectRatio={aspectRatio}
      gap={gap}
      radius={radius}
    />
  );
};

export const ImageBoxInteractionExample = () => {
  const [status, setStatus] = useState(
    "Choose a photo or view the full gallery.",
  );

  return (
    <div style={{ width: "100%" }}>
      <ImageBox
        images={imageBoxPhotos}
        onImageClick={(image, index) =>
          setStatus(`Selected ${image.alt} (photo ${index + 1}).`)
        }
        onViewAll={() =>
          setStatus(`Opening all ${imageBoxPhotos.length} photos.`)
        }
      />
      <p
        role="status"
        style={{ marginBlockStart: "var(--puzzle-space-3, 0.75rem)" }}
      >
        {status}
      </p>
    </div>
  );
};

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

export const carouselItems = [
  { id: "living-room", ...imageBoxPhotos[0]! },
  { id: "garden-room", ...imageBoxPhotos[1]! },
  { id: "bedroom", ...imageBoxPhotos[2]! },
  { id: "kitchen", ...imageBoxPhotos[3]! },
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
      <Tooltip
        open={open}
        onOpenChange={setOpen}
        trigger={<Button variant="outline">Focus or hover me</Button>}
      >
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

export const DropdownMenuExample = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [density, setDensity] = useState("comfortable");
  const [status, setStatus] = useState("Choose an action");

  return (
    <Stack>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="outline">Project options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Project</DropdownMenu.Label>
          <DropdownMenu.Group aria-label="Project actions">
            <DropdownMenu.Item onSelect={() => setStatus("Edit project")}>
              Edit project
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => setStatus("Duplicate project")}>
              Duplicate project
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem
            checked={showArchived}
            onCheckedChange={setShowArchived}
          >
            Show archived
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.RadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenu.Label>Density</DropdownMenu.Label>
            <DropdownMenu.RadioItem value="comfortable">
              Comfortable
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="compact">
              Compact
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            variant="danger"
            onSelect={() => setStatus("Delete project")}
          >
            Delete project
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <span role="status">
        {status}; archived {showArchived ? "shown" : "hidden"}; {density}{" "}
        density
      </span>
    </Stack>
  );
};

export const ControlledPopoverExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="Ready to continue?"
      trigger={<Button>Review changes</Button>}
    >
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
      <Tabs.Tab id="overview" tab="Overview">
        Selected tab: {activeId}
      </Tabs.Tab>
      <Tabs.Tab id="details" tab="Details">
        Selected tab: {activeId}
      </Tabs.Tab>
    </Tabs>
  );
};

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

export const ControlledCarouselExample = () => {
  const [panel, setPanel] = useState(0);

  return (
    <Stack>
      <Button variant="outline" onClick={() => setPanel(0)}>
        Back to first item
      </Button>
      <CarouselController
        items={carouselItems}
        currentPanel={panel}
        onPanelChange={setPanel}
      >
        <Carousel<(typeof carouselItems)[number]>
          getItemKey={(item) => item.id}
          renderItem={(item) => (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              containerStyle={{ height: 300 }}
              loading="lazy"
            />
          )}
          backButton={
            <Button variant="primary" aria-label="Previous slide">
              <Icon name="bx:caret-left" aria-hidden="true" />
            </Button>
          }
          nextButton={
            <Button variant="primary" aria-label="Next slide">
              <Icon name="bx:caret-right" aria-hidden="true" />
            </Button>
          }
          buttonAlignment="aside"
          renderPager={(current, total) => (
            <span role="status">
              Page {current + 1} of {total}
            </span>
          )}
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
        <Button
          variant="outline"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button
          disabled={activeStep === 2}
          onClick={() => setActiveStep(activeStep + 1)}
        >
          Continue
        </Button>
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
        <Slider
          value={volume}
          onChange={setVolume}
          showValue
          formatValue={(value) => value + "%"}
        />
      </FormField>
      <span role="status">Selected volume: {volume}%</span>
    </Stack>
  );
};

export const ControlledResizablePanelsExample = () => {
  const [sizes, setSizes] = useState([30, 70]);

  return (
    <Stack>
      <div
        style={{
          width: "100%",
          height: "12rem",
          border: "1px solid var(--puzzle-color-border)",
        }}
      >
        <ResizablePanels sizes={sizes} onSizesChange={setSizes}>
          <ResizablePanels.Panel
            minSize={20}
            style={{ padding: "var(--puzzle-space-4)" }}
          >
            Navigation
          </ResizablePanels.Panel>
          <ResizablePanels.Handle withGrip aria-label="Resize navigation" />
          <ResizablePanels.Panel
            minSize={40}
            style={{ padding: "var(--puzzle-space-4)" }}
          >
            Content
          </ResizablePanels.Panel>
        </ResizablePanels>
      </div>
      <Stack direction="row">
        <span role="status">
          Sizes: {sizes.map((size) => Math.round(size) + "%").join(" / ")}
        </span>
        <Button variant="outline" onClick={() => setSizes([30, 70])}>
          Reset
        </Button>
      </Stack>
    </Stack>
  );
};

export const ControlledSelectExample = () => {
  const [fruit, setFruit] = useState<string | undefined>("apple");

  return (
    <Stack>
      <Select
        label="Favorite fruit"
        options={fruitOptions}
        value={fruit}
        onChange={setFruit}
      />
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
        {files.length
          ? `Selected: ${files.map((file) => file.name).join(", ")}`
          : "No files selected"}
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
      <Autocomplete
        label="Fruit"
        options={fruitOptions}
        value={value}
        onChange={setValue}
      />
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
      <Drawer
        open={open}
        onOpenChange={setOpen}
        position="right"
        aria-label="Filters"
      >
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
      <Button onClick={() => notification.success("Changes saved")}>
        Show success
      </Button>
      <Button
        variant="outline"
        onClick={() => notification.error("Could not save", { duration: 0 })}
      >
        Show error
      </Button>
      <Button variant="ghost" onClick={notification.dismissAll}>
        Dismiss all
      </Button>
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
      <Button onClick={() => setVisible((current) => !current)}>
        Toggle content
      </Button>
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
      {Array.from({ length: 10 }, (_, index) => (
        <p key={index}>Example paragraph {index + 1}</p>
      ))}
    </Stack>
  );
};

export const PortalExample = () => (
  <>
    <PortalTarget
      id="documentation-portal-target"
      aria-label="Portal destination"
    />
    <Portal targetId="documentation-portal-target">
      <Card>This content is rendered inside the target.</Card>
    </Portal>
  </>
);

type SectionVariantPreview<T extends string> = {
  variant: T;
  useCase: string;
};

type SectionVariantPreviewsProps<T extends string> = {
  componentName: string;
  variants: readonly SectionVariantPreview<T>[];
  buildCode: (variant: T) => string;
  renderVariant: (variant: T) => ReactNode;
};

const SectionVariantPreviews = <T extends string>({
  componentName,
  variants,
  buildCode,
  renderVariant,
}: SectionVariantPreviewsProps<T>) => (
  <div role="group" aria-label={`${componentName} variants`}>
    {variants.map(({ variant, useCase }) => (
      <article key={variant}>
        <p>
          <strong>{variant}</strong> - {useCase}
        </p>
        <Preview fit="device" code={buildCode(variant)}>
          {renderVariant(variant)}
        </Preview>
      </article>
    ))}
  </div>
);

const announcementVariants: SectionVariantPreview<AnnouncementVariant>[] = [
  {
    variant: "bar",
    useCase: "A compact notice at the top or bottom of a page.",
  },
  {
    variant: "dismissible",
    useCase: "A temporary notice that visitors can close.",
  },
  {
    variant: "centered",
    useCase: "A short, centered message with one clear action.",
  },
  {
    variant: "split",
    useCase: "A message and action that need separate alignment.",
  },
  {
    variant: "promotional",
    useCase: "A promotion with a prominent call to action.",
  },
  {
    variant: "countdown",
    useCase: "A time-bound offer with a live countdown.",
  },
  { variant: "ticker", useCase: "A long, scrollable strip of brief updates." },
  {
    variant: "multi-message",
    useCase: "Several independent notices in one region.",
  },
  {
    variant: "floating",
    useCase: "A contained notice above surrounding content.",
  },
  {
    variant: "minimal",
    useCase: "A low-emphasis message with minimal decoration.",
  },
];

const announcementCopy: Record<
  AnnouncementVariant,
  { message: string; action: string }
> = {
  bar: {
    message: "New: bring your projects and conversations into one workspace.",
    action: "See what's new",
  },
  dismissible: {
    message: "The spring collection is here. Explore the new arrivals.",
    action: "Shop the collection",
  },
  centered: {
    message: "Your first month is on us.",
    action: "Start a free trial",
  },
  split: {
    message: "A better way to plan the work ahead.",
    action: "Explore the platform",
  },
  promotional: {
    message: "Launch week: save 25% on your first year.",
    action: "Claim the offer",
  },
  countdown: {
    message: "Early access pricing ends soon.",
    action: "Reserve your place",
  },
  ticker: {
    message:
      "Free shipping over $75 | New colors just landed | Made for everyday use",
    action: "Explore the collection",
  },
  "multi-message": {
    message: "Several updates for your visitors.",
    action: "Read the update",
  },
  floating: {
    message: "Need a hand choosing the right plan?",
    action: "Talk to our team",
  },
  minimal: {
    message: "Thoughtful tools for your next big idea.",
    action: "Discover Puzzle",
  },
};

export const AnnouncementSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AnnouncementSection"
    variants={announcementVariants}
    buildCode={(variant) => {
      const { message, action } = announcementCopy[variant];

      return variant === "countdown"
        ? `<AnnouncementSection variant="countdown" countdownTarget="2026-12-01T00:00:00Z" message="${message}" action={<Button variant="link">${action}</Button>} />`
        : variant === "multi-message"
          ? `<AnnouncementSection variant="multi-message" announcements={[{ id: "launch", message: "A fresh collection is ready to explore." }, { id: "shipping", message: "Complimentary shipping through Sunday." }]} />`
          : `<AnnouncementSection variant="${variant}" message="${message}" action={<Button variant="link">${action}</Button>} />`;
    }}
    renderVariant={(variant) => {
      const { message, action } = announcementCopy[variant];

      return variant === "countdown" ? (
        <AnnouncementSection
          variant={variant}
          countdownTarget="2026-12-01T00:00:00Z"
          message={message}
          action={<Button variant="link">{action}</Button>}
        />
      ) : variant === "multi-message" ? (
        <AnnouncementSection
          variant={variant}
          announcements={[
            {
              id: "launch",
              message: "A fresh collection is ready to explore.",
              action: <Button variant="link">See new arrivals</Button>,
            },
            { id: "shipping", message: "Complimentary shipping through Sunday." },
          ]}
        />
      ) : (
        <AnnouncementSection
          variant={variant}
          message={message}
          action={<Button variant="link">{action}</Button>}
        />
      );
    }}
  />
);

const logoItems: LogoCloudItem[] = [
  {
    id: "acme",
    name: "Aperture",
    alt: "Aperture logo",
    logo: (
      <BrandWordmark
        name="aperture"
        mark="A"
        color="var(--puzzle-color-primary)"
      />
    ),
    featured: true,
  },
  {
    id: "northstar",
    name: "Northstar",
    alt: "Northstar logo",
    logo: (
      <BrandWordmark
        name="northstar"
        mark="N"
        color="var(--puzzle-color-text)"
      />
    ),
  },
  {
    id: "arcwell",
    name: "Arcwell",
    alt: "Arcwell logo",
    logo: (
      <BrandWordmark
        name="arcwell"
        mark="a"
        color="var(--puzzle-color-success)"
      />
    ),
    group: "Technology",
  },
  {
    id: "fieldnotes",
    name: "Fieldnotes",
    alt: "Fieldnotes logo",
    logo: (
      <BrandWordmark
        name="fieldnotes"
        mark="F"
        color="var(--puzzle-color-warning)"
      />
    ),
    group: "Creative",
  },
  {
    id: "kin",
    name: "Kin",
    alt: "Kin logo",
    logo: (
      <BrandWordmark name="kin" mark="K" color="var(--puzzle-color-info)" />
    ),
    group: "Creative",
  },
  {
    id: "orbit",
    name: "Orbit",
    alt: "Orbit logo",
    logo: (
      <BrandWordmark
        name="orbit"
        mark="O"
        color="var(--puzzle-color-text-muted)"
      />
    ),
    group: "Technology",
  },
  {
    id: "monument",
    name: "Monument",
    alt: "Monument logo",
    logo: (
      <BrandWordmark
        name="monument"
        mark="M"
        color="var(--puzzle-color-danger)"
      />
    ),
    group: "Commerce",
  },
  {
    id: "tandem",
    name: "Tandem",
    alt: "Tandem logo",
    logo: (
      <BrandWordmark
        name="tandem"
        mark="T"
        color="var(--puzzle-color-primary)"
      />
    ),
    group: "Commerce",
  },
];
const logoVariants: SectionVariantPreview<LogoCloudVariant>[] = [
  {
    variant: "grid",
    useCase: "A balanced collection of partner or customer logos.",
  },
  {
    variant: "centered",
    useCase: "A small logo set below a centered trust message.",
  },
  {
    variant: "monochrome",
    useCase: "A unified visual treatment for mixed brand assets.",
  },
  {
    variant: "colored",
    useCase: "Brand marks shown in their original colors.",
  },
  {
    variant: "carousel",
    useCase: "A navigable collection when space is limited.",
  },
  {
    variant: "marquee",
    useCase: "A horizontally scrollable row that stays motion-free.",
  },
  {
    variant: "featured",
    useCase: "A set with one or more visually important partners.",
  },
  {
    variant: "grouped",
    useCase: "Logos organized under consumer-provided categories.",
  },
  {
    variant: "compact",
    useCase: "A denser logo collection for smaller page sections.",
  },
  { variant: "split", useCase: "A trust message beside the logo collection." },
  {
    variant: "bordered",
    useCase: "A collection where separate logo tiles aid scanning.",
  },
  { variant: "dark", useCase: "Logos placed on a contrasting dark surface." },
];

export const LogoCloudSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="LogoCloudSection"
    variants={logoVariants}
    buildCode={(variant) =>
      `<LogoCloudSection variant="${variant}" logos={logos} />`
    }
    renderVariant={(variant) => {
      const logos: LogoCloudItem[] =
        variant === "dark" || variant === "monochrome"
          ? logoItems.map(({ id, name, alt, href, group, featured }) => ({
              id,
              name,
              alt,
              href,
              group,
              featured,
              logo: (
                <BrandWordmark
                  name={name.toLowerCase()}
                  mark={name.slice(0, 1).toUpperCase()}
                  color={
                    variant === "dark"
                      ? "var(--puzzle-color-background)"
                      : "var(--puzzle-color-text-muted)"
                  }
                />
              ),
            }))
          : logoItems;

      return (
        <LogoCloudSection
          variant={variant}
          eyebrow={variant === "dark" ? "A community of makers" : undefined}
          title={
            variant === "grouped"
              ? "Partners across every discipline"
              : variant === "featured"
                ? "Built with the best"
                : variant === "split"
                  ? "Good company, better work"
                  : "Trusted by teams with big ideas"
          }
          description={
            variant === "grouped"
              ? "A close network of technology, creative, and commerce partners."
              : "Independent teams use our tools to make their best work."
          }
          logos={logos}
        />
      );
    }}
  />
);

const featureItems: FeatureItem[] = [
  {
    id: "automate",
    title: "Bring every project into focus",
    description:
      "See owners, milestones, and decisions together instead of across scattered tools.",
    icon: <Icon name="heroicons:cog-20-solid" size={32} aria-hidden="true" />,
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.dashboard}
        alt="A project dashboard with charts and organized work"
      />
    ),
    featured: true,
  },
  {
    id: "integrate",
    title: "Give good ideas room to grow",
    description:
      "Turn a rough brief into an aligned plan your whole team can move forward.",
    icon: <Icon name="boxicons:workflow" size={32} aria-hidden="true" />,
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.team}
        alt="A small team collaborating around a shared plan"
      />
    ),
  },
  {
    id: "measure",
    title: "Make the next step obvious",
    description:
      "Surface the signals that matter and turn progress into confident decisions.",
    icon: (
      <Icon name="coolicons:chart-line-sharp" size={32} aria-hidden="true" />
    ),
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.product}
        alt="A bright, organized workspace ready for focused work"
      />
    ),
  },
  {
    id: "share",
    title: "Keep everyone in the loop",
    description:
      "Give stakeholders a clear, current view without another status meeting.",
    icon: (
      <Icon
        name="heroicons:check-circle-20-solid"
        size={32}
        aria-hidden="true"
      />
    ),
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.workspace}
        alt="A calm, light-filled studio for a connected team"
      />
    ),
  },
];
const featureVariants: SectionVariantPreview<FeaturesVariant>[] = [
  {
    variant: "grid",
    useCase: "A familiar, balanced set of feature summaries.",
  },
  {
    variant: "bento",
    useCase: "A varied grid with selected features emphasized.",
  },
  {
    variant: "alternating",
    useCase: "A sequence with staggered visual rhythm.",
  },
  {
    variant: "split",
    useCase: "A two-column feature collection with room for media.",
  },
  {
    variant: "cards",
    useCase: "Separate feature cards for a card-based page.",
  },
  {
    variant: "icons",
    useCase: "Short benefits led by consumer-provided icons.",
  },
  { variant: "numbered", useCase: "An ordered set of key capabilities." },
  {
    variant: "tabs",
    useCase: "A detailed feature showcase with keyboard-operable tabs.",
  },
  {
    variant: "accordion",
    useCase: "A space-efficient expandable feature list.",
  },
  {
    variant: "sticky",
    useCase: "A media-led showcase beside scrolling feature content.",
  },
  { variant: "horizontal", useCase: "A row of concise feature summaries." },
  {
    variant: "vertical",
    useCase: "A single-column list for narrow or editorial pages.",
  },
  {
    variant: "media-grid",
    useCase: "Feature cards where each item includes media.",
  },
  { variant: "asymmetric", useCase: "A grid with varied item widths." },
  {
    variant: "editorial",
    useCase: "Longer feature descriptions with an editorial feel.",
  },
  {
    variant: "compact",
    useCase: "A dense collection for constrained layouts.",
  },
  {
    variant: "full-width",
    useCase: "A broad collection that uses available section width.",
  },
];

export const FeaturesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="FeaturesSection"
    variants={featureVariants}
    buildCode={(variant) =>
      ["bento", "alternating", "split", "sticky", "media-grid", "asymmetric"].includes(
        variant,
      )
        ? `<FeaturesSection variant="${variant}" items={[{ id: "workspace", title: "Bring every project into focus", media: <img src="${sectionPreviewImages.dashboard}" alt="Project dashboard" /> }]} />`
        : `<FeaturesSection variant="${variant}" items={features} />`
    }
    renderVariant={(variant) => {
      const mediaVariants: FeaturesVariant[] = [
        "bento",
        "alternating",
        "split",
        "sticky",
        "media-grid",
        "asymmetric",
      ];
      const items = mediaVariants.includes(variant)
        ? featureItems
        : featureItems.map(({ media: _media, ...item }) => item);
      const titles: Partial<Record<FeaturesVariant, string>> = {
        bento: "A connected workspace, at a glance",
        split: "Turn scattered work into shared momentum",
        sticky: "One clear view from brief to launch",
        "media-grid": "Designed around the way teams work",
        tabs: "Everything your team needs to move",
        accordion: "A simpler way to do focused work",
        editorial: "A calmer, clearer way to build together",
      };

      return (
        <FeaturesSection
          variant={variant}
          eyebrow="A better way to work"
          title={titles[variant] ?? "Tools that make the whole team sharper"}
          description="Bring the people, context, and next steps into one considered workflow."
          items={items}
        />
      );
    }}
  />
);

const benefitItems: BenefitItem[] = [
  {
    id: "time",
    title: "More time for meaningful work",
    description:
      "Automate recurring tasks and give your team back the hours to think, make, and improve.",
    icon: <Icon name="heroicons:clock-20-solid" size={32} aria-hidden="true" />,
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.workspace}
        alt="A bright studio workspace with room for focused work"
      />
    ),
    featured: true,
  },
  {
    id: "clarity",
    title: "Clarity everyone can act on",
    description:
      "Keep priorities and ownership visible so decisions do not disappear into chat.",
    icon: <Icon name="heroicons:eye-20-solid" size={32} aria-hidden="true" />,
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.dashboard}
        alt="A clear dashboard bringing progress into view"
      />
    ),
  },
  {
    id: "quality",
    title: "A more consistent customer experience",
    description:
      "Make the best process repeatable with shared context and fewer handoffs.",
    icon: (
      <Icon
        name="heroicons:check-circle-20-solid"
        size={32}
        aria-hidden="true"
      />
    ),
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.team}
        alt="Colleagues reviewing a project together"
      />
    ),
  },
  {
    id: "confidence",
    title: "Confidence at every milestone",
    description:
      "Turn a clear view of progress into a better next decision for the team.",
    icon: <Icon name="coolicons:chart-line-sharp" size={32} aria-hidden="true" />,
  },
];
const benefitVariants: SectionVariantPreview<BenefitsVariant>[] = [
  { variant: "grid", useCase: "A balanced collection of customer benefits." },
  {
    variant: "split",
    useCase: "Benefits beside a consumer-provided image or media.",
  },
  { variant: "list", useCase: "A straightforward vertical list of outcomes." },
  { variant: "cards", useCase: "Benefits presented as distinct visual cards." },
  { variant: "icons", useCase: "Short benefits supported by icons." },
  { variant: "numbered", useCase: "A sequenced set of benefits or outcomes." },
  {
    variant: "alternating",
    useCase: "A staggered layout for a short feature story.",
  },
  { variant: "checklist", useCase: "A scannable list of included outcomes." },
  { variant: "editorial", useCase: "More detailed benefit descriptions." },
  { variant: "featured", useCase: "A set with one priority benefit." },
  { variant: "compact", useCase: "A dense layout with less card spacing." },
  {
    variant: "comparison",
    useCase: "Benefits that support comparing product outcomes.",
  },
];

export const BenefitsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="BenefitsSection"
    variants={benefitVariants}
    buildCode={(variant) =>
      ["split", "alternating", "editorial"].includes(variant)
        ? `<BenefitsSection variant="${variant}" items={[{ id: "clarity", title: "Clarity everyone can act on", media: <img src="${sectionPreviewImages.dashboard}" alt="A clear team dashboard" /> }]} />`
        : `<BenefitsSection variant="${variant}" items={benefits} />`
    }
    renderVariant={(variant) => {
      const mediaVariants: BenefitsVariant[] = [
        "split",
        "alternating",
        "editorial",
      ];
      const items = mediaVariants.includes(variant)
        ? benefitItems
        : benefitItems.map(({ media: _media, ...item }) => item);
      const titles: Partial<Record<BenefitsVariant, string>> = {
        split: "Better work starts with a better view",
        alternating: "Small changes, lasting impact",
        checklist: "Included in every thoughtful workflow",
        editorial: "The value of a little more clarity",
        featured: "A better day for the whole team",
        comparison: "Less busywork. More room to do great work.",
      };

      return (
        <BenefitsSection
          variant={variant}
          eyebrow="The difference you'll feel"
          title={titles[variant] ?? "Better outcomes for every team"}
          description="Make daily work feel more focused, more connected, and easier to move forward."
          items={items}
        />
      );
    }}
  />
);

const statsPreviewContent: Record<
  StatsVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    items: StatItem[];
  }
> = {
  grid: {
    eyebrow: "Launch report · Q2",
    title: "A strong start for the new collection",
    description: "The first quarter brought new customers and repeat orders.",
    items: [
      { id: "orders", label: "Orders fulfilled", value: 12840, trend: { direction: "up", label: "Up 24% this month" } },
      { id: "conversion", label: "Store conversion", value: 4.8, suffix: "%", description: "Above the 3.6% retail benchmark." },
      { id: "returning", label: "Returning customers", value: 38, suffix: "%", description: "A healthy signal of customer loyalty." },
    ],
  },
  inline: {
    eyebrow: "At a glance",
    title: "A studio that keeps good work moving",
    description: "Short lead times and thoughtful delivery, week after week.",
    items: [
      { id: "turnaround", label: "Average turnaround", value: 2.4, suffix: " days" },
      { id: "on-time", label: "Delivered on time", value: 96, suffix: "%" },
      { id: "review", label: "Client rating", value: 4.9, suffix: "/5" },
    ],
  },
  cards: {
    eyebrow: "The weekly harvest",
    title: "Local food, finding its people",
    description: "A quick look at this season's neighborhood subscription.",
    items: [
      { id: "revenue", label: "Monthly subscriptions", value: 842, prefix: "$", description: "Recurring orders this month." },
      { id: "baskets", label: "Baskets delivered", value: 320, trend: { direction: "up", label: "64 more than last week" } },
      { id: "retention", label: "Renewal rate", value: 87, suffix: "%", progress: 87 },
    ],
  },
  split: {
    eyebrow: "Community impact",
    title: "More places, connected by nature",
    description: "A regional conservation network growing through local action.",
    items: [
      { id: "habitats", label: "Habitats protected", value: 67, description: "Across three watersheds." },
      { id: "volunteers", label: "Volunteer hours", value: 12400, prefix: "+", description: "Contributed since the spring launch." },
    ],
  },
  centered: {
    eyebrow: "Field Notes Festival",
    title: "A weekend full of good ideas",
    description: "Independent voices, practical workshops, and a sold-out room.",
    items: [
      { id: "attendees", label: "Attendees", value: 2400, suffix: "+" },
      { id: "sessions", label: "Sessions", value: 36 },
      { id: "countries", label: "Countries represented", value: 18 },
    ],
  },
  featured: {
    eyebrow: "A growing community",
    title: "Built by people who make things",
    description: "A welcoming network for curious, ambitious teams.",
    items: [
      { id: "members", label: "Community members", value: 18400, prefix: "+", featured: true, trend: { direction: "up", label: "18% this quarter" } },
      { id: "projects", label: "Projects shared", value: 248 },
      { id: "countries", label: "Countries", value: 42 },
    ],
  },
  horizontal: {
    eyebrow: "Marketplace pulse",
    title: "Small makers are reaching further",
    description: "Independent shops are finding new customers across the region.",
    items: [
      { id: "makers", label: "Active makers", value: 186 },
      { id: "products", label: "Products listed", value: 3200, prefix: "+" },
      { id: "shipments", label: "Monthly shipments", value: 9700 },
      { id: "regions", label: "Regions served", value: 24 },
    ],
  },
  vertical: {
    eyebrow: "Restoration update",
    title: "A landscape on the mend",
    description: "The work is measured in healthy rivers and thriving habitats.",
    items: [
      { id: "water", label: "Water quality improvement", value: 31, suffix: "%", trend: { direction: "up", label: "Since restoration began" } },
      { id: "species", label: "Native species returned", value: 12 },
      { id: "sites", label: "Sites monitored", value: 8 },
    ],
  },
  dashboard: {
    eyebrow: "Operations · Live",
    title: "Today's delivery health",
    description: "The fulfillment team is on track across every major milestone.",
    items: [
      { id: "packed", label: "Orders packed", value: 186, progress: 82 },
      { id: "dispatch", label: "Ready to dispatch", value: 42, trend: { direction: "neutral", label: "Next pickup at 3:30 PM" } },
      { id: "accuracy", label: "Picking accuracy", value: 99.4, suffix: "%", progress: 99.4 },
    ],
  },
  comparison: {
    eyebrow: "A better booking flow",
    title: "Less waiting between idea and itinerary",
    description: "Average planning time before and after the new guided flow.",
    items: [
      { id: "before", label: "Before · days to plan", value: 21, suffix: " days" },
      { id: "after", label: "Now · days to plan", value: 9, suffix: " days", trend: { direction: "down", label: "12 days faster" } },
    ],
  },
  progress: {
    eyebrow: "Renovation tracker",
    title: "A landmark taking shape",
    description: "Three workstreams are moving steadily toward opening day.",
    items: [
      { id: "structure", label: "Structure restored", value: 76, suffix: "%", progress: 76 },
      { id: "interiors", label: "Interior fit-out", value: 54, suffix: "%", progress: 54 },
      { id: "accessibility", label: "Access improvements", value: 91, suffix: "%", progress: 91 },
    ],
  },
  animated: {
    eyebrow: "Annual impact",
    title: "Small actions add up",
    description: "A year of neighbors sharing skills, time, and useful things.",
    items: [
      { id: "neighbors", label: "Neighbors involved", value: 12600, prefix: "+" },
      { id: "repairs", label: "Items repaired", value: 3800 },
      { id: "hours", label: "Hours volunteered", value: 9400 },
    ],
  },
};
const statVariants: SectionVariantPreview<StatsVariant>[] = [
  { variant: "grid", useCase: "A general-purpose collection of key metrics." },
  {
    variant: "inline",
    useCase: "Compact metrics displayed in one flowing row.",
  },
  { variant: "cards", useCase: "Metrics separated into individual cards." },
  {
    variant: "split",
    useCase: "A small set of metrics with balanced emphasis.",
  },
  {
    variant: "centered",
    useCase: "Metrics centered below a short introduction.",
  },
  {
    variant: "featured",
    useCase: "A primary metric supported by secondary values.",
  },
  {
    variant: "horizontal",
    useCase: "A flexible horizontal row of statistics.",
  },
  {
    variant: "vertical",
    useCase: "Metrics stacked for narrow panels or sidebars.",
  },
  {
    variant: "dashboard",
    useCase: "Compact operational values for a dashboard summary.",
  },
  {
    variant: "comparison",
    useCase: "Metrics arranged for before-and-after comparisons.",
  },
  { variant: "progress", useCase: "Values that include progress indicators." },
  {
    variant: "animated",
    useCase: "Numeric values counted up when motion is allowed.",
  },
];

export const StatsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="StatsSection"
    variants={statVariants}
    buildCode={(variant) =>
      `<StatsSection variant="${variant}" items={stats} />`
    }
    renderVariant={(variant) => (
      <StatsSection variant={variant} {...statsPreviewContent[variant]} />
    )}
  />
);

const testimonialItems: TestimonialItem[] = [
  {
    id: "riley",
    quote:
      "Puzzle gave our team a shared view of the work. We spend less time chasing updates and more time making the product better.",
    author: "Riley Chen",
    role: "VP of Product",
    organization: "Aperture",
    rating: 5,
    avatar: <TestimonialInitials initials="RC" />,
    companyLogo: (
      <BrandWordmark
        name="aperture"
        mark="A"
        color="var(--puzzle-color-primary)"
      />
    ),
    featured: true,
  },
  {
    id: "jordan",
    quote:
      "We got everyone aligned in a week. Even our newest teammates know exactly where to find the context they need.",
    author: "Jordan Lee",
    role: "Operations Director",
    organization: "Northstar",
    rating: 5,
    avatar: <TestimonialInitials initials="JL" />,
    companyLogo: (
      <BrandWordmark
        name="northstar"
        mark="N"
        color="var(--puzzle-color-text)"
      />
    ),
  },
  {
    id: "alex",
    quote:
      "The project view is simple enough to use every day and detailed enough to keep leadership in the loop.",
    author: "Alex Morgan",
    role: "Studio Founder",
    organization: "Fieldnotes",
    rating: 4,
    avatar: <TestimonialInitials initials="AM" />,
    companyLogo: (
      <BrandWordmark
        name="fieldnotes"
        mark="F"
        color="var(--puzzle-color-warning)"
      />
    ),
  },
  {
    id: "sam",
    quote:
      "We can finally see what is moving, what is stuck, and where a little help will make the biggest difference.",
    author: "Sam Rivera",
    role: "Customer Experience Lead",
    organization: "Kin",
    rating: 5,
    avatar: <TestimonialInitials initials="SR" />,
    companyLogo: (
      <BrandWordmark name="kin" mark="K" color="var(--puzzle-color-info)" />
    ),
  },
];
const testimonialVariants: SectionVariantPreview<TestimonialsVariant>[] = [
  { variant: "grid", useCase: "A balanced set of customer quotes." },
  { variant: "cards", useCase: "Testimonials shown as distinct cards." },
  {
    variant: "carousel",
    useCase: "A keyboard-navigable featured quote at a time.",
  },
  {
    variant: "featured",
    useCase: "One highlighted testimonial with supporting quotes.",
  },
  { variant: "quote", useCase: "A single quote with restrained framing." },
  { variant: "masonry", useCase: "Testimonials with varied quote lengths." },
  {
    variant: "split",
    useCase: "Quotes paired with an adjacent introduction or media.",
  },
  {
    variant: "video",
    useCase: "Testimonials that include consumer-provided video.",
  },
  {
    variant: "avatar-grid",
    useCase: "A collection emphasizing customer identity.",
  },
  { variant: "wall", useCase: "A dense wall of short customer endorsements." },
  { variant: "minimal", useCase: "A low-decoration quotation list." },
  {
    variant: "editorial",
    useCase: "Longer quotations with stronger typography.",
  },
  {
    variant: "rating",
    useCase: "Testimonials that include a customer rating.",
  },
  { variant: "dark", useCase: "Quotes on a contrasting dark surface." },
];

export const TestimonialsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="TestimonialsSection"
    variants={testimonialVariants}
    buildCode={(variant) =>
      variant === "video"
        ? `<TestimonialsSection variant="video" items={[{ id: "riley", author: "Riley Chen", quote: "A clearer way to work together.", media: <video controls poster="${sectionPreviewImages.team}"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" /></video> }]} />`
        : `<TestimonialsSection variant="${variant}" items={testimonials} />`
    }
    renderVariant={(variant) => {
      const items =
        variant === "video"
          ? testimonialItems.map((item, index) =>
              index === 0 ? { ...item, media: <SectionPreviewVideo /> } : item,
            )
          : variant === "avatar-grid"
            ? testimonialItems.map((item, index) => ({
                ...item,
                avatar: (
                  <img
                    src={
                      [
                        sectionPreviewImages.portraitOne,
                        sectionPreviewImages.portraitTwo,
                        sectionPreviewImages.portraitThree,
                        sectionPreviewImages.portraitFour,
                      ][index]!
                    }
                    alt=""
                    loading="eager"
                  />
                ),
              }))
          : variant === "dark"
            ? testimonialItems.map((item) => ({
                ...item,
                companyLogo: item.organization ? (
                  <BrandWordmark
                    name={item.organization.toLowerCase()}
                    mark={item.organization.slice(0, 1).toUpperCase()}
                    color="var(--puzzle-color-background)"
                  />
                ) : undefined,
              }))
          : testimonialItems;
      const titles: Partial<Record<TestimonialsVariant, string>> = {
        featured: "A partnership that changed the way we work",
        quote: "A little more room for the work that matters",
        split: "Good work speaks for itself",
        video: "Hear it from the people doing the work",
        "avatar-grid": "Meet the teams behind the kind words",
        wall: "A growing community, in their own words",
        editorial: "The best measure is how the work feels",
        rating: "Loved by teams who care about the details",
        dark: "Built for people who care about their craft",
      };

      return (
        <TestimonialsSection
          variant={variant}
          eyebrow="Customer stories"
          title={titles[variant] ?? "What teams say after working with Puzzle"}
          description="Honest notes from people who found a calmer way to build together."
          items={items}
        />
      );
    }}
  />
);

const ctaVariants: SectionVariantPreview<CTAVariant>[] = [
  { variant: "centered", useCase: "A focused message with centered actions." },
  {
    variant: "split",
    useCase: "A call to action beside consumer-provided media.",
  },
  { variant: "banner", useCase: "A compact banner near the end of a page." },
  {
    variant: "card",
    useCase: "A contained action within a card-like surface.",
  },
  {
    variant: "full-width",
    useCase: "A broad call to action spanning the section.",
  },
  {
    variant: "image",
    useCase: "A message paired with an image or illustration.",
  },
  {
    variant: "background",
    useCase: "A call to action with consumer-styled background media.",
  },
  {
    variant: "gradient",
    useCase: "A themed gradient treatment using design tokens.",
  },
  {
    variant: "newsletter",
    useCase: "A prompt whose form is supplied by the consumer.",
  },
  {
    variant: "trial",
    useCase: "A product trial invitation with a clear next step.",
  },
  {
    variant: "download",
    useCase: "A download prompt with consumer-provided actions.",
  },
  {
    variant: "contact",
    useCase: "A direct invitation to contact the organization.",
  },
  {
    variant: "app",
    useCase: "A promotion for a mobile or desktop application.",
  },
  {
    variant: "minimal",
    useCase: "A restrained final prompt with little decoration.",
  },
  {
    variant: "editorial",
    useCase: "A text-led call to action in an article layout.",
  },
  {
    variant: "floating",
    useCase: "A compact, contained prompt separated from page content.",
  },
];

const ctaCopy: Record<
  CTAVariant,
  { title: string; description: string; primary: string; secondary: string }
> = {
  centered: {
    title: "Make room for your next big idea.",
    description: "Start with a clearer plan and bring your whole team along.",
    primary: "Get started",
    secondary: "Explore the platform",
  },
  split: {
    title: "A workspace that grows with your team.",
    description: "Bring people, plans, and progress into one shared place.",
    primary: "See how it works",
    secondary: "Meet the team",
  },
  banner: {
    title: "Ready for a calmer way to work?",
    description: "Make your next project the one that changes everything.",
    primary: "Start a free trial",
    secondary: "View the guide",
  },
  card: {
    title: "Take the next step.",
    description: "See what a more connected workflow can do for you.",
    primary: "Explore Puzzle",
    secondary: "Talk to us",
  },
  "full-width": {
    title: "Build what comes next.",
    description: "Give your best work the space and momentum it deserves.",
    primary: "Get started",
    secondary: "See customer stories",
  },
  image: {
    title: "A fresh perspective for every project.",
    description: "Bring the right people and the right ideas together.",
    primary: "Find your flow",
    secondary: "See the details",
  },
  background: {
    title: "Make good work feel effortless.",
    description: "One clear home for the ideas and details that move you forward.",
    primary: "Discover Puzzle",
    secondary: "Explore the workspace",
  },
  gradient: {
    title: "Your next chapter starts here.",
    description: "Build a more thoughtful way to bring ambitious ideas to life.",
    primary: "Start building",
    secondary: "See what's possible",
  },
  newsletter: {
    title: "A little inspiration for your inbox.",
    description: "Monthly notes on better teamwork, thoughtful tools, and good ideas.",
    primary: "Subscribe",
    secondary: "Read the journal",
  },
  trial: {
    title: "Try a better workflow for free.",
    description: "Invite your team, bring a real project, and see the difference.",
    primary: "Start your 14-day trial",
    secondary: "Compare plans",
  },
  download: {
    title: "Take your workspace with you.",
    description: "Keep ideas moving with Puzzle on desktop and mobile.",
    primary: "Download for desktop",
    secondary: "Get the mobile app",
  },
  contact: {
    title: "Let's find the right fit.",
    description: "Tell us what your team is working on. We can help you get started.",
    primary: "Talk to an expert",
    secondary: "Browse the guide",
  },
  app: {
    title: "Great work goes wherever you go.",
    description: "Pick up the plan, share a thought, and keep the momentum going.",
    primary: "Explore the app",
    secondary: "See the features",
  },
  minimal: {
    title: "Make your next move.",
    description: "A simpler way to bring your best work together.",
    primary: "Get started",
    secondary: "Learn more",
  },
  editorial: {
    title: "The best work begins with a better question.",
    description: "Start a conversation about the kind of work your team wants to make.",
    primary: "Start a conversation",
    secondary: "Read our story",
  },
  floating: {
    title: "Have a project in mind?",
    description: "Bring it to life with a team that sees the whole picture.",
    primary: "Let's talk",
    secondary: "See examples",
  },
};

export const CTASectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CTASection"
    variants={ctaVariants}
    buildCode={(variant) =>
      variant === "newsletter"
        ? `<CTASection variant="newsletter" title="A little inspiration for your inbox."><div role="group"><input type="email" aria-label="Email address" placeholder="you@example.com" /><Button type="button">Subscribe</Button></div></CTASection>`
        : ["split", "image", "background"].includes(variant)
        ? `<CTASection variant="${variant}" title="Make good work feel effortless." media={<img src="${sectionPreviewImages.workspace}" alt="A welcoming studio" />} primaryAction={<Button>Explore Puzzle</Button>} />`
        : variant === "app"
          ? `<CTASection variant="app" title="Great work goes wherever you go." media={<img src="${sectionPreviewImages.mobile}" alt="Puzzle mobile app" />} primaryAction={<Button>Explore the app</Button>} />`
          : `<CTASection variant="${variant}" title="Make room for your next big idea." primaryAction={<Button>Get started</Button>} />`
    }
    renderVariant={(variant) => {
      const { title, description, primary, secondary } = ctaCopy[variant];
      const media =
        variant === "split" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.team}
            alt="A team working together around a table"
          />
        ) : variant === "image" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.landscape}
            alt="A dramatic landscape at the edge of a lake"
          />
        ) : variant === "background" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.workspace}
            alt="A welcoming studio filled with natural light"
          />
        ) : variant === "app" ? (
          <SectionPreviewImage
            src={sectionPreviewImages.mobile}
            alt="A mobile phone showing a clean app interface"
            aspectRatio="9 / 16"
          />
        ) : undefined;

      return (
        <CTASection
          variant={variant}
          eyebrow={
            variant === "newsletter"
              ? "The Sunday Edit"
              : variant === "trial"
                ? "No credit card required"
                : "Make your next move"
          }
          title={title}
          description={description}
          media={media}
          primaryAction={
            variant === "newsletter" ? undefined : <Button>{primary}</Button>
          }
          secondaryAction={<Button variant="outline">{secondary}</Button>}
        >
          {variant === "newsletter" ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--puzzle-space-2, 0.5rem)",
              }}
            >
              <input
                type="email"
                aria-label="Email address"
                placeholder="you@example.com"
                style={{
                  minWidth: "14rem",
                  padding: "var(--puzzle-space-3, 0.75rem)",
                  border: "var(--puzzle-border-width, 1px) solid var(--puzzle-color-border)",
                  borderRadius: "var(--puzzle-radius-md, 0.5rem)",
                  background: "var(--puzzle-color-background)",
                  color: "var(--puzzle-color-text)",
                }}
              />
              <Button type="button">{primary}</Button>
            </div>
          ) : null}
        </CTASection>
      );
    }}
  />
);

const faqItems: FAQItem[] = [
  {
    id: "start",
    question: "How quickly can our team get started?",
    answer:
      "Create a workspace in a few minutes, bring in one real project, and invite the people who need the context. You can add more structure as your team grows.",
    category: "Getting started",
    searchText: "setup onboarding invite account",
    featured: true,
  },
  {
    id: "migration",
    question: "Can we bring our existing work with us?",
    answer:
      "Yes. Import your project details and connect the tools your team already uses. Keep the current process running while you move work across at your own pace.",
    category: "Getting started",
    searchText: "migration import existing tools",
  },
  {
    id: "plan",
    question: "Can we change plans as the team grows?",
    answer:
      "You can update your plan from workspace settings. Changes apply to the next billing period, and your project history stays with you.",
    category: "Plans and billing",
    searchText: "pricing billing subscription upgrade downgrade",
  },
  {
    id: "security",
    question: "How do you keep our workspace secure?",
    answer:
      "Workspace access is protected with role-based permissions, encrypted connections, and controls that help administrators manage membership.",
    category: "Plans and billing",
    searchText: "security privacy access permissions",
  },
  {
    id: "support",
    question: "What if our team needs a hand?",
    answer:
      "Our support team can help you find a starting point, answer product questions, and share practical ways to improve your workflow.",
    category: "Support",
    searchText: "help support contact assistance",
  },
  {
    id: "cancel",
    question: "Can we cancel whenever we need to?",
    answer:
      "Yes. You can cancel at any time from billing settings. You will keep access through the end of the current billing period.",
    category: "Plans and billing",
    searchText: "cancel close account billing",
  },
];
const faqVariants: SectionVariantPreview<FAQVariant>[] = [
  {
    variant: "accordion",
    useCase: "A conventional expandable list of questions.",
  },
  {
    variant: "two-column",
    useCase: "A longer FAQ set arranged into two columns on wider screens.",
  },
  {
    variant: "grid",
    useCase: "A set of questions grouped for quick scanning.",
  },
  { variant: "cards", useCase: "Questions in visually separated groups." },
  {
    variant: "split",
    useCase: "Questions beside an introduction or support action.",
  },
  {
    variant: "grouped",
    useCase: "Questions organized under category headings.",
  },
  {
    variant: "categorized",
    useCase: "Questions with in-page links to their categories.",
  },
  {
    variant: "searchable",
    useCase: "A question list filtered by a local search field.",
  },
  {
    variant: "minimal",
    useCase: "A simple disclosure list with minimal framing.",
  },
  {
    variant: "bordered",
    useCase: "A unified disclosure group with an outer border.",
  },
  {
    variant: "numbered",
    useCase: "Questions that should be referenced by order.",
  },
  {
    variant: "featured",
    useCase: "A set where selected common questions stand out.",
  },
];

export const FAQSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="FAQSection"
    variants={faqVariants}
    buildCode={(variant) => `<FAQSection variant="${variant}" items={faqs} />`}
    renderVariant={(variant) => {
      const titles: Partial<Record<FAQVariant, string>> = {
        split: "Good questions deserve clear answers",
        grouped: "Everything you need to know",
        categorized: "Find the answer you need",
        searchable: "Looking for something specific?",
        numbered: "Before you get started",
        featured: "A few things people often ask",
      };

      return (
        <FAQSection
          variant={variant}
          eyebrow="Helpful answers"
          title={titles[variant] ?? "The details, made simple"}
          description="A quick guide to setting up, growing, and getting support for your workspace."
          items={faqItems}
          expandMode={
            variant === "grid" || variant === "cards" ? "multiple" : "single"
          }
          emptyState="No answers match that search. Try another word."
        />
      );
    }}
  />
);

const steps: HowItWorksItem[] = [
  {
    id: "connect",
    title: "Gather the right people",
    description:
      "Invite the teammates and partners who need a clear view of the work.",
    icon: <Icon name="heroicons:users-20-solid" size={28} aria-hidden="true" />,
  },
  {
    id: "organize",
    title: "Shape a plan together",
    description:
      "Turn a great idea into shared milestones, owners, and next steps.",
    icon: <Icon name="boxicons:workflow" size={28} aria-hidden="true" />,
  },
  {
    id: "improve",
    title: "Keep progress in sight",
    description:
      "See what is moving and adjust the plan before small blockers grow.",
    icon: (
      <Icon name="coolicons:chart-line-sharp" size={28} aria-hidden="true" />
    ),
  },
  {
    id: "celebrate",
    title: "Make the next launch better",
    description:
      "Capture what worked, share the win, and carry the learning forward.",
    icon: (
      <Icon
        name="heroicons:check-circle-20-solid"
        size={28}
        aria-hidden="true"
      />
    ),
  },
];
const numberedSteps: HowItWorksItem[] = [
  {
    id: "direction",
    title: "Set a clear direction",
    description: "Agree on what success should look like before the work begins.",
  },
  {
    id: "context",
    title: "Bring the right context",
    description: "Gather the people, research, and decisions the team needs.",
  },
  {
    id: "plan",
    title: "Make a simple plan",
    description: "Turn the goal into milestones that everyone can move forward.",
  },
  {
    id: "learn",
    title: "Review and improve",
    description: "Share what worked and carry the learning into the next launch.",
  },
];
const timelineSteps: HowItWorksItem[] = [
  {
    id: "october",
    title: "October - Discover",
    description: "Listen to customers and find the opportunity worth pursuing.",
  },
  {
    id: "november",
    title: "November - Shape",
    description: "Bring the team together around a focused, testable direction.",
  },
  {
    id: "december",
    title: "December - Build",
    description: "Create, review, and refine the experience as a team.",
  },
  {
    id: "january",
    title: "January - Launch",
    description: "Share the result, learn from the response, and plan what is next.",
  },
];
const processSteps: HowItWorksItem[] = [
  {
    id: "brief",
    title: "Write the brief",
    description: "Capture the audience, objective, and one key message.",
  },
  {
    id: "concept",
    title: "Explore a direction",
    description: "Bring a few promising ideas to the table and choose one.",
  },
  {
    id: "create",
    title: "Make it real",
    description: "Build the experience, review together, and polish the details.",
  },
  {
    id: "release",
    title: "Share the launch",
    description: "Go live with confidence and keep learning from what happens.",
  },
];
const howItWorksVariants: SectionVariantPreview<HowItWorksVariant>[] = [
  {
    variant: "steps",
    useCase: "A direct sequence of instructions or milestones.",
  },
  {
    variant: "numbered",
    useCase: "Steps whose order is central to the process.",
  },
  {
    variant: "timeline",
    useCase: "A process described along a chronological line.",
  },
  { variant: "cards", useCase: "Each step explained in its own card." },
  {
    variant: "alternating",
    useCase: "A staggered sequence for a short process story.",
  },
  { variant: "horizontal", useCase: "A concise row of steps on wide screens." },
  {
    variant: "vertical",
    useCase: "A stacked process suitable for narrow pages.",
  },
  {
    variant: "connected",
    useCase: "A sequence where visual connectors clarify order.",
  },
  {
    variant: "image-steps",
    useCase: "Steps that rely on consumer-supplied images.",
  },
  {
    variant: "video-steps",
    useCase: "Steps that include consumer-supplied video.",
  },
  { variant: "process", useCase: "A compact overview of a business process." },
  {
    variant: "split",
    useCase: "A process paired with explanatory content or media.",
  },
  {
    variant: "carousel",
    useCase: "A keyboard-navigable step presented one at a time.",
  },
  {
    variant: "editorial",
    useCase: "A detailed, text-led process explanation.",
  },
];

export const HowItWorksSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="HowItWorksSection"
    variants={howItWorksVariants}
    buildCode={(variant) =>
      variant === "video-steps"
        ? `<HowItWorksSection variant="video-steps" steps={[{ id: "preview", title: "See the process", media: <video controls poster="${sectionPreviewImages.team}"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" /></video> }]} />`
        : variant === "image-steps" || variant === "split"
          ? `<HowItWorksSection variant="${variant}" steps={[{ id: "plan", title: "Shape a plan", media: <img src="${sectionPreviewImages.team}" alt="A team planning together" /> }]} />`
          : `<HowItWorksSection variant="${variant}" steps={steps} />`
    }
    renderVariant={(variant) => {
      const variantSteps =
        variant === "numbered"
          ? numberedSteps
          : variant === "timeline"
            ? timelineSteps
            : variant === "process"
              ? processSteps
              : steps;
      const stepImages = [
        sectionPreviewImages.team,
        sectionPreviewImages.dashboard,
        sectionPreviewImages.product,
        sectionPreviewImages.workspace,
      ];
      const mediaSteps =
        variant === "image-steps" || variant === "split"
          ? variantSteps.map((step, index) => ({
              ...step,
              icon: undefined,
              media: (
                <SectionPreviewImage
                  src={stepImages[index]!}
                  alt={`Team workflow, step ${index + 1}`}
                />
              ),
            }))
          : variant === "video-steps"
            ? variantSteps.map((step, index) => ({
                ...step,
                icon: undefined,
                media:
                  index === 1 ? (
                    <SectionPreviewVideo />
                  ) : (
                    <SectionPreviewImage
                      src={stepImages[index]!}
                      alt={`Team workflow, step ${index + 1}`}
                    />
                  ),
              }))
            : variantSteps;
      const copy: Record<
        HowItWorksVariant,
        { eyebrow: string; title: string; description: string }
      > = {
        steps: {
          eyebrow: "A simple process",
          title: "From first idea to first win",
          description:
            "Gather the people and context, shape a plan, then keep the momentum going.",
        },
        numbered: {
          eyebrow: "A four-part framework",
          title: "Four clear moves toward launch",
          description:
            "A practical sequence for turning a good idea into work your team can share.",
        },
        timeline: {
          eyebrow: "The next few months",
          title: "A launch plan with room to breathe",
          description:
            "Make the milestones visible, from early discovery to the lessons after launch.",
        },
        cards: {
          eyebrow: "A connected team",
          title: "Every part of the process, in view",
          description:
            "Make each stage easy to understand and easy to pick up.",
        },
        alternating: {
          eyebrow: "A little rhythm",
          title: "The work behind the work",
          description:
            "Keep the story moving as your team moves from question to outcome.",
        },
        horizontal: {
          eyebrow: "A focused sprint",
          title: "A plan everyone can scan",
          description:
            "Give the team a quick, shared view of the next four milestones.",
        },
        vertical: {
          eyebrow: "Start where you are",
          title: "A gentle path to getting started",
          description:
            "A simple sequence for teams who want to make progress without extra process.",
        },
        connected: {
          eyebrow: "One thing leads to another",
          title: "A path from first thought to shipped work",
          description:
            "Show how each stage connects to the next, without losing the bigger picture.",
        },
        "image-steps": {
          eyebrow: "A more visual guide",
          title: "See the work take shape",
          description:
            "Use real imagery to help people picture each stage of the experience.",
        },
        "video-steps": {
          eyebrow: "A process in motion",
          title: "See the process, not just the promise",
          description:
            "Pair a short video with clear steps so the flow feels tangible.",
        },
        process: {
          eyebrow: "From brief to launch",
          title: "A repeatable creative process",
          description:
            "Keep the essentials visible while leaving space for the details to evolve.",
        },
        split: {
          eyebrow: "Make the complex feel simple",
          title: "Good work happens one step at a time",
          description:
            "Pair the overview with real moments from the people doing the work.",
        },
        carousel: {
          eyebrow: "One step at a time",
          title: "Take the next step with confidence",
          description:
            "A focused walkthrough keeps each part of the journey easy to follow.",
        },
        editorial: {
          eyebrow: "A considered way to work",
          title: "Great work is built one decision at a time",
          description:
            "Tell a richer process story with enough room for every important detail.",
        },
      };

      return (
        <HowItWorksSection
          variant={variant}
          eyebrow={copy[variant].eyebrow}
          title={copy[variant].title}
          description={copy[variant].description}
          steps={mediaSteps}
        />
      );
    }}
  />
);

const comparisonPreviewContent: Record<
  ComparisonVariant,
  {
    eyebrow: string;
    title: string;
    description: string;
    options: ComparisonOption[];
    features: ComparisonFeature[];
    highlightedOptionId?: string;
    defaultSelectedOptionId?: string;
  }
> = {
  table: {
    eyebrow: "Workspace plans",
    title: "Room to grow, without outgrowing your tools",
    description: "Compare the essentials for a small team, a studio, or a full organization.",
    options: [
      { id: "starter", title: "Starter", description: "For a small team finding its rhythm." },
      { id: "studio", title: "Studio", description: "For teams ready to scale good work.", featured: true },
      { id: "scale", title: "Scale", description: "For ambitious, multi-team organizations." },
    ],
    features: [
      { id: "price", label: "Price per person / month", values: { starter: "$0", studio: "$12", scale: "$24" } },
      { id: "seats", label: "Team members", values: { starter: 3, studio: 20, scale: "Unlimited" } },
      { id: "projects", label: "Active projects", values: { starter: 3, studio: "Unlimited", scale: "Unlimited" } },
      { id: "automation", label: "Workflow automation", values: { starter: false, studio: "5 rules", scale: "Unlimited" } },
    ],
  },
  cards: {
    eyebrow: "Creative services",
    title: "The right kind of help for your next chapter",
    description: "Choose a level of partnership that fits the way your team works.",
    options: [
      { id: "sprint", title: "Brand sprint", description: "A focused week to clarify the story." },
      { id: "studio", title: "Studio partner", description: "Ongoing design support for launches." },
      { id: "embedded", title: "Embedded team", description: "A dedicated crew for complex work." },
    ],
    features: [
      { id: "duration", label: "Starting timeline", values: { sprint: "5 days", studio: "Monthly", embedded: "Quarterly" } },
      { id: "workshops", label: "Strategy workshops", values: { sprint: 2, studio: 1, embedded: 4 } },
      { id: "deliverables", label: "Core deliverables", values: { sprint: "Brand direction", studio: "Design system", embedded: "Product + brand" } },
    ],
  },
  split: {
    eyebrow: "Team workshop formats",
    title: "Bring everyone into the same room",
    description: "Pick the format that makes it easiest for your group to do its best thinking.",
    options: [
      { id: "onsite", title: "On-site", description: "A hands-on day together." },
      { id: "remote", title: "Remote", description: "A focused session from anywhere." },
    ],
    features: [
      { id: "duration", label: "Session length", values: { onsite: "Full day", remote: "Two half-days" } },
      { id: "attendees", label: "Recommended group", values: { onsite: "8–16 people", remote: "4–10 people" } },
      { id: "materials", label: "Take-home materials", values: { onsite: "Printed workbook", remote: "Shared digital board" } },
    ],
  },
  versus: {
    eyebrow: "A calmer way to collaborate",
    title: "Scattered updates or one shared picture?",
    description: "See what changes when project context lives alongside the work.",
    options: [
      { id: "scattered", title: "Scattered tools", description: "Updates live across inboxes and chats." },
      { id: "workspace", title: "Shared workspace", description: "Decisions stay connected to projects." },
    ],
    features: [
      { id: "status", label: "Current project status", values: { scattered: "Ask around", workspace: "One clear view" } },
      { id: "decisions", label: "Decision history", values: { scattered: false, workspace: true } },
      { id: "handoffs", label: "Cross-team handoffs", values: { scattered: "Manual follow-up", workspace: "Shared milestones" } },
    ],
  },
  checklist: {
    eyebrow: "Coworking access",
    title: "A desk for the day or a place to belong",
    description: "Compare the practical details before choosing your membership.",
    options: [
      { id: "day", title: "Day pass", description: "Drop in when you need a change of scene." },
      { id: "member", title: "Monthly member", description: "Make the studio part of your routine." },
    ],
    features: [
      { id: "desk", label: "Dedicated desk", values: { day: false, member: true } },
      { id: "meeting", label: "Meeting-room credits", values: { day: "1 hour", member: "8 hours" } },
      { id: "events", label: "Community events", values: { day: false, member: true } },
      { id: "coffee", label: "Coffee and tea", values: { day: true, member: true } },
    ],
  },
  "feature-matrix": {
    eyebrow: "App availability",
    title: "The same workspace, wherever you work",
    description: "Check which tools and capabilities are available on each platform.",
    options: [
      { id: "browser", title: "Browser" },
      { id: "ios", title: "iOS app" },
      { id: "android", title: "Android app" },
    ],
    features: [
      { id: "offline", label: "Offline access", values: { browser: false, ios: true, android: true } },
      { id: "notifications", label: "Push notifications", values: { browser: "Desktop", ios: true, android: true } },
      { id: "calendar", label: "Calendar sync", values: { browser: true, ios: true, android: true } },
      { id: "attachments", label: "File attachments", values: { browser: true, ios: "Preview", android: "Preview" } },
    ],
  },
  pricing: {
    eyebrow: "Workshop pricing",
    title: "Make space for your team's next idea",
    description: "Transparent options for a single session, a series, or a full retreat.",
    options: [
      { id: "session", title: "One session", description: "A 90-minute guided workshop." },
      { id: "series", title: "Workshop series", description: "Three sessions over a month.", featured: true },
      { id: "retreat", title: "Team retreat", description: "A full day with a dedicated facilitator." },
    ],
    features: [
      { id: "price", label: "Starting price", values: { session: "$480", series: "$1,250", retreat: "$2,400" } },
      { id: "participants", label: "Participants", values: { session: "Up to 8", series: "Up to 12", retreat: "Up to 20" } },
      { id: "followup", label: "Follow-up notes", values: { session: true, series: true, retreat: "Action plan" } },
    ],
    highlightedOptionId: "series",
  },
  highlighted: {
    eyebrow: "Choose your trail",
    title: "Find the escape that fits your pace",
    description: "Each guided route has a different rhythm, view, and level of challenge.",
    options: [
      { id: "coast", title: "Coastline", description: "Easy paths and sea air." },
      { id: "countryside", title: "Countryside", description: "A balanced day of hills and villages.", featured: true },
      { id: "highlands", title: "Highlands", description: "Big views for experienced hikers." },
    ],
    features: [
      { id: "distance", label: "Distance", values: { coast: "6 km", countryside: "12 km", highlands: "19 km" } },
      { id: "elevation", label: "Elevation gain", values: { coast: "120 m", countryside: "460 m", highlands: "980 m" } },
      { id: "duration", label: "Time on trail", values: { coast: "2 hours", countryside: "4 hours", highlands: "7 hours" } },
    ],
    highlightedOptionId: "countryside",
  },
  horizontal: {
    eyebrow: "City cycling guide",
    title: "Three bikes, three ways to explore",
    description: "Compare the range and carrying capacity before your next ride.",
    options: [
      { id: "city", title: "City", description: "Nimble for everyday errands." },
      { id: "touring", title: "Touring", description: "Comfortable for longer routes." },
      { id: "cargo", title: "Cargo", description: "Room for people and parcels." },
    ],
    features: [
      { id: "range", label: "Typical range", values: { city: "45 km", touring: "80 km", cargo: "55 km" } },
      { id: "capacity", label: "Carry capacity", values: { city: "10 kg", touring: "20 kg", cargo: "80 kg" } },
      { id: "weight", label: "Bike weight", values: { city: "18 kg", touring: "22 kg", cargo: "31 kg" } },
    ],
  },
  vertical: {
    eyebrow: "Festival sessions",
    title: "Choose a day that feels like yours",
    description: "A small comparison of the three ways to spend the weekend.",
    options: [
      { id: "friday", title: "Friday", description: "An intimate opening night." },
      { id: "saturday", title: "Saturday", description: "The full program and evening show." },
      { id: "weekend", title: "Weekend", description: "Every talk, workshop, and gathering." },
    ],
    features: [
      { id: "talks", label: "Talks included", values: { friday: 3, saturday: 8, weekend: 12 } },
      { id: "workshops", label: "Workshop access", values: { friday: false, saturday: "Choose one", weekend: "All sessions" } },
      { id: "price", label: "Pass price", values: { friday: "$35", saturday: "$89", weekend: "$129" } },
    ],
  },
  compact: {
    eyebrow: "Delivery options",
    title: "Get your order on your terms",
    description: "A quick comparison of the ways we can get it to your door.",
    options: [
      { id: "pickup", title: "Store pickup" },
      { id: "standard", title: "Standard delivery" },
      { id: "express", title: "Express delivery" },
    ],
    features: [
      { id: "fee", label: "Fee", values: { pickup: "Free", standard: "$4", express: "$9" } },
      { id: "arrival", label: "Ready in", values: { pickup: "2 hours", standard: "2–3 days", express: "Tomorrow" } },
    ],
  },
  interactive: {
    eyebrow: "Pick your workspace",
    title: "Start simple, then make it yours",
    description: "Select a plan to compare how much room each one gives your team.",
    options: [
      { id: "solo", title: "Solo", description: "A clear home for personal projects." },
      { id: "maker", title: "Maker", description: "More space for a growing studio.", featured: true },
      { id: "collective", title: "Collective", description: "Shared tools for a larger team." },
    ],
    features: [
      { id: "members", label: "Members", values: { solo: 1, maker: 8, collective: 30 } },
      { id: "spaces", label: "Project spaces", values: { solo: 3, maker: 20, collective: "Unlimited" } },
      { id: "review", label: "Guest reviews", values: { solo: false, maker: true, collective: true } },
    ],
    highlightedOptionId: "maker",
    defaultSelectedOptionId: "maker",
  },
};
const comparisonVariants: SectionVariantPreview<ComparisonVariant>[] = [
  {
    variant: "table",
    useCase: "Compare structured features across a few options.",
  },
  { variant: "cards", useCase: "Compare options as self-contained cards." },
  {
    variant: "split",
    useCase: "Emphasize two choices in a side-by-side layout.",
  },
  { variant: "versus", useCase: "Present a direct two-option comparison." },
  { variant: "checklist", useCase: "Scan included and excluded features." },
  {
    variant: "feature-matrix",
    useCase: "Compare many features in a semantic table.",
  },
  {
    variant: "pricing",
    useCase: "Compare plan features and consumer-provided actions.",
  },
  {
    variant: "highlighted",
    useCase: "Draw attention to a recommended option.",
  },
  {
    variant: "horizontal",
    useCase: "Lay options out in a responsive row of cards.",
  },
  {
    variant: "vertical",
    useCase: "Stack choices for narrow or mobile layouts.",
  },
  {
    variant: "compact",
    useCase: "Use a denser presentation for short comparisons.",
  },
  {
    variant: "interactive",
    useCase: "Let visitors select an option and compare its values.",
  },
];

export const ComparisonSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ComparisonSection"
    variants={comparisonVariants}
    buildCode={(variant) =>
      variant === "interactive"
        ? `<ComparisonSection variant="interactive" options={options} features={features} defaultSelectedOptionId="maker" />`
        : `<ComparisonSection variant="${variant}" options={options} features={features} />`
    }
    renderVariant={(variant) => {
      const preview = comparisonPreviewContent[variant];
      const content = {
        eyebrow: preview.eyebrow,
        title: preview.title,
        description: preview.description,
        options: preview.options,
        features: preview.features,
        highlightedOptionId: preview.highlightedOptionId,
      };

      return variant === "interactive" ? (
        <ComparisonSection
          {...content}
          variant={variant}
          defaultSelectedOptionId={preview.defaultSelectedOptionId}
        />
      ) : (
        <ComparisonSection {...content} variant={variant} />
      );
    }}
  />
);
