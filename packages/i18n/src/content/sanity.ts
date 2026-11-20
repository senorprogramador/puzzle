import {
  createContentSourceAdapter,
  type ContentAdapter,
  type ContentAdapterSource,
  type ContentAdapterSourceOptions,
  type ContentVersion,
  type LocalizedContentDocument,
} from "./index";

export const SANITY_CONTENT_QUERY = `*[
  _type == $documentType &&
  locale == $locale &&
  slug.current == $slug &&
  ($version == null || coalesce(version, _rev, _updatedAt, 1) == $version) &&
  ($preview || (!(_id in path("drafts.**")) && status != "draft"))
] | order(_id in path("drafts.**") desc, status == "draft" desc)[0]`;

export interface SanityContentQueryParams
  extends Record<string, string | number | boolean | null> {
  readonly documentType: string;
  readonly locale: string;
  readonly slug: string;
  readonly version: ContentVersion | null;
  readonly preview: boolean;
}

export interface SanityContentFetchOptions {
  readonly signal?: AbortSignal;
}

export interface SanityContentClient {
  fetch(
    query: string,
    params: SanityContentQueryParams,
    options?: SanityContentFetchOptions,
  ): Promise<unknown>;
}

export interface SanityContentSourceOptions
  extends ContentAdapterSourceOptions {
  readonly documentType?: string;
}

const SANITY_METADATA_FIELDS = new Set([
  "_createdAt",
  "_id",
  "_rev",
  "_type",
  "_updatedAt",
  "content",
  "locale",
  "slug",
  "status",
  "version",
]);

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const readVersion = (record: Record<string, unknown>): ContentVersion => {
  if (
    (typeof record.version === "string" && record.version.trim().length > 0) ||
    (typeof record.version === "number" && Number.isFinite(record.version))
  ) {
    return record.version;
  }

  if (typeof record._rev === "string" && record._rev.trim().length > 0) {
    return record._rev;
  }

  if (
    typeof record._updatedAt === "string" &&
    record._updatedAt.trim().length > 0
  ) {
    return record._updatedAt;
  }

  return 1;
};

const readSlug = (record: Record<string, unknown>): string | undefined => {
  if (typeof record.slug === "string") {
    return record.slug;
  }

  const slug = asRecord(record.slug)?.current;
  return typeof slug === "string" ? slug : undefined;
};

const normalizeDocument = <Data>(
  value: unknown,
): LocalizedContentDocument<Data> | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const record = asRecord(value);
  if (!record) {
    throw new TypeError("Sanity content query must return a document or null.");
  }

  const id = record._id;
  const rawLocale = record.locale;
  const slug = readSlug(record);
  const locale =
    typeof rawLocale === "string"
      ? Intl.getCanonicalLocales(rawLocale)[0]
      : undefined;

  if (typeof id !== "string" || !id || !locale || !slug) {
    throw new TypeError(
      "Sanity content documents require _id, locale, and slug.current fields.",
    );
  }

  const status: LocalizedContentDocument<Data>["status"] =
    id.startsWith("drafts.") || record.status === "draft"
      ? "draft"
      : "published";
  const content = Object.prototype.hasOwnProperty.call(record, "content")
    ? record.content
    : Object.fromEntries(
        Object.entries(record).filter(
          ([field]) => !SANITY_METADATA_FIELDS.has(field),
        ),
      );

  return {
    id,
    locale,
    slug,
    status,
    version: readVersion(record),
    content: content as Data,
  };
};

export const createSanityContentSource = <Data = Record<string, unknown>>(
  client: SanityContentClient,
  options: SanityContentSourceOptions = {},
): ContentAdapterSource<Data> => {
  const documentType = options.documentType ?? "content";

  if (!documentType.trim() || /[\u0000-\u001f\u007f]/.test(documentType)) {
    throw new Error("Sanity documentType must be a non-empty string.");
  }

  const adapter: ContentAdapter<Data> = {
    async load(query, { signal }) {
      const params: SanityContentQueryParams = {
        documentType,
        locale: query.locale,
        slug: query.slug,
        version: query.version ?? null,
        preview: query.preview,
      };
      const result = signal
        ? await client.fetch(SANITY_CONTENT_QUERY, params, { signal })
        : await client.fetch(SANITY_CONTENT_QUERY, params);

      return normalizeDocument<Data>(result);
    },
  };

  const { documentType: _documentType, ...adapterOptions } = options;
  return createContentSourceAdapter(adapter, adapterOptions);
};
