import { describe, expect, it } from "bun:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { HomeAiReadiness } from "../components/home-ai-readiness";
import {
  aiReadiness,
  aiReadinessAgents,
  aiReadinessCommands,
  aiReadinessFaqs,
  aiReadinessFeatures,
  aiReadinessLinks,
  aiReadinessPackages,
  ecosystem,
} from "./homepage";

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/", import.meta.url),
);

describe("homepage ecosystem", () => {
  it("links each unique, described ecosystem item to a documentation page", () => {
    const hrefs = ecosystem.map((item) => item.href);
    const names = ecosystem.map((item) => item.name);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(new Set(names).size).toBe(names.length);

    for (const item of ecosystem) {
      expect(item.description.trim().length).toBeGreaterThan(0);

      const slug = item.href.replace(/^\/docs\/?/, "");
      const page = resolve(docsDirectory, `${slug}.mdx`);
      const index = resolve(docsDirectory, slug, "index.mdx");

      expect(existsSync(page) || existsSync(index), item.href).toBe(true);
    }
  });

  it("lists authentication and Fullstack separately and includes Storage", () => {
    expect(ecosystem.find((item) => item.name === "Authentication")?.href).toBe(
      "/docs/auth",
    );
    expect(ecosystem.find((item) => item.name === "Fullstack")?.href).toBe(
      "/docs/fullstack",
    );
    expect(ecosystem.find((item) => item.name === "Storage")?.href).toBe(
      "/docs/storage",
    );
  });
});

describe("homepage AI readiness", () => {
  const markup = renderToStaticMarkup(createElement(HomeAiReadiness));

  it("server-renders a clear React design system and AI-readiness message", () => {
    expect(markup).toContain(aiReadiness.eyebrow);
    expect(markup).toContain(aiReadiness.title.firstLine);
    expect(markup).toContain(aiReadiness.title.secondLine);
    expect(markup).toContain("TypeScript-first React design system");
    expect(markup).toContain("AI coding agents");
    expect(markup).toContain("package-aware instructions");
    expect((markup.match(/<h3\b/g) ?? []).length).toBe(
      aiReadinessFeatures.length,
    );
  });

  it("shows installed package guidance and every supported agent", () => {
    for (const packageName of aiReadinessPackages) {
      expect(markup).toContain(packageName);
    }

    for (const agent of aiReadinessAgents) {
      expect(markup).toContain(agent);
    }

    expect(markup).toContain("Published package guidance");
    expect(markup).toContain("documented props");
  });

  it("uses only the implemented init, update, and check commands", () => {
    expect(aiReadinessCommands).toEqual([
      "npx @puzzle-ui/create ai init",
      "create-puzzle ai update",
      "create-puzzle ai check",
    ]);

    for (const command of aiReadinessCommands) {
      expect(markup).toContain(command);
    }

    expect(markup).toContain("may need network access");
    expect(markup).toContain("without calling remote AI or Puzzle services");
  });

  it("links to existing, descriptively named documentation pages", () => {
    expect(aiReadinessLinks[0]).toEqual({
      label: "Explore AI Integration",
      href: "/docs/create/ai-integration",
    });

    for (const link of aiReadinessLinks) {
      expect(link.label.trim().length).toBeGreaterThan(0);

      const slug = link.href.replace(/^\/docs\/?/, "");
      const page = resolve(docsDirectory, `${slug}.mdx`);
      const index = resolve(docsDirectory, slug, "index.mdx");

      expect(existsSync(page) || existsSync(index), link.href).toBe(true);
      expect(markup).toContain(`href="${link.href}"`);
      expect(markup).toContain(link.label);
    }
  });

  it("adds accurate homepage FAQ answers for agent support and choice", () => {
    expect(aiReadinessFaqs).toHaveLength(2);
    expect(aiReadinessFaqs[0]?.question).toBe(
      "Can I use AI coding agents with Puzzle?",
    );
    expect(aiReadinessFaqs[0]?.answer).toContain("GitHub Copilot");
    expect(aiReadinessFaqs[0]?.answer).toContain("Claude Code");
    expect(aiReadinessFaqs[0]?.answer).toContain("Cursor");
    expect(aiReadinessFaqs[0]?.answer).toContain("AGENTS.md-compatible");
    expect(aiReadinessFaqs[0]?.link.href).toBe("/docs/create/ai-integration");
    expect(aiReadinessFaqs[1]?.question).toBe(
      "Do I need a specific AI coding assistant?",
    );
    expect(aiReadinessFaqs[1]?.answer).toContain(
      "Puzzle provides the guidance",
    );
  });
});
