import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { TeamSection } from "./team-section";

afterEach(cleanup);

describe("business section responsive layouts", () => {
  it("adapts the team grid from one mobile column to a wider desktop grid", async () => {
    const members = Array.from({ length: 4 }, (_, index) => ({
      id: `person-${index}`,
      name: `Person ${index}`,
      role: "Consultant",
    }));
    const { container } = render(<TeamSection items={members} />);
    const list = container.querySelector(".puzzle-team-section__members");

    expect(list).not.toBeNull();
    await page.viewport(375, 800);
    expect(getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/)).toHaveLength(
      1,
    );

    await page.viewport(1200, 800);
    expect(
      getComputedStyle(list!).gridTemplateColumns.trim().split(/\s+/).length,
    ).toBeGreaterThan(1);
  });
});
