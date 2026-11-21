export const ecosystem = [
  {
    name: "Core utilities",
    href: "/docs/core",
    description:
      "Framework-independent TypeScript helpers for responsive values, formatting, rendering, and resources.",
  },
  {
    name: "UI components",
    href: "/docs/ui",
    description: "Composable React components with typed props and examples.",
  },
  {
    name: "Theme and design tokens",
    href: "/docs/theme",
    description: "Theme provider, semantic tokens, colors, and typography.",
  },
  {
    name: "React hooks",
    href: "/docs/hooks",
    description: "Keyboard shortcuts and roving-focus utilities.",
  },
  {
    name: "Icons",
    href: "/docs/icons",
    description: "Iconify-backed React SVG icons and styling guidance.",
  },
  {
    name: "Pieces",
    href: "/docs/pieces",
    description: "Composable hero sections and presets for page introductions.",
  },
  {
    name: "SEO",
    href: "/docs/seo",
    description: "Metadata, structured data, sitemaps, and robots utilities.",
  },
  {
    name: "Authentication",
    href: "/docs/auth",
    description:
      "Framework-independent account, session, MFA, and lifecycle primitives.",
  },
  {
    name: "Session management",
    href: "/docs/session",
    description:
      "Create, validate, rotate, and revoke secure server-side sessions.",
  },
  {
    name: "Fullstack",
    href: "/docs/fullstack",
    description:
      "Browser auth clients, React UI, server handlers, and framework adapters.",
  },
  {
    name: "Storage",
    href: "/docs/storage",
    description:
      "Vendor-neutral persistence contracts, testing, and database adapters.",
  },
  {
    name: "Project scaffolding",
    href: "/docs/create",
    description: "Generate a React application configured for Puzzle.",
  },
  {
    name: "Multilingual (pre-release)",
    href: "/docs/multilingual",
    description:
      "Type-safe translations and locale-aware paths; this package is in development and not yet published.",
  },
  {
    name: "Developer tools",
    href: "/docs/developer",
    description:
      "Explore project setup, theme tooling, testing, and contribution guides.",
  },
] as const;

export const aiReadiness = {
  eyebrow: "AI-READY DEVELOPMENT",
  title: {
    firstLine: "Built for developers.",
    secondLine: "Ready for AI.",
  },
  description:
    "Puzzle is a TypeScript-first React design system for developers using AI coding agents. Its CLI reads guidance published with the Puzzle packages in your project, giving agents context for documented APIs and patterns. Keep your preferred agent; Puzzle provides context, not a replacement.",
} as const;

export const aiReadinessPackages = [
  "@puzzle-ui/ui",
  "@puzzle-ui/theme",
  "@puzzle-ui/pieces",
] as const;

export const aiReadinessAgents = [
  "GitHub Copilot",
  "Claude Code",
  "Cursor",
  "AGENTS.md-compatible agents",
] as const;

export const aiReadinessFeatures = [
  {
    id: "package-aware",
    title: "Package-aware AI instructions",
    description:
      "The CLI reads published guidance for your installed Puzzle dependencies, so agents get package-specific API context without one-size-fits-all prompts.",
  },
  {
    id: "your-agent",
    title: "Your favorite coding agent",
    description:
      "Choose GitHub Copilot, Claude Code, Cursor, or AGENTS.md-compatible agents. Keep using the tools you already prefer.",
  },
  {
    id: "always-in-sync",
    title: "Always in sync",
    description:
      "Run create-puzzle ai update after package changes; create-puzzle ai check verifies instructions against installed packages.",
  },
  {
    id: "local",
    title: "Local and developer-controlled",
    description:
      "Generated files stay in your project. Init, update, and check read installed guidance locally without calling remote AI or Puzzle services.",
  },
] as const;

export const aiReadinessCommands = [
  "npx @puzzle-ui/create ai init",
  "create-puzzle ai update",
  "create-puzzle ai check",
] as const;

export const aiReadinessLinks = [
  {
    label: "Explore AI Integration",
    href: "/docs/create/ai-integration",
  },
  {
    label: "Get started with Puzzle",
    href: "/docs/getting-started",
  },
  {
    label: "Explore the project generator",
    href: "/docs/create",
  },
] as const;

export const aiReadinessFaqs = [
  {
    id: "ai-coding-agents",
    question: "Can I use AI coding agents with Puzzle?",
    answer:
      "Yes. Puzzle provides package-aware consumer instructions for GitHub Copilot, Claude Code, Cursor, and AGENTS.md-compatible coding agents. The guidance is distributed with Puzzle packages and can be installed, updated, and checked using the Puzzle CLI. It gives your agent context about the packages and documented APIs available in your project.",
    link: {
      label: "Read the AI Integration guide",
      href: "/docs/create/ai-integration",
    },
  },
  {
    id: "ai-coding-assistant",
    question: "Do I need a specific AI coding assistant?",
    answer:
      "No. Choose any of the supported integrations and continue using your preferred coding agent. Puzzle provides the guidance; you choose the tools.",
  },
] as const;
