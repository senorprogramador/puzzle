import { normalizeSeoUrl } from "../urls";

import type {
  RobotsOptions,
  RobotsRule,
  RobotsResult,
  RobotsValidationIssue,
} from "./types";

const validateRule = (
  rule: RobotsRule,
  index: number,
): RobotsValidationIssue[] => {
  const issues: RobotsValidationIssue[] = [];

  const agents = Array.isArray(rule.userAgent)
    ? rule.userAgent
    : [rule.userAgent];

  if (
    agents.length === 0 ||
    agents.some((agent) => !agent.trim() || /[\r\n]/.test(agent))
  ) {
    issues.push({
      code: "INVALID_USER_AGENT",
      message:
        "Every robots rule requires a non-empty user-agent without newlines.",
      path: `rules.${index}.userAgent`,
    });
  }

  if (
    rule.crawlDelay !== undefined &&
    (!Number.isFinite(rule.crawlDelay) || rule.crawlDelay < 0)
  ) {
    issues.push({
      code: "INVALID_CRAWL_DELAY",
      message: "Crawl-delay must be a non-negative number.",
      path: `rules.${index}.crawlDelay`,
    });
  }

  for (const [name, paths] of [
    ["allow", rule.allow],
    ["disallow", rule.disallow],
  ] as const) {
    if (!paths) {
      continue;
    }

    for (const path of paths) {
      if (!path.startsWith("/") || /[\r\n]/.test(path)) {
        issues.push({
          code: "INVALID_ROBOTS_PATH",
          message: `${name} paths must start with / and contain no newlines.`,
          path: `rules.${index}.${name}`,
        });
      }
    }
  }

  return issues;
};

export const validateRobotsOptions = (
  options: RobotsOptions,
): RobotsValidationIssue[] => {
  const issues: RobotsValidationIssue[] = [];

  if (!options.rules.length) {
    issues.push({
      code: "MISSING_RULES",
      message: "At least one robots rule is required.",
    });
  }

  options.rules.forEach((rule, index) => {
    issues.push(...validateRule(rule, index));
  });

  for (const sitemap of Array.isArray(options.sitemap)
    ? options.sitemap
    : options.sitemap
      ? [options.sitemap]
      : []) {
    try {
      normalizeSeoUrl(sitemap);
    } catch {
      issues.push({
        code: "INVALID_SITEMAP_URL",
        message: `Invalid sitemap URL: ${sitemap}.`,
      });
    }
  }

  if (options.host && /[\r\n]/.test(options.host)) {
    issues.push({
      code: "INVALID_HOST",
      message: "Robots host must not contain newlines.",
    });
  }

  return issues;
};

const serializeRule = (rule: RobotsRule): string[] => {
  const agents = Array.isArray(rule.userAgent)
    ? rule.userAgent
    : [rule.userAgent];

  const lines = agents.map((agent) => `User-agent: ${agent.trim()}`);

  for (const path of rule.allow ?? []) {
    lines.push(`Allow: ${path}`);
  }

  for (const path of rule.disallow ?? []) {
    lines.push(`Disallow: ${path}`);
  }

  if (rule.crawlDelay !== undefined) {
    lines.push(`Crawl-delay: ${rule.crawlDelay}`);
  }

  return lines;
};

export const serializeRobotsTxt = (options: RobotsOptions): string => {
  const issues = validateRobotsOptions(options);

  if (issues.length > 0) {
    throw new Error(
      `Invalid robots configuration: ${issues
        .map((issue) => issue.message)
        .join(" ")}`,
    );
  }

  const groups = options.rules.map(serializeRule);

  const lines: string[] = [];

  groups.forEach((group, index) => {
    if (index > 0) {
      lines.push("");
    }

    lines.push(...group);
  });

  const sitemaps = [
    ...new Set(
      (Array.isArray(options.sitemap)
        ? options.sitemap
        : options.sitemap
          ? [options.sitemap]
          : []
      ).map((url) => normalizeSeoUrl(url)),
    ),
  ].sort();

  if (sitemaps.length > 0) {
    lines.push("");

    for (const sitemap of sitemaps) {
      lines.push(`Sitemap: ${sitemap}`);
    }
  }

  if (options.host) {
    lines.push(`Host: ${options.host}`);
  }

  return `${lines.join("\n")}\n`;
};

export const generateRobotsTxt = (options: RobotsOptions): RobotsResult => {
  const issues = validateRobotsOptions(options);

  if (issues.length > 0) {
    return {
      content: "",
      issues,
    };
  }

  return {
    content: serializeRobotsTxt(options),
    issues: [],
  };
};
