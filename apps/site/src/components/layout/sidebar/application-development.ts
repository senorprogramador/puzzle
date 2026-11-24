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

const cmsFolder = "/docs/cms" as const;
const cms: TreeViewItem = {
  id: "cms",
  label: "CMS",
  children: [
    { id: "cms-overview", label: "Overview", href: cmsFolder },
    {
      id: "cms-getting-started",
      label: "Getting Started",
      href: `${cmsFolder}/getting-started`,
    },
    {
      id: "cms-concepts",
      label: "Concepts",
      href: `${cmsFolder}/concepts`,
    },
    {
      id: "cms-blog",
      label: "Build a Blog",
      href: `${cmsFolder}/blog`,
    },
    {
      id: "cms-schema",
      label: "Collections & Fields",
      href: `${cmsFolder}/schema`,
    },
    {
      id: "cms-entries",
      label: "Entries & Queries",
      href: `${cmsFolder}/entries`,
    },
    {
      id: "cms-access",
      label: "Access Policies",
      href: `${cmsFolder}/access`,
    },
    {
      id: "cms-hooks",
      label: "Lifecycle Hooks",
      href: `${cmsFolder}/hooks`,
    },
    {
      id: "cms-lifecycle",
      label: "Drafts & Revisions",
      href: `${cmsFolder}/lifecycle`,
    },
    {
      id: "cms-multilingual",
      label: "Multilingual Content",
      href: `${cmsFolder}/multilingual`,
    },
    {
      id: "cms-scheduling",
      label: "Scheduled Publishing",
      href: `${cmsFolder}/scheduling`,
    },
    {
      id: "cms-preview",
      label: "Previewing Drafts",
      href: `${cmsFolder}/preview`,
    },
    {
      id: "cms-migrations",
      label: "Schema Migrations",
      href: `${cmsFolder}/migrations`,
    },
    {
      id: "cms-multi-tenancy",
      label: "Multi-tenant Setup",
      href: `${cmsFolder}/multi-tenancy`,
    },
    {
      id: "cms-custom-storage",
      label: "Custom Storage",
      href: `${cmsFolder}/custom-storage`,
    },
    {
      id: "cms-media-webhooks",
      label: "Media & Webhooks",
      href: `${cmsFolder}/media-webhooks`,
    },
    {
      id: "cms-nextjs",
      label: "Next.js Integration",
      href: `${cmsFolder}/nextjs`,
    },
    {
      id: "cms-tanstack-start",
      label: "TanStack Start Integration",
      href: `${cmsFolder}/tanstack-start`,
    },
    {
      id: "cms-reference",
      label: "API Reference",
      href: `${cmsFolder}/reference`,
    },
  ],
} as const;

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
    cms,
    { id: "media", label: "Media", href: "/docs/media" },
    {
      id: "media-cloudflare",
      label: "Cloudflare Media",
      href: "/docs/media-cloudflare",
    },
  ],
};
