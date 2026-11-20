import { describe, expect, it, vi } from "vitest";

import {
  createSanityContentSource,
  SANITY_CONTENT_QUERY,
  type SanityContentClient,
  type SanityContentQueryParams,
} from "../content";

const request = {
  locale: "en",
  slug: "articles/hello",
  preview: false,
};

describe("Sanity content source", () => {
  it("uses a fixed GROQ query and passes request values as params", async () => {
    const fetch = vi.fn(
      async (_query: string, _params: SanityContentQueryParams) => ({
        _id: "article-1",
        _type: "article",
        _rev: "revision-1",
        locale: "en",
        slug: { current: request.slug },
        status: "published",
        version: 3,
        content: { title: "Hello" },
      }),
    );
    const source = createSanityContentSource<{ title: string }>(
      { fetch },
      { documentType: "article" },
    );

    await expect(source.load(request)).resolves.toEqual({
      id: "article-1",
      locale: "en",
      slug: request.slug,
      status: "published",
      version: 3,
      content: { title: "Hello" },
    });
    expect(fetch).toHaveBeenCalledWith(SANITY_CONTENT_QUERY, {
      documentType: "article",
      locale: "en",
      slug: request.slug,
      version: null,
      preview: false,
    });
  });

  it("does not interpolate user-controlled query values", async () => {
    const injectedSlug = 'articles/hello" || true';
    const fetch = vi.fn(
      async (_query: string, _params: SanityContentQueryParams) => null,
    );
    const source = createSanityContentSource({ fetch });

    await expect(
      source.load({ ...request, slug: injectedSlug }),
    ).resolves.toBeUndefined();

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch.mock.calls[0]?.[0]).toBe(SANITY_CONTENT_QUERY);
    expect(fetch.mock.calls[0]?.[0]).not.toContain(injectedSlug);
    expect(fetch.mock.calls[0]?.[1]).toMatchObject({
      documentType: "content",
      slug: injectedSlug,
    });
  });

  it("normalizes drafts and derives a version from Sanity metadata", async () => {
    const fetch: SanityContentClient["fetch"] = async () => ({
      _id: "drafts.article-1",
      _rev: "revision-2",
      locale: "en-us",
      slug: { current: "articles/hello" },
      title: "Draft",
      body: [{ _type: "block" }],
    });
    const source = createSanityContentSource({ fetch });

    await expect(
      source.load({ ...request, preview: true }),
    ).resolves.toEqual({
      id: "drafts.article-1",
      locale: "en-US",
      slug: request.slug,
      status: "draft",
      version: "revision-2",
      content: {
        title: "Draft",
        body: [{ _type: "block" }],
      },
    });
  });

  it("passes abort signals to the injected client", async () => {
    const fetch = vi.fn(
      async (_query: string, _params: SanityContentQueryParams) => null,
    );
    const source = createSanityContentSource({ fetch });
    const controller = new AbortController();

    await source.load(request, controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      SANITY_CONTENT_QUERY,
      expect.any(Object),
      { signal: controller.signal },
    );
  });

  it("rejects malformed Sanity results", async () => {
    const fetch = vi.fn(
      async (_query: string, _params: SanityContentQueryParams) => ({
        _id: "article-1",
        locale: "en",
      }),
    );
    const source = createSanityContentSource({ fetch });

    await expect(source.load(request)).rejects.toThrow(
      "Sanity content documents require _id, locale, and slug.current fields.",
    );
  });
});
