import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { AnnouncementSection } from "./announcement";
import { CodeShowcaseSection } from "./code-showcase";
import { ComparisonSection } from "./comparison";
import { FAQSection } from "./faq";
import { FeaturesSection } from "./features";
import { LogoCloudSection } from "./logo-cloud";
import { StatsSection } from "./stats";
import { TestimonialsSection } from "./testimonials";
import { UseCasesSection } from "./use-cases";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("marketing section browser interactions", () => {
  it("dismisses an announcement using its keyboard-accessible button", async () => {
    const user = userEvent.setup();
    render(
      <AnnouncementSection
        variant="dismissible"
        message="Enrollment is open"
      />,
    );

    const dismiss = screen.getByRole("button", {
      name: "Dismiss announcement",
    });
    dismiss.focus();
    await user.keyboard("{Enter}");

    expect(screen.queryByText("Enrollment is open")).toBeNull();
  });

  it("filters and expands FAQ items with keyboard input", async () => {
    const user = userEvent.setup();
    render(
      <FAQSection
        variant="searchable"
        items={[
          {
            id: "delivery",
            question: "When is delivery?",
            answer: "Delivery takes two days.",
            searchText: "shipping",
          },
          {
            id: "returns",
            question: "Can I return an item?",
            answer: "Returns are accepted for 30 days.",
          },
        ]}
      />,
    );

    await user.type(screen.getByRole("searchbox", { name: "Search questions" }), "shipping");
    const question = screen.getByRole("button", { name: "When is delivery?" });
    expect(screen.queryByRole("button", { name: "Can I return an item?" })).toBeNull();
    question.focus();
    await user.keyboard("{Enter}");
    await waitFor(() =>
      expect(question).toHaveAttribute("aria-expanded", "true"),
    );
  });

  it("changes Features tabs with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <FeaturesSection
        variant="tabs"
        items={[
          { id: "speed", title: "Speed", description: "Ship sooner." },
          { id: "quality", title: "Quality", description: "Reduce rework." },
        ]}
      />,
    );
    const firstTab = screen.getByRole("tab", { name: "Speed" });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Quality" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("navigates the testimonial carousel with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <TestimonialsSection
        variant="carousel"
        items={[
          { id: "one", quote: "First quote.", author: "One" },
          { id: "two", quote: "Second quote.", author: "Two" },
        ]}
      />,
    );

    const carousel = screen.getByRole("group", {
      name: "Customer testimonials. Use the left and right arrow keys to navigate.",
    });
    carousel.focus();
    await user.keyboard("{ArrowRight}");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Next testimonial" }),
      ).toBeDisabled();
    });
    await user.keyboard("{ArrowLeft}");
    expect(
      screen.getByRole("button", { name: "Next testimonial" }),
    ).toBeEnabled();
  });

  it("supports selection and change notifications in comparisons", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ComparisonSection
        variant="interactive"
        options={[
          { id: "starter", title: "Starter" },
          { id: "team", title: "Team" },
        ]}
        features={[
          { id: "seats", label: "Seats", values: { starter: 3, team: 20 } },
        ]}
        defaultSelectedOptionId="starter"
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Team" }));
    expect(screen.getByRole("radio", { name: "Team" })).toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledWith("team");
  });

  it("renders animated stats immediately when reduced motion is preferred", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (media) =>
        ({
          matches: media.includes("prefers-reduced-motion"),
          media,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent: () => true,
        }) as MediaQueryList,
    );

    render(
      <StatsSection
        variant="animated"
        items={[{ id: "users", label: "Active users", value: 42 }]}
      />,
    );

    expect(await screen.findByText("42")).toBeVisible();
  });

  it("keeps the stats grid responsive without mobile overflow", async () => {
    const { container } = render(
      <StatsSection
        items={[
          { id: "one", label: "One", value: 1 },
          { id: "two", label: "Two", value: 2 },
          { id: "three", label: "Three", value: 3 },
          { id: "four", label: "Four", value: 4 },
        ]}
      />,
    );
    const list = container.querySelector(".puzzle-stats__list");
    expect(list).not.toBeNull();

    await page.viewport(375, 800);
    expect(getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
    await page.viewport(1200, 800);
    expect(getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(4);
  });

  it("centers an incomplete final logo row on mobile", async () => {
    await page.viewport(375, 800);
    const { container } = render(
      <LogoCloudSection
        variant="centered"
        logos={[
          { id: "one", name: "One", alt: "One logo", logo: <span>One</span> },
          { id: "two", name: "Two", alt: "Two logo", logo: <span>Two</span> },
          { id: "three", name: "Three", alt: "Three logo", logo: <span>Three</span> },
        ]}
      />,
    );
    const list = container.querySelector(".puzzle-logo-cloud__list")!;
    const finalLogo = list.querySelector("li:last-child")!;
    const listBounds = list.getBoundingClientRect();
    const logoBounds = finalLogo.getBoundingClientRect();

    expect(logoBounds.left + logoBounds.width / 2).toBeCloseTo(
      listBounds.left + listBounds.width / 2,
      0,
    );
  });

  it("keeps marquee logos scrollable without overflowing the page", async () => {
    await page.viewport(320, 800);
    const logos = Array.from({ length: 8 }, (_, index) => ({
      id: `partner-${index}`,
      name: `Partner ${index}`,
      alt: `Partner ${index} logo`,
      logo: <span>{`PartnerCompany${index}`}</span>,
    }));
    const { container } = render(
      <LogoCloudSection variant="marquee" logos={logos} />,
    );
    const root = container.querySelector(".puzzle-logo-cloud")!;
    const list = root.querySelector(".puzzle-logo-cloud__list")!;

    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
    expect(list).toHaveAttribute("aria-label", "Partner logos");
    expect(list).toHaveAttribute("tabindex", "0");
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  });

  it("stacks list use-case media on mobile and splits it on desktop", async () => {
    await page.viewport(320, 800);
    const { container } = render(
      <UseCasesSection
        variant="list"
        items={[
          {
            id: "launch",
            title: "Plan a product launch",
            media: (
              <img
                src="/wide-preview.png"
                alt="Product launch dashboard"
                width="640"
                height="360"
              />
            ),
          },
        ]}
      />,
    );
    const item = container.querySelector(".puzzle-use-cases__item")!;

    expect(getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(1);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );

    await page.viewport(1280, 800);
    expect(getComputedStyle(item).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(2);
  });

  it("contains long code lines inside installation and featured layouts", async () => {
    await page.viewport(320, 800);
    const code = `const endpoint = "${"https://api.example.com/".repeat(8)}";`;
    const items = [
      { id: "install", title: "Install", language: "bash", code },
      { id: "configure", title: "Configure", language: "typescript", code },
    ];

    for (const variant of ["installation", "featured"] as const) {
      const { container, unmount } = render(
        <CodeShowcaseSection
          variant={variant}
          items={items}
          copyable={false}
        />,
      );
      const section = container.querySelector(".puzzle-code-showcase")!;
      const pre = container.querySelector(".puzzle-code-showcase__pre")!;

      expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
      expect(section.scrollWidth).toBeLessThanOrEqual(section.clientWidth);
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
        document.documentElement.clientWidth,
      );
      unmount();
    }
  });

  it("contains comparison table overflow within its labeled viewport on mobile", async () => {
    await page.viewport(375, 800);
    const { container } = render(
      <ComparisonSection
        options={[
          { id: "one", title: "Option one" },
          { id: "two", title: "Option two" },
          { id: "three", title: "Option three" },
        ]}
        features={[
          {
            id: "support",
            label: "Support",
            values: { one: false, two: true, three: true },
          },
        ]}
      />,
    );
    const viewport = container.querySelector(
      ".puzzle-comparison__table-scroll",
    );
    expect(viewport).not.toBeNull();
    expect(viewport!.scrollWidth).toBeGreaterThan(viewport!.clientWidth);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  });
});
