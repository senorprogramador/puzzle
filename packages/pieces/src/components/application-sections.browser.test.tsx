import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { ActivitySection } from "./activity";
import { DashboardOverviewSection } from "./dashboard";
import { EmptyStateSection } from "./data-display";
import { OnboardingSection } from "./onboarding";
import { SettingsGroup, SettingsSection } from "./settings";

it("keeps section layouts responsive without horizontal page overflow", async () => {
  const { container } = render(
    <div>
      <DashboardOverviewSection
        title="Overview"
        variant="split"
        summary={<p>Summary</p>}
        metrics={<div>Metrics</div>}
        charts={<div>Chart slot</div>}
      />
      <OnboardingSection
        title="Setup"
        variant="horizontal"
        steps={[
          { id: "first", title: "First step" },
          { id: "second", title: "Second step" },
        ]}
      />
      <EmptyStateSection title="No results" variant="full-page" />
      <ActivitySection
        title="Recent activity"
        variant="horizontal"
        items={[{ id: "event-1", action: "updated a report", timestamp: "Today" }]}
      />
      <SettingsSection
        title="Preferences"
        variant="sidebar"
        navigation={<a href="#profile">Profile</a>}
      >
        <SettingsGroup title="Profile">
          <p>Workspace settings</p>
        </SettingsGroup>
      </SettingsSection>
    </div>,
  );

  await page.viewport(375, 800);
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-dashboard-overview__body")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(1);
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-settings-section__layout")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(1);

  await page.viewport(1280, 800);
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-dashboard-overview__body")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(2);
  expect(
    getComputedStyle(
      container.querySelector(".puzzle-settings-section__layout")!,
    ).gridTemplateColumns.split(" "),
  ).toHaveLength(2);
});
