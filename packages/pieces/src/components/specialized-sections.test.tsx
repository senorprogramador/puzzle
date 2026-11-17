import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BookingSection } from "./commerce/booking-section";
import { LocationSection } from "./business/location-section";
import { EventSection } from "./content/event-section";
import { ResourceSection } from "./content/resource-section";
import { VideoSection } from "./content/video-section";
import { FooterSection } from "./footer";
import { WaitlistSection } from "./marketing/waitlist-section";

describe("specialized sections", () => {
  it("supports server rendering for all seven section families", () => {
    const markup = renderToString(
      <>
        <VideoSection
          title="Agency reel"
          videos={[
            {
              id: "reel",
              title: "Studio reel",
              sources: [{ src: "/studio-reel.mp4", type: "video/mp4" }],
            },
          ]}
        />
        <BookingSection title="Reserve a table" calendar={<p>Calendar slot</p>} />
        <LocationSection
          title="Our offices"
          locations={[{ id: "studio", name: "Northstar Studio" }]}
        />
        <WaitlistSection title="Join the launch list" countdown={{ days: 4, hours: 2, minutes: 0 }} />
        <ResourceSection
          title="Resource library"
          items={[{ id: "guide", title: "Launch guide", href: "/guide.pdf" }]}
          searchable={false}
          filterable={false}
        />
        <EventSection
          title="Upcoming events"
          events={[
            {
              id: "summit",
              title: "Product summit",
              startDate: "2027-01-10T10:00:00Z",
            },
          ]}
          referenceDate="2026-11-17T00:00:00Z"
        />
        <FooterSection
          navigationGroups={[
            {
              id: "company",
              label: "Company",
              links: [{ id: "about", label: "About", href: "/about" }],
            },
          ]}
          copyright="Northstar Studio"
        />
      </>,
    );

    expect(markup).toContain("Studio reel");
    expect(markup).toContain("Reserve a table");
    expect(markup).toContain("Northstar Studio");
    expect(markup).toContain("Join the launch list");
    expect(markup).toContain("Launch guide");
    expect(markup).toContain("Product summit");
    expect(markup).toContain("Company");
  });
});
