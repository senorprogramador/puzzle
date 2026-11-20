import {
  Link,
  createStaticHandler,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
} from "react-router";

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  RouteObject,
} from "react-router";

import { createReactRouterLocaleLoader } from "../../adapters/react-router";
import { createLocaleRegistry } from "../../locale";
import { createLocalizedSeoMetadata } from "../../seo";
import { createLocalizedRouting } from "../../routing";

const registry = createLocaleRegistry({
  locales: [{ locale: "en" }, { locale: "nl" }],
  defaultLocale: "en",
});

const localizedProductRoutes = {
  product: {
    en: "/products/:slug",
    nl: "/producten/:slug",
  },
} as const;

const routing = createLocalizedRouting({
  registry,
  routes: localizedProductRoutes,
});

const translations = {
  en: {
    title: "Wooden chair",
    description: "A locally crafted wooden chair.",
  },
  nl: {
    title: "Houten stoel",
    description: "Een lokaal gemaakte houten stoel.",
  },
} as const;

interface ProductRouteHandle {
  translations: typeof translations;
}

export interface ProductLoaderData {
  locale: string;
  source: string;
  slug: string;
  searchParams: Record<string, string>;
}

export interface ProductActionData {
  locale: string;
  source: string;
  item: FormDataEntryValue | null;
  quantity: FormDataEntryValue | null;
  currency: string | null;
}

export const createReactRouterStaticFixture = (
  onRoute?: Parameters<typeof createReactRouterLocaleLoader>[0]["onRoute"],
) => {
  const resolveLocale = createReactRouterLocaleLoader({
    registry,
    routes: localizedProductRoutes,
    urlLocale: "en",
    onRoute,
  });

  const loader = ({ request, params }: LoaderFunctionArgs): ProductLoaderData => {
    const resolution = resolveLocale({ request, params });
    const search = new URL(request.url).searchParams;

    return {
      locale: resolution.locale,
      source: resolution.source,
      slug: params.slug ?? "",
      searchParams: Object.fromEntries(search.entries()),
    };
  };

  const action = async ({
    request,
    params,
  }: ActionFunctionArgs): Promise<ProductActionData> => {
    const resolution = resolveLocale({ request, params });
    const formData = await request.formData();
    const search = new URL(request.url).searchParams;

    return {
      locale: resolution.locale,
      source: resolution.source,
      item: formData.get("item"),
      quantity: formData.get("quantity"),
      currency: search.get("currency"),
    };
  };

  const handle: ProductRouteHandle = { translations };
  const element = <ProductPage />;
  const routes: RouteObject[] = [
    {
      id: "product-en",
      path: "products/:slug",
      loader,
      action,
      element,
      handle,
    },
    {
      id: "product-nl",
      path: ":locale/producten/:slug",
      loader,
      action,
      element,
      handle,
    },
  ];

  return createStaticHandler(routes);
};

const ProductPage = () => {
  const data = useLoaderData() as ProductLoaderData;
  const location = useLocation();
  const navigation = useNavigation();
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as ProductRouteHandle | undefined;
  const translation = handle?.translations[data.locale as keyof typeof translations]
    ?? translations.en;
  const localizedPaths = {
    en: `/products/${encodeURIComponent(data.slug)}`,
    nl: `/producten/${encodeURIComponent(data.slug)}`,
  };
  const metadata = createLocalizedSeoMetadata({
    registry,
    baseUrl: "https://shop.example.test",
    locale: data.locale,
    path: localizedPaths.en,
    localizedPaths,
    title: translation.title,
    description: translation.description,
  });
  const alternatePaths = routing.alternateRoutePaths(
    "product",
    { slug: data.slug },
    { search: location.search },
  );
  const englishPath = alternatePaths.en;
  const dutchPath = alternatePaths.nl;

  if (!englishPath || !dutchPath) {
    throw new Error("The product fixture requires English and Dutch routes.");
  }

  return (
    <>
      <title>{translation.title}</title>
      <meta name="description" content={translation.description} />
      <link rel="canonical" href={metadata.canonical} />
      {metadata.alternates.alternates.map(({ locale, url }) => (
        <link key={locale} rel="alternate" hrefLang={locale} href={url} />
      ))}
      <nav aria-label="Product language">
        <Link to={englishPath}>English</Link>
        <Link to={dutchPath}>Nederlands</Link>
      </nav>
      <main lang={data.locale} data-navigation-state={navigation.state}>
        <h1>{translation.title}</h1>
        <p>{translation.description}</p>
        <output data-search={location.search}>
          {data.searchParams.variant ?? ""}
        </output>
      </main>
    </>
  );
};
