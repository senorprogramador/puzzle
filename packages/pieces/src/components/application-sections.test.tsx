import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ActivitySection } from "./activity";
import { DashboardOverviewSection } from "./dashboard";
import { EmptyStateSection } from "./data-display";
import { OnboardingSection } from "./onboarding";
import { SettingsSection } from "./settings";

describe("application sections", () => {
  it("supports server rendering for all five section families", () => {
    const markup = renderToString(
      <>
        <DashboardOverviewSection title="Overview" summary="Ready" />
        <OnboardingSection
          title="Setup"
          steps={[{ id: "profile", title: "Complete your profile" }]}
        />
        <EmptyStateSection title="No reports" variant="search" />
        <ActivitySection
          items={[{ id: "event-1", action: "updated a report", timestamp: "Today" }]}
        />
        <SettingsSection title="Preferences">
          <p>Settings content</p>
        </SettingsSection>
      </>,
    );

    expect(markup).toContain("Overview");
    expect(markup).toContain("Complete your profile");
    expect(markup).toContain("No reports");
    expect(markup).toContain("updated a report");
    expect(markup).toContain("Preferences");
  });
});
