import { useState } from "react";
import { BookingSection, type BookingSectionVariant } from "@puzzle-ui/pieces";
import { DatePicker } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const variants: SectionVariantPreview<BookingSectionVariant>[] = [
  { variant: "calendar", useCase: "Let the application provide a calendar picker." },
  { variant: "form", useCase: "Keep guest details and submission together." },
  { variant: "split", useCase: "Separate booking details from the form." },
  { variant: "availability", useCase: "Present availability supplied by the app." },
  { variant: "appointment", useCase: "Collect an appointment request." },
  { variant: "event", useCase: "Collect an event or session reservation." },
  { variant: "accommodation", useCase: "Summarize a hotel stay and dates." },
  { variant: "restaurant", useCase: "Collect a dining date and party size." },
  { variant: "multi-step", useCase: "Show caller-owned progress through booking steps." },
  { variant: "sidebar", useCase: "Keep the price summary beside the booking form." },
  { variant: "compact", useCase: "Fit a shorter booking panel into a small space." },
];

const bookingSlots = (
  <DatePicker
    name="arrival"
    label="Check-in date"
    defaultValue={new Date(2026, 10, 28)}
    locale="en-GB"
  />
);

export const BookingSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="BookingSection"
    variants={variants}
    buildCode={(variant) =>
      `<BookingSection variant="${variant}" calendar={calendar} formSlot={guestFields} />`
    }
    renderVariant={(variant) => (
      <BookingSection
      title={
        variant === "restaurant"
          ? "Reserve a table at Harbor House"
          : variant === "event"
            ? "Book your place at the Harbor House launch dinner"
            : "Stay at Harbor House"
      }
      description="Choose dates for a relaxed weekend by the water."
      variant={variant}
      calendar={bookingSlots}
      availability={
        <p>
          {variant === "restaurant"
            ? "Four tables are available for this seating."
            : "Four rooms are available for these dates."}
        </p>
      }
      formSlot={
        <label>
          {variant === "restaurant" ? "Party size" : "Guests"}
          <input name="guests" type="number" defaultValue="2" min="1" />
        </label>
      }
      bookingDetails={<p>Two nights · Harbor view room</p>}
      priceSummary={<p>Estimated total: €480</p>}
      steps={
        variant === "multi-step"
          ? [
              { id: "dates", title: "Dates", completed: true },
              { id: "guests", title: "Guests" },
              { id: "review", title: "Review" },
            ]
          : undefined
      }
      currentStepId={variant === "multi-step" ? "guests" : undefined}
    />
    )}
  />
);

export const InteractiveBookingExample = () => {
  const [currentStep, setCurrentStep] = useState("dates");

  return (
    <BookingSection
      title="Reserve a Harbor House stay"
      description="Choose dates and guest details. This example only simulates a local confirmation."
      variant="multi-step"
      currentStepId={currentStep}
      onStepChange={setCurrentStep}
      steps={[
        { id: "dates", title: "Dates", completed: true },
        { id: "guests", title: "Guests" },
        { id: "review", title: "Review", disabled: true },
      ]}
      calendar={
        <DatePicker
          name="arrival"
          label="Check-in date"
          defaultValue={new Date(2026, 10, 28)}
          locale="en-GB"
        />
      }
      formSlot={
        <label>
          Guest name
          <input name="guestName" autoComplete="name" required />
        </label>
      }
      availability={<p>Four rooms are available for these dates.</p>}
      priceSummary={<p>Two nights · Estimated total €480</p>}
      onSubmit={async () => {
        await new Promise<void>((resolve) => setTimeout(resolve, 300));
      }}
    />
  );
};
