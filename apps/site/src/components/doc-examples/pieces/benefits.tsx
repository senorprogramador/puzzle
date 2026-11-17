import { BenefitsSection } from "@puzzle-ui/pieces";
import type { BenefitItem, BenefitsVariant } from "@puzzle-ui/pieces";
import { Icon } from "@puzzle-ui/icons/icon";
import { sectionPreviewImages, SectionPreviewImage } from "../shared/section-preview-media";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

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
