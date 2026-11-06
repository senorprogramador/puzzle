import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Avatar } from "./index";

afterEach(() => {
  cleanup();
});

describe("Avatar", () => {
  it("exposes the initials fallback as a named image", () => {
    render(<Avatar alt="Ada Lovelace" />);

    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeTruthy();
  });

  it("keeps sizes below 32px", () => {
    render(<Avatar alt="Ada Lovelace" size={20} />);

    expect(screen.getByRole("img")).toHaveStyle({ width: "20px", height: "20px" });
  });

  it("falls back to initials when the image fails to load", () => {
    render(<Avatar src="/missing.png" alt="Ada Lovelace" />);

    fireEvent.error(screen.getByRole("img"));

    expect(screen.getByRole("img", { name: "Ada Lovelace" }).tagName).toBe("SPAN");
  });

  it("renders an image with its alt text when a source is given", () => {
    render(<Avatar src="/ada.png" alt="Ada Lovelace" size={48} />);

    const image = screen.getByRole("img", { name: "Ada Lovelace" });

    expect(image.tagName).toBe("IMG");
    expect(image).toHaveAttribute("width", "48");
  });

  it("still calls the consumer's onError", () => {
    const onError = vi.fn();

    render(<Avatar src="/missing.png" alt="Ada" onError={onError} />);
    fireEvent.error(screen.getByRole("img"));

    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("retries when the source changes after a failure", () => {
    const { rerender } = render(<Avatar src="/missing.png" alt="Ada" />);

    fireEvent.error(screen.getByRole("img"));
    rerender(<Avatar src="/new.png" alt="Ada" />);

    expect(screen.getByRole("img").tagName).toBe("IMG");
  });

  it("hides a decorative fallback without alt text", () => {
    const { container } = render(<Avatar />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("shows initials derived from the name", () => {
    render(<Avatar alt="Ada Lovelace" />);

    expect(screen.getByText("AL")).toBeTruthy();
  });

  it("applies the shape class", () => {
    render(<Avatar alt="Ada" shape="square" />);

    expect(screen.getByRole("img")).toHaveClass("puzzle-avatar-square");
  });
});
