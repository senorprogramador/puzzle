import { LogoCloudSection } from "@puzzle-ui/pieces";
import type { LogoCloudItem, LogoCloudVariant } from "@puzzle-ui/pieces";
import { BrandWordmark } from "../shared/brand-wordmark";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

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
                  markForeground={
                    variant === "dark"
                      ? "var(--puzzle-color-text)"
                      : undefined
                  }
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
