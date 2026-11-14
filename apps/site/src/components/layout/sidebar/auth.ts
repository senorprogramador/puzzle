import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/auth" as const;

export const auth: TreeViewItem = {
  id: "auth",
  label: "Auth",
  children: [
    {
      id: "auth-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "auth-configuration",
      label: "Configuration",
      href: `${folder}/configuration`,
    },
    {
      id: "auth-lifecycle",
      label: "Account Lifecycle",
      href: `${folder}/lifecycle`,
    },
    {
      id: "auth-mfa",
      label: "MFA & Step-Up",
      href: `${folder}/mfa`,
    },
    {
      id: "auth-security",
      label: "Security",
      href: `${folder}/security`,
    },
  ],
} as const;
