import {
  AccommodationDetailsSection,
  AccommodationHero,
  AmenityListSection,
  CTASection,
  GallerySection,
  GiftVoucherSection,
  GuestReviewsSection,
  HostProfileSection,
  LocalGuideSection,
  ServiceOptionsSection,
} from "@puzzle-ui/pieces";
import { Button, Text } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons";
import { sectionPreviewImages } from "../shared/section-preview-media";

const gallery = [
  {
    id: "garden",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "A garden path leading to the guest house",
      width: 1200,
      height: 800,
    },
    featured: true,
  },
  {
    id: "breakfast-room",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "The bright breakfast room",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "coast",
    image: {
      src: sectionPreviewImages.product,
      alt: "A calm stretch of coast close to the house",
      width: 1200,
      height: 800,
    },
  },
];

const amenities = [
  {
    id: "comfort",
    name: "In the house",
    items: [
      {
        id: "breakfast",
        label: "Daily breakfast",
        icon: <Icon name="heroicons:check-circle-20-solid" aria-hidden="true" />,
      },
      { id: "wifi", label: "Wi-Fi in every room" },
      { id: "garden", label: "Shared garden terrace" },
    ],
  },
  {
    id: "outdoors",
    name: "Nearby",
    items: [
      { id: "bikes", label: "Guest bicycles" },
      { id: "beach", label: "Coastal path access" },
    ],
  },
];

export const BoutiqueBnbReferenceExample = () => (
  <main>
    <AccommodationHero
      eyebrow="The Willow & Tide"
      title="A small B&B with room to slow down."
      description="Thoughtful rooms, a generous breakfast, and the coast just beyond the garden."
      backgroundImage={sectionPreviewImages.landscape}
      actions={<Button href="#rooms">Explore the house</Button>}
    />
    <AccommodationDetailsSection
      id="rooms"
      title="A warm place to return to"
      accommodation={{
        name: "Willow & Tide Guest House",
        description:
          "Three individually styled rooms share a quiet garden, a bright breakfast room, and easy access to the shoreline.",
        capacity: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 2,
        sleepingArrangements: [
          {
            id: "garden-room",
            name: "Garden room",
            description: "A queen bed with a view onto the terrace.",
          },
          {
            id: "coast-room",
            name: "Coast room",
            description: "A king bed with a small reading nook.",
          },
          {
            id: "loft",
            name: "Loft room",
            description: "A double bed beneath the old timber beams.",
          },
        ],
        highlights: [
          { id: "breakfast", label: "Breakfast made with local ingredients" },
          { id: "garden", label: "Sheltered garden for slow afternoons" },
          { id: "coast", label: "Coastal paths within walking distance" },
        ],
      }}
      media={
        <GallerySection
          title="A look around"
          variant="bento"
          items={gallery}
          lightbox
        />
      }
      facilities={
        <AmenityListSection
          title="Small details, well considered"
          categories={amenities}
          variant="expanded"
          layout="grid"
        />
      }
      actions={<Button href="mailto:hello@willowtide.example">Ask the host</Button>}
    />
    <HostProfileSection
      title="Meet Mara"
      host={{
        id: "mara",
        name: "Mara Jensen",
        role: "Owner and host",
        avatar: {
          src: sectionPreviewImages.portraitOne,
          alt: "Portrait of Mara Jensen",
        },
        biography: "A local host who loves sharing quiet places by the water.",
        languages: ["Dutch", "English"],
        story:
          "Mara restored the guest house with her family and has welcomed travelers here for twelve years.",
        contactAction: (
          <Button href="mailto:mara@willowtide.example" variant="secondary">
            Contact Mara
          </Button>
        ),
      }}
    />
    <GuestReviewsSection
      title="Notes from recent guests"
      reviews={[
        {
          id: "morgan",
          quote: "The breakfast and the small garden made our weekend.",
          author: "Morgan",
          rating: 5,
          date: "2026-05-14",
          dateLabel: "14 May 2026",
          source: "Guestbook",
          featured: true,
        },
        {
          id: "alex",
          quote: "A peaceful base for walking and exploring the coast.",
          author: "Alex",
          rating: 4.8,
          date: "2026-04-19",
          dateLabel: "19 April 2026",
          source: "Stay notes",
        },
      ]}
      summary={{
        score: 4.9,
        totalReviews: 32,
        distribution: [
          { score: 5, count: 29 },
          { score: 4, count: 3 },
        ],
      }}
    />
    <ServiceOptionsSection
      title="A few thoughtful extras"
      services={[
        {
          id: "breakfast-basket",
          title: "Breakfast basket",
          description: "Fresh bread, fruit, and preserves each morning.",
          inclusion: "included",
          category: "At the house",
        },
        {
          id: "late-checkout",
          title: "A slower departure",
          description: "Ask about a later checkout for your stay.",
          inclusion: "optional",
          price: <Text as="span">€20 per room</Text>,
          category: "At the house",
          action: <a href="mailto:hello@willowtide.example">Ask about checkout</a>,
        },
      ]}
      variant="categorized"
    />
    <LocalGuideSection
      title="A little further afield"
      places={[
        {
          id: "dune-trail",
          title: "Dune trail",
          description: "A gentle loop through the dunes and along the shoreline.",
          category: "Outdoors",
          kind: "Walk",
          distance: "1.2 km",
          travelTime: "15 minutes on foot",
          href: "https://example.test/dune-trail",
          thumbnail: (
            <img
              src={sectionPreviewImages.landscape}
              alt="A path through coastal dunes"
            />
          ),
        },
        {
          id: "village-market",
          title: "Village market",
          description: "Local produce and fresh bread every Saturday morning.",
          category: "Food",
          kind: "Market",
          distance: "800 m",
          travelTime: "10 minutes on foot",
        },
      ]}
    />
    <GiftVoucherSection
      title="Give someone a slower weekend"
      vouchers={[
        {
          id: "weekend-for-two",
          name: "A weekend for two",
          description: "Two nights with breakfast in one of our garden rooms.",
          price: { amount: 260, currency: "EUR" },
          arrangement: "Two nights with breakfast",
          purchaseHref: "https://example.test/willow-tide-vouchers",
        },
      ]}
      locale="en-GB"
    />
    <CTASection
      title="Make a little room to unwind."
      description="Ask Mara about the dates and room that suit your stay."
      primaryAction={
        <Button href="mailto:mara@willowtide.example">Contact the host</Button>
      }
    />
  </main>
);
