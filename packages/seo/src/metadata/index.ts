export type {
  SeoTitleMetadata,
  SeoDescriptionMetadata,
  SeoCanonicalMetadata,
  SeoRobotsMetadata,
  SeoOpenGraphMetadata,
  SeoTwitterMetadata,
  SeoSocialImage,
  SeoAlternateLanguage,
  SeoHreflangMetadata,
  SeoPageMetadata,
  ResolvedSeoMetadata,
} from "./types";

export { resolveSeoMetadata, resolveSeoRobots } from "./resolve";
