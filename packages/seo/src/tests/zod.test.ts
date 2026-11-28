import * as z from "zod/v4";
import { describe, expect, it } from "vitest";

import * as schemas from "../zod";
import {
  AdvertisingAgencySchema,
  AuthorSchema,
  BedAndBreakfastSchema,
  BusinessSchema,
  ProductSchema,
  PersonSchema,
  RestaurantSchema,
  WebPageSchema,
  WebSiteSchema,
} from "../zod";

type JsonSerializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };
type SchemaOutputs = z.output<(typeof schemas)[keyof typeof schemas]>;
type Assert<T extends true> = T;
type AllSchemaOutputsAreSerializable = Assert<
  SchemaOutputs extends JsonSerializable ? true : false
>;

describe("optional Schema.org Zod schemas", () => {
  it("validates nested restaurant data and preserves extra Schema.org properties", () => {
    const restaurant: z.infer<typeof RestaurantSchema> = {
      "@type": "Restaurant",
      name: "The Garden Table",
      servesCuisine: ["Modern European", "Vegetarian"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "1 Market Street",
        addressLocality: "Amsterdam",
        postalCode: "1012",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Monday",
          opens: "09:00",
          closes: "22:00",
        },
      ],
      hasMenu: {
        "@type": "Menu",
        name: "Dinner",
        hasMenuSection: [
          {
            "@type": "MenuSection",
            name: "Mains",
            hasMenuItem: [{ "@type": "MenuItem", name: "Roasted squash" }],
          },
        ],
      },
      acceptsReservations: true,
      servesDietaryOption: "vegan",
    };

    const parsed = RestaurantSchema.parse(restaurant);

    expect(parsed).toMatchObject({
      "@type": "Restaurant",
      servesDietaryOption: "vegan",
      hasMenu: {
        hasMenuSection: [
          {
            hasMenuItem: [{ name: "Roasted squash" }],
          },
        ],
      },
    });
  });

  it("accepts lodging, commerce, agency, and common entity shapes", () => {
    expect(
      BedAndBreakfastSchema.safeParse({
        "@type": "BedAndBreakfast",
        name: "Willow House",
        address: { "@id": "https://example.com/#address" },
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: "Breakfast", value: true },
        ],
      }).success,
    ).toBe(true);

    expect(
      ProductSchema.safeParse({
        "@type": "Product",
        name: "Ceramic mug",
        brand: { "@type": "Brand", name: "Clay Studio" },
        offers: {
          "@type": "Offer",
          price: 18.5,
          priceCurrency: "EUR",
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", currency: "EUR", value: 4 },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            merchantReturnDays: 30,
          },
        },
      }).success,
    ).toBe(true);

    expect(
      AdvertisingAgencySchema.safeParse({
        "@type": "AdvertisingAgency",
        name: "North Star Studio",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: "hello@example.com",
        },
      }).success,
    ).toBe(true);

    expect(
      BusinessSchema.safeParse({
        "@type": "Organization",
        name: "Example Group",
      }).success,
    ).toBe(true);
    expect(
      AuthorSchema.safeParse({
        "@type": "Person",
        name: "A. Writer",
        jobTitle: "Writer",
      }).success,
    ).toBe(true);
  });

  it("allows JSON-safe extension properties on people and rejects non-JSON values", () => {
    const person = PersonSchema.parse({
      "@type": "Person",
      "@context": {
        schema: "https://schema.org",
        extensions: ["https://example.com/vocabulary"],
      },
      image: {
        "@type": "ImageObject",
        contentUrl: "https://example.com/ada.png",
        metadata: { license: "CC BY" },
      },
      customField: { enabled: true, values: ["writer", null, 3] },
    });

    expect(person.customField).toEqual({
      enabled: true,
      values: ["writer", null, 3],
    });
    expect(
      PersonSchema.safeParse({
        "@type": "Person",
        customField: { callback: () => undefined },
      }).success,
    ).toBe(false);
  });

  it("models website and webpage relationships and rejects mismatched fixed types", () => {
    expect(
      WebSiteSchema.safeParse({
        "@type": "WebSite",
        name: "Example",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://example.com/search?q={search_term_string}",
          },
        },
      }).success,
    ).toBe(true);

    expect(
      WebPageSchema.safeParse({
        "@type": "WebPage",
        name: "Home",
        isPartOf: { "@id": "https://example.com/#website" },
        breadcrumb: { "@id": "https://example.com/#breadcrumb" },
      }).success,
    ).toBe(true);

    expect(
      RestaurantSchema.safeParse({
        "@type": "Hotel",
        name: "Not a restaurant",
      }).success,
    ).toBe(false);
  });
});
