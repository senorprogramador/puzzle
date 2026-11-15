import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";

import { getCanonicalUrl, SITE_URL } from "@/lib/seo";

interface MdxAttribute {
  name?: string;
  value?: unknown;
}

interface MarkdownNode {
  type: string;
  children?: MarkdownNode[];
  value?: string;
  url?: string;
  title?: string;
  depth?: number;
  ordered?: boolean;
  start?: number;
  lang?: string;
  meta?: string;
  alt?: string;
  checked?: boolean;
  spread?: boolean;
  identifier?: string;
  label?: string;
  align?: Array<string | null>;
}

const processor = remark().use(remarkGfm).use(remarkMdx);
const siteOrigin = new URL(SITE_URL).origin;
const copiedFields = [
  "value",
  "url",
  "title",
  "depth",
  "ordered",
  "start",
  "lang",
  "meta",
  "alt",
  "checked",
  "spread",
  "identifier",
  "label",
] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getAttribute = (
  node: Record<string, unknown>,
  name: string,
): string | undefined => {
  if (!Array.isArray(node.attributes)) {
    return undefined;
  }

  const attribute = node.attributes.find(
    (item): item is MdxAttribute =>
      isRecord(item) &&
      typeof item.name === "string" &&
      item.name === name,
  );

  return typeof attribute?.value === "string" ? attribute.value : undefined;
};

const textContent = (nodes: readonly MarkdownNode[]): string =>
  nodes
    .map((node) => {
      if (typeof node.value === "string") {
        return node.value;
      }

      return node.children ? textContent(node.children) : "";
    })
    .join("");

const canonicalizeLink = (href: string, pageUrl: string): string => {
  let target: URL;

  try {
    target = new URL(href, pageUrl);
  } catch {
    throw new Error(`Invalid documentation link: ${href}`);
  }

  if (target.origin !== siteOrigin) {
    return href;
  }

  return `${getCanonicalUrl(target.pathname)}${target.search}${target.hash}`;
};

const stripFrontmatter = (content: string): string => {
  const lines = content.split("\n");
  const cleanLine = (line: string) =>
    line.endsWith("\r") ? line.slice(0, -1) : line;

  if (cleanLine(lines[0] ?? "").trim() !== "---") {
    return content;
  }

  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && cleanLine(line).trim() === "---",
  );

  if (closingIndex < 0) {
    throw new Error("Documentation frontmatter is missing its closing delimiter.");
  }

  return lines.slice(closingIndex + 1).join("\n");
};

const normalizeNode = (input: unknown, pageUrl: string): MarkdownNode[] => {
  if (!isRecord(input) || typeof input.type !== "string") {
    throw new Error("MDX parser returned an invalid syntax tree node.");
  }

  const type = input.type;
  const children = Array.isArray(input.children)
    ? input.children.flatMap((child) => normalizeNode(child, pageUrl))
    : [];

  if (
    type === "mdxjsEsm" ||
    type === "mdxFlowExpression" ||
    type === "mdxTextExpression"
  ) {
    return [];
  }

  if (type === "mdxJsxFlowElement" || type === "mdxJsxTextElement") {
    const name = typeof input.name === "string" ? input.name : "";

    if (name === "code" && type === "mdxJsxTextElement") {
      return [
        {
          type: "inlineCode",
          value: textContent(children),
        },
      ];
    }

    if (name === "a") {
      const href = getAttribute(input, "href");

      if (href) {
        return [
          {
            type: "link",
            url: canonicalizeLink(href, pageUrl),
            children,
          },
        ];
      }
    }

    if (name === "img") {
      const src = getAttribute(input, "src");

      if (src) {
        const alt = getAttribute(input, "alt");
        const title = getAttribute(input, "title");

        return [
          {
            type: "image",
            url: canonicalizeLink(src, pageUrl),
            alt: alt ?? "",
            ...(title ? { title } : {}),
          },
        ];
      }
    }

    if (name === "br") {
      return [{ type: "break" }];
    }

    const title = getAttribute(input, "title");
    const value = getAttribute(input, "value");

    if (name === "Callout" && title) {
      return [
        {
          type: "paragraph",
          children: [
            {
              type: "strong",
              children: [{ type: "text", value: title }],
            },
          ],
        },
        ...children,
      ];
    }

    if (name.endsWith("Tab") && value) {
      return [
        {
          type: "heading",
          depth: 4,
          children: [{ type: "text", value }],
        },
        ...children,
      ];
    }

    return children;
  }

  const node: MarkdownNode = { type };

  for (const field of copiedFields) {
    const value = input[field];

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      Object.assign(node, { [field]: value });
    }
  }

  if (
    Array.isArray(input.align) &&
    input.align.every((value) => typeof value === "string" || value === null)
  ) {
    node.align = input.align;
  }

  if (children.length > 0 || Array.isArray(input.children)) {
    node.children = children;
  }

  if (type === "link" && node.url) {
    node.url = canonicalizeLink(node.url, pageUrl);
  }

  if (type === "image" && node.url) {
    node.url = canonicalizeLink(node.url, pageUrl);
  }

  return [node];
};

export const extractMdxToMarkdown = (
  content: string,
  pageUrl: string,
): string => {
  const canonicalPageUrl = getCanonicalUrl(pageUrl);
  const tree = processor.parse(stripFrontmatter(content));
  const normalizedTree = normalizeNode(tree, canonicalPageUrl)[0];

  if (!normalizedTree) {
    return "";
  }

  return processor
    .stringify(normalizedTree as typeof tree)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
