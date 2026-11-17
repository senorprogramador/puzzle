import { FeaturesSection } from "@puzzle-ui/pieces";
import type { FeatureItem, FeaturesVariant } from "@puzzle-ui/pieces";
import { Icon } from "@puzzle-ui/icons/icon";
import { sectionPreviewImages, SectionPreviewImage } from "../shared/section-preview-media";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

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
