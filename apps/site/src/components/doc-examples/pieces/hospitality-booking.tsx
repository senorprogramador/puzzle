import { useState } from "react";
import {
  AvailabilitySearchSection,
  HouseRulesSection,
  RatePlansSection,
  StaySummarySection,
} from "@puzzle-ui/pieces";
import type {
  AvailabilityAccommodationOption,
  AvailabilityChildAgeOption,
  AvailabilitySearchValues,
  AvailabilitySearchVariant,
  HouseRuleCategory,
  HouseRulesVariant,
  RatePlan,
  StaySummaryPriceLine,
  StaySummaryVariant,
} from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const accommodations: AvailabilityAccommodationOption[] = [
  { id: "pinecone-cabin", name: "Pinecone Cabin" },
  { id: "willow-house", name: "Willow House" },
  { id: "shoreline-lodge", name: "Shoreline Lodge" },
];

const childAgeOptions: AvailabilityChildAgeOption[] = [
  { value: 0, label: "Under 1 year" },
  { value: 5, label: "5 years" },
  { value: 12, label: "12 years" },
  { value: 17, label: "17 years" },
];

const initialSearch: AvailabilitySearchValues = {
  checkIn: new Date(2026, 8, 10),
  checkOut: new Date(2026, 8, 14),
  guests: { adults: 2, children: 1, childAges: [5] },
  accommodationId: "willow-house",
  flexibleDates: false,
};

const ratePlans: RatePlan[] = [
  {
    id: "flexible",
    name: "Flexible stay",
    description: "Change your plans with a little more room to breathe.",
    arrangement: "Bed and breakfast",
    pricePerNight: { amount: 240, currency: "EUR" },
    weeklyPrice: { amount: 1450, currency: "EUR" },
    includedServices: [
      { id: "breakfast", label: "Breakfast for every guest" },
      { id: "parking", label: "Private parking" },
      {
        id: "welcome",
        label: "Welcome basket",
        description: "Prepared by the host before arrival.",
      },
    ],
    cancellation: "Free cancellation until two days before check-in.",
    featured: true,
    action: (
      <Button
        href="https://booking.example/reserve?rate=flexible"
        target="_blank"
        rel="noreferrer"
      >
        Continue to host booking
      </Button>
    ),
  },
  {
    id: "advance",
    name: "Advance purchase",
    description: "A lower supplied rate with stricter cancellation terms.",
    arrangement: "Room only",
    pricePerNight: { amount: 205, currency: "EUR" },
    weeklyPrice: { amount: 1240, currency: "EUR" },
    includedServices: [{ id: "parking", label: "Private parking" }],
    cancellation: "Non-refundable.",
    action: (
      <Button
        href="https://booking.example/reserve?rate=advance"
        target="_blank"
        rel="noreferrer"
        variant="secondary"
      >
        View advance rate
      </Button>
    ),
  },
];

const priceLines: StaySummaryPriceLine[] = [
  {
    id: "discount",
    label: "Spring offer",
    amount: { amount: -80, currency: "EUR" },
    kind: "discount",
  },
  {
    id: "cleaning",
    label: "Cleaning fee",
    amount: { amount: 45, currency: "EUR" },
    kind: "fee",
  },
  {
    id: "breakfast",
    label: "Breakfast service",
    amount: { amount: 120, currency: "EUR" },
    kind: "service",
  },
];

const staySummaryProps = {
  accommodation: {
    name: "Willow House",
    description: "A family home beside the river.",
  },
  checkIn: initialSearch.checkIn,
  checkOut: initialSearch.checkOut,
  guests: initialSearch.guests,
  nights: 4,
  subtotal: { amount: 960, currency: "EUR" },
  priceLines,
  total: { amount: 1045, currency: "EUR" },
  locale: "en-GB",
  timeZone: "Europe/Amsterdam",
};

const houseRuleCategories: HouseRuleCategory[] = [
  {
    id: "arrival",
    title: "Arrival and departure",
    description: "Coordinate arrival details directly with your host.",
    rules: [
      {
        id: "check-in",
        label: "Check-in",
        value: "From 3:00 PM",
        description: "Please share your estimated arrival time.",
      },
      {
        id: "check-out",
        label: "Check-out",
        value: "By 10:00 AM",
      },
    ],
  },
  {
    id: "guests",
    title: "Guests and pets",
    rules: [
      { id: "children", label: "Children", value: "Welcome" },
      { id: "pets", label: "Pets", value: "Ask before arrival" },
    ],
  },
  {
    id: "property",
    title: "Property",
    rules: [
      { id: "smoking", label: "Smoking", value: "Not permitted indoors" },
      { id: "parking", label: "Parking", value: "One private space" },
    ],
  },
  {
    id: "payment",
    title: "Payment and cancellation",
    rules: [
      {
        id: "payment-method",
        label: "Payment",
        value: "Provided by the host's booking service",
      },
      {
        id: "cancellation",
        label: "Cancellation",
        value: "See the selected rate plan",
      },
    ],
  },
  {
    id: "practical",
    title: "Practical arrangements",
    rules: [
      {
        id: "quiet-hours",
        label: "Quiet hours",
        value: "10:00 PM to 8:00 AM",
      },
    ],
  },
];

const availabilitySearchVariants: SectionVariantPreview<AvailabilitySearchVariant>[] =
  [
    {
      variant: "compact",
      useCase: "Keep date and guest search controls concise.",
    },
    {
      variant: "expanded",
      useCase: "Give search fields more room in a dedicated search area.",
    },
  ];

const ratePlanScenarios: SectionVariantPreview<"single" | "featured">[] = [
  {
    variant: "single",
    useCase: "Present one supplied rate without a recommendation badge.",
  },
  {
    variant: "featured",
    useCase: "Compare rates and highlight the caller-designated recommendation.",
  },
];

const staySummaryVariants: SectionVariantPreview<StaySummaryVariant>[] = [
  { variant: "default", useCase: "Show the complete stay and price summary." },
  { variant: "compact", useCase: "Reduce spacing in a denser page layout." },
];

const houseRulesVariants: SectionVariantPreview<HouseRulesVariant>[] = [
  {
    variant: "expanded",
    useCase: "Include supporting descriptions alongside each rule.",
  },
  {
    variant: "compact",
    useCase: "Show concise rule values and optional disclosures.",
  },
];

export const AvailabilitySearchCompactExample = () => (
  <AvailabilitySearchSection
    title="Find a stay"
    description="Share the dates and guest count you would like to send to your availability provider."
    variant="compact"
    defaultValue={initialSearch}
    accommodations={accommodations}
    childAgeOptions={childAgeOptions}
    locale="en-GB"
    onSubmit={() => undefined}
  />
);

export const AvailabilitySearchExpandedExample = () => {
  const [message, setMessage] = useState("");

  return (
    <>
      <AvailabilitySearchSection
        title="Search with your preferences"
        description="The submit callback is where your application can pass this request to an external availability service."
        variant="expanded"
        defaultValue={initialSearch}
        accommodations={accommodations}
        childAgeOptions={childAgeOptions}
        accommodationRequired
        locale="en-GB"
        onSubmit={async (values) => {
          setMessage(
            `Request passed to the host service for ${values.guests.adults} adults and ${values.guests.children} children.`,
          );
        }}
      />
      {message ? <p role="status">{message}</p> : null}
    </>
  );
};

export const AvailabilitySearchControlledDatesExample = () => {
  const [value, setValue] = useState(initialSearch);

  return (
    <AvailabilitySearchSection
      title="Controlled date selection"
      value={value}
      onChange={setValue}
      accommodations={accommodations}
      childAgeOptions={childAgeOptions}
      locale="en-GB"
      onSubmit={() => undefined}
    />
  );
};

export const AvailabilitySearchControlledGuestsExample = () => {
  const [value, setValue] = useState(initialSearch);

  return (
    <AvailabilitySearchSection
      title="Controlled guest selection"
      value={value}
      onChange={setValue}
      accommodations={accommodations}
      childAgeOptions={childAgeOptions}
      locale="en-GB"
      onSubmit={() => undefined}
    />
  );
};

export const AvailabilitySearchLoadingErrorExample = () => {
  const [error, setError] = useState<string>();

  return (
    <AvailabilitySearchSection
      title="External availability check"
      defaultValue={initialSearch}
      accommodations={accommodations}
      childAgeOptions={childAgeOptions}
      error={error}
      onSubmit={async () => {
        await new Promise<void>((resolve) => setTimeout(resolve, 350));
        setError("The external availability provider returned an error.");
      }}
    />
  );
};

export const RatePlansExample = () => (
  <RatePlansSection
    title="Choose a rate"
    description="Each rate and action is supplied by the lodging application."
    plans={ratePlans}
    locale="en-GB"
  />
);

export const StaySummaryExample = () => (
  <StaySummarySection
    title="Review your stay"
    {...staySummaryProps}
    onEdit={() => undefined}
    onContinue={() => undefined}
  />
);

export const StaySummaryCompactExample = () => (
  <StaySummarySection
    title="Compact stay summary"
    {...staySummaryProps}
    variant="compact"
  />
);

export const HouseRulesExample = () => (
  <HouseRulesSection
    title="A few things to know"
    description="The property owner provides these stay details."
    categories={houseRuleCategories}
    variant="expanded"
  />
);

export const HouseRulesCompactExample = () => (
  <HouseRulesSection
    title="Quick house rules"
    categories={houseRuleCategories}
    variant="compact"
    collapsible
  />
);

export const AvailabilitySearchSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AvailabilitySearchSection"
    variants={availabilitySearchVariants}
    buildCode={(variant) =>
      `<AvailabilitySearchSection variant="${variant}" defaultValue={search} onSubmit={submitSearch} />`
    }
    renderVariant={(variant) =>
      variant === "compact" ? (
        <AvailabilitySearchCompactExample />
      ) : (
        <AvailabilitySearchExpandedExample />
      )
    }
  />
);

export const RatePlansSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="RatePlansSection"
    variants={ratePlanScenarios}
    buildCode={(variant) =>
      `<RatePlansSection plans={${variant === "single" ? "ratePlans.slice(1)" : "ratePlans"}} locale="en-GB" />`
    }
    renderVariant={(variant) => (
      <RatePlansSection
        title={variant === "single" ? "One supplied rate" : "Compare supplied rates"}
        description="Prices and actions remain caller-owned."
        plans={variant === "single" ? ratePlans.slice(1) : ratePlans}
        locale="en-GB"
      />
    )}
  />
);

export const StaySummarySectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="StaySummarySection"
    variants={staySummaryVariants}
    buildCode={(variant) =>
      `<StaySummarySection variant="${variant}" accommodation={stay} guests={guests} priceLines={priceLines} total={total} />`
    }
    renderVariant={(variant) => (
      <StaySummarySection
        title="Review your stay"
        {...staySummaryProps}
        variant={variant}
        onEdit={() => undefined}
        onContinue={() => undefined}
      />
    )}
  />
);

export const HouseRulesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="HouseRulesSection"
    variants={houseRulesVariants}
    buildCode={(variant) =>
      `<HouseRulesSection categories={houseRules} variant="${variant}"${variant === "compact" ? " collapsible" : ""} />`
    }
    renderVariant={(variant) => (
      <HouseRulesSection
        title={variant === "compact" ? "Quick house rules" : "A few things to know"}
        categories={houseRuleCategories}
        variant={variant}
        collapsible={variant === "compact"}
      />
    )}
  />
);

export const BookingFlowExample = () => {
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [status, setStatus] = useState("");

  return (
    <div className="puzzle-hospitality-booking-flow">
      <AvailabilitySearchSection
        title="1. Search"
        value={searchValue}
        onChange={setSearchValue}
        accommodations={accommodations}
        childAgeOptions={childAgeOptions}
        locale="en-GB"
        onSubmit={async (value) => {
          setStatus(
            `Search request handed to an external service for ${value.guests.adults} adults and ${value.guests.children} children.`,
          );
        }}
      />
      {status ? <p role="status">{status}</p> : null}
      <RatePlansSection
        title="2. Compare supplied rates"
        plans={ratePlans}
        locale="en-GB"
      />
      <StaySummarySection
        title="3. Review the supplied summary"
        {...staySummaryProps}
        checkIn={searchValue.checkIn}
        checkOut={searchValue.checkOut}
        guests={searchValue.guests}
        onEdit={() => setStatus("The application can return to its search step.")}
        onContinue={() =>
          setStatus("The application can continue to its booking provider.")
        }
      />
      <HouseRulesSection
        title="4. Review the house rules"
        categories={houseRuleCategories}
        variant="compact"
        collapsible
      />
    </div>
  );
};
