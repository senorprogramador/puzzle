import type { FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const locales = [
  { code: "en", label: "English", direction: "ltr" },
  { code: "fr", label: "Français", direction: "ltr" },
  { code: "ar", label: "العربية", direction: "rtl" },
] as const;

type Locale = (typeof locales)[number]["code"];

interface LocaleCopy {
  title: string;
  description: string;
  searchLabel: string;
  searchButton: string;
  noResults: string;
  topics: readonly string[];
}

const isLocale = (value: unknown): value is Locale =>
  locales.some(({ code }) => code === value);

const getLocaleCopy = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<Locale, LocaleCopy>> => ({
    en: {
      title: "Explore localized workspace content",
      description:
        "This copy is loaded on the server and hydrated by the route.",
      searchLabel: "Search topics",
      searchButton: "Search",
      noResults: "No matching topics.",
      topics: ["Shared projects", "Team members", "Workspace activity"],
    },
    fr: {
      title: "Découvrez les espaces de travail traduits",
      description:
        "Ce contenu est chargé côté serveur puis hydraté par la route.",
      searchLabel: "Rechercher des sujets",
      searchButton: "Rechercher",
      noResults: "Aucun sujet correspondant.",
      topics: [
        "Projets partagés",
        "Membres de l’équipe",
        "Activité de l’espace de travail",
      ],
    },
    ar: {
      title: "استكشف محتوى مساحة العمل المترجم",
      description: "يُحمّل هذا المحتوى على الخادم ثم تتم تهيئته في المسار.",
      searchLabel: "ابحث في المواضيع",
      searchButton: "بحث",
      noResults: "لا توجد مواضيع مطابقة.",
      topics: ["المشاريع المشتركة", "أعضاء الفريق", "نشاط مساحة العمل"],
    },
  }),
);

const MultilingualPage = () => {
  const { locale, direction, copy } = Route.useLoaderData();
  const { q } = Route.useSearch();
  const { availableLocales } = Route.useRouteContext();
  const navigate = useNavigate({ from: "/multilingual" });
  const query = q.trim().toLocaleLowerCase(locale);
  const topics = copy.topics.filter((topic) =>
    topic.toLocaleLowerCase(locale).includes(query),
  );

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("q") ?? "")
      .trim()
      .slice(0, 100);

    void navigate({
      search: (previous) => ({ ...previous, q: nextQuery }),
    });
  };

  return (
    <main lang={locale} dir={direction} data-testid="multilingual-page">
      <h1 data-testid="multilingual-title">{copy.title}</h1>
      <p data-testid="multilingual-description">{copy.description}</p>
      <nav aria-label="Available locales">
        {availableLocales.map(({ code, label }) => (
          <Link
            key={code}
            to="/multilingual"
            search={{ locale: code, q }}
            data-testid={`locale-link-${code}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <form role="search" onSubmit={submitSearch}>
        <label>
          {copy.searchLabel}
          <input
            data-testid="multilingual-search"
            key={q}
            name="q"
            type="search"
            defaultValue={q}
          />
        </label>
        <button data-testid="multilingual-submit" type="submit">
          {copy.searchButton}
        </button>
      </form>
      <ul aria-label="Localized topics" data-testid="multilingual-topics">
        {topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      {topics.length === 0 ? (
        <p data-testid="multilingual-no-results">{copy.noResults}</p>
      ) : null}
      <Link to="/">Back to home</Link>
    </main>
  );
};

export const Route = createFileRoute("/multilingual")({
  validateSearch: (search: Record<string, unknown>) => ({
    locale: isLocale(search.locale) ? search.locale : "en",
    q: typeof search.q === "string" ? search.q.slice(0, 100) : "",
  }),
  beforeLoad: () => ({ availableLocales: locales }),
  loaderDeps: ({ search }) => ({ locale: search.locale }),
  loader: async ({ deps, context }) => {
    const locale = context.availableLocales.find(
      ({ code }) => code === deps.locale,
    );

    if (!locale) {
      throw new Error(`Unsupported locale: ${deps.locale}`);
    }

    const copy = await getLocaleCopy();
    return {
      locale: locale.code,
      direction: locale.direction,
      copy: copy[locale.code],
    };
  },
  component: MultilingualPage,
});
