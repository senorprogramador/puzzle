import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { HostProfileSection } from "./business/host-profile-section";
import { ServiceOptionsSection } from "./business/service-options-section";
import { LocalGuideSection } from "./content/local-guide-section";
import { GiftVoucherSection } from "./commerce/gift-voucher-section";
import { GuestReviewsSection } from "./marketing/guest-reviews-section";

describe("shared hospitality server rendering", () => {
  it("renders all five sections without browser APIs", () => {
    const markup = renderToStaticMarkup(
      <>
        <GuestReviewsSection
          reviews={[
            {
              id: "guest",
              author: "Alex",
              quote: "A restful visit.",
              date: "2026-04-03",
            },
          ]}
        />
        <LocalGuideSection
          places={[{ id: "market", title: "Village market" }]}
        />
        <HostProfileSection
          host={{ id: "host", name: "Sam", languages: ["English"] }}
        />
        <ServiceOptionsSection
          services={[{ id: "breakfast", title: "Breakfast" }]}
        />
        <GiftVoucherSection
          vouchers={[
            {
              id: "stay",
              name: "A stay",
              price: { amount: 100, currency: "EUR" },
            },
          ]}
        />
      </>,
    );

    expect(markup).toContain("A restful visit.");
    expect(markup).toContain("Village market");
    expect(markup).toContain("Sam");
    expect(markup).toContain("Breakfast");
    expect(markup).toContain("A stay");
  });
});
