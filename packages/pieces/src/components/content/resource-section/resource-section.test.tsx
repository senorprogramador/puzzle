import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResourceSection } from "./resource-section";

const resources = [
  {
    id: "launch-kit",
    title: "SaaS launch kit",
    description: "A practical checklist for a thoughtful product launch.",
    category: "Guides",
    type: "Download",
    href: "/resources/launch-kit.pdf",
    download: true,
    featured: true,
  },
  {
    id: "webinar",
    title: "Designing a clear onboarding flow",
    description: "A recording from our product education series.",
    category: "Webinars",
    type: "Video",
    href: "/resources/onboarding-webinar",
  },
];

describe("ResourceSection", () => {
  it("searches resources, filters categories, and supports downloads", () => {
    render(
      <ResourceSection
        title="Resource library"
        variant="filterable"
        items={resources}
      />,
    );

    expect(screen.getByRole("link", { name: "SaaS launch kit" })).toHaveAttribute(
      "download",
    );
    fireEvent.change(screen.getByRole("textbox", { name: "Search resources" }), {
      target: { value: "onboarding" },
    });
    expect(
      screen.getByRole("link", { name: "Designing a clear onboarding flow" }),
    ).toBeVisible();
    expect(screen.queryByRole("link", { name: "SaaS launch kit" })).toBeNull();
  });

  it("shows a featured item while keeping other results separate", () => {
    render(
      <ResourceSection
        title="Featured resources"
        variant="featured"
        featuredResourceId="launch-kit"
        items={resources}
      />,
    );

    expect(screen.getByRole("link", { name: "SaaS launch kit" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Designing a clear onboarding flow" }),
    ).toBeVisible();
  });

  it("renders an empty state and keeps large libraries intact", () => {
    const { rerender, container } = render(
      <ResourceSection title="Empty library" items={[]} />,
    );
    expect(screen.getByRole("heading", { name: "No resources found" })).toBeVisible();

    const manyResources = Array.from({ length: 180 }, (_, index) => ({
      id: `resource-${index}`,
      title: `Resource ${index}`,
      href: `/resources/${index}`,
    }));
    rerender(
      <ResourceSection
        title="Large library"
        items={manyResources}
        searchable={false}
        filterable={false}
      />,
    );
    expect(
      container.querySelectorAll(".puzzle-resource-section__card"),
    ).toHaveLength(180);
  });
});
