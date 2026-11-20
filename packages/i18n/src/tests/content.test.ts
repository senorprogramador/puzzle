import { describe, expect, it, vi } from "vitest";

import { createLocaleRegistry } from "../locale";
import {
  createContentResolver,
  createContentSourceAdapter,
  createLocalizedContentSlugMap,
  type ContentAdapterContext,
  type ContentQuery,
  type ContentSource,
  type LocalizedContentDocument,
} from "../content";

const registry = createLocaleRegistry({
  locales: [{ locale: "en" }, { locale: "nl" }],
  defaultLocale: "en",
});

const createSource = <Data>(
  documents: Readonly<Record<string, LocalizedContentDocument<Data>>>,
): ContentSource<Data> => ({
  async load({ locale, slug }) {
    return documents[`${locale}:${slug}`];
  },
});

describe("localized content resolution", () => {
  it("uses the locale fallback chain and validates the returned document", async () => {
    const validate = vi.fn();
    const resolver = createContentResolver({
      registry,
      source: createSource({
        "en:articles/hello": {
          id: "hello-en",
          locale: "en",
          slug: "articles/hello",
          status: "published",
          version: 3,
          content: "Hello",
        },
      }),
      validate,
    });

    await expect(
      resolver.resolve({ locale: "nl", slug: "articles/hello" }),
    ).resolves.toMatchObject({
      status: "found",
      requestedLocale: "nl",
      locale: "en",
      usedFallback: true,
      document: { content: "Hello", version: 3 },
    });
    expect(validate).toHaveBeenCalledOnce();
  });

  it("maps localized slugs to one route and falls back using that locale's slug", async () => {
    const localizedSlugs = createLocalizedContentSlugMap(registry, {
      "article:hello": {
        en: "articles/hello",
        nl: "artikelen/hallo",
      },
    });
    const source = createSource({
      "en:articles/hello": {
        id: "hello-en",
        locale: "en",
        slug: "articles/hello",
        status: "published",
        version: 1,
        content: "Hello",
      },
    });
    const load = vi.spyOn(source, "load");
    const resolver = createContentResolver({ registry, source, localizedSlugs });

    await expect(
      resolver.resolve({ locale: "nl", slug: "artikelen/hallo" }),
    ).resolves.toMatchObject({
      status: "found",
      locale: "en",
      usedFallback: true,
      routeId: "article:hello",
      document: { slug: "articles/hello" },
    });
    expect(load.mock.calls.map(([query]) => `${query.locale}:${query.slug}`)).toEqual([
      "nl:artikelen/hallo",
      "en:articles/hello",
    ]);
  });

  it("excludes drafts from public resolution and exposes them in preview mode", async () => {
    const resolver = createContentResolver({
      registry,
      source: createSource({
        "nl:articles/draft": {
          id: "draft-nl",
          locale: "nl",
          slug: "articles/draft",
          status: "draft",
          version: "draft-1",
          content: "Preview",
        },
      }),
    });

    await expect(
      resolver.resolve({ locale: "nl", slug: "articles/draft" }),
    ).resolves.toMatchObject({ status: "missing" });
    await expect(
      resolver.resolve({
        locale: "nl",
        slug: "articles/draft",
        preview: true,
      }),
    ).resolves.toMatchObject({
      status: "found",
      locale: "nl",
      document: { status: "draft" },
    });
  });

  it("returns missing for unavailable versions and rejects unsafe slugs", async () => {
    const resolver = createContentResolver({
      registry,
      source: createSource({
        "en:articles/hello": {
          id: "hello-en",
          locale: "en",
          slug: "articles/hello",
          status: "published",
          version: 1,
          content: "Old",
        },
      }),
    });

    await expect(
      resolver.resolve({
        locale: "en",
        slug: "articles/hello",
        version: 2,
      }),
    ).resolves.toMatchObject({ status: "missing", version: 2 });

    for (const slug of ["../secret", "%2e%2e/secret", "articles/%2fsecret"]) {
      await expect(
        resolver.resolve({ locale: "en", slug }),
      ).rejects.toThrow(/Invalid localized content slug/);
    }
  });

  it("surfaces aborts and rejects documents returned for another locale", async () => {
    const controller = new AbortController();
    controller.abort(new Error("cancelled"));
    const resolver = createContentResolver({
      registry,
      source: {
        load: vi.fn(async () => ({
          id: "wrong-locale",
          locale: "en",
          slug: "article",
          status: "published" as const,
          version: 1,
          content: "Content",
        })),
      },
    });

    await expect(
      resolver.resolve({
        locale: "nl",
        slug: "article",
        signal: controller.signal,
      }),
    ).rejects.toThrow("cancelled");
    await expect(
      resolver.resolve({ locale: "nl", slug: "article" }),
    ).rejects.toThrow(/returned locale "en" for requested locale "nl"/);
  });

  it("validates untrusted content with an injected asynchronous schema validator", async () => {
    const markup = '</script><img src=x onerror="alert(1)">';
    const resolver = createContentResolver({
      registry,
      source: createSource({
        "en:article": {
          id: "article",
          locale: "en",
          slug: "article",
          status: "published",
          version: 1,
          content: { title: markup },
        },
      }),
      validate: async (content) => {
        if (typeof content.title !== "string") {
          throw new Error("Invalid article schema.");
        }
      },
    });
    const result = await resolver.resolve({ locale: "en", slug: "article" });

    expect(result.status).toBe("found");
    if (result.status !== "found") {
      throw new Error("Expected content to resolve.");
    }

    expect(result.document.content.title).toBe(markup);
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    expect(typeof result.document.content.title).toBe("string");
  });

  it("keeps injected adapter credentials and cached content scoped to each instance", async () => {
    const createTenantSource = (tenant: string) => {
      const load = vi.fn(async (query: ContentQuery, context: ContentAdapterContext) => {
        expect(query).not.toHaveProperty("credential");
        expect(context).not.toHaveProperty("credential");

        return {
          id: `${tenant}-${query.slug}`,
          locale: query.locale,
          slug: query.slug,
          status: "published" as const,
          version: query.version ?? 1,
          content: { tenant, preview: query.preview },
        };
      });

      return {
        source: createContentSourceAdapter({ load }, { cacheTtlMs: 60_000 }),
        load,
      };
    };
    const tenantA = createTenantSource("mock-tenant-a");
    const tenantB = createTenantSource("mock-tenant-b");
    const baseQuery = {
      locale: "en",
      slug: "article",
      version: 1,
      preview: false,
    };

    await expect(tenantA.source.load(baseQuery)).resolves.toMatchObject({
      content: { tenant: "mock-tenant-a" },
    });
    await tenantA.source.load(baseQuery);
    await expect(
      tenantA.source.load({ ...baseQuery, preview: true }),
    ).resolves.toMatchObject({ content: { preview: true } });
    await expect(
      tenantA.source.load({ ...baseQuery, version: 2 }),
    ).resolves.toMatchObject({ version: 2 });
    await expect(tenantB.source.load(baseQuery)).resolves.toMatchObject({
      content: { tenant: "mock-tenant-b" },
    });

    expect(tenantA.load).toHaveBeenCalledTimes(3);
    expect(tenantB.load).toHaveBeenCalledOnce();
    tenantA.source.invalidate();
    await tenantA.source.load(baseQuery);
    expect(tenantA.load).toHaveBeenCalledTimes(4);
  });

  it("rejects ambiguous localized slugs and unknown localized routes", async () => {
    expect(() =>
      createLocalizedContentSlugMap(registry, {
        first: { en: "same" },
        second: { en: "same" },
      }),
    ).toThrow(/shared by routes/);

    const resolver = createContentResolver({
      registry,
      source: createSource({}),
      localizedSlugs: createLocalizedContentSlugMap(registry, {
        known: { en: "known", nl: "bekend" },
      }),
    });

    await expect(
      resolver.resolve({ locale: "nl", routeId: "unknown" }),
    ).rejects.toThrow(/Unknown localized content route/);
  });
});
