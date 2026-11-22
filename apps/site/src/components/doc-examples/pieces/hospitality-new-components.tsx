import { useState } from "react";
import {
  AvailabilityCalendar,
  AvailabilityManager,
  type AvailabilityManagerSelection,
  ContactForm,
  LocaleSwitcher,
  SiteHeader,
} from "@puzzle-ui/pieces";
import { Button, type DateRange } from "@puzzle-ui/ui";

const sampleAvailability = Array.from({ length: 16 }, (_, index) => ({
  date: new Date(2026, 8, 10 + index),
  status: index === 4 ? ("blocked" as const) : ("available" as const),
  price: { amount: 140 + index * 5, currency: "EUR" },
}));

const SiteHeaderExample = () => (
  <SiteHeader
    logo={<strong>Willow & Tide</strong>}
    items={[
      { id: "stay", label: "Stay", href: "#stay", active: true },
      { id: "explore", label: "Explore", href: "#explore" },
      { id: "contact", label: "Contact", href: "#contact" },
    ]}
    localeSwitcher={
      <LocaleSwitcher
        currentLocale="en"
        locales={[
          { id: "en", locale: "en", label: "English", href: "/en" },
          { id: "nl", locale: "nl", label: "Nederlands", href: "/nl" },
        ]}
        presentation="compact"
      />
    }
    primaryAction={<Button href="#book">Check availability</Button>}
    sticky
  />
);

const LocaleSwitcherExample = () => (
  <LocaleSwitcher
    currentLocale="en"
    locales={[
      { id: "en", locale: "en", label: "English", href: "/en" },
      { id: "es", locale: "es", label: "Español", href: "/es" },
      { id: "nl", locale: "nl", label: "Nederlands", href: "/nl" },
    ]}
    presentation="inline"
  />
);

const AvailabilityCalendarExample = () => {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 8, 12),
    end: new Date(2026, 8, 15),
  });

  return (
    <AvailabilityCalendar
      title="Choose your stay"
      description="Example availability supplied by the application."
      availability={sampleAvailability}
      value={range}
      onChange={setRange}
      locale="en-GB"
      minNights={2}
      months={2}
    />
  );
};

const AvailabilityManagerExample = () => {
  const [selection, setSelection] = useState<AvailabilityManagerSelection>({
    cells: [],
  });
  const days = Array.from({ length: 30 }, (_, index) => ({
    date: new Date(2026, 8, index + 1),
    status: index === 8 ? ("blocked" as const) : ("available" as const),
    price: { amount: 12500 + index * 500, currency: "EUR" },
  }));

  return (
    <AvailabilityManager
      title="Manage room availability"
      description="Select days to hand to your own bulk editor."
      resources={[
        { id: "garden", label: "Garden room", description: "Sleeps two", days },
        { id: "studio", label: "Sea studio", description: "Sleeps four", days },
      ]}
      initialMonth={new Date(2026, 8, 1)}
      months={2}
      locale="en-GB"
      value={selection}
      onSelectionChange={setSelection}
      slots={{
        bulkActions: ({ cells, clearSelection }) => (
          <Button type="button" onClick={clearSelection}>
            Prepare edit for {cells.length} days
          </Button>
        ),
      }}
    />
  );
};

const ContactFormExample = () => {
  const [sent, setSent] = useState(false);

  return (
    <ContactForm
      title="Ask about your stay"
      description="This preview only invokes the callback; it does not send an email."
      onSubmit={async () => {
        setSent(true);
      }}
      success={sent ? "Thanks — the example request is ready for your application." : undefined}
      consent={{
        label: "I agree to the privacy policy.",
        privacyHref: "/docs/seo/hospitality",
        required: true,
      }}
      honeypotName="website"
    />
  );
};

export {
  AvailabilityCalendarExample,
  AvailabilityManagerExample,
  ContactFormExample,
  LocaleSwitcherExample,
  SiteHeaderExample,
};
