import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const readme = read("packages/ui/README.md");
const audit = read("docs/api-stability-audit.md");

const components = [
  {
    name: "SectionHeader",
    status: "Beta",
    page: "apps/site/content/docs/ui/layout/section-header.mdx",
  },
  {
    name: "Paper",
    status: "Stable",
    page: "apps/site/content/docs/ui/data-display/paper.mdx",
  },
  {
    name: "Skeleton",
    status: "Stable",
    page: "apps/site/content/docs/ui/data-display/skeleton.mdx",
  },
  {
    name: "Label",
    status: "Stable",
    page: "apps/site/content/docs/ui/forms/label.mdx",
  },
  {
    name: "Background",
    status: "Stable",
    page: "apps/site/content/docs/ui/layout/background.mdx",
  },
  {
    name: "Breadcrumbs",
    status: "Stable",
    page: "apps/site/content/docs/ui/layout/breadcrumbs.mdx",
  },
  {
    name: "Sidebar",
    status: "Stable",
    page: "apps/site/content/docs/ui/layout/sidebar.mdx",
  },
  {
    name: "Backdrop",
    status: "Stable",
    page: "apps/site/content/docs/ui/overlays/backdrop.mdx",
  },
];

const stableReadmeLabels =
  /Paper, Skeleton, Label, Background, Breadcrumbs, Sidebar, and Backdrop also have\s+Stable public APIs/;

if (!stableReadmeLabels.test(readme)) {
  throw new Error("UI README must classify the seven reviewed APIs as Stable.");
}

if (!readme.includes("`SectionHeader` is Beta")) {
  throw new Error("UI README must retain SectionHeader as Beta.");
}

for (const component of components) {
  const auditRow = audit
    .split("\n")
    .find((line) => line.startsWith(`| ${component.name} |`));
  const auditStatus = auditRow?.match(/\| (Experimental|Beta|Stable|Deprecated) \|/)?.[1];

  if (auditStatus !== component.status) {
    throw new Error(
      `${component.name}: API stability audit says ${auditStatus ?? "no status"}, expected ${component.status}.`,
    );
  }

  const page = read(component.page);
  if (!page.includes(`API maturity: ${component.status}`)) {
    throw new Error(
      `${component.name}: component documentation must declare ${component.status} maturity.`,
    );
  }
}

const inventorySummary =
  /137 APIs: 136 Stable and `SectionHeader` Beta/.test(audit);

if (!inventorySummary) {
  throw new Error("API stability audit must summarize all 137 component APIs.");
}

console.log("Validated stability labels for 8 UI APIs across package, audit, and component documentation.");
