import { useState } from "react";
import {
  GiftVoucherSection,
  GuestReviewsSection,
  HostProfileSection,
  LocalGuideSection,
  LocationSection,
  OpeningHoursSection,
  RestaurantHero,
  RestaurantMenuSection,
  ServiceOptionsSection,
  TableReservationSection,
} from "@puzzle-ui/pieces";
import type {
  OpeningHours,
  OpeningHoursVariant,
  RestaurantMenu,
  TableReservationValues,
} from "@puzzle-ui/pieces";
import { Button, Dialog } from "@puzzle-ui/ui";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const restaurantHours: OpeningHours = {
  timeZone: "Europe/Amsterdam",
  days: [
    {
      day: "monday",
      intervals: [
        { opensAt: "11:30", closesAt: "14:30", label: "Lunch" },
        { opensAt: "17:00", closesAt: "22:00", label: "Dinner" },
      ],
    },
    {
      day: "tuesday",
      intervals: [
        { opensAt: "11:30", closesAt: "14:30", label: "Lunch" },
        { opensAt: "17:00", closesAt: "22:00", label: "Dinner" },
      ],
    },
    {
      day: "wednesday",
      intervals: [
        { opensAt: "11:30", closesAt: "14:30", label: "Lunch" },
        { opensAt: "17:00", closesAt: "22:00", label: "Dinner" },
      ],
    },
    {
      day: "thursday",
      intervals: [
        { opensAt: "11:30", closesAt: "14:30", label: "Lunch" },
        { opensAt: "17:00", closesAt: "22:00", label: "Dinner" },
      ],
    },
    {
      day: "friday",
      intervals: [
        { opensAt: "11:30", closesAt: "14:30", label: "Lunch" },
        { opensAt: "17:00", closesAt: "23:00", label: "Dinner" },
      ],
    },
    {
      day: "saturday",
      intervals: [{ opensAt: "12:00", closesAt: "23:00", label: "All day" }],
    },
    { day: "sunday", intervals: [] },
  ],
  exceptions: [
    {
      id: "christmas",
      label: "Christmas Day",
      startDate: "2026-12-25",
      endDate: "2026-12-25",
      intervals: [],
    },
  ],
  seasons: [
    {
      id: "summer",
      label: "Summer terrace hours",
      startDate: "2026-06-01",
      endDate: "2026-08-31",
      days: [
        {
          day: "monday",
          intervals: [{ opensAt: "12:00", closesAt: "22:30" }],
        },
        {
          day: "tuesday",
          intervals: [{ opensAt: "12:00", closesAt: "22:30" }],
        },
        {
          day: "wednesday",
          intervals: [{ opensAt: "12:00", closesAt: "22:30" }],
        },
        {
          day: "thursday",
          intervals: [{ opensAt: "12:00", closesAt: "22:30" }],
        },
        {
          day: "friday",
          intervals: [{ opensAt: "12:00", closesAt: "23:30" }],
        },
        {
          day: "saturday",
          intervals: [{ opensAt: "12:00", closesAt: "23:30" }],
        },
        { day: "sunday", intervals: [] },
      ],
    },
  ],
};

const currentStatusAt = new Date("2026-12-15T18:30:00.000Z");

const lunchDinnerHours: OpeningHours = {
  ...restaurantHours,
  exceptions: [],
  seasons: [],
};

const hoursVariants = [
  { variant: "compact", useCase: "A concise weekly list." },
  { variant: "expanded", useCase: "The weekly schedule with seasonal and exception details." },
] as const satisfies readonly SectionVariantPreview<OpeningHoursVariant>[];

export const OpeningHoursSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="OpeningHoursSection"
    variants={hoursVariants}
    buildCode={(variant) =>
      `<OpeningHoursSection variant="${variant}" openingHours={restaurantHours} showStatus statusAt={new Date("2026-12-15T18:30:00.000Z")} currentStatusLabel="Status at example time" />`
    }
    renderVariant={(variant) => (
      <OpeningHoursSection
        title="Hours for Daybreak Kitchen"
        openingHours={variant === "compact" ? lunchDinnerHours : restaurantHours}
        variant={variant}
        showStatus
        statusAt={currentStatusAt}
        currentStatusLabel="Status at example time"
        locale="en-GB"
      />
    )}
  />
);

const reservationDefaults: Partial<TableReservationValues> = {
  date: "2026-12-16",
  time: "19:00",
  partySize: 2,
  seating: "any",
  guestName: "Alex Morgan",
  email: "alex@example.com",
};

const LocalReservationExample = ({ title = "Request a table" }: { title?: string }) => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <TableReservationSection
      title={title}
      description="Choose a date and time. This preview does not contact a restaurant."
      defaultValue={reservationDefaults}
      onSubmit={() => setSubmitted(true)}
      success={submitted ? "Preview only: no reservation request was sent." : undefined}
    />
  );
};

const DialogReservationExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open reservation form</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Reserve a table"
        description="Choose a date and time for your visit."
        footer={<Button onClick={() => setOpen(false)}>Close</Button>}
      >
        <LocalReservationExample title="Reservation details" />
      </Dialog>
    </>
  );
};

type ReservationScenario = "inline" | "dialog" | "provider" | "states";

const reservationScenarios = [
  { variant: "inline", useCase: "An inline form with a local-only preview response." },
  { variant: "dialog", useCase: "The same form inside Puzzle UI Dialog." },
  { variant: "provider", useCase: "A direct link to an external reservation provider." },
  { variant: "states", useCase: "Caller-controlled loading, error, and success states." },
] as const satisfies readonly SectionVariantPreview<ReservationScenario>[];

const ReservationStateExample = () => {
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">(
    "idle",
  );

  return (
    <div>
      <div role="group" aria-label="Preview reservation states">
        <Button onClick={() => setState("loading")}>Show loading</Button>
        <Button onClick={() => setState("error")}>Show error</Button>
        <Button onClick={() => setState("success")}>Show success</Button>
        <Button onClick={() => setState("idle")}>Reset</Button>
      </div>
      <TableReservationSection
        title="Table reservation"
        defaultValue={reservationDefaults}
        onSubmit={() => setState("success")}
        loading={state === "loading"}
        error={state === "error" ? "The provider could not be reached." : undefined}
        success={
          state === "success"
            ? "Preview only: no reservation request was sent."
            : undefined
        }
      />
    </div>
  );
};

export const TableReservationSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="TableReservationSection integration examples"
    variants={reservationScenarios}
    buildCode={(variant) => {
      if (variant === "provider") {
        return `<TableReservationSection bookingHref={providerUrl} bookingLinkLabel="Continue to provider" />`;
      }
      if (variant === "dialog") {
        return `<Dialog open={open} onOpenChange={setOpen}><TableReservationSection onSubmit={submitReservation} /></Dialog>`;
      }
      return `<TableReservationSection onSubmit={submitReservation} ${variant === "states" ? "loading={loading} error={error} success={success}" : ""} />`;
    }}
    renderVariant={(variant) => {
      if (variant === "dialog") {
        return <DialogReservationExample />;
      }
      if (variant === "provider") {
        return (
          <TableReservationSection
            title="Reserve with our partner"
            bookingHref="https://reservations.example.test/daybreak"
            bookingLinkLabel="Continue to provider"
            bookingLinkDescription="Reservations are completed by our external provider."
          />
        );
      }
      if (variant === "states") {
        return <ReservationStateExample />;
      }
      return <LocalReservationExample />;
    }}
  />
);

const sampleMenu: RestaurantMenu[] = [
  {
    id: "daybreak",
    title: "Daybreak Kitchen",
    description: "Seasonal dishes served from the neighborhood market.",
    categories: [
      {
        id: "lunch",
        title: "Lunch",
        dishes: [
          {
            id: "market-bowl",
            name: "Market bowl",
            description: "Grains, vegetables, and herbs with a bright dressing.",
            price: { amount: 14.5, currency: "EUR" },
          },
          {
            id: "soup-and-bread",
            name: "Soup and bread",
            description: "A daily soup with warm country bread.",
            price: { amount: 11, currency: "EUR" },
          },
        ],
      },
      {
        id: "dinner",
        title: "Dinner",
        dishes: [
          {
            id: "roasted-squash",
            name: "Roasted squash",
            description: "Seasonal squash with lentils and garden herbs.",
            price: { amount: 19, currency: "EUR" },
            featured: true,
          },
        ],
      },
    ],
  },
];

export const RestaurantExperienceExample = () => (
  <main>
    <RestaurantHero
      eyebrow="Daybreak Kitchen"
      title="Seasonal cooking, close to the neighborhood."
      description="A relaxed dining room for market-led lunches and long evening meals."
      backgroundImage={sectionPreviewImages.workspace}
      actions={<Button href="#daybreak-menu">See the menu</Button>}
    />
    <RestaurantMenuSection
      id="daybreak-menu"
      title="From the kitchen"
      description="Lunch and dinner menus prepared with seasonal ingredients."
      menus={sampleMenu}
      locale="en-GB"
    />
    <OpeningHoursSection
      title="Opening hours"
      openingHours={restaurantHours}
      showStatus
      statusAt={currentStatusAt}
      currentStatusLabel="Status at example time"
      locale="en-GB"
    />
    <LocationSection
      title="Visit us"
      variant="single"
      locations={[
        {
          id: "daybreak-kitchen",
          name: "Daybreak Kitchen",
          description: "A neighborhood restaurant with an open kitchen.",
          address: "18 Canal Street, Amsterdam",
          phone: "+31 20 555 0140",
          email: "hello@daybreak.example",
        },
      ]}
    />
    <LocalReservationExample title="Request a table" />
    <GuestReviewsSection
      title="Good company, good food"
      reviews={[
        {
          id: "guest-one",
          quote: "A generous meal and a warm welcome from the whole team.",
          author: "Jamie",
          rating: 5,
          date: "2026-06-08",
          dateLabel: "8 June 2026",
          source: "Guestbook",
          featured: true,
        },
        {
          id: "guest-two",
          quote: "The seasonal menu gave us a reason to come back.",
          author: "Riley",
          rating: 4.8,
          date: "2026-05-22",
          dateLabel: "22 May 2026",
          source: "Guestbook",
        },
      ]}
      summary={{
        score: 4.8,
        totalReviews: 126,
        distribution: [
          { score: 5, count: 98 },
          { score: 4, count: 22 },
          { score: 3, count: 6 },
        ],
      }}
    />
    <HostProfileSection
      title="Meet the chef-owner"
      host={{
        id: "mara",
        name: "Mara de Vries",
        role: "Chef-owner",
        biography: "Mara builds each menu around ingredients from nearby growers.",
        languages: ["Dutch", "English"],
        story:
          "Daybreak began as a small neighborhood kitchen and still keeps the same open-table spirit.",
        contactAction: (
          <a href="mailto:hello@daybreak.example">Contact the restaurant</a>
        ),
      }}
    />
    <ServiceOptionsSection
      title="Gather around the table"
      services={[
        {
          id: "private-dining",
          title: "Private dining",
          description: "A seasonal set menu for a group gathering.",
          category: "For groups",
          inclusion: "optional",
          price: "From €65 per guest",
          action: <a href="mailto:hello@daybreak.example">Ask about a date</a>,
        },
        {
          id: "wine-pairing",
          title: "Wine pairing",
          description: "A rotating selection chosen to accompany the menu.",
          category: "At the table",
          inclusion: "optional",
          price: "€38 per guest",
        },
      ]}
      variant="categorized"
    />
    <LocalGuideSection
      title="A few places nearby"
      places={[
        {
          id: "canal-walk",
          title: "Canal-side walk",
          description: "A quiet route through the old neighborhood.",
          kind: "Walk",
          category: "Outdoors",
          distance: "400 m",
          travelTime: "5 minutes on foot",
        },
        {
          id: "market-hall",
          title: "Market hall",
          description: "A covered market with local produce and small shops.",
          kind: "Market",
          category: "Food",
          distance: "1 km",
          travelTime: "12 minutes on foot",
          href: "https://example.test/market-hall",
        },
      ]}
    />
    <GiftVoucherSection
      title="Give someone a good evening"
      vouchers={[
        {
          id: "dinner-for-two",
          name: "Dinner for two",
          description: "A seasonal three-course meal for two guests.",
          price: { amount: 120, currency: "EUR" },
          arrangement: "Three courses for two",
          purchaseHref: "https://example.test/daybreak-vouchers",
        },
      ]}
      locale="en-GB"
    />
  </main>
);
