import { Fragment } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageLayout } from "./index";

describe("PageLayout regions", () => {
  it("collects semantic regions nested in Fragments", () => {
    render(
      <PageLayout>
        <Fragment>
          <PageLayout.Header>Header content</PageLayout.Header>
          <PageLayout.Main>Main content</PageLayout.Main>
        </Fragment>
      </PageLayout>,
    );

    expect(screen.getByRole("banner")).toHaveTextContent("Header content");
    expect(screen.getByRole("main")).toHaveTextContent("Main content");
  });

  it("throws instead of silently dropping unsupported children", () => {
    expect(() =>
      render(
        <PageLayout>
          <div>Unassigned content</div>
        </PageLayout>,
      ),
    ).toThrow(
      "PageLayout only accepts Header, Main, LeftSidebar, RightSidebar, and Footer regions.",
    );
  });
});
