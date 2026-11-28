import * as z from "zod/v4";

import {
  AggregateRatingSchema,
  ContactPointSchema,
  ImageObjectSchema,
  PostalAddressSchema,
  SchemaEntityListSchema,
  SchemaEntitySchema,
  SchemaReferenceSchema,
  ThingSchema,
} from "./common";

export const PersonSchema = ThingSchema.extend({
  "@type": z.literal("Person"),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  additionalName: z.string().optional(),
  honorificPrefix: z.string().optional(),
  honorificSuffix: z.string().optional(),
  email: z.string().optional(),
  telephone: z.string().optional(),
  jobTitle: z.string().optional(),
  birthDate: z.string().optional(),
  worksFor: SchemaEntitySchema.optional(),
  affiliation: SchemaEntityListSchema.optional(),
  address: z
    .union([PostalAddressSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  image: z
    .union([ImageObjectSchema, SchemaReferenceSchema, z.string()])
    .optional(),
});

export const OrganizationSchema = ThingSchema.extend({
  "@type": z.literal("Organization"),
  legalName: z.string().optional(),
  alternateName: z.string().optional(),
  email: z.string().optional(),
  telephone: z.string().optional(),
  foundingDate: z.string().optional(),
  taxID: z.string().optional(),
  vatID: z.string().optional(),
  address: z
    .union([PostalAddressSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  logo: z
    .union([ImageObjectSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  image: z
    .union([ImageObjectSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  contactPoint: z
    .union([
      ContactPointSchema,
      SchemaReferenceSchema,
      z.array(z.union([ContactPointSchema, SchemaReferenceSchema])),
    ])
    .optional(),
  founder: SchemaEntitySchema.optional(),
  employee: SchemaEntityListSchema.optional(),
  member: SchemaEntityListSchema.optional(),
  parentOrganization: SchemaEntitySchema.optional(),
  department: SchemaEntityListSchema.optional(),
  aggregateRating: z
    .union([AggregateRatingSchema, SchemaReferenceSchema])
    .optional(),
  areaServed: SchemaEntityListSchema.optional(),
});

export const BrandSchema = ThingSchema.extend({
  "@type": z.literal("Brand"),
  logo: z.union([ImageObjectSchema, SchemaReferenceSchema, z.string()]).optional(),
  slogan: z.string().optional(),
  aggregateRating: z
    .union([AggregateRatingSchema, SchemaReferenceSchema])
    .optional(),
});

export const AuthorSchema = z.union([
  PersonSchema,
  OrganizationSchema,
  SchemaReferenceSchema,
]);
