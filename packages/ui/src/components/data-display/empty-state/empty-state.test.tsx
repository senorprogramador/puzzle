import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  EmptyState,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateContent,
} from "./index";

afterEach(cleanup);

describe("EmptyState", () => {
  it("renders its children", () => {
    render(
      <EmptyState>
        <EmptyStateTitle>No projects</EmptyStateTitle>
      </EmptyState>,
    );

    expect(screen.getByRole("heading", { name: "No projects" })).toBeTruthy();
  });

  it("uses the default size and variant", () => {
    render(<EmptyState data-testid="empty" />);

    const empty = screen.getByTestId("empty");

    expect(empty).toHaveAttribute("data-size", "md");
    expect(empty).toHaveAttribute("data-variant", "default");
  });

  it("supports size and variant customization", () => {
    render(<EmptyState data-testid="empty" size="lg" variant="outlined" />);

    const empty = screen.getByTestId("empty");

    expect(empty).toHaveClass(
      "puzzle-empty-state--lg",
      "puzzle-empty-state--outlined",
    );
  });

  it("forwards HTML attributes and custom classes", () => {
    render(
      <EmptyState
        data-testid="empty"
        id="projects-empty"
        className="custom-empty"
      />,
    );

    const empty = screen.getByTestId("empty");

    expect(empty).toHaveAttribute("id", "projects-empty");
    expect(empty).toHaveClass("custom-empty");
  });
});

describe("EmptyStateHeader", () => {
  it("groups its children", () => {
    render(
      <EmptyStateHeader data-testid="header">Header content</EmptyStateHeader>,
    );

    expect(screen.getByTestId("header")).toHaveTextContent("Header content");
  });
});

describe("EmptyStateMedia", () => {
  it("uses the default media variant", () => {
    render(<EmptyStateMedia data-testid="media">Icon</EmptyStateMedia>);

    const media = screen.getByTestId("media");

    expect(media).toHaveAttribute("data-variant", "default");
    expect(media).toHaveAttribute("aria-hidden", "true");
  });

  it("supports the icon variant", () => {
    render(
      <EmptyStateMedia variant="icon" data-testid="media">
        Icon
      </EmptyStateMedia>,
    );

    expect(screen.getByTestId("media")).toHaveClass(
      "puzzle-empty-state__media--icon",
    );
  });

  it("supports accessible labeled media", () => {
    render(
      <EmptyStateMedia aria-label="Empty folder" data-testid="media">
        Icon
      </EmptyStateMedia>,
    );

    expect(screen.getByRole("img", { name: "Empty folder" })).toBeTruthy();
  });
});

describe("EmptyStateTitle", () => {
  it("renders a semantic heading", () => {
    render(<EmptyStateTitle>Nothing here</EmptyStateTitle>);

    expect(
      screen.getByRole("heading", { name: "Nothing here", level: 3 }),
    ).toBeTruthy();
  });
});

describe("EmptyStateDescription", () => {
  it("renders a paragraph", () => {
    render(
      <EmptyStateDescription>
        Create something to get started.
      </EmptyStateDescription>,
    );

    expect(screen.getByText("Create something to get started.").tagName).toBe(
      "P",
    );
  });
});

describe("EmptyStateContent", () => {
  it("renders interactive children without changing their semantics", () => {
    render(
      <EmptyStateContent>
        <button type="button">Create project</button>
      </EmptyStateContent>,
    );

    expect(screen.getByRole("button", { name: "Create project" })).toBeTruthy();
  });
});

describe("EmptyState composition", () => {
  it("supports all parts together", () => {
    render(
      <EmptyState>
        <EmptyStateHeader>
          <EmptyStateMedia variant="icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" />
            </svg>
          </EmptyStateMedia>
          <EmptyStateTitle>No projects yet</EmptyStateTitle>
          <EmptyStateDescription>
            Create your first project.
          </EmptyStateDescription>
        </EmptyStateHeader>

        <EmptyStateContent>
          <button type="button">Create project</button>
        </EmptyStateContent>
      </EmptyState>,
    );

    expect(
      screen.getByRole("heading", { name: "No projects yet" }),
    ).toBeTruthy();

    expect(screen.getByText("Create your first project.")).toBeTruthy();

    expect(screen.getByRole("button", { name: "Create project" })).toBeTruthy();
  });
});
