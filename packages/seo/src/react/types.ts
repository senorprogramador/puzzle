import type { ReactNode } from "react";

import type {
  SeoGraph,
  SeoGraphBuilderOptions,
  SeoNode,
  SeoValidationIssue,
} from "../core/types";

import type { SeoConfig } from "../context/types";

import type { SeoPageMetadata } from "../metadata/types";

import type { SchemaRegistry, SchemaValidationOptions } from "../schema/types";

export type SchemaValue =
  | string
  | number
  | boolean
  | null
  | Date
  | SeoNode
  | { "@id": string }
  | readonly SchemaValue[]
  | Record<string, unknown>;

export interface SchemaProperties {
  name?: string;
  alternateName?: string;
  description?: string;
  url?: string;

  image?: SchemaValue;
  logo?: SchemaValue;

  sameAs?: string | readonly string[];

  email?: string;
  telephone?: string;

  address?: SchemaValue;
  addressCountry?: SchemaValue;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;

  author?: SchemaValue;
  publisher?: SchemaValue;
  provider?: SchemaValue;
  founder?: SchemaValue;
  organizer?: SchemaValue;
  sponsor?: SchemaValue;

  headline?: string;
  articleBody?: string;
  articleSection?: string;
  wordCount?: number;

  dateCreated?: string;
  dateModified?: string;
  datePublished?: string;
  startDate?: string;
  endDate?: string;

  mainEntity?: SchemaValue;
  mainEntityOfPage?: SchemaValue;
  isPartOf?: SchemaValue;
  hasPart?: SchemaValue;
  about?: SchemaValue;
  subjectOf?: SchemaValue;

  breadcrumb?: SchemaValue;
  itemListElement?: SchemaValue;
  itemListOrder?: string;
  numberOfItems?: number;

  offers?: SchemaValue;
  price?: number | string;
  priceCurrency?: string;
  priceValidUntil?: string;
  availability?: string;
  seller?: SchemaValue;

  brand?: SchemaValue;
  sku?: string;
  mpn?: string;
  gtin?: string;

  aggregateRating?: SchemaValue;
  review?: SchemaValue;
  reviewRating?: SchemaValue;
  ratingValue?: number | string;
  bestRating?: number | string;
  worstRating?: number | string;
  ratingCount?: number;
  reviewCount?: number;

  itemReviewed?: SchemaValue;

  item?: SchemaValue;
  position?: number;

  serviceType?: string;
  areaServed?: SchemaValue;
  serviceOutput?: SchemaValue;

  geo?: SchemaValue;
  containedInPlace?: SchemaValue;
  openingHoursSpecification?: SchemaValue;
  priceRange?: string;

  eventStatus?: string;
  eventAttendanceMode?: string;
  performer?: SchemaValue;
  previousStartDate?: string;

  video?: SchemaValue;
  contentUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;

  recipeIngredient?: string | readonly string[];
  recipeInstructions?: SchemaValue;
  cookingMethod?: string;
  cookingTime?: string;
  prepTime?: string;
  totalTime?: string;
  recipeYield?: string;
  nutrition?: SchemaValue;

  courseCode?: string;
  educationalLevel?: string;
  teaches?: string;
  timeRequired?: string;

  employmentType?: string;
  hiringOrganization?: SchemaValue;
  jobLocation?: SchemaValue;
  baseSalary?: SchemaValue;
  validThrough?: string;

  applicationCategory?: string;
  operatingSystem?: string;
  softwareVersion?: string;
  downloadUrl?: string;

  step?: SchemaValue;
  tool?: SchemaValue;
  supply?: SchemaValue;

  question?: SchemaValue;
  acceptedAnswer?: SchemaValue;

  keywords?: string | readonly string[];
  inLanguage?: string;
  isAccessibleForFree?: boolean;

  copyrightYear?: number;
  copyrightHolder?: SchemaValue;
}

export interface SchemaComponentProps extends SchemaProperties {
  /**
   * Explicit Schema.org @id.
   *
   * Overrides the automatically generated identifier.
   */
  id?: string;

  /**
   * Additional Schema.org properties.
   *
   * Use this for properties not explicitly represented
   * in SchemaProperties.
   */
  data?: Readonly<Record<string, SchemaValue>>;
}

export interface SchemaProps {
  type: string;
  id?: string;

  /**
   * Schema.org properties.
   */
  data?: Readonly<Record<string, SchemaValue>>;

  /**
   * Additional properties, merged with data.
   * Explicit properties take precedence.
   */
  properties?: Readonly<Record<string, SchemaValue>>;
}

export interface SeoProviderProps {
  config: SeoConfig;

  children: ReactNode;

  /**
   * JSON-LD script element ID.
   */
  scriptId?: string;

  /**
   * CSP nonce applied to the central JSON-LD script.
   */
  nonce?: string;

  /**
   * Graph builder configuration.
   *
   * The baseUrl defaults to config.siteUrl.
   */
  graphOptions?: SeoGraphBuilderOptions;

  /**
   * Custom schema registry.
   *
   * Defaults to the generated Schema.org registry.
   */
  schemaRegistry?: SchemaRegistry;

  /**
   * Schema validation.
   *
   * Set to false to disable registry validation.
   * Strict mode rejects unknown types and properties.
   */
  validation?: SchemaValidationOptions | false;
}

export interface SeoContextValue {
  config: SeoConfig;

  metadata?: SeoPageMetadata;

  registerNode: (node: SeoNode) => void;
}

export interface SeoMetadataProps {
  metadata: SeoPageMetadata;
}

export interface SeoJsonLdProps {
  data: SeoNode | SeoGraph | readonly SeoNode[];

  /**
   * Explicit Schema.org @id for a single node.
   */
  id?: string;

  /**
   * Optional CSP nonce.
   *
   * The actual script is rendered centrally by SeoProvider.
   */
  nonce?: string;
}

export interface SeoHeadProps {
  children?: ReactNode;
}

export interface SeoSchemaValidationError {
  nodeId?: string;
  issues: readonly SeoValidationIssue[];
}
