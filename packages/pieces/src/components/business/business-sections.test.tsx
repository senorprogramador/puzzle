import { cleanup, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import {
  AboutSection,
  AwardsSection,
  CareersSection,
  CaseStudiesSection,
  ContactSection,
  PartnersSection,
  ServicesSection,
  TeamSection,
  type AboutSectionVariant,
  type AwardsSectionVariant,
  type BusinessCaseStudy,
  type BusinessProfile,
  type BusinessService,
  type CareersSectionVariant,
  type CaseStudiesSectionVariant,
  type ContactSectionVariant,
  type PartnersSectionVariant,
  type ServicesSectionVariant,
  type TeamSectionVariant,
} from ".";

afterEach(cleanup);

const portrait = {
  src: "",
  alt: "Portrait not yet supplied",
};

const members: BusinessProfile[] = [
  {
    id: "maya",
    name: "Maya Patel",
    role: "Managing partner",
    department: "Leadership",
    avatar: portrait,
    biography: "A thoughtful leader with a long-standing commitment to craft.",
    href: "/people/maya-patel",
    socials: [
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "https://example.com/maya",
        external: true,
      },
    ],
  },
  {
    id: "leo",
    name: "Leo Okafor",
    role: "Design director",
    department: "Design",
  },
  {
    id: "ines",
    name: "Ines Laurent",
    role: "Research lead",
    department: "Research",
  },
];

const services: BusinessService[] = [
  {
    id: "strategy",
    title: "Brand strategy",
    description: "Positioning and research for ambitious hospitality teams.",
    category: "Consulting",
    icon: "01",
    image: { src: "", alt: "Studio workshop" },
    pricing: "Engagements from $8,000",
    href: "https://example.com/services/strategy",
    external: true,
    featured: true,
  },
  {
    id: "identity",
    title: "Visual identity",
    description: "A flexible identity system for a growing business.",
    category: "Creative",
  },
];

const cases: BusinessCaseStudy[] = [
  {
    id: "cedar",
    title: "A more considered guest journey",
    client: "Cedar House",
    industry: "Hospitality",
    challenge: "Connect a fragmented guest experience.",
    solution: "Unify the booking and on-property touchpoints.",
    results: "Increase direct bookings and guest satisfaction.",
    image: { src: "", alt: "Cedar House lobby" },
    beforeAfter: {
      before: { src: "", alt: "Previous booking experience" },
      after: { src: "", alt: "Updated booking experience" },
    },
    metrics: [
      {
        id: "bookings",
        label: "Direct bookings",
        value: "+28%",
      },
    ],
    href: "https://example.com/case-studies/cedar-house",
    external: true,
    featured: true,
  },
  {
    id: "meridian",
    title: "One platform for every team",
    client: "Meridian Cloud",
    industry: "SaaS",
    challenge: "Bring product teams together.",
    solution: "Create a connected planning system.",
    results: "Reduce handoff time by one third.",
  },
];

const aboutVariants: AboutSectionVariant[] = [
  "split",
  "centered",
  "editorial",
  "image-led",
  "story",
  "timeline",
  "stats",
  "team",
  "mission",
  "values",
  "asymmetric",
  "full-width",
];
const teamVariants: TeamSectionVariant[] = [
  "grid",
  "cards",
  "featured",
  "leadership",
  "departments",
  "horizontal",
  "carousel",
  "editorial",
  "compact",
  "asymmetric",
  "profile",
  "split",
];
const servicesVariants: ServicesSectionVariant[] = [
  "grid",
  "cards",
  "list",
  "split",
  "alternating",
  "featured",
  "icons",
  "numbered",
  "pricing",
  "editorial",
  "categorized",
  "carousel",
];
const caseStudyVariants: CaseStudiesSectionVariant[] = [
  "grid",
  "featured",
  "split",
  "masonry",
  "carousel",
  "editorial",
  "metrics",
  "before-after",
  "cards",
  "list",
  "portfolio",
  "bento",
  "horizontal",
];
const contactVariants: ContactSectionVariant[] = [
  "split",
  "centered",
  "form",
  "card",
  "map",
  "details",
  "minimal",
  "full-width",
  "departments",
  "multi-column",
  "editorial",
  "support",
  "inquiry",
];
const careersVariants: CareersSectionVariant[] = [
  "list",
  "grid",
  "featured",
  "departments",
  "culture",
  "split",
  "benefits",
  "editorial",
  "cards",
  "locations",
  "compact",
  "hiring",
];
const partnerVariants: PartnersSectionVariant[] = [
  "grid",
  "logo-wall",
  "featured",
  "categories",
  "cards",
  "network",
  "split",
  "carousel",
  "ecosystem",
  "minimal",
];
const awardVariants: AwardsSectionVariant[] = [
  "grid",
  "list",
  "featured",
  "badges",
  "timeline",
  "cards",
  "logo-wall",
  "split",
  "compact",
  "editorial",
];

describe("business section variants", () => {
  it.each(aboutVariants)("renders AboutSection %s", (variant) => {
    const { container } = render(
      <AboutSection
        variant={variant}
        title="About Northstar"
        company={{ name: "Northstar Advisory" }}
        story={{ description: "A long-running independent consultancy." }}
        mission="Make complex change manageable."
        vision="Build a more resilient future."
        stats={[{ id: "years", label: "Years", value: 18 }]}
        values={[{ id: "care", title: "Care", description: "Work with care." }]}
        timeline={[{ id: "founded", year: "2008", title: "Founded" }]}
        team={members}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("Northstar Advisory")).toBeVisible();
  });

  it.each(teamVariants)("renders TeamSection %s", (variant) => {
    const { container } = render(
      <TeamSection
        variant={variant}
        title="Meet the team"
        items={members}
        departments={[
          { id: "leadership", name: "Leadership", members: [members[0]!] },
          { id: "design", name: "Design", members: [members[1]!] },
          { id: "research", name: "Research", members: [members[2]!] },
        ]}
        featuredMember="maya"
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("Maya Patel")).toBeVisible();
  });

  it.each(servicesVariants)("renders ServicesSection %s", (variant) => {
    const { container } = render(
      <ServicesSection
        variant={variant}
        title="How we help"
        items={services}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("Brand strategy")).toBeVisible();
  });

  it.each(caseStudyVariants)("renders CaseStudiesSection %s", (variant) => {
    const { container } = render(
      <CaseStudiesSection
        variant={variant}
        title="Selected work"
        items={cases}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("A more considered guest journey")).toBeVisible();
  });

  it.each(contactVariants)("renders ContactSection %s", (variant) => {
    const { container } = render(
      <ContactSection
        variant={variant}
        title="Talk with our team"
        email="hello@northstar.example"
        address="12 Market Street"
        departments={[
          {
            id: "studio",
            name: "Studio",
            contacts: [
              {
                id: "maya",
                name: "Maya Patel",
                role: "Studio lead",
                email: "maya@northstar.example",
              },
            ],
          },
          {
            id: "press",
            name: "Press",
            contacts: [
              {
                id: "leo",
                name: "Leo Okafor",
                email: "press@northstar.example",
              },
            ],
          },
        ]}
        formSlot={<form aria-label="Contact form" />}
        mapSlot={<iframe title="Northstar office map" />}
        successSlot={<p>Thanks, your message is ready.</p>}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByRole("link", { name: "hello@northstar.example" })).toHaveAttribute(
      "href",
      "mailto:hello@northstar.example",
    );
  });

  it.each(careersVariants)("renders CareersSection %s", (variant) => {
    const { container } = render(
      <CareersSection
        variant={variant}
        title="Join Northstar"
        positions={[
          {
            id: "designer",
            title: "Senior product designer",
            department: "Product",
            location: "Amsterdam",
            employmentType: "Full-time",
            description: "Help shape thoughtful tools for growing teams.",
            href: "/careers/product-designer",
            featured: true,
          },
          {
            id: "writer",
            title: "Content designer",
            department: "Brand",
            location: "London",
            employmentType: "Contract",
          },
        ]}
        culture="We value curiosity, thoughtful collaboration, and clear writing."
        benefits={[
          { id: "leave", title: "Flexible leave", description: "Time to recharge." },
        ]}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("Senior product designer")).toBeVisible();
  });

  it.each(partnerVariants)("renders PartnersSection %s", (variant) => {
    const { container } = render(
      <PartnersSection
        variant={variant}
        title="Our partners"
        items={[
          {
            id: "fieldwork",
            name: "Fieldwork Studio",
            description: "A collaborative design studio.",
            category: "Creative",
            href: "https://example.com/fieldwork",
            external: true,
            featured: true,
          },
          {
            id: "cloud",
            name: "Meridian Cloud",
            category: "Technology",
          },
        ]}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText("Fieldwork Studio")).toBeVisible();
  });

  it.each(awardVariants)("renders AwardsSection %s", (variant) => {
    const { container } = render(
      <AwardsSection
        variant={variant}
        title="Awards and recognition"
        items={[
          {
            id: "design-award",
            title: "Independent Studio of the Year",
            organization: "Design Guild",
            year: 2025,
            description: "Recognizing thoughtful work and lasting impact.",
            href: "https://example.com/awards/design",
            external: true,
            featured: true,
          },
          {
            id: "service-award",
            title: "Guest Experience Award",
            organization: "Hospitality Forum",
            year: 2024,
          },
        ]}
      />,
    );

    expect(
      container.querySelector(`[data-variant="${variant}"]`),
    ).not.toBeNull();
    expect(screen.getByText(/Independent Studio of the Year/)).toBeVisible();
  });
});

describe("business section data and accessibility", () => {
  it("supports empty teams, one member, large teams, and absent avatars", () => {
    const { container, rerender } = render(
      <TeamSection items={[]} title="Our people" />,
    );
    expect(container.querySelectorAll(".puzzle-business-profile")).toHaveLength(
      0,
    );

    rerender(<TeamSection items={[members[1]!]} title="Our people" />);
    expect(screen.getByText("Leo Okafor")).toBeVisible();
    expect(screen.getByRole("img", { name: "Leo Okafor" })).toBeVisible();

    const largeTeam = Array.from({ length: 80 }, (_, index) => ({
      id: `member-${index}`,
      name: `Member ${index}`,
      role: "Consultant",
    }));
    rerender(<TeamSection items={largeTeam} />);
    expect(container.querySelectorAll(".puzzle-business-profile")).toHaveLength(
      80,
    );
  });

  it("renders missing logos, long copy, and external links safely", () => {
    const longDescription = "Detailed context. ".repeat(80);
    render(
      <>
        <AboutSection
          story={{ description: longDescription }}
          images={[{ alt: "Image not supplied" }]}
        />
        <PartnersSection
          items={[
            {
              id: "partner",
              name: "Open Field",
              href: "https://example.com/open-field",
              external: true,
            },
          ]}
        />
        <CaseStudiesSection items={cases} />
      </>,
    );

    const longCopy = screen.getByText(/Detailed context/);
    expect(longCopy).toBeVisible();
    expect(longCopy.textContent?.length).toBeGreaterThan(1_000);
    expect(
      screen.getByRole("img", { name: "Image not supplied unavailable" }),
    ).toBeVisible();
    expect(screen.getByText("Open Field")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open Field" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "A more considered guest journey" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps contact details optional and renders form, map, and success slots", () => {
    const { container, rerender } = render(
      <ContactSection title="Get in touch" />,
    );
    expect(
      container.querySelector(".puzzle-business-contact-details"),
    ).toBeNull();

    rerender(
      <ContactSection
        title="Get in touch"
        phone="+31 20 123 4567"
        openingHours="Monday to Friday, 09:00–17:00"
        formSlot={
          <form aria-label="Contact form">
            <label>
              Work email
              <input type="email" />
            </label>
          </form>
        }
        mapSlot={<iframe title="Office map" />}
        successSlot={<p>Message received.</p>}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Work email" })).toBeVisible();
    expect(screen.getByRole("region", { name: "Map" })).toBeVisible();
    expect(screen.getByText("Message received.")).toBeVisible();
    expect(screen.getByRole("link", { name: "+31 20 123 4567" })).toHaveAttribute(
      "href",
      "tel:+31 20 123 4567",
    );
  });

  it("shows a careers empty state when there are no open positions", () => {
    render(<CareersSection positions={[]} emptyState="No roles this month." />);
    expect(screen.getByText("No roles this month.")).toBeVisible();
  });

  it("renders sections to HTML on the server", () => {
    const html = renderToString(
      <>
        <AboutSection title="About Northstar" />
        <TeamSection items={[members[0]!]} />
        <ServicesSection items={services} />
        <CaseStudiesSection items={cases} />
        <ContactSection email="hello@northstar.example" />
        <CareersSection positions={[]} />
        <PartnersSection items={[]} />
        <AwardsSection items={[]} />
      </>,
    );

    expect(html).toContain("About Northstar");
    expect(html).toContain("Maya Patel");
    expect(html).toContain("Brand strategy");
    expect(html).toContain("A more considered guest journey");
    expect(html).toContain("hello@northstar.example");
    expect(html).toContain("There are no open positions right now.");
  });
});
