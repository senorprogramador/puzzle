import * as z from "zod/v4";

import {
  AggregateRatingSchema,
  MonetaryAmountSchema,
  QuantitativeValueSchema,
  SchemaEntityListSchema,
  SchemaEntitySchema,
  SchemaReferenceSchema,
  ThingSchema,
  RatingSchema,
} from "./common";
import { AuthorSchema, BrandSchema, OrganizationSchema } from "./people";

export const ReviewSchema = ThingSchema.extend({
  "@type": z.literal("Review"),
  author: AuthorSchema.optional(),
  reviewBody: z.string().optional(),
  reviewRating: z.union([RatingSchema, SchemaReferenceSchema]).optional(),
  datePublished: z.string().optional(),
  itemReviewed: SchemaEntitySchema.optional(),
});

export const ShippingDeliveryTimeSchema = ThingSchema.extend({
  "@type": z.literal("ShippingDeliveryTime"),
  handlingTime: QuantitativeValueSchema.optional(),
  transitTime: QuantitativeValueSchema.optional(),
});

export const OfferShippingDetailsSchema = ThingSchema.extend({
  "@type": z.literal("OfferShippingDetails"),
  shippingRate: z
    .union([MonetaryAmountSchema, QuantitativeValueSchema, SchemaReferenceSchema])
    .optional(),
  shippingDestination: SchemaEntityListSchema.optional(),
  deliveryTime: z
    .union([ShippingDeliveryTimeSchema, SchemaReferenceSchema])
    .optional(),
  doesNotShip: z.boolean().optional(),
});

export const MerchantReturnPolicySchema = ThingSchema.extend({
  "@type": z.literal("MerchantReturnPolicy"),
  applicableCountry: SchemaEntityListSchema.optional(),
  returnPolicyCategory: z.string().optional(),
  merchantReturnDays: z.union([z.number(), z.string()]).optional(),
  returnMethod: z.union([z.string(), z.array(z.string())]).optional(),
  returnFees: z.string().optional(),
  refundType: z.string().optional(),
  returnPolicySeasonalOverride: SchemaEntityListSchema.optional(),
});

export const OfferSchema = ThingSchema.extend({
  "@type": z.literal("Offer"),
  price: z.union([z.number(), z.string()]).optional(),
  priceCurrency: z.string().optional(),
  priceSpecification: z
    .union([
      MonetaryAmountSchema,
      QuantitativeValueSchema,
      SchemaReferenceSchema,
    ])
    .optional(),
  availability: z.string().optional(),
  itemCondition: z.string().optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
  seller: z.union([OrganizationSchema, SchemaReferenceSchema]).optional(),
  itemOffered: SchemaEntitySchema.optional(),
  eligibleQuantity: QuantitativeValueSchema.optional(),
  shippingDetails: z
    .union([OfferShippingDetailsSchema, SchemaReferenceSchema])
    .optional(),
  hasMerchantReturnPolicy: z
    .union([MerchantReturnPolicySchema, SchemaReferenceSchema])
    .optional(),
});

export const AggregateOfferSchema = OfferSchema.extend({
  "@type": z.literal("AggregateOffer"),
  lowPrice: z.union([z.number(), z.string()]).optional(),
  highPrice: z.union([z.number(), z.string()]).optional(),
  offerCount: z.union([z.number(), z.string()]).optional(),
  offers: z
    .union([OfferSchema, SchemaReferenceSchema])
    .array()
    .optional(),
});

export const ProductSchema = ThingSchema.extend({
  "@type": z.literal("Product"),
  sku: z.string().optional(),
  mpn: z.string().optional(),
  gtin: z.string().optional(),
  gtin8: z.string().optional(),
  gtin12: z.string().optional(),
  gtin13: z.string().optional(),
  gtin14: z.string().optional(),
  category: z.union([z.string(), z.array(z.string())]).optional(),
  brand: z.union([BrandSchema, SchemaReferenceSchema, z.string()]).optional(),
  manufacturer: z
    .union([OrganizationSchema, SchemaReferenceSchema])
    .optional(),
  offers: z
    .union([OfferSchema, AggregateOfferSchema, SchemaReferenceSchema])
    .array()
    .or(
      z.union([OfferSchema, AggregateOfferSchema, SchemaReferenceSchema]),
    )
    .optional(),
  aggregateRating: z
    .union([AggregateRatingSchema, SchemaReferenceSchema])
    .optional(),
  review: z
    .union([ReviewSchema, SchemaReferenceSchema])
    .array()
    .or(z.union([ReviewSchema, SchemaReferenceSchema]))
    .optional(),
  weight: QuantitativeValueSchema.optional(),
  isVariantOf: SchemaReferenceSchema.optional(),
});

export const ProductGroupSchema = ProductSchema.extend({
  "@type": z.literal("ProductGroup"),
  productGroupID: z.string().optional(),
  variesBy: z.union([z.string(), z.array(z.string())]).optional(),
  hasVariant: z
    .union([ProductSchema, SchemaReferenceSchema])
    .array()
    .optional(),
});

export const OnlineStoreSchema = OrganizationSchema.extend({
  "@type": z.literal("OnlineStore"),
  hasMerchantReturnPolicy: z
    .union([MerchantReturnPolicySchema, SchemaReferenceSchema])
    .optional(),
});
