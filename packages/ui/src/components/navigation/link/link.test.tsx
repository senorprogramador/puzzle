// @vitest-environment jsdom

import type { ComponentPropsWithRef } from "react";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Theme } from "@puzzle-ui/theme";
import { Link } from "./index";

type RouterLinkProps = ComponentPropsWithRef<"a"> & {
  to: string;
  params?: {
    id?: string;
  };
};

const RouterLink = ({ to, params, ...props }: RouterLinkProps) => (
  <a href={to} data-router-link="true" data-route-id={params?.id} {...props} />
);

const CustomLink = (props: ComponentPropsWithRef<"a">) => (
  <a {...props} data-custom-link="true" />
);

describe("Link", () => {
  let root: Root | null = null;
  let hydrationContainer: HTMLDivElement | null = null;

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root?.unmount();
      });

      root = null;
    }

    hydrationContainer?.remove();
    hydrationContainer = null;
  });

  it("renders a native anchor without a Theme provider", () => {
    render(<Link href="/about">About</Link>);

    const link = screen.getByRole("link", {
      name: "About",
    });

    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveClass("puzzle-link");
  });

  it("uses a configured custom Link component", () => {
    render(
      <Theme
        components={{
          link: CustomLink,
        }}
      >
        <Link href="/docs">Documentation</Link>
      </Theme>,
    );

    const link = screen.getByRole("link", {
      name: "Documentation",
    });

    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-custom-link", "true");
    expect(link).toHaveClass("puzzle-link");
  });

  it("maps href to the configured destination prop", () => {
    render(
      <Theme
        components={{
          link: {
            component: RouterLink,
            hrefProp: "to",
          },
        }}
      >
        <Link href="/posts">Posts</Link>
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
        <Link
          href="/posts/$postId"
          componentProps={{
            params: {
              id: "123",
            },
          }}
        >
          Read post
        </Link>
      </Theme>,
    );

    const link = screen.getByRole("link", {
      name: "Read post",
    });

    expect(link).toHaveAttribute("data-route-id", "123");
  });

  it("supports nested Theme component configurations", () => {
    render(
      <Theme
        components={{
          link: CustomLink,
        }}
      >
        <>
          <Link href="/outer">Outer</Link>

          <Theme
            components={{
              link: RouterLink,
            }}
          >
            <Link href="/inner">Inner</Link>
          </Theme>
        </>
      </Theme>,
    );

    const outerLink = screen.getByRole("link", {
      name: "Outer",
    });

    const innerLink = screen.getByRole("link", {
      name: "Inner",
    });

    expect(outerLink).toHaveAttribute("data-custom-link", "true");

    expect(innerLink).toHaveAttribute("data-router-link", "true");
  });

  it("preserves existing rel values and adds secure defaults for blank targets", () => {
    render(
      <Link href="https://example.com" target="_blank" rel="nofollow">
        External
      </Link>,
    );

    const link = screen.getByRole("link", {
      name: "External",
    });

    expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
  });

  it("renders and hydrates the configured component consistently", async () => {
    const element = (
      <Theme
        components={{
          link: {
            component: RouterLink,
            hrefProp: "to",
          },
        }}
      >
        <Link
          href="/posts/$postId"
          componentProps={{
            params: {
              id: "42",
            },
          }}
        >
          Hydrated post
        </Link>
      </Theme>
    );

    const serverMarkup = renderToString(element);

    expect(serverMarkup).toContain('href="/posts/$postId"');
    expect(serverMarkup).toContain('data-router-link="true"');

    hydrationContainer = document.createElement("div");
    hydrationContainer.innerHTML = serverMarkup;

    document.body.append(hydrationContainer);

    await act(async () => {
      root = hydrateRoot(hydrationContainer!, element);
    });

    const link = hydrationContainer.querySelector('[data-router-link="true"]');

    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", "/posts/$postId");
    expect(link).toHaveAttribute("data-route-id", "42");
  });
});
