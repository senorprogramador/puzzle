import { describe, expect, it } from "vitest";
import {
  StaticRouterProvider,
  createStaticRouter,
} from "react-router";
import { renderToStaticMarkup } from "react-dom/server";

import { createReactRouterStaticFixture } from "./fixtures/react-router-static.fixture";

describe("React Router 7 static fixture", () => {
  it("resolves localized loaders and renders route metadata and navigation", async () => {
    const routeEvents: unknown[] = [];
    const handler = createReactRouterStaticFixture((event) => {
      routeEvents.push(event);
    });
    const result = await handler.query(
      new Request(
        "https://shop.example.test/nl/producten/stoel?variant=walnut&sort=price",
        {
          headers: { "accept-language": "en;q=1.0" },
        },
      ),
    );

    expect(result).not.toBeInstanceOf(Response);
    if (result instanceof Response) {
      throw new Error("Expected a static handler context.");
    }

    expect(result.loaderData["product-nl"]).toEqual({
      locale: "nl",
      source: "url",
      slug: "stoel",
      searchParams: { variant: "walnut", sort: "price" },
    });
    expect(routeEvents).toContainEqual({
      type: "route",
      pathname: "/producten/:slug",
      status: "matched",
      locale: "nl",
      routeId: "product",
    });

    const router = createStaticRouter(handler.dataRoutes, result);
    const markup = renderToStaticMarkup(
      <StaticRouterProvider router={router} context={result} hydrate={false} />,
    );

    expect(markup).toContain("<title>Houten stoel</title>");
    expect(markup).toContain(
      '<meta name="description" content="Een lokaal gemaakte houten stoel."/>',
    );
    expect(markup).toContain(
      '<link rel="canonical" href="https://shop.example.test/nl/producten/stoel"/>',
    );
    expect(markup).toContain(
      '<link rel="alternate" hrefLang="en" href="https://shop.example.test/products/stoel"/>',
    );
    expect(markup).toContain(
      '<a href="/products/stoel?variant=walnut&amp;sort=price"',
    );
    expect(markup).toContain('lang="nl" data-navigation-state="idle"');
    expect(markup).toContain('data-search="?variant=walnut&amp;sort=price"');
  });

  it("runs native route actions with localized request and search data", async () => {
    const routeEvents: unknown[] = [];
    const handler = createReactRouterStaticFixture((event) => {
      routeEvents.push(event);
    });
    const result = await handler.query(
      new Request(
        "https://shop.example.test/nl/producten/stoel?currency=EUR",
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ item: "stoel", quantity: "2" }),
        },
      ),
    );

    expect(result).not.toBeInstanceOf(Response);
    if (result instanceof Response) {
      throw new Error("Expected a static handler context.");
    }

    expect(result.actionData).toEqual({
      "product-nl": {
        locale: "nl",
        source: "url",
        item: "stoel",
        quantity: "2",
        currency: "EUR",
      },
    });
    expect(routeEvents).toContainEqual({
      type: "route",
      pathname: "/producten/:slug",
      status: "matched",
      locale: "nl",
      routeId: "product",
    });
  });
});
