import { useState } from "react";
import {
  DashboardOverviewSection,
  DashboardStatCard,
  DashboardStatGroup,
  type DashboardOverviewSectionVariant,
} from "@puzzle-ui/pieces";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const overviewVariants: SectionVariantPreview<DashboardOverviewSectionVariant>[] =
  [
    { variant: "grid", useCase: "Arrange summary, metrics, and widgets in a flexible grid." },
    { variant: "cards", useCase: "Emphasize card-based dashboards." },
    { variant: "metrics", useCase: "Bring metric cards to the foreground." },
    { variant: "split", useCase: "Place charts alongside the primary metrics." },
    { variant: "compact", useCase: "Fit an overview into a dense admin page." },
    { variant: "analytics", useCase: "Pair metrics with application-provided charts." },
    { variant: "welcome", useCase: "Lead with a welcoming overview." },
    { variant: "activity", useCase: "Make recent team activity part of the overview." },
    { variant: "full-width", useCase: "Use the full available content width." },
    { variant: "executive", useCase: "Present a high-level leadership summary." },
  ];

export const DashboardOverviewSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="DashboardOverviewSection"
    variants={overviewVariants}
    buildCode={(variant) =>
      `<DashboardOverviewSection variant="${variant}" metrics={metricCards} charts={appChart} />`
    }
    renderVariant={(variant) => (
      <DashboardOverviewSection
        title="Northstar workspace overview"
        description="A clear view of this month's work."
        variant={variant}
        summary={<p>12 active projects across design, product, and marketing.</p>}
        metrics={
          <DashboardStatGroup label="Workspace metrics" columns={3}>
            <DashboardStatCard label="Projects" value="12" />
            <DashboardStatCard label="Tasks completed" value="126" />
            <DashboardStatCard label="Team capacity" value="84%" />
          </DashboardStatGroup>
        }
        charts={<p>Chart content is supplied by the application.</p>}
      >
        <p>Three launches are planned before month end.</p>
      </DashboardOverviewSection>
    )}
  />
);

export const DashboardOverviewStatesExample = () => {
  const [state, setState] = useState<"ready" | "loading" | "error">("ready");
  const [range, setRange] = useState("Last 30 days");
  const metrics = (
    <DashboardStatGroup label="Workspace metrics" columns={3}>
      <DashboardStatCard
        label="Active projects"
        value="12"
        trend={{ value: "+2", label: "this month", direction: "positive" }}
      />
      <DashboardStatCard
        label="Tasks completed"
        value="126"
        trend={{ value: "+12%", label: "this week", direction: "positive" }}
      />
      <DashboardStatCard
        label="Team capacity"
        value="84%"
        description="A healthy pace this month"
      />
    </DashboardStatGroup>
  );

  return (
    <div>
      <div role="group" aria-label="Dashboard data state">
        <Button
          variant={state === "ready" ? "primary" : "outline"}
          aria-pressed={state === "ready"}
          onClick={() => setState("ready")}
        >
          Ready
        </Button>
        <Button
          variant={state === "loading" ? "primary" : "outline"}
          aria-pressed={state === "loading"}
          onClick={() => setState("loading")}
        >
          Loading
        </Button>
        <Button
          variant={state === "error" ? "primary" : "outline"}
          aria-pressed={state === "error"}
          onClick={() => setState("error")}
        >
          Error
        </Button>
      </div>
      <DashboardOverviewSection
        title="Workspace overview"
        description="A clear view of the work moving forward this month."
        eyebrow="Northstar Studio"
        variant="analytics"
        dateRange={
          <Button
            variant="outline"
            onClick={() =>
              setRange((current) =>
                current === "Last 30 days" ? "This quarter" : "Last 30 days",
              )
            }
          >
            {range}
          </Button>
        }
        actions={
          <Button onClick={() => setState("loading")}>Reload dashboard</Button>
        }
        summary={<p>12 active projects across design, product, and marketing.</p>}
        metrics={metrics}
        charts={
          <Card>
            <CardHeader>
              <CardTitle>Monthly revenue</CardTitle>
            </CardHeader>
            <CardContent>
              The application can render its chart here; Pieces does not provide
              a chart engine.
            </CardContent>
          </Card>
        }
        loading={state === "loading"}
        error={state === "error" ? "Dashboard data could not be loaded." : undefined}
      />
    </div>
  );
};
