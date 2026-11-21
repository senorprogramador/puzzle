export type IconifySearchResult = {
  id: string;
  prefix: string;
  name: string;
};

const API_URL = "https://api.iconify.design/search";
const MAX_RESULTS = 48;
const MAX_CACHE_ENTRIES = 32;
const searchCache = new Map<string, IconifySearchResult[]>();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isIconifyIdentifier = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9_-]*$/i.test(value) &&
  !/^(?:blob|data|file|https?|javascript|url):/i.test(value);

export const searchIconifyIcons = async (
  query: string,
  signal: AbortSignal,
): Promise<IconifySearchResult[]> => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const cached = searchCache.get(normalizedQuery);
  if (cached) return cached.map((result) => ({ ...result }));

  const response = await fetch(
    `${API_URL}?query=${encodeURIComponent(query.trim())}&limit=${MAX_RESULTS}`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Icon search failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !Array.isArray(payload.icons)) {
    throw new Error("Icon search returned an invalid response.");
  }

  const results = payload.icons
    .filter(isIconifyIdentifier)
    .slice(0, MAX_RESULTS)
    .map((id) => {
      const [prefix, name] = id.split(":", 2);
      return { id, prefix: prefix!, name: name! };
    });

  searchCache.set(normalizedQuery, results);
  if (searchCache.size > MAX_CACHE_ENTRIES) {
    const oldest = searchCache.keys().next().value;
    if (oldest !== undefined) searchCache.delete(oldest);
  }

  return results.map((result) => ({ ...result }));
};

export const clearIconifySearchCache = (): void => {
  searchCache.clear();
};
