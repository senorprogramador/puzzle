import type {
  SeoValidationReport,
  SeoValidationIssue,
} from "../validation/types";

import type { SeoDiagnosticFormatOptions } from "./types";

const formatIssue = (
  issue: SeoValidationIssue,
  options: SeoDiagnosticFormatOptions,
): string => {
  const parts = [
    `[${issue.severity.toUpperCase()}]`,
    `[${issue.source}]`,
    issue.code,
    issue.message,
  ];

  if (options.includePaths !== false) {
    const location = issue.path ?? issue.nodeId;

    if (location) {
      parts.push(`Path: ${location}`);
    }
  }

  if (options.includeSuggestions !== false && issue.suggestion) {
    parts.push(`Suggestion: ${issue.suggestion}`);
  }

  if (issue.docsUrl) {
    parts.push(`Documentation: ${issue.docsUrl}`);
  }

  return parts.join(" — ");
};

export const formatSeoDiagnostics = (
  report: SeoValidationReport,
  options: SeoDiagnosticFormatOptions = {},
): string => {
  const lines = report.issues.map((issue) => formatIssue(issue, options));

  if (options.includeSummary !== false) {
    const { errors, warnings, infos, total } = report.summary;

    lines.push(
      "",
      `SEO validation: ${report.valid ? "PASSED" : "FAILED"}`,
      `Mode: ${report.mode}`,
      `Issues: ${total}`,
      `Errors: ${errors}`,
      `Warnings: ${warnings}`,
      `Info: ${infos}`,
    );
  }

  return lines.join("\n");
};
