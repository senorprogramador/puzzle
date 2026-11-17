import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { BookingSection } from "./commerce/booking-section";
import { LocationSection } from "./business/location-section";
import { EventSection } from "./content/event-section";
import { ResourceSection } from "./content/resource-section";
import { VideoSection } from "./content/video-section";
import { FooterSection } from "./footer";
import { WaitlistSection } from "./marketing/waitlist-section";

it("keeps all specialized section layouts within mobile and desktop viewports", async () => {
  const { container } = render(
    <div>
      <VideoSection
        title="Agency reel"
        variant="split"
        videos={[
          {
            id: "reel",
            title: "Studio reel",
            sources: [{ src: "/studio-reel.mp4" }],
            poster: "/studio-reel.jpg",
          },
        ]}
      />
      <BookingSection
        title="Reserve a room"
        variant="sidebar"
        calendar={<p>Calendar slot</p>}
        priceSummary={<p>€240 total</p>}
      />
      <LocationSection
        title="Our offices"
        variant="split"
        locations={[{ id: "studio", name: "Northstar Studio" }]}
      />
      <WaitlistSection title="Join the waitlist" variant="split" />
      <ResourceSection
        title="Resources"
        items={[{ id: "guide", title: "Launch guide", href: "/guide.pdf" }]}
        searchable={false}
        filterable={false}
      />
      <EventSection
        title="Events"
        events={[
          {
            id: "summit",
            title: "Product summit",
            startDate: "2027-01-10T10:00:00Z",
          },
        ]}
        referenceDate="2026-11-17T00:00:00Z"
      />
      <FooterSection variant="split" copyright="Northstar Studio" />
    </div>,
  );

  await page.viewport(375, 800);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-booking-section__layout")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(1);
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-location-section__layout")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(1);

  await page.viewport(1280, 800);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-waitlist-section__layout")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(2);
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-footer-section__content")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(2);
});
