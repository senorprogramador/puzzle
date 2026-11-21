import type { TreeViewItem } from "./types";

const folder = "/docs/theme" as const;

const theme: TreeViewItem = {
  id: "theme",
  label: "Theme",
  children: [
    {
      id: "theme-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "theme-provider",
      label: "Theme Provider",
      href: `${folder}/theme-provider`,
    },
    {
      id: "theme-tokens",
      label: "Design Tokens",
      href: `${folder}/tokens`,
    },
    {
      id: "theme-colors",
      label: "Colors",
      href: `${folder}/colors`,
    },
    {
      id: "theme-typography",
      label: "Typography & Fonts",
      href: `${folder}/typography`,
    },
    {
      id: "theme-cli",
      label: "CLI",
      href: `${folder}/cli`,
    },
    {
      id: "theme-breakpoints",
      label: "Breakpoints",
      href: `${folder}/breakpoints`,
    },
    {
      id: "theme-components",
      label: "Component Overrides",
      href: `${folder}/components`,
    },
  ],
} as const;

const hooksFolder = "/docs/hooks";
const hooks: TreeViewItem = {
  id: "hooks",
  label: "Hooks",
  children: [
    { id: "hooks-overview", label: "Overview", href: hooksFolder },
    {
      id: "hooks-use-keyboard-keys",
      label: "Keyboard Keys",
      href: `${hooksFolder}/use-keyboard-keys`,
    },
    {
      id: "hooks-use-roving-focus",
      label: "Roving Focus",
      href: `${hooksFolder}/use-roving-focus`,
    },
    {
      id: "hooks-use-list-filter",
      label: "List Filter",
      href: `${hooksFolder}/use-list-filter`,
    },
    {
      id: "hooks-use-reduced-motion",
      label: "Reduced Motion",
      href: `${hooksFolder}/use-reduced-motion`,
    },
    {
      id: "hooks-use-color-scheme",
      label: "Color Scheme",
      href: `${hooksFolder}/use-color-scheme`,
    },
    {
      id: "hooks-use-async-action",
      label: "Async Action",
      href: `${hooksFolder}/use-async-action`,
    },
    {
      id: "hooks-use-resource-prefetch",
      label: "Resource Prefetch",
      href: `${hooksFolder}/use-resource-prefetch`,
    },
    {
      id: "hooks-use-fold",
      label: "Fold and Visibility",
      href: `${hooksFolder}/use-fold`,
    },
  ],
};

export const foundations: TreeViewItem = {
  id: "foundations",
  label: "Foundations",
  children: [
    { id: "core", label: "Core Utilities", href: "/docs/core" },
    { id: "commerce", label: "Commerce and Payments", href: "/docs/commerce" },
    {
      id: "payment-providers",
      label: "Payment Providers",
      href: "/docs/payment-providers",
    },
    theme,
    { id: "icons", label: "Icons", href: "/docs/icons" },
    hooks,
  ],
};
