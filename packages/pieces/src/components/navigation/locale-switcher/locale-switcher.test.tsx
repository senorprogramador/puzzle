import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "./index";

afterEach(cleanup);

const locales = [
  { id: "en", locale: "en", label: "English", href: "/en" },
  { id: "nl", locale: "nl", label: "Nederlands", href: "/nl" },
];

describe("LocaleSwitcher", () => {
  it("renders a keyboard-accessible dropdown with caller destinations", async () => {
    const user = userEvent.setup();
    const onLocaleChange = vi.fn();
    render(
      <LocaleSwitcher
        currentLocale="en"
        locales={locales}
        onLocaleChange={onLocaleChange}
      />,
    );
    const select = screen.getByRole("combobox", { name: "Choose language" });
    expect(select).toHaveTextContent("English");
    await user.click(select);
    const option = await waitFor(() => {
      const element = Array.from(
        document.querySelectorAll<HTMLElement>('[role="option"]'),
      ).find((candidate) => candidate.getAttribute("aria-label") === "Nederlands");
      if (!element) throw new Error("The Nederlands option was not rendered.");
      return element;
    });
    fireEvent.click(option);
    expect(onLocaleChange).toHaveBeenCalledWith(locales[1]);
  });

  it("supports inline locale links and callback ownership", () => {
    const onLocaleChange = vi.fn();
    render(
      <LocaleSwitcher
        currentLocale="en"
        locales={locales}
        presentation="inline"
        onLocaleChange={onLocaleChange}
      />,
    );
    expect(screen.getByRole("link", { name: "Nederlands" })).toHaveAttribute("href", "/nl");
  });
});
