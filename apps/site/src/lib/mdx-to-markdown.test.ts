import { describe, expect, it } from "bun:test";

import { SITE_URL } from "./seo";
import { extractMdxToMarkdown } from "./mdx-to-markdown";

const exampleMdx = [
  "---",
  "title: Example guide",
  "description: A guide used to test the MDX exporter.",
  "---",
  "",
  "# Example guide",
  "",
  "<Callout type=\"info\" title=\"Important\">",
  "Use <code>TypeScript</code> for this example.",
  "</Callout>",
  "",
  "<PackageManagerTabs>",
  "  <PackageManagerTab value=\"bun\">",
  "",
  "```bash",
  "bun add @puzzle-ui/ui",
  "```",
  "",
  "  </PackageManagerTab>",
  "</PackageManagerTabs>",
  "",
  "[Storage records](/docs/storage#records)",
  "",
  "<Preview><Button>Try the button</Button></Preview>",
  "",
  "| Package | Purpose |",
  "| --- | --- |",
  "| UI | Components |",
].join("\n");

describe("MDX to Markdown extraction", () => {
  it("keeps structure, code and links while removing MDX-only syntax", () => {
    const markdown = extractMdxToMarkdown(
      exampleMdx,
      `${SITE_URL}/docs/example`,
    );

    expect(markdown).toContain("# Example guide");
    expect(markdown).toContain("**Important**");
    expect(markdown).toContain("`TypeScript`");
    expect(markdown).toContain("#### bun");
    expect(markdown).toContain("bun add @puzzle-ui/ui");
    expect(markdown).toContain(
      `${SITE_URL}/docs/storage#records`,
    );
    expect(markdown).toContain("Try the button");
    expect(markdown).toContain("| Package | Purpose");
    expect(markdown).not.toContain("title: Example guide");
    expect(markdown).not.toContain("<Callout");
    expect(markdown).not.toContain("<PackageManagerTab");
    expect(markdown).not.toContain("<Preview>");
    expect(markdown).not.toContain("import { Badge }");
  });

  it("is deterministic and handles an empty document", () => {
    const first = extractMdxToMarkdown(exampleMdx, `${SITE_URL}/docs/example`);

    expect(extractMdxToMarkdown(exampleMdx, `${SITE_URL}/docs/example`)).toBe(
      first,
    );
    expect(extractMdxToMarkdown("", `${SITE_URL}/docs/empty`)).toBe("");
  });
});
