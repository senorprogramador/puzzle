import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Container } from "./index";

afterEach(() => {
  document.documentElement.style.removeProperty("--puzzle-container-width");
  document.documentElement.style.removeProperty("--puzzle-content-width");
  document.documentElement.style.removeProperty("--puzzle-prose-width");
  cleanup();
});

describe("Container (browser)", () => {
  it("uses the configured container width token", () => {
    document.documentElement.style.setProperty(
      "--puzzle-container-width",
      "800px",
    );

    const { container } = render(<Container>Content</Container>);

    expect(getComputedStyle(container.firstElementChild!).maxWidth).toBe(
      "800px",
    );
  });

  it("uses the configured content width token", () => {
    document.documentElement.style.setProperty(
      "--puzzle-content-width",
      "640px",
    );

    const { container } = render(
      <Container widthPreset="content">Content</Container>,
    );

    expect(getComputedStyle(container.firstElementChild!).maxWidth).toBe(
      "640px",
    );
  });

  it("uses the configured prose width token", () => {
    document.documentElement.style.setProperty("--puzzle-prose-width", "65ch");

    const { container } = render(
      <Container widthPreset="prose">Content</Container>,
    );

    expect(getComputedStyle(container.firstElementChild!).maxWidth).toBe(
      "65ch",
    );
  });

  it("does not constrain a full-width container", () => {
    const { container } = render(
      <Container widthPreset="full">Content</Container>,
    );

    expect(getComputedStyle(container.firstElementChild!).maxWidth).toBe(
      "none",
    );
  });
});
