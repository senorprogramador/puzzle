import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FooterSection } from "./footer-section";

describe("FooterSection", () => {
  it("renders semantic footer navigation, social, legal, and newsletter slots", () => {
    render(
      <FooterSection
        variant="ecommerce"
        logo={<span>Northstar</span>}
        description="Considered tools for teams building better work."
        navigationGroups={[
          {
            id: "company",
            label: "Company",
            links: [{ id: "about", label: "About us", href: "/about" }],
          },
        ]}
        socialLinks={[
          {
            id: "linkedin",
            label: "LinkedIn",
            href: "/social/linkedin",
            icon: <span>in</span>,
          },
        ]}
        legalLinks={[
          { id: "privacy", label: "Privacy", href: "/privacy" },
        ]}
        newsletter={<form aria-label="Newsletter signup"><button>Subscribe</button></form>}
        copyright="© Northstar Studio"
      >
        <p>Built with care in Amsterdam.</p>
      </FooterSection>,
    );

    expect(screen.getByRole("contentinfo")).toHaveAttribute(
      "data-variant",
      "ecommerce",
    );
    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toContainElement(screen.getByRole("link", { name: "About us" }));
    expect(
      screen.getByRole("navigation", { name: "Social media" }),
    ).toContainElement(screen.getByRole("link", { name: "LinkedIn" }));
    expect(screen.getByRole("navigation", { name: "Legal" })).toContainElement(
      screen.getByRole("link", { name: "Privacy" }),
    );
    expect(screen.getByRole("heading", { name: "Newsletter" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeVisible();
    expect(screen.getByText("Built with care in Amsterdam.")).toBeVisible();
    expect(screen.getByText("© Northstar Studio")).toBeVisible();
  });

  it("renders the native footer landmark without optional sections", () => {
    render(<FooterSection variant="minimal" copyright="© Studio" />);
    expect(screen.getByRole("contentinfo")).toHaveTextContent("© Studio");
    expect(screen.queryByRole("navigation")).toBeNull();
  });
});
