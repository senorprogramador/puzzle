import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SecuritySection } from "./security";
import type { SecurityItem, SecurityVariant } from "./security.types";

const variants: SecurityVariant[] = [
  "grid",
  "badges",
  "compliance",
  "split",
  "certifications",
  "checklist",
  "cards",
  "featured",
  "dark",
  "metrics",
  "audit",
  "trust-center",
];

const items: SecurityItem[] = [
  {
    id: "access",
    title: "Role-based access",
    description: "Assign access by team responsibility.",
    category: "Access controls",
    label: "Configured by workspace admins",
    href: "https://example.com/access",
    featured: true,
  },
  {
    id: "audit-log",
    title: "Audit log",
    description: "Review security-relevant workspace events.",
    category: "Monitoring",
    value: "30 days",
  },
];

afterEach(cleanup);

describe("SecuritySection", () => {
  it.each(variants)("renders the %s composition", (variant) => {
    const { container } = render(
      <SecuritySection variant={variant} items={items} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Role-based access")).toBeVisible();
  });

  it("uses only consumer-provided claims and keeps supplied links actionable", () => {
    const { rerender } = render(<SecuritySection items={items} />);

    expect(screen.queryByText(/SOC 2|ISO 27001/i)).toBeNull();
    expect(
      screen.getByRole("link", { name: /Role-based access/ }),
    ).toHaveAttribute("href", "https://example.com/access");

    rerender(
      <SecuritySection
        variant="audit"
        items={[]}
        auditInfo={<p>Audit report updated in June.</p>}
      />,
    );
    expect(screen.getByText("Audit report updated in June.")).toBeVisible();
  });

  it("renders a plan with no unsupported security defaults and handles large collections", () => {
    const { container, rerender } = render(<SecuritySection items={[]} />);
    expect(container.querySelector(".puzzle-security__list")).toBeNull();

    const manyItems = Array.from({ length: 60 }, (_, index) => ({
      id: `control-${index}`,
      title: `Control ${index}`,
    }));
    rerender(<SecuritySection items={manyItems} />);

    expect(
      container.querySelectorAll(".puzzle-security__list > li"),
    ).toHaveLength(60);
  });
});
