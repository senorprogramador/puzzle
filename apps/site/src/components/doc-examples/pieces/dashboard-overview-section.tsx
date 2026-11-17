import { useState } from "react";
import {
  DashboardOverviewSection,
  DashboardStatCard,
  DashboardStatGroup,
} from "@puzzle-ui/pieces";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@puzzle-ui/ui";

export const DashboardOverviewStatesExample = () => {
  const [state, setState] = useState<"ready" | "loading" | "error">("ready");
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
        dateRange={<Button variant="outline">Last 30 days</Button>}
        actions={<Button>Create a project</Button>}
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
