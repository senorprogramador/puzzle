import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import { afterEach, describe, expect, it, vi } from "vitest";

import { FormField } from "../form-field";
import { TokenInput } from "./index";

afterEach(() => {
  cleanup();
});

const getSlots = (container: ParentNode = document) =>
  Array.from(
    container.querySelectorAll<HTMLInputElement>(".puzzle-token-input__slot"),
  );

const getValue = (container: ParentNode = document) =>
  getSlots(container)
    .map((slot) => slot.value)
    .join("");

describe("TokenInput", () => {
  describe("rendering", () => {
    it("renders six numeric slots by default", () => {
      render(<TokenInput label="Verification code" />);

      expect(
        screen.getByRole("group", {
          name: "Verification code",
        }),
      ).toBeInTheDocument();

      expect(getSlots()).toHaveLength(6);
    });

    it("supports custom lengths", () => {
      const { container } = render(<TokenInput label="PIN" length={4} />);

      expect(getSlots(container)).toHaveLength(4);
    });

    it("supports a single character", () => {
      const { container } = render(<TokenInput label="PIN" length={1} />);

      expect(getSlots(container)).toHaveLength(1);
    });

    it("supports the maximum length of 32", () => {
      const { container } = render(<TokenInput length={32} />);

      expect(getSlots(container)).toHaveLength(32);
    });

    it("throws for a zero length", () => {
      expect(() => render(<TokenInput length={0} />)).toThrow(
        "TokenInput length must be an integer between 1 and 32.",
      );
    });

    it("throws for a negative length", () => {
      expect(() => render(<TokenInput length={-1} />)).toThrow();
    });

    it("throws for a length greater than 32", () => {
      expect(() => render(<TokenInput length={33} />)).toThrow();
    });

    it("throws for a non-integer length", () => {
      expect(() => render(<TokenInput length={2.5} />)).toThrow();
    });

    it("forwards root attributes", () => {
      render(
        <TokenInput label="Verification code" data-testid="token-input" />,
      );

      expect(screen.getByTestId("token-input")).toHaveClass(
        "puzzle-token-input",
      );
    });

    it("merges custom root classes", () => {
      render(<TokenInput label="Verification code" className="custom-class" />);

      expect(screen.getByRole("group")).toHaveClass(
        "puzzle-token-input",
        "custom-class",
      );
    });

    it("exposes the selected size through a data attribute", () => {
      const { rerender } = render(<TokenInput label="PIN" size="sm" />);

      expect(screen.getByRole("group")).toHaveAttribute("data-size", "sm");

      rerender(<TokenInput label="PIN" size="md" />);

      expect(screen.getByRole("group")).toHaveAttribute("data-size", "md");

      rerender(<TokenInput label="PIN" size="lg" />);

      expect(screen.getByRole("group")).toHaveAttribute("data-size", "lg");
    });
  });

  describe("initial values", () => {
    it("supports defaultValue", () => {
      render(<TokenInput label="Verification code" defaultValue="123" />);

      expect(getValue()).toBe("123");
    });

    it("normalizes defaultValue", () => {
      render(<TokenInput label="Verification code" defaultValue="12a34" />);

      expect(getValue()).toBe("1234");
    });

    it("preserves leading zeroes", () => {
      render(<TokenInput label="Verification code" defaultValue="012345" />);

      expect(getValue()).toBe("012345");
    });

    it("truncates defaultValue to the configured length", () => {
      render(<TokenInput length={4} defaultValue="123456" />);

      expect(getValue()).toBe("1234");
    });

    it("does not call onComplete when initialized with a complete token", () => {
      const onComplete = vi.fn();

      render(<TokenInput defaultValue="123456" onComplete={onComplete} />);

      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe("controlled state", () => {
    it("supports controlled values", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <TokenInput
          label="Verification code"
          value="12"
          onValueChange={onValueChange}
        />,
      );

      await user.click(getSlots()[2]!);
      await user.keyboard("3");

      expect(onValueChange).toHaveBeenCalledWith("123");

      // The parent has not updated the controlled value.
      expect(getValue()).toBe("12");
    });

    it("reflects controlled value updates from the parent", () => {
      const { rerender } = render(
        <TokenInput label="Verification code" value="12" />,
      );

      expect(getValue()).toBe("12");

      rerender(<TokenInput label="Verification code" value="123456" />);

      expect(getValue()).toBe("123456");
    });

    it("supports clearing a controlled value", () => {
      const { rerender } = render(
        <TokenInput label="Verification code" value="123456" />,
      );

      rerender(<TokenInput label="Verification code" value="" />);

      expect(getValue()).toBe("");
    });
  });

  describe("uncontrolled state", () => {
    it("updates its value when typing", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <TokenInput label="Verification code" onValueChange={onValueChange} />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123");

      expect(getValue()).toBe("123");
      expect(onValueChange).toHaveBeenLastCalledWith("123");
    });

    it("calls onValueChange with a complete string", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <TokenInput label="Verification code" onValueChange={onValueChange} />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123456");

      expect(onValueChange).toHaveBeenLastCalledWith("123456");
    });

    it("supports replacing an existing character", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123" />);

      await user.click(getSlots()[0]!);
      await user.keyboard("9");

      expect(getValue()).toBe("923");
    });

    it("supports changing values after deletion", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[2]!);
      await user.keyboard("{Backspace}");

      expect(getValue()).toBe("12456");

      getSlots()[2]?.select();
      await user.keyboard("9");

      expect(getValue()).toBe("12956");
    });
  });

  describe("character input", () => {
    it("automatically advances focus", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[0]!);
      await user.keyboard("1");

      expect(getSlots()[1]).toHaveFocus();

      await user.keyboard("2");

      expect(getSlots()[2]).toHaveFocus();
    });

    it("does not advance past the final slot", async () => {
      const user = userEvent.setup();

      render(<TokenInput length={2} defaultValue="1" />);

      await user.click(getSlots()[1]!);
      await user.keyboard("2");

      expect(getSlots()[1]).toHaveFocus();
    });

    it("replaces an existing character when typing into a filled slot", async () => {
      const user = userEvent.setup();

      render(<TokenInput defaultValue="123456" label="Verification code" />);

      await user.click(getSlots()[2]!);
      await user.keyboard("9");

      expect(getValue()).toBe("129456");
    });

    it("ignores non-numeric characters in numeric mode", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[0]!);
      await user.keyboard("a");

      expect(getValue()).toBe("");
    });

    it("supports numeric input mode", () => {
      render(<TokenInput label="Verification code" />);

      expect(getSlots()[0]).toHaveAttribute("inputmode", "numeric");
    });

    it("supports alphanumeric input mode", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Recovery code" mode="alphanumeric" />);

      await user.click(getSlots()[0]!);
      await user.keyboard("Ab12");

      expect(getValue()).toBe("Ab12");
    });

    it("supports custom inputMode", () => {
      render(<TokenInput label="Verification code" inputMode="text" />);

      expect(getSlots()[0]).toHaveAttribute("inputmode", "text");
    });
  });

  describe("focus management", () => {
    it("makes only one slot part of the tab order", () => {
      const { container } = render(<TokenInput label="Verification code" />);

      const slots = getSlots(container);

      expect(slots.filter((slot) => slot.tabIndex === 0)).toHaveLength(1);

      expect(slots.filter((slot) => slot.tabIndex === -1)).toHaveLength(5);
    });

    it("starts at the first empty position", () => {
      const { container } = render(<TokenInput defaultValue="123" />);

      const slots = getSlots(container);

      expect(slots.findIndex((slot) => slot.tabIndex === 0)).toBe(3);
    });

    it("starts at the last position for a complete token", () => {
      const { container } = render(<TokenInput defaultValue="123456" />);

      const slots = getSlots(container);

      expect(slots.findIndex((slot) => slot.tabIndex === 0)).toBe(5);
    });

    it("updates the active tab stop when another slot receives focus", async () => {
      const user = userEvent.setup();

      const { container } = render(<TokenInput label="Verification code" />);

      await user.click(getSlots(container)[3]!);

      expect(getSlots(container)[3]).toHaveFocus();
      expect(getSlots(container)[3]).toHaveAttribute("tabindex", "0");

      expect(getSlots(container)[0]).toHaveAttribute("tabindex", "-1");
    });

    it("supports arrow key navigation", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      getSlots()[2]?.focus();

      await user.keyboard("{ArrowLeft}");

      expect(getSlots()[1]).toHaveFocus();

      await user.keyboard("{ArrowLeft}");

      expect(getSlots()[0]).toHaveFocus();

      await user.keyboard("{ArrowRight}");

      expect(getSlots()[1]).toHaveFocus();
    });

    it("supports Home and End navigation", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      getSlots()[3]?.focus();

      await user.keyboard("{Home}");

      expect(getSlots()[0]).toHaveFocus();

      await user.keyboard("{End}");

      expect(getSlots()[5]).toHaveFocus();
    });

    it("supports navigation at the boundaries", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      getSlots()[0]?.focus();

      await user.keyboard("{ArrowLeft}");

      expect(getSlots()[0]).toHaveFocus();

      await user.keyboard("{End}");
      await user.keyboard("{ArrowRight}");

      expect(getSlots()[5]).toHaveFocus();
    });
  });

  describe("deletion", () => {
    it("supports Backspace on a filled slot", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <TokenInput
          label="Verification code"
          defaultValue="123456"
          onValueChange={onValueChange}
        />,
      );

      getSlots()[2]?.focus();

      await user.keyboard("{Backspace}");

      expect(getValue()).toBe("12456");
      expect(getSlots()[2]).toHaveFocus();

      expect(onValueChange).toHaveBeenCalledWith("12456");
    });

    it("supports Backspace on an empty slot", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123" />);

      getSlots()[3]?.focus();

      await user.keyboard("{Backspace}");

      expect(getValue()).toBe("12");
      expect(getSlots()[2]).toHaveFocus();
    });

    it("removes the first character without moving before the first slot", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123" />);

      getSlots()[0]?.focus();

      await user.keyboard("{Backspace}");

      expect(getValue()).toBe("23");
      expect(getSlots()[0]).toHaveFocus();
    });

    it("supports Delete", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      getSlots()[2]?.focus();

      await user.keyboard("{Delete}");

      expect(getValue()).toBe("12456");
      expect(getSlots()[2]).toHaveFocus();
    });

    it("does not change the value when deleting an empty slot", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="12" />);

      getSlots()[5]?.focus();

      await user.keyboard("{Delete}");

      expect(getValue()).toBe("12");
    });
  });

  describe("clipboard and autofill", () => {
    it("supports pasting a complete token", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[0]!);
      await user.paste("123456");

      expect(getValue()).toBe("123456");
    });

    it("replaces the complete token when pasted into any position", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[3]!);
      await user.paste("987654");

      expect(getValue()).toBe("987654");
    });

    it("supports partial pasting", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[2]!);
      await user.paste("99");

      expect(getValue()).toBe("129956");
    });

    it("replaces the current position when pasting one character", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[2]!);
      await user.paste("9");

      expect(getValue()).toBe("129456");
    });

    it("ignores invalid characters in pasted values", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" />);

      await user.click(getSlots()[0]!);
      await user.paste("12-34 56");

      expect(getValue()).toBe("123456");
    });

    it("does not modify the token when pasting invalid content", async () => {
      const user = userEvent.setup();

      render(<TokenInput label="Verification code" defaultValue="123456" />);

      await user.click(getSlots()[2]!);
      await user.paste("abcdef");

      expect(getValue()).toBe("123456");
    });

    it("supports browser autofill inserting a complete token", () => {
      const onComplete = vi.fn();

      render(<TokenInput label="Verification code" onComplete={onComplete} />);

      fireEvent.change(getSlots()[0]!, {
        target: { value: "123456" },
      });

      expect(getValue()).toBe("123456");
      expect(onComplete).toHaveBeenCalledWith("123456");
    });

    it("supports autofill inserting a complete token from another slot", () => {
      render(<TokenInput label="Verification code" defaultValue="123456" />);

      fireEvent.change(getSlots()[3]!, {
        target: { value: "987654" },
      });

      expect(getValue()).toBe("987654");
    });

    it("uses one-time-code autocomplete on the first input only", () => {
      render(<TokenInput label="Verification code" />);

      expect(getSlots()[0]).toHaveAttribute("autocomplete", "one-time-code");

      for (const slot of getSlots().slice(1)) {
        expect(slot).toHaveAttribute("autocomplete", "off");
      }
    });

    it("supports a custom autocomplete value", () => {
      render(<TokenInput label="Verification code" autoComplete="off" />);

      expect(getSlots()[0]).toHaveAttribute("autocomplete", "off");
    });

    it("preserves leading zeroes during autofill", () => {
      render(<TokenInput label="Verification code" />);

      fireEvent.change(getSlots()[0]!, {
        target: { value: "012345" },
      });

      expect(getValue()).toBe("012345");
    });
  });

  describe("completion", () => {
    it("calls onComplete when the token becomes complete", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <TokenInput
          length={3}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123");

      expect(onComplete).toHaveBeenCalledWith("123");
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("does not call onComplete for incomplete values", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <TokenInput
          length={6}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123");

      expect(onComplete).not.toHaveBeenCalled();
    });

    it("calls onComplete again after the token becomes incomplete and complete", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <TokenInput
          length={3}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123");

      expect(onComplete).toHaveBeenCalledTimes(1);

      await user.keyboard("{Backspace}");
      await user.keyboard("3");

      expect(onComplete).toHaveBeenCalledTimes(2);
    });

    it("does not call onComplete again when the same complete value is submitted repeatedly", async () => {
      const onComplete = vi.fn();

      render(
        <TokenInput
          length={3}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      fireEvent.change(getSlots()[0]!, {
        target: { value: "123" },
      });

      expect(onComplete).toHaveBeenCalledTimes(1);

      fireEvent.change(getSlots()[2]!, {
        target: { value: "123" },
      });

      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("does not call onComplete when a complete token is merely edited", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      render(
        <TokenInput
          length={3}
          label="Verification code"
          defaultValue="123"
          onComplete={onComplete}
        />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("9");

      expect(onComplete).not.toHaveBeenCalled();
    });

    it("does not call onComplete again after a normal rerender", async () => {
      const user = userEvent.setup();
      const onComplete = vi.fn();

      const { rerender } = render(
        <TokenInput
          length={3}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      await user.click(getSlots()[0]!);
      await user.keyboard("123");

      expect(onComplete).toHaveBeenCalledTimes(1);

      rerender(
        <TokenInput
          length={3}
          label="Verification code"
          onComplete={onComplete}
        />,
      );

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe("read-only and disabled states", () => {
    it("disables every slot", () => {
      render(<TokenInput label="Verification code" disabled />);

      for (const slot of getSlots()) {
        expect(slot).toBeDisabled();
      }

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    it("supports read-only slots", async () => {
      const user = userEvent.setup();

      render(
        <TokenInput label="Verification code" defaultValue="123" readOnly />,
      );

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("readonly");
      }

      getSlots()[1]?.focus();

      await user.keyboard("{ArrowRight}");

      expect(getSlots()[2]).toHaveFocus();

      await user.keyboard("{Backspace}");

      expect(getValue()).toBe("123");
    });

    it("does not change values while disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <TokenInput
          label="Verification code"
          defaultValue="123"
          disabled
          onValueChange={onValueChange}
        />,
      );

      expect(onValueChange).not.toHaveBeenCalled();
      expect(getValue()).toBe("123");

      await user.click(getSlots()[0]!);

      expect(getValue()).toBe("123");
    });
  });

  describe("masking", () => {
    it("renders password inputs when masking is enabled", () => {
      render(<TokenInput label="Verification code" defaultValue="123" mask />);

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("type", "password");
      }

      expect(getValue()).toBe("123");
    });

    it("renders text inputs by default", () => {
      render(<TokenInput label="Verification code" />);

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("type", "text");
      }
    });
  });

  describe("validation and accessibility", () => {
    it("associates the group with its visible label", () => {
      render(<TokenInput label="Verification code" />);

      expect(
        screen.getByRole("group", {
          name: "Verification code",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("textbox", { name: "Verification code" }),
      ).toBe(getSlots()[0]);
    });

    it("supports an accessible group label without a visible label", () => {
      render(<TokenInput aria-label="Security code" />);

      expect(
        screen.getByRole("group", {
          name: "Security code",
        }),
      ).toBeInTheDocument();

      expect(getSlots()[0]).toHaveAttribute(
        "aria-label",
        "Security code, character 1 of 6",
      );
    });

    it("labels the individual character positions", () => {
      render(<TokenInput aria-label="Security code" />);

      expect(getSlots()[0]).toHaveAttribute(
        "aria-label",
        "Security code, character 1 of 6",
      );

      expect(getSlots()[2]).toHaveAttribute(
        "aria-label",
        "Security code, character 3 of 6",
      );
    });

    it("supports aria-labelledby", () => {
      render(
        <>
          <span id="external-label">Security code</span>
          <TokenInput aria-labelledby="external-label" />
        </>,
      );

      expect(
        screen.getByRole("group", {
          name: "Security code",
        }),
      ).toBeInTheDocument();
    });

    it("supports required state on every slot", () => {
      render(<TokenInput label="Verification code" required />);

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-required",
        "true",
      );

      for (const slot of getSlots()) {
        expect(slot).toBeRequired();
      }
    });

    it("supports invalid state", () => {
      render(<TokenInput label="Verification code" aria-invalid="true" />);

      expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("aria-invalid", "true");
      }
    });

    it("supports described-by relationships", () => {
      render(
        <>
          <p id="code-description">Enter your authenticator code.</p>

          <TokenInput
            label="Verification code"
            aria-describedby="code-description"
          />
        </>,
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-describedby",
        "code-description",
      );

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("aria-describedby", "code-description");
      }
    });

    it("preserves consumer keydown handlers", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(
        <TokenInput
          label="Verification code"
          onKeyDown={(event) => {
            onKeyDown(event.key);

            if (event.key === "ArrowRight") {
              event.preventDefault();
            }
          }}
        />,
      );

      getSlots()[0]?.focus();

      await user.keyboard("{ArrowRight}");

      expect(onKeyDown).toHaveBeenCalledWith("ArrowRight");
      expect(getSlots()[0]).toHaveFocus();
    });
  });

  describe("form integration", () => {
    it("submits the complete token as one form value", () => {
      const { container } = render(
        <form>
          <TokenInput
            label="Verification code"
            name="code"
            defaultValue="012345"
          />
        </form>,
      );

      const formElement = container.querySelector("form")!;

      expect(new FormData(formElement).get("code")).toBe("012345");
    });

    it("does not submit a disabled token", () => {
      const { container } = render(
        <form>
          <TokenInput
            label="Verification code"
            name="code"
            defaultValue="123456"
            disabled
          />
        </form>,
      );

      const formElement = container.querySelector("form")!;

      expect(new FormData(formElement).has("code")).toBe(false);
    });

    it("supports explicit form association", () => {
      render(
        <>
          <form id="verification-form" />

          <TokenInput
            label="Verification code"
            name="code"
            form="verification-form"
            defaultValue="123456"
          />
        </>,
      );

      const hiddenInput = document.querySelector<HTMLInputElement>(
        'input[type="hidden"][name="code"]',
      );

      expect(hiddenInput).toHaveAttribute("form", "verification-form");
    });

    it("does not expose the hidden input to assistive technology", () => {
      render(
        <TokenInput
          label="Verification code"
          name="code"
          defaultValue="123456"
        />,
      );

      expect(
        screen.queryByRole("textbox", { name: "code" }),
      ).not.toBeInTheDocument();
    });

    it("associates FormField labels with the first native input", () => {
      render(
        <FormField label="Authenticator code">
          <TokenInput />
        </FormField>,
      );

      expect(screen.getByLabelText("Authenticator code")).toBe(getSlots()[0]);
    });

    it("integrates with FormField descriptions", () => {
      render(
        <FormField
          label="Authenticator code"
          description="Enter the six-digit code from your authenticator app."
        >
          <TokenInput />
        </FormField>,
      );

      const firstInput = getSlots()[0];

      expect(firstInput).toHaveAccessibleDescription(
        "Enter the six-digit code from your authenticator app.",
      );

      expect(screen.getByRole("group")).toHaveAttribute("aria-describedby");
    });

    it("integrates with FormField validation", () => {
      render(
        <FormField
          label="Authenticator code"
          description="Enter your code."
          error="The verification code is invalid."
        >
          <TokenInput />
        </FormField>,
      );

      expect(screen.getByRole("group")).toHaveAttribute("aria-invalid", "true");

      for (const slot of getSlots()) {
        expect(slot).toHaveAttribute("aria-invalid", "true");
      }

      expect(getSlots()[0]).toHaveAccessibleDescription(/Enter your code/);

      expect(
        screen.getByText("The verification code is invalid."),
      ).toBeInTheDocument();
    });

    it("integrates with FormField required state", () => {
      render(
        <FormField label="Authenticator code" required>
          <TokenInput />
        </FormField>,
      );

      for (const slot of getSlots()) {
        expect(slot).toBeRequired();
      }
    });

    it("integrates with FormField disabled state", () => {
      render(
        <FormField label="Authenticator code" disabled>
          <TokenInput />
        </FormField>,
      );

      for (const slot of getSlots()) {
        expect(slot).toBeDisabled();
      }
    });
  });

  describe("refs", () => {
    it("forwards its ref to the first native input", () => {
      let input: HTMLInputElement | null = null;

      render(
        <TokenInput
          label="Verification code"
          ref={(node) => {
            input = node;
          }}
        />,
      );

      expect(input).toBe(getSlots()[0]);
    });

    it("supports object refs", () => {
      const ref: { current: HTMLInputElement | null } = {
        current: null,
      };

      render(<TokenInput label="Verification code" ref={ref} />);

      expect(ref.current).toBe(getSlots()[0]);
    });
  });
});
