import * as z from "zod/v4";

import {
  AggregateRatingSchema,
  EntryPointSchema,
  ImageObjectSchema,
  PlaceSchema,
  SchemaEntityListSchema,
  SchemaEntitySchema,
  SchemaReferenceSchema,
  ThingSchema,
} from "./common";
import { AuthorSchema, OrganizationSchema } from "./people";

export const ListItemSchema = ThingSchema.extend({
  "@type": z.literal("ListItem"),
  position: z.number().int().positive().optional(),
  item: SchemaEntitySchema.optional(),
  name: z.string().optional(),
});

export const ItemListSchema = ThingSchema.extend({
  "@type": z.literal("ItemList"),
  itemListElement: z
    .union([ListItemSchema, SchemaReferenceSchema])
    .array()
    .optional(),
  numberOfItems: z.number().int().nonnegative().optional(),
  itemListOrder: z.string().optional(),
});

export const BreadcrumbListSchema = ThingSchema.extend({
  "@type": z.literal("BreadcrumbList"),
  itemListElement: z
    .union([ListItemSchema, SchemaReferenceSchema])
    .array()
    .optional(),
});

export const SearchActionSchema = ThingSchema.extend({
  "@type": z.literal("SearchAction"),
  target: z.union([EntryPointSchema, SchemaReferenceSchema, z.string()]),
  "query-input": z.string().optional(),
});

export const WebSiteSchema = ThingSchema.extend({
  "@type": z.literal("WebSite"),
  publisher: z
    .union([OrganizationSchema, SchemaReferenceSchema])
    .optional(),
  potentialAction: z
    .union([SearchActionSchema, SchemaReferenceSchema])
    .optional(),
  inLanguage: z.union([z.string(), z.array(z.string())]).optional(),
});

export const WebPageSchema = ThingSchema.extend({
  "@type": z.literal("WebPage"),
  isPartOf: z.union([WebSiteSchema, SchemaReferenceSchema]).optional(),
  breadcrumb: z
    .union([BreadcrumbListSchema, SchemaReferenceSchema])
    .optional(),
  mainEntity: SchemaEntitySchema.optional(),
  about: SchemaEntityListSchema.optional(),
  author: AuthorSchema.optional(),
  publisher: z
    .union([OrganizationSchema, SchemaReferenceSchema])
    .optional(),
  primaryImageOfPage: z
    .union([ImageObjectSchema, SchemaReferenceSchema])
    .optional(),
  datePublished: z.string().optional(),
  dateModified: z.string().optional(),
  inLanguage: z.union([z.string(), z.array(z.string())]).optional(),
});

export const ArticleSchema = ThingSchema.extend({
  "@type": z.literal("Article"),
  headline: z.string().optional(),
  articleSection: z.union([z.string(), z.array(z.string())]).optional(),
  author: AuthorSchema.optional(),
  publisher: z
    .union([OrganizationSchema, SchemaReferenceSchema])
    .optional(),
  datePublished: z.string().optional(),
  dateModified: z.string().optional(),
  wordCount: z.number().int().nonnegative().optional(),
  image: z
    .union([ImageObjectSchema, SchemaReferenceSchema, z.string()])
    .array()
    .or(z.union([ImageObjectSchema, SchemaReferenceSchema, z.string()]))
    .optional(),
  mainEntityOfPage: SchemaEntitySchema.optional(),
});

export const BlogPostingSchema = ArticleSchema.extend({
  "@type": z.literal("BlogPosting"),
});

export const NewsArticleSchema = ArticleSchema.extend({
  "@type": z.literal("NewsArticle"),
});

export const AnswerSchema = ThingSchema.extend({
  "@type": z.literal("Answer"),
  text: z.string().optional(),
  upvoteCount: z.number().int().nonnegative().optional(),
  author: AuthorSchema.optional(),
  datePublished: z.string().optional(),
});

export const QuestionSchema = ThingSchema.extend({
  "@type": z.literal("Question"),
  acceptedAnswer: z
    .union([AnswerSchema, SchemaReferenceSchema])
    .optional(),
  suggestedAnswer: z
    .union([AnswerSchema, SchemaReferenceSchema])
    .array()
    .optional(),
  answerCount: z.number().int().nonnegative().optional(),
});

export const FAQPageSchema = WebPageSchema.extend({
  "@type": z.literal("FAQPage"),
  mainEntity: z
    .union([QuestionSchema, SchemaReferenceSchema])
    .array()
    .optional(),
});

export const ProfilePageSchema = WebPageSchema.extend({
  "@type": z.literal("ProfilePage"),
  mainEntity: SchemaEntitySchema.optional(),
});

export const EventSchema = ThingSchema.extend({
  "@type": z.literal("Event"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  eventStatus: z.string().optional(),
  eventAttendanceMode: z.string().optional(),
  location: z
    .union([PlaceSchema, SchemaReferenceSchema, z.string()])
    .optional(),
  organizer: z
    .union([OrganizationSchema, SchemaReferenceSchema])
    .optional(),
  performer: SchemaEntityListSchema.optional(),
  offers: SchemaEntityListSchema.optional(),
  image: z
    .union([ImageObjectSchema, SchemaReferenceSchema, z.string()])
    .array()
    .or(z.union([ImageObjectSchema, SchemaReferenceSchema, z.string()]))
    .optional(),
});

export const WebsiteSchema = WebSiteSchema;
export const WebpageSchema = WebPageSchema;
