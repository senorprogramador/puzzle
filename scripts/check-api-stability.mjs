import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const readme = read("packages/ui/README.md");
const audit = read("docs/api-stability-audit.md");
const piecesReadme = read("packages/pieces/README.md");
const piecesInstructions = read("packages/pieces/ai/instructions.md");
const piecesRegistry = JSON.parse(read("docs/ai/registry/generated/pieces.json"));

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
  /250 APIs: 249 Stable and `SectionHeader` Beta/.test(audit);

if (!inventorySummary) {
  throw new Error("API stability audit must summarize all 244 component APIs.");
}

if (piecesRegistry.components.length !== 132) {
  throw new Error(
    `Expected 132 canonical Pieces components, found ${piecesRegistry.components.length}. Update the stability audit.`,
  );
}

if (
  !piecesReadme.includes(
    "All 132 canonical component APIs and their published aliases are **Stable**.",
  )
) {
  throw new Error("Pieces README must classify all canonical component APIs as Stable.");
}

if (
  !piecesInstructions.includes(
    "All canonical public component APIs and published aliases are Stable",
  )
) {
  throw new Error("Pieces AI instructions must classify its public component APIs as Stable.");
}

for (const component of piecesRegistry.components) {
  const auditRow = audit
    .split("\n")
    .find((line) => line.startsWith(`| ${component.name} |`));
  const auditStatus = auditRow?.match(/\| (Experimental|Beta|Stable|Deprecated) \|/)?.[1];
  if (auditStatus !== "Stable") {
    throw new Error(
      `${component.name}: API stability audit says ${auditStatus ?? "no status"}, expected Stable.`,
    );
  }

  const page = read(component.documentation);
  if (!page.includes("API maturity: Stable")) {
    throw new Error(
      `${component.name}: component documentation must declare Stable maturity.`,
    );
  }
}

const piecesInventorySummary = /250 APIs: 249 Stable and `SectionHeader` Beta/.test(audit);
if (!piecesInventorySummary) {
  throw new Error("API stability audit must summarize the complete UI and Pieces component inventory.");
}

console.log(
  `Validated stability labels for 8 UI APIs and ${piecesRegistry.components.length} Pieces APIs across package, audit, and component documentation.`,
);
