import type { TreeViewItem } from "./types";
import { fullstack } from "./fullstack";
import { multilingual } from "./multilingual";
import { seo } from "./seo";

const folder = "/docs/create" as const;

const create: TreeViewItem = {
  id: "create",
  label: "Create",
  children: [
    {
      id: "create-overview",
      label: "Overview",
      href: folder,
    },
    {
      id: "create-configuration",
      label: "Automated Configuration",
      href: `${folder}/configuration`,
    },
    {
      id: "create-ai-integration",
      label: "AI Instructions",
      href: `${folder}/ai-integration`,
    },
    {
      id: "create-deployment",
      label: "Deployment",
      href: `${folder}/deployment`,
    },
  ],
} as const;

const authFolder = "/docs/auth";
const auth: TreeViewItem = {
  id: "auth",
  label: "Authentication",
  children: [
    { id: "auth-overview", label: "Overview", href: authFolder },
    {
      id: "auth-configuration",
      label: "Configuration",
      href: `${authFolder}/configuration`,
    },
    {
      id: "auth-lifecycle",
      label: "Account Lifecycle",
      href: `${authFolder}/lifecycle`,
    },
    {
      id: "auth-mfa",
      label: "MFA & Step-Up",
      href: `${authFolder}/mfa`,
    },
    {
      id: "auth-security",
      label: "Security",
      href: `${authFolder}/security`,
    },
    {
      id: "auth-observability",
      label: "Observability",
      href: "/docs/observability",
    },
  ],
};

export const applicationDevelopment: TreeViewItem = {
  id: "application-development",
  label: "Application Development",
  children: [
    create,
    multilingual,
    seo,
    auth,
    { id: "session", label: "Session Management", href: "/docs/session" },
    fullstack,
    { id: "storage", label: "Storage", href: "/docs/storage" },
    { id: "cms", label: "CMS", href: "/docs/cms" },
    { id: "media", label: "Media", href: "/docs/media" },
    {
      id: "media-cloudflare",
      label: "Cloudflare Media",
      href: "/docs/media-cloudflare",
    },
  ],
};
