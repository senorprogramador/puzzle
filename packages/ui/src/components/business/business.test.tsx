import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BusinessImageView,
  CaseStudyCard,
  CompanyInfo,
  ContactDetails,
  LogoCollection,
  MetricList,
  ProfileCard,
  ServiceCard,
  SocialLinks,
} from "./index";

afterEach(cleanup);

describe("business UI components", () => {
  it("renders a profile with an accessible avatar fallback and native profile link", () => {
    render(
      <ProfileCard
        name="Ari Chen"
        role="Managing director"
        biography="A long-form biography remains readable."
        href="/team/ari-chen"
        socials={[
          {
            id: "linkedin",
            label: "LinkedIn",
            href: "https://example.com/ari",
            external: true,
          },
        ]}
      />,
    );

    expect(screen.getByRole("img", { name: "Ari Chen" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Ari Chen" })).toHaveAttribute(
      "href",
      "/team/ari-chen",
    );
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(
      screen.getByText("A long-form biography remains readable."),
    ).toBeVisible();
  });

  it("handles absent company and partner logos without broken images", () => {
    const { container } = render(
      <>
        <CompanyInfo name="Northstar Advisory" />
        <LogoCollection
          items={[
            {
              id: "partner",
              name: "Fieldwork Studio",
              href: "https://example.com/fieldwork",
              external: true,
            },
          ]}
        />
        <BusinessImageView image={{ alt: "Office exterior" }} />
      </>,
    );

    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getByText("Northstar Advisory")).toBeVisible();
    expect(screen.getByText("Fieldwork Studio")).toBeVisible();
    expect(
      screen.getByRole("img", { name: "Office exterior unavailable" }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Fieldwork Studio" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders semantic contact details, service pricing, and case study metrics", () => {
    render(
      <>
        <ContactDetails
          items={[
            {
              id: "email",
              label: "Email",
              value: "hello@example.com",
              href: "mailto:hello@example.com",
            },
          ]}
        />
        <ServiceCard
          title="Operations strategy"
          description="A detailed service description."
          pricing="From $4,000"
          href="https://example.com/service"
          external
          action={<button type="button">Talk to a strategist</button>}
        />
        <CaseStudyCard
          title="A better guest journey"
          client="Cedar House"
          results="More direct bookings."
          metrics={[
            {
              id: "bookings",
              label: "Direct bookings",
              value: "+28%",
            },
          ]}
        />
      </>,
    );

    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
    expect(
      screen.getByRole("link", { name: "Operations strategy" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("From $4,000")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Talk to a strategist" }),
    ).toBeVisible();
    expect(screen.getByText("+28%")).toBeVisible();
    expect(screen.getByText("Results")).toBeVisible();
  });

  it("renders standalone social links and metrics as reusable data components", () => {
    render(
      <>
        <SocialLinks
          label="Company profiles"
          links={[
            { id: "network", label: "Network", href: "https://example.com" },
          ]}
        />
        <MetricList
          items={[
            {
              id: "years",
              label: "Years in business",
              value: 18,
              description: "Across six countries.",
            },
          ]}
        />
      </>,
    );

    expect(
      screen.getByRole("list", { name: "Company profiles" }),
    ).toBeVisible();
    expect(screen.getByText("18")).toBeVisible();
    expect(screen.getByText("Across six countries.")).toBeVisible();
  });
});
