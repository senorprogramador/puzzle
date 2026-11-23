import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./index";

describe("Avatar browser behavior", () => {
  it("crops photos and keeps the requested outer dimensions", () => {
    render(
      <Avatar
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3C/svg%3E"
        alt="Ada Lovelace"
        size={48}
      />,
    );

    const image = screen.getByRole("img", { name: "Ada Lovelace" });

    expect(getComputedStyle(image).objectFit).toBe("cover");
    expect(image.getBoundingClientRect().width).toBe(48);
    expect(image.getBoundingClientRect().height).toBe(48);
  });
});
