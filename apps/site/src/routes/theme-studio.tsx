import { createFileRoute } from "@tanstack/react-router";

import { ThemeStudio } from "@/components/theme-studio/theme-studio";
import { createSeoHead, getCanonicalUrl } from "@/lib/seo";

const canonical = getCanonicalUrl("/theme-studio");

export const Route = createFileRoute("/theme-studio")({
  component: ThemeStudio,
  head: () =>
    createSeoHead({
      title: "Theme Studio",
      description:
        "Explore Puzzle's built-in color themes across five website styles and customize the live preview.",
      canonical,
      locale: "en-US",
      openGraph: {
        type: "website",
        url: canonical,
      },
    }),
});
