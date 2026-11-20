import { createLocaleRegistry } from "@puzzle-ui/i18n";

export const localeRegistry = createLocaleRegistry({
  defaultLocale: "en",
  locales: [
    { locale: "en", name: "English", direction: "ltr" },
    { locale: "fr", name: "Français", direction: "ltr" },
    { locale: "ar", name: "العربية", direction: "rtl" },
  ],
});

export type Locale = (typeof localeRegistry.locales)[number]["locale"];

export interface LocaleCopy {
  title: string;
  description: string;
  searchLabel: string;
  searchButton: string;
  topicsLabel: string;
  noResults: string;
  noteLabel: string;
  saveNote: string;
  noteSaved: string;
  topics: readonly string[];
}

export const localeCopy: Readonly<Record<Locale, LocaleCopy>> = {
  en: {
    title: "Explore localized workspace content",
    description: "Loader data is rendered on the server and hydrated in the browser.",
    searchLabel: "Search topics",
    searchButton: "Search",
    topicsLabel: "Localized topics",
    noResults: "No matching topics.",
    noteLabel: "Your note",
    saveNote: "Save note",
    noteSaved: "Your note was saved.",
    topics: ["Shared projects", "Team members", "Workspace activity"],
  },
  fr: {
    title: "Découvrez les espaces de travail traduits",
    description: "Les données chargées sont rendues sur le serveur puis hydratées dans le navigateur.",
    searchLabel: "Rechercher des sujets",
    searchButton: "Rechercher",
    topicsLabel: "Sujets traduits",
    noResults: "Aucun sujet correspondant.",
    noteLabel: "Votre note",
    saveNote: "Enregistrer la note",
    noteSaved: "Votre note a été enregistrée.",
    topics: [
      "Projets partagés",
      "Membres de l’équipe",
      "Activité de l’espace de travail",
    ],
  },
  ar: {
    title: "استكشف محتوى مساحة العمل المترجم",
    description: "تُعرض البيانات المحمّلة على الخادم ثم تُهيّأ في المتصفح.",
    searchLabel: "ابحث في المواضيع",
    searchButton: "بحث",
    topicsLabel: "مواضيع مترجمة",
    noResults: "لا توجد مواضيع مطابقة.",
    noteLabel: "ملاحظتك",
    saveNote: "حفظ الملاحظة",
    noteSaved: "تم حفظ ملاحظتك.",
    topics: ["المشاريع المشتركة", "أعضاء الفريق", "نشاط مساحة العمل"],
  },
};

export const localeOptions = localeRegistry.locales.map((locale) => ({
  code: locale.locale,
  label: locale.name ?? locale.locale,
}));
