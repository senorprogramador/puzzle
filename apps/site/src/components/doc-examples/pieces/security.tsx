import {
  SecuritySection,
  type SecurityItem,
  type SecurityVariant,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const securityItems: SecurityItem[] = [
  {
    id: "access",
    title: "Workspace access policy",
    description: "Describe the access controls configured by your organization.",
    category: "Access",
    label: "Customer-provided",
    featured: true,
  },
  {
    id: "audit",
    title: "Audit documentation",
    description: "Link the current materials your team has reviewed.",
    category: "Documentation",
    label: "Example record",
    href: "/docs/pieces/components/security",
  },
  {
    id: "incident",
    title: "Incident response",
    description: "Add the response contacts and process your team maintains.",
    category: "Operations",
  },
];

const variants: SectionVariantPreview<SecurityVariant>[] = [
  { variant: "grid", useCase: "Summarize supplied security controls in a grid." },
  { variant: "badges", useCase: "Emphasize consumer-provided labels and policies." },
  { variant: "compliance", useCase: "Group supplied compliance information by category." },
  { variant: "split", useCase: "Highlight one control beside the rest of the details." },
  { variant: "certifications", useCase: "Link to certification or compliance records supplied by you." },
  { variant: "checklist", useCase: "Display a concise, readable checklist of controls." },
  { variant: "cards", useCase: "Separate each control into a reusable card." },
  { variant: "featured", useCase: "Give one supplied security item visual emphasis." },
  { variant: "dark", useCase: "Use an inverted, theme-aware security surface." },
  { variant: "metrics", useCase: "Present only the security metrics supplied in each item." },
  { variant: "audit", useCase: "Add optional audit information without inventing a report." },
  { variant: "trust-center", useCase: "Pair security details with a trust-center action." },
];

export const SecuritySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="SecuritySection"
    variants={variants}
    buildCode={(variant) =>
      `<SecuritySection variant="${variant}" items={securityItems} auditInfo={auditInfo} />`
    }
    renderVariant={(variant) => (
      <SecuritySection
        variant={variant}
        eyebrow="Security information"
        title="Describe the practices your team maintains"
        description="These fictional records are supplied as examples; the component does not verify or imply certifications."
        items={securityItems}
        auditInfo={<p>Add the audit period and documentation link maintained by your organization.</p>}
        actions={<a href="/docs/pieces/components/security">Trust and policy details</a>}
      />
    )}
  />
);
