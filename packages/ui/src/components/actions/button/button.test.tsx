// @vitest-environment jsdom

import type { ComponentPropsWithRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { Theme } from "@puzzle/theme";

import { describe, expect, it, vi } from "vitest";

import { Button } from "./index";

type RouterLinkProps = ComponentPropsWithRef<"a"> & {
  to: string;
  params?: {
    id?: string;
  };
};

const RouterLink = ({ to, params, ...props }: RouterLinkProps) => (
  <a {...props} href={to} data-router-link="true" data-route-id={params?.id} />
);

describe("Button", () => {
  it("renders a native button by default", () => {
    render(<Button>Save</Button>);

    const button = screen.getByRole("button", {
      name: "Save",
    });

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("puzzle-button");
    expect(button).toHaveClass("puzzle-button--primary");
  });

  it("renders a Puzzle Link when href is provided", () => {
    render(
      <Button href="/about" variant="secondary">
        About
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "About",
    });

    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveClass("puzzle-link");
    expect(link).toHaveClass("puzzle-button");
    expect(link).toHaveClass("puzzle-button--secondary");
  });

  it("uses the configured Theme Link component", () => {
    render(
      <Theme
        components={{
          link: {
            component: RouterLink,
            hrefProp: "to",
          },
        }}
      >
        <Button href="/posts">Posts</Button>
      </Theme>,
    );

    const link = screen.getByRole("link", {
      name: "Posts",
    });

    expect(link).toHaveAttribute("href", "/posts");
    expect(link).toHaveAttribute("data-router-link", "true");
  });

  it("forwards router-specific component props", () => {
    render(
      <Theme
        components={{
          link: {
            component: RouterLink,
            hrefProp: "to",
          },
        }}
      >
        <Button
          href="/posts/$postId"
          componentProps={{
            params: {
              id: "42",
            },
          }}
        >
          Read post
        </Button>
      </Theme>,
    );

    const link = screen.getByRole("link", {
      name: "Read post",
    });

    expect(link).toHaveAttribute("data-route-id", "42");
  });

  it("preserves target and adds secure rel values", () => {
    render(
      <Button href="https://example.com" target="_blank" rel="nofollow">
        External website
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "External website",
    });

    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });

  it("supports native button types", () => {
    render(<Button type="submit">Submit</Button>);

    expect(
      screen.getByRole("button", {
        name: "Submit",
      }),
    ).toHaveAttribute("type", "submit");
  });

  it("prevents activation when a link button is disabled", () => {
    const onClick = vi.fn();

    render(
      <Button href="/delete" disabled onClick={onClick}>
        Delete
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "Delete",
    });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    expect(fireEvent.click(link)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("prevents keyboard activation when a link button is disabled", () => {
    render(
      <Button href="/delete" disabled>
        Delete
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "Delete",
    });

    expect(
      fireEvent.keyDown(link, {
        key: "Enter",
      }),
    ).toBe(false);
  });

  it("disables a link button while loading", () => {
    render(
      <Button href="/checkout" loading>
        Checkout
      </Button>,
    );

    const link = screen.getByRole("link", {
      name: "Checkout",
    });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("tabindex", "-1");

    expect(link.querySelector(".puzzle-button__spinner")).toBeInTheDocument();
  });

  it("uses the native disabled attribute while loading", () => {
    render(<Button loading>Saving</Button>);

    const button = screen.getByRole("button", {
      name: "Saving",
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("forwards click handlers for link buttons", () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());

    render(
      <Button href="/about" onClick={onClick}>
        About
      </Button>,
    );

    fireEvent.click(
      screen.getByRole("link", {
        name: "About",
      }),
    );

    expect(onClick).toHaveBeenCalledOnce();
  });
});
