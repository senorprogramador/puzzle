import * as z from "zod/v4";

export const JsonValueSchema = z.json();

export const SchemaReferenceSchema = z
  .object({
    "@id": z.string().min(1),
    "@type": z.string().min(1).optional(),
  })
  .catchall(JsonValueSchema);

export const SchemaEntitySchema = z.union([
  z.string().min(1),
  SchemaReferenceSchema,
  z.record(z.string(), JsonValueSchema),
]);

export const SchemaEntityListSchema = z.union([
  SchemaEntitySchema,
  z.array(SchemaEntitySchema),
]);

export const SchemaTextSchema = z.union([
  z.string(),
  z.array(z.string()),
]);

export const ThingSchema = z
  .object({
    "@context": z
      .union([
        z.string().min(1),
        z.array(z.string().min(1)),
        z.record(z.string(), JsonValueSchema),
      ])
      .optional(),
    "@id": z.string().min(1).optional(),
    "@type": z.literal("Thing"),
    name: SchemaTextSchema.optional(),
    description: SchemaTextSchema.optional(),
    url: z.string().min(1).optional(),
    identifier: z.union([z.string(), z.number()]).optional(),
    image: SchemaEntityListSchema.optional(),
    sameAs: z.union([z.string().min(1), z.array(z.string().min(1))]).optional(),
    additionalType: z.string().min(1).optional(),
  })
  .catchall(JsonValueSchema);

export const PostalAddressSchema = ThingSchema.extend({
  "@type": z.literal("PostalAddress"),
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(),
  addressRegion: z.string().optional(),
  addressCountry: SchemaEntitySchema.optional(),
  postalCode: z.string().optional(),
  postOfficeBoxNumber: z.string().optional(),
});

export const GeoCoordinatesSchema = ThingSchema.extend({
  "@type": z.literal("GeoCoordinates"),
  latitude: z.union([z.number(), z.string()]).optional(),
  longitude: z.union([z.number(), z.string()]).optional(),
  elevation: z.union([z.number(), z.string()]).optional(),
});

export const OpeningHoursSpecificationSchema = ThingSchema.extend({
  "@type": z.literal("OpeningHoursSpecification"),
  dayOfWeek: z.union([z.string(), z.array(z.string())]).optional(),
  opens: z.string().optional(),
  closes: z.string().optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
});

export const ContactPointSchema = ThingSchema.extend({
  "@type": z.literal("ContactPoint"),
  contactType: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().optional(),
  url: z.string().min(1).optional(),
  areaServed: SchemaEntityListSchema.optional(),
  availableLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  contactOption: z.union([z.string(), z.array(z.string())]).optional(),
  hoursAvailable: z
    .union([
      OpeningHoursSpecificationSchema,
      z.array(OpeningHoursSpecificationSchema),
      SchemaReferenceSchema,
    ])
    .optional(),
});

export const LocationFeatureSpecificationSchema = ThingSchema.extend({
  "@type": z.literal("LocationFeatureSpecification"),
  name: z.string().optional(),
  value: z.union([z.boolean(), z.string(), z.number()]).optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
});

export const ImageObjectSchema = ThingSchema.extend({
  "@type": z.literal("ImageObject"),
  contentUrl: z.string().min(1).optional(),
  caption: z.string().optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  representativeOfPage: z.boolean().optional(),
  thumbnail: SchemaEntitySchema.optional(),
});

export const RatingSchema = ThingSchema.extend({
  "@type": z.literal("Rating"),
  ratingValue: z.union([z.number(), z.string()]).optional(),
  bestRating: z.union([z.number(), z.string()]).optional(),
  worstRating: z.union([z.number(), z.string()]).optional(),
});

export const AggregateRatingSchema = ThingSchema.extend({
  "@type": z.literal("AggregateRating"),
  ratingValue: z.union([z.number(), z.string()]).optional(),
  ratingCount: z.union([z.number(), z.string()]).optional(),
  reviewCount: z.union([z.number(), z.string()]).optional(),
  bestRating: z.union([z.number(), z.string()]).optional(),
  worstRating: z.union([z.number(), z.string()]).optional(),
});

export const QuantitativeValueSchema = ThingSchema.extend({
  "@type": z.literal("QuantitativeValue"),
  value: z.union([z.number(), z.string()]).optional(),
  minValue: z.union([z.number(), z.string()]).optional(),
  maxValue: z.union([z.number(), z.string()]).optional(),
  unitCode: z.string().optional(),
  unitText: z.string().optional(),
});

export const MonetaryAmountSchema = ThingSchema.extend({
  "@type": z.literal("MonetaryAmount"),
  currency: z.string().optional(),
  value: z.union([z.number(), z.string()]).optional(),
  validFrom: z.string().optional(),
});

export const PlaceSchema = ThingSchema.extend({
  "@type": z.literal("Place"),
  address: z
    .union([PostalAddressSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  geo: z.union([GeoCoordinatesSchema, SchemaReferenceSchema]).optional(),
  hasMap: SchemaEntitySchema.optional(),
  telephone: z.string().optional(),
});

export const EntryPointSchema = ThingSchema.extend({
  "@type": z.literal("EntryPoint"),
  urlTemplate: z.string().min(1).optional(),
  actionPlatform: z.union([z.string(), z.array(z.string())]).optional(),
});
