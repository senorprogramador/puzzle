import { useState } from "react";
import { LocationSection, type LocationSectionVariant } from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const locations = [
  {
    id: "harbor",
    name: "Harbor House",
    address: "18 Quay Street, Amsterdam",
    phone: "+31 20 555 0180",
    email: "hello@harbor.example",
    coordinates: { latitude: 52.376, longitude: 4.9 },
    openingHours: [
      { day: "Monday–Friday", hours: "09:00–18:00" },
      { day: "Saturday", hours: "10:00–16:00" },
    ],
    directionsHref: "https://maps.google.com/?q=52.376,4.9",
    image: (
      <img
        src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=960&q=80"
        alt="Harbor House entrance beside a canal"
        loading="lazy"
      />
    ),
    mapSlot: (
      <div className="puzzle-location-example__map">
        Map area supplied by the application — no map service is bundled.
      </div>
    ),
    description: "A welcoming city retreat close to the historic harbor.",
  },
  {
    id: "garden",
    name: "Garden House",
    address: "4 Park Lane, Utrecht",
    phone: "+31 30 555 0104",
    email: "garden@harbor.example",
    openingHours: [{ day: "Every day", hours: "08:00–20:00" }],
    directionsHref: "https://maps.google.com/?q=4+Park+Lane+Utrecht",
    description: "A quiet place to stay near the city's gardens.",
  },
];

const variants: SectionVariantPreview<LocationSectionVariant>[] = [
  { variant: "map", useCase: "Place an app-provided map beside location details." },
  { variant: "split", useCase: "Balance office details with a map or image slot." },
  { variant: "cards", useCase: "Show multiple venues as responsive cards." },
  { variant: "offices", useCase: "List branch offices and their contacts." },
  { variant: "single", useCase: "Focus on one address and its contact details." },
  { variant: "directions", useCase: "Emphasize directions links and coordinates." },
  { variant: "image", useCase: "Pair a location with a caller-provided photograph." },
  { variant: "gallery", useCase: "Arrange several image-led locations." },
  { variant: "hours", useCase: "Highlight weekly opening hours." },
  { variant: "interactive", useCase: "Select a location and update its detail panel." },
];

export const LocationSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="LocationSection"
    variants={variants}
    buildCode={(variant) =>
      `<LocationSection variant="${variant}" locations={locations} mapSlot={applicationMap} />`
    }
    renderVariant={(variant) => (
      <LocationSection
        title="Find a Harbor House"
        description="Choose a property to see its address and opening hours."
        variant={variant}
        locations={variant === "single" ? locations.slice(0, 1) : locations}
        mapLabel="Map preview for the selected Harbor House"
      />
    )}
  />
);

export const LocationSelectionExample = () => {
  const [selectedLocationId, setSelectedLocationId] = useState("harbor");
  return (
    <LocationSection
      title="Our two Amsterdam-area stays"
      variant="interactive"
      locations={locations}
      selectedLocationId={selectedLocationId}
      onLocationSelect={setSelectedLocationId}
    />
  );
};
