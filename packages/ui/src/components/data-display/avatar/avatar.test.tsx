import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
