import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { HostProfileSection } from "./business/host-profile-section";
import { ServiceOptionsSection } from "./business/service-options-section";
import { LocalGuideSection } from "./content/local-guide-section";
import { GiftVoucherSection } from "./commerce/gift-voucher-section";
import { GuestReviewsSection } from "./marketing/guest-reviews-section";

afterEach(cleanup);

const viewports = [
  [320, 568],
  [375, 812],
  [430, 932],
  [540, 900],
  [768, 1024],
  [900, 900],
  [1024, 1366],
  [1280, 800],
  [1366, 900],
  [1440, 900],
  [1920, 1080],
] as const;

describe("shared hospitality responsive behavior", () => {
  it("keeps all five sections within the viewport matrix", async () => {
    const { container } = render(
      <main>
        <GuestReviewsSection
          title="Guest reviews"
          variant="grid"
          reviews={[
            {
              id: "review",
              author: "A guest with a long name",
              quote: "A thoughtful place to stay. ".repeat(12),
              date: "2026-06-01",
              dateLabel: "1 June 2026",
              source: "Guestbook",
            },
          ]}
          summary={{
            score: 4.9,
            totalReviews: 200,
            distribution: [{ score: 5, count: 180 }, { score: 4, count: 20 }],
          }}
        />
        <LocalGuideSection
          title="Places nearby"
          places={[
            {
              id: "market",
              title: "A very long local market name ".repeat(3),
              description: "A useful description. ".repeat(10),
              category: "Food",
              distance: "1.2 km",
              travelTime: "15 minutes on foot",
            },
          ]}
          mapSlot={<div>Caller-provided map slot</div>}
        />
        <HostProfileSection
          title="Meet the host"
          host={{
            id: "host",
            name: "A host name with several words",
            biography: "A short introduction. ".repeat(10),
            languages: ["Dutch", "English", "French"],
            story: "A host story. ".repeat(12),
            contactAction: <a href="/contact">Contact the host</a>,
          }}
        />
        <ServiceOptionsSection
          title="Optional services"
          services={[
            {
              id: "dinner",
              title: "A long service name ".repeat(3),
              description: "A flexible service description. ".repeat(10),
              inclusion: "optional",
              price: "€120 per stay",
              action: <a href="/contact">Ask about this service</a>,
            },
          ]}
        />
        <GiftVoucherSection
          title="Gift vouchers"
          vouchers={[
            {
              id: "long-voucher",
              name: "A gift voucher with a long descriptive name ".repeat(2),
              description: "A voucher description. ".repeat(10),
              price: { amount: 1234.5, currency: "EUR" },
              arrangement: "A two-night package",
              purchaseHref: "https://example.test/voucher",
            },
          ]}
        />
      </main>,
    );
    const selectors = [
      ".puzzle-guest-reviews",
      ".puzzle-local-guide-section",
      ".puzzle-host-profile-section",
      ".puzzle-service-options-section",
      ".puzzle-gift-voucher-section",
    ];

    for (const [width, height] of viewports) {
      await page.viewport(width, height);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      for (const selector of selectors) {
        const section = container.querySelector<HTMLElement>(selector)!;
        expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      }
    }

    await page.viewport(375, 812);
    expect(
      getComputedStyle(
        container.querySelector(".puzzle-product-grid__list")!,
      ).gridTemplateColumns.trim().split(/\s+/),
    ).toHaveLength(1);
  });
});
