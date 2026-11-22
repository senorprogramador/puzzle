import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocaleSwitcher } from "./index";

afterEach(cleanup);

const locales = [
  { id: "en", locale: "en", label: "English", href: "/en" },
  { id: "nl", locale: "nl", label: "Nederlands", href: "/nl" },
];

describe("LocaleSwitcher", () => {
  it("renders a keyboard-accessible dropdown with caller destinations", () => {
    render(<LocaleSwitcher currentLocale="en" locales={locales} />);
    expect(screen.getByRole("combobox", { name: "Choose language" })).toHaveValue("en");
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
