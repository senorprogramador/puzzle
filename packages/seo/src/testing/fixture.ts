import { buildSeoGraph } from "../core";

import type { SeoGraph } from "../core";

import { validateSeo } from "../validation";

import type { SeoValidationIssue, SeoValidationReport } from "../validation";

import type { SeoTestFixture, SeoTestOptions, SeoTestResult } from "./types";

import { formatSeoDiagnostics } from "./diagnostics";

const getBaseUrl = (fixture: SeoTestFixture): string =>
  String(fixture.config.siteUrl);

const resolveFixtureGraph = (fixture: SeoTestFixture): SeoGraph => {
  if (fixture.graph) {
    return fixture.graph;
  }

  return buildSeoGraph(fixture.nodes ?? [], {
    baseUrl: getBaseUrl(fixture),
  });
};

export const createSeoTestFixture = (
  fixture: SeoTestFixture,
): SeoTestFixture => {
  if (fixture.graph && fixture.nodes) {
    throw new Error(
      "Provide either graph or nodes when creating an SEO test fixture, not both.",
    );
  }

  if (!fixture.config?.siteUrl) {
    throw new Error("SEO test fixtures require a valid siteUrl.");
  }

  const graph = resolveFixtureGraph(fixture);

  return {
    config: fixture.config,
    graph,
    metadata: fixture.metadata,
  };
};

const filterIssues = (
  report: SeoValidationReport,
  options: SeoTestOptions,
): SeoValidationIssue[] => {
  return report.issues.filter((issue) => {
    if (options.validateSchema === false && issue.source === "schema") {
      return false;
    }

    if (options.validateMetadata === false && issue.source === "metadata") {
      return false;
    }

    if (
      options.validateReferences === false &&
      issue.code === "unresolved-reference"
    ) {
      return false;
    }

    return true;
  });
};

const createFilteredReport = (
  report: SeoValidationReport,
  issues: SeoValidationIssue[],
): SeoValidationReport => {
  const summary = {
    errors: 0,
    warnings: 0,
    infos: 0,
    total: issues.length,
  };

  for (const issue of issues) {
    switch (issue.severity) {
      case "error":
        summary.errors += 1;
        break;
      case "warning":
        summary.warnings += 1;
        break;
      case "info":
        summary.infos += 1;
        break;
    }
  }

  return {
    ...report,
    valid: summary.errors === 0,
    issues,
    summary,
  };
};

export const runSeoTest = (
  fixture: SeoTestFixture,
  options: SeoTestOptions = {},
): SeoTestResult => {
  const graph = resolveFixtureGraph(fixture);

  const report = validateSeo(
    {
      graph,
      metadata:
        options.validateMetadata === false ? undefined : fixture.metadata,
    },
    {
      mode: options.strict ? "strict" : "warn",
      baseUrl: getBaseUrl(fixture),
    },
  );

  const filteredIssues = filterIssues(report, options);
  const filteredReport = createFilteredReport(report, filteredIssues);

  const errors = filteredIssues
    .filter((issue) => issue.severity === "error")
    .map((issue) => issue.message);

  const warnings = filteredIssues
    .filter((issue) => issue.severity === "warning")
    .map((issue) => issue.message);

  return {
    passed: filteredReport.valid,
    errors,
    warnings,
    report: filteredReport,
  };
};

export const assertSeoTest = (
  fixture: SeoTestFixture,
  options: SeoTestOptions = {},
): SeoTestResult => {
  const result = runSeoTest(fixture, options);

  if (!result.passed) {
    throw new Error(formatSeoDiagnostics(result.report));
  }

  return result;
};
