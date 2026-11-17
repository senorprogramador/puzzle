import { TreeViewItem } from "@puzzle-ui/ui";

const folder = "/docs/pieces" as const;
//#region Components
const componentsFolder = `${folder}/components` as const;
const components: TreeViewItem = {
  id: "pieces-components",
  label: "Components",
  children: [
    {
      id: "pieces-marketing",
      label: "Marketing & Conversion",
      href: `${componentsFolder}/marketing`,
      children: [
        {
          id: "pieces-announcement",
          label: "Announcement",
          href: `${componentsFolder}/announcement`,
        },
        {
          id: "pieces-logo-cloud",
          label: "Logo Cloud",
          href: `${componentsFolder}/logo-cloud`,
        },
        {
          id: "pieces-features",
          label: "Features",
          href: `${componentsFolder}/features`,
        },
        {
          id: "pieces-benefits",
          label: "Benefits",
          href: `${componentsFolder}/benefits`,
        },
        {
          id: "pieces-stats",
          label: "Stats",
          href: `${componentsFolder}/stats`,
        },
        {
          id: "pieces-testimonials",
          label: "Testimonials",
          href: `${componentsFolder}/testimonials`,
        },
        {
          id: "pieces-cta",
          label: "CTA",
          href: `${componentsFolder}/cta`,
        },
        {
          id: "pieces-faq",
          label: "FAQ",
          href: `${componentsFolder}/faq`,
        },
        {
          id: "pieces-how-it-works",
          label: "How It Works",
          href: `${componentsFolder}/how-it-works`,
        },
        {
          id: "pieces-comparison",
          label: "Comparison",
          href: `${componentsFolder}/comparison`,
        },
      ],
    },
    {
      id: "pieces-hero",
      label: "Hero",
      href: `${componentsFolder}/hero`,
    },
    {
      id: "pieces-dashboard",
      label: "Dashboard",
      href: `${componentsFolder}/dashboard`,
    },
    {
      id: "pieces-dashboard-navigation",
      label: "Dashboard Navigation",
      href: `${componentsFolder}/navigation`,
    },
    {
      id: "pieces-project",
      label: "Project",
      href: `${componentsFolder}/project`,
    },
    {
      id: "pieces-data-display",
      label: "Data Display",
      href: `${componentsFolder}/data-display`,
    },
    {
      id: "pieces-settings",
      label: "Settings",
      href: `${componentsFolder}/settings`,
    },
    {
      id: "pieces-feedback",
      label: "Feedback",
      href: `${componentsFolder}/feedback`,
    },
  ],
};
//#endregion

export const pieces: TreeViewItem = {
  id: "pieces",
  label: "Page Sections",
  children: [
    {
      id: "pieces-overview",
      label: "Overview",
      href: folder,
    },
    components,
  ],
} as const;
