import { fireEvent, render, screen } from "@testing-library/react";

import { describe, expect, it, vi } from "vitest";

import { ResizablePanels } from "./index";

describe("ResizablePanels", () => {
  it("renders two panels with an accessible resize handle", () => {
    render(
      <ResizablePanels aria-label="Workspace">
        <ResizablePanels.Panel>Explorer</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel>Editor</ResizablePanels.Panel>
      </ResizablePanels>,
    );

    expect(
      screen.getByRole("group", { name: "Workspace" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Explorer")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();

    const handle = screen.getByRole("separator", {
      name: "Resize panels",
    });

    expect(handle).toHaveAttribute("tabindex", "0");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(handle).toHaveAttribute("aria-valuenow", "50");
    expect(handle).toHaveAttribute("aria-valuemin", "0");
    expect(handle).toHaveAttribute("aria-valuemax", "100");
  });

  it("uses default panel sizes", () => {
    render(
      <ResizablePanels defaultSizes={[30, 70]}>
        <ResizablePanels.Panel data-testid="first">First</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second">
          Second
        </ResizablePanels.Panel>
      </ResizablePanels>,
    );

    expect(screen.getByTestId("first")).toHaveAttribute(
      "data-panel-size",
      "30",
    );

    expect(screen.getByTestId("second")).toHaveAttribute(
      "data-panel-size",
      "70",
    );
  });

  it("normalizes default sizes when they do not total 100", () => {
    render(
      <ResizablePanels defaultSizes={[20, 20]}>
        <ResizablePanels.Panel data-testid="first">First</ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second">
          Second
        </ResizablePanels.Panel>
      </ResizablePanels>,
    );

    expect(screen.getByTestId("first")).toHaveAttribute(
      "data-panel-size",
      "50",
    );

    expect(screen.getByTestId("second")).toHaveAttribute(
      "data-panel-size",
      "50",
    );
  });

  it("connects the separator to both adjacent panels", () => {
    render(
      <ResizablePanels>
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");
    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-controls", `${first.id} ${second.id}`);
  });

  it("supports custom panel IDs", () => {
    render(
      <ResizablePanels>
        <ResizablePanels.Panel id="explorer-panel" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="editor-panel" />
      </ResizablePanels>,
    );

    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-controls",
      "explorer-panel editor-panel",
    );
  });

  it("resizes uncontrolled panels with the keyboard", () => {
    render(
      <ResizablePanels defaultSizes={[50, 50]}>
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(handle).toHaveAttribute("aria-valuenow", "51");

    expect(screen.getByTestId("first")).toHaveAttribute(
      "data-panel-size",
      "51",
    );

    expect(screen.getByTestId("second")).toHaveAttribute(
      "data-panel-size",
      "49",
    );
  });

  it("uses the configured keyboard step", () => {
    render(
      <ResizablePanels defaultSizes={[50, 50]} keyboardStep={2}>
        <ResizablePanels.Panel />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(handle).toHaveAttribute("aria-valuenow", "52");
  });

  it("uses a larger step when Shift is pressed", () => {
    render(
      <ResizablePanels defaultSizes={[50, 50]}>
        <ResizablePanels.Panel />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, {
      key: "ArrowRight",
      shiftKey: true,
    });

    expect(handle).toHaveAttribute("aria-valuenow", "60");
  });

  it("supports Home and End keyboard shortcuts", () => {
    render(
      <ResizablePanels defaultSizes={[50, 50]}>
        <ResizablePanels.Panel minSize={25} maxSize={70} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel minSize={20} maxSize={75} />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, { key: "Home" });

    expect(handle).toHaveAttribute("aria-valuenow", "25");

    fireEvent.keyDown(handle, { key: "End" });

    expect(handle).toHaveAttribute("aria-valuenow", "70");
  });

  it("respects panel constraints during keyboard resizing", () => {
    render(
      <ResizablePanels defaultSizes={[30, 70]}>
        <ResizablePanels.Panel minSize={20} maxSize={40} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel minSize={30} maxSize={80} />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, { key: "End" });

    expect(handle).toHaveAttribute("aria-valuenow", "40");

    fireEvent.keyDown(handle, { key: "Home" });

    expect(handle).toHaveAttribute("aria-valuenow", "20");
  });

  it("supports controlled panel sizes", () => {
    const onSizesChange = vi.fn();

    render(
      <ResizablePanels sizes={[30, 70]} onSizesChange={onSizesChange}>
        <ResizablePanels.Panel data-testid="first" />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel data-testid="second" />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(onSizesChange).toHaveBeenCalledWith([31, 69]);

    // The displayed value remains controlled by the parent.
    expect(handle).toHaveAttribute("aria-valuenow", "30");
  });

  it("supports vertical orientation", () => {
    render(
      <ResizablePanels
        orientation="vertical"
        defaultSizes={[30, 70]}
        keyboardStep={2}
      >
        <ResizablePanels.Panel />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-orientation", "horizontal");

    fireEvent.keyDown(handle, { key: "ArrowDown" });

    expect(handle).toHaveAttribute("aria-valuenow", "32");
  });

  it("supports individual handle labels", () => {
    render(
      <ResizablePanels>
        <ResizablePanels.Panel />
        <ResizablePanels.Handle aria-label="Resize explorer" />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    expect(
      screen.getByRole("separator", {
        name: "Resize explorer",
      }),
    ).toBeInTheDocument();
  });

  it("supports a visible grip", () => {
    const { container } = render(
      <ResizablePanels>
        <ResizablePanels.Panel />
        <ResizablePanels.Handle withGrip />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    expect(
      container.querySelector(".puzzle-resizable-panels__handle-grip"),
    ).toBeInTheDocument();
  });

  it("does not resize when the root is disabled", () => {
    const onSizesChange = vi.fn();

    render(
      <ResizablePanels
        disabled
        defaultSizes={[50, 50]}
        onSizesChange={onSizesChange}
      >
        <ResizablePanels.Panel />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-disabled", "true");
    expect(handle).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(onSizesChange).not.toHaveBeenCalled();
    expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  it("does not resize when an individual handle is disabled", () => {
    render(
      <ResizablePanels defaultSizes={[50, 50]}>
        <ResizablePanels.Panel />
        <ResizablePanels.Handle disabled />
        <ResizablePanels.Panel />
      </ResizablePanels>,
    );

    const handle = screen.getByRole("separator");

    expect(handle).toHaveAttribute("aria-disabled", "true");
    expect(handle).toHaveAttribute("tabindex", "-1");

    fireEvent.keyDown(handle, { key: "ArrowRight" });

    expect(handle).toHaveAttribute("aria-valuenow", "50");
  });

  it("throws when panels and handles are not alternating", () => {
    expect(() =>
      render(
        <ResizablePanels>
          <ResizablePanels.Panel />
          <ResizablePanels.Panel />
        </ResizablePanels>,
      ),
    ).toThrow("ResizablePanels requires alternating Panel and Handle children");
  });

  it("throws when the panel constraints are impossible", () => {
    expect(() =>
      render(
        <ResizablePanels>
          <ResizablePanels.Panel maxSize={40} />
          <ResizablePanels.Handle />
          <ResizablePanels.Panel maxSize={50} />
        </ResizablePanels>,
      ),
    ).toThrow(RangeError);
  });

  it("throws when panel IDs are duplicated", () => {
    expect(() =>
      render(
        <ResizablePanels>
          <ResizablePanels.Panel id="duplicate" />
          <ResizablePanels.Handle />
          <ResizablePanels.Panel id="duplicate" />
        </ResizablePanels>,
      ),
    ).toThrow("ResizablePanels requires unique panel IDs.");
  });

  it("throws when the keyboard step is invalid", () => {
    expect(() =>
      render(
        <ResizablePanels keyboardStep={0}>
          <ResizablePanels.Panel />
          <ResizablePanels.Handle />
          <ResizablePanels.Panel />
        </ResizablePanels>,
      ),
    ).toThrow("keyboardStep must be a positive finite number.");
  });
});
