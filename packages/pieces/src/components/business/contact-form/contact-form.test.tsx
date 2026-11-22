import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./index";

afterEach(cleanup);

describe("ContactForm", () => {
  it("validates required fields before invoking submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Send inquiry" }));
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits typed values and supports consent", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ContactForm
        onSubmit={onSubmit}
        consent={{ label: "I agree to the privacy policy", required: true }}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: /Name/ }), "Mara Jensen");
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "mara@example.test");
    await user.type(screen.getByRole("textbox", { name: /Message/ }), "Please tell me about availability.");
    await user.click(screen.getByText("I agree to the privacy policy"));
    await user.click(screen.getByRole("button", { name: "Send inquiry" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Mara Jensen",
        email: "mara@example.test",
        message: "Please tell me about availability.",
        consent: true,
      }),
    );
  });
});
