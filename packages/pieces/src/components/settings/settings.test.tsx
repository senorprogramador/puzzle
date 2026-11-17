import { render, screen } from "@testing-library/react";
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
