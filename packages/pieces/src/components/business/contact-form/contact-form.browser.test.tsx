import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { ContactForm } from "./index";

describe("ContactForm (browser)", () => {
  it("submits a keyboard-entered inquiry and reports success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ContactForm
        onSubmit={onSubmit}
        success="Message sent."
        consent={{ label: "I agree to the privacy policy.", required: true }}
      />,
    );

    await userEvent.fill(screen.getByRole("textbox", { name: /Name/ }), "Mara Jensen");
    await userEvent.fill(screen.getByRole("textbox", { name: /Email/ }), "mara@example.test");
    await userEvent.fill(screen.getByRole("textbox", { name: /Message/ }), "Please tell me about availability.");
    await userEvent.click(screen.getByText("I agree to the privacy policy."));
    await userEvent.click(screen.getByRole("button", { name: "Send inquiry" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(screen.getByRole("status")).toHaveTextContent("Message sent.");
    });
  });
});
