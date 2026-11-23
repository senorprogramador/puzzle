import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { page } from "vitest/browser";

import { ProjectHeader } from "./project";

it("wraps a long title and project actions without page overflow", async () => {
  const { container } = render(
    <ProjectHeader
      title={"ProjectIdentifierWithoutSpaces".repeat(4)}
      actions={
        <>
          <button type="button">Open project</button>
          <button type="button">Share project</button>
          <button type="button">Archive project</button>
        </>
      }
    />,
  );
  const header = container.querySelector("header")!;
  const title = header.querySelector("h1")!;
  const actions = header.querySelector(".puzzle-project-header__actions")!;

  for (const width of [800, 320]) {
    await page.viewport(width, 800);

    expect(title.getBoundingClientRect().right).toBeLessThanOrEqual(
      header.getBoundingClientRect().right,
    );
    expect(actions.getBoundingClientRect().right).toBeLessThanOrEqual(
      header.getBoundingClientRect().right,
    );
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
  }
});
