import { LocalGuideSection } from "@puzzle-ui/pieces";
import { SectionPreviewImage, sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const places = [
  {
    id: "dune-trail",
    title: "Dune trail",
    description: "A gentle loop through grassland and quiet coastal paths.",
    category: "Outdoors",
    kind: "Walk",
    distance: "1.2 km",
    travelTime: "15 minutes on foot",
    href: "https://example.test/dune-trail",
    thumbnail: (
      <SectionPreviewImage
        src={sectionPreviewImages.landscape}
        alt="A path through the coastal dunes"
      />
    ),
    featured: true,
  },
  {
    id: "farmers-market",
    title: "Saturday farmers market",
    description: "Local produce, flowers, and fresh bread in the village square.",
    category: "Food",
    kind: "Market",
    distance: "800 m",
    travelTime: "10 minutes on foot",
  },
  {
    id: "harbor",
    title: "Old harbor",
    description: "A working harbor with small cafés and boat trips.",
    category: "Culture",
    kind: "Place",
    distance: "3.5 km",
    travelTime: "8 minutes by bicycle",
    href: "https://example.test/old-harbor",
  },
];

const variants = [
  { variant: "grid", useCase: "Browse a balanced list of local places." },
  { variant: "list", useCase: "Give longer descriptions more room." },
  { variant: "featured", useCase: "Lead with a recommended nearby place." },
  { variant: "categories", useCase: "Group places by their supplied category." },
] as const satisfies readonly SectionVariantPreview<
  "grid" | "list" | "featured" | "categories"
>[];

const mapSlot = (
  <div
    role="img"
    aria-label="Map supplied by the application"
  >
    Map supplied by the application
  </div>
);

export const LocalGuideSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="LocalGuideSection"
    variants={variants}
    buildCode={(variant) =>
      `<LocalGuideSection variant="${variant}" places={places} mapSlot={map} />`
    }
    renderVariant={(variant) => (
      <LocalGuideSection
        title="Make the most of the neighborhood"
        description="Distances, travel times, and links come from the application."
        variant={variant}
        places={places}
        mapSlot={mapSlot}
      />
    )}
  />
);

export const LocalGuideEmptyExample = () => (
  <LocalGuideSection
    title="Explore the area"
    places={[]}
    filterable={false}
    emptyState="Local recommendations will appear here."
  />
);
