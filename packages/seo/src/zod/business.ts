import * as z from "zod/v4";

import {
  AggregateRatingSchema,
  GeoCoordinatesSchema,
  JsonValueSchema,
  LocationFeatureSpecificationSchema,
  OpeningHoursSpecificationSchema,
  PostalAddressSchema,
  SchemaEntityListSchema,
  SchemaEntitySchema,
  SchemaReferenceSchema,
  ThingSchema,
} from "./common";
import { OrganizationSchema } from "./people";

export const LocalBusinessSchema = OrganizationSchema.extend({
  "@type": z.literal("LocalBusiness"),
  priceRange: z.string().optional(),
  currenciesAccepted: z.union([z.string(), z.array(z.string())]).optional(),
  paymentAccepted: z.union([z.string(), z.array(z.string())]).optional(),
  address: z
    .union([PostalAddressSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  geo: z.union([GeoCoordinatesSchema, SchemaReferenceSchema]).optional(),
  openingHoursSpecification: z
    .union([
      OpeningHoursSpecificationSchema,
      SchemaReferenceSchema,
      z.array(
        z.union([OpeningHoursSpecificationSchema, SchemaReferenceSchema]),
      ),
    ])
    .optional(),
  aggregateRating: z
    .union([AggregateRatingSchema, SchemaReferenceSchema])
    .optional(),
  amenityFeature: z
    .union([
      LocationFeatureSpecificationSchema,
      SchemaReferenceSchema,
      z.array(
        z.union([LocationFeatureSpecificationSchema, SchemaReferenceSchema]),
      ),
    ])
    .optional(),
});

export const BusinessSchema = z.union([
  OrganizationSchema,
  LocalBusinessSchema,
]);

export const LodgingBusinessSchema = LocalBusinessSchema.extend({
  "@type": z.literal("LodgingBusiness"),
  checkinTime: z.string().optional(),
  checkoutTime: z.string().optional(),
  numberOfRooms: z.union([z.number(), z.string()]).optional(),
  petsAllowed: z.union([z.boolean(), z.string()]).optional(),
  availableLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  amenityFeature: z
    .union([
      LocationFeatureSpecificationSchema,
      SchemaReferenceSchema,
      z.array(
        z.union([LocationFeatureSpecificationSchema, SchemaReferenceSchema]),
      ),
    ])
    .optional(),
});

export const BedAndBreakfastSchema = LodgingBusinessSchema.extend({
  "@type": z.literal("BedAndBreakfast"),
});

export const HotelSchema = LodgingBusinessSchema.extend({
  "@type": z.literal("Hotel"),
  starRating: SchemaEntitySchema.optional(),
});

export const HotelRoomSchema = ThingSchema.extend({
  "@type": z.literal("HotelRoom"),
  bed: SchemaEntityListSchema.optional(),
  occupancy: SchemaEntitySchema.optional(),
  amenityFeature: SchemaEntityListSchema.optional(),
});

export const MenuItemSchema = ThingSchema.extend({
  "@type": z.literal("MenuItem"),
  suitableForDiet: z.union([z.string(), z.array(z.string())]).optional(),
  nutrition: SchemaEntitySchema.optional(),
  offers: SchemaEntityListSchema.optional(),
});

export const MenuSectionSchema = ThingSchema.extend({
  "@type": z.literal("MenuSection"),
  hasMenuItem: z
    .union([MenuItemSchema, SchemaReferenceSchema])
    .array()
    .optional(),
  hasMenuSection: z
    .union([SchemaReferenceSchema, z.record(z.string(), JsonValueSchema)])
    .array()
    .optional(),
});

export const MenuSchema = ThingSchema.extend({
  "@type": z.literal("Menu"),
  hasMenuSection: z
    .union([MenuSectionSchema, SchemaReferenceSchema])
    .array()
    .optional(),
  hasMenuItem: z
    .union([MenuItemSchema, SchemaReferenceSchema])
    .array()
    .optional(),
});

export const RestaurantSchema = LocalBusinessSchema.extend({
  "@type": z.literal("Restaurant"),
  servesCuisine: z.union([z.string(), z.array(z.string())]).optional(),
  acceptsReservations: z.union([z.boolean(), z.string()]).optional(),
  menu: z
    .union([MenuSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  hasMenu: z
    .union([MenuSchema, SchemaReferenceSchema, z.string()])
    .optional(),
});

export const ProfessionalServiceSchema = LocalBusinessSchema.extend({
  "@type": z.literal("ProfessionalService"),
  serviceArea: SchemaEntityListSchema.optional(),
});

export const AdvertisingAgencySchema = LocalBusinessSchema.extend({
  "@type": z.literal("AdvertisingAgency"),
});

export const EmploymentAgencySchema = LocalBusinessSchema.extend({
  "@type": z.literal("EmploymentAgency"),
});

export const TravelAgencySchema = LocalBusinessSchema.extend({
  "@type": z.literal("TravelAgency"),
});

export const RealEstateAgentSchema = LocalBusinessSchema.extend({
  "@type": z.literal("RealEstateAgent"),
});

export const InsuranceAgencySchema = LocalBusinessSchema.extend({
  "@type": z.literal("InsuranceAgency"),
});

export const AgencySchema = z.union([
  ProfessionalServiceSchema,
  AdvertisingAgencySchema,
  EmploymentAgencySchema,
  TravelAgencySchema,
  RealEstateAgentSchema,
  InsuranceAgencySchema,
]);

export const ServiceSchema = ThingSchema.extend({
  "@type": z.literal("Service"),
  serviceType: z.union([z.string(), z.array(z.string())]).optional(),
  provider: SchemaEntitySchema.optional(),
  areaServed: SchemaEntityListSchema.optional(),
  audience: SchemaEntitySchema.optional(),
  termsOfService: z.string().optional(),
});
