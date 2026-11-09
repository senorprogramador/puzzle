import { cleanup, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { userEvent as browserUserEvent } from "vitest/browser";

import { FormField } from "../form-field";
import { TokenInput } from "./index";

afterEach(() => {
  cleanup();
});

const getSlots = () =>
  Array.from(
    document.querySelectorAll<HTMLInputElement>(".puzzle-token-input__slot"),
  );

const getValue = () =>
  getSlots()
    .map((slot) => slot.value)
    .join("");

describe("TokenInput (browser)", () => {
  describe("keyboard navigation", () => {
    it("allows tab navigation into and out of the component", async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before</button>

          <TokenInput label="Verification code" />

          <button type="button">After</button>
        </>,
      );

      const before = screen.getByRole("button", {
        name: "Before",
      });

      const after = screen.getByRole("button", {
        name: "After",
      });

      await user.tab();

      expect(before).toHaveFocus();

      await user.tab();

      expect(getSlots()[0]).toHaveFocus();

      await user.tab();

      expect(after).toHaveFocus();
    });

    it("supports reverse tab navigation", async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before</button>

          <TokenInput label="Verification code" />

          <button type="button">After</button>
        </>,
      );

      const before = screen.getByRole("button", {
        name: "Before",
      });

      const after = screen.getByRole("button", {
        name: "After",
      });

      after.focus();

      await user.tab({ shift: true });

      expect(getSlots()[0]).toHaveFocus();

      await user.tab({ shift: true });

      expect(before).toHaveFocus();
    });

    it("supports actual browser keyboard input", async () => {
      render(<TokenInput label="Verification code" />);

      await browserUserEvent.click(getSlots()[0]!);

      expect(getSlots()[0]).toHaveFocus();

      await browserUserEvent.keyboard("1");

      expect(getValue()).toBe("1");
      expect(getSlots()[1]).toHaveFocus();

      await browserUserEvent.keyboard("2");

      expect(getValue()).toBe("12");
      expect(getSlots()[2]).toHaveFocus();
    });

    it("supports native keyboard navigation between slots", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123" />);

      getSlots()[2]?.focus();

      await browserUserEvent.keyboard("{ArrowLeft}");

      expect(getSlots()[1]).toHaveFocus();

      await browserUserEvent.keyboard("{Home}");

      expect(getSlots()[0]).toHaveFocus();

      await browserUserEvent.keyboard("{End}");

      expect(getSlots()[5]).toHaveFocus();
    });

    it("keeps only one slot in the browser tab order", () => {
      render(<TokenInput label="Verification code" />);

      const slots = getSlots();

      expect(slots.filter((slot) => slot.tabIndex === 0)).toHaveLength(1);

      expect(slots.filter((slot) => slot.tabIndex === -1)).toHaveLength(5);
    });

    it("does not receive keyboard focus when disabled", async () => {
      const user = userEvent.setup();

      render(
        <>
          <button type="button">Before</button>

          <TokenInput label="Verification code" disabled />

          <button type="button">After</button>
        </>,
      );

      const before = screen.getByRole("button", {
        name: "Before",
      });

      const after = screen.getByRole("button", {
        name: "After",
      });

      await user.tab();

      expect(before).toHaveFocus();

      await user.tab();

      expect(after).toHaveFocus();
    });
  });

  describe("pointer and focus", () => {
    it("supports clicking individual slots", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[3]!);

      expect(getSlots()[3]).toHaveFocus();
    });

    it("updates the active tab stop after pointer interaction", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[3]!);

      expect(getSlots()[3]).toHaveAttribute("tabindex", "0");

      expect(getSlots()[0]).toHaveAttribute("tabindex", "-1");
    });

    it("selects the current character on focus", async () => {
      render(<TokenInput label="Verification code" defaultValue="123456" />);

      getSlots()[2]?.focus();

      expect(getSlots()[2]).toHaveFocus();
      expect(getSlots()[2]?.selectionStart).toBe(0);
      expect(getSlots()[2]?.selectionEnd).toBe(1);
    });

    it("shows a visible focus indicator for keyboard users", async () => {
      const { container } = render(
        <>
          <button type="button">Before</button>
          <TokenInput label="Verification code" />
        </>,
      );

      const root = container.querySelector<HTMLElement>(".puzzle-token-input")!;
      root.style.setProperty("--puzzle-color-ring", "rgb(12, 34, 56)");

      await browserUserEvent.click(screen.getByRole("button", { name: "Before" }));
      await browserUserEvent.keyboard("{Tab}");

      expect(getSlots()[0]).toHaveFocus();

      expect(getComputedStyle(getSlots()[0]!).outlineStyle).toBe("solid");
    });

    it("uses manipulation touch behavior on the native inputs", () => {
      render(<TokenInput label="Verification code" />);

      expect(getComputedStyle(getSlots()[0]!).touchAction).toBe("manipulation");
    });
  });

  describe("labels and form integration", () => {
    it("focuses the first input when the visible label is clicked", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(screen.getByText("Verification code"));

      expect(getSlots()[0]).toHaveFocus();
    });

    it("focuses the first input through FormField", async () => {
      const user = userEvent.setup();

      render(
        <FormField label="Authenticator code">
          <TokenInput />
        </FormField>,
      );

      await user.click(screen.getByText("Authenticator code"));

      expect(getSlots()[0]).toHaveFocus();
    });

    it("associates all character inputs with the field description", () => {
      render(
        <FormField
          label="Authenticator code"
          description="Enter your current code."
        >
          <TokenInput />
        </FormField>,
      );

      for (const slot of getSlots()) {
        expect(slot).toHaveAccessibleDescription("Enter your current code.");
      }
    });

    it("integrates with native required form validation", () => {
      const { container } = render(
        <form>
          <TokenInput label="Verification code" name="code" required />
        </form>,
      );

      const form = container.querySelector("form")!;

      expect(form.checkValidity()).toBe(false);
    });

    it("passes native validation when all required slots are filled", () => {
      const { container } = render(
        <form>
          <TokenInput
            label="Verification code"
            name="code"
            defaultValue="123456"
            required
          />
        </form>,
      );

      const form = container.querySelector("form")!;

      expect(form.checkValidity()).toBe(true);

      expect(new FormData(form).get("code")).toBe("123456");
    });

    it("does not validate disabled slots", () => {
      const { container } = render(
        <form>
          <TokenInput label="Verification code" name="code" required disabled />
        </form>,
      );

      const form = container.querySelector("form")!;

      expect(form.checkValidity()).toBe(true);
      expect(new FormData(form).has("code")).toBe(false);
    });
  });

  describe("layout", () => {
    it("renders all slots with consistent dimensions", () => {
      render(<TokenInput label="Verification code" />);

      const rects = getSlots().map((slot) => slot.getBoundingClientRect());

      expect(rects).toHaveLength(6);

      for (const rect of rects) {
        expect(rect.width).toBeGreaterThan(0);
        expect(rect.height).toBeGreaterThan(0);
        expect(rect.height).toBe(rects[0]?.height);
        expect(rect.width).toBe(rects[0]?.width);
      }
    });

    it("keeps the slots in a single non-overlapping row", () => {
      render(<TokenInput label="Verification code" />);

      const rects = getSlots().map((slot) => slot.getBoundingClientRect());

      for (let index = 1; index < rects.length; index++) {
        expect(rects[index]!.left).toBeGreaterThan(rects[index - 1]!.right);
      }
    });

    it("fits within a narrow form container", () => {
      const { container } = render(
        <div style={{ width: "300px" }}>
          <TokenInput label="Verification code" />
        </div>,
      );

      const wrapper = container.firstElementChild as HTMLElement;
      const tokenInput = container.querySelector(
        ".puzzle-token-input",
      ) as HTMLElement;

      expect(tokenInput.getBoundingClientRect().width).toBeLessThanOrEqual(
        wrapper.getBoundingClientRect().width,
      );
    });

    it("keeps the visual layout consistent for different sizes", () => {
      const { rerender } = render(<TokenInput label="PIN" size="sm" />);

      const smallHeight = getSlots()[0]!.getBoundingClientRect().height;

      rerender(<TokenInput label="PIN" size="md" />);

      const mediumHeight = getSlots()[0]!.getBoundingClientRect().height;

      rerender(<TokenInput label="PIN" size="lg" />);

      const largeHeight = getSlots()[0]!.getBoundingClientRect().height;

      expect(smallHeight).toBeLessThan(mediumHeight);
      expect(mediumHeight).toBeLessThan(largeHeight);
    });

    it("keeps all slots visible while masking characters", () => {
      render(
        <TokenInput label="Verification code" defaultValue="123456" mask />,
      );

      for (const slot of getSlots()) {
        expect(slot.getBoundingClientRect().width).toBeGreaterThan(0);
        expect(slot).toHaveAttribute("type", "password");
      }
    });
  });

  describe("browser event behavior", () => {
    it("supports pointer interaction without changing the active value", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[3]!);

      expect(getSlots()[3]).toHaveFocus();
      expect(getValue()).toBe("123456");
    });

    it("supports real browser paste interaction", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[0]!);
      await user.paste("012345");

      expect(getValue()).toBe("012345");
    });

    it("supports actual browser deletion", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      getSlots()[2]?.focus();

      await browserUserEvent.keyboard("{Backspace}");

      expect(getValue()).toBe("12456");
    });

    it("does not modify read-only values through browser keyboard input", async () => {
      render(
        <TokenInput label="Verification code" defaultValue="123456" readOnly />,
      );

      getSlots()[0]?.focus();

      await browserUserEvent.keyboard("{Backspace}");

      expect(getValue()).toBe("123456");
    });
  });

  describe("completion", () => {
    it("calls onComplete when the browser fills a complete token", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(<TokenInput label="Verification code" onComplete={onComplete} />);

      await user.click(getSlots()[0]!);
      await user.paste("123456");

      expect(getValue()).toBe("123456");
      expect(onComplete).toHaveBeenCalledWith("123456");
    });
  });
});
