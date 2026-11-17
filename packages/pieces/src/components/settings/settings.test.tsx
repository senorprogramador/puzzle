import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { Switch } from "@puzzle-ui/ui";
import { describe, expect, it } from "vitest";

import {
  FormActions,
  ProfileHeader,
  SecurityMethodCard,
  SettingsGroup,
  SettingsRow,
  SettingsSection,
} from ".";

describe("SettingsSection", () => {
  it("renders a labelled section with description, actions, and content", () => {
    render(
      <SettingsSection
        title="Profile"
        description="Manage your personal information."
        actions={<button type="button">Edit</button>}
      >
        <p>Account details</p>
      </SettingsSection>,
    );

    expect(screen.getByRole("region", { name: "Profile" })).toBeVisible();
    expect(
      screen.getByText("Manage your personal information."),
    ).toBeInTheDocument();
    expect(screen.getByText("Account details")).toBeVisible();
  });

  it("renders navigation and responsive variants", () => {
    render(
      <SettingsSection
        title="Workspace settings"
        variant="sidebar"
        navigation={<a href="#profile">Profile</a>}
      >
        <p>Workspace preferences</p>
      </SettingsSection>,
    );

    expect(
      screen.getByRole("region", { name: "Workspace settings" }),
    ).toHaveAttribute("data-variant", "sidebar");
    expect(
      screen.getByRole("navigation", { name: "Settings navigation" }),
    ).toContainElement(screen.getByRole("link", { name: "Profile" }));
  });
});

describe("SettingsGroup and SettingsRow", () => {
  it("labels groups and associates settings labels with controls", () => {
    render(
      <SettingsGroup title="Security">
        <SettingsRow
          label="Current password"
          description="Used to verify your identity."
          htmlFor="current-password"
          control={<input id="current-password" type="password" />}
        />
      </SettingsGroup>,
    );

    expect(screen.getByRole("region", { name: "Security" })).toBeVisible();
    expect(screen.getByLabelText("Current password")).toBeInTheDocument();
    expect(
      screen.getByText("Used to verify your identity."),
    ).toBeInTheDocument();
  });

  it("associates descriptions and errors with the setting control", () => {
    render(
      <SettingsGroup title="Profile">
        <SettingsRow
          label="Work email"
          description="Used for workspace notifications."
          error="Enter a valid work email."
          htmlFor="work-email"
          control={<input id="work-email" type="email" />}
        />
      </SettingsGroup>,
    );

    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ");
    expect(describedBy).toHaveLength(2);
    expect(describedBy?.map((id) => document.getElementById(id)?.textContent)).toEqual([
      "Used for workspace notifications.",
      "Enter a valid work email.",
    ]);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid work email.",
    );
  });
});

describe("FormActions", () => {
  it("groups caller-provided form actions", () => {
    render(
      <FormActions>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </FormActions>,
    );

    expect(screen.getByRole("group", { name: "Form actions" })).toContainElement(
      screen.getByRole("button", { name: "Save" }),
    );
  });
});

describe("ProfileHeader and SecurityMethodCard", () => {
  it("renders profile identity and security method details", () => {
    render(
      <>
        <ProfileHeader
          name="Alex Morgan"
          email="alex@example.com"
          avatar={<span>AM</span>}
        />
        <SecurityMethodCard
          title="Authenticator app"
          description="Use a time-based one-time password."
          status="Enabled"
          action={<button type="button">Manage</button>}
        />
      </>,
    );

    expect(
      screen.getByRole("heading", { name: "Alex Morgan", level: 2 }),
    ).toBeVisible();
    expect(screen.getByText("alex@example.com")).toBeVisible();
    expect(screen.getByRole("article")).toHaveTextContent(
      "Authenticator app",
    );
    expect(screen.getByRole("button", { name: "Manage" })).toBeVisible();
  });
});

describe("application-owned settings state", () => {
  it("forwards switch interaction without owning the setting value", () => {
    const NotificationPreference = () => {
      const [enabled, setEnabled] = useState(false);

      return (
        <SettingsSection title="Notifications" variant="notifications">
          <SettingsGroup title="Email">
            <SettingsRow
              label="Weekly digest"
              description="Receive a summary of your team's work."
              htmlFor="weekly-digest"
              control={
                <Switch
                  id="weekly-digest"
                  checked={enabled}
                  onChange={(event) => setEnabled(event.currentTarget.checked)}
                />
              }
            />
          </SettingsGroup>
        </SettingsSection>
      );
    };

    render(<NotificationPreference />);
    const toggle = screen.getByRole("switch", { name: "Weekly digest" });
    expect(toggle).not.toBeChecked();
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
  });
});
