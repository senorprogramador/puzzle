import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HostProfileSection } from "./host-profile-section";

describe("HostProfileSection", () => {
  it("composes the existing profile with languages, story, and contact action", () => {
    render(
      <HostProfileSection
        title="Meet your host"
        variant="compact"
        host={{
          id: "mara",
          name: "Mara Jensen",
          role: "Owner",
          biography: "A local host who loves sharing the coast.",
          languages: ["Dutch", "English"],
          story: "Mara has welcomed guests here for more than a decade.",
          contactAction: <a href="/contact">Contact Mara</a>,
        }}
      >
        <p>Ask us for a local recommendation.</p>
      </HostProfileSection>,
    );

    expect(screen.getByRole("heading", { name: "Mara Jensen" })).toBeVisible();
    expect(screen.getByRole("list", { name: "Languages" })).toHaveTextContent(
      "DutchEnglish",
    );
    expect(
      screen.getByText("Mara has welcomed guests here for more than a decade."),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Contact Mara" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByText("Ask us for a local recommendation.")).toBeVisible();
  });

  it("renders a minimal profile with the default host role", () => {
    const { container } = render(
      <HostProfileSection host={{ id: "sam", name: "Sam" }} />,
    );

    expect(container.querySelector('[data-variant="profile"]')).not.toBeNull();
    expect(screen.getByText("Host")).toBeVisible();
  });
});
