import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoCloudSection } from "./logo-cloud";
import type { LogoCloudItem, LogoCloudVariant } from "./logo-cloud.types";

const variants: LogoCloudVariant[] = [
  "grid",
  "centered",
  "monochrome",
  "colored",
  "carousel",
  "marquee",
  "featured",
  "grouped",
  "compact",
  "split",
  "bordered",
  "dark",
];
const logos: LogoCloudItem[] = [
  { id: "acme", name: "Acme", alt: "Acme logo", logo: <span>ACME</span> },
];

describe("LogoCloudSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const { container } = render(
      <LogoCloudSection variant={variant} logos={logos} />,
    );

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByRole("img", { name: "Acme logo" })).toBeVisible();
  });

  it("supports linked image logos with alt text", () => {
    render(
      <LogoCloudSection
        logos={[
          {
            id: "acme",
            name: "Acme home",
            alt: "Acme logo",
            src: "/acme.svg",
            href: "https://example.com",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Acme home" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByRole("img", { name: "Acme logo" })).toBeVisible();
  });

  it("omits an empty logo list", () => {
    const { container } = render(<LogoCloudSection logos={[]} />);
    expect(container.querySelector(".puzzle-logo-cloud__list")).toBeNull();
  });
});
