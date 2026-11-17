import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WaitlistSection } from "./waitlist-section";

describe("WaitlistSection", () => {
  it("submits a validated email and announces success", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {});
    render(
      <WaitlistSection
        title="Get early access"
        variant="early-access"
        onSubmit={onSubmit}
        countdown={{ days: 12, hours: 3, minutes: 20 }}
        progress={{ value: 240, max: 500, label: "240 founders already joined" }}
        socialProof={<p>Join teams building better workspaces.</p>}
        referralInfo={<p>Invite a colleague after you join.</p>}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "alex@example.com");
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));

    expect(onSubmit).toHaveBeenCalledWith("alex@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "You are on the list.",
    );
    expect(screen.getByRole("group", { name: "Launch countdown" })).toBeVisible();
    expect(screen.getByRole("progressbar", { name: "240 founders already joined" })).toHaveAttribute(
      "aria-valuenow",
      "48",
    );
  });

  it("shows an explicit submission error and supports a caller signup slot", async () => {
    const user = userEvent.setup();
    render(
      <WaitlistSection
        title="Join the preview"
        onSubmit={async () => {
          throw new Error("The list is temporarily unavailable.");
        }}
      />,
    );

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "sam@example.com");
    await user.click(screen.getByRole("button", { name: "Join the waitlist" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The list is temporarily unavailable.",
    );

    render(
      <WaitlistSection
        title="Custom signup"
        signup={<button type="button">Continue with your account</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Continue with your account" }),
    ).toBeVisible();
  });

  it("rejects invalid progress data instead of silently clamping it", () => {
    expect(() =>
      render(
        <WaitlistSection
          title="Invalid progress"
          progress={{ value: 110, max: 100 }}
        />,
      ),
    ).toThrow(RangeError);
  });

  it("disables the submit action while externally loading", () => {
    render(
      <WaitlistSection title="Join" onSubmit={() => {}} loading />,
    );
    expect(screen.getByRole("button", { name: "Joining…" })).toBeDisabled();
    expect(
      screen.getByRole("heading", { name: "Join" }).closest("section"),
    ).toHaveAttribute("aria-busy", "true");
  });
});
