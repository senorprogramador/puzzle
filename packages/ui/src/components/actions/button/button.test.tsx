// @vitest-environment jsdom

import { createRef, type ComponentPropsWithRef } from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import { Theme } from "@puzzle-ui/theme";

import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

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
  it.each([
    "primary", "secondary", "outline", "ghost", "danger", "link", "toggle", "toggle-active",
  ] as const)("supports the %s variant", (variant) => {
    render(<Button variant={variant}>Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toHaveClass(`puzzle-button--${variant}`);
  });

  it.each(["xs", "sm", "md", "lg", "icon"] as const)("supports the %s size", (size) => {
    render(<Button size={size} fullWidth className="custom">Action</Button>);

    expect(screen.getByRole("button", { name: "Action" })).toHaveClass(
      `puzzle-button--${size}`, "puzzle-button--full-width", "custom",
    );
  });

  it("forwards native and anchor refs to the rendered elements", () => {
    const buttonRef = createRef<HTMLButtonElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    render(<><Button ref={buttonRef}>Save</Button><Button ref={linkRef} href="/about">About</Button></>);

    expect(buttonRef.current).toBe(screen.getByRole("button", { name: "Save" }));
    expect(linkRef.current).toBe(screen.getByRole("link", { name: "About" }));
  });

  it("keeps an icon-only button accessible through its supplied name", () => {
    render(<Button size="icon" aria-label="Delete" leading={<svg aria-hidden="true" />} />);

    expect(screen.getByRole("button", { name: "Delete" })).toHaveAccessibleName("Delete");
  });

  it.each([true, "true"] as const)("treats aria-disabled=%s as a native disabled state", (ariaDisabled) => {
    render(<Button aria-disabled={ariaDisabled}>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("restores activation after loading without losing its label", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button loading onClick={onClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();

    rerender(<Button onClick={onClick} aria-disabled="false">Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute("aria-busy");
  });

  it("does not submit a form by default but honors an explicit submit type", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={onSubmit}><Button>Preview</Button><Button type="submit">Publish</Button></form>);

    await user.click(screen.getByRole("button", { name: "Preview" }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Publish" }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("blocks disabled link activation from reaching ancestor handlers without trapping other keys", () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <div onClick={onClick} onKeyDown={onKeyDown}>
        <Button href="/delete" disabled>Delete</Button>
      </div>,
    );
    const link = screen.getByRole("link", { name: "Delete" });

    expect(fireEvent.click(link)).toBe(false);
    expect(fireEvent.keyDown(link, { key: " " })).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
    expect(onKeyDown).not.toHaveBeenCalled();
    expect(fireEvent.keyDown(link, { key: "Tab" })).toBe(true);
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("preserves enabled link keyboard handlers, tab order and busy attributes", () => {
    const onKeyDown = vi.fn();
    render(<Button href="/about" tabIndex={2} onKeyDown={onKeyDown} aria-busy="true">About</Button>);
    const link = screen.getByRole("link", { name: "About" });

    fireEvent.keyDown(link, { key: "ArrowDown" });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(link).toHaveAttribute("tabindex", "2");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).not.toHaveAttribute("aria-disabled");
  });

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
