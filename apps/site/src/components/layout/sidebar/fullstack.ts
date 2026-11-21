import type { TreeViewItem } from "./types";

const folder = "/docs/fullstack" as const;

export const fullstack: TreeViewItem = {
  id: "fullstack",
  label: "Fullstack",
  children: [
    {
      id: "fullstack-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "fullstack-client",
      label: "Client & React",
      href: `${folder}/client`,
    },
    {
      id: "fullstack-server",
      label: "Server Handlers",
      href: `${folder}/server`,
    },
    {
      id: "fullstack-next",
      label: "Next.js Adapter",
      href: `${folder}/next`,
    },
    {
      id: "fullstack-tanstack",
      label: "TanStack Start Adapter",
      href: `${folder}/tanstack`,
    },
    {
      id: "fullstack-shared",
      label: "Shared Types",
      href: `${folder}/shared`,
    },
    {
      id: "fullstack-media",
      label: "Media API",
      href: `${folder}/media`,
    },
    {
      id: "fullstack-cms",
      label: "CMS API",
      href: `${folder}/cms`,
    },
  ],
} as const;
