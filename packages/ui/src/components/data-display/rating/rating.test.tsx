import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { Rating } from "./index";

afterEach(() => {
  cleanup();
});

const getStars = (container: ParentNode = document) =>
  Array.from(container.querySelectorAll<HTMLElement>(".puzzle-rating__star"));

describe("Rating", () => {
  describe("rendering", () => {
    it("renders five stars by default", () => {
      const { container } = render(<Rating />);

      expect(getStars(container)).toHaveLength(5);

      expect(
        screen.getByRole("slider", { name: "Rating" }),
      ).toBeInTheDocument();
    });

    it("supports a custom maximum", () => {
      const { container } = render(<Rating max={7} />);

      expect(getStars(container)).toHaveLength(7);
    });

    it("throws when max is outside the supported range", () => {
      expect(() => render(<Rating max={0} />)).toThrow(
        "Rating max must be an integer between 1 and 10.",
      );

      expect(() => render(<Rating max={11} />)).toThrow();
      expect(() => render(<Rating max={2.5} />)).toThrow();
    });

    it("renders full, half and empty stars", () => {
      const { container } = render(<Rating value={3.5} />);

      expect(getStars(container).map((star) => star.dataset.state)).toEqual([
        "full",
        "full",
        "full",
        "half",
        "empty",
      ]);
    });

    it("supports read-only rendering", () => {
      render(<Rating value={4} readOnly aria-label="Product rating" />);

      expect(
        screen.getByRole("img", {
          name: "Product rating: 4 out of 5 stars",
        }),
      ).toBeInTheDocument();

      expect(screen.queryByRole("slider")).not.toBeInTheDocument();
    });

    it("supports disabled state", () => {
      render(<Rating disabled />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-disabled",
        "true",
      );

      expect(screen.getByRole("slider")).not.toHaveAttribute("tabindex", "0");
    });

    it("supports custom sizes and classes", () => {
      render(<Rating size="lg" className="custom-rating" />);

      expect(screen.getByRole("slider")).toHaveAttribute("data-size", "lg");

      expect(screen.getByRole("slider")).toHaveClass("custom-rating");
    });

    it("forwards root attributes", () => {
      render(<Rating data-testid="rating" />);

      expect(screen.getByTestId("rating")).toHaveClass("puzzle-rating");
    });
  });

  describe("controlled state", () => {
    it("calls onValueChange without changing a controlled value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Rating value={2} onValueChange={onValueChange} />);

      screen.getByRole("slider").focus();

      await user.keyboard("{ArrowRight}");

      expect(onValueChange).toHaveBeenCalledWith(2.5);

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "2");
    });

    it("reflects updates from the controlled parent", () => {
      const { rerender, container } = render(<Rating value={2} />);

      expect(getStars(container)[1]).toHaveAttribute("data-state", "full");

      rerender(<Rating value={4} />);

      expect(getStars(container)[3]).toHaveAttribute("data-state", "full");
    });
  });

  describe("uncontrolled state", () => {
    it("uses defaultValue", () => {
      render(<Rating defaultValue={2.5} />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "2.5",
      );
    });

    it("updates the value on keyboard interaction", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(<Rating defaultValue={2} onValueChange={onValueChange} />);

      screen.getByRole("slider").focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "2.5",
      );

      expect(onValueChange).toHaveBeenCalledWith(2.5);
    });

    it("does not change when disabled or read-only", async () => {
      const user = userEvent.setup();

      const { rerender } = render(<Rating defaultValue={2} disabled />);

      screen.getByRole("slider").focus();

      await user.keyboard("{ArrowRight}");

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "2");

      rerender(<Rating defaultValue={2} readOnly />);

      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });

  describe("pointer interaction", () => {
    const mockStarBounds = (star: HTMLElement) => {
      vi.spyOn(star, "getBoundingClientRect").mockReturnValue({
        left: 10,
        right: 30,
        top: 0,
        bottom: 20,
        width: 20,
        height: 20,
        x: 10,
        y: 0,
        toJSON: () => ({}),
      });
    };

    it("selects a whole star from its right half", () => {
      const { container } = render(<Rating />);

      const star = getStars(container)[2]!;

      mockStarBounds(star);

      fireEvent.click(star, { clientX: 25 });

      expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "3");
    });

    it("selects a half star from its left half", () => {
      const { container } = render(<Rating />);

      const star = getStars(container)[2]!;

      mockStarBounds(star);

      fireEvent.click(star, { clientX: 15 });

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "2.5",
      );
    });
  });
});
