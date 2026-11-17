import {
  CodeShowcaseSection,
  type CodeShowcaseVariant,
  type CodeSnippet,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const snippets: CodeSnippet[] = [
  {
    id: "typescript",
    title: "Load project data",
    language: "typescript",
    filename: "projects.ts",
    code: [
      'const response = await fetch("/api/projects");',
      "if (!response.ok) throw new Error(\"Request failed\");",
      "const projects = await response.json();",
    ].join("\n"),
    highlightedLines: [2],
  },
  {
    id: "shell",
    title: "Request project data",
    language: "bash",
    filename: "terminal",
    code: 'curl -H "Accept: application/json" /api/projects',
  },
];

const variants: SectionVariantPreview<CodeShowcaseVariant>[] = [
  { variant: "single", useCase: "Show one focused code sample." },
  { variant: "tabs", useCase: "Switch between named code examples." },
  { variant: "split", useCase: "Place snippets side by side when space allows." },
  { variant: "editor", useCase: "Frame code in a lightweight editor-style surface." },
  { variant: "terminal", useCase: "Give command-line examples a terminal treatment." },
  { variant: "multi-language", useCase: "Switch examples by their language label." },
  { variant: "numbered", useCase: "Show readable line numbers beside code." },
  { variant: "comparison", useCase: "Compare code snippets in aligned panels." },
  { variant: "installation", useCase: "Present setup commands as ordered steps." },
  { variant: "playground", useCase: "Edit plain text code in a native textarea." },
  { variant: "featured", useCase: "Emphasize one primary snippet and list supporting samples." },
  { variant: "compact", useCase: "Keep short snippets in a dense presentation." },
];

export const CodeShowcaseSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CodeShowcaseSection"
    variants={variants}
    buildCode={(variant) =>
      `<CodeShowcaseSection variant="${variant}" items={${variant === "single" ? "snippets.slice(0, 1)" : "snippets"}} />`
    }
    renderVariant={(variant) => (
      <CodeShowcaseSection
        variant={variant}
        eyebrow="Developer workflow"
        title="Keep implementation details easy to scan"
        description="Plain code text, optional line emphasis, accessible tabs, and a copy action without an editor dependency."
        items={variant === "single" ? snippets.slice(0, 1) : snippets}
      />
    )}
  />
);
