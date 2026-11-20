import { useEffect, useState } from "react";
import {
  Form,
  Link,
  Outlet,
  isRouteErrorResponse,
  redirect,
  useActionData,
  useLoaderData,
  useMatches,
  useRouteError,
  useSearchParams,
  type RouteObject,
} from "react-router";
import { createReactRouterLocaleLoader } from "@puzzle-ui/i18n/react-router";

import { getDocumentMetadata } from "./metadata";
import {
  localeCopy,
  localeOptions,
  localeRegistry,
  type Locale,
  type LocaleCopy,
} from "./locales";

interface WorkspaceLoaderData {
  locale: Locale;
  direction: "ltr" | "rtl";
  copy: LocaleCopy;
  query: string;
  topics: readonly string[];
}

interface WorkspaceActionData {
  message: string;
  savedNote: string;
}

const localeLoader = createReactRouterLocaleLoader({
  registry: localeRegistry,
});

const readSupportedLocale = (
  request: Request,
  params: Readonly<Record<string, string | undefined>>,
): Locale => {
  const requestedLocale = params.locale;
  const { locale } = localeLoader({ request, params });

  if (!requestedLocale || locale !== requestedLocale) {
    throw new Response("Unsupported locale.", {
      status: 404,
      statusText: "Not Found",
    });
  }

  return locale as Locale;
};

const workspaceLoader = ({
  request,
  params,
}: {
  request: Request;
  params: Readonly<Record<string, string | undefined>>;
}): WorkspaceLoaderData => {
  const locale = readSupportedLocale(request, params);
  const copy = localeCopy[locale];
  const query = new URL(request.url).searchParams.get("q")?.slice(0, 100) ?? "";
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);

  return {
    locale,
    direction: localeRegistry.get(locale)?.direction ?? "ltr",
    copy,
    query,
    topics: copy.topics.filter((topic) =>
      topic.toLocaleLowerCase(locale).includes(normalizedQuery),
    ),
  };
};

const workspaceAction = async ({
  request,
  params,
}: {
  request: Request;
  params: Readonly<Record<string, string | undefined>>;
}): Promise<WorkspaceActionData> => {
  const locale = readSupportedLocale(request, params);
  const formData = await request.formData();
  const savedNote = String(formData.get("note") ?? "").trim().slice(0, 100);

  if (!savedNote) {
    throw new Response("Please enter a note before saving.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return {
    message: localeCopy[locale].noteSaved,
    savedNote,
  };
};

const WorkspaceRoot = () => {
  const matches = useMatches();
  const [hydrated, setHydrated] = useState(false);
  const metadata = getDocumentMetadata(matches);

  useEffect(() => {
    setHydrated(true);
    document.documentElement.lang = metadata.locale;
    document.documentElement.dir = metadata.direction;
    document.title = metadata.title;

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (description) description.content = metadata.description;

    const openGraphTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );
    if (openGraphTitle) openGraphTitle.content = metadata.title;

    const openGraphDescription = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]',
    );
    if (openGraphDescription) openGraphDescription.content = metadata.description;
  }, [metadata.description, metadata.direction, metadata.locale, metadata.title]);

  return (
    <div data-testid="router-hydration" data-hydrated={hydrated ? "true" : "false"}>
      <Outlet />
    </div>
  );
};

const WorkspacePage = () => {
  const { locale, direction, copy, query, topics } =
    useLoaderData() as WorkspaceLoaderData;
  const actionData = useActionData() as WorkspaceActionData | undefined;
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") ?? query;

  return (
    <main lang={locale} dir={direction} data-testid="localized-workspace">
      <h1 data-testid="localized-title">{copy.title}</h1>
      <p data-testid="localized-description">{copy.description}</p>
      <nav aria-label="Available locales">
        {localeOptions.map(({ code, label }) => (
          <Link
            key={code}
            to={`/${code}/workspace${currentQuery ? `?q=${encodeURIComponent(currentQuery)}` : ""}`}
            data-testid={`locale-link-${code}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Form method="get" action={`/${locale}/workspace`} role="search">
        <label htmlFor="topic-search">{copy.searchLabel}</label>
        <input
          id="topic-search"
          key={currentQuery}
          name="q"
          type="search"
          defaultValue={currentQuery}
        />
        <button type="submit">{copy.searchButton}</button>
      </Form>
      <ul aria-label={copy.topicsLabel} data-testid="localized-topics">
        {topics.map((topic) => <li key={topic}>{topic}</li>)}
      </ul>
      {topics.length === 0 ? <p>{copy.noResults}</p> : null}
      <Form method="post" action={`/${locale}/workspace?q=${encodeURIComponent(currentQuery)}`}>
        <label htmlFor="workspace-note">{copy.noteLabel}</label>
        <input id="workspace-note" name="note" maxLength={100} />
        <button type="submit">{copy.saveNote}</button>
      </Form>
      {actionData ? (
        <p data-testid="action-result" role="status">
          {actionData.message} {actionData.savedNote}
        </p>
      ) : null}
    </main>
  );
};

const WorkspaceErrorBoundary = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error)
    ? typeof error.data === "string"
      ? error.data
      : error.statusText
    : "The localized workspace could not be loaded.";

  return (
    <main data-testid="route-error" role="alert">
      <h1>Workspace request failed</h1>
      <p data-testid="route-error-status">{status}</p>
      <p data-testid="route-error-message">{message}</p>
      <Link to="/en/workspace">Return to English</Link>
    </main>
  );
};

const routeMetadata = (data: unknown) => {
  const workspaceData = data as WorkspaceLoaderData | undefined;
  if (!workspaceData) return {};

  return {
    title: workspaceData.copy.title,
    description: workspaceData.copy.description,
    locale: workspaceData.locale,
    direction: workspaceData.direction,
  };
};

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    Component: WorkspaceRoot,
    children: [
      {
        index: true,
        loader: () => redirect("/en/workspace"),
      },
      {
        id: "workspace",
        path: ":locale/workspace",
        loader: workspaceLoader,
        action: workspaceAction,
        Component: WorkspacePage,
        ErrorBoundary: WorkspaceErrorBoundary,
        handle: { metadata: routeMetadata },
      },
    ],
  },
];

export const getStaticMetadata = (
  matches: readonly {
    route: { handle?: unknown; id: string };
  }[],
  loaderData: Record<string, unknown>,
) =>
  getDocumentMetadata(
    matches.map((match) => ({
      handle: match.route.handle,
      data: loaderData[match.route.id],
    })),
  );
