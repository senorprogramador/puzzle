import { createI18n } from "@puzzle-ui/i18n";

import { localeDefinitions } from "./locales";

export const i18n = createI18n({
  locales: localeDefinitions,
  defaultLocale: "en",
  catalogs: {
    en: {
      metadata: {
        title: "Puzzle i18n with the Next.js App Router",
        description:
          "A working example of localized server and client components in Next.js.",
      },
      page: {
        title: "Next.js App Router integration",
        server: "This message was translated in a Server Component.",
        client: "This message was translated in a Client Component.",
      },
      request: {
        title: "Request locale resolution",
        explanation: "Resolved from this request's locale preferences.",
      },
      stream: {
        title: "Localized streaming",
        shell: "This localized shell is ready before the streamed content.",
        content: "The localized Server Component finished streaming.",
      },
    },
    fr: {
      metadata: {
        title: "Puzzle i18n avec le routeur App de Next.js",
        description:
          "Un exemple fonctionnel de composants serveur et client localisés dans Next.js.",
      },
      page: {
        title: "Intégration du routeur App de Next.js",
        server: "Ce message a été traduit dans un composant serveur.",
        client: "Ce message a été traduit dans un composant client.",
      },
      request: {
        title: "Résolution de la langue de la requête",
        explanation: "Déduite des préférences linguistiques de la requête.",
      },
      stream: {
        title: "Diffusion localisée",
        shell: "Cette interface localisée est prête avant le contenu diffusé.",
        content: "Le composant serveur localisé a terminé sa diffusion.",
      },
    },
  },
});
