export type {
  SitemapImage,
  SitemapVideo,
  SitemapAlternate,
  SitemapEntry,
  SitemapOptions,
  SitemapGenerationOptions,
  SitemapValidationIssue,
  SitemapResult,
  SitemapFile,
  SitemapCollection,
} from "./types";

export {
  escapeXml,
  formatSitemapDate,
  serializeSitemapEntry,
  createSitemapXml,
  validateSitemapEntries,
  sitemapByteLength,
} from "./xml";

export { serializeSitemap, generateSitemap } from "./generate";
