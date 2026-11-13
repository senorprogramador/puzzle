import { Component, act, type ReactNode } from "react";

import { createRoot, hydrateRoot, type Root } from "react-dom/client";

import { renderToString } from "react-dom/server";

import { afterEach, describe, expect, it, vi } from "vitest";

import { SeoProvider, SeoHead, LDOrganization } from "../react";

import { generateRobotsTxt, generateSitemap } from "../index";

import type { SeoPageMetadata } from "../index";

import type { SeoValidationReport } from "../validation";

declare global {
  interface Window {
    __seoInjected?: boolean;
  }
}

// React only flushes updates synchronously inside act() when this flag is set.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

const config = {
  siteUrl: "https://example.com",
  defaultLocale: "en",
  supportedLocales: ["en", "nl"],
  title: {
    default: "Example",
    template: "%s | Example",
  },
  identity: {
    name: "Example",
    url: "https://example.com",
  },
};

const aboutMetadata: SeoPageMetadata = {
  title: "About",
  description: "Learn more about the Example website and its team.",
  canonical: "/about",
  locale: "en",
  alternates: {
    alternates: [
      { locale: "en", url: "/about" },
      { locale: "nl", url: "/nl/over-ons" },
    ],
  },
};

const contactMetadata: SeoPageMetadata = {
  title: "Contact",
  description: "Get in touch with the Example team through our contact page.",
  canonical: "/contact",
};

const roots: Root[] = [];

const mount = async (element: ReactNode): Promise<Root> => {
  const container = document.createElement("div");
  document.body.append(container);

  const root = createRoot(container);
  roots.push(root);

  await act(async () => {
    root.render(element);
  });

  return root;
};

const Page = ({ metadata }: { metadata: SeoPageMetadata }) => (
  <SeoProvider config={config} metadata={metadata}>
    <SeoHead />
  </SeoProvider>
);

// The Vitest runner page has its own head nodes (e.g. an empty <title>).
const initialHeadNodes = new Set(Array.from(document.head.children));

const headQuery = (selector: string) =>
  Array.from(document.head.querySelectorAll(selector)).filter(
    (node) => !initialHeadNodes.has(node),
  );

const parseJsonLd = (root: ParentNode) => {
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');

  expect(scripts).toHaveLength(1);

  return JSON.parse(scripts[0]!.textContent ?? "") as {
    "@graph": Array<Record<string, unknown>>;
  };
};

afterEach(async () => {
  await act(async () => {
    for (const root of roots.splice(0)) {
      root.unmount();
    }
  });

  document.body.replaceChildren();
  delete window.__seoInjected;
  vi.restoreAllMocks();
});

describe("SEO metadata in the browser", () => {
  it("hoists metadata into document.head on client render", async () => {
    await mount(<Page metadata={aboutMetadata} />);

    expect(document.title).toBe("About | Example");

    expect(
      headQuery('meta[name="description"]')[0]?.getAttribute("content"),
    ).toBe(aboutMetadata.description);

    expect(
      headQuery('link[rel="canonical"]')[0]?.getAttribute("href"),
    ).toBe("https://example.com/about");

    expect(
      headQuery('meta[property="og:title"]')[0]?.getAttribute("content"),
    ).toBe("About | Example");

    expect(
      headQuery('meta[property="og:url"]')[0]?.getAttribute("content"),
    ).toBe("https://example.com/about");

    expect(headQuery('meta[name="twitter:card"]')).toHaveLength(1);

    expect(
      headQuery('link[rel="alternate"][hreflang="nl"]')[0]?.getAttribute(
        "href",
      ),
    ).toBe("https://example.com/nl/over-ons");

    // Nothing should be left behind in the body.
    expect(document.body.querySelector("title, meta, link")).toBeNull();
  });

  it("replaces head tags on client-side navigation without duplicates", async () => {
    const root = await mount(<Page metadata={aboutMetadata} />);

    await act(async () => {
      root.render(<Page metadata={contactMetadata} />);
    });

    expect(document.title).toBe("Contact | Example");
    expect(headQuery("title")).toHaveLength(1);

    const canonicals = headQuery('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    expect(canonicals[0]?.getAttribute("href")).toBe(
      "https://example.com/contact",
    );

    expect(headQuery('meta[name="description"]')).toHaveLength(1);
    expect(headQuery('link[rel="alternate"][hreflang]')).toHaveLength(0);
  });

  it("removes head tags when the page unmounts", async () => {
    const root = await mount(<Page metadata={aboutMetadata} />);

    await act(async () => {
      root.unmount();
    });
    roots.splice(roots.indexOf(root), 1);

    expect(headQuery("title")).toHaveLength(0);
    expect(headQuery('link[rel="canonical"]')).toHaveLength(0);
    expect(headQuery('meta[name="description"]')).toHaveLength(0);
  });
});

describe("SEO JSON-LD in the browser", () => {
  it("renders a parseable JSON-LD graph", async () => {
    await mount(
      <SeoProvider config={config}>
        <LDOrganization name="Puzzle" url="https://example.com" />
      </SeoProvider>,
    );

    const graph = parseJsonLd(document.body)["@graph"];

    expect(graph).toContainEqual(
      expect.objectContaining({
        "@type": "https://schema.org/Organization",
        name: "Puzzle",
      }),
    );
  });

  it("does not execute script injected through schema values in server HTML", async () => {
    const payload =
      "</script><script>window.__seoInjected = true</script><!--";

    const html = renderToString(
      <SeoProvider config={config}>
        <LDOrganization name={payload} url="https://example.com" />
      </SeoProvider>,
    );

    // A sandboxed same-origin iframe executes inline scripts like a real page load.
    const frame = document.createElement("iframe");
    const loaded = new Promise((resolve) => {
      frame.addEventListener("load", resolve, { once: true });
    });

    frame.srcdoc = `<!doctype html><html><head></head><body>${html}</body></html>`;
    document.body.append(frame);
    await loaded;

    const frameWindow = frame.contentWindow!;
    const frameDocument = frame.contentDocument!;

    expect(frameWindow.__seoInjected).toBeUndefined();
    expect(frameDocument.querySelectorAll("script")).toHaveLength(1);

    const organization = parseJsonLd(frameDocument)["@graph"].find(
      (node) => node["@type"] === "https://schema.org/Organization",
    );

    expect(organization?.name).toBe(payload);
  });

  it("hydrates server-rendered JSON-LD without mismatches", async () => {
    const element = (
      <SeoProvider config={config}>
        <LDOrganization name="Hydrated" url="https://example.com" />
      </SeoProvider>
    );

    const container = document.createElement("div");
    container.innerHTML = renderToString(element);
    document.body.append(container);

    const serverScript = container.querySelector("script");
    const recoverableErrors: unknown[] = [];

    await act(async () => {
      roots.push(
        hydrateRoot(container, element, {
          onRecoverableError: (error) => recoverableErrors.push(error),
        }),
      );
    });

    expect(recoverableErrors).toEqual([]);
    // Hydration must reuse the server node instead of re-creating it.
    expect(container.querySelector("script")).toBe(serverScript);
    expect(parseJsonLd(container)["@graph"]).toContainEqual(
      expect.objectContaining({ name: "Hydrated" }),
    );
  });
});

describe("SEO validation in the browser", () => {
  it("reports validation results after mount", async () => {
    const onValidation = vi.fn<(report: SeoValidationReport) => void>();

    await mount(
      <SeoProvider
        config={config}
        metadata={aboutMetadata}
        onValidation={onValidation}
      >
        <LDOrganization name="Puzzle" url="https://example.com" />
      </SeoProvider>,
    );

    expect(onValidation).toHaveBeenCalled();
    expect(onValidation.mock.lastCall?.[0]).toEqual(
      expect.objectContaining({ mode: "warn" }),
    );
  });

  it("surfaces strict validation failures to an error boundary", async () => {
    // React logs caught render errors; keep the test output clean.
    vi.spyOn(console, "error").mockImplementation(() => {});

    class Boundary extends Component<
      { children: ReactNode },
      { message?: string }
    > {
      override state: { message?: string } = {};

      static getDerivedStateFromError(error: Error) {
        return { message: error.message };
      }

      override render() {
        return this.state.message ? (
          <p role="alert">{this.state.message}</p>
        ) : (
          this.props.children
        );
      }
    }

    await mount(
      <Boundary>
        <SeoProvider
          config={config}
          metadata={{ canonical: "javascript:alert(1)" }}
          validation={{ mode: "strict" }}
        >
          <SeoHead />
        </SeoProvider>
      </Boundary>,
    );

    const alert = document.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain("Puzzle SEO validation failed");
    expect(alert?.textContent).toContain("invalid-canonical");
    expect(headQuery('link[rel="canonical"]')).toHaveLength(0);
  });
});

describe("Technical SEO output in the browser", () => {
  it("generates well-formed sitemap XML", () => {
    const result = generateSitemap({
      baseUrl: "https://example.com",
      entries: [{ url: "/" }, { url: "/about?a=1&b=2" }],
    });

    const xml = new DOMParser().parseFromString(
      result.files[0]!.xml,
      "application/xml",
    );

    expect(xml.querySelector("parsererror")).toBeNull();
    expect(
      Array.from(xml.getElementsByTagName("loc"), (loc) => loc.textContent),
    ).toEqual(["https://example.com/", "https://example.com/about?a=1&b=2"]);
  });

  it("generates robots.txt with the browser-safe root entry", () => {
    const result = generateRobotsTxt({
      rules: [{ userAgent: "*", disallow: ["/private"] }],
    });

    expect(result.issues).toEqual([]);
    expect(result.content).toContain("Disallow: /private");
  });
});
