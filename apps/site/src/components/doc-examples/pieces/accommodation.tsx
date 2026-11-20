import {
  AccommodationDetailsSection,
  AccommodationHero,
  AccommodationOverviewSection,
  AmenityListSection,
  CTASection,
  GallerySection,
  TestimonialsSection,
} from "@puzzle-ui/pieces";
import type {
  AccommodationOverviewItem,
  AmenityCategory,
  GalleryItem,
  TestimonialItem,
} from "@puzzle-ui/pieces";
import { Icon } from "@puzzle-ui/icons";
import { Button } from "@puzzle-ui/ui";
import {
  sectionPreviewImages,
  SectionPreviewImage,
} from "../shared/section-preview-media";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const accommodations: AccommodationOverviewItem[] = [
  {
    id: "pinecone-cabin",
    name: "Pinecone Cabin",
    description: "A small woodland hideaway with only the essentials.",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "A compact cabin among quiet woodland",
      width: 1200,
      height: 800,
    },
    capacity: 2,
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    price: { amount: 125, currency: "EUR" },
    priceNote: "per night",
    badges: [{ id: "quiet", content: "Quiet setting" }],
    highlights: [
      {
        id: "woodstove",
        label: "Wood-burning stove",
        icon: <Icon name="heroicons:check-circle-20-solid" aria-hidden="true" />,
      },
    ],
    href: "#pinecone-cabin",
  },
  {
    id: "willow-house",
    name: "Willow House",
    description:
      "A spacious family home with a garden, shared dining room, and easy walks along the river.",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "A warm family dining space opening onto a garden",
      width: 1200,
      height: 800,
    },
    capacity: 6,
    bedrooms: 3,
    beds: 5,
    bathrooms: 2,
    price: { amount: 240, currency: "EUR" },
    priceNote: "per night",
    badges: [{ id: "family", content: "Family favourite" }],
    highlights: [
      {
        id: "garden",
        label: "Private garden",
        icon: <Icon name="heroicons:eye-20-solid" aria-hidden="true" />,
      },
      {
        id: "river",
        label: "River walks nearby",
        icon: <Icon name="heroicons:clock-20-solid" aria-hidden="true" />,
      },
    ],
    href: "#willow-house",
    featured: true,
  },
  {
    id: "shoreline-lodge",
    name: "Shoreline Lodge",
    description:
      "A generous coastal retreat with a private sauna, beach access, and space to bring the whole group.",
    image: {
      src: sectionPreviewImages.product,
      alt: "A coastal lodge with a sheltered outdoor terrace",
      width: 1200,
      height: 800,
    },
    capacity: 8,
    bedrooms: 4,
    beds: 6,
    bathrooms: 3,
    price: { amount: 390, currency: "EUR" },
    priceNote: "per night",
    badges: [{ id: "coast", content: "Coastal stay" }],
    highlights: [
      {
        id: "sauna",
        label: "Private sauna",
        icon: <Icon name="heroicons:check-circle-20-solid" aria-hidden="true" />,
      },
      {
        id: "beach",
        label: "Direct beach access",
        icon: <Icon name="heroicons:eye-20-solid" aria-hidden="true" />,
      },
    ],
    href: "#shoreline-lodge",
  },
];

const amenityCategories: AmenityCategory[] = [
  {
    id: "comfort",
    name: "Comfort",
    items: [
      {
        id: "linen",
        label: "Fresh linen and towels",
        description: "Prepared before every stay.",
        icon: <Icon name="heroicons:check-circle-20-solid" aria-hidden="true" />,
      },
      {
        id: "heating",
        label: "Underfloor heating",
        description: "Available in every room.",
        icon: <Icon name="heroicons:clock-20-solid" aria-hidden="true" />,
      },
      { id: "blackout", label: "Blackout curtains" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen and dining",
    items: [
      { id: "kitchen", label: "Fully equipped kitchen" },
      { id: "coffee", label: "Coffee maker and kettle" },
      { id: "dining", label: "Indoor and outdoor dining" },
    ],
  },
  {
    id: "outdoors",
    name: "Outdoors and wellness",
    items: [
      { id: "sauna", label: "Private sauna" },
      { id: "beach", label: "Direct beach access" },
      { id: "garden", label: "Sheltered garden terrace" },
      { id: "bikes", label: "Four guest bicycles" },
    ],
  },
];

const galleryItems: GalleryItem[] = [
  {
    id: "exterior",
    image: {
      src: sectionPreviewImages.product,
      alt: "Shoreline Lodge from the garden",
      width: 1200,
      height: 800,
    },
    featured: true,
  },
  {
    id: "living-room",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "The light-filled shared living room",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "landscape",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "The shoreline and dunes nearby",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "garden",
    image: {
      src: sectionPreviewImages.team,
      alt: "A sheltered place to dine outdoors",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "workspace",
    image: {
      src: sectionPreviewImages.dashboard,
      alt: "A quiet desk for reading or remote work",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "details",
    image: {
      src: sectionPreviewImages.mobile,
      alt: "A thoughtful detail in the lodge",
      width: 900,
      height: 900,
    },
  },
];

const overviewVariants: SectionVariantPreview<
  "grid" | "list" | "carousel"
>[] = [
  { variant: "grid", useCase: "Compare stays at a glance." },
  { variant: "list", useCase: "Give more room to descriptions and metadata." },
  {
    variant: "carousel",
    useCase: "Focus on a few featured stays in a compact horizontal space.",
  },
];

const detailsVariants: SectionVariantPreview<"split" | "stacked">[] = [
  {
    variant: "split",
    useCase: "Show media beside structured accommodation details.",
  },
  {
    variant: "stacked",
    useCase: "Keep media and details in one continuous column.",
  },
];

type AmenityPreviewVariant =
  | "compact-grid"
  | "compact-list"
  | "expanded-grid"
  | "expanded-list"
  | "collapsible";

const amenityVariants: SectionVariantPreview<AmenityPreviewVariant>[] = [
  { variant: "compact-grid", useCase: "Compact labels in a fluid grid." },
  { variant: "compact-list", useCase: "Compact rows in a single column." },
  {
    variant: "expanded-grid",
    useCase: "Descriptions and icons in a responsive grid.",
  },
  {
    variant: "expanded-list",
    useCase: "Descriptions and icons in a single column.",
  },
  {
    variant: "collapsible",
    useCase: "Let guests expand only the categories they need.",
  },
];

const amenityVariantProps: Record<
  Exclude<AmenityPreviewVariant, "collapsible">,
  { variant: "compact" | "expanded"; layout: "grid" | "list" }
> = {
  "compact-grid": { variant: "compact", layout: "grid" },
  "compact-list": { variant: "compact", layout: "list" },
  "expanded-grid": { variant: "expanded", layout: "grid" },
  "expanded-list": { variant: "expanded", layout: "list" },
};

const testimonials: TestimonialItem[] = [
  {
    id: "mara",
    quote:
      "The house felt thoughtful without making the stay feel over-planned. We had everything we needed and plenty of room to slow down.",
    author: "Mara Jensen",
    role: "Guest at Willow House",
    rating: 5,
  },
  {
    id: "leo",
    quote:
      "The shoreline was a short walk away, and the lodge made it easy for our whole group to settle in.",
    author: "Leo Martin",
    role: "Guest at Shoreline Lodge",
    rating: 5,
  },
];

export const AccommodationOverviewVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AccommodationOverviewSection"
    variants={overviewVariants}
    buildCode={(variant) =>
      `<AccommodationOverviewSection variant="${variant}" items={accommodations} />`
    }
    renderVariant={(variant) => (
      <AccommodationOverviewSection
        variant={variant}
        title="A stay that fits your plans"
        description="Three distinct places, each with its own pace."
        items={accommodations}
      />
    )}
  />
);

export const AccommodationDetailsVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AccommodationDetailsSection"
    variants={detailsVariants}
    buildCode={(variant) =>
      `<AccommodationDetailsSection variant="${variant}" accommodation={stay} media={<GallerySection items={images} />} />`
    }
    renderVariant={(variant) => (
      <AccommodationDetailsSection
        variant={variant}
        accommodation={{
          name: "Shoreline Lodge",
          description:
            "A generous coastal retreat with shared spaces for a group stay.",
          capacity: 8,
          bedrooms: 4,
          beds: 6,
          bathrooms: 3,
          sleepingArrangements: [
            {
              id: "primary",
              name: "Primary bedroom",
              description: "One king bed.",
            },
            {
              id: "bunk",
              name: "Bunk room",
              description: "Two twin beds.",
            },
          ],
          highlights: [
            { id: "sauna", label: "Private sauna" },
            { id: "beach", label: "Direct beach access" },
          ],
        }}
        media={
          <SectionPreviewImage
            src={sectionPreviewImages.product}
            alt="Shoreline Lodge beside the coast"
            aspectRatio="4 / 3"
          />
        }
      />
    )}
  />
);

export const AccommodationDetailsExample = () => (
  <AccommodationDetailsSection
    title="A little more room to unwind"
    accommodation={{
      name: "Shoreline Lodge",
      description:
        "Settle into a generous coastal home designed for shared meals, quiet mornings, and unhurried afternoons.",
      capacity: 8,
      bedrooms: 4,
      beds: 6,
      bathrooms: 3,
      sleepingArrangements: [
        {
          id: "primary",
          name: "Primary bedroom",
          description: "One king bed and an ensuite bathroom.",
        },
        {
          id: "guest",
          name: "Guest bedrooms",
          description: "Two queen beds across two rooms.",
        },
        {
          id: "bunk",
          name: "Bunk room",
          description: "Two twin beds with a reading nook.",
        },
      ],
      highlights: [
        { id: "sauna", label: "Private sauna" },
        { id: "beach", label: "Direct beach access" },
        { id: "desk", label: "Dedicated reading and work space" },
      ],
    }}
    media={
      <GallerySection
        variant="bento"
        title="Explore the lodge"
        items={galleryItems}
        lightbox
      />
    }
    facilities={
      <AmenityListSection
        title="Facilities"
        categories={amenityCategories}
        variant="expanded"
        layout="grid"
      />
    }
    actions={<Button type="button" variant="secondary">Ask about this stay</Button>}
  />
);

export const AmenityListVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AmenityListSection"
    variants={amenityVariants}
    buildCode={(variant) => {
      if (variant === "collapsible") {
        return `<AmenityListSection categories={amenities} collapsible />`;
      }

      const props = amenityVariantProps[variant];

      return `<AmenityListSection categories={amenities} variant="${props.variant}" layout="${props.layout}" />`;
    }}
    renderVariant={(variant) => {
      const props =
        variant === "collapsible"
          ? {
              ...amenityVariantProps["expanded-grid"],
              collapsible: true,
            }
          : { ...amenityVariantProps[variant], collapsible: false };

      return (
        <AmenityListSection
          title="Included with your stay"
          categories={amenityCategories}
          {...props}
        />
      );
    }}
  />
);

export const AccommodationDiscoveryExample = () => (
  <div className="puzzle-accommodation-discovery-example">
    <AccommodationHero
      eyebrow="Pine & Tide stays"
      title="A slower stay, close to the coast."
      description="Choose a small woodland cabin, a family home by the river, or a generous coastal lodge."
      backgroundImage={sectionPreviewImages.landscape}
      actions={<Button type="button">Explore the stays</Button>}
    />
    <AccommodationOverviewSection
      title="Find your kind of escape"
      description="Three distinct places, with the details that make planning easier."
      items={accommodations}
      variant="grid"
    />
    <AccommodationDetailsSection
      id="shoreline-lodge"
      accommodation={{
        name: "Shoreline Lodge",
        description:
          "A relaxed base for a longer coastal stay, with generous shared spaces and room for eight.",
        capacity: 8,
        bedrooms: 4,
        beds: 6,
        bathrooms: 3,
        sleepingArrangements: [
          {
            id: "primary",
            name: "Primary bedroom",
            description: "One king bed and an ensuite bathroom.",
          },
          {
            id: "guest",
            name: "Guest bedrooms",
            description: "Two queen beds across two rooms.",
          },
          {
            id: "bunk",
            name: "Bunk room",
            description: "Two twin beds with a reading nook.",
          },
        ],
        highlights: [
          { id: "sauna", label: "Private sauna" },
          { id: "beach", label: "Direct beach access" },
          { id: "garden", label: "Sheltered garden terrace" },
        ],
      }}
      media={
        <GallerySection
          variant="bento"
          title="Life at the lodge"
          items={galleryItems}
          lightbox
        />
      }
      facilities={
        <AmenityListSection
          title="Facilities"
          categories={amenityCategories}
          variant="expanded"
          layout="grid"
        />
      }
      actions={<Button type="button" variant="secondary">Ask about Shoreline Lodge</Button>}
    />
    <TestimonialsSection
      title="A few words from our guests"
      variant="grid"
      items={testimonials}
    />
    <CTASection
      title="Need help choosing a stay?"
      description="Tell us what matters most and our team can point you in the right direction."
      primaryAction={<Button type="button">Contact the host</Button>}
    />
  </div>
);
