import {
  ServiceOptionsSection,
  type ServiceOption,
} from "@puzzle-ui/pieces";
import { Icon } from "@puzzle-ui/icons";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const services: ServiceOption[] = [
  {
    id: "breakfast",
    title: "Breakfast basket",
    description: "Fresh bread, local fruit, and preserves delivered each morning.",
    icon: <Icon name="heroicons:check-circle-20-solid" aria-hidden="true" />,
    inclusion: "included",
    category: "Food",
    featured: true,
  },
  {
    id: "sauna",
    title: "Private sauna",
    description: "Reserve a quiet evening session for your party.",
    icon: <Icon name="heroicons:clock-20-solid" aria-hidden="true" />,
    inclusion: "optional",
    price: "€24 per session",
    category: "Wellness",
    action: <a href="mailto:hello@example.test">Ask about a session</a>,
  },
  {
    id: "bikes",
    title: "Guest bicycles",
    description: "Borrow a bicycle for a ride around the nearby lanes.",
    inclusion: "included",
    category: "Outdoors",
  },
];

const variants = [
  { variant: "grid", useCase: "Present services as a simple grid." },
  { variant: "categorized", useCase: "Group services by supplied category." },
  { variant: "featured", useCase: "Highlight a recommended service." },
] as const satisfies readonly SectionVariantPreview<
  "grid" | "categorized" | "featured"
>[];

export const ServiceOptionsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ServiceOptionsSection"
    variants={variants}
    buildCode={(variant) =>
      `<ServiceOptionsSection variant="${variant}" services={services} />`
    }
    renderVariant={(variant) => (
      <ServiceOptionsSection
        title="Make your stay your own"
        variant={variant}
        services={services}
      />
    )}
  />
);
