import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { page } from "vitest/browser";
import { ContactDetails } from "./index";

afterEach(cleanup);

it("wraps long contact values without causing mobile page overflow", async () => {
  await page.viewport(320, 800);
  const { container } = render(
    <ContactDetails
      items={[
        {
          id: "press",
          label: "Press",
          value: "press@northstar.example",
        },
      ]}
    />,
  );
  const value = container.querySelector("dd")!;

  expect(getComputedStyle(value).overflowWrap).toBe("anywhere");
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
    document.documentElement.clientWidth,
  );
});
