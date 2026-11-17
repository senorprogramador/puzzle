import {
  IntegrationsSection,
  type IntegrationItem,
  type IntegrationsVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const integrationItems: IntegrationItem[] = [
  {
    id: "relay",
    name: "Relay Email",
    logo: <span aria-hidden="true">R</span>,
    category: "Messaging",
    description: "Send project updates to the right team channel.",
    featured: true,
  },
  {
    id: "beacon",
    name: "Beacon Analytics",
    logo: <span aria-hidden="true">B</span>,
    category: "Analytics",
    description: "Bring product events into workspace reports.",
  },
  {
    id: "atlas",
    name: "Atlas Storage",
    logo: <span aria-hidden="true">A</span>,
    category: "Storage",
    description: "Attach shared files to a project record.",
  },
  {
    id: "northstar",
    name: "Northstar CRM",
    logo: <span aria-hidden="true">N</span>,
    category: "CRM",
    description: "Keep account context close to delivery work.",
  },
];

const variants: SectionVariantPreview<IntegrationsVariant>[] = [
  { variant: "grid", useCase: "Browse a balanced directory of integrations." },
  { variant: "categorized", useCase: "Group integrations under their categories." },
  { variant: "featured", useCase: "Emphasize one integration beside the rest." },
  { variant: "ecosystem", useCase: "Show integrations surrounding a platform." },
  { variant: "orbit", useCase: "Arrange integrations around a central product node." },
  { variant: "network", useCase: "Connect integration cards in a network layout." },
  { variant: "carousel", useCase: "Scroll through a horizontal integration rail." },
  { variant: "list", useCase: "Present compact, full-width integration rows." },
  { variant: "grouped", useCase: "Separate integration groups with clear dividers." },
  { variant: "split", useCase: "Pair the directory with a featured connection." },
  { variant: "logo-wall", useCase: "Prioritize supplied logos over descriptions." },
  { variant: "connected", useCase: "Trace integrations along a vertical connector." },
];

export const IntegrationsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="IntegrationsSection"
    variants={variants}
    buildCode={(variant) =>
      `<IntegrationsSection variant="${variant}" items={integrations} filterable />`
    }
    renderVariant={(variant) => (
      <IntegrationsSection
        variant={variant}
        eyebrow="Connect your stack"
        title="Tools your team already uses"
        description="A fictional product directory with searchable integrations and clear categories."
        items={integrationItems}
        filterable
        centerLabel="Northstar"
      />
    )}
  />
);
