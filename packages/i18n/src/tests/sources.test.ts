import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import {
  CatalogSourceError,
  createMemoryCatalogSource,
  createRemoteCatalogSource,
  createTypeScriptCatalogSource,
  parseJsonCatalog,
} from "../sources";
import { createFileCatalogSource } from "../sources/node";

describe("catalog sources", () => {
  it("parses immutable JSON catalogs and rejects invalid structures", () => {
    const catalog = parseJsonCatalog('{"nested":{"title":"Hi"}}', "en");

    expect(Object.isFrozen(catalog)).toBe(true);
    expect(() => parseJsonCatalog('{"nested":["invalid"]}', "en")).toThrow(
      /plain object/,
    );
    expect(() => parseJsonCatalog("{", "en")).toThrow(/invalid/);
  });

  it("preserves safe JSON serialization for untrusted catalog strings and keys", () => {
    const catalog = parseJsonCatalog(
      '{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted":"yes"}},"markup":"</script><img src=x onerror=alert(1)>"}',
      "en",
    );

    expect(Object.getPrototypeOf(catalog)).toBe(Object.prototype);
    expect(Object.hasOwn(catalog, "__proto__")).toBe(true);
    expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
    expect(JSON.parse(JSON.stringify(catalog))).toEqual(
      JSON.parse(
        '{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted":"yes"}},"markup":"</script><img src=x onerror=alert(1)>"}',
      ),
    );
  });

  it("loads in-memory catalogs and namespaces without mutable global locale state", async () => {
    const source = createMemoryCatalogSource({
      catalogs: {
        en: { common: { title: "Title" } },
        nl: { common: { title: "Titel" } },
      },
    });

    const [english, dutch] = await Promise.all([
      source.load("en", "common"),
      source.load("nl", "common"),
    ]);

    expect(english.title).toBe("Title");
    expect(dutch.title).toBe("Titel");
    await expect(source.load("fr")).rejects.toThrow(CatalogSourceError);
  });

  it("loads typed TypeScript catalogs and runs an injected schema validator", async () => {
    const validate = vi.fn(
      (catalog: unknown, { locale }: { locale: string }) => {
        if (
          typeof catalog !== "object" ||
          catalog === null ||
          !("title" in catalog) ||
          typeof catalog.title !== "string"
        ) {
          throw new Error(`Invalid schema for "${locale}".`);
        }
      },
    );
    const source = createTypeScriptCatalogSource({
      catalogs: {
        en: { title: "Typed title", nested: { subtitle: "Nested" } },
      } as const,
      validate,
    });

    const typedTitle: "Typed title" = (await source.load("en")).title;
    expect(typedTitle).toBe("Typed title");
    await expect(source.load("en")).resolves.toMatchObject({
      title: "Typed title",
      nested: { subtitle: "Nested" },
    });
    expect(validate).toHaveBeenCalledOnce();
    expect(validate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Typed title" }),
      { locale: "en" },
    );
    expect(Object.isFrozen(validate.mock.calls[0]?.[0])).toBe(true);

    expect(() =>
      createTypeScriptCatalogSource({
        catalogs: { nl: { title: "Titel" } },
        validate: () => {
          throw new Error("schema rejected");
        },
      }),
    ).toThrow("schema rejected");
  });

  it("caches remote catalogs per locale and supports explicit invalidation", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      const title = url.pathname.includes("/nl/") ? "Titel" : "Title";
      return new Response(JSON.stringify({ title }), { status: 200 });
    });
    const source = createRemoteCatalogSource({
      url: (locale) => `https://example.com/${locale}/catalog.json`,
      fetcher,
    });

    expect((await source.load("en")).title).toBe("Title");
    expect((await source.load("en")).title).toBe("Title");
    expect((await source.load("nl")).title).toBe("Titel");
    expect(fetcher).toHaveBeenCalledTimes(2);

    source.invalidate("en");
    await source.load("en");
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("blocks HTTP redirects before accepting a remote catalog response", async () => {
    const fetcher = vi.fn(
      async (_input: RequestInfo | URL, init?: RequestInit) => {
        expect(init?.redirect).toBe("error");
        return new Response(null, {
          status: 302,
          headers: { location: "https://other.example/catalog.json" },
        });
      },
    );
    const source = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      fetcher,
    });

    await expect(source.load("en")).rejects.toThrow(/redirects are not allowed/);
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("keeps credential-bound catalog caches isolated by source instance", async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const credential = new Headers(init?.headers).get("authorization");
      return new Response(JSON.stringify({ credential }), { status: 200 });
    });
    const first = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      headers: { authorization: "Bearer mock-first-token" },
      fetcher,
    });
    const second = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      headers: { authorization: "Bearer mock-second-token" },
      fetcher,
    });

    expect(await first.load("en")).toEqual({
      credential: "Bearer mock-first-token",
    });
    expect(await first.load("en")).toEqual({
      credential: "Bearer mock-first-token",
    });
    expect(await second.load("en")).toEqual({
      credential: "Bearer mock-second-token",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("does not let a fetcher mutate credentials for later remote requests", async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const requestHeaders = init?.headers as Headers;
      const authorization = requestHeaders.get("authorization");
      requestHeaders.set("authorization", "Bearer mock-mutated-token");
      return new Response(JSON.stringify({ authorization }), { status: 200 });
    });
    const source = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      headers: { authorization: "Bearer mock-stable-token" },
      fetcher,
    });

    await expect(source.load("en")).resolves.toEqual({
      authorization: "Bearer mock-stable-token",
    });
    source.invalidate("en");
    await expect(source.load("en")).resolves.toEqual({
      authorization: "Bearer mock-stable-token",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("isolates cache entries by URL and credential-bound source instance", async () => {
    let path = "/tenant-a/catalog.json";
    const fetcher = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const authorization = new Headers(init?.headers).get("authorization");
      return new Response(JSON.stringify({ authorization, path }), {
        status: 200,
      });
    });
    const headersA = new Headers({ authorization: "Bearer tenant-a" });
    const tenantA = createRemoteCatalogSource({
      url: () => `https://example.com${path}`,
      headers: headersA,
      fetcher,
    });
    const tenantB = createRemoteCatalogSource({
      url: () => "https://example.com/tenant-b/catalog.json",
      headers: { authorization: "Bearer tenant-b" },
      fetcher,
    });

    expect(await tenantA.load("en")).toEqual({
      authorization: "Bearer tenant-a",
      path: "/tenant-a/catalog.json",
    });
    headersA.set("authorization", "Bearer tenant-b");
    expect(await tenantA.load("en")).toEqual({
      authorization: "Bearer tenant-a",
      path: "/tenant-a/catalog.json",
    });
    path = "/tenant-b/catalog.json";
    expect(await tenantA.load("en")).toEqual({
      authorization: "Bearer tenant-a",
      path: "/tenant-b/catalog.json",
    });
    expect(await tenantB.load("en")).toEqual({
      authorization: "Bearer tenant-b",
      path: "/tenant-b/catalog.json",
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("checks aborts before returning cached catalogs and limits response size", async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ title: "Title" }), { status: 200 }),
    );
    const source = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      fetcher,
    });
    await source.load("en");

    const controller = new AbortController();
    controller.abort();
    await expect(source.load("en", undefined, controller.signal)).rejects.toThrow();
    expect(fetcher).toHaveBeenCalledTimes(1);

    const oversized = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      maxResponseBytes: 4,
      fetcher: async () => new Response('{"title":"large"}', { status: 200 }),
    });
    await expect(oversized.load("en")).rejects.toThrow(/size limit/);
  });

  it("rejects unsafe URLs, bad responses, and malformed remote catalogs", async () => {
    const unsafe = createRemoteCatalogSource({
      url: () => "https://user:pass@example.com/catalog.json",
      fetcher: async () => new Response(null, { status: 200 }),
    });
    await expect(unsafe.load("en")).rejects.toThrow(/credentials/);

    const badStatus = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      fetcher: async () => new Response(null, { status: 404 }),
    });
    await expect(badStatus.load("en")).rejects.toThrow(/HTTP 404/);

    const badCatalog = createRemoteCatalogSource({
      url: () => "https://example.com/catalog.json",
      fetcher: async () =>
        new Response(JSON.stringify({ title: ["not", "text"] }), {
          status: 200,
        }),
    });
    await expect(badCatalog.load("en")).rejects.toThrow(/plain object/);
  });

  it("loads filesystem catalogs and rejects namespace traversal", async () => {
    const source = createFileCatalogSource({
      rootDir: fileURLToPath(new URL("./fixtures/catalogs", import.meta.url)),
    });

    expect((await source.load("en")).common).toEqual({ title: "Hello" });
    expect((await source.load("nl", "common")).title).toBe("Hallo");
    await expect(source.load("en", "../secret")).rejects.toThrow(/Invalid catalog namespace/);
  });
});
