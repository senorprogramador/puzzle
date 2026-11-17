import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AnnouncementSection } from "./announcement";
import type { AnnouncementVariant } from "./announcement.types";

const variants: AnnouncementVariant[] = [
  "bar",
  "dismissible",
  "centered",
  "split",
  "promotional",
  "countdown",
  "ticker",
  "multi-message",
  "floating",
  "minimal",
];

describe("AnnouncementSection", () => {
  it.each(variants)("renders the %s variant", (variant) => {
    const section =
      variant === "countdown" ? (
        <AnnouncementSection
          variant={variant}
          countdownTarget="2099-01-01T00:00:00Z"
          message="Launch offer"
        />
      ) : variant === "multi-message" ? (
        <AnnouncementSection
          variant={variant}
          announcements={[
            { id: "launch", message: "Launch offer" },
            { id: "shipping", message: "Free shipping" },
          ]}
        />
      ) : (
        <AnnouncementSection variant={variant} message="Launch offer" />
      );
    const { container } = render(section);

    expect(container.querySelector(`[data-variant="${variant}"]`)).not.toBeNull();
    expect(screen.getByText("Launch offer")).toBeVisible();
  });

  it("rejects an invalid countdown target", () => {
    expect(() =>
      render(
        <AnnouncementSection
          variant="countdown"
          countdownTarget="not-a-date"
          message="Launch offer"
        />,
      ),
    ).toThrow("countdownTarget must be a valid date.");
  });

  it("renders no empty message container", () => {
    const { container } = render(<AnnouncementSection message={null} />);
    expect(container.querySelector(".puzzle-announcement__message")).toBeNull();
  });

  it("dismisses only the selected message in a multi-message section", async () => {
    const user = userEvent.setup();
    render(
      <AnnouncementSection
        variant="multi-message"
        dismissible
        announcements={[
          { id: "launch", message: "Launch update" },
          { id: "shipping", message: "Shipping update" },
        ]}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Dismiss announcement" })[0]!);
    expect(screen.queryByText("Launch update")).toBeNull();
    expect(screen.getByText("Shipping update")).toBeVisible();
  });
});
